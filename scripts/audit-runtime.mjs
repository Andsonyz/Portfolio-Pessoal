import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

// Local browser-lab evidence, not Lighthouse, field CWV or a GPU memory measurement.
const label = process.argv[2] ?? 'current'
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error('Use an alphanumeric report label.')
const browser = await chromium.launch({ channel: 'msedge' })
const results = []
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript(() => {
      const sample = { lcp: 0, cls: 0, longTaskBlockingMs: 0 }
      window.auditSample = sample
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) sample.lcp = entry.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) sample.cls += entry.value
        }
      }).observe({ type: 'layout-shift', buffered: true })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          sample.longTaskBlockingMs += Math.max(0, entry.duration - 50)
      }).observe({ type: 'longtask', buffered: true })
    })
    await page.goto('http://127.0.0.1:4173/')
    await page.waitForFunction(() => document.documentElement.dataset.introState === 'complete')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1200)
    const loading = await page.evaluate(() => ({
      ...window.auditSample,
      resources: performance.getEntriesByType('resource').map((entry) => ({
        path: new URL(entry.name).pathname,
        bytes: entry.encodedBodySize,
      })),
    }))
    const cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    const snapshot = async (cycles) => {
      // Resize/ScrollTrigger callbacks can temporarily retain targets until their delayed work ends.
      await page.waitForTimeout(350)
      await cdp.send('HeapProfiler.collectGarbage')
      const metrics = (await cdp.send('Performance.getMetrics')).metrics
      const listeners = {}
      for (const expression of ['window', 'document']) {
        const { result } = await cdp.send('Runtime.evaluate', { expression })
        const data = await cdp.send('DOMDebugger.getEventListeners', { objectId: result.objectId })
        listeners[expression] = data.listeners.length
        await cdp.send('Runtime.releaseObject', { objectId: result.objectId })
      }
      return {
        cycles,
        heapBytes: metrics.find((item) => item.name === 'JSHeapUsedSize').value,
        ...(await cdp.send('Memory.getDOMCounters')),
        listeners,
      }
    }
    const cycle = async () => {
      await page.getByRole('button', { name: 'Pausar animações' }).click()
      await page.getByRole('button', { name: 'Ativar tema claro' }).click()
      await page.locator('.project-detail-trigger').click()
      await page.keyboard.press('Escape')
      await page.getByRole('button', { name: 'Ativar tema escuro' }).click()
      await page.getByRole('button', { name: 'Retomar animações' }).click()
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.setViewportSize(viewport)
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      )
    }
    // Warm the dialog, theme code and responsive GSAP contexts before comparing retained memory.
    await cycle()
    const memory = [await snapshot(0)]
    for (let batch = 1; batch <= 3; batch++) {
      for (let i = 0; i < 5; i++) await cycle()
      memory.push(await snapshot(batch * 5))
    }
    results.push({ viewport, loading, memory, errors })
    await context.close()
  }
} finally {
  await browser.close()
}
await mkdir('.verification/audit', { recursive: true })
await writeFile(
  `.verification/audit/runtime-${label}.json`,
  JSON.stringify(results, null, 2) + '\n',
)
console.log(JSON.stringify(results, null, 2))
