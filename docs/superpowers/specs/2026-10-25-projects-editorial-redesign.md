# Projetos: apresentação editorial com penas

## Intenção

Deixar a seção Projetos mais identificável como parte do portfólio editorial monocromático de Andson Rocha, explicar melhor os trabalhos fornecidos e permitir abrir os repositórios corretos. A alteração integra o carrossel e os detalhes existentes; não refaz o site.

## Estado observado

- Projects.tsx monta a seção e delega a navegação a ProjectCarousel.
- ProjectCarousel apresenta uma capa por vez, resumo, tecnologias, controles acessíveis e botão de detalhes.
- ProjectDetailDialog exibe destaques e tecnologias do mesmo objeto de projeto.
- projects.ts é a fonte dos projetos. ExternalLink valida URLs e abre endereços HTTPS em nova aba.
- Só aparecem CTAs de repositórios quando o campo existe. Mitos e o portfólio têm endereços fornecidos para esta atualização; SAPO permanece sem endereço.
- Os seis SVGs das penas já estão em public/images/feathers e o site preserva tema, movimento reduzido e parallax.

## Propostas consideradas

1. **Refinar o carrossel editorial existente** (recomendação): compor capa, legenda e índice com uma pena discreta; usar o painel de detalhes para as descrições, funcionalidades e equipe; adicionar CTAs apenas para URLs confirmadas. Mantém o fluxo e a navegação atuais.
2. **Exibir todos os projetos em uma grade:** melhora a visão geral, mas muda bastante o fluxo compacto atual.
3. **Manter a aparência atual e alterar somente textos e links:** tem menos alcance visual e não dá à aba a identidade pedida.

O proprietário escolheu a opção 1 e confirmou a inclusão de Acessibilidade como sexto projeto. Os detalhes abaixo registram essas escolhas.

## Composição proposta

- Preservar o carrossel, a ordem atual, controles, gesto horizontal, teclado, painel e layout responsivo.
- Refinar a apresentação como um fólio de estudos: legenda e contorno da capa mais bem resolvidos, índice ligado à navegação existente e uma pena fornecida como acento monocromático em uma área sem texto nem imagem. O adorno não recebe cliques nem é anunciado por leitores de tela; claro/escuro segue os tokens atuais.
- Manter cartões concisos. O painel organiza os dados em seções tipadas (funcionalidades e equipe quando houver), permanece rolável e conserva gestão de foco, Escape e bloqueio da rolagem da página.
- Acrescentar os endereços fornecidos para Entre Mitos e Raízes e o próprio portfólio. Preservar os links de Ame-Pet e Restaurante Dividão. Não inventar URL para SAPO.
- Atualizar Mitos com descrição, tecnologias e funcionalidades do material enviado. Expandir Ame-Pet com funções e equipe fornecidas. Atualizar Restaurante com contexto e conceitos informados, preservando os fatos já confirmados.
- Considerar Acessibilidade Digital como um sexto projeto, pois foi incluído na lista para a aba. A entrada usa apenas descrição e funcionalidades fornecidas. Não inventa autoria, tecnologias ou resultados.
- Apresentar os integrantes e as matrículas que já constam no material fornecido do Ame-Pet, mantendo-os apenas dentro do painel detalhado.
- O proprietário confirmou que o repositório de Acessibilidade Digital é privado. O projeto usa somente os dados fornecidos, sem publicar seu endereço ou apresentar CTA de repositório.
- Não instalar dependências nem publicar ou executar push.

## Arquivos e responsabilidades previstas

- src/types/content.ts: extensão mínima e tipada para seções e equipe opcionais.
- src/data/projects.ts: conteúdo confirmado e URLs recebidas.
- src/components/projects/ProjectCarousel.tsx: apresentação e CTA sem interferir nos controles.
- src/components/projects/ProjectDetailDialog.tsx: seções detalhadas derivadas da mesma fonte de dados.
- src/styles/global.css: identidade visual, estados, responsividade, tema e movimento reduzido.
- public/images/projects/acessibilidade.svg: ilustração conceitual monocromática, somente se não houver asset apropriado; alt deixa explícito que não é captura de software.
- tests/portfolio-update.spec.ts e tests/portfolio-expansion.spec.ts: expectativas da nova lista; links, detalhes e navegação mobile.
- README e docs/validation.md: registrar a inclusão do sexto item e o repositório privado sem CTA.

## Critérios de aceitação

1. A pena existente aparece no fólio, com contraste nos dois temas, sem cobrir conteúdo ou receber cliques.
2. Os cinco projetos atuais continuam navegáveis; Acessibilidade entra como sexto, sem duplicar a experiência.
3. Capa, resumo, tecnologias e detalhes usam a mesma fonte de dados.
4. Mitos, Ame-Pet e Restaurante exibem somente informações fornecidas e confirmadas.
5. Os repositórios disponíveis abrem a URL exata em nova aba com noopener noreferrer; nenhum CTA vazio ou inventado.
6. Painel, teclado, toque, carrossel, responsividade, movimento reduzido e temas permanecem funcionais.
7. Lint, build, testes, format:check e verificação de produção passam.

## Pendência externa

O proprietário confirmou que o repositório de Acessibilidade Digital é privado. O portfólio não inclui seu endereço nem apresenta um CTA público para esse projeto.
