import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
  params?: Record<string, string>
}

interface BreadcrumbProps {
  items: Array<BreadcrumbItem>
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        to="/"
        className="text-slate-500 hover:text-slate-700 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-slate-400" />
          {item.to ? (
            <Link
              // @ts-expect-error - dynamic route params
              to={item.to}
              params={item.params}
              className="text-slate-500 hover:text-slate-700 transition-colors max-w-[200px] truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium max-w-[200px] truncate">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
