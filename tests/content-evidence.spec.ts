import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
})

test('datas dos eventos não se sobrepõem aos títulos no mobile', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await expect
      .poll(() =>
        page.locator('#eventos .timeline-item').evaluateAll((items) =>
          items.every((item) => {
            const date = item.querySelector('.timeline-date')!
            const title = item.querySelector('.timeline-details')!.getBoundingClientRect()
            const range = document.createRange()
            range.selectNodeContents(date)
            const text = range.getBoundingClientRect()
            return text.right <= title.left + 1 || text.bottom <= title.top + 1
          }),
        ),
      )
      .toBe(true)
  }
})

test('cursos e eventos usam os dados dos oito anexos, com datas e horas corretas', async ({
  page,
}) => {
  const certificates = page.locator('#certificacoes .certificate')
  await expect(certificates).toHaveCount(3)
  await expect(certificates.filter({ hasText: 'JavaScript para Iniciantes' })).toContainText(
    '30 horas',
  )
  await expect(certificates.filter({ hasText: 'Godot' })).toContainText('6 horas')
  await expect(certificates.filter({ hasText: 'Claude' })).toContainText('8 horas')
  const events = page.locator('#eventos .timeline-item')
  await expect(events).toHaveCount(5)
  const science = events.filter({ hasText: 'II Semana de Ciências' })
  await science.locator('.timeline-details > summary').click()
  await expect(science).toContainText('4 horas')
  await expect(science).toContainText('30 horas')
  await expect(page.locator('#certificacoes')).not.toContainText('Certificados a caminho')
  await expect(page.locator('#eventos')).not.toContainText('Novos encontros, em breve')
  const proofs = page.locator('a[href^="/documents/certificates/"]')
  await expect(proofs).toHaveCount(8)
  for (const link of await proofs.all()) {
    const response = await page.request.get((await link.getAttribute('href'))!)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('application/pdf')
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  }
})

test('a trajetória começa em 2023 antes da graduação, e validação mostra dados verificáveis', async ({
  page,
}) => {
  const first = page.locator('#trajetoria .timeline-item').first()
  await expect(first.locator('.timeline-date')).toContainText('2023')
  await first.locator('summary').click()
  await expect(first).toContainText('JavaScript')
  await expect(first).toContainText('antes de ingressar na faculdade')
  const javascript = page.locator('#certificacoes .certificate').filter({ hasText: 'JavaScript' })
  await javascript.getByText('Sobre a validação', { exact: true }).click()
  await expect(javascript).toContainText('solicite o documento original ao titular')
  await expect(javascript).toContainText('10/11/2026')
  await expect(javascript).not.toContainText('885941')
  await expect(javascript).not.toContainText('f7ab86477c')
})

test('projetos têm cinco destaques e lista compacta sem links privados ou vazios', async ({
  page,
}) => {
  await expect(page.locator('.project-indicators button')).toHaveCount(5)
  const titles = [
    'Entre Mitos e Raízes',
    'Sistema de Gerenciamento de Pedidos',
    'mesa. | inteligência',
    'Catálogo de Filmes e Séries',
    'Site Institucional — Iara Santos',
  ]
  for (const [index, title] of titles.entries()) {
    await page.locator('.project-indicators button').nth(index).click()
    await expect(page.locator('.project-information h3')).toHaveText(title)
  }
  const archive = page.locator('.project-archive')
  await expect(archive.getByRole('link', { name: '2025-1' })).toHaveAttribute(
    'href',
    'https://github.com/Andsonyz/2025-1',
  )
  await expect(archive.getByRole('link', { name: 'Saboneteira' })).toBeVisible()
  await expect(archive.locator('a[href*="meu-projeto"]')).toHaveCount(0)
  const privateProject = archive.getByRole('button', {
    name: 'Detalhes de Acessibilidade Digital para deficientes visuais',
  })
  await privateProject.click()
  const dialog = page.getByRole('dialog', {
    name: 'Acessibilidade Digital para deficientes visuais',
  })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Repositório GitHub' })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(privateProject).toBeFocused()
})

test('conteúdo novo cabe no mobile nos dois temas e os controles funcionam pelo teclado', async ({
  page,
}) => {
  for (const width of [320, 360, 390, 768, 1366, 1536, 1920]) {
    await page.setViewportSize({ width, height: width < 400 ? 844 : 1080 })
    for (const theme of ['dark', 'light']) {
      const current = await page.locator('html').getAttribute('data-theme')
      if (current !== theme)
        await page
          .getByRole('button', {
            name: theme === 'light' ? 'Ativar tema claro' : 'Ativar tema escuro',
          })
          .click()
      for (const section of ['#projetos', '#certificacoes', '#trajetoria', '#eventos']) {
        await page.locator(section).scrollIntoViewIfNeeded()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
      }
    }
  }
  await page.setViewportSize({ width: 360, height: 800 })
  const trigger = page.getByRole('button', {
    name: 'Detalhes de Ame-Pet — Sistema de Gerenciamento de Petshop',
    exact: true,
  })
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('dialog', { name: 'Ame-Pet — Sistema de Gerenciamento de Petshop' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
  const validation = page.locator('#certificacoes .certificate-validation').last()
  await validation.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(validation).toHaveAttribute('open', '')
  await expect(validation.getByRole('link', { name: 'Validar no SIGAA' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  )
})
