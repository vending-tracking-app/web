// Common API response types
export interface SuccessResponse {
  success: true;
}

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
