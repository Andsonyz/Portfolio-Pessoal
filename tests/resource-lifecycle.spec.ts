import { expect, test } from '@playwright/test'

test('pausar e retomar não acumula listeners de consultas de mídia do retrato', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.keyboard.press('Escape')
  const cycle = async () => {
    await page.getByRole('button', { name: 'Pausar animações' }).click()
    await page.getByRole('button', { name: 'Retomar animações' }).click()
  }
  await cycle()
  const cdp = await page.context().newCDPSession(page)
  const count = async () => {
    await cdp.send('HeapProfiler.collectGarbage')
    return (await cdp.send('Memory.getDOMCounters')).jsEventListeners
  }
  const before = await count()
  for (let i = 0; i < 5; i++) await cycle()
  expect(await count()).toBeLessThanOrEqual(before)
})

test('atalhos globais de pular a abertura são removidos quando ela termina', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const cdp = await page.context().newCDPSession(page)
  const { result } = await cdp.send('Runtime.evaluate', { expression: 'window' })
  const count = async () => {
    const { listeners } = await cdp.send('DOMDebugger.getEventListeners', {
      objectId: result.objectId!,
    })
    return listeners.filter(
      (listener) =>
        listener.useCapture &&
        ['pointerdown', 'keydown', 'wheel', 'touchstart'].includes(listener.type),
    ).length
  }
  expect(await count()).toBe(4)
  await page.keyboard.press('Escape')
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
  expect(await count()).toBe(0)
})
