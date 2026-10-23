import { ArrowUpRight, Plus } from 'lucide-react'
import { events } from '../data/events'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ExternalLink } from '../components/ui/ExternalLink'
export function Events() {
  return (
    <section id="eventos" className="section events-section" tabIndex={-1}>
      <SectionHeading number="07" label="Eventos">
        Além da
        <br />
        <span className="muted-heading">sala de aula.</span>
      </SectionHeading>
      {events.length ? (
        <ol className="timeline event-timeline">
          {events.map((item) => (
            <li key={item.id} className="timeline-item">
              <span className="timeline-date">{item.date}</span>
              <details className="timeline-details">
                <summary>
                  <span>
                    <span className="eyebrow">{item.participation}</span>
                    <span className="timeline-title">{item.name}</span>
                  </span>
                  <Plus aria-hidden="true" />
                </summary>
                <p>
                  {item.institution} · {item.location}
                </p>
                <p>{item.description}</p>
                <ExternalLink href={item.certificate} className="text-link">
                  Ver certificado
                  <ArrowUpRight size={16} />
                </ExternalLink>
              </details>
            </li>
          ))}
        </ol>
      ) : (
        <div className="events-empty" data-reveal>
          <span className="event-line" aria-hidden="true">
            <span />
          </span>
          <div>
            <p className="eyebrow">Encontros que ampliam horizontes</p>
            <h3>Novos encontros, em breve.</h3>
            <p>
              Um lugar para registrar participações, trocas de conhecimento e experiências com a
              comunidade.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
