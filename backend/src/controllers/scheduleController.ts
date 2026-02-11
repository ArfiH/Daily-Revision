import { Request, Response } from 'express';
import {
  getTodayScheduleEntries,
  getOverdueScheduleEntries,
  getScheduleEntriesByDateRange,
  updateScheduleEntryStatus,
} from '../repositories/scheduleRepository';
import { rebuildSchedule } from '../services/schedulerService';
import { getAllPdfs } from '../repositories/pdfRepository';
import { ScheduleStatus } from '../models/ScheduleEntry';

export async function rebuildScheduleHandler(req: Request, res: Response) {
  try {
    const pdfs = await getAllPdfs();
    const entries = await rebuildSchedule(pdfs);
    res.json({ message: 'Schedule rebuilt successfully', count: entries.length });
  } catch (error) {
    console.error('Rebuild schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getTodaySchedule(req: Request, res: Response) {
  try {
    const todayEntries = await getTodayScheduleEntries();
    const overdueEntries = await getOverdueScheduleEntries();
    res.json({ today: todayEntries, overdue: overdueEntries });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getScheduleRange(req: Request, res: Response) {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to query parameters are required' });
    }
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    const entries = await getScheduleEntriesByDateRange(fromDate, toDate);
    res.json(entries);
  } catch (error) {
    console.error('Get schedule range error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateScheduleStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status }: { status: ScheduleStatus } = req.body;
    if (!['pending', 'done', 'skipped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await updateScheduleEntryStatus(id, status);
    res.json({ message: 'Schedule entry updated successfully' });
  } catch (error) {
    console.error('Update schedule status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}