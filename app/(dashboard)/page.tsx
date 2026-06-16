import { createClient } from '@/lib/supabase/server'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { LogButtons } from '@/components/ui/LogButtons'
import { getTodayDateStr } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_goal')
    .eq('id', user.id)
    .single()
    
  const goal = profile?.daily_goal || 100

  // Fetch today's progress
  const todayStr = getTodayDateStr()
  const { data: entries } = await supabase
    .from('pushup_entries')
    .select('amount')
    .eq('user_id', user.id)
    .eq('date_str', todayStr)

  const progress = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0
  const isGoalMet = progress >= goal

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateStr = new Date().toLocaleDateString('nl-NL', dateOptions);

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Vandaag</h1>
        <p className="text-gray-400 capitalize">{dateStr}</p>
      </header>

      <ProgressRing progress={progress} goal={goal} />

      <div className="mt-6 text-center">
        {isGoalMet ? (
          <p className="text-success font-semibold text-lg">Dagdoel gehaald! Machine! 🔥</p>
        ) : (
          <p className="text-gray-400">Nog {goal - progress} te gaan. Je kan dit!</p>
        )}
      </div>

      <LogButtons />
      
    </div>
  )
}
