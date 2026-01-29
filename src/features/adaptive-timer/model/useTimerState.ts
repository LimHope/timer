'use client'

import { create } from 'zustand'
import { SessionType } from '@/entities/session'
import { TIMER_SECONDS } from '@/shared/config/constants'

interface TimerState {
  seconds: number
  isRunning: boolean
  startTime: Date | null
  sessionType: SessionType
  clickTimestamps: number[]

  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  extend: (minutes: number) => void
  recordClick: () => void
  setSessionType: (type: SessionType) => void
}

export const useTimerState = create<TimerState>((set, get) => ({
  seconds: TIMER_SECONDS,
  isRunning: false,
  startTime: null,
  sessionType: 'normal',
  clickTimestamps: [],

  start: () => {
    const state = get()
    if (!state.startTime) {
      set({ isRunning: true, startTime: new Date() })
    } else {
      set({ isRunning: true })
    }
  },

  pause: () => set({ isRunning: false }),

  reset: () => set({
    seconds: TIMER_SECONDS,
    isRunning: false,
    startTime: null,
    sessionType: 'normal',
    clickTimestamps: []
  }),

  tick: () => {
    const state = get()
    if (state.isRunning && state.seconds > 0) {
      set({ seconds: state.seconds - 1 })
    }
  },

  extend: (minutes: number) => {
    const state = get()
    set({ seconds: state.seconds + minutes * 60 })
  },

  recordClick: () => {
    const state = get()
    set({ clickTimestamps: [...state.clickTimestamps, Date.now()] })
  },

  setSessionType: (type: SessionType) => set({ sessionType: type })
}))
