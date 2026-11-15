import { expect, test } from '@playwright/test'

test('capas dos projetos preservam as cores e identificam ilustrações conceituais', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#projetos')
  const projects = [
    { index: 1, name: 'Sistema de Gerenciamento de Pedidos', image: 'gestao-pedidos.webp' },
    { index: 2, name: 'mesa. | inteligência', image: 'dashboard-restaurante.webp' },
    { index: 3, name: 'Catálogo de Filmes e Séries', image: 'catalogo-filmes.webp' },
    { index: 4, name: 'Prática — Site de Advogados', image: 'pratica-site-advogados.webp' },
  ]
  for (const project of projects) {
    await page.locator('.project-indicators button').nth(project.index).click()
    await expect(page.locator('.project-information h3')).toHaveText(project.name)
    const cover = page.locator('.project-art > img')
    await expect(cover).toHaveAttribute('src', `/images/projects/${project.image}`)
    await expect(cover).toHaveAttribute('alt', /ilustração.*não é uma captura/i)
    await expect(cover).toHaveCSS('filter', 'none')
    await expect(page.locator('.project-art figcaption')).toContainText('Ilustração conceitual')
    await expect
      .poll(() => cover.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Um olhar mais de perto' }).click()
    const detail = page.getByRole('dialog').locator('.project-dialog-art img')
    await expect(detail).toHaveAttribute('src', `/images/projects/${project.image}`)
    await expect(detail).toHaveCSS('filter', 'none')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  }
})
