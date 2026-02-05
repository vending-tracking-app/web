import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Box, Card, Flex, Text, TextField, Button } from '@radix-ui/themes';
import { useState, type FormEvent } from 'react';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (session.data) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/' });
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? 'Failed to sign in');
        },
      },
    );

    setIsLoading(false);
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
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="password" weight="medium" mb="2">
                  Password
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </Box>

              <Button type="submit" loading={isLoading}>
                Sign In
              </Button>

              {error && <Text color="red">{error}</Text>}
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
