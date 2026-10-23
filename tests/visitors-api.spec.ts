import { expect, test } from '@playwright/test'
import { readVisitors } from '../server/visitors'

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
    total: 1234,
    metric: 'pageviews',
    period: 'last_30_days',
    since: '2026-09-24T00:00:00.000Z',
    until: '2026-10-24T00:00:00.000Z',
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
      async () => Response.json({ query, data: { pageviews: total } }),
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
    async () => Response.json({ query, data: { pageviews: 0 } }),
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
        data: { pageviews: 12 },
      }),
    now,
  )
  expect(response.status).toBe(503)
})
