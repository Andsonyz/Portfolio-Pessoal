import { ArrowUpRight } from 'lucide-react'
import type { CertificateProof } from '../../types/content'
import { ExternalLink } from './ExternalLink'

export function CertificateLinks({ pdf, validation }: CertificateProof) {
  return (
    <div className="certificate-links">
      <ExternalLink href={pdf} className="text-link" target="_blank" rel="noopener noreferrer">
        {validation ? 'Ver cópia pública do certificado' : 'Ver certificado'}
        <ArrowUpRight size={16} aria-hidden="true" />
      </ExternalLink>
      {validation && (
        <details className="certificate-validation">
          <summary>Sobre a validação</summary>
          <p>
            Cópia com dados pessoais e códigos de consulta ocultados. Para verificar a
            autenticidade, solicite o documento original ao titular.
          </p>
          <dl>
            <div>
              <dt>Emissão</dt>
              <dd>{validation.issuedAt}</dd>
            </div>
          </dl>
          <p>
            No SIGAA, acesse Extensão →{' '}
            {validation.kind === 'Participante'
              ? 'Certificado de Participante de Ação de Extensão'
              : 'Certificado de Participante como Membro da Equipe de Ação de Extensão'}{' '}
            e informe o número, a emissão e o código presentes no original.
          </p>
          <ExternalLink href="https://sigaa.ufersa.edu.br/sigaa/documentos/" className="text-link">
            Validar no SIGAA <ArrowUpRight size={16} aria-hidden="true" />
          </ExternalLink>
        </details>
      )}
    </div>
  )
}
