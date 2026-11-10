import type { Page } from '@playwright/test'

export async function projectTrigger(page: Page, title: string) {
  const indicator = page.getByRole('button', {
    name: new RegExp(`^Mostrar projeto \\d+: ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
  })
  if (await indicator.count()) {
    await indicator.click()
    return page.getByRole('button', { name: 'Um olhar mais de perto' })
  }
  return page.getByRole('button', { name: `Detalhes de ${title}`, exact: true })
}
