export type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Pdf = {
  id: string;
  userId: string;
  title: string;
  totalPages: number;
  startPage: number;
  endPage: number;
  startDate: string;
  targetEndDate: string;
  priority: number;
  externalUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleEntry = {
  id: string;
  userId: string;
  pdfId: string;
  date: string;
  fromPage: number;
  toPage: number;
  status: 'pending' | 'done' | 'skipped';
  createdAt: string;
  updatedAt: string;
  pdf?: Pdf;
};

export interface CreatePdfInput {
  title: string;
  totalPages: number;
  startPage?: number;
  endPage?: number;
  startDate?: string;
  targetEndDate: string;
  priority?: number;
  externalUrl?: string;
}

export interface UpdatePdfInput {
  title?: string;
  totalPages?: number;
  startPage?: number;
  endPage?: number;
  startDate?: string;
  targetEndDate?: string;
  priority?: number;
  externalUrl?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
