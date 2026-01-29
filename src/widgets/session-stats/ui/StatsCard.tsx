'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatItem } from './StatItem'
import { formatDuration } from '@/shared/lib/time'
import type { SessionStats } from '@/features/view-sessions'

interface StatsCardProps {
  stats: SessionStats
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>공부 통계</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <StatItem
          label="오늘"
          value={formatDuration(stats.todayMinutes)}
          description={`${stats.todayCount}개 세션`}
        />
        <StatItem
          label="이번 주"
          value={formatDuration(stats.weekMinutes)}
          description={`${stats.weekCount}개 세션`}
        />
      </CardContent>
    </Card>
  )
}
