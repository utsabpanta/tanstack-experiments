import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Breadcrumb } from '../../components/Breadcrumb'
import { ProductForm } from '../../components/ProductForm'
import { useCreateProduct } from '../../hooks/useProducts'

/**
 * Create Product Page
 *
 * This route demonstrates:
 * - TanStack Form: Form state management with validation
 * - TanStack Query: Mutation for creating products
 * - TanStack Router: Navigation after successful creation
 *
 * Route Path: /products/new
 */
export const Route = createFileRoute('/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  const navigate = useNavigate()
  const createMutation = useCreateProduct()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Products', to: '/products' }, { label: 'New' }]}
        />

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-slate-100 rounded-lg">
            <Plus className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Create Product
            </h1>
            <p className="text-slate-500">
              Add a new product to your catalog
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProductForm
            onSubmit={(data) => {
              createMutation.mutate(data, {
                onSuccess: () => {
                  // Navigate to products list on success
                  navigate({ to: '/products' })
                },
              })
            }}
            isSubmitting={createMutation.isPending}
          />

          {/* Error Display */}
          {createMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{createMutation.error.message}</p>
            </div>
          )}
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-800">
            TanStack Form Features Used
          </h3>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li>
              • <strong>useForm Hook:</strong> Manages form state and validation
            </li>
            <li>
              • <strong>form.Field:</strong> Declarative field components
            </li>
            <li>
              • <strong>Zod Validation:</strong> Schema-based validation via
              adapter
            </li>
            <li>
              • <strong>onChange Validation:</strong> Real-time feedback as you
              type
            </li>
            <li>
              • <strong>form.Subscribe:</strong> React to form state changes
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
