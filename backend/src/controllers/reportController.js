import { prisma } from '../config/prisma.js';
export async function getSummary(req, res) {
  const diplomas = await prisma.diploma.findMany({ include: { pole: true } });
  const byPole = {}, byCity = {};
  diplomas.forEach(item => { byPole[item.pole.name] = (byPole[item.pole.name] || 0) + 1; byCity[item.city] = (byCity[item.city] || 0) + 1; });
  res.json({ geral: diplomas.length, porPolo: Object.entries(byPole).map(([name, total]) => ({ name, total })), porCidade: Object.entries(byCity).map(([name, total]) => ({ name, total })) });
}
