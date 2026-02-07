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
import { usersQueryKey } from '@/hooks/use-users';

export const Route = createFileRoute('/admin/users/new')({
  component: NewUserPage,
});

function NewUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: CreateUserInput = {
          name: formData.get('name') as string,
          phoneNumber: formData.get('phoneNumber') as string,
          role: formData.get('role') as UserRole,
          password: formData.get('password') as string,
        };

        await createMutation.mutateAsync(data);

        toast.success('Пользователь успешно создан');

        await navigate({ to: '/admin/users' });
      } catch (error) {
        console.error(error);
        toast.error('Не удалось создать пользователя');
      }
    },
    [createMutation, navigate],
  );

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Добавить пользователя</Heading>

        {/* Form Card */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4" p="4">
              <Box>
                <Text as="label" htmlFor="name" weight="bold" mb="2">
                  Имя
                </Text>
                <TextField.Root
                  id="name"
                  name="name"
                  placeholder="Введите имя пользователя"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="phoneNumber" weight="bold" mb="2">
                  Номер телефона
                </Text>
                <TextField.Root
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Введите номер телефона"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="password" weight="bold" mb="2">
                  Пароль
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="role" weight="bold" mb="2">
                  Роль
                </Text>
                <Select.Root name="role" defaultValue="user" required>
                  <Select.Trigger style={{ width: '100%' }} />
                  <Select.Content>
                    <Select.Item value="user">Экспедитор</Select.Item>
                    <Select.Item value="admin">Администратор</Select.Item>
                  </Select.Content>
                </Select.Root>
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
                  onClick={() => navigate({ to: '/admin/users' })}
                >
                  Отмена
                </Button>

                <Button type="submit" loading={createMutation.isPending}>
                  Создать пользователя
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
