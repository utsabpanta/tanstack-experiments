import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Database,
  ExternalLink,
  FileCode,
  FormInput,
  Globe,
  Layers,
  LayoutGrid,
  Package,
  Server,
  Table,
  TrendingUp,
} from 'lucide-react'
import { useProducts } from '../hooks/useProducts'

/**
 * Home/Dashboard Page
 *
 * This page provides an overview of the TanStack demo application:
 * - Quick stats from the product catalog
 * - Interactive demos organized by category
 * - Links to explore each feature
 *
 * Route Path: /
 */
export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { data: products, isLoading } = useProducts()

  const totalProducts = products?.length ?? 0
  const lowStockCount = products?.filter((p) => p.stock <= 5).length ?? 0
  const categories = [...new Set(products?.map((p) => p.category) ?? [])]
  const totalValue =
    products?.reduce((sum, p) => sum + p.price * p.stock, 0) ?? 0
  const recentProducts = products?.slice(0, 5) ?? []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-8 h-8 text-slate-400" />
            <h1 className="text-3xl font-semibold">TanStack Demo</h1>
          </div>
          <p className="text-slate-400 max-w-xl mb-6">
            A hands-on demo showcasing TanStack Start, Query, Form, and Table
            working together in a product catalog application.
          </p>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-medium rounded-md hover:bg-slate-100 transition-colors"
            >
              View Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/utsabpanta/tanstack-experiments"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-300 font-medium rounded-md hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FileCode className="w-4 h-4" />
              Source Code
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-8">
            <Link
              to="/products"
              className="flex items-center gap-3 hover:text-slate-900 transition-colors group"
            >
              <Package className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Products
                </p>
                {isLoading ? (
                  <div className="h-6 w-8 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <p className="text-xl font-semibold text-slate-900">
                    {totalProducts}
                  </p>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Categories
                </p>
                {isLoading ? (
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <p className="text-xl font-semibold text-slate-900">
                    {categories.length}
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/products"
              className="flex items-center gap-3 hover:text-slate-900 transition-colors group"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Low Stock
                </p>
                {isLoading ? (
                  <div className="h-6 w-6 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <p className="text-xl font-semibold text-slate-900">
                    {lowStockCount}
                  </p>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Inventory Value
                </p>
                {isLoading ? (
                  <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
                ) : (
                  <p className="text-xl font-semibold text-slate-900">
                    ${totalValue.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Demos */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Catalog Section */}
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Product Catalog
              </h2>
              <div className="space-y-3">
                <Link
                  to="/products"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <Table className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Product List
                      </h3>
                      <p className="text-sm text-slate-500">
                        Data table with sorting, filtering, and pagination
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      Table
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </Link>

                <Link
                  to="/products/new"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <FormInput className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Create Product
                      </h3>
                      <p className="text-sm text-slate-500">
                        Form with Zod validation and error handling
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      Form
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </Link>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Database className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-700">
                        Data Fetching
                      </h3>
                      <p className="text-sm text-slate-500">
                        Caching, background refetch, and cache invalidation
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                    Query
                  </span>
                </div>
              </div>
            </section>

            {/* Server Features Section */}
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Server Features
              </h2>
              <div className="space-y-3">
                <Link
                  to="/demo/start/server-funcs"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <Server className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Server Functions
                      </h3>
                      <p className="text-sm text-slate-500">
                        Type-safe RPC with automatic serialization
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </Link>

                <Link
                  to="/demo/start/api-request"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <Globe className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">API Routes</h3>
                      <p className="text-sm text-slate-500">
                        REST endpoints with full type safety
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </Link>

                <Link
                  to="/demo/start/ssr"
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                      <FileCode className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Rendering Modes
                      </h3>
                      <p className="text-sm text-slate-500">
                        Compare SPA, SSR, and streaming strategies
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Products */}
            {!isLoading && recentProducts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Recent Products
                  </h2>
                  <Link
                    to="/products"
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    View all
                  </Link>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                  {recentProducts.map((product) => (
                    <Link
                      key={product.id}
                      to="/products/$productId"
                      params={{ productId: product.id }}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-sm truncate group-hover:text-slate-700">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-medium text-slate-900 text-sm">
                          ${product.price.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs ${product.stock <= 5 ? 'text-amber-600' : 'text-slate-500'}`}
                        >
                          {product.stock} in stock
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Documentation Links */}
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Documentation
              </h2>
              <div className="space-y-2">
                {[
                  { name: 'TanStack Start', url: 'https://tanstack.com/start' },
                  {
                    name: 'TanStack Query',
                    url: 'https://tanstack.com/query',
                  },
                  { name: 'TanStack Form', url: 'https://tanstack.com/form' },
                  {
                    name: 'TanStack Table',
                    url: 'https://tanstack.com/table',
                  },
                ].map((lib) => (
                  <a
                    key={lib.name}
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors group"
                  >
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">
                      {lib.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>TanStack Demo</span>
          </div>
          <p>A learning resource for the TanStack ecosystem</p>
        </div>
      </footer>
    </div>
  )
}
