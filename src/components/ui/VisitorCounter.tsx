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

  async function load() {
    if (status === 'loading') return
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

  function toggle() {
    setVisible(!visible)
    if (!visible && !data) void load()
  }

  const value = !visible
    ? '•••••'
    : data
      ? numberFormat.format(data.total)
      : status === 'loading'
        ? 'Carregando…'
        : 'Falha'
  const description = `Visitantes estimados nos últimos 30 dias de calendário UTC, incluindo hoje. A Vercel reinicia a identificação anônima após 24 horas; a mesma pessoa pode ser contada novamente.${visible ? ` ${value}.` : ''}${visible && status === 'error' ? ' A consulta falhou. Tente novamente.' : ''}`
  return (
    <div className="visitor-counter-wrap">
      <button
        type="button"
        className="visitor-counter"
        aria-label={`Visitantes ${value}. ${visible ? 'Ocultar' : 'Mostrar'} quantidade de visitantes estimados`}
        aria-pressed={visible}
        aria-describedby={descriptionId}
        title={description}
        onClick={toggle}
      >
        {visible ? <Eye size={17} aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
        <span className="visitor-counter-copy" aria-hidden="true">
          <span className="visitor-counter-label">Visitantes </span>
          <span key={String(visible)} className="visitor-counter-value">
            {value}
          </span>
        </span>
      </button>
      {visible && status === 'error' && (
        <div className="visitor-counter-error">
          <span>Não foi possível consultar agora.</span>
          <button type="button" onClick={() => void load()}>
            Tentar novamente
          </button>
        </div>
      )}
      <span
        id={descriptionId}
        className="sr-only"
        aria-live={visible ? 'polite' : 'off'}
        aria-atomic="true"
      >
        {description}
      </span>
    </div>
  )
}
