# TanStack Demo Application

A comprehensive demo application showcasing the TanStack ecosystem including **TanStack Start**, **TanStack Query**, **TanStack Form**, and **TanStack Table**.

This project serves as a learning resource for developers looking to understand how these powerful libraries work together to build modern, type-safe web applications.

## What's Inside

| Library                                      | Purpose                                            | Demo Location                     |
| -------------------------------------------- | -------------------------------------------------- | --------------------------------- |
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework with file-based routing | `src/routes/`                     |
| [TanStack Query](https://tanstack.com/query) | Data fetching, caching, and state management       | `src/hooks/useProducts.ts`        |
| [TanStack Form](https://tanstack.com/form)   | Form state management with validation              | `src/components/ProductForm.tsx`  |
| [TanStack Table](https://tanstack.com/table) | Headless table with sorting, filtering, pagination | `src/components/ProductTable.tsx` |

## Quick Start

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/utsabpanta/tanstack-experiments.git
cd tanstack-experiments

# Install dependencies
npm install

# Start development servers (app + API)
npm run dev
```

This will start:

- **App**: http://localhost:3000 (TanStack Start application)
- **API**: http://localhost:3001 (json-server mock API)

## Project Structure

```
tanstack-experiments/
├── src/
│   ├── routes/                    # TanStack Router file-based routes
│   │   ├── __root.tsx            # Root layout with Query provider
│   │   ├── index.tsx             # Home/Dashboard page
│   │   └── products/
│   │       ├── index.tsx         # Product list (Table demo)
│   │       ├── new.tsx           # Create product (Form demo)
│   │       └── $productId/
│   │           ├── index.tsx     # Product detail (Query demo)
│   │           └── edit.tsx      # Edit product (Form + Query)
│   ├── components/
│   │   ├── Header.tsx            # Navigation sidebar
│   │   ├── ProductTable.tsx      # TanStack Table implementation
│   │   └── ProductForm.tsx       # TanStack Form implementation
│   ├── hooks/
│   │   └── useProducts.ts        # TanStack Query hooks
│   └── lib/
│       ├── api.ts                # API client functions
│       ├── queryClient.ts        # Query client configuration
│       └── types.ts              # TypeScript types
├── db.json                        # Mock database for json-server
├── docs/                          # Detailed documentation
│   ├── TANSTACK_ROUTER.md
│   ├── TANSTACK_QUERY.md
│   ├── TANSTACK_FORM.md
│   └── TANSTACK_TABLE.md
└── package.json
```

## Available Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start both app and API servers |
| `npm run dev:app` | Start only the Vite dev server |
| `npm run dev:api` | Start only the json-server API |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |
| `npm run test`    | Run tests with Vitest          |

## Features Demonstrated

### TanStack Start (Router)

- **File-based routing**: Routes defined by file structure in `src/routes/`
- **Dynamic routes**: `$productId` parameter for product detail/edit pages
- **Type-safe navigation**: Full TypeScript inference for route params
- **Layouts**: Root layout with shared header and Query provider

```tsx
// Dynamic route example (src/routes/products/$productId/index.tsx)
export const Route = createFileRoute('/products/$productId/')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { productId } = Route.useParams() // Type-safe!
  // ...
}
```

### TanStack Query

- **Data fetching**: `useQuery` for products list and detail
- **Mutations**: `useMutation` for create, update, delete operations
- **Cache invalidation**: Automatic refetch after mutations
- **Loading/error states**: Built-in handling for all async states

```tsx
// Query hook example (src/hooks/useProducts.ts)
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
```

### TanStack Form

- **Form state management**: Controlled forms with `useForm`
- **Field validation**: Real-time validation with Zod schemas
- **Error display**: Field-level error messages
- **Submit handling**: Type-safe form submission

```tsx
// Form example (src/components/ProductForm.tsx)
const form = useForm({
  defaultValues: { name: '', price: 0, ... },
  onSubmit: async ({ value }) => {
    onSubmit(value)
  },
})

<form.Field
  name="name"
  validators={{ onChange: z.string().min(2) }}
>
  {(field) => (
    <input
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  )}
</form.Field>
```

### TanStack Table

- **Column definitions**: Type-safe column configuration
- **Sorting**: Click headers to sort ascending/descending
- **Filtering**: Global search and category filter
- **Pagination**: Navigate through pages of data

```tsx
// Table example (src/components/ProductTable.tsx)
const table = useReactTable({
  data: products,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

## Mock API

The project uses [json-server](https://github.com/typicode/json-server) to provide a REST API for the product catalog.

**Endpoints:**

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/products`     | List all products  |
| GET    | `/products/:id` | Get single product |
| POST   | `/products`     | Create product     |
| PATCH  | `/products/:id` | Update product     |
| DELETE | `/products/:id` | Delete product     |

**Sample Product:**

```json
{
  "id": "1",
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium noise-canceling headphones",
  "price": 149.99,
  "category": "Electronics",
  "stock": 45,
  "sku": "WBH-001",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:22:00Z"
}
```

## Learning Resources

### Code Comments

Every file in this project includes detailed comments explaining:

- What the code does
- Why certain patterns are used
- Links to relevant documentation

### Detailed Guides

Check the `docs/` folder for in-depth explanations:

- [TANSTACK_ROUTER.md](./docs/TANSTACK_ROUTER.md) - Routing concepts and patterns
- [TANSTACK_QUERY.md](./docs/TANSTACK_QUERY.md) - Data fetching and caching
- [TANSTACK_FORM.md](./docs/TANSTACK_FORM.md) - Form management and validation
- [TANSTACK_TABLE.md](./docs/TANSTACK_TABLE.md) - Table features and configuration

### Official Documentation

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Form Docs](https://tanstack.com/form/latest)
- [TanStack Table Docs](https://tanstack.com/table/latest)

## Tech Stack

- **Framework**: TanStack Start (React 19)
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Icons**: Lucide React
- **API**: json-server
- **Language**: TypeScript 5

## Contributing

This is a learning resource! Feel free to:

- Add more examples
- Improve documentation
- Fix bugs
- Suggest enhancements

## License

MIT
