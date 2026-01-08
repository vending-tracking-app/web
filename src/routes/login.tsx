import { createFileRoute } from "@tanstack/react-router";
import { Box, Card, Flex, Text, TextField, Button } from "@radix-ui/themes";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement authentication logic
    console.log("Login attempt:", { email, password });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minHeight="100vh"
      p="4"
    >
      <Box width="100%" maxWidth="400px">
        <Card>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Box>
                <Text as="label" htmlFor="email" weight="medium" mb="2">
                  Email
                </Text>
                <TextField.Root
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="password" weight="medium" mb="2">
                  Password
                </Text>
                <TextField.Root
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Box>

              <Button type="submit" loading={isSubmitting}>
                Sign In
              </Button>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
