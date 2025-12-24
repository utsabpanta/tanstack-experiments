import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Home,
  Layers,
  Menu,
  Network,
  Package,
  Plus,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
      <header className="px-4 py-3 flex items-center bg-slate-900 text-white">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="ml-3 text-lg font-medium">
          <Link to="/" className="flex items-center gap-2">
            <Layers size={22} className="text-slate-400" />
            <span>TanStack Demo</span>
          </Link>
        </h1>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-medium">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
            }}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {/* Product Catalog Links */}
          <div className="mt-5 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2.5">
              Product Catalog
            </span>
          </div>

          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
            }}
          >
            <Package size={18} />
            <span>Products</span>
          </Link>

          <Link
            to="/products/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
            }}
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>

          {/* Demo Links Start */}
          <div className="mt-5 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2.5">
              Server Features
            </span>
          </div>

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
            }}
          >
            <SquareFunction size={18} />
            <span>Server Functions</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
            activeProps={{
              className:
                'flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
            }}
          >
            <Network size={18} />
            <span>API Routes</span>
          </Link>

          <div className="flex flex-row justify-between">
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-300 hover:text-white"
              activeProps={{
                className:
                  'flex-1 flex items-center gap-3 p-2.5 rounded-md bg-slate-800 text-white transition-colors mb-1',
              }}
            >
              <StickyNote size={18} />
              <span>Rendering Modes</span>
            </Link>
            <button
              className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {groupedExpanded.StartSSRDemo && (
            <div className="flex flex-col ml-4 border-l border-slate-800 pl-3">
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-400 hover:text-white text-sm"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-2 rounded-md bg-slate-800 text-white transition-colors mb-1 text-sm',
                }}
              >
                <span>SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-400 hover:text-white text-sm"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-2 rounded-md bg-slate-800 text-white transition-colors mb-1 text-sm',
                }}
              >
                <span>Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 transition-colors mb-1 text-slate-400 hover:text-white text-sm"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-2 rounded-md bg-slate-800 text-white transition-colors mb-1 text-sm',
                }}
              >
                <span>Data Only</span>
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  )
}
