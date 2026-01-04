import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vending Tracking App</h1>
      <p>Welcome to your vending machine tracking application.</p>
    </div>
  )
}
