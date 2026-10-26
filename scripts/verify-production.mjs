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
  await page.getByRole('heading', { name: /^ANDSON\s*ROCHA\.$/ }).waitFor()
  const photo = page.getByRole('img', { name: 'Andson Rocha', exact: true })
  assert.equal(await photo.getAttribute('src'), '/images/profile/FotoParaPerfil.webp')
  assert.ok(await photo.evaluate((image) => image.complete && image.naturalWidth > 0))
  const imageBytes = await readFile('dist/images/profile/FotoParaPerfil.webp')
  assert.equal(imageBytes.toString('ascii', 0, 4), 'RIFF')
  assert.equal(imageBytes.toString('ascii', 8, 12), 'WEBP')
  assert.equal(imageBytes.readUInt32LE(4) + 8, imageBytes.length)
  let imageEnd = 12
  while (imageEnd < imageBytes.length) {
    const type = imageBytes.toString('ascii', imageEnd, imageEnd + 4)
    assert.ok(!['EXIF', 'XMP '].includes(type), `Private photo metadata: ${type}`)
    const length = imageBytes.readUInt32LE(imageEnd + 4)
    imageEnd += 8 + length + (length % 2)
  }
  assert.equal(imageEnd, imageBytes.length, 'Unexpected data after the WebP image')
  await page.getByRole('button', { name: 'Ativar tema claro' }).click()
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
  assert.equal(await page.locator('main > section').count(), 9)
  const csp = await page
    .locator('meta[http-equiv="Content-Security-Policy"]')
    .getAttribute('content')
  const connectSources = csp
    .split(';')
    .find((directive) => directive.trim().startsWith('connect-src'))
    .trim()
    .split(/\s+/)
    .slice(1)
  assert.ok(connectSources.includes("'self'"))
  assert.ok(
    connectSources.every((source) =>
      ["'self'", 'https://vitals.vercel-insights.com'].includes(source),
    ),
  )
  assert.ok(!csp.includes('ws://'))
  const html = await readFile('dist/index.html', 'utf8')
  assert.ok(html.includes('https://andsonrocha.vercel.app/og-image.png'))
  assert.ok(html.includes('summary_large_image'))
  const ogResponse = await page.request.get('http://127.0.0.1:4173/og-image.png')
  assert.equal(ogResponse.status(), 200)
  assert.ok(ogResponse.headers()['content-type'].includes('image/png'))
  const ogBytes = await ogResponse.body()
  assert.equal(ogBytes.readUInt32BE(16), 1200)
  assert.equal(ogBytes.readUInt32BE(20), 630)
  assert.deepEqual(ogBytes, await readFile('dist/og-image.png'))
  assert.equal(await page.locator('.visitor-counter').getAttribute('aria-pressed'), 'false')
  assert.equal(
    await page.locator('#contato a[href="https://www.instagram.com/andsonzy/"]').count(),
    1,
  )
  await page.getByRole('link', { name: 'Conheça meus projetos' }).click()
  const titles = []
  const featherSources = await page
    .locator('.floating-feather')
    .evaluateAll((images) => [...new Set(images.map((image) => image.getAttribute('src')))])
  assert.equal(featherSources.length, 6)
  for (const src of featherSources) {
    const response = await page.request.get(`http://127.0.0.1:4173${src}`)
    assert.equal(response.status(), 200)
    assert.ok(response.headers()['content-type'].includes('image/svg+xml'))
  }
  const coverResponse = await page.request.get(
    'http://127.0.0.1:4173/images/projects/capa_retangular_mitos_e_raizes.webp',
  )
  assert.equal(coverResponse.status(), 200)
  assert.ok(coverResponse.headers()['content-type'].includes('image/webp'))
  const accessibilityArtResponse = await page.request.get(
    'http://127.0.0.1:4173/images/projects/acessibilidade.svg',
  )
  assert.equal(accessibilityArtResponse.status(), 200)
  assert.ok(accessibilityArtResponse.headers()['content-type'].includes('image/svg+xml'))
  const projectCount = await page.locator('.project-indicators button').count()
  assert.equal(projectCount, 6)
  for (let i = 0; i < projectCount; i++) {
    titles.push(await page.locator('.project-information h3').textContent())
    await page.locator('.project-art > img').evaluate((image) => image.decode())
    await page.locator('.project-detail-trigger').click()
    assert.equal(await page.getByRole('dialog').isVisible(), true)
    await page
      .getByRole('dialog')
      .locator('img')
      .evaluate((image) => image.decode())
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Próximo projeto' }).click()
  }
  assert.equal(new Set(titles).size, projectCount)
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
        projectCount,
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
