import { supabase } from '@/shared/api/supabase'
import { CreateSessionData, Session } from '../model/types'
import { createSessionSchema } from '../model/schema'

export async function createSession(data: CreateSessionData): Promise<Session> {
  // Validate input
  const validated = createSessionSchema.parse(data)

  const { data: session, error } = await supabase
    .from('study_sessions')
    .insert({
      started_at: validated.started_at.toISOString(),
      ended_at: validated.ended_at.toISOString(),
      duration_minutes: validated.duration_minutes,
      timer_check_count: validated.timer_check_count,
      session_type: validated.session_type,
      note: validated.note || null
    })
    .select()
    .single()

  if (error) throw error
  return session as Session
}
