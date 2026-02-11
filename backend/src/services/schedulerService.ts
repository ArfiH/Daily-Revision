import { Pdf } from '../models/Pdf';
import {
  createScheduleEntries,
  ScheduleEntryInput,
} from '../repositories/scheduleRepository';

export async function rebuildSchedule(pdfs: Pdf[]) {
  
  const entries: ScheduleEntryInput[] = [];

  for (const pdf of pdfs) {
    const pdfEntries = generateScheduleForPdf(pdf);
    entries.push(...pdfEntries);
  }

  // Merge and normalize entries (combine entries from all PDFs per day)
  const normalizedEntries = mergeAndNormalizeSchedules(entries);

  // Create all schedule entries
  await createScheduleEntries(normalizedEntries);

  return normalizedEntries;
}

function generateScheduleForPdf(
  pdf: Pdf
): ScheduleEntryInput[] {
  const entries: ScheduleEntryInput[] = [];

  const startDate = new Date(pdf.startDate);
  startDate.setHours(0, 0, 0, 0);

  const targetEndDate = new Date(pdf.targetEndDate);
  targetEndDate.setHours(23, 59, 59, 999);

  const daysDiff = Math.max(
    1,
    Math.ceil((targetEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const totalPagesToCover = pdf.endPage - pdf.startPage + 1;
  const pagesPerDay = Math.ceil(totalPagesToCover / daysDiff);

  let currentPage = pdf.startPage;
  let currentDate = new Date(startDate);

  while (currentPage <= pdf.endPage && currentDate <= targetEndDate) {
    const toPage = Math.min(currentPage + pagesPerDay - 1, pdf.endPage);

    entries.push({
      pdfId: pdf.id,
      date: new Date(currentDate),
      fromPage: currentPage,
      toPage,
    });

    currentPage = toPage + 1;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return entries;
}

function mergeAndNormalizeSchedules(
  entries: ScheduleEntryInput[]
): ScheduleEntryInput[] {
  // Group entries by date
  const entriesByDate = new Map<string, ScheduleEntryInput[]>();

  for (const entry of entries) {
    const dateKey = entry.date.toISOString().split('T')[0];
    if (!entriesByDate.has(dateKey)) {
      entriesByDate.set(dateKey, []);
    }
    entriesByDate.get(dateKey)!.push(entry);
  }

  // Check for days exceeding max pages threshold (e.g., 40 pages)
  const MAX_PAGES_PER_DAY = 40;
  const normalized: ScheduleEntryInput[] = [];

  const sortedDates = Array.from(entriesByDate.keys()).sort();

  for (const dateKey of sortedDates) {
    const dayEntries = entriesByDate.get(dateKey)!;
    let totalPages = dayEntries.reduce(
      (sum, e) => sum + (e.toPage - e.fromPage + 1),
      0
    );

    if (totalPages <= MAX_PAGES_PER_DAY) {
      normalized.push(...dayEntries);
    } else {
      // Distribute excess pages to subsequent days
      const excessPages = totalPages - MAX_PAGES_PER_DAY;
      let pagesDistributed = 0;

      for (const entry of dayEntries) {
        const entryPages = entry.toPage - entry.fromPage + 1;
        const pagesToKeep = Math.max(
          1,
          Math.floor((entryPages / totalPages) * MAX_PAGES_PER_DAY)
        );

        if (pagesToKeep < entryPages) {
          // Split this entry
          normalized.push({
            ...entry,
            toPage: entry.fromPage + pagesToKeep - 1,
          });

          // Push remaining pages to next day
          const nextDate = new Date(entry.date);
          nextDate.setDate(nextDate.getDate() + 1);
          normalized.push({
            ...entry,
            date: nextDate,
            fromPage: entry.fromPage + pagesToKeep,
          });
        } else {
          normalized.push(entry);
        }
      }
    }
  }

  return normalized;
}
