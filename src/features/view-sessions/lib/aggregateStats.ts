import { Session } from '@/entities/session'
import { isToday, isThisWeek } from 'date-fns'

export interface SessionStats {
  todayMinutes: number
  weekMinutes: number
  todayCount: number
  weekCount: number
}

export function aggregateStats(sessions: Session[]): SessionStats {
  const todaySessions = sessions.filter(s => isToday(new Date(s.started_at)))
  const weekSessions = sessions.filter(s => isThisWeek(new Date(s.started_at)))

  return {
    todayMinutes: todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
    weekMinutes: weekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0),
    todayCount: todaySessions.length,
    weekCount: weekSessions.length
  }
}
