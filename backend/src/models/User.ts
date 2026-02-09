import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
