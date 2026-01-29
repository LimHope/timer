'use client'

import { Button } from '@/components/ui/button'

interface ExtendPromptProps {
  onAccept: () => void
  onReject: () => void
}

export function ExtendPrompt({ onAccept, onReject }: ExtendPromptProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
      <div className="text-center space-y-3">
        <div className="text-5xl">🎯</div>
        <h3 className="text-2xl font-bold text-green-800">집중 잘하고 있어요!</h3>
        <p className="text-gray-700 text-lg">
          10분 더 공부하시겠어요?
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onReject} variant="outline" className="px-6 border-2">
          아니요
        </Button>
        <Button onClick={onAccept} className="px-6 bg-green-600 hover:bg-green-700 text-white">
          네, 10분 더!
        </Button>
      </div>

      <p className="text-xs text-gray-500 bg-white px-4 py-2 rounded-full">
        ⏱️ 5초 후 자동으로 연장됩니다
      </p>
    </div>
  )
}
