import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// Run against `npm run preview` after building. Checks the actual generated bundle and CSP.
const browser = await chromium.launch({ channel: 'msedge' })
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  })
  const errors = []
  const requests = new Set()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('request', (request) => requests.add(new URL(request.url()).origin))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  })
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('heading', { name: 'Andson Rocha.', exact: true }).waitFor()
  const photo = page.getByRole('img', { name: 'Andson Rocha', exact: true })
  assert.equal(await photo.getAttribute('src'), '/images/profile/FotoParaPerfil.png')
  assert.ok(await photo.evaluate((image) => image.complete && image.naturalWidth > 0))
  const imageBytes = await readFile('dist/images/profile/FotoParaPerfil.png')
  let imageEnd = 8
  while (imageEnd < imageBytes.length) {
    const type = imageBytes.toString('ascii', imageEnd + 4, imageEnd + 8)
    assert.ok(!['eXIf', 'tEXt', 'zTXt', 'iTXt'].includes(type), `Private photo metadata: ${type}`)
    imageEnd += imageBytes.readUInt32BE(imageEnd) + 12
    if (type === 'IEND') break
  }
  assert.equal(imageEnd, imageBytes.length, 'Unexpected data after the PNG image')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
  assert.equal(await page.locator('main > section').count(), 9)
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content')
  assert.ok(csp.includes("connect-src 'self';"))
  assert.ok(!csp.includes('ws://'))
  await page.getByRole('link', { name: 'Conheça meus projetos' }).click()
  const titles = []
  for (let i = 0; i < 4; i++) {
    titles.push(await page.locator('.project-information h3').textContent())
    await page.locator('.project-art img').evaluate((image) => image.decode())
    await page.getByRole('button', { name: 'Próximo projeto' }).click()
  }
  assert.equal(new Set(titles).size, 4)
  await page.locator('#trajetoria summary').click()
  assert.equal(await page.locator('#trajetoria details').getAttribute('open'), '')
  assert.equal(await page.getByRole('link', { name: /baixar currículo/i }).count(), 0)
  assert.deepEqual(errors, [])
  assert.deepEqual([...requests], ['http://127.0.0.1:4173'])
  console.log(
    JSON.stringify(
      {
        result: 'passed',
        sections: 9,
        projectTitles: titles,
        theme: 'light',
        externalRequests: 0,
        consoleErrors: 0,
        productionCSP: 'verified',
        profilePhoto: 'loaded, metadata removed',
      },
      null,
      2,
    ),
  )
} finally {
  await browser.close()
}
