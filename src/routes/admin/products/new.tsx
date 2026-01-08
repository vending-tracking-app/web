import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Heading,
  Button,
  Flex,
  TextField,
  Text,
  Card,
  Box,
} from "@radix-ui/themes";

import { createProduct, type CreateProductInput } from "../../../api/products";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/admin/products" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateProductInput = {
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
    };
    createMutation.mutate(data);
  };

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Add New Product</Heading>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="4">
              <Box>
                <Text as="label" htmlFor="sku" weight="bold" mb="2">
                  SKU
                </Text>
                <TextField.Root
                  id="sku"
                  name="sku"
                  placeholder="Enter product SKU"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Product Name
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  required
                />
              </Box>

              {createMutation.isError && (
                <Text color="red" size="2">
                  Error: {createMutation.error.message}
                </Text>
              )}

              <Flex gap="3" justify="end" mt="2">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={() => navigate({ to: "/admin/products" })}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={createMutation.isPending}>
                  Create Product
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
