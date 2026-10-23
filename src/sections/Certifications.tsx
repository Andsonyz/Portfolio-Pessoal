import { ArrowUpRight, FileText } from 'lucide-react'
import { certifications } from '../data/certifications'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ExternalLink } from '../components/ui/ExternalLink'
export function Certifications() {
  return (
    <section id="certificacoes" className="section" tabIndex={-1}>
      <SectionHeading number="05" label="Certificações">
        Aprender é<br />
        <span className="muted-heading">um processo contínuo.</span>
      </SectionHeading>
      {certifications.length ? (
        <div className="certificate-grid">
          {certifications.map((item) => (
            <article className="certificate" key={item.id}>
              <FileText aria-hidden="true" />
              <span className="eyebrow">{item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.institution}</p>
              <p>
                {item.date}
                {item.hours ? ` · ${item.hours} horas` : ''}
              </p>
              <ExternalLink href={item.pdf} className="text-link">
                Ver certificado
                <ArrowUpRight size={16} />
              </ExternalLink>
              <ExternalLink href={item.validationUrl} className="text-link">
                Validar
                <ArrowUpRight size={16} />
              </ExternalLink>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state certificates-empty" data-reveal>
          <div className="document-mark" aria-hidden="true">
            <FileText strokeWidth={0.8} />
            <span />
          </div>
          <div>
            <p className="eyebrow">Espaço para novas conquistas</p>
            <h3>Certificados a caminho.</h3>
            <p>
              Este espaço vai reunir os registros de cursos e aprendizados ao longo da minha
              formação.
            </p>
          </div>
          <span className="empty-index" aria-hidden="true">
            [ — ]
          </span>
        </div>
      )}
    </section>
  )
}
