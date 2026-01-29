'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-md transition-colors font-medium',
        isActive
          ? 'bg-teal-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {children}
    </Link>
  )
}
