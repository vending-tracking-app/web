import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link, useNavigate } from "@tanstack/react-router";

import { authClient } from "../lib/auth-client";

export function AdminMenu() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
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
          <Link to="/admin/my-stock">My Stock</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/products">Products</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/machines">Machines</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/admin/users">Users</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item onSelect={handleSignOut}>
          Sign Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
