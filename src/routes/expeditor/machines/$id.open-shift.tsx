import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
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
} from '@radix-ui/themes';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  CameraIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { fetchMachineStock } from '@/api/machines';
import {
  createShiftOperation,
  ShiftOperationType,
} from '@/api/shift-operations';
import { useProducts } from '@/hooks/use-products';

interface ProductInStock {
  id: string;
  quantity: number;
}

export const Route = createFileRoute('/expeditor/machines/$id/open-shift')({
  component: ExpeditorOpenShiftPage,
  loader: async ({ params }) => {
    const machineStock = await fetchMachineStock(params.id);
    return { machineStock };
  },
});

function ExpeditorOpenShiftPage() {
  const navigate = useNavigate();

  const { id } = Route.useParams();
  const { machineStock } = Route.useLoaderData();
  const { products, productsMap } = useProducts();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [snapshot, setSnapshot] = useState<ProductInStock[]>(() => {
    return machineStock.stock
      .filter((stockItem) => stockItem.quantity > 0)
      .map((stockItem) => ({
        id: stockItem.productId,
        quantity: stockItem.quantity,
      }));
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const photoUrl = useMemo(() => {
    if (!photoFile) {
      return null;
    }

    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const openShiftMutation = useMutation({
    mutationFn: createShiftOperation,
  });

  const incrementQuantity = useCallback((index: number) => {
    setSnapshot((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const decrementQuantity = useCallback((index: number) => {
    setSnapshot((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item,
      ),
    );
  }, []);

  const removeRow = useCallback((index: number) => {
    setSnapshot((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addProduct = useCallback(() => {
    if (selectedProductId) {
      setSnapshot((prev) => [...prev, { id: selectedProductId, quantity: 0 }]);
      setSelectedProductId('');
      setPopoverOpen(false);
    }
  }, [selectedProductId]);

  const availableProducts = useMemo(() => {
    const selectedProductIds = snapshot.map((item) => item.id);
    return products.filter(
      (product) => !selectedProductIds.includes(product.id),
    );
  }, [products, snapshot]);

  const hasAvailableProducts = availableProducts.length > 0;

  const getProductName = useCallback(
    (productId: string) => productsMap.get(productId)?.name ?? '',
    [productsMap],
  );

  const handleOpenShift = useCallback(async () => {
    if (!photoFile) {
      toast.error('Please take a photo of the machine');
      return;
    }

    try {
      await openShiftMutation.mutateAsync({
        machineId: id,
        type: ShiftOperationType.SHIFT_START,
        snapshot: snapshot.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      toast.success('Shift opened successfully');

      await navigate({ to: '/expeditor/machines' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to open shift');
    }
  }, [id, snapshot, photoFile, openShiftMutation]);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="6">
        <Heading size="6">Open Shift - Machine</Heading>

        <Flex direction="column" gap="3">
          <Text weight="bold" size="3">
            Machine Photo
          </Text>

          <Card>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Machine"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="2"
                p="6"
              >
                <CameraIcon width="32" height="32" color="gray" />
                <Text color="gray" size="2">
                  No photo taken yet
                </Text>
              </Flex>
            )}
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setPhotoFile(file);
              }
            }}
            style={{ display: 'none' }}
          />

          <Button onClick={() => fileInputRef.current?.click()} variant="soft">
            <CameraIcon />
            {photoUrl ? 'Retake Photo' : 'Take Photo'}
          </Button>
        </Flex>

        <Flex direction="column" gap="3">
          <Flex align="center" justify="between">
            <Text weight="bold" size="3">
              Products
            </Text>

            <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Popover.Trigger>
                <Button disabled={!hasAvailableProducts}>
                  <PlusIcon /> Add Product
                </Button>
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
                      style={{ minWidth: '30px', textAlign: 'center' }}
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

        <Button
          color="green"
          disabled={!photoFile}
          onClick={handleOpenShift}
          loading={openShiftMutation.isPending}
        >
          <CheckIcon />
          Open Shift
        </Button>
      </Flex>
    </Container>
  );
}
