export interface VisitorMetric {
  total: number
  metric: 'estimated_unique_visitors'
  period: 'last_30_days'
  since: string
  until: string
  updatedAt: string
}

export function isVisitorMetric(value: unknown): value is VisitorMetric {
  if (!value || typeof value !== 'object') return false
  const data = value as Record<string, unknown>
  return (
    typeof data.total === 'number' &&
    Number.isSafeInteger(data.total) &&
    data.total >= 0 &&
    data.metric === 'estimated_unique_visitors' &&
    data.period === 'last_30_days' &&
    typeof data.since === 'string' &&
    typeof data.until === 'string' &&
    Number.isFinite(Date.parse(data.since)) &&
    Date.parse(data.until) - Date.parse(data.since) === 30 * 86400000 &&
    typeof data.updatedAt === 'string' &&
    Number.isFinite(Date.parse(data.updatedAt)) &&
    Date.parse(data.updatedAt) >= Date.parse(data.since) &&
    Date.parse(data.updatedAt) < Date.parse(data.until)
  )
}
