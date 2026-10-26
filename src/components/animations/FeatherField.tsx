import { useEffect, useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePreferences } from '../../hooks/usePreferences'
import { motionSettings } from '../../data/motion'

const config = motionSettings.feathers
type LayerConfig = (typeof config.layers)[number]
type DeviceSize = 'desktop' | 'tablet' | 'mobile'

const random = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}

const feathersByLayer = config.layers.map((layer, layerIndex) => ({
  ...layer,
  feathers: Array.from({ length: layer.desktop }, (_, index) => {
    const seed = layerIndex * 100 + index
    const side = random(seed, 8) < 0.5 ? -1 : 1
    const x =
      layer.id === 'foreground'
        ? side < 0
          ? -0.13 + random(seed, 1) * 0.28
          : 0.84 + random(seed, 1) * 0.28
        : 0.025 + random(seed, 1) * 0.95
    const opacity =
      layer.id === 'foreground'
        ? 0.26 + random(seed, 2) * 0.14
        : layer.id === 'middle'
          ? 0.16 + random(seed, 2) * 0.1
          : 0.1 + random(seed, 2) * 0.08
    return {
      id: `${layer.id}-${index}`,
      x,
      y: random(seed, 3),
      width: layer.minWidth + random(seed, 4) ** 1.35 * (layer.maxWidth - layer.minWidth),
      rotation: random(seed, 5) * 360 - 180,
      opacity,
      phase: random(seed, 6) * Math.PI * 2,
      speed: (6 + random(seed, 7) * 13) * (random(seed, 9) < 0.25 ? -1 : 1),
      file: layer.files[(index + layerIndex) % layer.files.length]!,
      direction: side,
    }
  }),
}))

export function FeatherField() {
  const scope = useRef<HTMLDivElement>(null)
  const { motionPaused } = usePreferences()
  const initiallyPaused = useRef(motionPaused)
  const controller = useRef<{ setPaused: (value: boolean) => void } | null>(null)

  useGSAP(
    () => {
      const media = gsap.matchMedia()
      media.add(
        {
          desktop: '(min-width: 1200px)',
          tablet: '(min-width: 768px) and (max-width: 1199px)',
          mobile: '(max-width: 767px)',
          mouse: '(hover: hover) and (pointer: fine)',
        },
        (context) => {
          const device: DeviceSize = context.conditions?.desktop
            ? 'desktop'
            : context.conditions?.tablet
              ? 'tablet'
              : 'mobile'
          let width = window.innerWidth
          let height = window.innerHeight
          let paused = initiallyPaused.current
          let running = false
          let elapsed = 0
          let scrollPosition = window.scrollY
          let targetScrollY = scrollPosition
          let storm = document.documentElement.dataset.introState === 'complete' || paused ? 0 : 1
          const pointer = { active: false, x: 0, y: 0 }
          const root = scope.current
          if (!root) return

          const activeParticles: {
            node: HTMLElement
            repel: HTMLElement
            image: HTMLImageElement
            layer: LayerConfig
            seed: (typeof feathersByLayer)[number]['feathers'][number]
            y: number
            rx: number
            ry: number
          }[] = []
          const layerTransforms: { setY: (value: number) => void; scroll: number }[] = []

          feathersByLayer.forEach((group) => {
            const layerNode = root.querySelector<HTMLElement>(
              `.feather-layer[data-depth="${group.id}"]`,
            )
            const layerParticles = group.feathers.map((seed) =>
              root.querySelector<HTMLElement>(`[data-feather-id="${seed.id}"]`),
            )
            const count = group[device]
            layerParticles.forEach((node, index) => {
              if (!node) return
              node.hidden = index >= count
              if (index >= count) return
              const repel = node.querySelector<HTMLElement>('.feather-repel')
              const image = node.querySelector<HTMLImageElement>('.floating-feather')
              if (!repel || !image) return
              const seed = group.feathers[index]!
              activeParticles.push({
                node,
                repel,
                image,
                layer: group,
                seed,
                y: storm ? height * (seed.y * 1.1 - 0.8) : seed.y * height,
                rx: 0,
                ry: 0,
              })
            })
            if (layerNode)
              layerTransforms.push({
                setY: gsap.quickSetter(layerNode, 'y', 'px') as (value: number) => void,
                scroll: group.scroll,
              })
          })

          const draw = (delta: number) => {
            const dt = Math.min(delta, 40) / 1000
            elapsed += dt
            if (document.documentElement.dataset.introState === 'complete')
              storm *= Math.exp(-dt * 3.8)
            const smoothing = 1 - Math.exp(-dt * 8)
            scrollPosition += (targetScrollY - scrollPosition) * smoothing
            const scrollY = scrollPosition
            layerTransforms.forEach(({ setY, scroll }) => setY(-scrollY * scroll))
            activeParticles.forEach((particle) => {
              particle.y +=
                (particle.seed.speed + (storm * height) / (1.55 + particle.seed.phase * 0.1)) * dt
              const margin = particle.seed.width * 1.8
              const travel = height + margin * 2
              const offset = scrollY * particle.layer.scroll
              const y = ((((particle.y - offset + margin) % travel) + travel) % travel) - margin
              const localY = y + offset
              particle.y %= travel
              const baseX =
                particle.layer.id === 'foreground'
                  ? particle.seed.direction < 0
                    ? -particle.seed.width * 0.6
                    : width - particle.seed.width * 0.4
                  : particle.seed.x * width
              const x =
                baseX +
                Math.sin(elapsed * (0.2 + particle.seed.phase * 0.05) + particle.seed.phase) *
                  (12 + particle.seed.width * 0.16) *
                  particle.seed.direction
              let repelX = 0
              let repelY = 0
              const dx = x + particle.seed.width / 2 - pointer.x
              const dy = y + (particle.seed.width * (850 / 600)) / 2 - pointer.y
              if (
                pointer.active &&
                storm < 0.1 &&
                Math.abs(dx) < config.radius &&
                Math.abs(dy) < config.radius
              ) {
                const distance = Math.hypot(dx, dy)
                if (distance < config.radius) {
                  const force = (1 - distance / config.radius) ** 2 * config.repulsion
                  repelX = (distance > 0.1 ? dx / distance : Math.cos(particle.seed.phase)) * force
                  repelY = (distance > 0.1 ? dy / distance : Math.sin(particle.seed.phase)) * force
                }
              }
              particle.rx += (repelX - particle.rx) * smoothing
              particle.ry += (repelY - particle.ry) * smoothing
              particle.node.style.transform = `translate3d(${x.toFixed(2)}px,${localY.toFixed(2)}px,0)`
              particle.repel.style.transform = `translate3d(${particle.rx.toFixed(2)}px,${particle.ry.toFixed(2)}px,0)`
              // One transform write per image; preserve both original oscillations.
              const rotation =
                particle.seed.rotation +
                Math.sin(elapsed * (0.15 + particle.seed.phase * 0.06) + particle.seed.phase) * 20
              const scale = 1 + Math.sin(elapsed * 0.18 + particle.seed.phase) * 0.025
              particle.image.style.transform = `rotate(${rotation.toFixed(4)}deg) scale(${scale.toFixed(5)})`
              particle.node.style.opacity = String(
                particle.seed.opacity *
                  (0.9 + Math.sin(elapsed * 0.15 + particle.seed.phase) * 0.1),
              )
            })
          }
          const tick = (_time: number, delta: number) => draw(delta)
          const sync = () => {
            const shouldRun = !paused && !document.hidden
            if (shouldRun === running) return
            running = shouldRun
            if (running) gsap.ticker.add(tick)
            else {
              gsap.ticker.remove(tick)
              pointer.active = false
            }
          }
          controller.current = {
            setPaused(value) {
              paused = value
              initiallyPaused.current = value
              if (!paused) draw(0)
              sync()
            },
          }
          const move = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse' || paused) return
            pointer.active = true
            pointer.x = event.clientX
            pointer.y = event.clientY
          }
          const leave = () => {
            pointer.active = false
          }
          const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            if (paused) draw(0)
          }
          const scroll = () => {
            targetScrollY = window.scrollY
          }
          if (context.conditions?.mouse) {
            window.addEventListener('pointermove', move, { passive: true })
            document.addEventListener('pointerleave', leave)
          }
          window.addEventListener('resize', resize, { passive: true })
          window.addEventListener('scroll', scroll, { passive: true })
          document.addEventListener('visibilitychange', sync)
          draw(0)
          sync()
          return () => {
            gsap.ticker.remove(tick)
            window.removeEventListener('pointermove', move)
            document.removeEventListener('pointerleave', leave)
            window.removeEventListener('resize', resize)
            window.removeEventListener('scroll', scroll)
            document.removeEventListener('visibilitychange', sync)
            controller.current = null
          }
        },
      )
      return () => media.revert()
    },
    { scope },
  )

  useEffect(() => {
    controller.current?.setPaused(motionPaused)
  }, [motionPaused])

  return (
    <div ref={scope} className="feather-field" aria-hidden="true">
      {feathersByLayer.map((layer) => (
        <div
          className="feather-layer"
          data-depth={layer.id}
          key={layer.id}
          style={{ '--feather-blur': `${layer.blur}px` } as CSSProperties}
        >
          {layer.feathers.map((feather) => (
            <span
              key={feather.id}
              className="feather-particle"
              data-feather-id={feather.id}
              style={{ width: feather.width, opacity: feather.opacity }}
            >
              <span className="feather-repel">
                <img src={`/images/feathers/${feather.file}`} alt="" className="floating-feather" />
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
