import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";

import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  return (
    <Flex p="4" direction="column" gap="4">
      <Heading as="h1">Vending Tracking App</Heading>
      <Text>Welcome to your vending machine tracking application.</Text>
      {session?.user && <Text mt="4">Logged in as: {session.user.email}</Text>}
      <Button onClick={handleSignOut}>Sign Out</Button>
    </Flex>
  );
}
