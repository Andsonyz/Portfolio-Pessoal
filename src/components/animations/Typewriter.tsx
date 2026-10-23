import { useEffect, useRef } from 'react'
import { professionalRoles, motionSettings } from '../../data/motion'
import { usePreferences } from '../../hooks/usePreferences'

export function Typewriter() {
  const text = useRef<HTMLSpanElement>(null)
  const { motionPaused } = usePreferences()
  useEffect(() => {
    const element = text.current
    if (!element) return
    if (motionPaused) {
      element.textContent = professionalRoles[0]
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    let role = 0
    let length = 0
    let deleting = false
    let started = false
    const { character, erase, hold, gap } = motionSettings.typing
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
      timer = setTimeout(tick, delay)
    }
    const start = () => {
      if (started || document.hidden || document.documentElement.dataset.introState !== 'complete')
        return
      started = true
      timer = setTimeout(tick, character)
    }
    const onVisibility = () => {
      if (document.hidden) {
        clearTimeout(timer)
        started = false
      } else start()
    }
    element.textContent = ''
    start()
    window.addEventListener('ar:intro-complete', start)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('ar:intro-complete', start)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [motionPaused])

  return (
    <div className="hero-roles" data-intro>
      <p className="eyebrow">Áreas que exploro</p>
      <span className="sr-only">Áreas de interesse: {professionalRoles.join(', ')}.</span>
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
    </div>
  )
}
