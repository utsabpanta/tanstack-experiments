# TanStack Router (Start) Guide

TanStack Start is built on top of TanStack Router, providing a full-stack React framework with file-based routing, SSR, and server functions.

## Key Concepts

### File-Based Routing

Routes are defined by the file structure in `src/routes/`. The file path determines the URL path.

```
src/routes/
├── __root.tsx          → Layout for all routes
├── index.tsx           → /
└── products/
    ├── index.tsx       → /products
    ├── new.tsx         → /products/new
    └── $productId/
        ├── index.tsx   → /products/:productId
        └── edit.tsx    → /products/:productId/edit
```

### Creating Routes

Use `createFileRoute` to define a route:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  return <div>Products List</div>
}
```

### Dynamic Routes

Use `$paramName` in the file/folder name for dynamic segments:

```tsx
// src/routes/products/$productId/index.tsx
export const Route = createFileRoute('/products/$productId/')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  // Access the dynamic parameter with type safety
  const { productId } = Route.useParams()

  return <div>Product ID: {productId}</div>
}
```

### Navigation

#### Link Component

Use `Link` for declarative navigation:

```tsx
import { Link } from '@tanstack/react-router'

// Simple link
<Link to="/products">Products</Link>

// Link with params
<Link
  to="/products/$productId"
  params={{ productId: '123' }}
>
  View Product
</Link>

// Active styling
<Link
  to="/products"
  activeProps={{
    className: 'text-blue-500 font-bold',
  }}
>
  Products
</Link>
```

#### Programmatic Navigation

Use `useNavigate` for programmatic navigation:

```tsx
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    // Navigate to a route
    navigate({ to: '/products' })

    // Navigate with params
    navigate({
      to: '/products/$productId',
      params: { productId: '123' },
    })

    // Go back
    navigate({ to: '..' })
  }
}
```

### Root Layout

The `__root.tsx` file defines the layout for all routes:

```tsx
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
    links: [{ rel: 'stylesheet', href: '/styles.css' }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

## Demo Implementation

### Routes in This Project

| Route                | File                            | Purpose                      |
| -------------------- | ------------------------------- | ---------------------------- |
| `/`                  | `index.tsx`                     | Dashboard with product stats |
| `/products`          | `products/index.tsx`            | Product list with table      |
| `/products/new`      | `products/new.tsx`              | Create new product form      |
| `/products/:id`      | `products/$productId/index.tsx` | Product details              |
| `/products/:id/edit` | `products/$productId/edit.tsx`  | Edit product form            |

### Type-Safe Params

TanStack Router provides full type inference for route params:

```tsx
// The type of productId is inferred as string
const { productId } = Route.useParams()

// TypeScript will error if you try to access a param that doesn't exist
const { invalidParam } = Route.useParams() // Error!
```

## Best Practices

1. **Keep routes focused**: Each route file should handle one concern
2. **Use layouts**: Share common UI in parent routes
3. **Type-safe navigation**: Always use typed Link and navigate functions
4. **Loading states**: Handle loading in components, not route loaders

## Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [File-Based Routing Guide](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
