'use client'

import { TimerDisplay } from '@/widgets/timer-display'

export default function TimerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 to-blue-50">
      <TimerDisplay />
    </div>
  )
}
