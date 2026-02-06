import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  Badge,
  Button,
  Card,
  Container,
  DataList,
  Flex,
  Heading,
  Table,
  Text,
} from '@radix-ui/themes';

import {
  fetchShiftOperations,
  ShiftOperationType,
} from '@/api/shift-operations';
import { fetchMachine, fetchMachineStock } from '@/api/machines';
import { fetchUsers } from '@/api/users';
import { AdminMenu } from '@/components/admin-menu';
import { useMemo } from 'react';
import { fetchProducts } from '@/api/products';

const shiftTypeLabel: Record<ShiftOperationType, string> = {
  [ShiftOperationType.SHIFT_START]: 'Shift start',
  [ShiftOperationType.SHIFT_END]: 'Shift end',
};

export const Route = createFileRoute('/admin/machines/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [machine, shiftOperations, users, machineStock, products] =
      await Promise.all([
        fetchMachine(params.id),
        fetchShiftOperations(params.id),
        fetchUsers(),
        fetchMachineStock(params.id),
        fetchProducts(),
      ]);
    return { machine, shiftOperations, users, machineStock, products };
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { id } = Route.useParams();
  const { machine, shiftOperations, users, machineStock, products } =
    Route.useLoaderData();

  const productsMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  );

  const sortedShiftOperations = useMemo(
    () =>
      [...shiftOperations].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [shiftOperations],
  );

  // TODO: use stock item updated at
  const stockUpdatedAt = useMemo(
    () =>
      sortedShiftOperations[0]
        ? new Date(sortedShiftOperations[0].createdAt).toLocaleString()
        : null,
    [sortedShiftOperations],
  );

  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users],
  );

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">{machine.name}</Heading>
          </Flex>

          <Button asChild size="2" variant="soft">
            <Link to="/admin/machines/$id/edit" params={{ id }}>
              Edit
            </Link>
          </Button>
        </Flex>

        <Card>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Location</DataList.Label>
              <DataList.Value>
                <Text>{machine.location}</Text>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>

        {machineStock.stock.length > 0 &&
          machineStock.stock.some((item) => item.quantity > 0) && <div />}

        <Flex direction="column" gap="3">
          <Heading size="4">Stock at {stockUpdatedAt}</Heading>

          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {machineStock.stock.map((item) => {
                const product = productsMap.get(item.productId);
                return (
                  <Table.Row key={item.productId}>
                    <Table.Cell>
                      <Text weight="medium">
                        {product?.name ?? 'Unknown Product'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={item.quantity > 0 ? 'green' : 'red'}
                        size="3"
                        radius="full"
                      >
                        {item.quantity}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Flex>

        {/* Shift operations table */}
        <Flex direction="column" gap="3">
          <Heading size="4">Shift operations</Heading>

          {sortedShiftOperations.length === 0 ? (
            <Text color="gray" size="2">
              No shift operations
            </Text>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Date & time</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created by</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Cash collected
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedShiftOperations.map((op) => (
                  <Table.Row
                    key={op.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate({
                        to: '/admin/shift-operations/$id',
                        params: { id: op.id },
                      })
                    }
                  >
                    <Table.Cell>
                      <Text weight="medium">{shiftTypeLabel[op.type]}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {new Date(op.createdAt).toLocaleString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {usersById.get(op.createdById)?.name ?? '—'}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">
                        {op.cashCollected !== null
                          ? op.cashCollected.toLocaleString()
                          : '—'}
                      </Text>
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
