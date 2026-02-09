import prisma from '../config/db';
import { ScheduleStatus } from '../models/ScheduleEntry';

export interface ScheduleEntryInput {
  userId: string;
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

export async function deleteScheduleEntriesByUserId(userId: string) {
  return prisma.scheduleEntry.deleteMany({
    where: { userId },
  });
}

export async function getScheduleEntriesByDateRange(
  userId: string,
  fromDate: Date,
  toDate: Date
) {
  return prisma.scheduleEntry.findMany({
    where: {
      userId,
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

export async function getTodayScheduleEntries(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.scheduleEntry.findMany({
    where: {
      userId,
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

export async function getOverdueScheduleEntries(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.scheduleEntry.findMany({
    where: {
      userId,
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
  userId: string,
  status: ScheduleStatus
) {
  return prisma.scheduleEntry.updateMany({
    where: { id, userId },
    data: { status },
  });
}
