import { Cloud, Code2, PanelsTopLeft, Workflow } from 'lucide-react'

export const radarItems = [
  {
    title: 'Engenharia de Software',
    summary:
      'Aplicação de métodos, processos e boas práticas para planejar, desenvolver, testar e manter sistemas de software com qualidade, organização e confiabilidade.',
    icon: Workflow,
  },
  {
    title: 'Desenvolvimento Full Stack',
    summary:
      'Desenvolvimento de aplicações completas, integrando interfaces, lógica de negócio, APIs, bancos de dados e diferentes tecnologias de front-end e back-end.',
    icon: Code2,
  },
  {
    title: 'UX/UI Design',
    summary:
      'Criação de interfaces intuitivas e experiências digitais acessíveis, considerando as necessidades dos usuários, a usabilidade e a organização visual.',
    icon: PanelsTopLeft,
  },
  {
    title: 'Cloud Computing',
    summary:
      'Utilização de serviços e infraestruturas em nuvem para hospedar, distribuir, integrar e escalar aplicações com disponibilidade e segurança.',
    icon: Cloud,
  },
] as const
