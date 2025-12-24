# TanStack Form Guide

TanStack Form is a headless form library that provides powerful form state management with first-class TypeScript support and validation integration.

## Key Concepts

### useForm Hook

The `useForm` hook creates and manages form state:

```tsx
import { useForm } from '@tanstack/react-form'

function MyForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted:', value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* Fields go here */}
    </form>
  )
}
```

### form.Field Component

Use `form.Field` to create individual form fields:

```tsx
<form.Field name="name">
  {(field) => (
    <div>
      <label htmlFor={field.name}>Name</label>
      <input
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  )}
</form.Field>
```

### Field State

Each field has access to its state:

```tsx
field.state.value // Current value
field.state.meta.errors // Array of error messages
field.state.meta.isTouched // Has the field been focused?
field.state.meta.isValidating // Is validation running?
```

## Validation

### With Zod

TanStack Form v1 supports Zod schemas directly in the validators:

```tsx
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const form = useForm({
  defaultValues: { name: '', age: 0 },
  onSubmit: async ({ value }) => {
    // value is type-safe
  },
})

// Field-level validation with Zod schema
<form.Field
  name="name"
  validators={{
    onChange: z.string().min(2, 'Name must be at least 2 characters'),
  }}
>
  {(field) => (
    <>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.length > 0 && (
        <span className="error">{field.state.meta.errors.join(', ')}</span>
      )}
    </>
  )}
</form.Field>
```

### Validation Timing

Control when validation runs:

```tsx
validators={{
  onChange: schema,     // Validate on every change
  onBlur: schema,      // Validate when field loses focus
  onSubmit: schema,    // Validate on form submit
}}
```

### Custom Validators

Write custom validation functions:

```tsx
<form.Field
  name="email"
  validators={{
    onChange: ({ value }) => {
      if (!value.includes('@')) {
        return 'Invalid email address'
      }
      return undefined // No error
    },
  }}
>
```

## Demo Implementation

### Product Form Schema

```tsx
// Zod schema for product validation
const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be at least $0.01'),
  category: z.enum(['Electronics', 'Furniture', 'Lighting', 'Accessories']),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase letters, numbers, hyphens'),
})
```

### Complete Form Component

```tsx
export function ProductForm({ initialData, onSubmit, isSubmitting }) {
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
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        validators={{ onChange: productSchema.shape.name }}
      >
        {(field) => (
          <div>
            <label>Product Name</label>
            <input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? 'error' : ''}
            />
            {field.state.meta.errors.map((error, i) => (
              <p key={i} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      {/* More fields... */}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, formIsSubmitting]) => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

### Edit Mode with Initial Data

```tsx
// Create mode - no initial data
<ProductForm onSubmit={handleCreate} />

// Edit mode - pass existing product data
<ProductForm initialData={product} onSubmit={handleUpdate} />
```

## Form State Subscription

Subscribe to form state changes:

```tsx
// Subscribe to specific state
<form.Subscribe selector={(state) => state.canSubmit}>
  {(canSubmit) => (
    <button disabled={!canSubmit}>Submit</button>
  )}
</form.Subscribe>

// Subscribe to multiple values
<form.Subscribe selector={(state) => [state.isSubmitting, state.values.name]}>
  {([isSubmitting, name]) => (
    <div>Submitting {name}...</div>
  )}
</form.Subscribe>
```

## Input Types

### Text Input

```tsx
<input
  type="text"
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
/>
```

### Number Input

```tsx
<input
  type="number"
  value={field.state.value}
  onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
/>
```

### Select Input

```tsx
<select
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
>
  <option value="">Select...</option>
  {options.map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>
```

### Textarea

```tsx
<textarea
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
  rows={4}
/>
```

## Best Practices

1. **Use Zod for validation**: Type-safe schemas with great error messages
2. **Validate on change**: Provide immediate feedback
3. **Handle loading states**: Disable submit button during submission
4. **Show field errors**: Display errors near the relevant field
5. **Support edit mode**: Accept initial data for pre-populating forms

## Resources

- [TanStack Form Documentation](https://tanstack.com/form/latest)
- [Zod Form Adapter](https://tanstack.com/form/latest/docs/framework/react/guides/validation#adapter-based-validation-zod-yup-valibot)
- [Field API Reference](https://tanstack.com/form/latest/docs/framework/react/reference/fieldApi)
