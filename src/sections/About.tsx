import { profile } from '../data/profile'
import { SectionHeading } from '../components/ui/SectionHeading'
export function About() {
  return (
    <section id="sobre" className="section about-section" tabIndex={-1}>
      <SectionHeading number="01" label="Sobre mim">
        Curiosidade como
        <br />
        <span className="muted-heading">ponto de partida.</span>
      </SectionHeading>
      <div className="about-grid">
        <aside className="academic-note" data-reveal>
          <span className="academic-year">
            2024<span>.1</span>
          </span>
          <p>
            O começo da jornada
            <br />
            na UFERSA.
          </p>
          <dl>
            <div>
              <dt>Formação</dt>
              <dd>Tecnologia da Informação</dd>
            </div>
            <div>
              <dt>Agora</dt>
              <dd>{profile.period}</dd>
            </div>
            <div>
              <dt>Campus</dt>
              <dd>{profile.campus}</dd>
            </div>
          </dl>
        </aside>
        <div className="about-copy" data-reveal>
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="interests">
            <span className="eyebrow">No meu radar</span>
            <ul>
              {profile.interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
