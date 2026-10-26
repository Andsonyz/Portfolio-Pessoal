import type { Project } from '../types/content'

export const projects: Project[] = [
  {
    id: 'mitos-raizes',
    title: 'Entre Mitos e Raízes',
    category: 'Jogo educacional',
    description:
      'Jogo educativo de plataforma 2D inspirado no folclore brasileiro. Explore a floresta, cumpra desafios ambientais e aprenda com Curupira, Saci, Caipora e Negrinho do Pastoreio.',
    technologies: ['Java', 'Swing', 'AWT', 'Graphics2D'],
    highlights: [],
    detailsSections: [
      {
        title: 'Desenvolvimento',
        items: [
          'Desenvolvido em Java com Swing/AWT para a interface e JavaFX Media para os vídeos.',
        ],
      },
      {
        title: 'Funcionalidades',
        items: [
          'Quatro fases com objetivos, diálogos e desafios educativos.',
          'Dois slots de save, continuação da campanha e seleção de fases desbloqueadas.',
          'Prólogo em vídeo, mapa de progresso e menu de pausa.',
          'Seleção de personagem: masculino disponível e feminino identificado como “Em breve”.',
          'Ajustes de tamanho do texto e alto contraste.',
        ],
      },
    ],
    image: '/images/projects/capa_retangular_mitos_e_raizes.png',
    imageAlt:
      'Capa do jogo Entre Mitos e Raízes, com uma floresta, um explorador e o título do projeto.',
    imageWidth: 1070,
    imageHeight: 622,
    imageCaption: 'Capa do projeto',
    repository: 'https://github.com/Andsonyz/Projeto-Entre-Mitos-E-Ra-zes',
  },
  {
    id: 'ame-pet',
    title: 'Ame-Pet — Sistema de Gerenciamento de Petshop',
    category: 'Projeto acadêmico colaborativo · POO',
    description:
      'Desenvolvido em equipe na disciplina de Programação Orientada a Objetos da UFERSA. Um sistema de terminal em Java para organizar clientes, pets, atendimentos e produtos de um petshop.',
    technologies: ['Java', 'Programação Orientada a Objetos', 'Aplicação de terminal'],
    highlights: [],
    detailsSections: [
      {
        title: 'Funcionalidades',
        items: [
          'Cadastro de funcionários com cargo, salário e data de admissão.',
          'Registro de clientes com nome, CPF, telefone e endereço.',
          'Login de funcionários com usuário e senha.',
          'Cadastro de pets associados a clientes, com espécie, raça, idade e peso.',
          'Listagem de pets disponíveis para compra e adoção.',
          'Registro de serviços básicos, como banho e tosa, e serviços clínicos, como consultas, exames e vacinação.',
          'Registro de internações e cirurgias, além de atendimentos com data, cliente, pet e preço.',
          'Catálogo de rações, brinquedos e acessórios, com controle de estoque, preços, descontos e taxas.',
          'Pagamentos em dinheiro, Pix, cartão de crédito ou débito.',
          'Formulários de compra e adoção, recibos e histórico de transações.',
          'Relatórios de vendas e serviços, histórico de clientes e pets e busca por cliente, pet ou serviço.',
        ],
      },
      {
        title: 'Integrantes',
        items: [
          'Alexsandro Rocha dos Santos — 2024010299',
          'Antonio Andson de Oliveira Rocha — 2024010349',
          'Ikaro Ferreira Brito — 2024010233',
          'Levi Filgueira Chagas — 2022022050',
          'Lucas Vieres Araujo Farias — 2025022531',
          'Paulo Gabriel Vieira de Souza Paiva — 2024010420',
          'Sophia Hellen Pires da Silveira — 2024010321',
        ],
      },
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
    detailsSections: [
      {
        title: 'Contexto acadêmico',
        items: [
          'Desenvolvido para a primeira unidade da disciplina Estruturas de Dados I, ministrada por George Felipe Fernandes Vieira.',
        ],
      },
      {
        title: 'Conceitos aplicados',
        items: [
          'Ponteiros e manipulação de strings para cópia, concatenação e comparação.',
          'Alocação dinâmica de memória com malloc, realloc e free.',
          'Vetores dinâmicos para armazenar itens do cardápio e pedidos.',
          'Structs e enumerações para organizar os dados.',
        ],
      },
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
    detailsSections: [
      {
        title: 'Sobre este site',
        items: [
          'Portfólio editorial monocromático, desenvolvido do zero em React e TypeScript.',
          'Nove seções apresentam a formação na UFERSA, habilidades, experiências acadêmicas, projetos e contatos.',
          'Conteúdo ainda não fornecido permanece ausente ou com um estado vazio explícito.',
        ],
      },
    ],
    repository: 'https://github.com/Andsonyz/Portfolio-Pessoal',
  },
  {
    id: 'acessibilidade-digital',
    title: 'Acessibilidade Digital para deficientes visuais',
    category: 'Acessibilidade digital · Em desenvolvimento',
    description:
      'O projeto busca oferecer uma alternativa para limitações de algumas tecnologias assistivas, incluindo a interpretação de tabelas complexas, a leitura de caracteres especiais e a tradução de texto em braille e vice-versa.',
    technologies: [],
    highlights: [],
    detailsSections: [
      {
        title: 'Objetivo e recursos',
        items: [
          'Desenvolver uma alternativa para determinadas limitações de tecnologias assistivas.',
          'Apoiar a interpretação de tabelas complexas.',
          'Apoiar a leitura de caracteres especiais.',
          'Explorar tradução de texto em braille e vice-versa.',
        ],
      },
    ],
    image: '/images/projects/acessibilidade.svg',
    imageAlt:
      'Ilustração conceitual monocromática de uma tabela e pontos em relevo, representando o tema de acessibilidade digital. Não é uma captura do projeto.',
  },
]
