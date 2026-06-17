'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ActivityTabs({ currentActivity }: { currentActivity: string }) {
  return (
    <div className="flex bg-zinc-900 rounded-full p-1 mx-auto w-full max-w-sm mb-6 overflow-x-auto hide-scrollbar">
      {[
        { id: 'pushups', label: 'Push-ups' },
        { id: 'walking', label: 'Wandelen' },
        { id: 'squats', label: 'Squats' },
        { id: 'crunches', label: 'Crunches' }
      ].map((tab) => (
        <Link
          key={tab.id}
          href={`?activity=${tab.id}`}
          className={cn(
            "flex-1 text-center py-2 px-3 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
            currentActivity === tab.id 
              ? "bg-primary text-primary-foreground" 
              : "text-zinc-400 hover:text-white"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
