export type SessionType = 'normal' | 'extended' | 'break_suggested'

export interface Session {
  id: string
  started_at: string
  ended_at: string | null
  duration_minutes: number | null
  timer_check_count: number
  session_type: SessionType
  note: string | null
  created_at: string
}

export interface CreateSessionData {
  started_at: Date
  ended_at: Date
  duration_minutes: number
  timer_check_count: number
  session_type: SessionType
  note?: string
}
