import prisma from '../config/db';
import { CreatePdfInput, UpdatePdfInput } from '../models/Pdf';

export async function createPdf(userId: string, input: CreatePdfInput) {
  const endPage = input.endPage ?? input.totalPages;
  const startPage = input.startPage ?? 1;
  const startDate = input.startDate ?? new Date();
  const priority = input.priority ?? 3;

  return prisma.pdf.create({
    data: {
      userId,
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

export async function getPdfsByUserId(userId: string) {
  return prisma.pdf.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPdfById(id: string, userId: string) {
  return prisma.pdf.findFirst({
    where: { id, userId },
  });
}

export async function updatePdf(id: string, userId: string, input: UpdatePdfInput) {
  return prisma.pdf.updateMany({
    where: { id, userId },
    data: input,
  });
}

export async function deletePdf(id: string, userId: string) {
  return prisma.pdf.deleteMany({
    where: { id, userId },
  });
}
