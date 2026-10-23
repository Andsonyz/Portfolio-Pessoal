import type { VisitorMetric } from '../src/lib/visitor-metric.ts'

export interface AnalyticsEnvironment {
  ANALYTICS_READ_TOKEN?: string
  ANALYTICS_PROJECT_ID?: string
  ANALYTICS_TEAM_ID?: string
}

// Read-only proxy. The Analytics service owns collection and persistent storage.
export async function readVisitors(
  request: Request,
  env: AnalyticsEnvironment,
  fetchAnalytics: typeof fetch = fetch,
  now = new Date(),
): Promise<Response> {
  const unavailable = () =>
    Response.json(
      { error: 'temporarily_unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  if (request.method !== 'GET') {
    return new Response(null, {
      status: 405,
      headers: { Allow: 'GET', 'Cache-Control': 'no-store' },
    })
  }
  if (new URL(request.url).search) {
    return Response.json(
      { error: 'invalid_request' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }
  if (!env.ANALYTICS_READ_TOKEN || !env.ANALYTICS_PROJECT_ID) return unavailable()

  const until = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  const since = new Date(until.getTime() - 30 * 86400000)
  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count')
  url.searchParams.set('projectId', env.ANALYTICS_PROJECT_ID)
  url.searchParams.set('since', since.toISOString())
  url.searchParams.set('until', until.toISOString())
  if (env.ANALYTICS_TEAM_ID) url.searchParams.set('teamId', env.ANALYTICS_TEAM_ID)
  try {
    const response = await fetchAnalytics(url, {
      headers: { Authorization: `Bearer ${env.ANALYTICS_READ_TOKEN}` },
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    })
    if (!response.ok) return unavailable()
    const payload: unknown = await response.json()
    if (!payload || typeof payload !== 'object' || !('data' in payload)) return unavailable()
    if (!('query' in payload) || !payload.query || typeof payload.query !== 'object')
      return unavailable()
    const query = payload.query as Record<string, unknown>
    if (query.since !== since.toISOString() || query.until !== until.toISOString())
      return unavailable()
    const data = payload.data
    if (!data || typeof data !== 'object' || !('pageviews' in data)) return unavailable()
    const total = data.pageviews
    if (typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) return unavailable()
    const result: VisitorMetric = {
      total,
      metric: 'pageviews',
      period: 'last_30_days',
      since: since.toISOString(),
      until: until.toISOString(),
    }
    return Response.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=300',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return unavailable()
  }
}
