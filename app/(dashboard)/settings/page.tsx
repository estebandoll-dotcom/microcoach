import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/auth-actions'
import { updateProfile } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Instellingen</h1>
        <p className="text-gray-400">Account en voorkeuren</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-lg font-bold mb-4">Account</h2>
          <p className="text-gray-400 mb-4">{user.email}</p>
          <form action={logout}>
            <button className="w-full bg-border hover:bg-gray-700 text-white rounded-md px-4 py-3 font-bold transition-colors">
              Uitloggen
            </button>
          </form>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-lg font-bold mb-4">Dagdoel</h2>
          <form action={async (formData) => {
            'use server'
            const goal = parseInt(formData.get('daily_goal') as string)
            await updateProfile({ daily_goal: goal })
          }} className="flex flex-col gap-3">
            <input 
              type="number" 
              name="daily_goal" 
              defaultValue={profile?.daily_goal || 100}
              min="1"
              max="5000"
              className="bg-background border border-border rounded-md p-3 text-lg w-full focus:outline-none focus:border-primary"
            />
            <button className="w-full bg-primary hover:bg-primaryHover text-white rounded-md px-4 py-3 font-bold transition-colors">
              Opslaan
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
