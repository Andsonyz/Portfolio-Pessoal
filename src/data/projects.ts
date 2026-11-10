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
    image: '/images/projects/capa_retangular_mitos_e_raizes.webp',
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
  {
    id: 'gestao-pedidos',
    title: 'Sistema de Gerenciamento de Pedidos',
    category: 'Full Stack · Gestão e simulação',
    description:
      'Sistema local de restaurante com pedidos, mesas, cozinha, caixa, estoque e compras. Um ambiente de treinamento separado permite simular o atendimento sem alterar os dados operacionais.',
    technologies: ['React', 'TypeScript', 'Node.js', 'SQLite', 'Socket.IO'],
    highlights: [],
    detailsSections: [
      {
        title: 'Fluxo operacional',
        items: [
          'Perfis de administrador, caixa, garçom e cozinha, com permissões por função.',
          'Pedidos, cancelamentos, pagamentos manuais, comandas e notificações persistidas.',
          'Estoque com reservas, consumo e perdas; fichas técnicas versionadas e recebimento de compras.',
          'Treinamento com banco separado, rodadas e cenários de atendimento.',
        ],
      },
      {
        title: 'Arquitetura e limites',
        items: [
          'Frontend, backend e contratos TypeScript compartilhados, com atualizações via Socket.IO e persistência SQLite.',
          'A operação é local. Pagamentos são registros manuais; a central de cozinha simula comandas, sem integração bancária, emissão fiscal ou impressão física ESC/POS.',
        ],
      },
    ],
    image: '/images/projects/gestao-pedidos.svg',
    imageAlt:
      'Composição tipográfica do sistema de pedidos, com as palavras salão, cozinha e caixa. Não é uma captura da aplicação.',
    imageCaption: 'Composição tipográfica',
    repository: 'https://github.com/Andsonyz/Gerenciamento-de-Pedidos',
  },
  {
    id: 'dashboard-restaurante',
    title: 'mesa. | inteligência',
    category: 'Dashboard · Integração de dados',
    description:
      'Dashboard analítico de um restaurante simulado. Reúne vendas, estoque, financeiro, compras e patrocínios a partir da integração com o sistema de pedidos, mantendo os dois projetos independentes.',
    technologies: ['React', 'TypeScript', 'Vite', 'PostgreSQL', 'Supabase'],
    highlights: [],
    detailsSections: [
      {
        title: 'Análise e integração',
        items: [
          'Visão geral e tabelas com busca, filtros por período e rodada, paginação e exportação CSV.',
          'Indicadores distinguem vendas, recebimentos, caixa e estoque; dados desconhecidos não são substituídos por zero.',
          'O sistema de pedidos realiza as operações; o dashboard consulta uma cópia analítica por meio de um contrato de integração.',
        ],
      },
      {
        title: 'Execução e limites',
        items: [
          'Demonstração local com bancos temporários, PGlite em memória e gateway autenticado.',
          'Arquitetura remota documentada para Cloudflare Pages e Supabase Auth, Postgres, Realtime e Edge Functions. A demonstração local não comprova implantação remota.',
          'Os dados da demonstração representam um restaurante simulado.',
        ],
      },
    ],
    image: '/images/projects/dashboard-restaurante.svg',
    imageAlt:
      'Composição tipográfica mesa. inteligência, com linhas editoriais sobre vendas, estoque e financeiro. Não é uma captura do dashboard.',
    imageCaption: 'Composição tipográfica',
    repository: 'https://github.com/Andsonyz/DashboardRestaurante',
  },
  {
    id: 'catalogo-filmes',
    title: 'Catálogo de Filmes e Séries',
    category: 'Backend · Projeto acadêmico colaborativo',
    description:
      'Aplicação acadêmica para cadastrar gêneros, filmes e séries, com interface de gestão, busca para consulta do acervo e API documentada. Desenvolvida em equipe na disciplina de Manutenção de Software da UFERSA.',
    technologies: ['Python', 'Django', 'Django REST Framework', 'SQLite', 'OpenAPI'],
    highlights: [],
    detailsSections: [
      {
        title: 'Funcionalidades',
        items: [
          'Cadastro e consulta de gêneros; criação, leitura, edição e exclusão de títulos.',
          'Pesquisa por nome, gênero e tipo, com filtros combinados e paginação.',
          'Filmes sem temporadas e séries com quantidade de temporadas validada.',
          'Documentação interativa Swagger e schema OpenAPI.',
        ],
      },
      {
        title: 'Contexto e limites',
        items: [
          'Trabalho da disciplina PEX1277 — Manutenção de Software.',
          'O catálogo armazena informações sobre títulos; não reproduz vídeos.',
          'O README descreve execução local e API com escrita pública (AllowAny). Não é apresentado como serviço de produção com acesso restrito.',
        ],
      },
      {
        title: 'Integrantes',
        items: [
          'Andrew Ferreira de Paiva Silva',
          'Antonio Andson de Oliveira Rocha',
          'Sophia Hellen Pires da Silveira',
        ],
      },
    ],
    image: '/images/projects/catalogo-filmes.svg',
    imageAlt:
      'Composição tipográfica do Catálogo de Filmes e Séries, com referência a gêneros e títulos. Não é uma captura da aplicação.',
    imageCaption: 'Composição tipográfica',
    repository: 'https://github.com/Andsonyz/catalogo-filmes-series-api',
  },
  {
    id: 'site-institucional',
    title: 'Site Institucional — Iara Santos',
    category: 'Frontend · Site institucional',
    description:
      'Site de apresentação profissional com página inicial e páginas de serviços, navegação responsiva, perguntas frequentes e contato por WhatsApp. Conteúdo centralizado e atenção à acessibilidade e ao movimento reduzido.',
    technologies: ['React', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'Motion'],
    highlights: [],
    detailsSections: [
      {
        title: 'Interface e conteúdo',
        items: [
          'Páginas inicial, aposentadorias, BPC e retorno para endereços inexistentes.',
          'FAQs, menu mobile acessível e faixas com arraste, toque e teclado.',
          'Conteúdo, contatos e metadados centralizados em uma fonte de dados.',
          'Fontes locais, imagens WebP e adaptação à preferência por movimento reduzido.',
        ],
      },
      {
        title: 'Escopo',
        items: [
          'Site estático de apresentação. Não inclui autenticação, banco de dados, formulários ou coleta de dados de visitantes.',
          'O README registra validação local e configuração preparada para hospedagem. Nenhum endereço de demonstração é presumido.',
        ],
      },
    ],
    image: '/images/projects/site-institucional.svg',
    imageAlt:
      'Composição tipográfica do site institucional Iara Santos, com a assinatura IS. Não é uma captura do site.',
    imageCaption: 'Composição tipográfica',
    repository: 'https://github.com/Andsonyz/SiteAdvogados',
  },
]

// Curadoria editorial: sistemas completos e variedade de áreas, sem usar estrelas como nota.
const featuredIds = [
  'mitos-raizes',
  'gestao-pedidos',
  'dashboard-restaurante',
  'catalogo-filmes',
  'site-institucional',
]
export const featuredProjects = featuredIds.map((id) =>
  projects.find((project) => project.id === id)!,
)
export const otherProjects = projects.filter((project) => !featuredIds.includes(project.id))

export const repositoryStudies = [
  { name: '2025-1', repository: 'https://github.com/Andsonyz/2025-1' },
  { name: 'Saboneteira', repository: 'https://github.com/Andsonyz/Saboneteira' },
  { name: 'meu-site-maes', repository: 'https://github.com/Andsonyz/meu-site-maes' },
  { name: 'Andson', repository: 'https://github.com/Andsonyz/Andson' },
]
