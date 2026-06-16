import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

  url = url.trim()
  if (!url.startsWith('http')) {
    url = `https://${url}.supabase.co`
  }

  return createBrowserClient(url, key.trim())
}
