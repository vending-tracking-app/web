import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expeditor/machines')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/expeditor/machines"!</div>
}
