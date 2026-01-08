import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

import {
  fetchMachine,
  updateMachine,
  type UpdateMachineInput,
} from "../../../api/machines";

export const Route = createFileRoute("/admin/machines/$id/edit")({
  component: EditMachinePage,
});

function EditMachinePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: machine } = useQuery({
    queryKey: ["machines", id],
    queryFn: () => fetchMachine(id),
  });

  const updateMutation = useMutation({
    mutationFn: updateMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["machines"] });
      navigate({ to: "/admin/machines" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateMachineInput = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
    };
    updateMutation.mutate({ id, data });
  };

  if (!machine) {
    return null;
  }

  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="4">
        <Heading size="6">Edit Machine</Heading>

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
                  defaultValue={machine.name}
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
                  defaultValue={machine.location}
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
                  onClick={() => navigate({ to: "/admin/machines" })}
                >
                  Cancel
                </Button>

                <Button type="submit" loading={updateMutation.isPending}>
                  Update Machine
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
