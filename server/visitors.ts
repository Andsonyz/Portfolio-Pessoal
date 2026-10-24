import type { VisitorMetric } from '../src/lib/visitor-metric.ts'

export interface AnalyticsEnvironment {
  ANALYTICS_READ_TOKEN?: string
  ANALYTICS_PROJECT_ID?: string
  ANALYTICS_TEAM_ID?: string
}

type Failure =
  | 'missing_configuration'
  | 'upstream_auth'
  | 'upstream_rate_limit'
  | 'upstream_http'
  | 'invalid_json'
  | 'invalid_payload'
  | 'request_failed'

type Logger = (code: Failure, status?: number) => void
const silent: Logger = () => undefined
const dayMs = 86400000

function unavailable(logger: Logger, code: Failure, status?: number): Response {
  logger(code, status)
  return Response.json(
    { error: 'temporarily_unavailable' },
    { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' } },
  )
}

// Read-only proxy. Vercel Analytics owns collection, persistence and concurrency.
export async function readVisitors(
  request: Request,
  env: AnalyticsEnvironment,
  fetchAnalytics: typeof fetch = fetch,
  now = new Date(),
  logger: Logger = silent,
): Promise<Response> {
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
  if (!env.ANALYTICS_READ_TOKEN || !env.ANALYTICS_PROJECT_ID)
    return unavailable(logger, 'missing_configuration')

  const until = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  const since = new Date(until.getTime() - 30 * dayMs)
  const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count')
  url.searchParams.set('projectId', env.ANALYTICS_PROJECT_ID)
  url.searchParams.set('since', since.toISOString())
  url.searchParams.set('until', until.toISOString())
  if (env.ANALYTICS_TEAM_ID) url.searchParams.set('teamId', env.ANALYTICS_TEAM_ID)

  let response: Response
  try {
    response = await fetchAnalytics(url, {
      headers: { Authorization: `Bearer ${env.ANALYTICS_READ_TOKEN}` },
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    })
  } catch {
    return unavailable(logger, 'request_failed')
  }
  if (!response.ok) {
    const code =
      response.status === 401 || response.status === 403
        ? 'upstream_auth'
        : response.status === 429
          ? 'upstream_rate_limit'
          : 'upstream_http'
    return unavailable(logger, code, response.status)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    return unavailable(logger, 'invalid_json')
  }
  if (!payload || typeof payload !== 'object' || !('data' in payload))
    return unavailable(logger, 'invalid_payload')
  if (!('query' in payload) || !payload.query || typeof payload.query !== 'object')
    return unavailable(logger, 'invalid_payload')
  const query = payload.query as Record<string, unknown>
  if (query.since !== since.toISOString() || query.until !== until.toISOString())
    return unavailable(logger, 'invalid_payload')
  const data = payload.data
  if (!data || typeof data !== 'object' || !('visitors' in data))
    return unavailable(logger, 'invalid_payload')
  const total = data.visitors
  if (typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0)
    return unavailable(logger, 'invalid_payload')

  const result: VisitorMetric = {
    total,
    metric: 'estimated_unique_visitors',
    period: 'last_30_days',
    since: since.toISOString(),
    until: until.toISOString(),
    updatedAt: now.toISOString(),
  }
  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

// One instance per server process. Coalesce bursts and briefly cache valid aggregates;
// this is never the source of truth and the UTC window rolls over without stale data.
export function createVisitorsReader(
  getEnv: () => AnalyticsEnvironment,
  fetchAnalytics: typeof fetch = fetch,
  getNow: () => Date = () => new Date(),
  logger: Logger = (code, status) => console.warn('[visitors]', code, status ?? ''),
) {
  let cached: { day: string; body: string; expires: number } | null = null
  let pending: { day: string; promise: Promise<Response> } | null = null
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'GET' || new URL(request.url).search)
      return readVisitors(request, getEnv(), fetchAnalytics, getNow(), logger)
    const now = getNow()
    const day = now.toISOString().slice(0, 10)
    if (cached?.day === day && cached.expires > now.getTime())
      return new Response(cached.body, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=0, s-maxage=300',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    if (pending?.day === day) return pending.promise.then((response) => response.clone())
    const promise = readVisitors(request, getEnv(), fetchAnalytics, now, logger).then(
      async (response) => {
        if (response.ok) {
          const body = await response.clone().text()
          if (getNow().toISOString().slice(0, 10) === day)
            cached = { day, body, expires: now.getTime() + 300000 }
        }
        return response
      },
    )
    pending = { day, promise }
    try {
      return (await promise).clone()
    } finally {
      if (pending?.promise === promise) pending = null
    }
  }
}
