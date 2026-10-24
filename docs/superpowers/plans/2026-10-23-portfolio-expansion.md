# Evolução do portfólio — plano de implementação

> Execução autorizada diretamente pelo objetivo. Aplicar executing-plans, com investigações independentes conforme dispatching-parallel-agents. Não publicar/push, contratar serviços ou expor segredos.

**Objetivo:** concluir a integração real do contador e acrescentar os conteúdos, movimentos e relógio solicitados, preservando nove seções e identidade monocromática.

**Especificação:** objetivo completo fornecido em `C:\Users\anton\.codex\attachments\9ca51b66-8eee-46a2-90bb-5e9daa8f0b07\goal-objective.md`.

**Arquitetura:** manter React/TypeScript/Vite/Tailwind/GSAP. Reutilizar o proxy Analytics e dados centralizados. Usar `data.visitors` como estimativa de visitantes da Vercel, com janela explícita de 30 dias UTC e ressalva de identificação limitada a 24 horas; não apresentar pageviews como pessoas. Sem banco adicional enquanto API oficial disponível. Relógio isolado no rodapé com Intl/horário atual. Três faixas editoriais antes de Habilidades, Projetos e Contato, sem criar seções extras. Retrato com faces e camada rotativa Y separada do halo.

## Evidências iniciais

- Worktree limpa, HEAD `0b50eb0`. Implementação anterior está commitada pelo usuário.
- Coletor `@vercel/analytics` 2.0.1 está em `main.tsx`, uma única montagem em produção.
- API oficial respondeu ao conector com `data.visitors` e `data.pageviews`; valores observados não serão incorporados à produção.
- Endpoint público `/api/visitors` retornou 500 `FUNCTION_INVOCATION_FAILED`, sem JSON. Credenciais/variáveis remotas ausentes (`envs: []`); sem `.env.local`. Logs pelo conector retornaram 403. Investigar empacotamento antes de alterar adapter.
- Giro atual usa `rotation` (Z), explicando diferença do efeito de moeda desejado.
- Projetos atualmente são quatro, incluindo Clínica; carrossel já deriva indicadores de `projects.length`.
- Sem datas confirmadas dos novos projetos: não acrescentar marcos datados. Registrar acessibilidade em Experiências/Sobre sem repetir o mesmo parágrafo.

## Tarefas e evidências de aceitação

- [ ] **Contador:** reproduzir erro local/remoto e pacote da Function; corrigir causa comprovada; validar token/configuração sem vazamento; logs estruturados sem segredo, timeout, cache/concurrency e erro discriminado. Arquivos `api/visitors.ts`, `server/visitors.ts`, contrato/UI e testes. Aceitação completa exige consulta real via aplicação e valor mostrado no componente. Configuração externa pendente continua impedimento, não sucesso.
- [x] **Conteúdo:** verificar código dos dois repositórios e registrar SHAs; substituir Clínica por Ame-Pet e Restaurante, exatamente cinco na ordem solicitada. Dados centralizados, autoria colaborativa/terminal, conceitos confirmados e links reais. Criar dois SVGs conceituais específicos seguindo assets existentes. Preservar SQL/modelagem gerais. Atualizar experiências, Sobre e Python/Node.js (runtime). Testar cinco slides, links/teclado/swipe e ausência pública da Clínica.
- [x] **Retrato:** trocar Z por Y com desaceleração e faces sem espelhamento visível, centro estável, halo independente, antirreentrada, cleanup, pausa/redução. Teste matriz 3D Y, retorno a identidade, cliques repetidos e halo.
- [x] **Faixas:** `SectionMarquee.tsx`, dados em `src/data/marquees.ts`, estilos próprios e integração em `App`. Movimento contínuo, direção/velocidade parametrizáveis, pausa hover/global, estático em redução, uma única descrição acessível e nenhum overflow. Testar resize/zoom/pausa.
- [x] **Relógio:** `LocalClock.tsx`, configuração em dados, `Footer` e estilos próprios. Intl pt-BR America/Fortaleza, 24h HH:mm:ss, real Date a cada tick, timer único limpo/suspenso em aba oculta, sem aria-live repetitivo ou render global. Testar com relógio controlado, fuso diferente do navegador e retomada.
- [ ] **Verificação e documentação:** lint, build, npm test, format:check, dev e produção local, novas capturas desktop/mobile claro/escuro, V/penas/abertura/foto/contatos/OG. Atualizar README, AGENTS, validation, documentação Analytics/configuração/conteúdo/faixas/relógio. Revisão independente. Relatório separa implementação, simulação, consulta real e produção.

## Condições de revisão

1. Token ausente/expirado e resposta não JSON não podem virar zero ou expor segredo; usuário recebe erro e retry utilizável.
2. Janela/identificadores da Vercel não permitem afirmar pessoas únicas deduplicadas durante todo o mês.
3. Alterações de tema/pausa durante giro e faixas não podem reiniciar abertura nem acumular animações.
4. StrictMode, abas ocultas e desmontagem não podem duplicar relógio/timers/listeners.
5. Novos projetos não podem ganhar datas, autoria individual, GUI, web ou padrões apenas prometidos em README.

## Pendências externas iniciais

Token server-side solicitado ao proprietário via pergunta assíncrona; não enviar segredo na conversa. Não há autorização explícita de deploy/push. Configuração técnica necessária é autorizada, mantendo credenciais privadas. Continuar demais tarefas enquanto essas ações externas não estiverem disponíveis.

## Estado após implementação e verificação local

- Conteúdo, cinco projetos, experiência, habilidades, Sobre, retrato Y, faixas e relógio implementados. `npm run lint`, `npm run build`, `npm run format:check`, `npm test` (57/57) e `npm run test:production` passaram; documentação e inspeção visual atualizadas.
- O proprietário configurou o token, e as variáveis de escopo foram adicionadas ao projeto Vercel. Vite, preview e o artefato compilado pelo builder oficial consultaram dados reais. O componente revelou o agregado no Edge em dev e preview, sem interceptar a rede.
- O proprietário redeployou o commit antigo `0b50eb0`; a Function pública ainda retorna 500. O objetivo de funcionamento em produção aguarda publicação autorizada do código corrigido e nova verificação de ponta a ponta. Nenhum push ou deploy deste worktree foi executado.
