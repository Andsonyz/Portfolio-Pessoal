import { useEffect, useId, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { isVisitorMetric, type VisitorMetric } from '../../lib/visitor-metric'

const numberFormat = new Intl.NumberFormat('pt-BR')

export function VisitorCounter() {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<VisitorMetric | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle')
  const controller = useRef<AbortController | null>(null)
  const descriptionId = useId()
  useEffect(() => () => controller.current?.abort(), [])

  async function reveal() {
    setVisible(!visible)
    if (visible || data || status === 'loading') return
    const pending = new AbortController()
    controller.current = pending
    setStatus('loading')
    try {
      const response = await fetch('/api/visitors', {
        signal: AbortSignal.any([pending.signal, AbortSignal.timeout(6500)]),
        credentials: 'omit',
      })
      if (!response.ok) throw new Error('Unavailable')
      const result: unknown = await response.json()
      if (!isVisitorMetric(result)) throw new Error('Invalid metric')
      if (!pending.signal.aborted) {
        setData(result)
        setStatus('ready')
      }
    } catch {
      if (!pending.signal.aborted) setStatus('error')
    }
  }

  const value = !visible
    ? '•••••'
    : data
      ? numberFormat.format(data.total)
      : status === 'loading'
        ? 'Carregando…'
        : 'Indisponível'
  const description = `Visualizações nos últimos 30 dias, incluindo hoje (UTC).${visible ? ` ${value}.` : ''}${visible && status === 'error' ? ' Oculte e mostre novamente para tentar de novo.' : ''}`
  return (
    <>
      <button
        type="button"
        className="visitor-counter"
        aria-label={`${visible ? 'Ocultar' : 'Mostrar'} quantidade de visualizações${visible ? ` ${value}` : ''}`}
        aria-pressed={visible}
        aria-describedby={descriptionId}
        title={description}
        onClick={() => void reveal()}
      >
        {visible ? <Eye size={17} aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
        <span className="visitor-counter-copy" aria-hidden="true">
          <span className="visitor-counter-label">Visualizações </span>
          <span key={String(visible)} className="visitor-counter-value">
            {value}
          </span>
        </span>
      </button>
      <span
        id={descriptionId}
        className="sr-only"
        aria-live={visible ? 'polite' : 'off'}
        aria-atomic="true"
      >
        {description}
      </span>
    </>
  )
}
