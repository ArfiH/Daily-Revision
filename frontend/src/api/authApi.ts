import { apiClient } from './client';
import { LoginInput, LoginResponse } from '../types';

export const authApi = {
  login: async (input: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', input);
    return response.data;
  },
};
