import { expect, test } from '@playwright/test'

test('retomar a digitação preserva a pausa restante entre escrever e apagar', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const text = page.locator('.typewriter-text')
  await expect(text).toHaveText('Front-end Developer')
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: 'instant' }))
  await page.waitForTimeout(250)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await expect(text).toHaveText('Front-end Developer')
  await expect(text).not.toHaveText('Front-end Developer')
})

test('digitação não altera conteúdo fora da tela e retoma ao voltar ao Hero', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const text = page.locator('.typewriter-text')
  await expect(text).not.toHaveText('')
  await page.evaluate(() => window.scrollTo({ top: 4000, behavior: 'instant' }))
  await page.waitForTimeout(250)
  const changes = await text.evaluate(
    (element) =>
      new Promise<number>((resolve) => {
        let changes = 0
        const observer = new MutationObserver(() => changes++)
        observer.observe(element, { childList: true, subtree: true, characterData: true })
        setTimeout(() => {
          observer.disconnect()
          resolve(changes)
        }, 600)
      }),
  )
  expect(changes).toBe(0)
  const frozen = await text.textContent()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect.poll(() => text.textContent()).not.toBe(frozen)
})

test('faixas conservam a posição fora da tela e retomam quando reaparecem', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const band = page.locator('.section-marquee').last()
  const track = band.locator('.marquee-track')
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  const time = await track.evaluate((element) => element.getAnimations()[0]?.currentTime)
  await page.waitForTimeout(200)
  expect(await track.evaluate((element) => element.getAnimations()[0]?.currentTime)).toBe(time)
  await band.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await expect(track).toHaveCSS('animation-play-state', 'running')
  await expect
    .poll(() => track.evaluate((element) => element.getAnimations()[0]?.currentTime))
    .not.toBe(time)
})
