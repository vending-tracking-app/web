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

import {
  fetchMachine,
  updateMachine,
  type UpdateMachineInput,
} from '@/api/machines';
import { machinesQueryKey } from '@/hooks/use-machines';

export const Route = createFileRoute('/admin/machines/$id/edit')({
  component: EditMachinePage,
  loader: async ({ params }) => {
    const machine = await fetchMachine(params.id);
    return { machine };
  },
});

function EditMachinePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { machine } = Route.useLoaderData();

  const updateMutation = useMutation({
    mutationFn: updateMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesQueryKey });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: UpdateMachineInput = {
          name: formData.get('name') as string,
          location: formData.get('location') as string,
        };

        await updateMutation.mutateAsync({ id, data });

        toast.success('Автомат успешно обновлен');

        await navigate({ to: '/admin/machines/$id', params: { id } });
      } catch (error) {
        console.error(error);
        toast.error('Не удалось обновить автомат');
      }
    },
    [updateMutation, id, navigate],
  );

  if (!machine) {
    return null;
  }

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Редактировать автомат</Heading>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="4">
              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Название автомата
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Введите название автомата"
                  defaultValue={machine.name}
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="location" weight="bold" mb="2">
                  Расположение
                </Text>
                <TextField.Root
                  id="location"
                  name="location"
                  placeholder="Введите расположение автомата"
                  defaultValue={machine.location}
                  required
                />
              </Box>

              {updateMutation.isError && (
                <Text color="red" size="2">
                  Ошибка: {updateMutation.error.message}
                </Text>
              )}

              <Flex gap="3" justify="end" mt="2">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={() =>
                    navigate({ to: '/admin/machines/$id', params: { id } })
                  }
                >
                  Отмена
                </Button>

                <Button type="submit" loading={updateMutation.isPending}>
                  Обновить автомат
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
