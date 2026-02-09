import { useEffect, useState } from 'react';
import { scheduleApi } from '../api/scheduleApi';
import { ScheduleEntry } from '../types';

export function ScheduleOverviewPage() {
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const twoWeeksLater = new Date(today);
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

        const from = today.toISOString().split('T')[0];
        const to = twoWeeksLater.toISOString().split('T')[0];

        const data = await scheduleApi.getRange(from, to);
        setEntries(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const dateKey = entry.date.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, ScheduleEntry[]>);

  const sortedDates = Object.keys(entriesByDate).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Schedule Overview</h1>
        <p className="mt-2 text-gray-600">Upcoming revision schedule for the next 14 days</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No schedule entries found. Add PDFs and rebuild the schedule to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const dayEntries = entriesByDate[dateKey];
            const date = new Date(dateKey);
            const isToday = dateKey === new Date().toISOString().split('T')[0];
            const totalPages = dayEntries.reduce(
              (sum, e) => sum + (e.toPage - e.fromPage + 1),
              0
            );

            return (
              <div
                key={dateKey}
                className={`bg-white rounded-lg shadow p-6 ${
                  isToday ? 'border-2 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {isToday && (
                      <span className="ml-2 text-sm text-blue-600 font-normal">(Today)</span>
                    )}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {totalPages} pages total
                  </span>
                </div>
                <div className="space-y-2">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {entry.pdf?.title || 'Unknown PDF'}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">
                          Pages {entry.fromPage}-{entry.toPage}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          entry.status === 'done'
                            ? 'bg-green-100 text-green-800'
                            : entry.status === 'skipped'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
