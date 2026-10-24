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
    id: 'ame-pet',
    title: 'Ame-Pet — Sistema de Gerenciamento de Petshop',
    category: 'Projeto acadêmico colaborativo · POO',
    description:
      'Desenvolvido em equipe na disciplina de Programação Orientada a Objetos da UFERSA. Um sistema de terminal em Java para organizar clientes, pets, atendimentos e produtos de um petshop.',
    technologies: ['Java', 'Programação Orientada a Objetos', 'Aplicação de terminal'],
    highlights: [
      'Cadastros de clientes e pets, com histórico de atendimentos',
      'Produtos, estoque, vendas e adoção de pets',
      'Encapsulamento, herança, polimorfismo e abstração',
      'Strategy nas formas de pagamento, com cálculos simulados',
    ],
    image: '/images/projects/ame-pet.svg',
    imageAlt:
      'Composição conceitual Ame-Pet: vínculos entre clientes, pets e cuidados. Não é uma captura do sistema.',
    repository: 'https://github.com/gabrdsp/Ame-Pet',
  },
  {
    id: 'restaurante-dividao',
    title: 'Sistema Restaurante Dividão',
    category: 'Projeto acadêmico colaborativo · Estruturas de Dados',
    description:
      'Projeto em equipe para a primeira unidade de Estruturas de Dados I da UFERSA. Uma aplicação de terminal em C que simula o gerenciamento de cardápio e pedidos de um restaurante.',
    technologies: ['C', 'Estruturas de Dados', 'Aplicação de terminal'],
    highlights: [
      'Cadastro, consulta, atualização e remoção de itens do cardápio',
      'Pedidos: pendente, em preparo, pronto e entregue',
      'Ponteiros, strings e vetores dinâmicos com malloc, realloc e free',
      'Modularização, structs e enums',
      'Disciplina ministrada por George Felipe Fernandes Vieira',
    ],
    image: '/images/projects/restaurante-dividao.svg',
    imageAlt:
      'Composição conceitual Dividão: organização de pedidos ao redor de um prato. Não é uma captura do sistema.',
    repository: 'https://github.com/Mayconsmy/Sistema-de-Gerenciamento-de-Pedidos-para-Restaurante',
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
