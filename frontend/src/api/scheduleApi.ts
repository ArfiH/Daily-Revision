import { apiClient } from './client';
import { ScheduleEntry } from '../types';

export interface TodayScheduleResponse {
  today: ScheduleEntry[];
  overdue: ScheduleEntry[];
}

export const scheduleApi = {
  rebuild: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>(
      '/api/schedule/rebuild'
    );
    return response.data;
  },

  getToday: async (): Promise<TodayScheduleResponse> => {
    const response = await apiClient.get<TodayScheduleResponse>(
      '/api/schedule/today'
    );
    return response.data;
  },

  getRange: async (from: string, to: string): Promise<ScheduleEntry[]> => {
    const response = await apiClient.get<ScheduleEntry[]>('/api/schedule/range', {
      params: { from, to },
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: 'pending' | 'done' | 'skipped'
  ): Promise<void> => {
    await apiClient.patch(`/api/schedule/${id}`, { status });
  },
};
