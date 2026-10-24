import { expect, test } from '@playwright/test'
import { createVisitorsReader, readVisitors } from '../server/visitors'

const env = { ANALYTICS_READ_TOKEN: 'test-only-secret', ANALYTICS_PROJECT_ID: 'test-project' }
const now = new Date('2026-10-23T12:00:00Z')
const query = { since: '2026-09-24T00:00:00.000Z', until: '2026-10-24T00:00:00.000Z' }
const request = () => new Request('http://localhost/api/visitors')

test('API consulta janela UTC, autentica no servidor e retorna somente a métrica pública', async () => {
  const upstream: typeof fetch = async (input, init) => {
    const url = new URL(String(input))
    expect(url.origin).toBe('https://api.vercel.com')
    expect(url.searchParams.get('since')).toBe('2026-09-24T00:00:00.000Z')
    expect(url.searchParams.get('until')).toBe('2026-10-24T00:00:00.000Z')
    expect(url.searchParams.get('projectId')).toBe(env.ANALYTICS_PROJECT_ID)
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      `Bearer ${env.ANALYTICS_READ_TOKEN}`,
    )
    expect(init?.redirect).toBe('error')
    return Response.json({ query, data: { pageviews: 1234, visitors: 234 } })
  }
  const result = await readVisitors(request(), env, upstream, now)
  expect(result.status).toBe(200)
  expect(result.headers.get('Cache-Control')).toContain('s-maxage=300')
  expect(await result.json()).toEqual({
    total: 234,
    metric: 'estimated_unique_visitors',
    period: 'last_30_days',
    since: '2026-09-24T00:00:00.000Z',
    until: '2026-10-24T00:00:00.000Z',
    updatedAt: '2026-10-23T12:00:00.000Z',
  })
})

test('API não consulta sem configuração e bloqueia escrita ou parâmetros do cliente', async () => {
  let calls = 0
  const upstream: typeof fetch = async () => {
    calls++
    return Response.json({})
  }
  const missing = await readVisitors(request(), {}, upstream)
  expect(missing.status).toBe(503)
  expect(missing.headers.get('Cache-Control')).toBe('no-store')
  expect(
    (await readVisitors(new Request(request(), { method: 'POST' }), env, upstream)).status,
  ).toBe(405)
  expect(
    (
      await readVisitors(
        new Request('http://localhost/api/visitors?projectId=other'),
        env,
        upstream,
      )
    ).status,
  ).toBe(400)
  expect(calls).toBe(0)
})

for (const total of [-1, '123', null, Number.MAX_SAFE_INTEGER + 1]) {
  test(`API rejeita total inválido ${total}`, async () => {
    const result = await readVisitors(
      request(),
      env,
      async () => Response.json({ query, data: { visitors: total } }),
      now,
    )
    expect(result.status).toBe(503)
    expect(await result.json()).toEqual({ error: 'temporarily_unavailable' })
  })
}

test('zero verdadeiro é válido; falha ou timeout não vira zero nem vaza erro/token', async () => {
  const zero = await readVisitors(
    request(),
    env,
    async () => Response.json({ query, data: { visitors: 0 } }),
    now,
  )
  expect((await zero.json()).total).toBe(0)
  for (const upstream of [
    async () => new Response('private upstream detail', { status: 403 }),
    async () => {
      throw new Error('private timeout detail')
    },
  ]) {
    const result = await readVisitors(request(), env, upstream)
    expect(result.status).toBe(503)
    expect(await result.json()).toEqual({ error: 'temporarily_unavailable' })
  }
})

test('API recusa janela alterada pelo serviço em vez de rotular período incorreto', async () => {
  const response = await readVisitors(
    request(),
    env,
    async () =>
      Response.json({
        query: { ...query, since: '2026-10-01T00:00:00.000Z' },
        data: { visitors: 12 },
      }),
    now,
  )
  expect(response.status).toBe(503)
})

test('API registra somente códigos seguros para configuração, autenticação e JSON inválido', async () => {
  const logs: string[] = []
  const logger = (code: string, status?: number) => logs.push(`${code}:${status ?? ''}`)
  await readVisitors(request(), {}, undefined, now, logger)
  await readVisitors(
    request(),
    env,
    async () => new Response('private', { status: 403 }),
    now,
    logger,
  )
  await readVisitors(request(), env, async () => new Response('{', { status: 200 }), now, logger)
  expect(logs).toEqual(['missing_configuration:', 'upstream_auth:403', 'invalid_json:'])
  expect(logs.join(' ')).not.toContain(env.ANALYTICS_READ_TOKEN)
})

test('API coalesce consultas simultâneas, respeita TTL e troca a janela UTC', async () => {
  let calls = 0
  let clock = new Date('2026-10-23T12:00:00Z')
  const upstream: typeof fetch = async (input) => {
    calls++
    const url = new URL(String(input))
    await new Promise((resolve) => setTimeout(resolve, 20))
    return Response.json({
      query: { since: url.searchParams.get('since'), until: url.searchParams.get('until') },
      data: { visitors: 7, pageviews: 90 },
    })
  }
  const handler = createVisitorsReader(
    () => env,
    upstream,
    () => clock,
  )
  const results = await Promise.all([handler(request()), handler(request()), handler(request())])
  expect(calls).toBe(1)
  for (const result of results) expect((await result.json()).total).toBe(7)
  expect((await (await handler(request())).json()).total).toBe(7)
  expect(calls).toBe(1)
  clock = new Date('2026-10-23T12:06:00Z')
  await handler(request())
  expect(calls).toBe(2)
  clock = new Date('2026-10-24T00:01:00Z')
  const next = await handler(request())
  expect((await next.json()).since).toBe('2026-09-25T00:00:00.000Z')
  expect(calls).toBe(3)
})
