import { Link, createFileRoute } from '@tanstack/react-router'
import { Package, Plus } from 'lucide-react'
import { Breadcrumb } from '../../components/Breadcrumb'
import { ProductTable } from '../../components/ProductTable'
import { useDeleteProduct, useProducts } from '../../hooks/useProducts'

/**
 * Products List Page
 *
 * This route demonstrates the integration of:
 * - TanStack Router: File-based routing with createFileRoute
 * - TanStack Query: Data fetching via useProducts hook
 * - TanStack Table: Data display via ProductTable component
 *
 * Route Path: /products
 *
 * Key Concepts:
 * - createFileRoute: Creates a route based on file location
 * - The component handles loading/error states from TanStack Query
 * - The ProductTable component handles sorting, filtering, and pagination
 */
export const Route = createFileRoute('/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  // Fetch products using our custom hook (wraps TanStack Query)
  const { data: products, isLoading, error } = useProducts()

  // Delete mutation hook
  const deleteMutation = useDeleteProduct()

  // Loading state - shown while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state - shown if the fetch fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Error loading products
            </h2>
            <p className="mt-2 text-red-600">{error.message}</p>
            <p className="mt-4 text-sm text-red-500">
              Make sure the API server is running on port 3001. Run{' '}
              <code className="bg-red-100 px-1 rounded">npm run dev:api</code>{' '}
              to start it.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Products' }]} />

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Package className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
              <p className="text-slate-500">
                Manage your product catalog
              </p>
            </div>
          </div>
          <Link
            to="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProductTable
            products={products ?? []}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800">
            TanStack Table Features Used
          </h3>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li>
              • <strong>Sorting:</strong> Click column headers to sort
            </li>
            <li>
              • <strong>Filtering:</strong> Use the search box or category
              dropdown
            </li>
            <li>
              • <strong>Pagination:</strong> Navigate through pages at the
              bottom
            </li>
            <li>
              • <strong>Type Safety:</strong> All columns are fully typed with
              TypeScript
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
