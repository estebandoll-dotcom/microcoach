import Link from 'next/link'
import { signup } from '@/lib/auth-actions'

export default function Signup({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md mx-auto justify-center gap-2 h-screen">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signup}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">MicroCoach</h1>
        
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-surface border border-border mb-6 focus:outline-none focus:border-primary"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-md" htmlFor="password">
          Wachtwoord
        </label>
        <input
          className="rounded-md px-4 py-2 bg-surface border border-border mb-6 focus:outline-none focus:border-primary"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
        
        <button className="bg-success hover:bg-green-600 text-white rounded-md px-4 py-3 mb-2 font-bold text-lg transition-colors">
          Account aanmaken
        </button>
        
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-900/50 text-red-300 text-center rounded-md">
            {searchParams.message}
          </p>
        )}
        
        <div className="text-center mt-4">
          <span className="text-gray-400">Al een account? </span>
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
