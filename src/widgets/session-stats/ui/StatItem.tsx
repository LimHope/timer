'use client'

interface StatItemProps {
  label: string
  value: string | number
  description?: string
}

export function StatItem({ label, value, description }: StatItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </div>
  )
}
