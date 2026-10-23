import { ArrowUpRight } from 'lucide-react'
import { experiences } from '../data/experiences'
import { SectionHeading } from '../components/ui/SectionHeading'
export function Experiences() {
  return (
    <section id="experiencias" className="section" tabIndex={-1}>
      <SectionHeading number="03" label="Experiências">
        Conhecimento
        <br />
        <span className="muted-heading">em movimento.</span>
      </SectionHeading>
      <div className="experience-grid">
        {experiences.map((item) => (
          <article className="experience" key={item.number} data-reveal>
            <div className="experience-top">
              <span className="eyebrow">{item.category}</span>
              <ArrowUpRight aria-hidden="true" size={24} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>
              {item.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
