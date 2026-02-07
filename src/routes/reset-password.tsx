import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordLayout,
});

function ResetPasswordLayout() {
  return <Outlet />;
}
