import { expect, test } from '@playwright/test'

test('a revelação em V não deixa uma linha DOM visível sob os snapshots', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect
    .poll(() =>
      page.evaluate(() =>
        document
          .getAnimations()
          .some(
            (animation) =>
              animation instanceof CSSAnimation && animation.animationName === 'v-reveal',
          ),
      ),
    )
    .toBe(true)
  const visibleLiveLine = await page
    .locator('.theme-cut')
    .evaluateAll((elements) =>
      elements.some((element) => Number(getComputedStyle(element).opacity) > 0),
    )
  expect(visibleLiveLine, 'a linha real fica exposta antes/depois dos snapshots').toBe(false)
})

for (const width of [390, 1440]) {
  for (const initialTheme of ['dark', 'light']) {
    for (const position of ['top', 'projects']) {
      test(`V completo: ${width}px, ${initialTheme}, ${position}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.addInitScript((theme) => localStorage.setItem('ar-theme', theme), initialTheme)
        await page.goto('/')
        await expect(page.locator('h1')).toHaveCSS('opacity', '1')
        if (position === 'projects') {
          await page.locator('#projetos').scrollIntoViewIfNeeded()
          await page.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'))
        }
        const scrollBefore = await page.evaluate(() => scrollY)
        const toggle = page.locator('.theme-toggle')
        await toggle.evaluate((button) => {
          ;(button as HTMLButtonElement).click()
          ;(button as HTMLButtonElement).click()
          ;(button as HTMLButtonElement).click()
        })
        await expect
          .poll(() =>
            page.evaluate(() =>
              document
                .getAnimations()
                .some(
                  (animation) =>
                    animation instanceof CSSAnimation && animation.animationName === 'v-reveal',
                ),
            ),
          )
          .toBe(true)
        for (const time of [0, 700, 1399]) {
          await page.evaluate(
            (time) =>
              document
                .getAnimations()
                .filter(
                  (animation) =>
                    animation instanceof CSSAnimation && animation.animationName === 'v-reveal',
                )
                .forEach((animation) => {
                  animation.pause()
                  animation.currentTime = time
                }),
            time,
          )
          await page.screenshot({
            path: `.verification/update-3/v-${width}-${initialTheme}-${position}-${time}.png`,
          })
        }
        await page.evaluate(() =>
          document
            .getAnimations()
            .filter(
              (animation) =>
                animation instanceof CSSAnimation && animation.animationName === 'v-reveal',
            )
            .forEach((animation) => animation.finish()),
        )
        await expect(toggle).toBeEnabled()
        await expect(page.locator('html')).toHaveAttribute(
          'data-theme',
          initialTheme === 'dark' ? 'light' : 'dark',
        )
        expect(await page.evaluate(() => scrollY)).toBeCloseTo(scrollBefore, 0)
        await expect(page.locator('.theme-cut')).toHaveCount(0)
        await page.screenshot({
          path: `.verification/update-3/v-${width}-${initialTheme}-${position}-done.png`,
        })
        await toggle.click()
        await expect(toggle).toBeEnabled()
        await expect(page.locator('html')).toHaveAttribute('data-theme', initialTheme)
      })
    }
  }
}
