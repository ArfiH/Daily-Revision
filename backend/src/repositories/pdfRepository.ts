import prisma from '../config/db';
import { CreatePdfInput, UpdatePdfInput } from '../models/Pdf';

export async function getAllPdfs() {
  return prisma.pdf.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPdfById(id: string) {
  return prisma.pdf.findFirst({
    where: { id },
  });
}

export async function createPdf(input: CreatePdfInput) {
  return prisma.pdf.create({
    data: {
      title: input.title,
      totalPages: input.totalPages,
      startPage: input.startPage ?? 1,
      endPage: input.endPage ?? input.totalPages,
      startDate: input.startDate ?? new Date(),
      targetEndDate: new Date(input.targetEndDate),
      priority: input.priority ?? 3,
      externalUrl: input.externalUrl,
    },
  });
}

export async function updatePdf(id: string, input: UpdatePdfInput) {
  return prisma.pdf.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.totalPages && { totalPages: input.totalPages }),
      ...(input.startPage && { startPage: input.startPage }),
      ...(input.endPage && { endPage: input.endPage }),
      ...(input.startDate && { startDate: new Date(input.startDate) }),
      ...(input.targetEndDate && { targetEndDate: new Date(input.targetEndDate) }),
      ...(input.priority && { priority: input.priority }),
      ...(input.externalUrl !== undefined && { externalUrl: input.externalUrl }),
    },
  });
}

export async function deletePdf(id: string) {
  return prisma.pdf.delete({
    where: { id },
  });
}