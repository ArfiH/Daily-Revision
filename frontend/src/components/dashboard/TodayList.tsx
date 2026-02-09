import { ScheduleEntry } from '../../types';
import { scheduleApi } from '../../api/scheduleApi';

interface TodayListProps {
  entries: ScheduleEntry[];
  overdue?: boolean;
  onUpdate: () => void;
}

export function TodayList({ entries, overdue, onUpdate }: TodayListProps) {
  const handleStatusChange = async (id: string, status: 'done' | 'skipped') => {
    try {
      await scheduleApi.updateStatus(id, status);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {overdue ? 'No overdue items' : 'No items scheduled for today'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`bg-white rounded-lg shadow p-4 border-l-4 ${
            overdue ? 'border-red-500' : 'border-blue-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {entry.pdf?.title || 'Unknown PDF'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Pages {entry.fromPage} - {entry.toPage}
                {entry.pdf && ` (Total: ${entry.pdf.totalPages} pages)`}
              </p>
              {entry.pdf?.externalUrl && (
                <a
                  href={entry.pdf.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                >
                  Open PDF →
                </a>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleStatusChange(entry.id, 'done')}
                disabled={entry.status === 'done'}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  entry.status === 'done'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800'
                }`}
              >
                ✓ Done
              </button>
              <button
                onClick={() => handleStatusChange(entry.id, 'skipped')}
                disabled={entry.status === 'skipped'}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  entry.status === 'skipped'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                }`}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
