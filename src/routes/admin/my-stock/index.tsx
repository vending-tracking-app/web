import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Container,
  Flex,
  Heading,
  Text,
  Badge,
  Table,
  Button,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';

import { fetchUserStock } from '../../../api/users';
import { AdminMenu } from '../../../components/admin-menu';
import { authClient } from '../../../lib/auth-client';
import { useProducts } from '@/hooks/use-products';

export const Route = createFileRoute('/admin/my-stock/')({
  component: AdminMyStockPage,
  loader: async () => {
    const session = await authClient.getSession();
    if (!session.data?.user?.id) {
      throw new Error('User not authenticated');
    }

    const userStock = await fetchUserStock(session.data.user.id);
    return { userStock };
  },
});

function AdminMyStockPage() {
  const { userStock } = Route.useLoaderData();
  const { productsMap: productMap } = useProducts();

  return (
    <Container size="3" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">My Stock</Heading>
          </Flex>
          <Button variant="soft" asChild>
            <Link to="/admin/my-stock/replenish">
              <PlusIcon /> Replenish Stock
            </Link>
          </Button>
        </Flex>

        {/* Stock Table */}
        {userStock.stock.length === 0 ? (
          <Text color="gray" size="2">
            No stock items
          </Text>
        ) : (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {userStock.stock.map((item) => {
                const product = productMap.get(item.productId);
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
        )}
      </Flex>
    </Container>
  );
}
