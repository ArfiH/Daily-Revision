import { apiClient } from './client';
import { Pdf, CreatePdfInput, UpdatePdfInput } from '../types';

export const pdfApi = {
  list: async (): Promise<Pdf[]> => {
    const response = await apiClient.get<Pdf[]>('/api/pdfs');
    return response.data;
  },

  create: async (input: CreatePdfInput): Promise<Pdf> => {
    const response = await apiClient.post<Pdf>('/api/pdfs', input);
    return response.data;
  },

  update: async (id: string, input: UpdatePdfInput): Promise<Pdf> => {
    const response = await apiClient.put<Pdf>(`/api/pdfs/${id}`, input);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/pdfs/${id}`);
  },
};
