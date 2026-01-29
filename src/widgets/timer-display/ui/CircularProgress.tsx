'use client'

interface CircularProgressProps {
  seconds: number
  totalSeconds: number
}

export function CircularProgress({ seconds, totalSeconds }: CircularProgressProps) {
  const percentage = (seconds / totalSeconds) * 100
  const circumference = 2 * Math.PI * 120
  const offset = circumference - (percentage / 100) * circumference

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="relative select-none">
      <svg className="w-80 h-80 transform -rotate-90 drop-shadow-lg">
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="120"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="160"
          cy="160"
          r="120"
          stroke="#0d9488"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
          strokeLinecap="round"
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl font-bold tabular-nums text-gray-900 tracking-tight">
            {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-400 mt-3 font-medium">
            자동 활동 감지
          </div>
        </div>
      </div>
    </div>
  )
}
