import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('metadados estão no HTML inicial e imagem PNG tem dimensões corretas', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('property="og:title" content="Andson Rocha | Portfólio"')
  expect(html).toContain('https://andsonrocha.vercel.app/og-image.png')
  expect(html).toContain('rel="canonical" href="https://andsonrocha.vercel.app/"')
  expect(html).toContain('name="twitter:card" content="summary_large_image"')
  const image = await request.get('/og-image.png')
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toContain('image/png')
  const png = await image.body()
  expect(png.subarray(1, 4).toString()).toBe('PNG')
  expect(png.readUInt32BE(16)).toBe(1200)
  expect(png.readUInt32BE(20)).toBe(630)
  expect(png.length).toBeLessThan(1000000)
})

test('Instagram e contatos anteriores preservam nomes e links seguros', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#contato')
  const link = page.locator('#contato').getByRole('link', { name: 'Instagram @andsonzy' })
  await expect(link).toHaveAttribute('href', 'https://www.instagram.com/andsonzy/')
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  for (const name of ['E-mail', 'GitHub', 'LinkedIn', 'WhatsApp', 'Discord']) {
    await expect(
      page.locator('#contato').getByRole('link', { name: new RegExp(name) }),
    ).toBeVisible()
  }
})

for (const theme of ['dark', 'light']) {
  for (const width of [320, 390, 1200, 1440]) {
    test(`cabeçalho estável e acessível ${theme} ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.addInitScript((value) => localStorage.setItem('ar-theme', value), theme)
      await page.route('**/api/visitors', (route) =>
        route.fulfill({
          json: {
            total: Number.MAX_SAFE_INTEGER,
            metric: 'estimated_unique_visitors',
            period: 'last_30_days',
            since: '2026-09-24T00:00:00.000Z',
            until: '2026-10-24T00:00:00.000Z',
            updatedAt: '2026-10-23T12:00:00.000Z',
          },
        }),
      )
      await page.goto('/')
      const counter = page.locator('.visitor-counter')
      const before = await page.locator('.theme-toggle').boundingBox()
      await counter.click()
      await expect(counter).toContainText('9.007.199.254.740.991')
      expect(await page.locator('.theme-toggle').boundingBox()).toEqual(before)
      expect((await counter.boundingBox())!.height).toBeGreaterThanOrEqual(44)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      const controls = await page.locator('.header-controls').boundingBox()
      expect(controls!.x + controls!.width).toBeLessThanOrEqual(width)
      const nav = await page.locator('.desktop-nav').boundingBox()
      if (nav) expect(nav.x + nav.width).toBeLessThanOrEqual(controls!.x)
      await counter.focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Shift+Tab')
      await expect(counter).toBeFocused()
      expect(await counter.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none')
      expect((await new AxeBuilder({ page }).include('.site-header').analyze()).violations).toEqual(
        [],
      )
      await page.screenshot({ path: `.verification/social/header-${theme}-${width}.png` })
      await page.locator('#contato').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.verification/social/contact-${theme}-${width}.png` })
    })
  }
}
