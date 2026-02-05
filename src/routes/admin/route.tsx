import { createFileRoute, Outlet } from '@tanstack/react-router';

import { requireAdmin } from '../../lib/route-guards';

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    await requireAdmin();
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
