import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Container,
  Flex,
  Heading,
  Button,
  Card,
  DataList,
  Text,
  Badge,
  Table,
} from '@radix-ui/themes';
import { Pencil1Icon, SymbolIcon } from '@radix-ui/react-icons';

import { fetchUser, fetchUserStock } from '@/api/users';
import { AdminMenu } from '@/components/admin-menu';
import { useProducts } from '@/hooks/use-products';

export const Route = createFileRoute('/admin/users/$id/')({
  component: UserDetailPage,
  loader: async ({ params }) => {
    const [user, userStock] = await Promise.all([
      fetchUser(params.id),
      fetchUserStock(params.id),
    ]);
    return { user, userStock };
  },
});

function UserDetailPage() {
  const { user, userStock } = Route.useLoaderData();

  const { productsMap } = useProducts();

  return (
    <Container size="3" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">User Details</Heading>
          </Flex>

          <Button asChild>
            <Link to="/admin/users/$id/edit" params={{ id: user.id }}>
              <Pencil1Icon /> Edit
            </Link>
          </Button>
        </Flex>

        {/* User Details Card */}
        <Card>
          <Flex direction="column" gap="4" p="4">
            <Heading size="5">{user.name}</Heading>

            <DataList.Root>
              <DataList.Item>
                <DataList.Label>Email</DataList.Label>
                <DataList.Value>
                  <Text>{user.email}</Text>
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Role</DataList.Label>
                <DataList.Value>
                  <Badge color={user.role === 'admin' ? 'blue' : 'green'}>
                    {user.role === 'admin' ? 'Admin' : 'Expeditor'}
                  </Badge>
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Created</DataList.Label>
                <DataList.Value>
                  <Text>{new Date(user.createdAt).toLocaleString()}</Text>
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Updated</DataList.Label>
                <DataList.Value>
                  <Text>{new Date(user.updatedAt).toLocaleString()}</Text>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Flex>
        </Card>

        {/* Stock Table */}
        <Flex direction="column" gap="3">
          <Flex justify="between" align="center">
            <Heading size="4">Products</Heading>

            <Button size="2" asChild>
              <Link to="/admin/users/$id/transfer" params={{ id: user.id }}>
                <SymbolIcon /> Transfer
              </Link>
            </Button>
          </Flex>

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
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
