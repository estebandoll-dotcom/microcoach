import { createClient } from '@/lib/supabase/server'
import { ActivityTabs } from '@/components/ui/ActivityTabs'
import { Award, Target, Flame, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function StatsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const activityType = typeof searchParams.activity === 'string' ? searchParams.activity : 'pushups'

  // Fetch stats for this activity
  const { data: config } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', user.id)
    .eq('activity_type', activityType)
    .single()

  const { data: entries } = await supabase
    .from('activity_entries')
    .select('amount, date_str')
    .eq('user_id', user.id)
    .eq('activity_type', activityType)

  const totalReps = entries?.reduce((sum, entry) => sum + entry.amount, 0) || 0
  const bestStreak = config?.best_streak || 0
  const currentStreak = config?.current_streak || 0
  
  // Calculate Ranks
  let rankName = "Rookie"
  let nextRank = 500
  if (activityType === 'pushups') {
      if (totalReps >= 5000) rankName = "Machine"
      else if (totalReps >= 1000) rankName = "Builder"
      
      if (totalReps < 1000) nextRank = 1000
      else if (totalReps < 5000) nextRank = 5000
      else nextRank = totalReps // Maxed
  } else {
      // Walking minutes
      if (totalReps >= 3000) rankName = "Marathon" // 50 hours
      else if (totalReps >= 600) rankName = "Explorer" // 10 hours
      else rankName = "Stroller"
      
      if (totalReps < 600) nextRank = 600
      else if (totalReps < 3000) nextRank = 3000
      else nextRank = totalReps
  }

  // Week view (last 7 days)
  const today = new Date()
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  // Group entries by date
  const groupedByDate: Record<string, number> = {}
  entries?.forEach(e => {
    groupedByDate[e.date_str] = (groupedByDate[e.date_str] || 0) + e.amount
  })

  return (
    <div className="flex flex-col h-full pt-4">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Statistieken</h1>
        <p className="text-zinc-400 text-sm mt-1">Jouw voortgang in cijfers</p>
      </header>

      <ActivityTabs currentActivity={activityType} />

      {/* Rank Card */}
      <div className="bg-gradient-to-br from-primary/20 to-zinc-900 border border-primary/20 rounded-2xl p-6 text-center mb-6 mt-4">
        <Award className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Rank: {rankName}</h2>
        <p className="text-zinc-400 text-sm mb-4">Totaal: {totalReps} {activityType === 'pushups' ? 'stuks' : 'minuten'}</p>
        
        {totalReps < nextRank && (
          <div className="w-full bg-black/50 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (totalReps/nextRank)*100)}%` }}></div>
          </div>
        )}
        {totalReps < nextRank && <p className="text-xs text-zinc-500">Nog {nextRank - totalReps} te gaan tot volgende rank</p>}
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-2">
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-xs text-zinc-400">Beste Streak</p>
            <p className="text-lg font-bold text-white">{Math.max(currentStreak, bestStreak)} dgn</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-xs text-zinc-400">Dagdoel</p>
            <p className="text-lg font-bold text-white">{config?.daily_goal || 0}</p>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-6 mx-2">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> 
          Afgelopen 7 dagen
        </h3>
        <div className="flex justify-between items-end h-32 pt-4">
          {last7Days.map(date => {
            const amount = groupedByDate[date] || 0
            const goal = config?.daily_goal || 100
            const heightPerc = Math.min(100, Math.max(5, (amount / goal) * 100))
            const dayName = new Date(date).toLocaleDateString('nl-NL', { weekday: 'short' }).charAt(0).toUpperCase()
            const isToday = date === today.toISOString().split('T')[0]
            
            return (
              <div key={date} className="flex flex-col items-center gap-2 w-full">
                <div className="w-full flex justify-center h-20 items-end">
                  <div 
                    className={`w-full max-w-[20px] rounded-t-md transition-all ${amount >= goal ? 'bg-primary' : amount > 0 ? 'bg-primary/40' : 'bg-zinc-800'}`}
                    style={{ height: `${heightPerc}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-zinc-500'}`}>{dayName}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
