import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import {
  Container,
  Heading,
  Button,
  Flex,
  Text,
  Card,
  Grid,
  DataList,
  TextField,
  Badge,
} from '@radix-ui/themes';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';

import { AdminMenu } from '@/components/admin-menu';
import { authClient } from '@/lib/auth-client';
import { useUsers } from '@/hooks/use-users';

export const Route = createFileRoute('/admin/users/')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const session = authClient.useSession();

  const { users } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!users) {
      return [];
    }

    let result = users;

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          (user.phoneNumber ?? '').toLowerCase().includes(query),
      );
    }

    // Sort to show current user first
    const currentUserId = session.data?.user?.id;

    if (currentUserId) {
      result = [...result].sort((a, b) => {
        if (a.id === currentUserId) {
          return -1;
        } else if (b.id === currentUserId) {
          return 1;
        }

        return 0;
      });
    }

    return result;
  }, [users, searchQuery, session.data?.user?.id]);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">Пользователи</Heading>
          </Flex>

          <Button asChild>
            <Link to="/admin/users/new">
              <PlusIcon /> Добавить
            </Link>
          </Button>
        </Flex>

        {/* Search */}
        <TextField.Root
          placeholder="Поиск по имени или телефону..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {/* Users Grid */}
        <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
          {filteredUsers.map((user) => (
            <Link key={user.id} to="/admin/users/$id" params={{ id: user.id }}>
              <Card>
                <Flex direction="column" gap="3">
                  {/* User Header */}
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      <Heading size="4">{user.name}</Heading>

                      {session.data?.user?.id === user.id && (
                        <Badge color="gray">Вы</Badge>
                      )}
                    </Flex>
                  </Flex>

                  {/* User Details */}
                  <DataList.Root>
                    <DataList.Item>
                      <DataList.Label>Телефон</DataList.Label>
                      <DataList.Value>
                        <Text>{user.phoneNumber ?? '—'}</Text>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Роль</DataList.Label>
                      <DataList.Value>
                        <Badge color={user.role === 'admin' ? 'blue' : 'green'}>
                          {user.role === 'admin'
                            ? 'Администратор'
                            : 'Экспедитор'}
                        </Badge>
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
