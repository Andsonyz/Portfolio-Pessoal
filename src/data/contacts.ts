import { SiGithub, SiDiscord, SiWhatsapp } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa6'
import { Mail } from 'lucide-react'

const message = 'Olá, Andson! Conheci seu portfólio e gostaria de entrar em contato.'
export const contacts = [
  {
    label: 'E-mail',
    detail: 'antonioandson1307@gmail.com',
    url: 'mailto:antonioandson1307@gmail.com',
    icon: Mail,
  },
  { label: 'GitHub', detail: '@Andsonyz', url: 'https://github.com/Andsonyz', icon: SiGithub },
  {
    label: 'LinkedIn',
    detail: 'Vamos nos conectar',
    url: 'https://www.linkedin.com/in/antonio-andson-787138308',
    icon: FaLinkedinIn,
  },
  {
    label: 'WhatsApp',
    detail: 'Uma conversa começa aqui',
    url: `https://wa.me/5584920002691?text=${encodeURIComponent(message)}`,
    icon: SiWhatsapp,
  },
  {
    label: 'Discord',
    detail: 'Entre na conversa',
    url: 'https://discord.gg/QpeK4gFc',
    icon: SiDiscord,
  },
]
