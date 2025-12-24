# TanStack Table Guide

TanStack Table is a headless UI library for building powerful tables and datagrids with features like sorting, filtering, and pagination.

## Key Concepts

### Headless Architecture

TanStack Table is "headless" - it provides the logic but not the UI. You have complete control over rendering:

```tsx
// You control the markup
<table>
  <thead>...</thead>
  <tbody>...</tbody>
</table>

// Or use any UI library
<MUITable>...</MUITable>
<ChakraTable>...</ChakraTable>
```

### useReactTable Hook

The main hook that creates and manages the table:

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data, // Your data array
  columns, // Column definitions
  getCoreRowModel: getCoreRowModel(),
})
```

## Column Definitions

### Column Helper

Use the column helper for type-safe column definitions:

```tsx
import { createColumnHelper } from '@tanstack/react-table'

type Product = {
  id: string
  name: string
  price: number
  category: string
}

const columnHelper = createColumnHelper<Product>()

const columns = [
  // Accessor column - gets value from data
  columnHelper.accessor('name', {
    header: 'Product Name',
    cell: (info) => info.getValue(),
  }),

  // Accessor with custom cell
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),

  // Display column - for actions, no data accessor
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button onClick={() => handleEdit(row.original.id)}>Edit</button>
    ),
  }),
]
```

### Header with Sorting

Make headers interactive for sorting:

```tsx
columnHelper.accessor('name', {
  header: ({ column }) => (
    <button onClick={() => column.toggleSorting()}>
      Name {column.getIsSorted() === 'asc' ? '↑' : '↓'}
    </button>
  ),
})
```

## Features

### Sorting

Enable client-side sorting:

```tsx
import { getSortedRowModel } from '@tanstack/react-table'

const [sorting, setSorting] = useState([])

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Filtering

Enable global and column filtering:

```tsx
import { getFilteredRowModel } from '@tanstack/react-table'

const [globalFilter, setGlobalFilter] = useState('')
const [columnFilters, setColumnFilters] = useState([])

const table = useReactTable({
  data,
  columns,
  state: { globalFilter, columnFilters },
  onGlobalFilterChange: setGlobalFilter,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

// Global search input
<input
  value={globalFilter ?? ''}
  onChange={(e) => setGlobalFilter(e.target.value)}
  placeholder="Search..."
/>

// Column-specific filter
<select
  value={table.getColumn('category')?.getFilterValue() ?? ''}
  onChange={(e) =>
    table.getColumn('category')?.setFilterValue(e.target.value || undefined)
  }
>
  <option value="">All Categories</option>
  <option value="Electronics">Electronics</option>
</select>
```

### Pagination

Enable client-side pagination:

```tsx
import { getPaginationRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: { pageSize: 10 },
  },
})

// Pagination controls
<button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  Previous
</button>

<span>
  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
</span>

<button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  Next
</button>
```

## Rendering the Table

### Basic Table Rendering

```tsx
<table>
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

### flexRender

Use `flexRender` to render column definitions:

```tsx
import { flexRender } from '@tanstack/react-table'

// For headers
flexRender(header.column.columnDef.header, header.getContext())

// For cells
flexRender(cell.column.columnDef.cell, cell.getContext())
```

## Demo Implementation

### Complete ProductTable

```tsx
export function ProductTable({ products, onDelete, isDeleting }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting()}>
            Name <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => <span className="badge">{info.getValue()}</span>,
        filterFn: 'equals',
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue()
          const color = stock <= 5 ? 'red' : stock <= 20 ? 'yellow' : 'green'
          return <span className={`badge-${color}`}>{stock}</span>
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link to={`/products/${row.original.id}`}>View</Link>
            <Link to={`/products/${row.original.id}/edit`}>Edit</Link>
            <button onClick={() => onDelete(row.original.id)}>Delete</button>
          </div>
        ),
      }),
    ],
    [onDelete],
  )

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  return (
    <div>
      {/* Filters */}
      <div className="filters">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search products..."
        />
        <select
          value={table.getColumn('category')?.getFilterValue() ?? ''}
          onChange={(e) =>
            table
              .getColumn('category')
              ?.setFilterValue(e.target.value || undefined)
          }
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <span>
          Showing{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}
          of {table.getFilteredRowModel().rows.length}
        </span>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## Row Models Explained

| Row Model               | Purpose                            |
| ----------------------- | ---------------------------------- |
| `getCoreRowModel`       | Required - basic row functionality |
| `getSortedRowModel`     | Client-side sorting                |
| `getFilteredRowModel`   | Client-side filtering              |
| `getPaginationRowModel` | Client-side pagination             |
| `getGroupedRowModel`    | Row grouping                       |
| `getExpandedRowModel`   | Expandable rows                    |

## Best Practices

1. **Memoize columns**: Use `useMemo` for column definitions
2. **Use column helper**: Type-safe column creation
3. **Controlled state**: Manage state with React for flexibility
4. **Empty state**: Handle case when no data matches filters
5. **Loading states**: Show skeleton while data loads

## Resources

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [Column Definitions](https://tanstack.com/table/latest/docs/guide/column-defs)
- [Sorting Guide](https://tanstack.com/table/latest/docs/guide/sorting)
- [Filtering Guide](https://tanstack.com/table/latest/docs/guide/filtering)
- [Pagination Guide](https://tanstack.com/table/latest/docs/guide/pagination)
