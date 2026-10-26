import { expect, test } from '@playwright/test'

test('Welcome tem três ícones, blur e revela conteúdo sem remontagem', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.welcome-word')).toBeVisible()
  await expect(page.locator('.welcome-icons svg')).toHaveCount(3)
  await expect(page.locator('main > section')).toHaveCount(9)
  expect(
    await page.locator('.page-content').evaluate((element) => getComputedStyle(element).filter),
  ).not.toBe('none')
  await page.screenshot({ path: '.verification/update-3/welcome-desktop.png' })
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete', {
    timeout: 5000,
  })
  await expect(page.locator('.welcome-screen')).not.toBeVisible()
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
  await expect(page.locator('.welcome-screen')).not.toBeVisible()
  await page.reload()
  await expect(page.locator('.welcome-word')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete', {
    timeout: 5000,
  })
})

test('teclado pula a abertura e movimento reduzido mostra conteúdo imediatamente', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.welcome-word')).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('.welcome-screen')).not.toBeVisible()
  await expect(page.locator('.page-content')).toHaveCSS('filter', 'none')
  await expect(page.locator('.typewriter-text')).toHaveText('Front-end Developer')
})

test('digitação percorre as quatro áreas, apaga e reserva espaço', async ({ page }) => {
  test.setTimeout(35000)
  await page.goto('/')
  await page.keyboard.press('Escape')
  const text = page.locator('.typewriter-text')
  const width = (await page.locator('.role-line').boundingBox())!.width
  const observed = await page.evaluate(async () => {
    const element = document.querySelector('.typewriter-text')!
    const values: string[] = [element.textContent ?? '']
    return new Promise<string[]>((resolve) => {
      const observer = new MutationObserver(() => {
        const value = element.textContent ?? ''
        values.push(value)
        if (value === 'Full-stack Developer') {
          observer.disconnect()
          clearTimeout(timeout)
          resolve(values)
        }
      })
      const timeout = setTimeout(() => {
        observer.disconnect()
        resolve(values)
      }, 24000)
      observer.observe(element, { childList: true, characterData: true, subtree: true })
    })
  })
  for (const title of [
    'Front-end Developer',
    'Back-end Developer',
    'UX/UI Designer',
    'Full-stack Developer',
  ])
    expect(observed).toContain(title)
  expect(
    observed.some((value, index) => index > 0 && value.length < observed[index - 1]!.length),
  ).toBe(true)
  expect((await page.locator('.role-line').boundingBox())!.width).toBe(width)
  await expect(text.locator('..')).toHaveAttribute('aria-hidden', 'true')
  await page.getByRole('button', { name: 'Pausar animações' }).click()
  await expect(text).toHaveText('Front-end Developer')
})

test('retrato reage ao mouse, gira com teclado e volta à orientação original', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const portrait = page.locator('.portrait-button')
  const box = (await portrait.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3)
  await expect
    .poll(() =>
      page
        .locator('.portrait-halo')
        .evaluate((element) => Number(getComputedStyle(element).opacity)),
    )
    .toBeGreaterThan(0)
  await portrait.focus()
  await page.keyboard.press('Enter')
  await expect(portrait).toHaveAttribute('aria-busy', 'true')
  await expect
    .poll(() =>
      page.locator('.portrait-circle').evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe('none')
  await portrait.evaluate((element) => {
    ;(element as HTMLButtonElement).click()
    ;(element as HTMLButtonElement).click()
  })
  await expect(portrait).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('.portrait-circle')).toHaveCSS('transform', 'none')
  await page.keyboard.press('Space')
  await expect(portrait).toHaveAttribute('aria-busy', 'true')
  await expect(portrait).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('.portrait-circle')).toHaveCSS('transform', 'none')
  await page.mouse.move(0, 0)
  await expect(page.locator('.portrait-halo')).toHaveCSS('opacity', '0')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await portrait.click()
  await expect(page.locator('.portrait-circle')).toHaveCSS('transform', 'none')
})

test('foto real fornecida é carregada sem distorção', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const photo = page.getByRole('img', { name: 'Andson Rocha', exact: true })
  await expect(photo).toHaveAttribute('src', '/images/profile/FotoParaPerfil.webp')
  expect(await photo.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(
    0,
  )
  await expect(photo).toHaveCSS('object-fit', 'cover')
})

test('penas têm densidade responsiva, repulsão suave e retorno', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.keyboard.press('Escape')
  await expect(page.locator('.feather-particle:visible')).toHaveCount(30)
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
  const index = await page.locator('.feather-particle').evaluateAll((elements) =>
    elements.findIndex((element) => {
      const box = element.getBoundingClientRect()
      return (
        box.y > 150 && box.bottom < innerHeight - 100 && box.x > 100 && box.right < innerWidth - 100
      )
    }),
  )
  expect(index).toBeGreaterThanOrEqual(0)
  const particle = page.locator('.feather-particle').nth(index)
  const box = (await particle.boundingBox())!
  const repel = particle.locator('.feather-repel')
  await page.mouse.move(box.x + box.width / 2 + 12, box.y + box.height / 2)
  await page.waitForTimeout(800)
  await expect
    .poll(() =>
      repel.evaluate((element) => {
        const matrix = new DOMMatrix(getComputedStyle(element).transform)
        return Math.hypot(matrix.m41, matrix.m42)
      }),
    )
    .toBeGreaterThan(1)
  await page.mouse.move(-1, -1)
  await expect
    .poll(() =>
      repel.evaluate((element) => {
        const matrix = new DOMMatrix(getComputedStyle(element).transform)
        return Math.hypot(matrix.m41, matrix.m42)
      }),
    )
    .toBeLessThan(0.5)
  await page.setViewportSize({ width: 900, height: 1000 })
  await expect(page.locator('.feather-particle:visible')).toHaveCount(18)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.feather-particle:visible')).toHaveCount(10)
  const widths = await page
    .locator('.feather-particle:visible')
    .evaluateAll((elements) =>
      elements.map((element) => parseFloat(getComputedStyle(element).width)),
    )
  expect(Math.max(...widths)).toBeLessThanOrEqual(380)
  expect(Math.min(...widths)).toBeGreaterThanOrEqual(22)
})

test('falha de carregamento da foto mostra o monograma acessível', async ({ page }) => {
  await page.route('**/images/profile/FotoParaPerfil.webp', (route) => route.abort())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('img', { name: /Monograma AR, espaço reservado/ })).toBeVisible()
})

test('touch mantém movimento natural e giro sem simular halo ou repulsão', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  try {
    await page.addInitScript(() => localStorage.setItem('ar-theme', 'light'))
    await page.goto('/')
    await expect(page.locator('.welcome-letter').last()).toHaveCSS('opacity', '1')
    await page.screenshot({ path: '.verification/update-3/welcome-mobile-light.png' })
    await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
    expect(
      await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches),
    ).toBe(false)
    const feather = page.locator('.floating-feather').first()
    const before = await feather.evaluate((element) => getComputedStyle(element).transform)
    await expect
      .poll(() => feather.evaluate((element) => getComputedStyle(element).transform))
      .not.toBe(before)
    await page
      .locator('.portrait-button')
      .dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 80, clientY: 500 })
    await expect(page.locator('.portrait-halo')).toHaveCSS('opacity', '0')
    expect(
      await page.locator('.feather-repel').evaluateAll((elements) =>
        elements.every((element) => {
          const matrix = new DOMMatrix(getComputedStyle(element).transform)
          return matrix.m41 === 0 && matrix.m42 === 0
        }),
      ),
    ).toBe(true)
    await page.locator('.portrait-button').tap()
    await expect(page.locator('.portrait-button')).toHaveAttribute('aria-busy', 'true')
    await expect(page.locator('.portrait-button')).toHaveAttribute('aria-busy', 'false')
    await expect(page.locator('.portrait-circle')).toHaveCSS('transform', 'none')
  } finally {
    await context.close()
  }
})
