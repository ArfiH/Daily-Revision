import { useEffect, useState } from 'react';
import { scheduleApi, TodayScheduleResponse } from '../api/scheduleApi';
import { TodayList } from '../components/dashboard/TodayList';

export function DashboardPage() {
  const [schedule, setSchedule] = useState<TodayScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleApi.getToday();
      setSchedule(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Today's Revision</h1>
        <p className="mt-2 text-gray-600">
          Your scheduled pages for today
        </p>
      </div>

      {schedule && schedule.overdue.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-red-700 mb-4">
            Overdue Items
          </h2>
          <TodayList
            entries={schedule.overdue}
            overdue={true}
            onUpdate={loadSchedule}
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Today's Schedule
        </h2>
        <TodayList
          entries={schedule?.today || []}
          onUpdate={loadSchedule}
        />
      </div>
    </div>
  );
}
