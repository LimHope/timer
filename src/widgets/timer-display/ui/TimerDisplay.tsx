'use client'

import { useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CircularProgress } from './CircularProgress'
import { ControlButtons } from './ControlButtons'
import { FocusIndicator } from '@/features/adaptive-timer'
import { useTimerState, useFocusTracking, useAdaptiveSuggestion } from '@/features/adaptive-timer'
import { AdaptivePromptModal } from '@/features/adaptive-timer'
import { useSessionSaver } from '@/features/save-session'
import { TIMER_SECONDS } from '@/shared/config/constants'
import { useToast } from '@/hooks/use-toast'
import { useAiHelper, AiHelperModal } from '@/features/ai-helper'

export function TimerDisplay() {
  const {
    seconds,
    isRunning,
    startTime,
    sessionType,
    start,
    pause,
    reset,
    tick,
    clickTimestamps
  } = useTimerState()

  const { activityCount, focusScore } = useFocusTracking()
  const { promptType, closePrompt, autoDelay } = useAdaptiveSuggestion()
  const { save } = useSessionSaver()
  const { toast } = useToast()
  const { open: openAiHelper } = useAiHelper()

  const handleTimerComplete = useCallback(async () => {
    pause()

    if (startTime) {
      const result = await save(
        startTime,
        new Date(),
        clickTimestamps.length,
        sessionType
      )

      if (result.success) {
        toast({
          title: '공부 세션 저장 완료!',
          description: `${Math.round((Date.now() - startTime.getTime()) / 60000)}분 동안 공부하셨습니다.`
        })
      } else {
        toast({
          title: '저장 실패',
          description: '세션 저장에 실패했습니다.',
          variant: 'destructive'
        })
      }
    }

    reset()
  }, [pause, startTime, clickTimestamps.length, sessionType, save, toast, reset])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      // AI 도우미, input, textarea, contentEditable 요소에서는 단축키 무시
      const isInAiHelper = target.closest('[data-ai-helper="true"]')
      const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      const isContentEditable = target.isContentEditable
      const isInDialog = target.closest('[role="dialog"]')

      // 스페이스바: 시작/일시정지 (입력 가능한 요소나 모달 내부에서는 무시)
      if (e.key === ' ') {
        if (isInAiHelper || isInputElement || isContentEditable || isInDialog) {
          return // 스페이스바를 일반 입력으로 처리
        }
        e.preventDefault()
        if (isRunning) {
          pause()
        } else {
          start()
        }
      }

      // 엔터: AI 도우미 열기 (입력 요소에서는 무시)
      if (e.key === 'Enter') {
        if (isInAiHelper || isInputElement || isContentEditable) {
          return
        }
        e.preventDefault()
        openAiHelper()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, start, pause, openAiHelper])

  // Timer tick
  useEffect(() => {
    if (isRunning && seconds > 0) {
      const interval = setInterval(() => {
        tick()
      }, 1000)

      return () => clearInterval(interval)
    }

    // Timer completed
    if (seconds === 0 && startTime && isRunning) {
      handleTimerComplete()
    }
  }, [isRunning, seconds, tick, startTime, handleTimerComplete])

  return (
    <>
      <Card className="w-full max-w-2xl shadow-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100">
        <CardContent className="flex flex-col items-center gap-6 p-12">
          <CircularProgress
            seconds={seconds}
            totalSeconds={TIMER_SECONDS}
          />

          <FocusIndicator score={focusScore} activityCount={activityCount} />

          <ControlButtons
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />

          <div className="text-xs text-gray-500 mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded shadow-sm font-semibold text-gray-700">Space</kbd>
              <span className="text-gray-600">시작/일시정지</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded shadow-sm font-semibold text-gray-700">Enter</kbd>
              <span className="text-gray-600">AI 도우미</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdaptivePromptModal
        promptType={promptType}
        onClose={closePrompt}
        autoDelay={autoDelay}
      />

      <AiHelperModal />
    </>
  )
}
