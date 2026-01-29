'use client'

import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface ControlButtonsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function ControlButtons({
  isRunning,
  onStart,
  onPause,
  onReset
}: ControlButtonsProps) {
  return (
    <div className="flex items-center gap-4">
      {!isRunning ? (
        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8"
        >
          <Play className="w-5 h-5" />
          시작
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onPause}
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          <Pause className="w-5 h-5" />
          일시정지
        </Button>
      )}

      <Button
        size="lg"
        onClick={onReset}
        variant="outline"
        className="gap-2 border-2 border-gray-300 hover:bg-gray-100 px-8"
      >
        <RotateCcw className="w-5 h-5" />
        초기화
      </Button>
    </div>
  )
}
