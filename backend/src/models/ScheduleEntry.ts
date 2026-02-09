import { ScheduleEntry as PrismaScheduleEntry } from '@prisma/client';

export type ScheduleEntry = PrismaScheduleEntry;

export type ScheduleStatus = 'pending' | 'done' | 'skipped';

export interface UpdateScheduleStatusInput {
  status: ScheduleStatus;
}
