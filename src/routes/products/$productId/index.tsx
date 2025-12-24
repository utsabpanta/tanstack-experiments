import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit, Package, Trash2 } from 'lucide-react'
import { Breadcrumb } from '../../../components/Breadcrumb'
import { useDeleteProduct, useProduct } from '../../../hooks/useProducts'

/**
 * Product Detail Page
 *
 * This route demonstrates:
 * - TanStack Router: Dynamic route parameters ($productId)
 * - TanStack Query: Fetching single product by ID
 * - Navigation between related routes
 *
 * Route Path: /products/$productId
 *
 * Key Concepts:
 * - Route.useParams(): Access dynamic route parameters
 * - Conditional rendering based on query state
 * - Delete with confirmation and navigation
 */
export const Route = createFileRoute('/products/$productId/')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const navigate = useNavigate()
  // Access the dynamic route parameter
  const { productId } = Route.useParams()

  // Fetch product data
  const { data: product, isLoading, error } = useProduct(productId)

  // Delete mutation
  const deleteMutation = useDeleteProduct()

  // Handle delete action
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${product?.name}"?`)) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          navigate({ to: '/products' })
        },
      })
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Error loading product
            </h2>
            <p className="mt-2 text-red-600">{error.message}</p>
            <Link
              to="/products"
              className="mt-4 inline-block text-red-600 hover:text-red-800 underline"
            >
              Return to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800">
              Product not found
            </h2>
            <p className="mt-2 text-yellow-600">
              The product you're looking for doesn't exist.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block text-yellow-600 hover:text-yellow-800 underline"
            >
              Return to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Format dates for display
  const createdAt = new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const updatedAt = new Date(product.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Stock level styling
  const stockColorClass =
    product.stock <= 5
      ? 'text-red-600 bg-red-50 border-red-200'
      : product.stock <= 20
        ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
        : 'text-green-600 bg-green-50 border-green-200'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Products', to: '/products' },
            { label: product.name },
          ]}
        />

        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h1>
                  <span className="text-sm text-slate-500">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/products/$productId/edit"
                  params={{ productId }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Description
              </h2>
              <p className="mt-2 text-gray-900">{product.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </h2>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </h2>
                <p
                  className={`mt-2 inline-block px-3 py-1 text-lg font-bold rounded border ${stockColorClass}`}
                >
                  {product.stock}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </h2>
                <p className="mt-2 font-mono text-gray-900">{product.sku}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </h2>
                <p className="mt-2 font-mono text-gray-500">{product.id}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-6 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {createdAt}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {updatedAt}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800">
            TanStack Router Features Used
          </h3>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li>
              • <strong>Dynamic Routes:</strong> $productId in the file path
            </li>
            <li>
              • <strong>Route.useParams():</strong> Type-safe access to route
              params
            </li>
            <li>
              • <strong>Link Component:</strong> Client-side navigation with
              params
            </li>
            <li>
              • <strong>useNavigate:</strong> Programmatic navigation after
              actions
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
