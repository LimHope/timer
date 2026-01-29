'use client'

import { useState } from 'react'
import { saveSession } from '../api/saveSession'
import { SessionType } from '@/entities/session'

export function useSessionSaver() {
  const [isSaving, setIsSaving] = useState(false)

  const save = async (
    startTime: Date,
    endTime: Date,
    clickCount: number,
    sessionType: SessionType,
    note?: string
  ) => {
    setIsSaving(true)

    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

    const result = await saveSession({
      started_at: startTime,
      ended_at: endTime,
      duration_minutes: durationMinutes,
      timer_check_count: clickCount,
      session_type: sessionType,
      note
    })

    setIsSaving(false)
    return result
  }

  return { save, isSaving }
}
