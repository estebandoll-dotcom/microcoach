'use client'

import { useState } from 'react'
import { addPushupSet } from '@/lib/actions'
import { getTodayDateStr } from '@/lib/utils'

export function LogButtons() {
  const [loading, setLoading] = useState(false)

  const handleLog = async (amount: number) => {
    if (loading) return
    setLoading(true)
    try {
      await addPushupSet({ amount, dateStr: getTodayDateStr() })
      // Custom confetti or float animation could be added here
    } catch (e) {
      alert('Fout bij opslaan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {[10, 20, 25].map(amt => (
          <button
            key={amt}
            onClick={() => handleLog(amt)}
            disabled={loading}
            className="bg-surface hover:bg-border border border-border text-primary rounded-2xl py-4 text-xl font-bold transition-transform active:scale-95 disabled:opacity-50"
          >
            +{amt}
          </button>
        ))}
      </div>
    </div>
  )
}
