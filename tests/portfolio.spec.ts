import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { safeHref } from '../src/lib/links'

test('apresenta conteúdo confirmado e omite arquivos ainda não fornecidos', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Andson Rocha.', exact: true })).toBeVisible()
  await expect(page.locator('main > section')).toHaveCount(9)
  await expect(page.getByRole('link', { name: /baixar currículo/i })).toHaveCount(0)
  await expect(page.getByText('Certificados a caminho.')).toBeVisible()
  await expect(page.getByText('Novos encontros, em breve.')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Andson Rocha', exact: true })).toBeVisible()
})

test('carrossel responde a botões e teclado sem criar repositórios fictícios', async ({ page }) => {
  await page.goto('/#projetos')
  const carousel = page.getByRole('region', { name: 'Projetos selecionados' })
  await expect(carousel.getByRole('heading', { name: 'Entre Mitos e Raízes' })).toBeVisible()
  await page.getByRole('button', { name: 'Próximo projeto' }).click()
  await expect(
    carousel.getByRole('heading', { name: 'Ame-Pet — Sistema de Gerenciamento de Petshop' }),
  ).toBeVisible()
  await carousel.focus()
  await page.keyboard.press('End')
  await expect(carousel.getByRole('heading', { name: 'Portfólio Pessoal' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(carousel.getByRole('heading', { name: 'Entre Mitos e Raízes' })).toBeVisible()
  await expect(carousel.getByRole('link', { name: /repositório/i })).toHaveCount(0)
})

test('tema persiste, respeita movimento reduzido e suporta fallback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fafafa')
  await page.evaluate(() =>
    Object.defineProperty(document, 'startViewTransition', {
      value: undefined,
      configurable: true,
    }),
  )
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('links públicos são corretos e protocolos inseguros são rejeitados', async ({ page }) => {
  for (const href of [
    'javascript:alert(1)',
    'data:text/html,x',
    '//evil.test',
    '/\\evil.test',
    'https://user:pass@example.com',
    ' https://example.com',
    '/docs/../secret',
  ])
    expect(safeHref(href)).toBeUndefined()
  await page.goto('/')
  const whatsapp = page.locator('#contato a').filter({ hasText: 'WhatsApp' })
  const url = new URL((await whatsapp.getAttribute('href'))!)
  expect(url.pathname).toBe('/5584920002691')
  expect(url.searchParams.get('text')).toBe(
    'Olá, Andson! Conheci seu portfólio e gostaria de entrar em contato.',
  )
  await expect(page.locator('#contato a[href="mailto:antonioandson1307@gmail.com"]')).toHaveCount(1)
  for (const link of await page.locator('a[target="_blank"]').all())
    expect(await link.getAttribute('rel')).toBe('noopener noreferrer')
  for (const link of await page.locator('a[href^="#"]').all())
    await expect(page.locator((await link.getAttribute('href'))!)).toHaveCount(1)
})

test('menu móvel mantém o foco, fecha com Escape e navega para a seção', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page
    .getByRole('navigation', { name: 'Navegação mobile' })
    .getByRole('link', { name: 'Projetos' })
    .click()
  await expect(page).toHaveURL(/#projetos$/)
  await expect(page.locator('#projetos')).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('swipe horizontal troca o projeto e gesto vertical preserva o slide', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#projetos')
  const slide = page.locator('.project-slide')
  await slide.evaluate((target) => {
    target.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        touches: [new Touch({ identifier: 1, target, clientX: 300, clientY: 200 })],
      }),
    )
    target.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        changedTouches: [new Touch({ identifier: 1, target, clientX: 80, clientY: 215 })],
      }),
    )
  })
  await expect(page.locator('.project-information h3')).toHaveText(
    'Ame-Pet — Sistema de Gerenciamento de Petshop',
  )
  await slide.evaluate((target) => {
    const touches = [
      new Touch({ identifier: 3, target, clientX: 200, clientY: 200 }),
      new Touch({ identifier: 4, target, clientX: 300, clientY: 200 }),
    ]
    target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches }))
    target.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        changedTouches: [new Touch({ identifier: 3, target, clientX: 50, clientY: 200 })],
      }),
    )
  })
  await expect(page.locator('.project-information h3')).toHaveText(
    'Ame-Pet — Sistema de Gerenciamento de Petshop',
  )
  await slide.evaluate((target) => {
    target.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        touches: [new Touch({ identifier: 2, target, clientX: 200, clientY: 200 })],
      }),
    )
    target.dispatchEvent(
      new TouchEvent('touchend', {
        bubbles: true,
        changedTouches: [new Touch({ identifier: 2, target, clientX: 195, clientY: 410 })],
      }),
    )
  })
  await expect(page.locator('.project-information h3')).toHaveText(
    'Ame-Pet — Sistema de Gerenciamento de Petshop',
  )
})

test('localStorage indisponível não impede a troca de tema', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError')
      },
    }),
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('entrada anima o conteúdo em cada carregamento', async ({ page }) => {
  await page.goto('/')
  await expect
    .poll(() => page.locator('h1').evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBeLessThan(1)
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete', {
    timeout: 10000,
  })
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await page.reload()
  await expect
    .poll(() => page.locator('h1').evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBeLessThan(1)
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete', {
    timeout: 10000,
  })
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
})

test('penas se movem, pausam, invertem de cor e respeitam redução', async ({ page }) => {
  await page.goto('/')
  const feather = page.locator('.floating-feather').first()
  await expect(feather).toHaveCSS('filter', 'invert(1)')
  const before = await feather.evaluate((element) => getComputedStyle(element).transform)
  await expect
    .poll(() => feather.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(before)
  await page.getByRole('button', { name: 'Pausar animações' }).click()
  const paused = await feather.evaluate((element) => getComputedStyle(element).transform)
  await page.waitForTimeout(300)
  expect(await feather.evaluate((element) => getComputedStyle(element).transform)).toBe(paused)
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(feather).toHaveCSS('filter', 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.getByRole('button', { name: 'Movimento reduzido pelo sistema' })).toBeDisabled()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
})

test('corte em V revela a interface e termina nos dois sentidos', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete', {
    timeout: 12000,
  })
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(page.getByRole('button', { name: 'Ativar tema escuro' })).toBeDisabled()
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
  await page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation instanceof CSSAnimation &&
          ['v-reveal', 'cut-line'].includes(animation.animationName),
      )
      .forEach((animation) => {
        animation.pause()
        animation.currentTime = 700
      }),
  )
  await page.screenshot({ path: '.verification/theme-v.png' })
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement, '::view-transition-new(root)').clipPath,
    ),
  ).toContain('polygon')
  await page.evaluate(() => document.getAnimations().forEach((animation) => animation.play()))
  await expect(page.getByRole('button', { name: 'Ativar tema escuro' })).toBeEnabled()
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click()
  await expect(page.getByRole('button', { name: 'Ativar tema claro' })).toBeEnabled()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('.theme-cut')).toHaveCount(0)
})

test('desktop e mobile sem overflow, erros de console ou violações axe', async ({ page }) => {
  test.setTimeout(90000)
  const errors: string[] = []
  const failedResponses: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`)
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.locator('img[loading="lazy"]').evaluateAll((images) =>
    images.forEach((image) => {
      ;(image as HTMLImageElement).loading = 'eager'
    }),
  )
  await page.evaluate(() => Promise.all(Array.from(document.images, (image) => image.decode())))
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), {
        message: `overflow at ${width}px`,
      })
      .toBe(true)
  }
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await page.getByRole('button', { name: 'Ativar tema claro' }).click()
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.screenshot({ path: `.verification/${theme}-${width}.png`, fullPage: true })
      await page.locator('.hero').screenshot({ path: `.verification/hero-${theme}-${width}.png` })
      await page
        .locator('#projetos')
        .screenshot({ path: `.verification/projects-${theme}-${width}.png` })
      await page.evaluate(() => scrollTo(0, 0))
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      expect(
        audit.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ).toEqual([])
    }
  }
  expect(errors).toEqual([])
  expect(failedResponses).toEqual([])
})

test('carrossel preserva zoom e não rouba teclas de controles internos', async ({ page }) => {
  await page.goto('/#projetos')
  await expect(page.locator('.project-slide')).toHaveCSS('touch-action', 'pan-y pinch-zoom')
  const summary = page.locator('.project-details summary')
  await summary.focus()
  await page.keyboard.press('ArrowRight')
  await expect(summary).toBeFocused()
  await expect(page.locator('.project-information h3')).toHaveText('Entre Mitos e Raízes')
  await page.keyboard.press('Enter')
  await expect(page.locator('.project-details')).toHaveAttribute('open', '')
})
