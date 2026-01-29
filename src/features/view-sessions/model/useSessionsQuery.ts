'use client'

import { useQuery } from '@tanstack/react-query'
import { getSessions } from '@/entities/session'

export function useSessionsQuery() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => getSessions({ limit: 50 }),
    staleTime: 60 * 1000 // 1 minute
  })
}
