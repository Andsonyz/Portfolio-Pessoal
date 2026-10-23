# Portfólio Andson Rocha Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar o portfólio completo descrito no objetivo do usuário.
**Architecture:** SPA local, dados tipados separados da apresentação; tema e movimento no nível da aplicação; seções independentes.
**Tech Stack:** React, TypeScript estrito, Vite, Tailwind CSS v4, GSAP, @gsap/react, Lucide, React Icons.
**Spec:** `docs/superpowers/specs/2026-10-21-portfolio-design.md`

## Global Constraints

- Preto, branco e cinzas neutros em toda a interface.
- Apenas informações confirmadas; certificados/eventos vazios e arquivos opcionais ausentes não geram links.
- Não publicar nem executar push. Execução direta autorizada pelo objetivo, sem interrupções por decisões técnicas triviais.
- Animação não pode impedir navegação; movimento reduzido respeitado.

## Review Focus

- localStorage bloqueado ou valor inválido: tema continua funcional.
- Navegador sem View Transitions: mudança imediata completa e reversível.
- Mobile, zoom e teclado: nenhuma rolagem horizontal ou foco perdido.
- Arquivos ausentes e protocolos inseguros: nenhum link quebrado ou executável.
- Alternâncias rápidas e desmontagem: sem camadas presas, timers órfãos ou reentrada.

### Task 1: Fundação e contratos

- [x] Criar configurações estritas, dependências e testes de fluxo antes da implementação.
- [x] Executar cenário de conteúdo e observar falha por funcionalidade ausente.
- [x] Definir tipos em `src/types/content.ts`, dados em `src/data`, links seguros em `src/lib/links.ts`.

### Task 2: Identidade e conteúdo

- [x] Implementar `src/app/App.tsx`, navegação e nove seções.
- [x] Criar SVGs de monograma, penas e quatro ilustrações conceituais locais.
- [x] Implementar arquivos opcionais, carrossel e expansão nativa das timelines.
- [x] Validar conteúdo, links, carrossel e menu no navegador.

### Task 3: Tema e movimento

- [x] Implementar tema persistido e corte V na interface inteira.
- [x] Implementar entrada, penas e microinterações com cleanup GSAP.
- [x] Validar redução/pausa de movimento, fallback, tema persistente e proteção contra alternância durante a transição.

### Task 4: Qualidade e entrega

- [x] Executar lint, build, testes e auditoria de dependências.
- [x] Inspecionar screenshots desktop/mobile claro/escuro; corrigir problemas observados.
- [x] Executar revisão independente e corrigir achados relevantes.
- [x] Criar README, AGENTS e relatório de validação com evidências e limitações.

## Ledger

- Diretório vazio; trabalho autorizado neste diretório. Não criar worktree sem repositório existente.
- Brief detalhado e execução completa já solicitados pelo usuário; nenhuma aprovação adicional de planejamento necessária.
- Interfaces compartilhadas: dados tipados → seções; tema/movimento → navegação e animações; links seguros → projetos, certificados, eventos e contatos.
- Verificação final: 12/12 testes aprovados (49,9 s), lint e formatação sem erros, build de produção gerado, audit sem vulnerabilidades conhecidas, teste do bundle de produção aprovado.
- Revisão independente: corrigidos zoom por pinça, captura de teclado dos controles internos, nome do diálogo e isolamento do cenário de fallback. Demais correções e limites em `docs/validation.md`.
- Evidências visuais: `.verification/`; dados e arquivos futuros mantidos ausentes conforme o objetivo. Nenhuma publicação ou push.
