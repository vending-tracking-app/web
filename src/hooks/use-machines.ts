import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchMachines } from '@/api/machines';

export const machinesQueryKey = ['machines'] as const;

export function useMachines() {
  const { data: machines = [], refetch: refetchMachines } = useQuery({
    queryKey: machinesQueryKey,
    queryFn: fetchMachines,
  });

  const machinesMap = useMemo(
    () => new Map(machines.map((machine) => [machine.id, machine])),
    [machines],
  );

  return { machines, machinesMap, refetchMachines };
}
