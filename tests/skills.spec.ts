import { expect, test } from '@playwright/test'

test('navegação abre habilidades e conteúdo é revelado com movimento habilitado', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.keyboard.press('Escape')
  await page.locator('.site-header a[href="#habilidades"]').click()
  await expect(page).toHaveURL(/#habilidades$/)
  const heading = page.getByRole('heading', { name: 'Tecnologias que utilizo', level: 3 })
  await expect(heading).toBeVisible()
  await expect
    .poll(() => heading.evaluate((el) => getComputedStyle(el.parentElement!).opacity))
    .toBe('1')
  const lastCategory = page.getByRole('heading', { name: 'Containers', level: 4 })
  await lastCategory.scrollIntoViewIfNeeded()
  await expect(lastCategory).toBeVisible()
  await expect
    .poll(() => lastCategory.evaluate((el) => getComputedStyle(el.closest('.skill-row')!).opacity))
    .toBe('1')
})

test('habilidades apresentam as tecnologias solicitadas em grupos e categorias', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#habilidades')

  const expected = [
    {
      title: 'Tecnologias que utilizo',
      categories: [
        ['Front-end', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Vite', 'React'],
        ['Linguagens e execução', 'Java', 'Python', 'Node.js', 'C', 'C++'],
        ['Bancos de dados', 'MySQL', 'PostgreSQL'],
        ['Testes', 'Vitest', 'pytest'],
        ['Desenvolvimento e colaboração', 'Git', 'GitHub', 'Figma', 'npm', 'npm Workspaces'],
        [
          'Nuvem, automação e hospedagem',
          'AWS',
          'GitHub Actions',
          'Vercel',
          'Vercel Web Analytics',
          'Cloudflare Pages',
        ],
      ],
    },
    {
      title: 'Tecnologias com conhecimento inicial',
      categories: [
        ['Back-end e APIs', 'Django', 'Django REST Framework', 'Express', 'Socket.IO'],
        ['Bancos de dados e serviços', 'SQLite', 'Supabase'],
        ['Interfaces e animações', 'GSAP', 'Motion', 'React Router'],
        ['Java para desktop e gráficos', 'Swing', 'AWT/Graphics2D', 'JavaFX'],
        ['Testes e qualidade', 'Supertest', 'pytest-django', 'ESLint', 'Prettier'],
        ['Containers', 'Docker'],
      ],
    },
  ]
  const section = page.locator('#habilidades')
  const allNames: string[] = []
  for (const group of expected) {
    const region = section.getByRole('region', { name: group.title })
    await expect(region.getByRole('heading', { name: group.title, level: 3 })).toBeVisible()
    const rows = region.locator('.skill-row')
    await expect(rows).toHaveCount(group.categories.length)
    for (const [index, [category, ...names]] of group.categories.entries()) {
      const row = rows.nth(index)
      await expect(row.getByRole('heading', { name: category, level: 4 })).toBeVisible()
      await expect(row.locator('.eyebrow')).toHaveText(String(index + 1).padStart(2, '0'))
      await expect(row.locator('.skill-items li > span:first-of-type')).toHaveText(names)
      await expect(row.locator('.skill-items li svg[aria-hidden="true"]')).toHaveCount(names.length)
      allNames.push(...names)
    }
  }
  expect(allNames).toHaveLength(43)
  expect(new Set(allNames).size).toBe(43)
  await expect(section.locator('.skill-items li')).toHaveCount(43)
  await expect(section.getByText('Ambiente de execução JavaScript')).toHaveCount(1)
  await expect(section).toContainText(
    'Tive contato com estas tecnologias em projetos e estudos e continuo aprofundando meu conhecimento na prática.',
  )
})

for (const theme of ['dark', 'light'] as const) {
  for (const width of [360, 390, 768, 1440]) {
    test(`habilidades são legíveis em ${width}px no tema ${theme}`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.addInitScript((value) => localStorage.setItem('ar-theme', value), theme)
      await page.goto('/#habilidades')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await expect(page.locator('#habilidades')).toBeVisible()
      await expect(page.locator('#habilidades .skill-row')).toHaveCount(12)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      const clipped = await page.locator('#habilidades .skill-items li').evaluateAll((items) =>
        items.some((item) => {
          const box = item.getBoundingClientRect()
          const text = item.querySelector('span:not(.sr-only)')?.getBoundingClientRect()
          const icon = item.querySelector('svg')?.getBoundingClientRect()
          return !text || !icon || text.right > box.right + 1 || icon.right > text.left
        }),
      )
      expect(clipped).toBe(false)
      expect(errors).toEqual([])
    })
  }
}
