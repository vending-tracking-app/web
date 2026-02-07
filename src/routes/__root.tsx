import {
  Outlet,
  createRootRoute,
  useNavigate,
  useLocation,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { useEffect } from 'react';

import { authClient } from '@/lib/auth-client';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Only check session after loading is complete
    if (isPending) {
      return;
    }
    // If there's no session and we're not already on the login page, redirect
    if (!session && location.pathname !== '/login') {
      navigate({ to: '/login' });
    }
  }, [session, isPending, location.pathname, navigate]);

  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
