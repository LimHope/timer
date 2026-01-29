import { supabase } from '@/shared/api/supabase'
import { Session } from '../model/types'

export async function getSessions({ limit = 50 }: { limit?: number } = {}) {
  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Session[]
}
