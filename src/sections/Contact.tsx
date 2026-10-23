import { ArrowUpRight } from 'lucide-react'
import { contacts } from '../data/contacts'
import { ExternalLink } from '../components/ui/ExternalLink'
export function Contact() {
  return (
    <section id="contato" className="section contact-section" tabIndex={-1}>
      <div className="contact-heading" data-reveal>
        <p className="eyebrow">
          <span>08</span> Contato
        </p>
        <h2>
          Uma ideia?
          <br />
          <span className="muted-heading">Vamos conversar.</span>
          <ArrowUpRight aria-hidden="true" />
        </h2>
        <p>
          Sobre projetos, tecnologia ou novas possibilidades.
          <br />
          Minha próxima boa conversa pode ser com você.
        </p>
      </div>
      <div className="contact-links">
        {contacts.map(({ label, detail, url, icon: Icon }) => (
          <ExternalLink
            key={label}
            href={url}
            className={`contact-link ${label === 'E-mail' ? 'contact-email' : ''}`}
          >
            <Icon aria-hidden="true" size={21} />
            <span>
              <strong>{label}</strong>
              <span>{detail}</span>
            </span>
            <ArrowUpRight aria-hidden="true" size={22} />
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}
