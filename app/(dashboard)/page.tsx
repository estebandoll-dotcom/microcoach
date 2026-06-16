import { createClient } from '@/lib/supabase/server'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { LogButtons } from '@/components/ui/LogButtons'
import { ActivityTabs } from '@/components/ui/ActivityTabs'
import { getTodayDateStr } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const activityType = typeof searchParams.activity === 'string' ? searchParams.activity : 'pushups'

  // Fetch profile settings for this activity
  const { data: activityConfig } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', user.id)
    .eq('activity_type', activityType)
    .single()
    
  const goal = activityConfig?.daily_goal || (activityType === 'walking' ? 30 : 100)
  const currentStreak = activityConfig?.current_streak || 0

  // Fetch today's progress
  const todayStr = getTodayDateStr()
  const { data: entries } = await supabase
    .from('activity_entries')
    .select('amount')
    .eq('user_id', user.id)
    .eq('activity_type', activityType)
    .eq('date_str', todayStr)

  const progress = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0
  const setsDone = entries?.length || 0
  const isGoalMet = progress >= goal
  const remaining = Math.max(0, goal - progress)
  
  // Duolingo-style copy
  let coachMessage = "Klaar om te starten?"
  if (isGoalMet) {
    coachMessage = "Dagdoel gehaald! Machine! 🔥"
  } else if (progress > 0) {
    if (remaining <= 20) {
      coachMessage = "Nog 1 mini-set en je dag is gered."
    } else {
      coachMessage = "Snelle set nu = jezelf straks bedanken."
    }
  } else {
    coachMessage = "Streaks breken zichzelf niet. Jij wel?"
  }

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateStr = new Date().toLocaleDateString('nl-NL', dateOptions);
  
  const unit = activityType === 'walking' ? 'min' : 'stuks'

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground capitalize">{dateStr}</h1>
        <p className="text-zinc-400 text-sm mt-1">{goal} {unit} als doel vandaag</p>
      </header>

      <ActivityTabs currentActivity={activityType} />

      <div className="relative py-2 flex justify-center">
        <ProgressRing progress={progress} goal={goal} />
      </div>

      <div className="mt-6 flex justify-center gap-6 text-center text-sm px-4">
        <div className="flex-1 bg-zinc-900/50 rounded-xl p-3">
          <p className="text-zinc-400 mb-1">Gedaan</p>
          <p className="font-bold text-xl text-white">{progress}</p>
        </div>
        <div className="flex-1 bg-zinc-900/50 rounded-xl p-3">
          <p className="text-zinc-400 mb-1">Over</p>
          <p className="font-bold text-xl text-white">{remaining}</p>
        </div>
        <div className="flex-1 bg-zinc-900/50 rounded-xl p-3">
          <p className="text-zinc-400 mb-1">Sets</p>
          <p className="font-bold text-xl text-white">{setsDone}</p>
        </div>
        <div className="flex-1 bg-primary/10 rounded-xl p-3">
          <p className="text-primary/80 mb-1">Streak</p>
          <p className="font-bold text-xl text-primary">{currentStreak} 🔥</p>
        </div>
      </div>

      <div className="mt-8 px-6 text-center">
        <p className="text-zinc-300 italic text-lg tracking-wide">"{coachMessage}"</p>
      </div>

      <LogButtons activityType={activityType} />
      
    </div>
  )
}
