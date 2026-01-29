export function calculateFocusScore(activityCount: number): number {
  // Score from 1-5 stars
  // 활동이 적을수록 집중도가 높음
  // 0-2 activities: 5 stars (매우 집중)
  // 3-5 activities: 4 stars (집중)
  // 6-9 activities: 3 stars (보통)
  // 10-14 activities: 2 stars (산만)
  // 15+ activities: 1 star (매우 산만)

  if (activityCount <= 2) return 5
  if (activityCount <= 5) return 4
  if (activityCount <= 9) return 3
  if (activityCount <= 14) return 2
  return 1
}

export function getRecentClickCount(
  clickTimestamps: number[],
  windowMs: number
): number {
  const cutoff = Date.now() - windowMs
  return clickTimestamps.filter(timestamp => timestamp > cutoff).length
}
