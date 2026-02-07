import {
  Card,
  Container,
  DataList,
  Flex,
  Heading,
  Table,
  Text,
} from '@radix-ui/themes';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

import { fetchShiftOperation, ShiftOperationType } from '@/api/shift-operations';
import type { StockMovementItem } from '@/api/stock-movements';
import { StockMovementType } from '@/api/stock-movements';
import { AdminMenu } from '@/components/admin-menu';
import { useMachines } from '@/hooks/use-machines';
import { useProducts } from '@/hooks/use-products';
import { useUsers } from '@/hooks/use-users';

const movementTypeLabel: Record<StockMovementType, string> = {
  [StockMovementType.MARKET_TO_USER]: 'Склад → Пользователь',
  [StockMovementType.USER_TO_USER]: 'Пользователь → Пользователь',
  [StockMovementType.USER_TO_MACHINE]: 'Пользователь → Автомат',
  [StockMovementType.MACHINE_TO_USER]: 'Автомат → Пользователь',
  [StockMovementType.MACHINE_TO_CUSTOMER]: 'Автомат → Клиент',
  [StockMovementType.USER_TO_WASTE]: 'Пользователь → Списание',
  [StockMovementType.MACHINE_TO_WASTE]: 'Автомат → Списание',
  [StockMovementType.NOWHERE_TO_USER]: 'Неизвестно → Пользователь',
  [StockMovementType.NOWHERE_TO_MACHINE]: 'Неизвестно → Автомат',
};

const shiftOperationTypeLabel: Record<ShiftOperationType, string> = {
  [ShiftOperationType.SHIFT_START]: 'Начало смены',
  [ShiftOperationType.SHIFT_END]: 'Конец смены',
};

export const Route = createFileRoute('/admin/shift-operations/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const shiftOperation = await fetchShiftOperation(params.id);
    return { shiftOperation };
  },
});

function RouteComponent() {
  const { shiftOperation } = Route.useLoaderData();
  const { usersMap } = useUsers();
  const { productsMap } = useProducts();
  const { machinesMap } = useMachines();

  const createdByName = useMemo(
    () => usersMap.get(shiftOperation.createdById)?.name,
    [usersMap, shiftOperation],
  );

  const rows = useMemo(
    () =>
      (shiftOperation.stockMovements ?? []).reduce<
        { item: StockMovementItem; type: StockMovementType }[]
      >((acc, mov) => {
        acc.push(
          ...(mov.items ?? []).map((item) => ({ item, type: mov.type })),
        );
        return acc;
      }, []),
    [shiftOperation],
  );

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" gap="2">
          <AdminMenu />
          <Heading size="6">Операция смены</Heading>
        </Flex>

        <Card>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Создано</DataList.Label>
              <DataList.Value>
                <Text>
                  {new Date(shiftOperation.createdAt).toLocaleString()}
                </Text>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Создал</DataList.Label>
              <DataList.Value>{createdByName}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Автомат</DataList.Label>
              <DataList.Value>
                {machinesMap.get(shiftOperation.machineId)?.name ?? '-'}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Тип операции смены</DataList.Label>
              <DataList.Value>
                {shiftOperationTypeLabel[shiftOperation.type]}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Собрано наличными</DataList.Label>
              <DataList.Value>
                {shiftOperation.cashCollected ?? '-'}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>

        {/* Product movements table */}
        <Flex direction="column" gap="3">
          <Heading size="4">Движения товаров</Heading>

          {rows.length === 0 ? (
            <Text color="gray" size="2">
              Движений товаров нет
            </Text>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Товар</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Количество</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Тип перемещения</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map(({ item, type }) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Text weight="medium">
                        {productsMap.get(item.productId)?.name ?? 'Неизвестно'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{item.quantity}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{movementTypeLabel[type]}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
