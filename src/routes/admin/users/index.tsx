import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { fetchUsers } from "../../../api/users";
import { AdminMenu } from "../../../components/admin-menu";
import { authClient } from "../../../lib/auth-client";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const session = authClient.useSession();

  const [searchQuery, setSearchQuery] = useState("");

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = useMemo(() => {
    if (!users) {
      return [];
    }

    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <AdminMenu />
            <Heading size="6">Users</Heading>
          </Flex>

          <Button asChild>
            <Link to="/admin/users/new">Add User</Link>
          </Button>
        </Flex>

        {/* Search */}
        <TextField.Root
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        {/* Users Grid */}
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <Flex direction="column" gap="3">
                {/* User Header */}
                <Flex justify="between" align="start">
                  <Flex align="center" gap="2">
                    <Heading size="4">{user.name}</Heading>

                    {session.data?.user?.id === user.id && (
                      <Badge color="gray">You</Badge>
                    )}
                  </Flex>

                  <Button asChild size="2" variant="soft">
                    <Link to="/admin/users/$id/edit" params={{ id: user.id }}>
                      Edit
                    </Link>
                  </Button>
                </Flex>

                {/* User Details */}
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>Email</DataList.Label>
                    <DataList.Value>
                      <Text>{user.email}</Text>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Role</DataList.Label>
                    <DataList.Value>
                      <Badge color={user.role === "admin" ? "blue" : "green"}>
                        {user.role === "admin" ? "Admin" : "Expeditor"}
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
}
