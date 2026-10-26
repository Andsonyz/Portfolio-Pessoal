# Auditoria técnica — 26/10/2026

## A. Diagnóstico inicial

Baseline: commit `aa3c3d8`, `git status --short` vazio. **110 arquivos versionados próprios** inventariados; dependências e diretórios gerados foram analisados separadamente, sem confundir seu volume com código entregue ao navegador. O inventário por arquivo contém caminho, finalidade, evidência, categoria A/B/C/D, ação e risco em `.verification/audit/inventory-initial.json` e `inventory-final.json` (evidências locais ignoradas).

| Área                 | Finalidade e verificação                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/`               | React, nove seções, componentes, dados tipados, preferências, helpers e estilos; grafo de imports, TypeScript, revisão e testes |
| `public/`            | Assets, Open Graph, favicon, inicialização do tema e cabeçalhos; referências em dados, HTML, CSS e configuração                 |
| `api/`, `server/`    | Vercel Function por convenção e adaptador Vite local; não dependem de import do frontend                                        |
| `scripts/`, `tests/` | Verificadores e Playwright/Edge; entradas executáveis e descoberta por `testDir`                                                |
| `docs/`              | Procedimentos, decisões históricas e evidências; mantidos sem reescrever resultados antigos                                     |
| Configuração         | Manifesto/lock, TypeScript estrito, Vite, Tailwind v4, ESLint, Prettier, Playwright e Vercel                                    |
| Gerados              | `dist/`, `node_modules/`, `test-results/`, `.verification/`, `.vercel/`, `.superpowers/`; fora do versionamento                 |

O baseline passou em lint, build, **75 testes** e formatação. Foram identificados: crescimento de listeners no retrato ao pausar/retomar, quatro atalhos globais desnecessários após a abertura, cache com TTL renovado indevidamente/atravessando a virada UTC, ausência de cooldown em falhas, dois legados dispensáveis, PNGs pesados e detecção Tailwind abrangendo testes/documentação. A revisão independente encontrou ainda uma corrida no novo cooldown, corrigida antes da entrega.

Nenhum componente de `src/` órfão foi encontrado no grafo de imports relativos. Imports/configurações indiretas, CSS/fontes, paths públicos e a rota Vercel foram conferidos manualmente. Não foi usado apenas o critério de import estático para excluir arquivos. Os componentes grandes de animação permanecem coesos; não houve fragmentação artificial de diretórios.

## B. Limpeza e dependências

| Arquivo/área                                                | Evidência e categoria                                                                                              | Ação                             | Resultado/risco                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/generate-feathers.mjs`                             | D: gerava somente as duas penas antigas; não era chamado por build/scripts e os dados usam os seis SVGs fornecidos | Removido                         | Baixo; penas atuais preservadas                                                                                                                    |
| `public/images/projects/mitos.svg`                          | D: capa conceitual substituída; nenhuma referência ativa                                                           | Removido                         | Baixo; nova capa e painel verificados                                                                                                              |
| `public/images/profile/FotoParaPerfil.png`                  | B: selecionado indiretamente no Vite                                                                               | Substituído por `.webp` lossless | Mesmas dimensões/pixels; PNG guardado localmente em `.verification/audit/originals/` e no histórico                                                |
| `public/images/projects/capa_retangular_mitos_e_raizes.png` | B: dados compartilhados entre cartão e painel                                                                      | Substituído por `.webp` lossless | Mesmas dimensões/pixels e enquadramento; original preservado localmente                                                                            |
| `public/og-image.png`                                       | B: Open Graph/Twitter no HTML inicial                                                                              | Mantido                          | PNG estável 1200 × 630; candidato recomprimido rejeitado por diferença de pixels                                                                   |
| Seis SVGs de penas                                          | B: paths em `motion.ts` e legenda                                                                                  | Mantidos                         | Experimento sem alterações geométricas economizou apenas 1.236 bytes gzip; evitada modificação extensa por ganho pequeno                           |
| Fontes WOFF2                                                | B: `fonts.css`, não imports TS                                                                                     | Mantidas                         | Somente dois subconjuntos latinos locais                                                                                                           |
| `api/visitors.ts` e `server/`                               | A/B: convenção Vercel e plugin local                                                                               | Mantidos/refatorados             | Token exclusivamente no servidor; import `.js` de produção preservado                                                                              |
| Testes e documentação histórica                             | A/B: regressão e decisões verificáveis                                                                             | Mantidos                         | Nenhum teste removido para esconder falhas                                                                                                         |
| Gerados e logs locais                                       | C: builds, dependências, caches e evidências                                                                       | Mantidos fora do Git             | Builds/caches transitórios não versionados; métricas históricas em `docs/` são documentação intencional. `.superpowers/` agora tem ignore portátil |
| `.env.local`                                                | Configuração privada local                                                                                         | Preservado e ignorado            | Conteúdo não impresso nem copiado para relatórios                                                                                                  |

**Dependências:** todas as **9 diretas de produção e 17 de desenvolvimento** têm finalidade confirmada, incluindo fontes por CSS, tipos pelo compilador e CLI de testes/Prettier. Nenhuma dependência removida/atualizada; `package.json` e `package-lock.json` permanecem inalterados. `npm audit --json`: **zero vulnerabilidades conhecidas**; `npm ls --all`: nenhuma dependência inválida.

Duplicações transitivas de `lightningcss`/binário, `semver`, `eslint-visitor-keys`, `hookified` e `ignore` foram mantidas por seus contratos distintos de toolchain. Exemplo confirmado com `npm explain lightningcss`: Tailwind exige exatamente 1.32.0 e Vite exige ^1.33.0. Forçar uma única versão contrariaria os requisitos. React Icons e Lucide atendem respectivamente marcas/tecnologias e controles; ambos são usados. Ferramentas Sharp/SVGO foram instaladas apenas em diretório temporário ignorado, sem alterar o manifesto da aplicação.

## C. Refatorações e animações

- `ProfilePortrait`: consulta de mídia nativa com remoção explícita do listener; mantém quickTo, halo, duas faces e giro de 720°. O defeito reproduzido adicionava um listener por ciclo de pausa; o teste com GC confirma que isso não se repete.
- `PageMotion`: listeners de pular a abertura existem somente enquanto ela está ativa e também são removidos na desmontagem. Abertura, blur, ícones, chuva de penas e possibilidade de pular permanecem.
- `server/visitors.ts`: cabeçalhos de sucesso compartilhados, TTL restante de até 300 s limitado pela próxima meia-noite UTC e cooldown de 30 s por instância em erros. Falha continua 503/no-store, sem zero fictício ou valor antigo. `Retry-After` diminui durante o cooldown; logs mantêm somente códigos/status seguros. Conclusões de consultas antigas não alteram o estado da geração mais recente.
- `vite.config.ts`: prioridade de imagens opcionais expressa como lista, com WebP primeiro e os caminhos PNG/JPG anteriores como alternativas. Currículo continua opcional.
- `global.css`: detecção Tailwind limitada a `src/` e `index.html`; testes, planos e ferramentas deixam de influenciar utilitários de produção. Sintaxe conferida na [documentação oficial](https://tailwindcss.com/docs/detecting-classes-in-source-files).

Também foram revisados FeatherField, Typewriter, SectionMarquee, relógio, preferências, Header, contador e dialogs. Mantidos ticker/listeners com cleanup, scroll passivo, pausa em guia oculta, observers desconectados, timers cancelados e movimento reduzido. Não há atualização React por frame/movimento do cursor. O relógio atualiza um componente isolado; preferências mudam por interação, sem justificar memoização global. Não foram adicionados React.memo, contextos, lazy loading ou bibliotecas sem ganho demonstrado.

## D. Performance e aparência

Tamanhos em bytes. Gzip calculado pelo mesmo `node:zlib.gzipSync` antes/depois, não misturado com a estimativa do Vite.

| Recurso                                   |             Antes |            Depois |
| ----------------------------------------- | ----------------: | ----------------: |
| Foto, mesmos 840 × 840 pixels             |           883.506 |           556.588 |
| Capa Mitos, mesmos 1070 × 622 pixels      |         1.349.868 |           973.520 |
| JavaScript minificado / gzip              | 436.297 / 150.429 | 436.350 / 150.446 |
| CSS minificado / gzip                     |   43.478 / 10.069 |    43.209 / 9.993 |
| Diretório `dist/`                         |         3.734.886 |         3.029.991 |
| Recursos iniciais, soma `encodedBodySize` |         1.156.390 |           829.413 |
| Quantidade de recursos iniciais           |                13 |                13 |

A foto e a capa economizam **703.266 bytes**, com igualdade dos pixels decodificados confirmada. O JavaScript cresceu 53 bytes; não há alegação de redução do bundle JS. Nenhuma animação, recurso de acessibilidade ou seção foi retirada para reduzir métricas.

Ensaio local sem throttling em Edge headless, uma amostra inicial e uma final por viewport: LCP desktop 2.596 → 2.540 ms; mobile 276 → 268 ms. CLS desktop ≈0,00290 e mobile ≈0,00247 em ambas. Soma de `max(0, duração − 50 ms)` das tarefas longas durante a janela: desktop 68 → 318 ms e mobile 39 → 46 ms. Esses números variáveis **não demonstram melhora de velocidade nem correspondem ao TBT do Lighthouse**. Um ensaio alternado adicional isolou a imagem PNG/WebP na mesma aplicação: PNG registrou 335/52/52 ms e WebP 65/48/54 ms. O aumento persistente não foi reproduzido ao trocar somente o formato. Resultados brutos em `decode-comparison.json`, sem escolher somente amostras favoráveis.

**Memória:** medição após GC, com pausa/retomada, troca de tema, abertura/fechamento do dialog e mudanças de viewport. Antes, listeners totais 322 → 327 → 332 → 337 após 0/5/10/15 ciclos. Depois, aguardando callbacks de resize antes de coletar GC, ficaram **317 em todos os pontos e nos dois viewports**; listeners de `window` passaram de 29 para 25. Nós DOM ficaram constantes: 3.376 desktop e 3.367 mobile. O heap ainda variou: desktop 4.985.268 → 5.743.568 bytes; mobile 4.962.868 → 5.839.976 bytes. O ensaio não prova ausência absoluta de vazamentos nem mede memória de GPU. Houve amostras intermediárias com listeners transitórios; todas foram mantidas, e o script passou a esperar a conclusão desses callbacks.

Comparação de oito capturas estáticas de Hero/carrossel em 1440 e 390 px, temas claro/escuro, fontes carregadas, relógio fixado e movimento reduzido: zero pixels diferentes. A redução de movimento foi usada só para comparação reprodutível; a suíte funcional cobre movimento ativo, repulsão, tema em V, foto, pause/resume e swipe. O resultado preserva a identidade visual. Evidências em `.verification/audit/`, incluindo os relatórios de runtime de todas as etapas.

Lighthouse, INP de campo, testes em celular físico/Safari/Firefox, bateria e memória de GPU não foram medidos. Não são atribuídos scores, percentuais de velocidade ou garantias a esses itens.

## E. Segurança e Vercel

- `ANALYTICS_READ_TOKEN` existe localmente, está ignorado e é lido somente no servidor. A varredura final de 154 arquivos atuais/gerados/logs (UTF-8 e UTF-16LE) e dos blobs históricos inspecionados não encontrou seu valor; nenhuma variável pública `VITE_*` de segredo ou endpoint administrativo no bundle do cliente foi encontrado. Isso verifica o token atual, não é uma certificação de todos os segredos que possam ter existido.
- Consulta autenticada real: HTTP 200, resposta validada, `estimated_unique_visitors`/`last_30_days`. Sem imprimir/gravar token ou total no relatório. Mantidos o campo real `data.visitors`, o escopo do projeto/equipe e o aviso de identificação anônima renovada após 24 h.
- Rejeição de escrita/parâmetros, timeout, validação da janela/payload, abort do cliente e retry permanecem. O cooldown é proteção local de carga, não rate limit global ou autenticação do endpoint público.
- CSP, cabeçalhos Vercel/host estático, `safeHref`, `ExternalLink`, localhost e ausência de source maps públicos preservados. Sem `dangerouslySetInnerHTML`, eval ou segredos em `public/`.
- Vercel Function foi empacotada localmente com o builder real `@vercel/node`, mantendo o import compilado `.js`. Sem configuração retornou 503 seguro; em novo processo com a configuração local, a Function compilada retornou **200 com métrica válida**. No preview, o navegador revelou/ocultou dados reais, voltou mascarado ao recarregar, não enviou Authorization e não registrou `pageerror`.
- Nenhuma variável/infraestrutura de produção alterada, nenhuma publicação, push ou migração.

## F. Testes

Baseline: lint/build/75 testes/formatação aprovados. Os quatro testes novos de cache/listeners falharam antes das correções e passaram depois; os testes de imagens foram ajustados primeiro para WebP e reproduziram a ausência dos novos caminhos. O caso da corrida UTC também falhou com três consultas antes da correção e passou com duas depois.

Uma falha intermediária em `portfolio-update.spec.ts` era uma leitura imediata do filtro durante a transição CSS. A asserção foi mantida e passou a aguardar `toHaveCSS('filter', 'invert(1)')`, em vez de capturar o estilo antes do próximo frame.

| Comando/verificação                                      | Resultado final                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run lint`                                           | Aprovado, sem erro ou aviso ESLint                                                                           |
| `npm run build`                                          | Aprovado; inclui `tsc -b` nos projetos app/Node e Vite                                                       |
| `npm test -- --reporter=line`                            | **80 testes aprovados em 2,9 minutos**, sem falhas finais                                                    |
| `npm run format:check`                                   | Aprovado                                                                                                     |
| `npm run test:production`                                | Aprovado; nove seções, seis projetos, imagens WebP/SVG/OG, CSP, zero erros/pedidos externos no fluxo testado |
| API compilada e navegador, sem interceptar o contador    | HTTP 200, payload real válido, ocultação/revelação/reload corretos, sem Authorization no cliente             |
| Comparação final de imagens e oito capturas              | Pixels idênticos, claro/escuro e desktop/mobile                                                              |
| `git diff --check`                                       | Aprovado; avisos de normalização LF/CRLF do ambiente Windows                                                 |
| `git diff --exit-code -- package.json package-lock.json` | Aprovado; manifesto e lock inalterados                                                                       |

Não foi usado `tsc --noEmit` isolado na raiz com `files: []`, pois isso não verificaria os projetos referenciados: o build usa `tsc -b`. Os testes incluem 1920/1536/1366/768/390/360 px, navegação/menu, foco/Escape, swipe/zoom, animações ativas/pausa/movimento reduzido, axe, contador, erros da API e estados vazios. Revisão independente: nenhum achado Critical/Important; o achado Minor de concorrência foi corrigido e revalidado pelo revisor.

## G. Situação por área

| Área                                           | Situação                                                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Inventário e classificação                     | Concluída; tabela por arquivo nas evidências locais                                            |
| Limpeza comprovada                             | Concluída; dois legados removidos e duas imagens substituídas com originais locais preservados |
| Dependências                                   | Sem alterações necessárias; auditadas, utilizadas e lock preservado                            |
| React, hooks e arquitetura                     | Concluída; ciclo de vida corrigido sem abstrações adicionais                                   |
| Animações e memória                            | Concluída no escopo do ensaio; limites de heap/GPU/aparelhos reais acima                       |
| Assets e CSS                                   | Concluída; conversão sem perda e detecção de fontes delimitada                                 |
| Segurança e Analytics                          | Concluída localmente; sem segredo encontrado no escopo inspecionado                            |
| Regressão e documentação                       | Concluída; comandos, evidências e limites registrados                                          |
| CWV de campo/Lighthouse e dispositivos físicos | Parcialmente concluída; somente medição local com Playwright/CDP                               |
| Validação de novo deployment                   | Não executada; publicação fora do escopo autorizado                                            |

**Limpeza local parcialmente bloqueada:** a revisão automática de aprovação rejeitou a exclusão recursiva de `.verification/audit-tools/` e `.verification/function-fixture-audit/`, inclusive após conferir os caminhos absolutos e confirmar que eram diretórios comuns dentro do workspace. O único motivo fornecido foi “blocked by policy”. Foram mantidos ignorados, fora do código/dependências de produção e do build. A remoção dessas ferramentas/fixture criadas nesta auditoria fica pendente; nenhum método alternativo de exclusão foi usado para contornar o bloqueio.

Pendências opcionais: medir em aparelhos físicos/leitor de tela e obter amostras de campo representativas. Logs/traces antigos ignorados foram mantidos como evidência; podem ser arquivados manualmente após a revisão. Nenhuma exclusão ambígua foi executada.
