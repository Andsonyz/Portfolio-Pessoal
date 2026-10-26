import { useEffect, useState } from 'react'
import { clockSettings } from '../../data/clock'
import '../../styles/clock.css'

const formatter = new Intl.DateTimeFormat(clockSettings.locale, {
  timeZone: clockSettings.timeZone,
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function LocalClock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (!document.hidden) timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    const tick = () => {
      setNow(new Date())
      schedule()
    }
    const visibility = () => {
      clearTimeout(timer)
      if (!document.hidden) tick()
    }
    schedule()
    document.addEventListener('visibilitychange', visibility)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])
  return (
    <div className={`local-clock ${className}`} aria-live="off">
      <span className="clock-label">{clockSettings.label}</span>
      <time dateTime={now.toISOString()}>{formatter.format(now)}</time>
      <span className="clock-zone">{clockSettings.zoneLabel}</span>
    </div>
  )
}
