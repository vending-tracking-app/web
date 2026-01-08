import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Grid,
  Badge,
} from "@radix-ui/themes";

import { fetchProducts } from "../../../api/products";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  // Query for fetching products
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="6">Products</Heading>
          <Button asChild>
            <Link to="/admin/products/new">Add Product</Link>
          </Button>
        </Flex>

        {/* Products Grid */}
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {products?.map((product) => (
            <Card key={product.id}>
              <Flex direction="column" gap="3">
                {/* Product Header */}
                <Flex justify="between" align="start">
                  <Flex direction="column" gap="1">
                    <Heading size="4">{product.name}</Heading>
                    <Badge color="blue" variant="soft">
                      {product.sku}
                    </Badge>
                  </Flex>
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
                <Flex direction="column" gap="2">
                  <Flex direction="column" gap="1">
                    <Text size="1" weight="bold" color="gray">
                      Created
                    </Text>
                    <Text size="2">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" weight="bold" color="gray">
                      Updated
                    </Text>
                    <Text size="2">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
