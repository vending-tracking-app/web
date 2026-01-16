import { api } from "../lib/api-client";
import type { SuccessResponse, BaseEntity } from "./types";

// Enums
export enum ShiftOperationType {
  SHIFT_START = "shift_start",
  SHIFT_END = "shift_end",
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
  machineId: string;
  note: string | null;
  cashCollected: number | null;
}

// API functions
export const createShiftOperation = (data: CreateShiftOperationInput) =>
  api.post<SuccessResponse>("/shift-operations", data);
