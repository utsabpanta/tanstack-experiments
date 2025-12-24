import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  
  
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Trash2,
} from 'lucide-react'
import { PRODUCT_CATEGORIES } from '../lib/types'
import type {ColumnFiltersState, SortingState} from '@tanstack/react-table';
import type { Product } from '../lib/types'

/**
 * TanStack Table - Product Table Component
 *
 * This component demonstrates key TanStack Table features:
 *
 * 1. Column Definitions - Type-safe column configuration with accessors
 * 2. Sorting - Click column headers to sort ascending/descending
 * 3. Filtering - Global search and category filter
 * 4. Pagination - Navigate through pages of data
 * 5. Row Actions - Edit, view, delete actions per row
 *
 * Key Concepts:
 * - useReactTable: The main hook that creates the table instance
 * - getCoreRowModel: Required - provides basic row functionality
 * - getSortedRowModel: Enables client-side sorting
 * - getFilteredRowModel: Enables client-side filtering
 * - getPaginationRowModel: Enables client-side pagination
 *
 * @see https://tanstack.com/table/latest/docs/framework/react/react-table
 */

interface ProductTableProps {
  products: Array<Product>
  onDelete: (id: string) => void
  isDeleting?: boolean
}

// Column helper provides type safety for column definitions
const columnHelper = createColumnHelper<Product>()

export function ProductTable({
  products,
  onDelete,
  isDeleting,
}: ProductTableProps) {
  // Table state - managed by React, passed to useReactTable
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  /**
   * Column Definitions
   *
   * Each column is defined with:
   * - accessorKey/accessorFn: How to get the cell value
   * - header: What to render in the header (can be a function for sorting UI)
   * - cell: How to render the cell (can access row data via info.getValue())
   *
   * The columnHelper.accessor() method provides full type inference.
   */
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-slate-600 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
            {info.getValue()}
          </span>
        ),
        filterFn: 'equals', // Use exact match for category filtering
      }),
      columnHelper.accessor('price', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-slate-600 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Price
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono">${info.getValue().toFixed(2)}</span>
        ),
      }),
      columnHelper.accessor('stock', {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-slate-600 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Stock
            <ArrowUpDown className="h-4 w-4" />
          </button>
        ),
        cell: (info) => {
          const stock = info.getValue()
          // Color-code stock levels for visual feedback
          const colorClass =
            stock <= 5
              ? 'text-red-600 bg-red-50'
              : stock <= 20
                ? 'text-yellow-600 bg-yellow-50'
                : 'text-green-600 bg-green-50'
          return (
            <span className={`px-2 py-1 rounded font-medium ${colorClass}`}>
              {stock}
            </span>
          )
        },
      }),
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: (info) => (
          <span className="font-mono text-sm text-slate-500">
            {info.getValue()}
          </span>
        ),
      }),
      // Display column for actions (no accessor needed)
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link
              to="/products/$productId"
              params={{ productId: row.original.id }}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              to="/products/$productId/edit"
              params={{ productId: row.original.id }}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
              title="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete "${row.original.name}"?`,
                  )
                ) {
                  onDelete(row.original.id)
                }
              }}
              disabled={isDeleting}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [onDelete, isDeleting],
  )

  /**
   * useReactTable Hook
   *
   * This is the main hook that creates the table instance.
   * It takes:
   * - data: The array of data to display
   * - columns: Column definitions
   * - state: Controlled state for sorting, filtering, etc.
   * - onStateChange: Callbacks to update controlled state
   * - *RowModel functions: Enable specific features
   */
  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Show 5 items per page
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search Filter */}
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
        />

        {/* Category Filter */}
        <select
          value={
            (table.getColumn('category')?.getFilterValue() as string) || ''
          }
          onChange={(e) =>
            table
              .getColumn('category')
              ?.setFilterValue(e.target.value || undefined)
          }
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white"
        >
          <option value="">All Categories</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No products found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Showing{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-slate-700">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
