# Atualização geral do portfólio — plano de implementação

> **Execução:** implementação nativa no projeto existente, conforme pedido de execução autônoma. Não publicar nem fazer push.

**Objetivo:** integrar o novo sistema de penas em camadas, atualizar textos e interações e aprimorar a exploração dos projetos sem alterar as nove seções nem inventar dados.

**Arquitetura:** continuar com React, TypeScript, dados em `src/data` e GSAP já instalado. O campo de penas terá sementes determinísticas e três planos com movimento GSAP, cursor e rolagem compostos em transforms. Interações compactas serão componentes focados; os detalhes de projeto usarão `<dialog>` modal nativo e a mesma entidade `Project` que alimenta os cartões.

**Tecnologias:** React 19, TypeScript, Vite, Tailwind CSS v4, GSAP, Lucide React e Playwright existentes; sem novas dependências.

**Especificação:** solicitação “GOAL — Atualização Geral do Portfólio Andson Rocha”, enviada em 25/10/2026 nesta conversa, junto às instruções de `AGENTS.md`.

## Restrições globais

- Manter nove seções, tema monocromático, transição em V, preferências de movimento, CSP, navegação e carrossel acessível.
- Usar exatamente os seis SVGs fornecidos em `public/images/feathers/`; sem substitutos gerados.
- Manter dados pessoais, contatos e conteúdos de projeto somente quando presentes no repositório ou fornecidos na especificação.
- A capa `public/images/projects/capa_retangular_mitos_e_raizes.png` é a única imagem de projeto nova; aplicá-la somente a “Entre Mitos e Raízes”, sem distorcer/cortar.
- Reutilizar número e mensagem WhatsApp existentes e `encodeURIComponent`; sem duplicar configuração.
- Respeitar `prefers-reduced-motion`, pausa, teclado, foco e `America/Fortaleza`.
- Não fazer deploy nem push.

## Foco de revisão

- Mouse e scroll ativos ao mesmo tempo: nenhum efeito sobrescreve o transform base, e a interação continua sem capturar cliques.
- Preferência de movimento reduzido/pausado ou aba oculta: o campo não mantém ticker ou listeners duplicados.
- Expansão das áreas do Hero e radar no teclado: estado, conteúdo e `aria-expanded` permanecem sincronizados.
- Dialog em desktop/mobile e fechamento por botão/Escape: foco retorna ao botão que abriu e a rolagem do documento é restaurada.
- Arquivos novos e produção Vite: todas as penas e a capa retornam 200 e preservam a razão de aspecto.

## Etapas

### Tarefa 1 — conteúdo, relógio e interações de interesse

**Arquivos:** `src/data/profile.ts`, `src/data/radar.ts` (novo), `src/sections/Hero.tsx`, `src/sections/About.tsx`, `src/components/animations/Typewriter.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/LocalClock.tsx`, `src/components/ui/RadarAccordion.tsx` (novo), `src/styles/global.css`, `src/styles/clock.css`, `tests/portfolio-update.spec.ts` (novo).

- [x] Atualizar os quatro parágrafos de Sobre, os quatro itens “No meu radar” com resumos fornecidos e apresentação acadêmica do Hero.
- [x] Mover o relógio real para o Hero e exibir a localização uma única vez no rodapé.
- [x] Implementar acordeão acessível de quatro itens e expansão “Mostrar tudo/Mostrar menos” usando `professionalRoles`. A inspeção identificou “Áreas que exploro” em `Typewriter.tsx`, no Hero; a seção Habilidades mantém os grupos visíveis.
- [x] Remover instrução visível e sinais `+` decorativos do Hero/foto, preservando o botão de rotação e suporte ao teclado.
- [x] Escrever verificações Playwright de texto, quantidade de grupos, accordion, botão mostrar/ocultar, retrato e ausência dos sinais/instruções.
- [x] Executar `npx playwright test tests/portfolio-update.spec.ts`.

### Tarefa 2 — campo cinematográfico de penas

**Arquivos:** `src/data/motion.ts`, `src/components/animations/FeatherField.tsx`, `src/styles/global.css`, `tests/portfolio-update.spec.ts`.

- [x] Substituir referências `feather-1/2.svg` pelos seis SVGs reais em três camadas com tamanho, posição, blur e opacidade próprios, sem concentrar pena sobre o conteúdo central.
- [x] Compor flutuação, rotação, repulsão suavizada do ponteiro e deslocamento por scroll em transforms separados; manter seeds determinísticas e quantidades por desktop/tablet/mobile.
- [x] Limpar ticker, listeners e animações na desmontagem e respeitar pausa, visibilidade de aba, redução de movimento e tema.
- [x] Testar uso dos seis assets, três planos, resposta de mouse/scroll, pausa/redução e ausência de overflow/captura de interação.
- [x] Executar os testes direcionados de penas em Playwright.

### Tarefa 3 — imagem e painel detalhado de projetos

**Arquivos:** `src/data/projects.ts`, `src/types/content.ts`, `src/components/projects/ProjectCarousel.tsx`, `src/components/projects/ProjectDetailDialog.tsx` (novo), `src/styles/global.css`, `tests/portfolio-update.spec.ts`.

- [x] Trocar apenas a capa de Mitos e Raízes pela imagem nova; definir proporção e `object-fit: contain` para não cortar.
- [x] Preservar cartões compactos e abrir `<dialog>` em duas regiões no desktop e coluna única no mobile; apresentar somente descrição, destaques, tecnologias e links já existentes.
- [x] Implementar botão fechar, Escape, foco inicial/retorno, rolagem interna, fundo, animação GSAP discreta e respeito ao movimento reduzido.
- [x] Testar capa idêntica no cartão/painel, todos os cinco projetos, links reais, sem campos inventados, Escape, foco e mobile.
- [x] Executar os testes direcionados do carrossel/painel.

### Tarefa 4 — contato WhatsApp e revisão de decoração

**Arquivos:** `src/data/contacts.ts`, `src/components/ui/WhatsAppFloatingButton.tsx` (novo), `src/app/App.tsx`, `src/styles/global.css`, `tests/portfolio-update.spec.ts`.

- [x] Exportar uma configuração única de número/mensagem/URL e reutilizá-la no contato atual e no novo link flutuante, abrindo em nova aba com descrição acessível.
- [x] Revisar sinais geométricos, pseudo-elementos, bordas e separadores; remover traços sem função e corrigir apenas desalinhamentos observados.
- [x] Testar URL/mensagem exatas, `target`, `rel`, acessibilidade e posição/overflow em larguras pequenas.
- [x] Executar os testes direcionados de contato e layout.

### Tarefa 5 — revisão visual, documentação e suíte completa

**Arquivos:** `README.md`, `docs/validation.md`, `docs/superpowers/plans/2026-10-25-portfolio-general-update.md`.

- [x] Atualizar README e validação para registrar conteúdo, nova imagem, campo de penas, modal, interações e verificações.
- [x] Verificar desktop, tablet e mobile em tema claro/escuro; checar overflow, cortes, títulos, controles, transição de tema, penas, pausa e console.
- [x] Executar `npm run lint`, `npm run build`, `npm test`, `npm run format:check` e `npm run test:production`.
- [x] Fazer revisão final do diff para garantir que nenhum arquivo pessoal, token, dado ou alteração fora do escopo foi incluído.

## Cobertura da especificação

As tarefas cobrem os seis SVGs/camadas, parallax e repulsão, movimento/redução, tema, relógio/localização, Hero/Sobre, radar, habilidades, decoração/foto, WhatsApp, nova capa, linhas, dialog dos cinco projetos, responsividade, preservação e todos os testes/documentação solicitados. Não há conteúdo real adicional de contexto, resultados, desafios ou estado além dos campos atuais; o painel não criará esses dados.
