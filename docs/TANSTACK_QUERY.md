# TanStack Query Guide

TanStack Query (formerly React Query) is a powerful data fetching and caching library that makes server state management simple and efficient.

## Key Concepts

### Query Client

The QueryClient is the core of TanStack Query. It manages all caching, background refetching, and stale data management.

```tsx
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // Data fresh for 1 minute
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
      },
    },
  })
}
```

### Provider Setup

Wrap your app with QueryClientProvider:

```tsx
// src/routes/__root.tsx
import { QueryClientProvider } from '@tanstack/react-query'

const queryClient = createQueryClient()

function RootDocument({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

## Queries (Reading Data)

### useQuery Hook

Use `useQuery` to fetch and cache data:

```tsx
import { useQuery } from '@tanstack/react-query'

function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

### Query Keys

Query keys uniquely identify cached data:

```tsx
// Simple key
queryKey: ['products']

// Key with variables
queryKey: ['products', productId]

// Key with filters
queryKey: ['products', { category: 'electronics', status: 'active' }]
```

### Query Key Factory Pattern

Create a factory for consistent keys:

```tsx
export const queryKeys = {
  products: {
    all: ['products'] as const,
    detail: (id: string) => ['products', id] as const,
    byCategory: (category: string) => ['products', { category }] as const,
  },
}

// Usage
useQuery({
  queryKey: queryKeys.products.all,
  queryFn: fetchProducts,
})
```

## Mutations (Writing Data)

### useMutation Hook

Use `useMutation` for create, update, delete operations:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateProductButton() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return (
    <button
      onClick={() => mutation.mutate({ name: 'New Product', price: 99 })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Creating...' : 'Create Product'}
    </button>
  )
}
```

### Cache Invalidation

After mutations, invalidate related queries to refetch fresh data:

```tsx
// Invalidate all products
queryClient.invalidateQueries({ queryKey: ['products'] })

// Invalidate specific product
queryClient.invalidateQueries({ queryKey: ['products', productId] })

// Invalidate matching queries
queryClient.invalidateQueries({
  queryKey: ['products'],
  exact: false, // Match all queries starting with 'products'
})
```

## Demo Implementation

### Custom Hooks

We wrap TanStack Query hooks in custom hooks for cleaner components:

```tsx
// src/hooks/useProducts.ts

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: fetchProducts,
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ''),
    queryFn: () => fetchProduct(id!),
    enabled: !!id, // Only fetch if id exists
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}
```

### Using in Components

```tsx
function ProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const deleteMutation = useDeleteProduct()

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <ProductTable
      products={products}
      onDelete={(id) => deleteMutation.mutate(id)}
    />
  )
}
```

## Important Defaults

TanStack Query has several important defaults:

| Default                | Value     | Meaning                              |
| ---------------------- | --------- | ------------------------------------ |
| `staleTime`            | 0         | Data is immediately considered stale |
| `gcTime`               | 5 minutes | Unused data removed after 5 minutes  |
| `refetchOnWindowFocus` | true      | Refetch when tab regains focus       |
| `retry`                | 3         | Retry failed requests 3 times        |

## Best Practices

1. **Use query keys consistently**: Create a query key factory
2. **Separate concerns**: Create custom hooks for each data type
3. **Handle all states**: Always check `isLoading`, `error`, and `data`
4. **Invalidate after mutations**: Keep cache in sync with server
5. **Set appropriate staleTime**: Balance freshness vs. performance

## Devtools

TanStack Query Devtools help debug queries:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add to your root component
;<ReactQueryDevtools initialIsOpen={false} />
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
