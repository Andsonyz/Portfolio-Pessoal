// Local, deterministic vector assets. No runtime generation or downloaded imagery.
import { mkdirSync, writeFileSync } from 'node:fs'
mkdirSync('public/images/feathers', { recursive: true })
for (let variant = 1; variant <= 2; variant++) {
  const center = (t) => 126 - 62 * t + Math.sin(t * Math.PI) * (variant === 1 ? 15 : 26)
  const width = (t) => Math.pow(Math.sin(Math.PI * t), 0.78) * (variant === 1 ? 53 : 43)
  const f = (n) => n.toFixed(2)
  const points = Array.from({ length: 112 }, (_, i) => {
    const t = i / 111
    const notch = i % 17 === 9 ? 0.83 : 1 + Math.sin(i * 2.3) * 0.026
    return { t, y: 18 + t * 318, x: center(t), w: width(t) * notch }
  })
  const outline = `M${points.map((p) => `${f(p.x - p.w)},${f(p.y)}`).join(' L')} L${points
    .toReversed()
    .map((p) => `${f(p.x + p.w * 0.76)},${f(p.y)}`)
    .join(' L')}Z`
  const barbs = points
    .slice(2, -2)
    .map((p, i) => {
      const anchorT = Math.min(1.11, p.t + 0.075 + Math.sin(p.t * Math.PI) * 0.085)
      const ax = center(anchorT),
        ay = 18 + anchorT * 318
      const uneven = Math.sin(i * 1.9) * 2.5
      return `<path d="M${f(p.x - p.w)} ${f(p.y)} Q${f(p.x - p.w * 0.6)} ${f(p.y + 24 + uneven)} ${f(ax)} ${f(ay)} Q${f(p.x + p.w * 0.45)} ${f(p.y + 21 - uneven)} ${f(p.x + p.w * 0.76)} ${f(p.y)}" opacity="${f(0.4 + (i % 5) * 0.1)}"/>`
    })
    .join('')
  const down = Array.from({ length: 24 }, (_, i) => {
    const y = 302 + i * 2.7,
      x = center((y - 18) / 318)
    const dx = (i % 2 ? -1 : 1) * (18 - i * 0.5)
    return `<path d="M${f(x)} ${f(y + 25)} Q${f(x + dx)} ${f(y + 15)} ${f(x + dx * 1.5)} ${f(y - 9)}" opacity=".33"/>`
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 440"><path d="${outline}" fill="#000" opacity=".2"/><g fill="none" stroke="#000" stroke-width=".8" stroke-linecap="round">${barbs}${down}</g><path d="M126 18C151 125 70 280 64 336Q59 384 47 422" stroke="#000" stroke-width="1.8" fill="none"/><path d="M127 22C149 125 71 280 65 336" stroke="#000" stroke-width=".5" fill="none" opacity=".5"/></svg>`
  writeFileSync(`public/images/feathers/feather-${variant}.svg`, svg)
}
