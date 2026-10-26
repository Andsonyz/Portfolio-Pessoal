import { expect, test } from '@playwright/test'

test('seis projetos, repositórios públicos, acessibilidade e novas habilidades', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('main > section')).toHaveCount(9)
  await expect(page.locator('.project-indicators button')).toHaveCount(6)
  const titles = [
    'Entre Mitos e Raízes',
    'Ame-Pet — Sistema de Gerenciamento de Petshop',
    'Sistema Restaurante Dividão',
    'SAPO — Achados e Perdidos UFERSA',
    'Portfólio Pessoal',
    'Acessibilidade Digital para deficientes visuais',
  ]
  for (const [index, title] of titles.entries()) {
    await page.locator('.project-indicators button').nth(index).click()
    await expect(page.locator('.project-information h3')).toHaveText(title)
    await expect(page.locator('.project-information')).toHaveAttribute(
      'aria-label',
      `${index + 1} de 6`,
    )
    const repository = page.locator('.project-information').getByRole('link', {
      name: 'Ver repositório',
    })
    const expectedRepositories: Record<number, string> = {
      0: 'https://github.com/Andsonyz/Projeto-Entre-Mitos-E-Ra-zes',
      1: 'https://github.com/gabrdsp/Ame-Pet',
      2: 'https://github.com/Mayconsmy/Sistema-de-Gerenciamento-de-Pedidos-para-Restaurante',
      4: 'https://github.com/Andsonyz/Portfolio-Pessoal',
    }
    if (index in expectedRepositories) {
      await expect(repository).toHaveAttribute('href', expectedRepositories[index]!)
      await expect(repository).toHaveAttribute('rel', 'noopener noreferrer')
    } else {
      await expect(repository).toHaveCount(0)
    }
    if (index === 1 || index === 2) {
      await expect(page.locator('.project-information')).toContainText(/colaborativo/i)
      await expect(page.locator('.project-information')).toContainText(/terminal/i)
      await expect(repository).toBeVisible()
    }
    if (index === 5) {
      await expect(page.locator('.project-information')).toContainText('braille')
      await expect(page.locator('.project-information')).not.toContainText('github.com')
    }
  }
  await expect(page.locator('body')).not.toContainText('Sistema de Consultório/Clínica')
  await expect(page.locator('#experiencias')).toContainText(
    'Desenvolvimento de Software para Acessibilidade Digital',
  )
  await expect(page.locator('#experiencias')).toContainText('Em desenvolvimento')
  await expect(page.locator('#sobre')).toContainText('baixa visão ou cegueira')
  for (const name of ['Python', 'Node.js', 'MySQL', 'PostgreSQL'])
    await expect(page.locator('#habilidades').getByText(name, { exact: true })).toBeVisible()
})

test('relógio usa hora real em Fortaleza, atualiza e reage a ajuste do dispositivo', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.pauseAt(new Date('2026-10-23T17:35:09Z'))
  await page.goto('/')
  const clock = page.locator('.local-clock time')
  await expect(clock).toHaveText('14:35:09')
  await expect(page.locator('.local-clock')).toContainText('UTC−03:00')
  await expect(page.locator('.local-clock')).toHaveAttribute('aria-live', 'off')
  await page.clock.fastForward(3000)
  await expect(clock).toHaveText('14:35:12')
  await page.clock.setSystemTime(new Date('2026-10-24T03:00:00Z'))
  await page.clock.fastForward(1000)
  await expect(clock).toHaveText('00:00:01')
})

test('faixas movem, pausam no hover/global e oferecem conteúdo estático reduzido', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const bands = page.locator('.section-marquee')
  await expect(bands).toHaveCount(3)
  await bands.first().scrollIntoViewIfNeeded()
  const track = bands.first().locator('.marquee-track')
  await expect(track).toHaveAttribute('aria-hidden', 'true')
  const before = await track.evaluate((el) => getComputedStyle(el).transform)
  await expect.poll(() => track.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before)
  await bands.first().hover()
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  await page.mouse.move(0, 0)
  await page.getByRole('button', { name: 'Pausar animações' }).click()
  await expect(track).toHaveCSS('animation-name', 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  await expect(page.locator('main > section')).toHaveCount(9)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true)
  await expect(bands.first().locator('.marquee-static')).toBeVisible()
})

test('foto gira em Y como moeda e pausa restaura posição e halo independente', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Escape')
  const button = page.locator('.portrait-button')
  const disc = page.locator('.portrait-circle')
  await button.click()
  await expect(button).toHaveAttribute('aria-busy', 'true')
  await expect
    .poll(() =>
      disc.evaluate((el) => {
        const m = new DOMMatrix(getComputedStyle(el).transform)
        return Math.abs(m.m13) > 0.05 && Math.abs(m.m12) < 0.001 && Math.abs(m.m21) < 0.001
      }),
    )
    .toBe(true)
  await button.click()
  await expect(button).toHaveAttribute('aria-busy', 'false')
  await expect(disc).toHaveCSS('transform', 'none')
  await button.click()
  await page.getByRole('button', { name: 'Pausar animações' }).click()
  await expect(disc).toHaveCSS('transform', 'none')
  await expect(button).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('.portrait-frame > .portrait-halo')).toHaveCount(1)
})
