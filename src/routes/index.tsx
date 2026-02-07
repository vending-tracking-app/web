import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await authClient.getSession();

    if (!session.data) {
      throw redirect({
        to: '/login',
      });
    }

    if (session.data.user.role === 'admin') {
      throw redirect({
        to: '/admin/machines',
      });
    } else if (session.data.user.role === 'user') {
      throw redirect({
        to: '/expeditor/machines',
      });
    }
  },
  component: IndexLayout,
});

function IndexLayout() {
  return <Outlet />;
}
