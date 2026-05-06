import { prisma } from "../config/prisma.js";
export async function getDashboard(req, res) {
  const where = {};
  if (req.query.poleId) where.poleId = Number(req.query.poleId);
  if (req.query.city) where.city = req.query.city;
  if (req.user.role === "polo" && req.user.poleId)
    where.poleId = req.user.poleId;
  const totalDiplomas = await prisma.diploma.count({ where });
  const totalSent = await prisma.diploma.count({
    where: { ...where, status: "enviado" },
  });
  const totalDelivered = await prisma.diploma.count({
    where: { ...where, status: "entregue" },
  });
  const totalPending = await prisma.diploma.count({
    where: { ...where, status: "confeccao" },
  });
  const totalRegistered = await prisma.diploma.count({
    where: { ...where, status: "registrado" },
  });
  const byPole = await prisma.pole.findMany({
    include: { _count: { select: { diplomas: true } } },
    orderBy: { city: "asc" },
  });
  const diplomas = await prisma.diploma.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  const byCourseMap = {},
    byStatusMap = { registrado: 0, enviado: 0, entregue: 0, confeccao: 0 },
    byCityMap = {};
  diplomas.forEach((item) => {
    byCourseMap[item.course] = (byCourseMap[item.course] || 0) + 1;
    byStatusMap[item.status] = (byStatusMap[item.status] || 0) + 1;
    byCityMap[item.city] = (byCityMap[item.city] || 0) + 1;
  });
  res.json({
    cards: {
      totalDiplomas,
      totalSent,
      totalDelivered,
      totalPending,
      totalRegistered,
    },
    byPole: byPole.map((p) => ({
      name: p.name,
      city: p.city,
      total: p._count.diplomas,
    })),
    byCourse: Object.entries(byCourseMap).map(([name, total]) => ({
      name,
      total,
    })),
    byStatus: Object.entries(byStatusMap).map(([name, total]) => ({
      name,
      total,
    })),
    byCity: Object.entries(byCityMap).map(([name, total]) => ({ name, total })),
  });
}
