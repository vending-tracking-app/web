import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/machines")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/machines"!</div>;
}
