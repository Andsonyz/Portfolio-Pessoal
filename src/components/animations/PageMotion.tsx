import { useRef, type ReactNode } from 'react'
import { Code2, Globe2, UserRound } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { usePreferences } from '../../hooks/usePreferences'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function PageMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)
  const welcome = useRef<HTMLDivElement>(null)
  const completed = useRef(false)
  const { motionPaused } = usePreferences()
  useGSAP(
    () => {
      const surfaces = [scope.current, document.querySelector('.site-header')].filter(Boolean)
      const finish = () => {
        completed.current = true
        document.documentElement.dataset.introState = 'complete'
        gsap.set(surfaces, { clearProps: 'opacity,filter,transform' })
        gsap.set('[data-intro]', { clearProps: 'opacity,transform' })
        window.dispatchEvent(new Event('ar:intro-complete'))
      }
      if (motionPaused) {
        finish()
        return
      }
      let intro: gsap.core.Timeline | undefined
      if (!completed.current) {
        document.documentElement.dataset.introState = 'running'
        intro = gsap.timeline({ onComplete: finish })
        intro
          .set(surfaces, { opacity: 0, filter: 'blur(8px)' }, 0)
          .fromTo(
            welcome.current!.querySelectorAll('.welcome-icon'),
            { opacity: 0, y: 10, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'power2.out' },
            0.12,
          )
          .fromTo(
            welcome.current!.querySelectorAll('.welcome-letter'),
            { opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              duration: 0.65,
              stagger: 0.055,
              ease: 'power3.out',
            },
            0.38,
          )
          .fromTo(
            welcome.current!.querySelector('.welcome-caption'),
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            0.8,
          )
          .to(welcome.current, { opacity: 0, y: -12, duration: 0.5, ease: 'power2.inOut' }, 1.9)
          .to(
            surfaces,
            { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
            2.03,
          )
          .fromTo(
            '[data-intro]',
            { opacity: 0, y: 21 },
            { opacity: 1, y: 0, duration: 0.62, stagger: 0.085, ease: 'power3.out' },
            2.08,
          )
      }
      const skip = () => {
        if (!completed.current) intro?.progress(1)
      }
      const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
      events.forEach((event) =>
        window.addEventListener(event, skip, { capture: true, passive: true }),
      )
      gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        })
      })
      return () => {
        events.forEach((event) => window.removeEventListener(event, skip, true))
      }
    },
    { scope, dependencies: [motionPaused], revertOnUpdate: true },
  )
  return (
    <>
      <div ref={welcome} className="welcome-screen" aria-hidden="true">
        <div className="welcome-composition">
          <div className="welcome-icons">
            {[Code2, UserRound, Globe2].map((Icon, index) => (
              <span className="welcome-icon" key={index}>
                <Icon strokeWidth={1.25} />
              </span>
            ))}
          </div>
          <p className="welcome-word">
            {'WELCOME'.split('').map((letter, index) => (
              <span className="welcome-letter" key={index}>
                {letter}
              </span>
            ))}
          </p>
          <p className="welcome-caption">ANDSON ROCHA · TECNOLOGIA &amp; DESIGN</p>
        </div>
      </div>
      <div ref={scope} className="page-content">
        {children}
      </div>
    </>
  )
}
