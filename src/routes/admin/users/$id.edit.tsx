import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Heading,
  Button,
  Flex,
  TextField,
  Text,
  Card,
  Box,
} from "@radix-ui/themes";
import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  fetchUser,
  updateUser,
  type UpdateUserInput,
} from "../../../api/users";

export const Route = createFileRoute("/admin/users/$id/edit")({
  component: EditUserPage,
  loader: async ({ params }) => {
    const user = await fetchUser(params.id);
    return { user };
  },
});

function EditUserPage() {
  const { id } = Route.useParams();
  const { user } = Route.useLoaderData();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const formData = new FormData(e.currentTarget);
        const data: UpdateUserInput = {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
        };

        await updateMutation.mutateAsync({ id, data });

        toast.success("User updated successfully");

        await navigate({ to: "/admin/users" });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update user");
      }
    },
    [updateMutation, id, navigate]
  );

  if (!user) {
    return null;
  }

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Edit User</Heading>

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
                  defaultValue={user.name}
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
                  defaultValue={user.email}
                  required
                />
              </Box>

              {updateMutation.isError && (
                <Text color="red" size="2">
                  Error: {updateMutation.error.message}
                </Text>
              )}

              <Flex gap="3" justify="end" mt="2">
                <Button
                  type="button"
                  variant="soft"
                  color="gray"
                  onClick={() => navigate({ to: "/admin/users" })}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={updateMutation.isPending}>
                  Update User
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
