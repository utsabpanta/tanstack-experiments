import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'

import { PRODUCT_CATEGORIES } from '../lib/types'

import type { CreateProductInput, Product } from '../lib/types'

/**
 * Helper to extract error messages from field errors
 * Handles both string errors and object errors with message property
 */
function getErrorMessages(errors: Array<unknown>): string {
  return errors
    .map((error) => {
      if (typeof error === 'string') return error
      if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message: string }).message
      }
      return String(error)
    })
    .join(', ')
}

/**
 * TanStack Form - Product Form Component
 *
 * This component demonstrates key TanStack Form features:
 *
 * 1. useForm Hook - Creates and manages form state
 * 2. form.Field - Declarative field components with validation
 * 3. Zod Integration - Schema-based validation via @tanstack/zod-form-adapter
 * 4. Error Handling - Display validation errors per field
 * 5. Form Submission - Type-safe submit handling
 *
 * Key Concepts:
 * - validators: Can be form-level or field-level
 * - onChange/onBlur: When to run validation
 * - field.state: Contains value, errors, touched state
 * - form.Subscribe: Subscribe to form state changes
 *
 * @see https://tanstack.com/form/latest/docs/framework/react/quick-start
 */

interface ProductFormProps {
  /** Initial values for editing (undefined for create mode) */
  initialData?: Product
  /** Called when form is submitted with valid data */
  onSubmit: (data: CreateProductInput) => void
  /** Whether the form is currently submitting */
  isSubmitting?: boolean
}

/**
 * Zod Schema for Product Validation
 *
 * Using Zod provides:
 * - Type inference for form values
 * - Declarative validation rules
 * - Custom error messages
 * - Composable schemas
 */
const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  price: z
    .number()
    .min(0.01, 'Price must be at least $0.01')
    .max(99999.99, 'Price must be less than $100,000'),
  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(10000, 'Stock cannot exceed 10,000'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(20, 'SKU must be less than 20 characters')
    .regex(
      /^[A-Z0-9-]+$/,
      'SKU must contain only uppercase letters, numbers, and hyphens',
    ),
})

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  /**
   * useForm Hook
   *
   * Creates a form instance with:
   * - defaultValues: Initial field values
   * - validatorAdapter: Connects Zod to TanStack Form
   * - onSubmit: Called when form is valid and submitted
   *
   * The form instance provides:
   * - form.Field: Component for individual fields
   * - form.handleSubmit: Submit handler
   * - form.Subscribe: Subscribe to form state
   */
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price ?? 0,
      category: initialData?.category ?? '',
      stock: initialData?.stock ?? 0,
      sku: initialData?.sku ?? '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: ({ value }) => {
      // Cast to CreateProductInput since we've validated with Zod
      onSubmit(value as CreateProductInput)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      {/* Name Field */}
      <form.Field
        name="name"
        validators={{
          onChange: productSchema.shape.name,
        }}
      >
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Product Name
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-slate-300'
              }`}
              placeholder="Enter product name"
            />
            {/* Error Display */}
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Description Field */}
      <form.Field
        name="description"
        validators={{
          onChange: productSchema.shape.description,
        }}
      >
        {(field) => (
          <div>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={3}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 ${
                field.state.meta.errors.length > 0
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-slate-300'
              }`}
              placeholder="Describe your product"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-sm text-red-600">
                {getErrorMessages(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Price and Stock - Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Field */}
        <form.Field
          name="price"
          validators={{
            onChange: productSchema.shape.price,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Price ($)
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                step="0.01"
                min="0"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseFloat(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-slate-300'
                }`}
                placeholder="0.00"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Stock Field */}
        <form.Field
          name="stock"
          validators={{
            onChange: productSchema.shape.stock,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Stock Quantity
              </label>
              <input
                id={field.name}
                name={field.name}
                type="number"
                min="0"
                step="1"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value) || 0)
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-slate-300'
                }`}
                placeholder="0"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Category and SKU - Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Field */}
        <form.Field
          name="category"
          validators={{
            onChange: productSchema.shape.category,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Category
              </label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-slate-300'
                }`}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* SKU Field */}
        <form.Field
          name="sku"
          validators={{
            onChange: productSchema.shape.sku,
          }}
        >
          {(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                SKU
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value.toUpperCase())
                }
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 font-mono ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-300'
                    : 'border-slate-300'
                }`}
                placeholder="ABC-123"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessages(field.state.meta.errors)}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Uppercase letters, numbers, and hyphens only
              </p>
            </div>
          )}
        </form.Field>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, formIsSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || formIsSubmitting}
              className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isSubmitting || formIsSubmitting
                ? 'Saving...'
                : initialData
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          )}
        </form.Subscribe>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
