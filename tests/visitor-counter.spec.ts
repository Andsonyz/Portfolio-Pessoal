import { expect, test } from '@playwright/test'

test('contador oculta por padrão, carrega sob demanda e revela com teclado', async ({ page }) => {
  let calls = 0
  await page.route('**/api/visitors', async (route) => {
    calls++
    await new Promise((resolve) => setTimeout(resolve, 300))
    await route.fulfill({
      json: {
        total: 1234,
        metric: 'estimated_unique_visitors',
        period: 'last_30_days',
        since: '2026-09-24T00:00:00.000Z',
        until: '2026-10-24T00:00:00.000Z',
        updatedAt: '2026-10-23T12:00:00.000Z',
      },
    })
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const counter = page.getByRole('button', { name: /Mostrar quantidade de visitantes estimados/ })
  await expect(counter).toContainText('•••••')
  expect(calls).toBe(0)
  const width = (await counter.boundingBox())!.width
  await counter.focus()
  await page.keyboard.press('Enter')
  const revealed = page.getByRole('button', { name: /Ocultar quantidade de visitantes estimados/ })
  await expect(revealed).toContainText('Carregando')
  await expect(revealed).toContainText('1.234')
  await expect(revealed).toHaveAttribute('aria-pressed', 'true')
  expect((await revealed.boundingBox())!.width).toBe(width)
  await page.keyboard.press('Space')
  await expect(counter).toContainText('•••••')
  await counter.click()
  await expect(revealed).toContainText('1.234')
  expect(calls).toBe(1)
  await page.reload()
  await expect(counter).toContainText('•••••')
})

for (const failure of ['unavailable', 'invalid']) {
  test(`contador trata ${failure} sem inventar zero e permite nova tentativa`, async ({ page }) => {
    await page.route('**/api/visitors', (route) =>
      route.fulfill({
        status: failure === 'unavailable' ? 503 : 200,
        json: failure === 'unavailable' ? { error: 'temporarily_unavailable' } : { total: -1 },
      }),
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.locator('.visitor-counter').click()
    await expect(page.locator('.visitor-counter')).toContainText('Falha')
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
    await expect(page.locator('.visitor-counter')).not.toContainText('0')
    await page.locator('.visitor-counter').click()
    await expect(page.locator('.visitor-counter')).toContainText('•••••')
    await page.route('**/api/visitors', (route) =>
      route.fulfill({
        json: {
          total: 0,
          metric: 'estimated_unique_visitors',
          period: 'last_30_days',
          since: '2026-09-24T00:00:00.000Z',
          until: '2026-10-24T00:00:00.000Z',
          updatedAt: '2026-10-23T12:00:00.000Z',
        },
      }),
    )
    await page.locator('.visitor-counter').click()
    await expect(page.locator('.visitor-counter-value')).toHaveText('0')
  })
}

test('botão de nova tentativa consulta novamente sem esconder o contador', async ({ page }) => {
  let calls = 0
  await page.route('**/api/visitors', (route) => {
    calls++
    return route.fulfill(
      calls === 1
        ? { status: 503, json: { error: 'temporarily_unavailable' } }
        : {
            json: {
              total: 234,
              metric: 'estimated_unique_visitors',
              period: 'last_30_days',
              since: '2026-09-24T00:00:00.000Z',
              until: '2026-10-24T00:00:00.000Z',
              updatedAt: '2026-10-23T12:00:00.000Z',
            },
          },
    )
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('.visitor-counter').click()
  await expect(page.locator('.visitor-counter')).toContainText('Falha')
  await page.getByRole('button', { name: 'Tentar novamente' }).click()
  await expect(page.locator('.visitor-counter')).toContainText('234')
  await expect(page.locator('.visitor-counter')).toHaveAttribute('aria-pressed', 'true')
  expect(calls).toBe(2)
})
