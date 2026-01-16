import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Flex,
  Text,
  Select,
  Button,
  Heading,
  IconButton,
  Card,
  Popover,
} from "@radix-ui/themes";
import { TrashIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState, useCallback, useMemo } from "react";

import { fetchProducts } from "../../../api/products";
import { fetchMachineStock } from "../../../api/machines";

interface ProductInStock {
  id: string;
  quantity: number;
}

export const Route = createFileRoute("/expeditor/machines/$id/close-shift")({
  component: ExpeditorCloseShiftPage,
  loader: async ({ params }) => {
    const [machineStock, products] = await Promise.all([
      fetchMachineStock(params.id),
      fetchProducts(),
    ]);
    return { machineStock, products };
  },
});

function ExpeditorCloseShiftPage() {
  const { machineStock, products } = Route.useLoaderData();

  const [snapshot, setSnapshot] = useState<ProductInStock[]>(() => {
    return machineStock.stock.map((stockItem) => ({
      id: stockItem.productId,
      quantity: stockItem.quantity,
    }));
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const incrementQuantity = useCallback((index: number) => {
    setSnapshot((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((index: number) => {
    setSnapshot((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
    );
  }, []);

  const removeRow = useCallback((index: number) => {
    setSnapshot((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addProduct = useCallback(() => {
    if (selectedProductId) {
      setSnapshot((prev) => [...prev, { id: selectedProductId, quantity: 0 }]);
      setSelectedProductId("");
      setPopoverOpen(false);
    }
  }, [selectedProductId]);

  const availableProducts = useMemo(() => {
    const selectedProductIds = snapshot.map((item) => item.id);
    return products.filter(
      (product) => !selectedProductIds.includes(product.id)
    );
  }, [products, snapshot]);

  const hasAvailableProducts = availableProducts.length > 0;

  const getProductName = useCallback(
    (productId: string) => products.find((p) => p.id === productId)?.name ?? "",
    [products]
  );

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Close Shift - Machine</Heading>

        <Flex direction="column" gap="3">
          {snapshot.map((item, index) => (
            <Card key={item.id}>
              <Flex align="center" justify="between" gap="3">
                <Flex direction="column" gap="1" flexGrow="1">
                  <Text weight="bold">{getProductName(item.id)}</Text>
                  <Flex align="center" gap="2">
                    <Text size="2" color="gray">
                      Quantity:
                    </Text>
                    <IconButton
                      size="1"
                      variant="soft"
                      onClick={() => decrementQuantity(index)}
                    >
                      <MinusIcon />
                    </IconButton>
                    <Text
                      size="3"
                      weight="medium"
                      style={{ minWidth: "30px", textAlign: "center" }}
                    >
                      {item.quantity}
                    </Text>
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

          {snapshot.length === 0 && (
            <Text color="gray" size="2">
              No products added yet. Click "Add Product" to start.
            </Text>
          )}
        </Flex>

        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Popover.Trigger>
            <Button disabled={!hasAvailableProducts}>Add Product</Button>
          </Popover.Trigger>
          <Popover.Content width="300px">
            <Flex direction="column" gap="3">
              <Select.Root
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <Select.Trigger placeholder="Select product" />
                <Select.Content>
                  {availableProducts.map((product) => (
                    <Select.Item key={product.id} value={product.id}>
                      {product.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <Button onClick={addProduct} disabled={!selectedProductId}>
                Add
              </Button>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Container>
  );
}
