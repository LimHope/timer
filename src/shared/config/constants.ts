export const TIMER_MINUTES = Number(process.env.NEXT_PUBLIC_DEFAULT_TIMER_MINUTES) || 25
export const TIMER_SECONDS = TIMER_MINUTES * 60

export const ADAPTIVE_CHECK_TIME = 5 * 60 // Check at 5:00 remaining (20 min elapsed)
export const AUTO_PROCEED_DELAY = 5000 // 5 seconds

// 활동 기반 임계값 (최근 5분간의 활동 수)
export const FOCUS_THRESHOLD_EXTEND = 2 // ≤2 activities for extension (집중 중)
export const FOCUS_THRESHOLD_BREAK = 6 // ≥6 activities for break (산만함)

export const EXTENSION_MINUTES = 10
export const RECENT_CLICKS_WINDOW = 5 * 60 * 1000 // 5 minutes in milliseconds

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'StudyFlow'
