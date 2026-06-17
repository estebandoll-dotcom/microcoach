'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function NotificationToggle() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Je browser ondersteunt geen notificaties.')
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        new Notification('MicroCoach', {
          body: 'Geweldig! Je ontvangt nu onze strenge (maar rechtvaardige) reminders. 🔥',
          icon: '/icon-512x512.png'
        })
        toast.success('Notificaties staan aan!')
      } else {
        toast.error('Notificaties zijn geblokkeerd door je browser.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('MicroCoach', {
        body: 'Streaks breken zichzelf niet... Waar blijf je? 🦅',
        icon: '/icon-512x512.png'
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">Toestemming</span>
        <span className={`text-xs px-2 py-1 rounded-full ${permission === 'granted' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
          {permission === 'granted' ? 'Aan' : 'Uit'}
        </span>
      </div>
      
      {permission !== 'granted' ? (
        <button 
          onClick={requestPermission}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-transform active:scale-95"
        >
          Zet notificaties aan
        </button>
      ) : (
        <button 
          onClick={testNotification}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-transform active:scale-95"
        >
          Test Duolingo Bericht
        </button>
      )}
    </div>
  )
}
