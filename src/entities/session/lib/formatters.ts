import { formatDuration, formatDate, formatRelativeTime } from '@/shared/lib/time'
import { Session, SessionType } from '../model/types'

export function formatSessionDuration(session: Session): string {
  if (!session.duration_minutes) return '0분'
  return formatDuration(session.duration_minutes)
}

export function formatSessionStartTime(session: Session): string {
  return formatDate(session.started_at)
}

export function formatSessionRelativeTime(session: Session): string {
  return formatRelativeTime(session.started_at)
}

export function getSessionTypeBadge(type: SessionType): { label: string; color: string } {
  switch (type) {
    case 'normal':
      return { label: '일반', color: 'bg-blue-500' }
    case 'extended':
      return { label: '연장', color: 'bg-green-500' }
    case 'break_suggested':
      return { label: '휴식제안', color: 'bg-orange-500' }
  }
}

export function calculateFocusStars(checkCount: number): number {
  // Fewer clicks = higher focus
  // 0-1 clicks: 5 stars
  // 2-3 clicks: 4 stars
  // 4-5 clicks: 3 stars
  // 6-7 clicks: 2 stars
  // 8+ clicks: 1 star
  return Math.max(1, Math.min(5, 6 - Math.floor(checkCount / 2)))
}
