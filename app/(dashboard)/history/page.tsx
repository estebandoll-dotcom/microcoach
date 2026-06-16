import { createClient } from '@/lib/supabase/server'
import { deletePushupSet } from '@/lib/actions'
import { Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch recent entries
  const { data: entries } = await supabase
    .from('pushup_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Historie</h1>
        <p className="text-gray-400">Laatste 50 sets</p>
      </header>

      <div className="flex flex-col gap-3">
        {entries && entries.length > 0 ? entries.map(entry => (
          <div key={entry.id} className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border">
            <div>
              <p className="font-bold text-lg">+{entry.amount} Push-ups</p>
              <p className="text-sm text-gray-500">
                {new Date(entry.logged_at).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })} om {new Date(entry.logged_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <form action={async () => {
              'use server'
              await deletePushupSet(entry.id)
            }}>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </form>
          </div>
        )) : (
          <p className="text-center text-gray-500 mt-10">Geen historie gevonden.</p>
        )}
      </div>
    </div>
  )
}
