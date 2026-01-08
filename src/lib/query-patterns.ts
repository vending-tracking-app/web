/**
 * TanStack Query Patterns & Examples
 *
 * This file contains common patterns and examples for using TanStack Query
 * in this application. Use these as reference when implementing new features.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

// ============================================================================
// PATTERN 1: Simple GET Request with useQuery
// ============================================================================

interface User {
  id: string;
  email: string;
  name: string;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"], // Unique identifier for this query
    queryFn: () => api.get<User[]>("/users"), // Function that fetches the data
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    // Optional: Add error handling
    retry: 3, // Retry failed requests 3 times
  });
}

// Usage in component:
// const { data, isLoading, isError, error } = useUsers();

// ============================================================================
// PATTERN 2: GET Request with Parameters
// ============================================================================

interface Machine {
  id: string;
  location: string;
}

export function useMachine(machineId: string) {
  return useQuery({
    queryKey: ["machines", machineId], // Include params in the key
    queryFn: () => api.get<Machine>(`/machines/${machineId}`),
    enabled: !!machineId, // Only run query if machineId exists
  });
}

// Usage:
// const { data: machine } = useMachine("123");

// ============================================================================
// PATTERN 3: POST/CREATE Mutation with Optimistic Updates
// ============================================================================

interface CreateUserInput {
  email: string;
  name: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => api.post<User>("/users", data),
    onSuccess: () => {
      // Refetch users list after successful creation
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      // You can also show a toast notification here
    },
  });
}

// Usage in component:
// const createUser = useCreateUser();
// createUser.mutate({ email: "test@example.com", name: "Test" });

// ============================================================================
// PATTERN 4: PATCH/UPDATE Mutation
// ============================================================================

interface UpdateUserInput {
  name?: string;
  email?: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      api.patch<User>(`/users/${id}`, data),
    onSuccess: (updatedUser) => {
      // Update the cache for this specific user
      queryClient.setQueryData(["users", updatedUser.id], updatedUser);
      // Also invalidate the users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Usage:
// const updateUser = useUpdateUser();
// updateUser.mutate({ id: "123", data: { name: "New Name" } });

// ============================================================================
// PATTERN 5: DELETE Mutation
// ============================================================================

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      // Refetch users list after deletion
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

// Usage:
// const deleteUser = useDeleteUser();
// deleteUser.mutate("123");

// ============================================================================
// PATTERN 6: Dependent Queries (fetch Y after X completes)
// ============================================================================

export function useUserWithProfile(userId: string) {
  // First query: get user
  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => api.get<User>(`/users/${userId}`),
  });

  // Second query: get user's profile (only runs if user exists)
  const profileQuery = useQuery({
    queryKey: ["profiles", userId],
    queryFn: () => api.get(`/profiles/${userId}`),
    enabled: !!userQuery.data, // Only run if user data is available
  });

  return {
    user: userQuery.data,
    profile: profileQuery.data,
    isLoading: userQuery.isLoading || profileQuery.isLoading,
  };
}

// ============================================================================
// PATTERN 7: Pagination
// ============================================================================

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export function usePaginatedUsers(page: number, limit: number = 10) {
  return useQuery({
    queryKey: ["users", "paginated", page, limit],
    queryFn: () =>
      api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  });
}

// Usage:
// const [page, setPage] = useState(1);
// const { data, isLoading } = usePaginatedUsers(page);

// ============================================================================
// PATTERN 8: Infinite Scroll / Load More
// ============================================================================

import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteUsers() {
  return useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      api.get<PaginatedResponse<User>>(`/users?page=${pageParam}`),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

// Usage:
// const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteUsers();
// <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
//   {isFetchingNextPage ? 'Loading...' : 'Load More'}
// </button>

// ============================================================================
// PATTERN 9: Refetch on Interval (Polling)
// ============================================================================

export function useRealtimeMachineStatus(machineId: string) {
  return useQuery({
    queryKey: ["machines", machineId, "status"],
    queryFn: () => api.get(`/machines/${machineId}/status`),
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
  });
}

// ============================================================================
// PATTERN 10: Optimistic Updates (Update UI before server confirms)
// ============================================================================

export function useOptimisticUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      api.patch<User>(`/users/${id}`, data),
    // Optimistically update the cache before the request completes
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users", id] });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(["users", id]);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<User>(["users", id], {
          ...previousUser,
          ...data,
        });
      }

      // Return context with the previous value
      return { previousUser };
    },
    // If mutation fails, rollback to the previous value
    onError: (err, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["users", variables.id], context.previousUser);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
}

// ============================================================================
// TIPS & BEST PRACTICES
// ============================================================================

/**
 * 1. Query Keys:
 *    - Use arrays: ["resource", id, "subresource"]
 *    - Be consistent across your app
 *    - Include all variables that affect the data
 *
 * 2. Invalidation:
 *    - Use queryClient.invalidateQueries() after mutations
 *    - Be specific with query keys to avoid over-fetching
 *
 * 3. Error Handling:
 *    - Always handle isError states in components
 *    - Consider using error boundaries for critical errors
 *
 * 4. Loading States:
 *    - Use isLoading for initial loads
 *    - Use isFetching for background updates
 *    - Use isPending for mutations
 *
 * 5. Stale Time vs Cache Time:
 *    - staleTime: How long data is considered fresh
 *    - cacheTime: How long unused data stays in cache (default: 5 minutes)
 *
 * 6. Authentication:
 *    - credentials: "include" is automatically handled by api-client.ts
 *    - Better Auth cookies are sent automatically
 */
