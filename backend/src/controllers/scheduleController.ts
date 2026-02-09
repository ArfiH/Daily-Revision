import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  getTodayScheduleEntries,
  getOverdueScheduleEntries,
  getScheduleEntriesByDateRange,
  updateScheduleEntryStatus,
} from '../repositories/scheduleRepository';
import { rebuildSchedule } from '../services/schedulerService';
import { getPdfsByUserId } from '../repositories/pdfRepository';
import { ScheduleStatus } from '../models/ScheduleEntry';

export async function rebuildScheduleHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const pdfs = await getPdfsByUserId(userId);
    const entries = await rebuildSchedule(userId, pdfs);
    res.json({ message: 'Schedule rebuilt successfully', count: entries.length });
  } catch (error) {
    console.error('Rebuild schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getTodaySchedule(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const todayEntries = await getTodayScheduleEntries(userId);
    const overdueEntries = await getOverdueScheduleEntries(userId);

    res.json({
      today: todayEntries,
      overdue: overdueEntries,
    });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getScheduleRange(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to query parameters are required' });
    }

    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const entries = await getScheduleEntriesByDateRange(userId, fromDate, toDate);
    res.json(entries);
  } catch (error) {
    console.error('Get schedule range error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateScheduleStatus(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { status }: { status: ScheduleStatus } = req.body;

    if (!['pending', 'done', 'skipped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await updateScheduleEntryStatus(id, userId, status);
    res.json({ message: 'Schedule entry updated successfully' });
  } catch (error) {
    console.error('Update schedule status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
