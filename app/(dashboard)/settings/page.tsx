import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/auth-actions'
import { updateUserActivity } from '@/lib/actions'
import { NotificationToggle } from './NotificationToggle'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Instellingen</h1>
        <p className="text-zinc-400">Account en voorkeuren</p>
      </header>

      <div className="flex flex-col gap-6 px-4">
        
        {/* Notifications */}
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-bold mb-2">Herinneringen</h2>
          <p className="text-sm text-zinc-400 mb-4">Duolingo-stijl push notificaties om je streak te redden.</p>
          <NotificationToggle />
        </div>

        {/* Account */}
        <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <p className="text-zinc-400 mb-4 text-sm">{user.email}</p>
          <form action={logout}>
            <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl px-4 py-3 font-bold transition-colors">
              Uitloggen
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
