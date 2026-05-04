import path from "path";
import { prisma } from "../config/prisma.js";
import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";
function scopedWhere(req) {
  const where = {};
  if (req.user.role === "polo" && req.user.poleId)
    where.poleId = req.user.poleId;
  if (req.query.poleId) where.poleId = Number(req.query.poleId);
  if (req.query.city) where.city = req.query.city;
  if (req.query.course)
    where.course = { contains: req.query.course, mode: "insensitive" };
  if (req.query.status) where.status = req.query.status;
  if (req.query.search)
    where.OR = [
      { studentName: { contains: req.query.search, mode: "insensitive" } },
      { cpf: { contains: req.query.search, mode: "insensitive" } },
      { course: { contains: req.query.search, mode: "insensitive" } },
      {
        diplomaRegistration: {
          contains: req.query.search,
          mode: "insensitive",
        },
      },
    ];
  return where;
}
export async function listDiplomas(req, res) {
  const diplomas = await prisma.diploma.findMany({
    where: scopedWhere(req),
    include: { pole: true, attachments: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(diplomas);
}
export async function createDiploma(req, res) {
  const d = req.body;
  const record = await prisma.diploma.create({
    data: {
      studentName: d.studentName,
      phone: d.phone,
      cpf: String(d.cpf).replace(/\D/g, ""),
      course: d.course,
      conclusionDate: new Date(d.conclusionDate),
      sistecRegistration: d.sistecRegistration,
      diplomaRegistration: d.diplomaRegistration,
      bookNumber: d.bookNumber,
      sheetNumber: d.sheetNumber,
      registrationDate: new Date(d.registrationDate),
      trackingCode: d.trackingCode || "",
      status: d.status || "registrado",
      notes: d.notes || "",
      city: d.city,
      poleId: Number(d.poleId),
      createdBy: req.user.name,
    },
  });
  res.status(201).json(record);
}
export async function updateDiploma(req, res) {
  const d = req.body;
  const id = Number(req.params.id);
  const record = await prisma.diploma.update({
    where: { id },
    data: {
      studentName: d.studentName,
      phone: d.phone,
      cpf: String(d.cpf).replace(/\D/g, ""),
      course: d.course,
      conclusionDate: new Date(d.conclusionDate),
      sistecRegistration: d.sistecRegistration,
      diplomaRegistration: d.diplomaRegistration,
      bookNumber: d.bookNumber,
      sheetNumber: d.sheetNumber,
      registrationDate: new Date(d.registrationDate),
      trackingCode: d.trackingCode || "",
      status: d.status,
      notes: d.notes || "",
      city: d.city,
      poleId: Number(d.poleId),
    },
  });
  res.json(record);
}
export async function deleteDiploma(req, res) {
  const id = Number(req.params.id);
  await prisma.attachment.deleteMany({ where: { diplomaId: id } });
  await prisma.diploma.delete({ where: { id } });
  res.json({ message: "Diploma excluído com sucesso." });
}
export async function uploadAttachments(req, res) {
  const id = Number(req.params.id);
  const files = req.files || [];
  const data = files.map((file) => ({
    diplomaId: id,
    fileName: file.originalname,
    filePath: `/uploads/${path.basename(file.path)}`,
    mimeType: file.mimetype,
  }));
  const created = await prisma.attachment.createMany({ data });
  res
    .status(201)
    .json({ message: "Anexos enviados com sucesso.", count: created.count });
}
export async function downloadProof(req, res) {
  const id = Number(req.params.id);
  const diploma = await prisma.diploma.findUnique({
    where: { id },
    include: { pole: true },
  });
  if (!diploma)
    return res.status(404).json({ message: "Diploma não encontrado." });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=comprovante-diploma-${id}.pdf`,
  );
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);
  doc.fontSize(18).text("Sisinove Diplomas — Comprovante de Registro de Diploma", {
    align: "center",
  });
  doc.moveDown();
  doc.fontSize(11);
  [
    ["Aluno", diploma.studentName],
    ["Telefone", diploma.phone],
    ["CPF", diploma.cpf],
    ["Curso", diploma.course],
    ["Data de conclusão", diploma.conclusionDate.toLocaleDateString("pt-BR")],
    ["Registro SISTEC", diploma.sistecRegistration],
    ["Registro do diploma", diploma.diplomaRegistration],
    ["Livro", diploma.bookNumber],
    ["Folha", diploma.sheetNumber],
    ["Data do registro", diploma.registrationDate.toLocaleDateString("pt-BR")],
    ["Código de rastreio", diploma.trackingCode || "-"],
    ["Polo", diploma.pole.name],
    ["Cidade", diploma.city],
    ["Status", diploma.status],
  ].forEach(([label, value]) => doc.text(`${label}: ${value}`));
  doc.moveDown();
  doc.text("Emitido automaticamente pelo Sisinove Diplomas.");
  doc.end();
}
export async function exportCsv(req, res) {
  const diplomas = await prisma.diploma.findMany({
    where: scopedWhere(req),
    include: { pole: true },
    orderBy: { createdAt: "desc" },
  });
  const csv = stringify(
    diplomas.map((d) => ({
      aluno: d.studentName,
      telefone: d.phone,
      cpf: d.cpf,
      curso: d.course,
      dataConclusao: d.conclusionDate.toISOString().slice(0, 10),
      sistec: d.sistecRegistration,
      registroDiploma: d.diplomaRegistration,
      livro: d.bookNumber,
      folha: d.sheetNumber,
      dataRegistro: d.registrationDate.toISOString().slice(0, 10),
      rastreio: d.trackingCode,
      polo: d.pole.name,
      cidade: d.city,
      status: d.status,
    })),
    { header: true },
  );
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=relatorio-diplomas.csv",
  );
  res.send(csv);
}
export async function exportPdf(req, res) {
  const diplomas = await prisma.diploma.findMany({
    where: scopedWhere(req),
    include: { pole: true },
    orderBy: { createdAt: "desc" },
  });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "inline; filename=relatorio-diplomas.pdf",
  );
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);
  doc.fontSize(18).text("Relatório de Diplomas Emitidos", { align: "center" });
  doc.moveDown();
  doc.fontSize(10);
  diplomas.forEach((d, i) => {
    doc.text(
      `${i + 1}. ${d.studentName} | CPF: ${d.cpf} | Curso: ${d.course} | Polo: ${d.pole.name} | Cidade: ${d.city} | Registro: ${d.diplomaRegistration} | Status: ${d.status}`,
    );
    doc.moveDown(0.5);
  });
  doc.moveDown();
  doc.text(`Total de registros: ${diplomas.length}`);
  doc.end();
}
