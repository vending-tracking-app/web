import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

export function ExpeditorMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft">
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link to="/expeditor/my-stock">My Stock</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link to="/expeditor/machines">Machines</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
