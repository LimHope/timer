'use client'

import { Star } from 'lucide-react'

interface FocusIndicatorProps {
  score: number
  activityCount: number
}

export function FocusIndicator({ score, activityCount }: FocusIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-sm font-bold text-gray-800 tracking-wide">집중도</p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 transition-all duration-300 ${
              i < score
                ? 'fill-yellow-400 text-yellow-500 drop-shadow-md'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 font-medium">
        활동 {activityCount}회
      </p>
    </div>
  )
}
