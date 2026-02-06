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

import { fetchProducts } from '@/api/products';
import { fetchShiftOperation } from '@/api/shift-operations';
import type { StockMovementItem } from '@/api/stock-movements';
import { StockMovementType } from '@/api/stock-movements';
import { fetchUsers } from '@/api/users';
import { AdminMenu } from '@/components/admin-menu';
import { fetchMachines } from '@/api/machines';

const movementTypeLabel: Record<StockMovementType, string> = {
  [StockMovementType.MARKET_TO_USER]: 'Market → User',
  [StockMovementType.USER_TO_USER]: 'User → User',
  [StockMovementType.USER_TO_MACHINE]: 'User → Machine',
  [StockMovementType.MACHINE_TO_USER]: 'Machine → User',
  [StockMovementType.MACHINE_TO_CUSTOMER]: 'Machine → Customer',
  [StockMovementType.USER_TO_WASTE]: 'User → Waste',
  [StockMovementType.MACHINE_TO_WASTE]: 'Machine → Waste',
  [StockMovementType.NOWHERE_TO_USER]: 'Nowhere → User',
  [StockMovementType.NOWHERE_TO_MACHINE]: 'Nowhere → Machine',
};

export const Route = createFileRoute('/admin/shift-operations/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [shiftOperation, products, users, machines] = await Promise.all([
      fetchShiftOperation(params.id),
      fetchProducts(),
      fetchUsers(),
      fetchMachines(),
    ]);
    return { shiftOperation, products, users, machines };
  },
});

function RouteComponent() {
  const { shiftOperation, products, users, machines } = Route.useLoaderData();

  const createdByName = useMemo(
    () => users.find((u) => u.id === shiftOperation.createdById)?.name,
    [users, shiftOperation],
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

  const productsById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" gap="2">
          <AdminMenu />
          <Heading size="6">Shift operation</Heading>
        </Flex>

        <Card>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Created at</DataList.Label>
              <DataList.Value>
                <Text>
                  {new Date(shiftOperation.createdAt).toLocaleString()}
                </Text>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Created by</DataList.Label>
              <DataList.Value>{createdByName}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Machine</DataList.Label>
              <DataList.Value>
                {machines.find((m) => m.id === shiftOperation.machineId)
                  ?.name ?? '-'}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Shift operation type</DataList.Label>
              <DataList.Value>{shiftOperation.type}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Cash collected</DataList.Label>
              <DataList.Value>
                {shiftOperation.cashCollected ?? '-'}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>

        {/* Product movements table */}
        <Flex direction="column" gap="3">
          <Heading size="4">Product movements</Heading>

          {rows.length === 0 ? (
            <Text color="gray" size="2">
              No product movements
            </Text>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Movement type</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map(({ item, type }) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <Text weight="medium">
                        {productsById.get(item.productId)?.name ?? 'Unknown'}
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
