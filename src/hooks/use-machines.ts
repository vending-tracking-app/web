import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchMachines, fetchMachineSales } from '@/api/machines';

export const machinesQueryKey = ['machines'] as const;
export const machineSalesQueryKey = (
  machineId?: string,
  from?: string,
  to?: string,
  productId?: string,
) => ['machineSales', machineId, from, to, productId] as const;

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

export function useMachineSales(params: {
  machineId?: string;
  from?: string;
  to?: string;
  productId?: string;
}) {
  const { machineId, from, to, productId } = params;

  return useQuery({
    queryKey: machineSalesQueryKey(machineId, from, to, productId),
    queryFn: () =>
      fetchMachineSales({
        id: machineId ?? '',
        from,
        to,
        productId,
      }),
    enabled: Boolean(machineId),
  });
}
