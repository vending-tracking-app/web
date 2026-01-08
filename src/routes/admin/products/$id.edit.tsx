import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import {
  fetchProduct,
  updateProduct,
  type UpdateProductInput,
} from "../../../api/products";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/admin/products" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateProductInput = {
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
    };
    updateMutation.mutate({ id, data });
  };

  if (!product) {
    return null;
  }

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Edit Product</Heading>

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
                  defaultValue={product.sku}
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
                  defaultValue={product.name}
                  required
                />
              </Box>

              {updateMutation.isError && (
                <Text color="red" size="2">
                  Error: {updateMutation.error.message}
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

                <Button type="submit" loading={updateMutation.isPending}>
                  Update Product
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
