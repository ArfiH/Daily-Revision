import { Pdf as PrismaPdf } from '@prisma/client';

export type Pdf = PrismaPdf;

export interface CreatePdfInput {
  title: string;
  totalPages: number;
  startPage?: number;
  endPage?: number;
  startDate?: Date;
  targetEndDate: Date;
  priority?: number;
  externalUrl?: string;
}

export interface UpdatePdfInput {
  title?: string;
  totalPages?: number;
  startPage?: number;
  endPage?: number;
  startDate?: Date;
  targetEndDate?: Date;
  priority?: number;
  externalUrl?: string;
}
