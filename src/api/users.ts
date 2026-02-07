import { api } from '@/lib/api-client';

import type { BaseEntity } from './types';

// Types
export type UserRole = 'admin' | 'user';

export interface User extends BaseEntity {
  name: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  image: string | null;
}

export interface UserStockItem {
  productId: string;
  quantity: number;
}

export interface UserStock {
  stock: UserStockItem[];
}

export interface CreateUserInput {
  name: string;
  phoneNumber: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  phoneNumber?: string;
  role?: UserRole;
}

// API functions
export const fetchUsers = () => api.get<User[]>('/users');

export const fetchUser = (id: string) => api.get<User>(`/users/${id}`);

export const createUser = (data: CreateUserInput) =>
  api.post<User>('/users', data);

export const updateUser = ({
  id,
  data,
}: {
  id: string;
  data: UpdateUserInput;
}) => api.patch<User>(`/users/${id}`, data);

export const fetchUserStock = (id: string) =>
  api.get<UserStock>(`/users/${id}/stock`);
