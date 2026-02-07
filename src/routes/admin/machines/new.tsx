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

import { createMachine, type CreateMachineInput } from '@/api/machines';
import { machinesQueryKey } from '@/hooks/use-machines';

export const Route = createFileRoute('/admin/machines/new')({
  component: NewMachinePage,
});

function NewMachinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machinesQueryKey });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: CreateMachineInput = {
          name: formData.get('name') as string,
          location: formData.get('location') as string,
        };

        await createMutation.mutateAsync(data);

        toast.success('Machine created successfully');

        await navigate({ to: '/admin/machines' });
      } catch (error) {
        console.error(error);
        toast.error('Failed to create machine');
      }
    },
    [createMutation, navigate],
  );

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Add New Machine</Heading>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="4">
              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Machine Name
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Enter machine name"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="location" weight="bold" mb="2">
                  Location
                </Text>
                <TextField.Root
                  id="location"
                  name="location"
                  placeholder="Enter machine location"
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
                  onClick={() => navigate({ to: '/admin/machines' })}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={createMutation.isPending}>
                  Create Machine
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
