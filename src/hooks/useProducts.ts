import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from '../lib/api'
import { queryKeys } from '../lib/queryClient'
import type { UpdateProductInput } from '../lib/types'

/**
 * TanStack Query Hooks for Products
 *
 * These custom hooks wrap TanStack Query's useQuery and useMutation
 * to provide a clean, type-safe API for product operations.
 *
 * Benefits of this pattern:
 * - Encapsulates query keys and fetch functions
 * - Provides consistent caching behavior
 * - Enables easy testing and mocking
 * - Reduces boilerplate in components
 */

/**
 * Fetch all products
 *
 * This hook returns the complete list of products with automatic
 * caching and background refetching.
 *
 * @example
 * function ProductList() {
 *   const { data: products, isLoading, error } = useProducts()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return products.map(p => <div key={p.id}>{p.name}</div>)
 * }
 */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: fetchProducts,
  })
}

/**
 * Fetch a single product by ID
 *
 * Uses the product ID as part of the query key for granular caching.
 * The query is enabled only when an ID is provided.
 *
 * @param id - Product ID to fetch (optional for conditional fetching)
 *
 * @example
 * function ProductDetail({ productId }: { productId: string }) {
 *   const { data: product, isLoading } = useProduct(productId)
 *
 *   if (isLoading) return <Skeleton />
 *   return <ProductCard product={product} />
 * }
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ''),
    queryFn: () => fetchProduct(id!),
    // Only run the query if we have an ID
    enabled: !!id,
  })
}

/**
 * Create a new product
 *
 * On success, this mutation invalidates the products list query
 * to trigger a refetch with the new product included.
 *
 * @example
 * function CreateProductForm() {
 *   const createMutation = useCreateProduct()
 *
 *   const handleSubmit = (data: CreateProductInput) => {
 *     createMutation.mutate(data, {
 *       onSuccess: () => navigate('/products')
 *     })
 *   }
 * }
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate the products list to refetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

/**
 * Update an existing product
 *
 * This mutation invalidates both:
 * - The specific product query (to refresh detail views)
 * - The products list query (to update list views)
 *
 * @example
 * function EditProductForm({ productId }: { productId: string }) {
 *   const updateMutation = useUpdateProduct()
 *
 *   const handleSubmit = (data: UpdateProductInput) => {
 *     updateMutation.mutate(
 *       { id: productId, data },
 *       { onSuccess: () => navigate(-1) }
 *     )
 *   }
 * }
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      updateProduct(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate both the list and the specific product
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      })
    },
  })
}

/**
 * Delete a product
 *
 * After successful deletion, invalidates the products list query.
 * The specific product cache entry will be removed automatically
 * when garbage collection runs.
 *
 * @example
 * function DeleteButton({ productId }: { productId: string }) {
 *   const deleteMutation = useDeleteProduct()
 *
 *   return (
 *     <button
 *       onClick={() => deleteMutation.mutate(productId)}
 *       disabled={deleteMutation.isPending}
 *     >
 *       {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
 *     </button>
 *   )
 * }
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}
