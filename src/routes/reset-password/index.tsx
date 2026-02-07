import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Box, Card, Flex, Text, TextField, Button } from '@radix-ui/themes';
import { useState, type FormEvent } from 'react';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/reset-password/')({
  component: ResetPasswordRequest,
});

function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    await authClient.phoneNumber.requestPasswordReset(
      {
        phoneNumber,
      },
      {
        onSuccess: () => {
          navigate({ to: '/reset-password/confirm', search: { phoneNumber } });
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? 'Не удалось запросить сброс');
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

              <Button type="submit" loading={isLoading}>
                Отправить код сброса
              </Button>

              <Button
                type="button"
                variant="soft"
                disabled={!phoneNumber}
                onClick={() =>
                  navigate({
                    to: '/reset-password/confirm',
                    search: { phoneNumber },
                  })
                }
              >
                У меня уже есть код
              </Button>

              <Text size="2" color="gray">
                Вспомнили пароль?{' '}
                <Link to="/login">Вернуться ко входу</Link>
              </Text>

              {error && <Text color="red">{error}</Text>}
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
