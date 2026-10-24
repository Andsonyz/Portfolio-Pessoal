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
      <div className="skills-table">
        {skills.map((group, index) => (
          <div className="skill-row" key={group.category} data-reveal>
            <div className="skill-category">
              <span className="eyebrow">0{index + 1}</span>
              <h3>{group.category}</h3>
              <p>{group.note}</p>
            </div>
            <ul className="skill-items">
              {group.items.map(({ name, icon: Icon, detail }) => (
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
  )
}
