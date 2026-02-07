import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchUsers } from '@/api/users';

export const usersQueryKey = ['users'] as const;

export function useUsers() {
  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: usersQueryKey,
    queryFn: fetchUsers,
  });

  const usersMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );

  return { users, usersMap, refetchUsers };
}
