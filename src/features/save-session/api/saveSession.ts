import { createSession, CreateSessionData } from '@/entities/session'

export async function saveSession(data: CreateSessionData) {
  try {
    const session = await createSession(data)
    return { success: true, session }
  } catch (error) {
    console.error('Failed to save session:', error)
    return { success: false, error }
  }
}
