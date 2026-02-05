import { createFileRoute, Outlet } from '@tanstack/react-router';

import { requireExpeditor } from '../../lib/route-guards';

export const Route = createFileRoute('/expeditor')({
  beforeLoad: async () => {
    await requireExpeditor();
  },
  component: ExpeditorLayout,
});

function ExpeditorLayout() {
  return <Outlet />;
}
