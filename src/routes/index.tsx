import { createFileRoute } from "@tanstack/react-router";
import { Box, Heading, Text } from "@radix-ui/themes";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Box p="4">
      <Heading as="h1">Vending Tracking App</Heading>
      <Text>Welcome to your vending machine tracking application.</Text>
    </Box>
  );
}
