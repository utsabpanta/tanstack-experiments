import { QueryClient } from '@tanstack/react-query'

/**
 * TanStack Query Client Configuration
 *
 * The QueryClient is the core of TanStack Query. It manages all caching,
 * background refetching, and stale data management.
 *
 * Key concepts:
 * - staleTime: How long data is considered "fresh" before refetching
 * - gcTime: How long unused data stays in cache before garbage collection
 * - refetchOnWindowFocus: Whether to refetch when user returns to the tab
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        // During this time, cached data is returned without refetching
        staleTime: 1000 * 60,

        // Keep unused data in cache for 5 minutes
        // This allows for instant navigation back to previously visited pages
        gcTime: 1000 * 60 * 5,

        // Refetch data when user returns to the browser tab
        // This ensures users see up-to-date data after being away
        refetchOnWindowFocus: true,

        // Don't retry failed requests automatically in development
        // This makes debugging easier
        retry: process.env.NODE_ENV === 'production' ? 3 : 0,
      },
      mutations: {
        // Mutations don't retry by default
        retry: 0,
      },
    },
  })
}

/**
 * Query Keys Factory
 *
 * Using a factory pattern for query keys provides:
 * - Type safety for query key strings
 * - Consistent key structure across the app
 * - Easy invalidation of related queries
 *
 * @example
 * // Fetch all products
 * useQuery({ queryKey: queryKeys.products.all, queryFn: fetchProducts })
 *
 * // Fetch single product
 * useQuery({ queryKey: queryKeys.products.detail(id), queryFn: () => fetchProduct(id) })
 *
 * // Invalidate all product queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 */
export const queryKeys = {
  products: {
    all: ['products'] as const,
    detail: (id: string) => ['products', id] as const,
  },
}
