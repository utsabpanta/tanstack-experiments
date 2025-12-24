import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Edit } from 'lucide-react'
import { Breadcrumb } from '../../../components/Breadcrumb'
import { ProductForm } from '../../../components/ProductForm'
import { useProduct, useUpdateProduct } from '../../../hooks/useProducts'

/**
 * Edit Product Page
 *
 * This route demonstrates:
 * - TanStack Router: Dynamic route with $productId
 * - TanStack Query: Fetching product for pre-population
 * - TanStack Query: Mutation for updating product
 * - TanStack Form: Pre-populated form with existing data
 *
 * Route Path: /products/$productId/edit
 *
 * Key Concepts:
 * - Loading existing data before rendering form
 * - Passing initialData to form for edit mode
 * - Handling update mutation with cache invalidation
 */
export const Route = createFileRoute('/products/$productId/edit')({
  component: EditProductPage,
})

function EditProductPage() {
  const navigate = useNavigate()
  const { productId } = Route.useParams()

  // Fetch existing product data
  const { data: product, isLoading, error } = useProduct(productId)

  // Update mutation
  const updateMutation = useUpdateProduct()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800">
              Product not found
            </h2>
            <p className="mt-2 text-yellow-600">
              The product you're trying to edit doesn't exist.
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Products', to: '/products' },
            {
              label: product.name,
              to: '/products/$productId',
              params: { productId },
            },
            { label: 'Edit' },
          ]}
        />

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-slate-100 rounded-lg">
            <Edit className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
            <p className="text-slate-500">
              {product.name}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/*
            ProductForm receives initialData to pre-populate fields.
            The form component handles both create and edit modes.
          */}
          <ProductForm
            initialData={product}
            onSubmit={(data) => {
              updateMutation.mutate(
                { id: productId, data },
                {
                  onSuccess: () => {
                    // Navigate back to product detail on success
                    navigate({
                      to: '/products/$productId',
                      params: { productId },
                    })
                  },
                },
              )
            }}
            isSubmitting={updateMutation.isPending}
          />

          {/* Error Display */}
          {updateMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{updateMutation.error.message}</p>
            </div>
          )}
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800">
            Integration Highlights
          </h3>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li>
              • <strong>Query + Form:</strong> useProduct fetches data for form
              pre-population
            </li>
            <li>
              • <strong>Query Mutations:</strong> useUpdateProduct handles the
              update operation
            </li>
            <li>
              • <strong>Cache Invalidation:</strong> Update automatically
              refreshes related queries
            </li>
            <li>
              • <strong>Router Navigation:</strong> Redirect to detail page
              after success
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
