import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Box, Card, Flex, Text, TextField, Button } from '@radix-ui/themes';
import { useState, type FormEvent } from 'react';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/reset-password/confirm')({
  component: ResetPasswordConfirm,
  validateSearch: (search: Record<string, unknown>) => ({
    phoneNumber:
      typeof search.phoneNumber === 'string' ? search.phoneNumber : '',
  }),
});

function ResetPasswordConfirm() {
  const navigate = useNavigate();
  const { phoneNumber: initialPhoneNumber } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    await authClient.phoneNumber.resetPassword(
      {
        phoneNumber,
        otp,
        newPassword: password,
      },
      {
        onSuccess: () => {
          navigate({ to: '/login' });
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? 'Не удалось сбросить пароль');
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
                <Text as="label" htmlFor="phoneNumber" weight="medium" mb="2">
                  Номер телефона
                </Text>
                <TextField.Root
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+77012345678"
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="otp" weight="medium" mb="2">
                  Код подтверждения
                </Text>
                <TextField.Root
                  id="otp"
                  name="otp"
                  placeholder="Введите код"
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                />
              </Box>

              <Box>
                <Text as="label" htmlFor="password" weight="medium" mb="2">
                  Новый пароль
                </Text>
                <TextField.Root
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Введите новый пароль"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Box>

              <Button type="submit" loading={isLoading}>
                Сбросить пароль
              </Button>

              <Text size="2" color="gray">
                <Link to="/reset-password">Назад</Link>
              </Text>

              {error && <Text color="red">{error}</Text>}
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
