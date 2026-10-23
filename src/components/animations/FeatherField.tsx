import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePreferences } from '../../hooks/usePreferences'
import { motionSettings } from '../../data/motion'

const config = motionSettings.feathers
const random = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return value - Math.floor(value)
}
const feathers = Array.from({ length: config.desktop }, (_, index) => ({
  x: 0.03 + random(index, 1) * 0.94,
  y: random(index, 2),
  width: config.minWidth + random(index, 3) ** 1.7 * (config.maxWidth - config.minWidth),
  rotation: random(index, 4) * 100 - 50,
  opacity: 0.16 + random(index, 5) * 0.19,
  phase: random(index, 6) * Math.PI * 2,
  speed: 9 + random(index, 7) * 13,
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
          const count = context.conditions?.desktop
            ? config.desktop
            : context.conditions?.tablet
              ? config.tablet
              : config.mobile
          let width = window.innerWidth
          let height = window.innerHeight
          let paused = initiallyPaused.current
          let running = false
          let elapsed = 0
          let storm = document.documentElement.dataset.introState === 'complete' || paused ? 0 : 1
          const pointer = { active: false, x: 0, y: 0 }
          const nodes = gsap.utils.toArray<HTMLElement>('.feather-particle', scope.current)
          nodes.forEach((node, index) => {
            node.hidden = index >= count
          })
          const particles = nodes.slice(0, count).map((node, index) => {
            const seed = feathers[index]!
            const repel = node.querySelector<HTMLElement>('.feather-repel')!
            gsap.set(node, { left: 0, top: 0 })
            return {
              ...seed,
              y: storm ? height * (seed.y * 1.1 - 0.8) : seed.y * height,
              rx: 0,
              ry: 0,
              position: (value: string) => {
                node.style.transform = value
              },
              repel: (value: string) => {
                repel.style.transform = value
              },
              rotate: gsap.quickSetter(node.querySelector('img'), 'rotation', 'deg'),
            }
          })
          const draw = (delta: number) => {
            const dt = Math.min(delta, 40) / 1000
            elapsed += dt
            if (document.documentElement.dataset.introState === 'complete')
              storm *= Math.exp(-dt * 3.8)
            const smoothing = 1 - Math.exp(-dt * 8)
            particles.forEach((particle) => {
              particle.y += (particle.speed + (storm * height) / (1.55 + particle.phase * 0.1)) * dt
              if (particle.y > height + 100) particle.y = -100
              const x =
                particle.x * width +
                Math.sin(elapsed * 0.55 + particle.phase) * (12 + particle.width * 0.35)
              let repelX = 0
              let repelY = 0
              const dx = x + particle.width / 2 - pointer.x
              const dy = particle.y + particle.width - pointer.y
              if (
                pointer.active &&
                storm < 0.1 &&
                Math.abs(dx) < config.radius &&
                Math.abs(dy) < config.radius
              ) {
                const distance = Math.hypot(dx, dy)
                if (distance < config.radius) {
                  const force = (1 - distance / config.radius) ** 2 * config.repulsion
                  repelX = (distance > 0.1 ? dx / distance : Math.cos(particle.phase)) * force
                  repelY = (distance > 0.1 ? dy / distance : Math.sin(particle.phase)) * force
                }
              }
              particle.rx += (repelX - particle.rx) * smoothing
              particle.ry += (repelY - particle.ry) * smoothing
              particle.position(`translate3d(${x.toFixed(2)}px,${particle.y.toFixed(2)}px,0)`)
              particle.repel(
                `translate3d(${particle.rx.toFixed(2)}px,${particle.ry.toFixed(2)}px,0)`,
              )
              particle.rotate(particle.rotation + Math.sin(elapsed * 0.7 + particle.phase) * 22)
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
          }
          if (context.conditions?.mouse) {
            window.addEventListener('pointermove', move, { passive: true })
            document.addEventListener('pointerleave', leave)
          }
          window.addEventListener('resize', resize, { passive: true })
          document.addEventListener('visibilitychange', sync)
          draw(0)
          sync()
          return () => {
            gsap.ticker.remove(tick)
            window.removeEventListener('pointermove', move)
            document.removeEventListener('pointerleave', leave)
            window.removeEventListener('resize', resize)
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
      {feathers.map((feather, index) => (
        <span
          key={index}
          className="feather-particle"
          style={{
            left: `${feather.x * 100}%`,
            top: `${feather.y * 100}%`,
            width: feather.width,
            opacity: feather.opacity,
          }}
        >
          <span className="feather-repel">
            <img
              src={`/images/feathers/feather-${(index % 2) + 1}.svg`}
              alt=""
              className="floating-feather"
              style={{ transform: `rotate(${feather.rotation}deg)` }}
            />
          </span>
        </span>
      ))}
    </div>
  )
}
