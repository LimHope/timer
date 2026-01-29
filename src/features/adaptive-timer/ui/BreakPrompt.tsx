'use client'

import { Button } from '@/components/ui/button'

interface BreakPromptProps {
  onAccept: () => void
  onReject: () => void
}

export function BreakPrompt({ onAccept, onReject }: BreakPromptProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
      <div className="text-center space-y-3">
        <div className="text-5xl">☕</div>
        <h3 className="text-2xl font-bold text-orange-800">조금 쉬어가요</h3>
        <p className="text-gray-700 text-lg">
          5분 휴식하시겠어요?
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onReject} variant="outline" className="px-6 border-2">
          계속 공부
        </Button>
        <Button onClick={onAccept} className="px-6 bg-orange-500 hover:bg-orange-600 text-white">
          네, 휴식!
        </Button>
      </div>

      <p className="text-xs text-gray-500 bg-white px-4 py-2 rounded-full">
        ⏱️ 5초 후 자동으로 종료됩니다
      </p>
    </div>
  )
}
