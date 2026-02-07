import { api } from '@/lib/api-client';

import type { StockMovement } from './stock-movements';
import type { SuccessResponse, BaseEntity } from './types';

// Enums
export enum ShiftOperationType {
  SHIFT_START = 'shift_start',
  SHIFT_END = 'shift_end',
}

// Types
export interface CreateShiftOperationInput {
  machineId: string;
  note?: string;
  type: ShiftOperationType;
  cashCollected?: number;
  snapshot: {
    productId: string;
    quantity: number;
  }[];
}

export interface ShiftOperation extends BaseEntity {
  type: ShiftOperationType;
  createdById: string;
  machineId: string;
  note: string | null;
  cashCollected: number | null;
  stockMovements?: StockMovement[];
}

// API functions
export const fetchShiftOperations = (machineId: string) =>
  api.get<ShiftOperation[]>(
    `/shift-operations?machineId=${encodeURIComponent(machineId)}`,
  );

export const fetchShiftOperation = (id: string) =>
  api.get<ShiftOperation>(`/shift-operations/${id}`);

export const createShiftOperation = (data: CreateShiftOperationInput) =>
  api.post<SuccessResponse>('/shift-operations', data);
