import { z } from 'zod'

export const sessionTypeSchema = z.enum(['normal', 'extended', 'break_suggested'])

export const sessionSchema = z.object({
  id: z.string(),
  started_at: z.string(),
  ended_at: z.string().nullable(),
  duration_minutes: z.number().nullable(),
  timer_check_count: z.number(),
  session_type: sessionTypeSchema,
  note: z.string().nullable(),
  created_at: z.string()
})

export const createSessionSchema = z.object({
  started_at: z.date(),
  ended_at: z.date(),
  duration_minutes: z.number(),
  timer_check_count: z.number(),
  session_type: sessionTypeSchema,
  note: z.string().optional()
})
