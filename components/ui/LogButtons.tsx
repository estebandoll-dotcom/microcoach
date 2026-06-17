'use client'

import { useState } from 'react'
import { addActivityEntry } from '@/lib/actions'
import { getTodayDateStr } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function LogButtons({ activityType }: { activityType: string }) {
  const [loading, setLoading] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const handleLog = async (amount: number) => {
    if (amount <= 0) return
    setLoading(true)
    try {
      await addActivityEntry({
        activityType,
        amount,
        dateStr: getTodayDateStr()
      })
      toast.success(`Bam! +${amount} in de pocket. 🔥`)
      setCustomAmount('')
    } catch (e: any) {
      toast.error('Oeps, dat ging mis.')
    } finally {
      setLoading(false)
    }
  }

  const isWalking = activityType === 'walking'
  const presetValues = isWalking ? [15, 30, 60] : [5, 10, 20]

  return (
    <div className="flex flex-col gap-4 mt-8 px-4">
      <div className="flex gap-4 justify-center">
        {presetValues.map(val => (
          <button
            key={val}
            onClick={() => handleLog(val)}
            disabled={loading}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-lg font-bold py-4 rounded-xl transition-transform active:scale-95 disabled:opacity-50"
          >
            +{val}
          </button>
        ))}
      </div>
      
      <div className="flex gap-2 justify-center mt-2">
        <input 
          type="number" 
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder={isWalking ? "Aantal minuten..." : "Ander aantal..."}
          className="bg-zinc-800 border-none rounded-xl px-4 py-3 text-white flex-1 focus:ring-2 focus:ring-primary outline-none"
        />
        <button 
          onClick={() => handleLog(parseInt(customAmount) || 0)}
          disabled={loading || !customAmount}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 rounded-xl transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
