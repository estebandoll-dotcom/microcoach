import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-zinc-400 font-medium animate-pulse">Gegevens ophalen...</p>
    </div>
  )
}
