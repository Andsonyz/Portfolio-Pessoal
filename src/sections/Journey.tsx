import { timeline } from '../data/timeline'
import { Timeline } from '../components/timeline/Timeline'
import { SectionHeading } from '../components/ui/SectionHeading'
export function Journey() {
  return (
    <section id="trajetoria" className="section journey-section" tabIndex={-1}>
      <SectionHeading
        number="06"
        label="Trajetória"
        aside="Cada etapa acrescenta uma nova perspectiva. Este é o começo."
      >
        Um caminho
        <br />
        <span className="muted-heading">em construção.</span>
      </SectionHeading>
      <Timeline items={timeline} />
      <p className="timeline-continuation">
        <span aria-hidden="true">+</span> Os próximos capítulos estão sendo escritos.
      </p>
    </section>
  )
}
