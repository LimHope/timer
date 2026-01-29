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
          <div className="text-6xl font-bold tabular-nums text-gray-800">
            {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            활동을 자동으로 감지하고 있습니다
          </div>
        </div>
      </div>
    </div>
  )
}
