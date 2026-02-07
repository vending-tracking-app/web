import {
  Badge,
  Button,
  Card,
  Container,
  DataList,
  Flex,
  Heading,
  Select,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  fetchShiftOperations,
  ShiftOperationType,
} from '@/api/shift-operations';
import { fetchMachine, fetchMachineStock } from '@/api/machines';
import { AdminMenu } from '@/components/admin-menu';
import { useMachineSales } from '@/hooks/use-machines';
import { useProducts } from '@/hooks/use-products';
import { useUsers } from '@/hooks/use-users';

const shiftTypeLabel: Record<ShiftOperationType, string> = {
  [ShiftOperationType.SHIFT_START]: 'Начало смены',
  [ShiftOperationType.SHIFT_END]: 'Конец смены',
};

export const Route = createFileRoute('/admin/machines/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [machine, shiftOperations, machineStock] = await Promise.all([
      fetchMachine(params.id),
      fetchShiftOperations(params.id),
      fetchMachineStock(params.id),
    ]);
    return { machine, shiftOperations, machineStock };
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { id } = Route.useParams();
  const { machine, shiftOperations, machineStock } = Route.useLoaderData();
  const { products, productsMap } = useProducts();
  const { usersMap } = useUsers();

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

  const today = useMemo(() => new Date(), []);
  const defaultTo = useMemo(() => today.toISOString().slice(0, 10), [today]);
  const defaultFrom = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() - 29);
    return date.toISOString().slice(0, 10);
  }, [today]);

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);
  const [productFilter, setProductFilter] = useState('all');

  const { data: salesData, isLoading: isSalesLoading, isError: isSalesError } =
    useMachineSales({
      machineId: id,
      from: fromDate || undefined,
      to: toDate || undefined,
      productId: productFilter === 'all' ? undefined : productFilter,
    });

  const series = salesData?.series ?? [];
  const seriesToRender =
    productFilter === 'all'
      ? series
      : series.filter((item) => item.productId === productFilter);

  const { chartData, chartSeries } = useMemo(() => {
    const dateSet = new Set<string>();
    seriesToRender.forEach((item) => {
      item.points.forEach((point) => dateSet.add(point.date));
    });

    const dates = Array.from(dateSet).sort();
    const data: Array<Record<string, number | string>> = dates.map((date) => ({
      date,
    }));

    const dateIndex = new Map(dates.map((date, index) => [date, index]));
    seriesToRender.forEach((item) => {
      item.points.forEach((point) => {
        const index = dateIndex.get(point.date);
        if (index === undefined) {
          return;
        }
        data[index][item.productId] = point.units;
      });
    });

    data.forEach((row) => {
      seriesToRender.forEach((item) => {
        if (row[item.productId] === undefined) {
          row[item.productId] = 0;
        }
      });
    });

    return { chartData: data, chartSeries: seriesToRender };
  }, [seriesToRender]);

  const lineColors = [
    '#0f766e',
    '#1d4ed8',
    '#a21caf',
    '#b45309',
    '#0f172a',
    '#15803d',
    '#be123c',
  ];

  const formatChartDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
  };

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
              Редактировать
            </Link>
          </Button>
        </Flex>

        <Card>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Расположение</DataList.Label>
              <DataList.Value>
                <Text>{machine.location}</Text>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>

        {machineStock.stock.length > 0 &&
          machineStock.stock.some((item) => item.quantity > 0) && <div />}

        <Flex direction="column" gap="3">
          <Heading size="4">Остатки на {stockUpdatedAt}</Heading>

          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Товар</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Количество</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {machineStock.stock.map((item) => {
                const product = productsMap.get(item.productId);
                return (
                  <Table.Row key={item.productId}>
                    <Table.Cell>
                      <Text weight="medium">
                        {product?.name ?? 'Неизвестный товар'}
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

        <Flex direction="column" gap="3">
          <Heading size="4">Продажи</Heading>
          <Card>
            <Flex direction="column" gap="4" p="4">
              <Flex gap="3" wrap="wrap">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    Товар
                  </Text>
                  <Select.Root
                    value={productFilter}
                    onValueChange={setProductFilter}
                  >
                    <Select.Trigger style={{ width: 220 }} />
                    <Select.Content>
                      <Select.Item value="all">Все товары</Select.Item>
                      {products.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    С
                  </Text>
                  <TextField.Root
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    style={{ width: 160 }}
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">
                    По
                  </Text>
                  <TextField.Root
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    style={{ width: 160 }}
                  />
                </Flex>
              </Flex>

              {isSalesLoading ? (
                <Text size="2" color="gray">
                  Загрузка данных по продажам...
                </Text>
              ) : isSalesError ? (
                <Text size="2" color="red">
                  Не удалось загрузить данные по продажам.
                </Text>
              ) : chartSeries.length === 0 || chartData.length === 0 ? (
                <Text size="2" color="gray">
                  Нет данных о продажах за этот период.
                </Text>
              ) : (
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatChartDate}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval="preserveStartEnd"
                        minTickGap={12}
                        padding={{ left: 12, right: 12 }}
                      />
                      <YAxis
                        domain={[0, (max: number) => Math.max(5, max + 5)]}
                        padding={{ top: 10, bottom: 10 }}
                      />
                      <Tooltip />
                      <Legend />
                      {chartSeries.map((item, index) => (
                        <Line
                          key={item.productId}
                          type="monotone"
                          dataKey={item.productId}
                          name={item.productName}
                          stroke={lineColors[index % lineColors.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Flex>
          </Card>
        </Flex>

        {/* Shift operations table */}
        <Flex direction="column" gap="3">
          <Heading size="4">Операции смены</Heading>

          {sortedShiftOperations.length === 0 ? (
            <Text color="gray" size="2">
              Операций смены нет
            </Text>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Тип</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Дата и время</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Создал</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Собрано наличными
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
                        {usersMap.get(op.createdById)?.name ?? '—'}
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
