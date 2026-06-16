'use client'

interface ProgressRingProps {
  progress: number
  goal: number
}

export function ProgressRing({ progress, goal }: ProgressRingProps) {
  const circumference = 314
  const pct = Math.min(progress / goal, 1)
  const offset = circumference - (pct * circumference)
  const isGoalMet = progress >= goal

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface)" strokeWidth="12" />
        <circle
          cx="60" cy="60" r="50" fill="none"
          stroke={isGoalMet ? "var(--success)" : "var(--primary)"}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="314"
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold">{progress}</span>
        <span className="text-gray-400 text-lg">van {goal}</span>
      </div>
    </div>
  )
}
