import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react'
import { profile } from '../data/profile'
import { contacts } from '../data/contacts'
import { ProfilePortrait } from '../components/ui/ProfilePortrait'
import { Typewriter } from '../components/animations/Typewriter'
import { ExternalLink } from '../components/ui/ExternalLink'

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-label="Apresentação" tabIndex={-1}>
      <div className="hero-topline" data-intro>
        <span className="eyebrow">Desenvolvimento, design & descobertas</span>
        <span className="hero-location">
          PAU DOS FERROS, RN <span className="tiny-cross">+</span>
        </span>
      </div>
      <div className="hero-grid">
        <div className="hero-name">
          <p className="hero-greeting" data-intro>
            Olá, eu sou
          </p>
          <h1 data-intro>
            Andson
            <br />
            <span>Rocha.</span>
          </h1>
          <Typewriter />
          <div className="hero-undername" data-intro>
            <span className="short-rule" />
            <p>
              Ideias ganham forma.
              <br />
              Código abre caminhos.
            </p>
          </div>
        </div>
        <div className="hero-profile" data-intro>
          <ProfilePortrait />
          <div className="hero-bio">
            <p className="eyebrow">Tecnologia com intenção</p>
            <h2>{profile.title}</h2>
            <p>
              Explorando as conexões entre desenvolvimento, design e a experiência de quem está do
              outro lado da tela.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-footer" data-intro>
        <a className="project-cta" href="#projetos">
          <span>Conheça meus projetos</span>
          <ArrowDownRight size={26} />
        </a>
        <div className="hero-socials">
          {contacts
            .filter((item) => ['GitHub', 'LinkedIn'].includes(item.label))
            .map((item) => (
              <ExternalLink href={item.url} key={item.label}>
                {item.label}
                <ArrowUpRight size={15} />
              </ExternalLink>
            ))}
          {__RESUME_URL__ && (
            <a href={__RESUME_URL__} download className="resume-link">
              Baixar currículo
              <Download size={15} />
            </a>
          )}
        </div>
        <a className="scroll-note" href="#sobre">
          <span>ROLE PARA EXPLORAR</span>
          <ArrowDownRight size={16} />
        </a>
      </div>
    </section>
  )
}
