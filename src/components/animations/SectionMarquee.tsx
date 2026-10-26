import { useEffect, useRef, type CSSProperties } from 'react'
import { usePreferences } from '../../hooks/usePreferences'
import '../../styles/marquee.css'

interface Props {
  words: readonly string[]
  label: string
  direction?: 'left' | 'right'
  duration?: number
  pauseOnHover?: boolean
}

export function SectionMarquee({
  words,
  label,
  direction = 'left',
  duration = 40,
  pauseOnHover = true,
}: Props) {
  const { motionPaused } = usePreferences()
  const band = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = band.current
    if (!element) return
    const update = () => {
      element.dataset.pageHidden = String(document.hidden)
    }
    update()
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.inView = String(entry?.isIntersecting ?? false)
      },
      { rootMargin: '150px' },
    )
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [words.length])
  if (words.length === 0) return null
  const style = { '--marquee-duration': `${Math.max(15, duration)}s` } as CSSProperties
  return (
    <div
      ref={band}
      className="section-marquee"
      role="group"
      aria-label={label}
      data-paused={motionPaused}
      data-direction={direction}
      data-hover-pause={pauseOnHover}
      style={style}
    >
      <p className="marquee-static">{words.join(' · ')}</p>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <span className="marquee-group" key={copy}>
            {words.map((word, index) => (
              <span className="marquee-word" key={`${word}-${index}`}>
                {word}
                <span className="marquee-separator">/</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
