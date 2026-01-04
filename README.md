# Vending Tracking App

A web application for tracking vending machine inventory, sales, and maintenance.

## Getting Started

To run this application:

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing

## Project Structure

```
src/
├── routes/           # File-based routes
│   ├── __root.tsx   # Root layout
│   └── index.tsx    # Home page
├── main.tsx         # Application entry point
└── styles.css       # Global styles
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route, create a new file in the `./src/routes` directory. TanStack will automatically generate the route tree.

### Example Route

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/your-route')({
  component: YourComponent,
})

function YourComponent() {
  return <div>Your content</div>
}
```

## Development

- The TanStack DevTools are available in development mode (bottom-right corner)
- Hot Module Replacement (HMR) is enabled for fast development
- TypeScript errors will be shown in the terminal and browser

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
