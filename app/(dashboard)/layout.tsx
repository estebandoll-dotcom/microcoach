import { BottomNav } from '@/components/nav/BottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <main className="flex-1 w-full max-w-md mx-auto p-6 relative">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
