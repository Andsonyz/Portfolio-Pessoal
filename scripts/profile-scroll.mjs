import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

// Run against a production preview, without other tests/builds competing for CPU.
// These are browser-lab measurements, not a guarantee about physical devices.
const label = process.argv[2] ?? 'current'
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error('Use a simple alphanumeric report label.')
const browser = await chromium.launch({ channel: 'msedge' })
const results = []
try {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    for (const throttle of [1, 4]) {
      for (let trial = 1; trial <= 2; trial++) {
        const page = await browser.newPage({ viewport })
        await page.goto('http://127.0.0.1:4173')
        await page.keyboard.press('Escape')
        await page.waitForTimeout(1500)
        const cdp = await page.context().newCDPSession(page)
        await cdp.send('Performance.enable')
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle })
        const before = (await cdp.send('Performance.getMetrics')).metrics
        await page.evaluate(() => {
          window.scrollProfile = { frames: [], longTasks: [], previous: 0 }
          const profile = window.scrollProfile
          profile.observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) profile.longTasks.push(entry.duration)
          })
          profile.observer.observe({ type: 'longtask' })
          const tick = (time) => {
            if (profile.previous) profile.frames.push(time - profile.previous)
            profile.previous = time
            profile.raf = requestAnimationFrame(tick)
          }
          profile.raf = requestAnimationFrame(tick)
        })
        // Native wheel input avoids DOM reads/writes in the sampling rAF itself.
        await cdp.send('Input.synthesizeScrollGesture', {
          x: viewport.width / 2,
          y: viewport.height / 2,
          yDistance: -4800,
          speed: 800,
          gestureSourceType: 'mouse',
        })
        const after = (await cdp.send('Performance.getMetrics')).metrics
        const sample = await page.evaluate(() => {
          const profile = window.scrollProfile
          cancelAnimationFrame(profile.raf)
          profile.observer.disconnect()
          return { frames: profile.frames, longTasks: profile.longTasks, scrollY }
        })
        const metrics = {}
        for (const name of [
          'TaskDuration',
          'ScriptDuration',
          'RecalcStyleDuration',
          'LayoutDuration',
          'LayoutCount',
        ]) {
          metrics[name] =
            after.find((item) => item.name === name).value -
            before.find((item) => item.name === name).value
        }
        const sorted = sample.frames.toSorted((a, b) => a - b)
        const result = {
          viewport,
          throttle,
          trial,
          scrollY: sample.scrollY,
          frames: sorted.length,
          p95Ms: sorted[Math.floor(sorted.length * 0.95)],
          framesOver34Ms: sorted.filter((value) => value > 34).length,
          longTasks: sample.longTasks.length,
          longTaskMs: sample.longTasks.reduce((total, value) => total + value, 0),
          metrics,
        }
        results.push(result)
        console.log(JSON.stringify(result))
        await page.close()
      }
    }
  }
} finally {
  await browser.close()
}
await mkdir('.verification', { recursive: true })
await writeFile(
  `.verification/scroll-performance-${label}.json`,
  `${JSON.stringify(results, null, 2)}\n`,
)
