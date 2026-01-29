'use client'

import { StatsCard } from '@/widgets/session-stats'
import { SessionList } from '@/widgets/session-list'
import { useSessionsQuery, aggregateStats } from '@/features/view-sessions'

export default function DashboardPage() {
  const { data: sessions, isLoading, error } = useSessionsQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">세션을 불러오는데 실패했습니다.</p>
      </div>
    )
  }

  const stats = sessions ? aggregateStats(sessions) : {
    todayMinutes: 0,
    weekMinutes: 0,
    todayCount: 0,
    weekCount: 0
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">대시보드</h1>
          <p className="text-gray-600">
            공부 기록을 확인하세요
          </p>
        </div>

        <StatsCard stats={stats} />

        <SessionList sessions={sessions || []} />
      </div>
    </div>
  )
}
