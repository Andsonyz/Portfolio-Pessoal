import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('Hero e Sobre apresentam os textos atualizados, relógio e localização sem duplicação', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.locator('.hero-greeting')).toHaveText('Olá, me chamo')
  await expect(page.locator('#inicio h1')).toHaveText('ANDSONROCHA.')
  await expect(page.locator('#inicio h1 span')).toHaveText('ROCHA.')
  await expect(page.locator('#inicio .hero-bio h2')).toContainText(
    'Universidade Federal Rural do Semi-Árido',
  )
  await expect(page.locator('#inicio .local-clock time')).toHaveText(/^\d{2}:\d{2}:\d{2}$/)
  await expect(page.locator('#sobre')).toContainText('Bacharelado Interdisciplinar em Tecnologia')
  await expect(page.locator('#sobre')).toContainText('projetos voltados à acessibilidade digital')
  await expect(page.locator('#inicio')).not.toContainText('Pau dos Ferros, RN')
  await expect(page.locator('.site-footer')).toContainText('Pau dos Ferros, RN')
})

test('No meu radar expande cada resumo e Áreas que eu exploro revela todos os grupos', async ({
  page,
}) => {
  await page.goto('/')

  const radar = page.locator('.radar-list')
  await expect(radar.getByRole('button')).toHaveCount(4)
  const radarSummaries = [
    [
      'Engenharia de Software',
      'Aplicação de métodos, processos e boas práticas para planejar, desenvolver, testar e manter sistemas de software com qualidade, organização e confiabilidade.',
    ],
    [
      'Desenvolvimento Full Stack',
      'Desenvolvimento de aplicações completas, integrando interfaces, lógica de negócio, APIs, bancos de dados e diferentes tecnologias de front-end e back-end.',
    ],
    [
      'UX/UI Design',
      'Criação de interfaces intuitivas e experiências digitais acessíveis, considerando as necessidades dos usuários, a usabilidade e a organização visual.',
    ],
    [
      'Cloud Computing',
      'Utilização de serviços e infraestruturas em nuvem para hospedar, distribuir, integrar e escalar aplicações com disponibilidade e segurança.',
    ],
  ]
  const engineering = radar.getByRole('button', { name: radarSummaries[0]![0] })
  await expect(engineering).toHaveAttribute('aria-expanded', 'false')
  await engineering.focus()
  await page.keyboard.press('Enter')
  await expect(engineering).toHaveAttribute('aria-expanded', 'true')
  for (const [title, summary] of radarSummaries) {
    const button = radar.getByRole('button', { name: title })
    if (title !== radarSummaries[0]![0]) await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByText(summary, { exact: true })).toBeVisible()
  }

  const areas = page.locator('.role-expansion')
  await expect(areas).toBeHidden()
  const showAll = page.getByRole('button', { name: 'Mostrar tudo' })
  await showAll.click()
  await expect(areas).toBeVisible()
  await expect(areas.locator('li')).toHaveText([
    'Front-end Developer',
    'Back-end Developer',
    'UX/UI Designer',
    'Full-stack Developer',
  ])
  await expect(page.locator('.role-line')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Mostrar menos' })).toBeVisible()
  await page.getByRole('button', { name: 'Mostrar menos' }).click()
  await expect(areas).toBeHidden()
  await expect(page.locator('.role-line')).toBeVisible()
})

test('a foto não exibe instrução permanente nem sinais decorativos de mais', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  await expect(page.locator('.portrait-hint')).toHaveCount(0)
  await expect(page.locator('.portrait-cross, .tiny-cross')).toHaveCount(0)
  await expect(page.locator('#trajetoria .timeline-continuation > span')).toHaveCount(0)
  const portrait = page.getByRole('button', { name: 'Girar foto de Andson Rocha' })
  await portrait.focus()
  await page.keyboard.press('Enter')
  await expect(portrait).toHaveAttribute('aria-busy', 'true')
})

test('botão flutuante do WhatsApp reutiliza exatamente o contato configurado', async ({ page }) => {
  await page.goto('/')

  const contactLink = page.locator('#contato a').filter({ hasText: 'WhatsApp' })
  const floatingLink = page.getByRole('link', { name: 'Conversar pelo WhatsApp' })
  await expect(floatingLink).toBeVisible()
  await expect(floatingLink).toHaveAttribute('href', await contactLink.getAttribute('href'))
  await expect(floatingLink).toHaveAttribute('target', '_blank')
  await expect(floatingLink).toHaveAttribute('rel', 'noopener noreferrer')
})

test('a nova capa é usada sem corte no cartão e nos detalhes do projeto', async ({ page }) => {
  await page.goto('/')

  const cover = page.locator('.project-art > img')
  const feather = page.locator('.project-caption-feather')
  await expect(cover).toHaveAttribute('src', '/images/projects/capa_retangular_mitos_e_raizes.webp')
  await expect(cover).toHaveCSS('object-fit', 'contain')
  await expect(feather).toHaveAttribute('alt', '')
  await expect(feather).toHaveAttribute('aria-hidden', 'true')
  await expect(feather).toHaveCSS('pointer-events', 'none')
  await feather.evaluate((image) => (image as HTMLImageElement).decode())
  const featherResponse = await page.request.get(
    'http://127.0.0.1:5173/images/feathers/pena_03_pluma_delicada.svg',
  )
  expect(featherResponse.status()).toBe(200)
  const darkFilter = await feather.evaluate((image) => getComputedStyle(image).filter)
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  await expect(feather).toHaveCSS('filter', 'invert(1)')
  expect(darkFilter).toBe('invert(0)')
  await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
  const dialog = page.getByRole('dialog', { name: 'Entre Mitos e Raízes' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('img')).toHaveAttribute(
    'src',
    '/images/projects/capa_retangular_mitos_e_raizes.webp',
  )
})

test('todos os projetos abrem detalhes, fecham por Escape e devolvem o foco ao acionador', async ({
  page,
}) => {
  await page.goto('/')
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
    const trigger = page.getByRole('button', { name: 'Um olhar mais de perto' })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: title })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('h2')).toHaveText(title)
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  }
})

test('detalhes expandidos apresentam as informações fornecidas sem expor repositório privado', async ({
  page,
}) => {
  await page.goto('/')

  const cases = [
    {
      index: 0,
      title: 'Entre Mitos e Raízes',
      section: 'Funcionalidades',
      content: ['Quatro fases', 'JavaFX Media'],
      repository: 'https://github.com/Andsonyz/Projeto-Entre-Mitos-E-Ra-zes',
    },
    {
      index: 1,
      title: 'Ame-Pet — Sistema de Gerenciamento de Petshop',
      section: 'Integrantes',
      content: [
        'Antonio Andson de Oliveira Rocha',
        '2024010349',
        'Sophia Hellen Pires da Silveira',
      ],
      repository: 'https://github.com/gabrdsp/Ame-Pet',
    },
    {
      index: 2,
      title: 'Sistema Restaurante Dividão',
      section: 'Conceitos aplicados',
      content: ['malloc, realloc e free', 'George Felipe Fernandes Vieira'],
      repository:
        'https://github.com/Mayconsmy/Sistema-de-Gerenciamento-de-Pedidos-para-Restaurante',
    },
    {
      index: 4,
      title: 'Portfólio Pessoal',
      section: 'Sobre este site',
      content: ['Nove seções', 'React', 'TypeScript'],
      repository: 'https://github.com/Andsonyz/Portfolio-Pessoal',
    },
    {
      index: 5,
      title: 'Acessibilidade Digital para deficientes visuais',
      section: 'Objetivo e recursos',
      content: ['tabelas complexas', 'caracteres especiais', 'texto em braille e vice-versa'],
    },
  ]

  for (const item of cases) {
    await page.locator('.project-indicators button').nth(item.index).click()
    await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
    const dialog = page.getByRole('dialog', { name: item.title })
    await expect(dialog.getByRole('heading', { name: item.section })).toBeVisible()
    for (const text of item.content) await expect(dialog).toContainText(text)
    if (item.repository) {
      await expect(dialog.getByRole('link', { name: 'Repositório GitHub' })).toHaveAttribute(
        'href',
        item.repository,
      )
    } else {
      await expect(dialog.getByRole('link', { name: 'Repositório GitHub' })).toHaveCount(0)
    }
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  }
})

test('detalhes do projeto usam coluna única no mobile e mantêm rolagem interna', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#projetos')
  await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
  const dialog = page.getByRole('dialog', { name: 'Entre Mitos e Raízes' })
  await expect(dialog).toBeVisible()
  const layout = await dialog.locator('.project-dialog-panel').evaluate((element) => {
    const style = getComputedStyle(element)
    const rows = style.gridTemplateRows.split(' ').length
    const columns = style.gridTemplateColumns.split(' ').length
    const content = element.querySelector('.project-dialog-content')!
    return {
      rows,
      columns,
      overflowY: getComputedStyle(content).overflowY,
      width: element.getBoundingClientRect().width,
    }
  })
  expect(layout.rows).toBe(2)
  expect(layout.columns).toBe(1)
  expect(layout.overflowY).toBe('auto')
  expect(layout.width).toBeLessThanOrEqual(390)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('equipe extensa e sexto projeto cabem em telas pequenas e rolam dentro do painel', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/#projetos')

  for (const item of [
    { index: 1, title: 'Ame-Pet — Sistema de Gerenciamento de Petshop' },
    { index: 5, title: 'Acessibilidade Digital para deficientes visuais' },
  ]) {
    await page.locator('.project-indicators button').nth(item.index).click()
    await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
    const dialog = page.getByRole('dialog', { name: item.title })
    await expect(dialog).toBeVisible()
    const content = dialog.locator('.project-dialog-content')
    await expect(content).toHaveCSS('overflow-y', 'auto')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(await content.evaluate((element) => element.scrollHeight)).toBeGreaterThan(
      await content.evaluate((element) => element.clientHeight),
    )
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  }
})

test('o campo utiliza os seis SVGs novos, em três planos, e assets servem em HTTP', async ({
  page,
}) => {
  const failedAssets: string[] = []
  page.on('response', (response) => {
    if (response.url().includes('/images/feathers/pena_') && response.status() !== 200)
      failedAssets.push(response.url())
  })
  await page.goto('/')

  const layers = page.locator('.feather-layer')
  await expect(layers).toHaveCount(3)
  const images = page.locator('.floating-feather')
  await expect(images).not.toHaveCount(0)
  await expect
    .poll(async () =>
      images.evaluateAll(
        (elements) =>
          new Set(elements.map((element) => (element as HTMLImageElement).getAttribute('src')))
            .size,
      ),
    )
    .toBe(6)
  await images.first().evaluate((image) => (image as HTMLImageElement).decode())
  expect(failedAssets).toEqual([])
})

test('os planos de penas respondem ao scroll com deslocamentos distintos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.keyboard.press('Escape')
  await expect(page.locator('html')).toHaveAttribute('data-intro-state', 'complete')
  const layers = page.locator('.feather-layer')
  const before = await layers.evaluateAll((elements) =>
    elements.map((element) => getComputedStyle(element).transform),
  )
  await page.evaluate(() => window.scrollTo(0, 900))
  await expect
    .poll(() =>
      layers.evaluateAll((elements) =>
        elements.map((element) => getComputedStyle(element).transform),
      ),
    )
    .not.toEqual(before)
  const after = await layers.evaluateAll((elements) =>
    elements.map((element) => new DOMMatrix(getComputedStyle(element).transform).m42),
  )
  expect(new Set(after).size).toBe(3)
})

test('layout permanece sem rolagem horizontal nas larguras solicitadas', async ({ page }) => {
  await page.goto('/')
  for (const [width, height] of [
    [1920, 1080],
    [1536, 864],
    [1366, 768],
    [768, 1024],
    [390, 844],
    [360, 800],
  ]) {
    await page.setViewportSize({ width, height })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), {
        message: `horizontal overflow at ${width}×${height}`,
      })
      .toBe(true)
  }
})

test('painel mantém foco e rolagem internos, fecha pelo botão e restaura a página', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/#projetos')
  await page.locator('.project-indicators button').nth(1).click()
  const trigger = page.getByRole('button', { name: 'Um olhar mais de perto' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  const close = dialog.getByRole('button', { name: /^Fechar detalhes de / })
  await expect(close).toBeFocused()
  const before = await page.evaluate(() => scrollY)
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('link', { name: 'Repositório GitHub' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await dialog.locator('.project-dialog-art').click()
  await expect(dialog).toBeVisible()
  const content = dialog.locator('.project-dialog-content')
  await content.hover()
  await page.mouse.wheel(0, 500)
  await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
  expect(await page.evaluate(() => scrollY)).toBe(before)
  await close.click()
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden')
})

test('painel anima entrada e saída e continua reabrindo após mudança de movimento', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.keyboard.press('Escape')
  const trigger = page.locator('.project-detail-trigger')
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveCSS('opacity', '1')
  await dialog.getByRole('button', { name: /^Fechar detalhes de / }).click()
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await trigger.click()
  await expect(dialog).toHaveCSS('opacity', '1')
  await expect(dialog.getByRole('button', { name: /^Fechar detalhes de / })).toBeFocused()
})

test('detalhes sem links permanecem roláveis por teclado no mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/#projetos')
  await page.locator('.project-indicators button').nth(3).click()
  await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
  const dialog = page.getByRole('dialog', { name: 'SAPO — Achados e Perdidos UFERSA' })
  const content = dialog.getByRole('region', {
    name: 'Informações sobre SAPO — Achados e Perdidos UFERSA',
  })
  await expect(dialog.getByRole('button', { name: /^Fechar detalhes de / })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(content).toBeFocused()
  expect(await content.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(
    true,
  )
  await page.keyboard.press('End')
  await expect.poll(() => content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: /^Fechar detalhes de / })).toBeFocused()
})
