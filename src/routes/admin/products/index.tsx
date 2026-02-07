import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Grid,
  DataList,
  TextField,
} from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { useProducts } from '@/hooks/use-products';
import { AdminMenu } from '@/components/admin-menu';

export const Route = createFileRoute('/admin/products/')({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">Products</Heading>
          </Flex>

          <Button asChild>
            <Link to="/admin/products/new">Add Product</Link>
          </Button>
        </Flex>

        {/* Search */}
        <TextField.Root
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {/* Products Grid */}
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <Flex direction="column" gap="3">
                {/* Product Header */}
                <Flex justify="between" align="start">
                  <Heading size="4">{product.name}</Heading>
                  <Button asChild size="2" variant="soft">
                    <Link
                      to="/admin/products/$id/edit"
                      params={{ id: product.id }}
                    >
                      Edit
                    </Link>
                  </Button>
                </Flex>

                {/* Product Details */}
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>SKU</DataList.Label>
                    <DataList.Value>
                      <Text>{product.sku}</Text>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Created</DataList.Label>
                    <DataList.Value>
                      {new Date(product.createdAt).toLocaleString()}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Updated</DataList.Label>
                    <DataList.Value>
                      {new Date(product.updatedAt).toLocaleString()}
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
