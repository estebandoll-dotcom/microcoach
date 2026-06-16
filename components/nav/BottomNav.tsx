'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-border flex justify-around p-4 pb-8 z-50">
      <Link href="/" className={cn("flex flex-col items-center gap-1 transition-colors", pathname === '/' ? "text-primary" : "text-gray-500 hover:text-gray-300")}>
        <Flame size={24} />
        <span className="text-xs font-semibold">Vandaag</span>
      </Link>
      
      <Link href="/history" className={cn("flex flex-col items-center gap-1 transition-colors", pathname === '/history' ? "text-primary" : "text-gray-500 hover:text-gray-300")}>
        <History size={24} />
        <span className="text-xs font-semibold">Historie</span>
      </Link>
      
      <Link href="/settings" className={cn("flex flex-col items-center gap-1 transition-colors", pathname === '/settings' ? "text-primary" : "text-gray-500 hover:text-gray-300")}>
        <Settings size={24} />
        <span className="text-xs font-semibold">Instellingen</span>
      </Link>
    </nav>
  )
}
