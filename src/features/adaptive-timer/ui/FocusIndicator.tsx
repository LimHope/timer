'use client'

import { Star } from 'lucide-react'

interface FocusIndicatorProps {
  score: number
  activityCount: number
}

export function FocusIndicator({ score, activityCount }: FocusIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-semibold text-gray-700">집중도</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-7 h-7 transition-all ${
              i < score
                ? 'fill-yellow-400 text-yellow-500 scale-110'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        활동 감지: {activityCount}회
      </p>
    </div>
  )
}
