import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { professionalRoles, motionSettings } from '../../data/motion'
import { usePreferences } from '../../hooks/usePreferences'

export function Typewriter() {
  const [expanded, setExpanded] = useState(false)
  const text = useRef<HTMLSpanElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const { motionPaused } = usePreferences()
  useEffect(() => {
    const element = text.current
    if (!element) return
    if (motionPaused || expanded) {
      element.textContent = professionalRoles[0]
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    let role = 0
    let length = 0
    let deleting = false
    let started = false
    let inView = false
    const { character, erase, hold, gap } = motionSettings.typing
    let remainingDelay: number = character
    let dueAt = 0
    const schedule = (delay: number) => {
      dueAt = performance.now() + delay
      timer = setTimeout(tick, delay)
    }
    const tick = () => {
      const title = professionalRoles[role]!
      length += deleting ? -1 : 1
      element.textContent = title.slice(0, length)
      let delay = deleting ? erase : character + (length % 3) * 7
      if (!deleting && length === title.length) {
        deleting = true
        delay = hold
      } else if (deleting && length === 0) {
        deleting = false
        role = (role + 1) % professionalRoles.length
        delay = gap
      }
      schedule(delay)
    }
    const start = () => {
      if (
        started ||
        !inView ||
        document.hidden ||
        document.documentElement.dataset.introState !== 'complete'
      )
        return
      started = true
      schedule(remainingDelay)
    }
    const onVisibility = () => {
      if (document.hidden || !inView) {
        if (started) remainingDelay = Math.max(0, dueAt - performance.now())
        clearTimeout(timer)
        started = false
      } else start()
    }
    element.textContent = ''
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false
        onVisibility()
      },
      { rootMargin: '100px' },
    )
    if (container.current) observer.observe(container.current)
    window.addEventListener('ar:intro-complete', start)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('ar:intro-complete', start)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motionPaused, expanded])

  return (
    <div ref={container} className="hero-roles" data-intro data-expanded={expanded}>
      <p className="eyebrow">Áreas que eu exploro</p>
      <span className="sr-only" aria-hidden={expanded}>
        Áreas de interesse: {professionalRoles.join(', ')}.
      </span>
      <div className="role-line">
        <span className="role-reserve" aria-hidden="true">
          Full-stack Developer<span className="typewriter-cursor">|</span>
        </span>
        <span className="role-value" aria-hidden="true">
          <span ref={text} className="typewriter-text">
            {professionalRoles[0]}
          </span>
          <span className="typewriter-cursor">|</span>
        </span>
      </div>
      <div
        className="role-expansion"
        data-expanded={expanded}
        aria-hidden={!expanded}
        inert={!expanded}
        id="all-explored-areas"
      >
        <div>
          <ul>
            {professionalRoles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      </div>
      <button
        type="button"
        className="areas-toggle"
        aria-expanded={expanded}
        aria-controls="all-explored-areas"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Mostrar menos' : 'Mostrar tudo'}
        <ChevronDown aria-hidden="true" size={14} />
      </button>
    </div>
  )
}
