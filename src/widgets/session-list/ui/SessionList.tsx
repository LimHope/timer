'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionItem } from './SessionItem'
import type { Session } from '@/entities/session'

interface SessionListProps {
  sessions: Session[]
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 세션</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            아직 공부 세션이 없습니다. 타이머를 시작해보세요!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 세션</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))}
      </CardContent>
    </Card>
  )
}
