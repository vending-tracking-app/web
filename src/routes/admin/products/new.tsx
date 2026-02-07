import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Heading,
  Button,
  Flex,
  TextField,
  Text,
  Card,
  Box,
} from '@radix-ui/themes';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { createProduct, type CreateProductInput } from '@/api/products';
import { productsQueryKey } from '@/hooks/use-products';

export const Route = createFileRoute('/admin/products/new')({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: CreateProductInput = {
          sku: formData.get('sku') as string,
          name: formData.get('name') as string,
        };

        await createMutation.mutateAsync(data);

        toast.success('Товар успешно создан');

        await navigate({ to: '/admin/products' });
      } catch (error) {
        console.error(error);
        toast.error('Не удалось создать товар');
      }
    },
    [createMutation, navigate],
  );

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Добавить новый товар</Heading>

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
                  placeholder="Введите SKU товара"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Название товара
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Введите название товара"
                  required
                />
              </Box>

              {createMutation.isError && (
                <Text color="red" size="2">
                  Ошибка: {createMutation.error.message}
                </Text>
              )}

              <Flex gap="3" justify="end" mt="2">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={() => navigate({ to: '/admin/products' })}
                >
                  Отмена
                </Button>

                <Button type="submit" loading={createMutation.isPending}>
                  Создать товар
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
