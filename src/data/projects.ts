import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'mitos-raizes',
    title: 'Entre Mitos e Raízes',
    category: 'Jogo educacional',
    description:
      'Uma aventura de exploração pelo folclore brasileiro, onde a descoberta e a preservação ambiental fazem parte da mesma história.',
    technologies: ['Java', 'Swing', 'AWT', 'Graphics2D'],
    highlights: [
      'Narrativa educativa',
      'Personagens folclóricos',
      'Mecânicas interativas',
      'Conscientização ambiental',
    ],
    image: '/images/projects/mitos.svg',
    imageAlt: 'Ilustração conceitual: raízes e camadas de uma floresta, em preto e branco.',
  },
  {
    id: 'clinica',
    title: 'Sistema de Consultório/Clínica',
    category: 'Banco de dados · Projeto acadêmico',
    description:
      'Organização de informações clínicas a partir de uma base sólida: modelagem, integridade dos dados e consultas estruturadas.',
    technologies: ['Modelagem de dados', 'SQL'],
    highlights: [
      'Modelagem conceitual e lógica',
      'Normalização',
      'Consultas SQL e views',
      'Triggers e funções',
    ],
    image: '/images/projects/clinica.svg',
    imageAlt:
      'Ilustração conceitual: módulos conectados representam a organização de dados clínicos.',
  },
  {
    id: 'sapo',
    title: 'SAPO — Achados e Perdidos UFERSA',
    category: 'UX/UI · Proposta de solução',
    description:
      'Uma proposta para aproximar pessoas e seus pertences. Pesquisa e prototipação para centralizar achados e perdidos no ambiente universitário.',
    technologies: ['Pesquisa com usuários', 'UX/UI', 'Prototipação'],
    highlights: [
      'Análise de necessidades',
      'Concepção da solução',
      'Pesquisa com usuários',
      'Prototipação',
    ],
    image: '/images/projects/sapo.svg',
    imageAlt: 'Ilustração conceitual: dois trajetos se encontram ao redor de um objeto perdido.',
  },
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    category: 'Desenvolvimento web · Identidade',
    description:
      'Este espaço: um encontro entre código, identidade visual e movimento. Um portfólio construído para acompanhar uma trajetória em formação.',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'GSAP'],
    highlights: ['Design responsivo', 'Animações', 'Identidade visual', 'Acessibilidade'],
    image: '/images/projects/portfolio.svg',
    imageAlt: 'Composição tipográfica conceitual com o monograma AR e linhas editoriais.',
  },
]
