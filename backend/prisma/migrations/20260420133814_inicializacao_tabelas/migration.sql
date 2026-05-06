-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'secretaria', 'polo');

-- CreateEnum
CREATE TYPE "DiplomaStatus" AS ENUM ('registrado', 'enviado', 'entregue', 'confeccao');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'secretaria',
    "city" TEXT,
    "poleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diploma" (
    "id" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "conclusionDate" TIMESTAMP(3) NOT NULL,
    "sistecRegistration" TEXT NOT NULL,
    "diplomaRegistration" TEXT NOT NULL,
    "bookNumber" TEXT NOT NULL,
    "sheetNumber" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "trackingCode" TEXT,
    "status" "DiplomaStatus" NOT NULL DEFAULT 'registrado',
    "notes" TEXT,
    "city" TEXT NOT NULL,
    "poleId" INTEGER NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Diploma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "diplomaId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pole_name_city_key" ON "Pole" ("name", "city");

-- CreateIndex
CREATE INDEX "Diploma_cpf_idx" ON "Diploma" ("cpf");

-- CreateIndex
CREATE INDEX "Diploma_course_idx" ON "Diploma" ("course");

-- CreateIndex
CREATE INDEX "Diploma_city_idx" ON "Diploma" ("city");

-- CreateIndex
CREATE INDEX "Diploma_poleId_idx" ON "Diploma" ("poleId");

-- AddForeignKey
ALTER TABLE "User"
ADD CONSTRAINT "User_poleId_fkey" FOREIGN KEY ("poleId") REFERENCES "Pole" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diploma"
ADD CONSTRAINT "Diploma_poleId_fkey" FOREIGN KEY ("poleId") REFERENCES "Pole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment"
ADD CONSTRAINT "Attachment_diplomaId_fkey" FOREIGN KEY ("diplomaId") REFERENCES "Diploma" ("id") ON DELETE CASCADE ON UPDATE CASCADE;