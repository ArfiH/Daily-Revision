import prisma from '../config/db';
import { ScheduleStatus } from '../models/ScheduleEntry';

export interface ScheduleEntryInput {
  pdfId: string;
  date: Date;
  fromPage: number;
  toPage: number;
}

export async function createScheduleEntries(entries: ScheduleEntryInput[]) {
  return prisma.scheduleEntry.createMany({
    data: entries,
  });
}


export async function getScheduleEntriesByDateRange(
  fromDate: Date,
  toDate: Date
) {
  return prisma.scheduleEntry.findMany({
    where: {
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      pdf: true,
    },
    orderBy: { date: 'asc' },
  });
}

export async function getTodayScheduleEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.scheduleEntry.findMany({
    where: {
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      pdf: true,
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getOverdueScheduleEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.scheduleEntry.findMany({
    where: {
      date: {
        lt: today,
      },
      status: 'pending',
    },
    include: {
      pdf: true,
    },
    orderBy: { date: 'asc' },
  });
}

export async function updateScheduleEntryStatus(
  id: string,
  status: ScheduleStatus
) {
  return prisma.scheduleEntry.updateMany({
    where: { id },
    data: { status },
  });
}
