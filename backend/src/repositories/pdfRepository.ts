import prisma from '../config/db';
import { CreatePdfInput, UpdatePdfInput } from '../models/Pdf';

export async function createPdf( input: CreatePdfInput) {
  const endPage = input.endPage ?? input.totalPages;
  const startPage = input.startPage ?? 1;
  const startDate = input.startDate ?? new Date();
  const priority = input.priority ?? 3;

  return prisma.pdf.create({
    data: {
      title: input.title,
      totalPages: input.totalPages,
      startPage,
      endPage,
      startDate,
      targetEndDate: input.targetEndDate,
      priority,
      externalUrl: input.externalUrl,
    },
  });
}

export async function getAllPdfs() {
  return prisma.pdf.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPdfById(id: string,) {
  return prisma.pdf.findFirst({
    where: { id },
  });
}

export async function updatePdf(id: string, input: UpdatePdfInput) {
  return prisma.pdf.updateMany({
    where: { id },
    data: input,
  });
}

export async function deletePdf(id: string) {
  return prisma.pdf.deleteMany({
    where: { id },
  });
}
