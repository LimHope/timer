'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import {
  Session,
  formatSessionDuration,
  formatSessionRelativeTime,
  getSessionTypeBadge,
  calculateFocusStars
} from '@/entities/session'

interface SessionItemProps {
  session: Session
}

export function SessionItem({ session }: SessionItemProps) {
  const typeBadge = getSessionTypeBadge(session.session_type)
  const focusStars = calculateFocusStars(session.timer_check_count)

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {formatSessionDuration(session)}
            </span>
            <Badge
              className={`${typeBadge.color} text-white`}
              variant="secondary"
            >
              {typeBadge.label}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatSessionRelativeTime(session)}
          </span>
          {session.note && (
            <span className="text-sm text-muted-foreground italic">
              {session.note}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < focusStars
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
