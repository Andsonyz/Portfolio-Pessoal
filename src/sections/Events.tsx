import { Plus } from 'lucide-react'
import { events } from '../data/events'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CertificateLinks } from '../components/ui/CertificateLinks'
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
                {item.hours && (
                  <p>
                    {item.hours} horas certificadas · {item.participation}
                  </p>
                )}
                <CertificateLinks pdf={item.pdf} validation={item.validation} />
              </details>
            </li>
          ))}
        </ol>
      ) : (
        <div className="events-empty" data-reveal>
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
