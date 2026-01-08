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

import { createMachine, type CreateMachineInput } from "../../../api/machines";

export const Route = createFileRoute("/admin/machines/new")({
  component: NewMachinePage,
});

function NewMachinePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      navigate({ to: "/admin/machines" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateMachineInput = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
    };
    createMutation.mutate(data);
  };

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
                  onClick={() => navigate({ to: "/admin/machines" })}
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
