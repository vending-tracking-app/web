import { api } from '../lib/api-client';
import type { BaseEntity } from './types';

// Types
export interface Machine extends BaseEntity {
  name: string;
  location: string;
}

export interface MachineStockItem {
  productId: string;
  quantity: number;
}

export interface MachineStock {
  stock: MachineStockItem[];
}

export interface CreateMachineInput {
  name: string;
  location: string;
}

export interface UpdateMachineInput {
  name?: string;
  location?: string;
}

// API functions
export const fetchMachines = () => api.get<Machine[]>('/machines');

export const fetchMachine = (id: string) => api.get<Machine>(`/machines/${id}`);

export const createMachine = (data: CreateMachineInput) =>
  api.post<Machine>('/machines', data);

export const updateMachine = ({
  id,
  data,
}: {
  id: string;
  data: UpdateMachineInput;
}) => api.patch<Machine>(`/machines/${id}`, data);

export const fetchMachineStock = (id: string) =>
  api.get<MachineStock>(`/machines/${id}/stock`);
