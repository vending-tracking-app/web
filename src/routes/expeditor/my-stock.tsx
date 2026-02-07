import { createFileRoute } from '@tanstack/react-router';
import { Container, Flex, Heading, Text, Badge, Table } from '@radix-ui/themes';

import { fetchUserStock } from '@/api/users';
import { authClient } from '@/lib/auth-client';
import { ExpeditorMenu } from '@/components/expeditor-menu';
import { useProducts } from '@/hooks/use-products';

export const Route = createFileRoute('/expeditor/my-stock')({
  component: ExpeditorMyStockPage,
  loader: async () => {
    const session = await authClient.getSession();

    if (!session.data?.user?.id) {
      throw new Error('Пользователь не авторизован');
    }

    const userStock = await fetchUserStock(session.data.user.id);
    return { userStock };
  },
});

function ExpeditorMyStockPage() {
  const { userStock } = Route.useLoaderData();
  const { productsMap } = useProducts();

  return (
    <Container size="3" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" gap="2">
          <ExpeditorMenu />
          <Heading size="6">Мои остатки</Heading>
        </Flex>

        {/* Stock Table */}
        <Flex direction="column" gap="3">
          <Heading size="4">Товары</Heading>

          {userStock.stock.length === 0 ? (
            <Text color="gray" size="2">
              Нет остатков
            </Text>
          ) : (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Товар</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Количество</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {userStock.stock.map((item) => {
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
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
