import { api } from '../lib/api-client';
import type { SuccessResponse } from './types';

// Types
export enum StockMovementType {
  MARKET_TO_USER = 'market_to_user',
  USER_TO_USER = 'user_to_user',
  USER_TO_MACHINE = 'user_to_machine',
  MACHINE_TO_USER = 'machine_to_user',
  MACHINE_TO_CUSTOMER = 'machine_to_customer',
  USER_TO_WASTE = 'user_to_waste',
  MACHINE_TO_WASTE = 'machine_to_waste',
  NOWHERE_TO_USER = 'nowhere_to_user',
  NOWHERE_TO_MACHINE = 'nowhere_to_machine',
}

export interface CreateStockMovementItem {
  productId: string;
  quantity: number;
}

export interface CreateStockMovementInput {
  fromId?: string;
  toId?: string;
  type: StockMovementType;
  note?: string;
  items: CreateStockMovementItem[];
}

// API functions
export const createStockMovement = (data: CreateStockMovementInput) =>
  api.post<SuccessResponse>('/stock-movements', data);
