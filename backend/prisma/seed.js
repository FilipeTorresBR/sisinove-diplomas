import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const adminEmail = 'admin@sisinove.com.br';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (exists) return;
  const passwordHash = await bcrypt.hash('123456', 10);
  const poles = await prisma.$transaction([
    prisma.pole.create({ data: { name: 'Polo Tucuruí Jardim Marilucy', city: 'Tucuruí', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Novo Repartimento', city: 'Novo Repartimento', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Altamira', city: 'Altamira', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Viseu', city: 'Viseu', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Belém Shopping Castanheira', city: 'Belém', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Pacajá', city: 'Pacajá', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Anapu', city: 'Anapu', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Breves', city: 'Breves', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo São Félix do Xingu', city: 'São Félix do Xingu', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Breu Branco', city: 'Breu Branco', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Redenção', city: 'Redenção', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Tucuruí Cruzeiro', city: 'Tucuruí', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Bragança', city: 'Bragança', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Barcarena', city: 'Barcarena', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Nova Esperança do Piriá', city: 'Nova Esperança do Piriá', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Capanema UNIFAEL', city: 'Capanema', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Cametá', city: 'Cametá', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo São Sebastião da Boa Vista', city: 'São Sebastião da Boa Vista', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Rondon do Pará', city: 'Rondon do Pará', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Castanhal', city: 'Castanhal', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Tucuruí Anhanguera', city: 'Tucuruí', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Parauapebas', city: 'Parauapebas', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Canaã dos Carajás', city: 'Canaã dos Carajás', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Baião', city: 'Baião', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Muaná', city: 'Muaná', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Tucuruí Getat Av. Brasília', city: 'Tucuruí', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Capanema CRUZEIRO DO SUL', city: 'Capanema', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Ourilândia do Norte', city: 'Ourilândia do Norte', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Tucuruí Getat Rua Maranhão', city: 'Tucuruí', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Santarém', city: 'Santarém', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Mocajuba', city: 'Mocajuba', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Conceição do Araguaia', city: 'Conceição do Araguaia', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Goianésia do Pará', city: 'Goianésia do Pará', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Anajás', city: 'Anajás', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Curuá', city: 'Curuá', state: 'PA' } }),
  prisma.pole.create({ data: { name: 'Polo Anhanguera Tucuruí Profissionalizantes', city: 'Tucuruí', state: 'PA' } })
  ]);
  await prisma.user.createMany({ data: [
    { name: 'Administrador Sisinove', email: adminEmail, passwordHash, role: 'admin', city: 'Tucuruí', poleId: poles[0].id },
    { name: 'Secretaria Central', email: 'secretaria@sisinove.com.br', passwordHash, role: 'secretaria', city: 'Tucuruí', poleId: poles[0].id },
  ]});
  await prisma.diploma.createMany({ data: [
    {
      studentName: 'Maria Silva', phone: '(94) 99999-1111', cpf: '12345678900', course: 'Técnico em Enfermagem',
      conclusionDate: new Date('2026-01-20'), sistecRegistration: 'SISTEC-2026-001', diplomaRegistration: 'DIP-2026-0001',
      bookNumber: '10', sheetNumber: '25', registrationDate: new Date('2026-02-15'), trackingCode: 'BR123456789',
      city: 'Tucuruí', poleId: poles[0].id, status: 'enviado', notes: 'Enviado ao polo.'
    },
    {
      studentName: 'João Pereira', phone: '(94) 99999-2222', cpf: '98765432100', course: 'Técnico em Farmácia',
      conclusionDate: new Date('2026-02-10'), sistecRegistration: 'SISTEC-2026-002', diplomaRegistration: 'DIP-2026-0002',
      bookNumber: '10', sheetNumber: '26', registrationDate: new Date('2026-02-20'), trackingCode: '',
      city: 'Breves', poleId: poles[1].id, status: 'registrado', notes: ''
    }
  ]});
}
main().finally(async () => prisma.$disconnect());
