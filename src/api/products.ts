import { api } from '../lib/api-client';
import type { BaseEntity } from './types';

// Types
export interface Product extends BaseEntity {
  sku: string;
  name: string;
}

export interface CreateProductInput {
  sku: string;
  name: string;
}

export interface UpdateProductInput {
  sku?: string;
  name?: string;
}

// API functions
export const fetchProducts = () => api.get<Product[]>('/products');

export const fetchProduct = (id: string) => api.get<Product>(`/products/${id}`);

export const createProduct = (data: CreateProductInput) =>
  api.post<Product>('/products', data);

export const updateProduct = ({
  id,
  data,
}: {
  id: string;
  data: UpdateProductInput;
}) => api.patch<Product>(`/products/${id}`, data);
