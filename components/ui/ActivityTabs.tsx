'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ActivityTabs({ currentActivity }: { currentActivity: string }) {
  return (
    <div className="flex bg-zinc-900 rounded-full p-1 mx-auto max-w-sm mb-6">
      <Link
        href="?activity=pushups"
        className={cn(
          "flex-1 text-center py-2 rounded-full text-sm font-medium transition-colors",
          currentActivity === 'pushups' 
            ? "bg-primary text-primary-foreground" 
            : "text-zinc-400 hover:text-white"
        )}
      >
        Push-ups
      </Link>
      <Link
        href="?activity=walking"
        className={cn(
          "flex-1 text-center py-2 rounded-full text-sm font-medium transition-colors",
          currentActivity === 'walking' 
            ? "bg-primary text-primary-foreground" 
            : "text-zinc-400 hover:text-white"
        )}
      >
        Wandelen
      </Link>
    </div>
  )
}
