import { redirect } from '@tanstack/react-router';

import { authClient } from './auth-client';

/**
 * Check if user is authenticated and has the required role
 * @param requiredRole - The role required to access the route ("admin" or "user")
 */
async function requireRole(requiredRole: string) {
  const session = await authClient.getSession();

  // Check if user is authenticated
  if (!session.data) {
    throw redirect({
      to: '/login',
    });
  }

  // Check if user has the required role
  if (session.data.user.role !== requiredRole) {
    throw redirect({
      to: '/',
    });
  }
}

/**
 * Check if user is an admin
 */
export async function requireAdmin() {
  return requireRole('admin');
}

/**
 * Check if user is an expeditor
 */
export async function requireExpeditor() {
  return requireRole('user');
}
