# Projects Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Dar à seção Projetos uma apresentação monocromática com pena, ampliar detalhes reais e conectar projetos aos repositórios fornecidos.

**Architecture:** Manter o carrossel e seu modal. Estender o modelo Project e usar os mesmos objetos nos cartões e no painel detalhado. Usar um SVG conceitual local para Acessibilidade, sem inventar captura, tecnologia ou resultado.

**Tech Stack:** React, TypeScript, Vite, CSS existente, Playwright, SVG estático.

**Spec:** docs/superpowers/specs/2026-10-25-projects-editorial-redesign.md

## Global Constraints

- Manter a identidade preta, branca e cinza, as seis penas existentes, temas, transição em V e nove seções.
- Preservar carrossel, swipe, teclado, modal, foco, Escape e acessibilidade.
- Não adicionar dependências, demonstrações, fatos ou URLs não fornecidos.
- Não publicar, enviar push ou alterar conteúdo fora da seção de projetos.
- O repositório de Acessibilidade é privado conforme confirmado pelo proprietário; não incluir endereço nem CTA público.

## Review Focus

- Links opcionais/404: CTAs aparecem somente com URL fornecida e validada (portfolio-expansion.spec.ts).
- Índices derivados com seis itens: navegação e contagem continuam corretas (portfolio-expansion.spec.ts).
- Penas não cobrem a arte nem recebem cliques ou anúncios (portfolio-update.spec.ts).
- Painéis extensos em mobile continuam roláveis e acessíveis (portfolio-update.spec.ts).
- Títulos/equipe longos não ultrapassam o modal (portfolio-update.spec.ts e matriz de viewport).

---

### Task 1: Dados tipados, seis projetos e destinos

**Files:**

- Modify: src/types/content.ts
- Modify: src/data/projects.ts
- Create: public/images/projects/acessibilidade.svg
- Test: tests/portfolio-expansion.spec.ts

**Interfaces:**

- Produces: Project.detailsSections?: { title: string; items: string[] }[] para conteúdo detalhado opcional.
- Consumes: Project continua fonte comum; repository permanece opcional.

- [x] **Step 1: Escreva o teste que falha**

Em portfolio-expansion.spec.ts, espere seis indicadores, os seis títulos na ordem da especificação, os URLs públicos de Mitos e Portfólio e a omissão de CTA para o repositório privado de Acessibilidade. Preserve as verificações existentes de Ame-Pet e Restaurante.

- [x] **Step 2: Confirme a falha**

Execute npx playwright test tests/portfolio-expansion.spec.ts --grep "seis projetos"; esperado: falha na quantidade e nos projetos/destinos que faltam.

- [x] **Step 3: Implemente o tipo e os dados**

Adicione detailsSections ao tipo Project. Atualize Mitos, Ame-Pet, Restaurante e o próprio portfólio apenas com informações fornecidas. Registre a equipe Ame-Pet como fornecida. Acrescente Acessibilidade como sexto projeto, sem tecnologia ou resultado não informado; omita repository porque o proprietário confirmou que é privado. Crie SVG conceitual monocromático e alt que deixe claro ser ilustração.

- [x] **Step 4: Confirme os dados**

Execute npx playwright test tests/portfolio-expansion.spec.ts; esperado: os seis cartões, contagem e repositórios válidos passam.

### Task 2: Conteúdo do painel

**Files:**

- Modify: src/components/projects/ProjectDetailDialog.tsx
- Modify: tests/portfolio-update.spec.ts

**Interfaces:**

- Consumes: Project.detailsSections da Task 1.
- Produces: seções detalhadas acessíveis; fallback aos highlights em projetos sem detailsSections.

- [x] **Step 1: Escreva testes que falham**

Abra os seis projetos e verifique funcionalidades reais e equipe de Ame-Pet; dados de Mitos, Restaurante, Portfólio e Acessibilidade; ausência de seções vazias ou duplicadas.

- [x] **Step 2: Confirme a falha**

Execute npx playwright test tests/portfolio-update.spec.ts --grep "detalhes expandidos"; esperado: grupos/equipe ainda não aparecem.

- [x] **Step 3: Renderize as seções**

Renderize cada grupo por título/lista e não repita highlights se detailsSections existir. Para objetos sem detalhes estruturados, preserve highlights. Mantenha role, nome acessível, scroll, fechamento e foco existentes.

- [x] **Step 4: Confirme**

Execute npx playwright test tests/portfolio-update.spec.ts; esperado: detalhes, foco e scroll passam.

### Task 3: Pena, CTA e validação

**Files:**

- Modify: src/components/projects/ProjectCarousel.tsx
- Modify: src/styles/global.css
- Modify: scripts/verify-production.mjs
- Modify: README.md
- Modify: docs/validation.md
- Test: tests/portfolio-update.spec.ts

**Interfaces:**

- Consumes: imagem, caption, detailsSections e repository opcionais do Project.
- Produces: legenda de capa com pena decorativa e link de repositório claro.

- [x] **Step 1: Escreva o teste que falha**

Confirme aria-hidden e alt vazio para a pena, HTTP 200 no asset do build, ExternalLink seguro e contagem 06/06.

- [x] **Step 2: Confirme a falha**

Execute o teste selecionado de portfolio-update.spec.ts; esperado: motivo e link destacado ainda não existem.

- [x] **Step 3: Refine o fólio**

Adicione uma pena pequena na legenda, sem cobrir capa ou texto, com contraste nos temas. Organize o CTA independente do botão de detalhes. Preserve toque e navegação. Derive as contagens de projects.length e atualize a documentação atual sem alterar registros históricos.

- [x] **Step 4: Valide**

Execute em série: npm run lint; npm run build; npm test; npm run format:check; npm run test:production. Leia as saídas. Inspecione 1440×900 e 390×844 nos dois temas, com teclado, modal, links e overflow.

### Integração

Sem commit nesta implementação: a branch main já contém alterações locais de tarefas anteriores. Revisar somente os caminhos deste plano e preservá-las. Sem push ou deploy.
