import { ProjectCarousel } from '../components/projects/ProjectCarousel'
import { SectionHeading } from '../components/ui/SectionHeading'
export function Projects() {
  return (
    <section id="projetos" className="section projects-section" tabIndex={-1}>
      <SectionHeading
        number="04"
        label="Projetos selecionados"
        aside="Diferentes desafios. A mesma vontade de entender, experimentar e construir."
      >
        Ideias que
        <br />
        <span className="muted-heading">saíram do papel.</span>
      </SectionHeading>
      <ProjectCarousel />
    </section>
  )
}
