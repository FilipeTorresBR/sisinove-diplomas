import { prisma } from "../config/prisma.js";
export async function listPoles(_, res) {
  const poles = await prisma.pole.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
  });
  res.json(poles);
}
