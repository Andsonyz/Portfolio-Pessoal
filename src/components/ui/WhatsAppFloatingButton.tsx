import { SiWhatsapp } from 'react-icons/si'
import { whatsappContact } from '../../data/contacts'
import { ExternalLink } from './ExternalLink'

export function WhatsAppFloatingButton() {
  return (
    <ExternalLink
      href={whatsappContact.url}
      className="whatsapp-floating"
      aria-label="Conversar pelo WhatsApp"
      title="Conversar pelo WhatsApp"
    >
      <SiWhatsapp aria-hidden="true" size={23} />
    </ExternalLink>
  )
}
