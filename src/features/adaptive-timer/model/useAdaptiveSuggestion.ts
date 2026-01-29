'use client'

import { useEffect, useState } from 'react'
import { useTimerState } from './useTimerState'
import { getRecentClickCount } from '../lib/calculateFocusScore'
import {
  ADAPTIVE_CHECK_TIME,
  FOCUS_THRESHOLD_EXTEND,
  FOCUS_THRESHOLD_BREAK,
  RECENT_CLICKS_WINDOW,
  AUTO_PROCEED_DELAY
} from '@/shared/config/constants'

type PromptType = 'extend' | 'break' | null

export function useAdaptiveSuggestion() {
  const { seconds, clickTimestamps, isRunning } = useTimerState()
  const [promptType, setPromptType] = useState<PromptType>(null)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Check at ADAPTIVE_CHECK_TIME (5:00 remaining = 20 min elapsed)
    if (seconds === ADAPTIVE_CHECK_TIME && isRunning && !hasChecked) {
      const recentActivities = getRecentClickCount(clickTimestamps, RECENT_CLICKS_WINDOW)

      // 활동이 적으면 집중 중 → 연장 제안
      // 활동이 많으면 산만함 → 휴식 제안
      if (recentActivities <= FOCUS_THRESHOLD_EXTEND) {
        setPromptType('extend')
        setHasChecked(true)
      } else if (recentActivities >= FOCUS_THRESHOLD_BREAK) {
        setPromptType('break')
        setHasChecked(true)
      }
    }

    // Reset hasChecked when timer resets
    if (seconds === 0) {
      setHasChecked(false)
    }
  }, [seconds, isRunning, clickTimestamps, hasChecked])

  const closePrompt = () => {
    setPromptType(null)
  }

  return {
    promptType,
    closePrompt,
    autoDelay: AUTO_PROCEED_DELAY
  }
}
