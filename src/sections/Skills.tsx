import { skills } from '../data/skills'
import { SectionHeading } from '../components/ui/SectionHeading'
export function Skills() {
  return (
    <section id="habilidades" className="section" tabIndex={-1}>
      <SectionHeading
        number="02"
        label="Habilidades"
        aside="Uma caixa de ferramentas em expansão, alimentada por estudo e prática."
      >
        Do conceito
        <br />
        <span className="muted-heading">à construção.</span>
      </SectionHeading>
      {skills.map((group) => (
        <section className="skills-group" aria-labelledby={`skills-${group.id}`} key={group.id}>
          <div className="skills-group-heading" data-reveal>
            <h3 id={`skills-${group.id}`}>{group.title}</h3>
            {group.description && <p>{group.description}</p>}
          </div>
          <div className="skills-table">
            {group.categories.map((category, index) => (
              <div className="skill-row" key={category.category} data-reveal>
                <div className="skill-category">
                  <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
                  <h4>{category.category}</h4>
                  <p>{category.note}</p>
                </div>
                <ul className="skill-items">
                  {category.items.map(({ name, icon: Icon, detail }) => (
                    <li key={name} title={detail}>
                      <Icon aria-hidden="true" />
                      <span>{name}</span>
                      {detail && <span className="sr-only"> — {detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}
