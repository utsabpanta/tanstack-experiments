import type { CreateProductInput, Product, UpdateProductInput } from './types'

/**
 * API Configuration
 *
 * The base URL points to our json-server instance running on port 3001.
 * In a production app, this would come from environment variables.
 */
const API_BASE_URL = 'http://localhost:3001'

/**
 * Generic fetch wrapper with error handling
 *
 * This helper ensures consistent error handling across all API calls.
 * It throws an error with the response status text if the request fails.
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Product API Functions
 *
 * These functions provide a clean interface for interacting with the products API.
 * They're designed to work seamlessly with TanStack Query.
 */

/**
 * Fetch all products
 *
 * @example
 * // In a React Query hook:
 * const { data: products } = useQuery({
 *   queryKey: ['products'],
 *   queryFn: fetchProducts
 * })
 */
export async function fetchProducts(): Promise<Array<Product>> {
  return fetchApi<Array<Product>>('/products')
}

/**
 * Fetch a single product by ID
 *
 * @param id - The product ID to fetch
 * @throws Error if product is not found
 *
 * @example
 * const { data: product } = useQuery({
 *   queryKey: ['products', productId],
 *   queryFn: () => fetchProduct(productId)
 * })
 */
export async function fetchProduct(id: string): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`)
}

/**
 * Create a new product
 *
 * @param input - Product data without id, createdAt, updatedAt
 * @returns The created product with generated fields
 *
 * @example
 * const mutation = useMutation({
 *   mutationFn: createProduct,
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
 * })
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const now = new Date().toISOString()
  const productWithDates = {
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  return fetchApi<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(productWithDates),
  })
}

/**
 * Update an existing product
 *
 * @param id - The product ID to update
 * @param input - Partial product data to update
 * @returns The updated product
 *
 * @example
 * const mutation = useMutation({
 *   mutationFn: ({ id, data }) => updateProduct(id, data),
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
 * })
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const updateData = {
    ...input,
    updatedAt: new Date().toISOString(),
  }

  return fetchApi<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  })
}

/**
 * Delete a product
 *
 * @param id - The product ID to delete
 *
 * @example
 * const mutation = useMutation({
 *   mutationFn: deleteProduct,
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
 * })
 */
export async function deleteProduct(id: string): Promise<void> {
  await fetchApi(`/products/${id}`, {
    method: 'DELETE',
  })
}
