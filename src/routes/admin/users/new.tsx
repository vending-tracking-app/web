import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  Container,
  Heading,
  Button,
  Flex,
  TextField,
  Text,
  Card,
  Box,
  Select,
} from '@radix-ui/themes';
import toast from 'react-hot-toast';

import {
  createUser,
  type CreateUserInput,
  type UserRole,
} from '@/api/users';

export const Route = createFileRoute('/admin/users/new')({
  component: NewUserPage,
});

function NewUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: CreateUserInput = {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as UserRole,
          password: formData.get('password') as string,
        };

        await createMutation.mutateAsync(data);

        toast.success('User created successfully');

        await navigate({ to: '/admin/users' });
      } catch (error) {
        console.error(error);
        toast.error('Failed to create user');
      }
    },
    [createMutation, navigate],
  );

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Add New User</Heading>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="4">
              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Name
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Enter user name"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="email" weight="bold" mb="2">
                  Email
                </Text>
                <TextField.Root
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter user email"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="password" weight="bold" mb="2">
                  Password
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="role" weight="bold" mb="2">
                  Role
                </Text>
                <Select.Root name="role" defaultValue="user" required>
                  <Select.Trigger style={{ width: '100%' }} />
                  <Select.Content>
                    <Select.Item value="user">Expeditor</Select.Item>
                    <Select.Item value="admin">Admin</Select.Item>
                  </Select.Content>
                </Select.Root>
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
                  onClick={() => navigate({ to: '/admin/users' })}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={createMutation.isPending}>
                  Create User
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
