import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: ko })
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })
}
