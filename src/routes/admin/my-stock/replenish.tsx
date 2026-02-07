import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Flex,
  Heading,
  Button,
  Card,
  Text,
  Select,
  Popover,
  IconButton,
  TextField,
} from '@radix-ui/themes';
import { TrashIcon, MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

import {
  createStockMovement,
  StockMovementType,
} from '@/api/stock-movements';
import { authClient } from '@/lib/auth-client';
import { useProducts } from '@/hooks/use-products';

interface ProductInTransfer {
  id: string;
  quantity: number;
}

export const Route = createFileRoute('/admin/my-stock/replenish')({
  component: ReplenishPage,
});

function ReplenishPage() {
  const session = authClient.useSession();
  const { products } = useProducts();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [transferItems, setTransferItems] = useState<ProductInTransfer[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>();

  const transferMutation = useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', session.data?.user?.id, 'stock'],
      });
    },
  });

  const incrementQuantity = useCallback((index: number) => {
    setTransferItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decrementQuantity = useCallback((index: number) => {
    setTransferItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item,
      ),
    );
  }, []);

  const updateQuantity = useCallback((index: number, value: string) => {
    const nextQuantity = Number.parseInt(value, 10);

    setTransferItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Number.isNaN(nextQuantity)
                ? 0
                : Math.max(0, nextQuantity),
            }
          : item,
      ),
    );
  }, []);

  const removeRow = useCallback((index: number) => {
    setTransferItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addProduct = useCallback(() => {
    if (selectedProductId) {
      setTransferItems((prev) => [
        ...prev,
        { id: selectedProductId, quantity: 0 },
      ]);
      setSelectedProductId('');
      setPopoverOpen(false);
    }
  }, [selectedProductId]);

  const availableProducts = useMemo(() => {
    const selectedProductIds = transferItems.map((item) => item.id);
    return products.filter(
      (product) => !selectedProductIds.includes(product.id),
    );
  }, [products, transferItems]);

  const hasAvailableProducts = availableProducts.length > 0;

  const getProductName = useCallback(
    (productId: string) => products.find((p) => p.id === productId)?.name ?? '',
    [products],
  );

  const handleReplenish = useCallback(async () => {
    try {
      await transferMutation.mutateAsync({
        toId: session.data?.user?.id,
        type: StockMovementType.MARKET_TO_USER,
        items: transferItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      toast.success('Остатки успешно пополнены');

      await navigate({ to: '/admin/my-stock' });
    } catch (error) {
      console.error(error);
      toast.error('Не удалось пополнить остатки');
    }
  }, [transferItems, transferMutation, navigate, session.data?.user?.id]);

  return (
    <Container size="3" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Heading size="6">Пополнить остатки</Heading>

        <Flex direction="column" gap="4" p="4">
          {/* Products Section */}
          <Flex direction="column" gap="3">
            <Flex align="center" justify="between">
              <Text weight="bold" size="3">
                Товары
              </Text>

              <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Popover.Trigger>
                  <Button disabled={!hasAvailableProducts} variant="soft">
                    <PlusIcon /> Добавить товар
                  </Button>
                </Popover.Trigger>
                <Popover.Content width="300px">
                  <Flex direction="column" gap="3">
                    <Select.Root
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                    >
                      <Select.Trigger placeholder="Выберите товар" />
                      <Select.Content>
                        {availableProducts.map((product) => (
                          <Select.Item key={product.id} value={product.id}>
                            {product.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    <Button onClick={addProduct} disabled={!selectedProductId}>
                      Добавить
                    </Button>
                  </Flex>
                </Popover.Content>
              </Popover.Root>
            </Flex>

            {transferItems.map((item, index) => (
              <Card key={item.id}>
                <Flex align="center" justify="between" gap="3">
                  <Flex direction="column" gap="1" flexGrow="1">
                    <Text weight="bold">{getProductName(item.id)}</Text>
                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">
                        Количество:
                      </Text>
                      <IconButton
                        size="1"
                        variant="soft"
                        onClick={() => decrementQuantity(index)}
                      >
                        <MinusIcon />
                      </IconButton>
                      <TextField.Root
                        aria-label="Количество"
                        size="1"
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={String(item.quantity)}
                        onChange={(event) =>
                          updateQuantity(index, event.target.value)
                        }
                        style={{ width: '70px' }}
                      />
                      <IconButton
                        size="1"
                        variant="soft"
                        onClick={() => incrementQuantity(index)}
                      >
                        <PlusIcon />
                      </IconButton>
                    </Flex>
                  </Flex>
                  <IconButton
                    variant="soft"
                    color="red"
                    onClick={() => removeRow(index)}
                  >
                    <TrashIcon />
                  </IconButton>
                </Flex>
              </Card>
            ))}

            {transferItems.length === 0 && (
              <Text color="gray" size="2">
                Товары еще не добавлены. Нажмите «Добавить товар», чтобы начать.
              </Text>
            )}
          </Flex>

          <Flex gap="3" justify="end" mt="2">
            <Button
              type="button"
              variant="soft"
              color="gray"
              onClick={() => navigate({ to: '/admin/my-stock' })}
            >
              Отмена
            </Button>

            <Button
              disabled={
                transferItems.length === 0 ||
                transferItems.every((item) => item.quantity === 0)
              }
              onClick={handleReplenish}
              loading={transferMutation.isPending}
            >
              Пополнить остатки
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}
