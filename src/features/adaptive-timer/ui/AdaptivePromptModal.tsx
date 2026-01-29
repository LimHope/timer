'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ExtendPrompt } from './ExtendPrompt'
import { BreakPrompt } from './BreakPrompt'
import { useTimerState } from '../model/useTimerState'
import { useSessionSaver } from '@/features/save-session'
import { EXTENSION_MINUTES } from '@/shared/config/constants'

interface AdaptivePromptModalProps {
  promptType: 'extend' | 'break' | null
  onClose: () => void
  autoDelay: number
}

export function AdaptivePromptModal({
  promptType,
  onClose,
  autoDelay
}: AdaptivePromptModalProps) {
  const { extend, pause, setSessionType, startTime, clickTimestamps, reset } = useTimerState()
  const { save } = useSessionSaver()
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (promptType) {
      // Set auto-proceed timeout
      const id = setTimeout(() => {
        if (promptType === 'extend') {
          handleExtend()
        } else {
          handleBreak()
        }
      }, autoDelay)

      setTimeoutId(id)

      return () => {
        if (id) clearTimeout(id)
      }
    }
  }, [promptType, autoDelay])

  const handleExtend = () => {
    extend(EXTENSION_MINUTES)
    setSessionType('extended')
    if (timeoutId) clearTimeout(timeoutId)
    onClose()
  }

  const handleBreak = async () => {
    pause()
    setSessionType('break_suggested')

    if (startTime) {
      await save(startTime, new Date(), clickTimestamps.length, 'break_suggested')
    }

    if (timeoutId) clearTimeout(timeoutId)
    onClose()
    reset()
  }

  const handleReject = () => {
    if (timeoutId) clearTimeout(timeoutId)
    onClose()
  }

  return (
    <Dialog open={!!promptType} onOpenChange={(open) => !open && handleReject()}>
      <DialogContent>
        {promptType === 'extend' && (
          <ExtendPrompt onAccept={handleExtend} onReject={handleReject} />
        )}
        {promptType === 'break' && (
          <BreakPrompt onAccept={handleBreak} onReject={handleReject} />
        )}
      </DialogContent>
    </Dialog>
  )
}
