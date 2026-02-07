import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from '@tanstack/react-router';

import { authClient } from '@/lib/auth-client';

export function AdminMenu() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: '/login' });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft">
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link to="/admin/my-stock">Мои остатки</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/products">Товары</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/machines">Автоматы</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/users">Пользователи</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item onSelect={handleSignOut}>
          Выйти
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
