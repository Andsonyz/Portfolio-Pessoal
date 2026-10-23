import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Monogram } from './Monogram'
import { usePreferences } from '../../hooks/usePreferences'
import { motionSettings } from '../../data/motion'

export function ProfilePortrait() {
  const [imageFailed, setImageFailed] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const spin = useRef<gsap.core.Tween | null>(null)
  const { motionPaused } = usePreferences()
  const hasImage = Boolean(__PROFILE_IMAGE__ && !imageFailed)
  useGSAP(
    () => {
      const control = button.current!
      const disc = control.querySelector('.portrait-circle')!
      control.setAttribute('aria-busy', 'false')
      if (motionPaused) return
      spin.current = gsap.to(disc, {
        rotation: motionSettings.portrait.rotation,
        duration: motionSettings.portrait.duration,
        ease: 'power3.out',
        paused: true,
        onStart: () => control.setAttribute('aria-busy', 'true'),
        onComplete: () => {
          gsap.set(disc, { clearProps: 'transform' })
          control.setAttribute('aria-busy', 'false')
        },
      })
      const media = gsap.matchMedia()
      media.add('(hover: hover) and (pointer: fine)', () => {
        const halo = frame.current!.querySelector('.portrait-halo')!
        const xTo = gsap.quickTo(halo, 'x', { duration: 0.65, ease: 'power3.out' })
        const yTo = gsap.quickTo(halo, 'y', { duration: 0.65, ease: 'power3.out' })
        const opacityTo = gsap.quickTo(halo, 'opacity', { duration: 0.5, ease: 'power2.out' })
        let rect = frame.current!.getBoundingClientRect()
        let dirty = false
        const invalidate = () => {
          dirty = true
        }
        const leave = () => opacityTo(0)
        const move = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return
          if (dirty) {
            rect = frame.current!.getBoundingClientRect()
            dirty = false
          }
          const dx = event.clientX - rect.left - rect.width / 2
          const dy = event.clientY - rect.top - rect.height / 2
          const radius = rect.width / 2 + motionSettings.portrait.haloRadius
          if (Math.abs(dx) > radius || Math.abs(dy) > radius) {
            leave()
            return
          }
          const strength = Math.max(0, 1 - Math.hypot(dx, dy) / radius)
          xTo(gsap.utils.clamp(-1, 1, dx / (rect.width / 2)) * motionSettings.portrait.haloTravel)
          yTo(gsap.utils.clamp(-1, 1, dy / (rect.height / 2)) * motionSettings.portrait.haloTravel)
          opacityTo(strength * 0.38)
        }
        window.addEventListener('pointermove', move, { passive: true })
        document.addEventListener('pointerleave', leave)
        window.addEventListener('scroll', invalidate, { passive: true })
        window.addEventListener('resize', invalidate, { passive: true })
        return () => {
          window.removeEventListener('pointermove', move)
          document.removeEventListener('pointerleave', leave)
          window.removeEventListener('scroll', invalidate)
          window.removeEventListener('resize', invalidate)
        }
      })
      return () => {
        media.revert()
        spin.current = null
        control.setAttribute('aria-busy', 'false')
      }
    },
    { scope: frame, dependencies: [motionPaused], revertOnUpdate: true },
  )

  return (
    <div ref={frame} className="portrait-frame">
      <span className="portrait-halo" aria-hidden="true" />
      <button
        ref={button}
        type="button"
        className="portrait-button"
        aria-label={hasImage ? 'Girar foto de Andson Rocha' : 'Girar monograma de Andson Rocha'}
        aria-describedby="portrait-hint"
        aria-busy="false"
        onClick={() => {
          if (motionPaused) {
            button.current?.setAttribute('data-feedback', 'true')
            return
          }
          if (!spin.current?.isActive()) spin.current?.invalidate().restart()
        }}
        onBlur={() => button.current?.removeAttribute('data-feedback')}
      >
        <span className="portrait-circle">
          {hasImage ? (
            <img
              src={__PROFILE_IMAGE__!}
              alt="Andson Rocha"
              width="320"
              height="320"
              fetchPriority="high"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span
              className="portrait-placeholder"
              role="img"
              aria-label="Monograma AR, espaço reservado para a foto de Andson Rocha"
            >
              <Monogram />
              <span>EM CONSTANTE CONSTRUÇÃO</span>
            </span>
          )}
        </span>
      </button>
      <span className="portrait-coordinate">AR / 01</span>
      <span className="portrait-cross" aria-hidden="true">
        +
      </span>
      <span id="portrait-hint" className="portrait-hint">
        Clique ou pressione Enter para girar
      </span>
    </div>
  )
}
