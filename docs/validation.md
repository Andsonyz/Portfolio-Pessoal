# Relatório de validação — Atualização 3 — 22/10/2026

Os registros anteriores abaixo são históricos. A atualização mais recente, com a métrica de visitantes estimados e cinco projetos, está no fim deste documento.

## Complemento — Vercel Analytics — 23/10/2026

Validação desta alteração: `npm run lint`, `npm run build` e `npm run format:check` aprovados; `npm test -- --reporter=line` concluiu os 29 cenários com sucesso em 3,2 minutos.

Integração do pacote já instalado `@vercel/analytics` em `src/main.tsx`, com `<Analytics mode="production" />` somente em build de produção fora de localhost. `vercel.json` replica os cabeçalhos de `public/_headers` para o host Vercel. A CSP continua restrita à própria origem para scripts e coleta, sem liberar domínios adicionais. README atualizado com ativação no painel e publicação posterior.

As verificações locais anteriores de ausência de requisições externas continuam válidas para localhost, onde Analytics está desativado. No deployment há coleta de visitas pelo Vercel Web Analytics. A ativação do serviço, o recebimento de dados no painel e os cabeçalhos HTTP efetivos dependem de um novo deployment; não foram verificados remotamente e nenhuma publicação foi executada nesta alteração.

Verificação adicional com o bundle compilado em Edge: uma simulação local de origem publicada carregou exatamente um script `/_vercel/insights/script.js`; na origem `127.0.0.1`, nenhum script de Analytics foi solicitado. Não houve erros de console/CSP. O endpoint foi substituído por um script de prova local, portanto esse ensaio valida a integração e não o recebimento de visitas pela Vercel. Evidência reproduzível em `.verification/check-analytics.mjs`.

## Escopo entregue

Atualização do portfólio existente, preservando React + TypeScript estrito + Vite + Tailwind CSS v4, GSAP, as nove seções, o monograma AR, os dados confirmados e a interface monocromática. Nenhuma dependência foi adicionada, nenhum site foi publicado e nenhum push foi executado.

A foto real fornecida, `public/images/profile/FotoParaPerfil.png`, substitui o placeholder quando carrega corretamente. Foram implementados Welcome, chuva de penas pequenas, repulsão por mouse, digitação das quatro áreas, halo e giro acessível da foto. Space Grotesk foi mantida e refinada em caixa alta, peso 600, com escala e espaçamento responsivos; Manrope continua nos textos e controles.

## Causa e correção do corte em V

`ThemeCut` mantinha uma linha DOM de 1 px por toda a altura da viewport. Ela ficava visível antes da captura dos snapshots e após sua remoção, até o próximo commit React. A animação `cut-line` afetava o pseudo-elemento, sem esconder essa linha real nos intervalos. Esse desacordo entre as duas camadas produzia a listra e os flashes associados.

O componente e sua camada independente foram removidos. O V agora é formado exclusivamente pelo recorte do snapshot da interface inteira. O polígono começa degenerado no topo central, desce, abre lateralmente e termina além das bordas da viewport para evitar frestas. As capturas têm empilhamento explícito, sem mistura ou fade padrão. O tema muda dentro do callback da View Transition; uma ref impede solicitações simultâneas, e a rejeição de `ready` é consumida em interrupções.

Os nove testes específicos passaram: ausência da linha DOM e oito combinações de desktop/mobile, tema inicial claro/escuro e posição topo/projetos. Cada combinação exercita cliques rápidos, frames em 0/700/1399 ms, conclusão, scroll preservado e retorno ao tema inicial. A suíte geral também verifica preferência salva, API ausente, armazenamento bloqueado e movimento reduzido. As capturas inspecionadas não apresentam a listra residual.

## Animações e configurações

| Recurso               | Implementação validada                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Welcome               | Timeline GSAP de aproximadamente 3,2 s; ícones Code/User/Globe, letras escalonadas, blur e revelação do Hero                                               |
| Navegação na abertura | Conteúdo permanece montado; teclado, clique, toque e rolagem encerram a abertura; movimento reduzido mostra o site imediatamente                           |
| Recorrência           | Abertura a cada carregamento/reload; não reinicia com troca de tema                                                                                        |
| Penas                 | 30 no desktop ≥1200 px, 18 no tablet e 10 no mobile <768 px; larguras 12–34 px e opacidade variável                                                        |
| Movimento das penas   | Chuva inicial transita para flutuação contínua com deriva lateral, rotação e velocidades distintas; um ticker, sem estado React por frame                  |
| Repulsão              | Mouse fino/hover real; raio 115 px, força máxima 28 px, aproximação e retorno suavizados; ausente no touch                                                 |
| Digitação             | Quatro títulos exatos; 80–94 ms por caractere, apagamento 42 ms, espera 1.500 ms e intervalo 300 ms; um timer, espaço reservado e lista acessível estática |
| Halo                  | Monocromático atrás da foto; mouse fino, deslocamento máximo 22 px, suavização GSAP; ausente com pausa/redução ou touch                                    |
| Giro                  | Botão com clique/toque/Enter/Espaço; 720°, 1,6 s, `power3.out`, orientação final exata e sem acúmulo por cliques rápidos                                   |
| Pausa e redução       | Interrompem penas, digitação e interações animadas; giro reduzido fornece contorno discreto; timers/ticker suspendem atividade com página oculta           |

Os títulos e parâmetros estão centralizados em `src/data/motion.ts`. A abertura está em `PageMotion.tsx`, e a geometria do V está em `global.css`.

## Verificações executadas

| Verificação                   | Resultado                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                | Aprovado, sem erros ou avisos                                                                                        |
| `npm run build`               | Aprovado; TypeScript estrito e bundle de produção gerados                                                            |
| `npm test -- --reporter=line` | 29 testes aprovados em Microsoft Edge, em aproximadamente 1,8 minuto                                                 |
| `npm run test:production`     | Aprovado: nove seções, quatro projetos, tema, trajetória, foto real, ausência de metadados de captura e CSP no build |
| `npm audit`                   | Nenhuma vulnerabilidade conhecida reportada                                                                          |
| axe WCAG 2 A/AA + 2.1 A/AA    | Nenhuma violação detectada nas quatro combinações de tema claro/escuro e desktop/mobile                              |
| Overflow                      | Ausente após estabilizar o redimensionamento em 320, 390, 768, 1024, 1440 e 1920 px                                  |
| Console e recursos            | Sem erros de JavaScript/console ou respostas HTTP 4xx/5xx nos fluxos auditados                                       |
| Produção                      | Zero requisições externas; fontes e imagens locais, CSP sem WebSocket de desenvolvimento                             |

Além dos novos efeitos, os testes preservam cobertura do menu móvel, Escape e foco, navegação por âncoras, carrossel por botões/teclado/swipe, gesto vertical, multitoque, permissão de zoom por pinça, links seguros, estados vazios e ausência de currículo não fornecido. O teste da foto que falha de propósito confirma o fallback acessível para o monograma.

Uma execução inicial encontrou erro no posicionamento das penas: `quickSetter` de `transform` completo não aplicava as strings ao estilo, agrupando as partículas no canto. A inspeção do DOM confirmou a causa; a posição e a repulsão passaram a escrever diretamente os transforms, mantendo `quickSetter` para rotação. O teste passou depois da correção. Uma medição de overflow imediatamente após resize falhou uma vez; a inspeção a 320 px e o cenário isolado passaram. A asserção agora aguarda o layout estável e a suíte completa passou.

Os avisos de terminal `NO_COLOR`/`FORCE_COLOR` vêm do executor e não do console do site. O servidor de desenvolvimento foi iniciado por `npm run dev` em `127.0.0.1:5173`; a prévia de produção usa `127.0.0.1:4173`.

`npm run format:check` também foi executado e aprovado, sem divergências de formatação.

## Revisão visual e independente

Foram geradas capturas completas em 1440 e 390 px nos dois temas, além de detalhes de Hero, projetos, Welcome e V em diversos frames. Foram inspecionados os quatro Heroes, a abertura desktop escura/mobile clara, o layout estreito de 320 px e os estados intermediários/finais do V. Conferidos enquadramento circular, hierarquia, contraste monocromático, distribuição das penas, ausência de overflow e linha residual nas imagens observadas.

As evidências ficam em `.verification/` e `.verification/update-3/`, fora do bundle e ignoradas pelo Git. A revisão independente não encontrou novo defeito funcional confirmado de lifecycle/StrictMode/cleanup e identificou os metadados públicos da foto, removidos antes do build final.

## Arquivos e componentes da atualização

| Arquivos                                                   | Alteração                                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `src/components/animations/Typewriter.tsx`                 | Novo componente para quatro áreas e alternativa acessível           |
| `src/components/ui/ProfilePortrait.tsx`                    | Novo componente para foto, fallback, halo e giro                    |
| `src/data/motion.ts`                                       | Novos dados e configurações de movimento                            |
| `src/components/animations/PageMotion.tsx`                 | Abertura Welcome coordenada e saída imediata por interação          |
| `src/components/animations/FeatherField.tsx`               | Densidade, tamanhos, simulação da chuva e repulsão                  |
| `src/components/animations/ThemeCut.tsx`                   | Removido para eliminar a linha residual                             |
| `src/app/App.tsx`, `src/app/PreferencesProvider.tsx`       | Remoção da camada e tratamento da transição interrompida            |
| `src/sections/Hero.tsx`, `src/styles/global.css`           | Integração do retrato/digitação, tipografia e estilos responsivos   |
| `public/theme-init.js`, `vite.config.ts`                   | Preparação anterior à pintura e detecção da foto fornecida          |
| `public/images/profile/FotoParaPerfil.png`                 | Foto real com dados de captura removidos da cópia pública           |
| `tests/update-3.spec.ts`, `tests/theme-transition.spec.ts` | Novas verificações funcionais e do V                                |
| `tests/portfolio.spec.ts`, `scripts/verify-production.mjs` | Foto real, sincronização do resize e validação do asset distribuído |
| `README.md`, `docs/validation.md`, plano da atualização    | Instruções, causa, configurações e evidências                       |

## Privacidade da foto

A cópia recebida continha EXIF de data/hora e fuso, sem GPS, além de bytes posteriores ao chunk final do PNG. A cópia pública teve esses dados removidos, preservando os chunks da imagem sem recompressão. O original integral foi conservado **fora do projeto**, em `C:\Users\anton\.codex\attachments\b4d63818-0c6b-429c-82a4-70a066e7e14c\FotoParaPerfil.original.png`. Esse arquivo não entra no Vite nem no bundle.

A foto pública tem 840 × 840 px e 883.506 bytes. Uma versão WebP/AVIF poderia reduzir o download; não foi gerada nesta atualização. A imagem permanece local, sem serviço externo ou dependência adicional. O verificador de produção rejeita metadados EXIF/textuais e dados posteriores ao final do PNG distribuído.

## Limites e materiais pendentes

- Os ensaios usam Edge/Chromium com viewports e touch simulados. Não houve teste em aparelhos físicos, Safari, Firefox ou leitores de tela reais; axe não substitui avaliação humana completa.
- Durante os 1,4 s do V, elementos capturados deixam de receber cliques por comportamento nativo da View Transitions. Isso foi reproduzido com clique real e permanece mesmo com `pointer-events: none`. A [especificação W3C, seção 4.2](https://www.w3.org/TR/css-view-transitions-1/#view-transition-painting-order) descreve essa suspensão. Ao terminar, os controles voltam a responder. A abertura Welcome é independente e pode ser pulada.
- Capturas em frames selecionados e testes funcionais não garantem ausência de qualquer artefato em toda GPU ou navegador. Não foi feito benchmark de FPS em hardware físico.
- Zoom por pinça está permitido pelo CSS, e o multitoque foi testado sinteticamente; não houve pinça em aparelho físico.
- Currículo, screenshots reais dos projetos, repositórios, certificados e eventos continuam aguardando material verdadeiro. A foto já foi fornecida e integrada. Arquivos opcionais exigem reiniciar o Vite ou gerar novo build.
- Links externos foram preservados e verificados estruturalmente, sem enviar mensagens. Disponibilidade futura dos serviços/perfis e validade do convite Discord não são garantidas.
- Cabeçalhos de `public/_headers` precisam ser configurados no host caso ele não interprete esse arquivo. Nenhuma publicação foi realizada.

## Atualização de 23/10/2026 — contador, Instagram e Open Graph

Esta seção registra a validação desta atualização; os resultados acima pertencem à entrega anterior.

### Fonte, métrica e persistência

Identificado `@vercel/analytics` 2.0.1. A montagem duplicada em `App.tsx` foi removida, mantendo a coleta centralizada em `main.tsx`, com condição de produção e exclusão de localhost. A normalização do fim de linha em `main.tsx` não alterou sua lógica.

O conector Vercel confirmou o projeto `portfolio-pessoal` e o domínio de produção verificado `andsonrocha.vercel.app`. A API oficial `/v1/query/web-analytics/visits/count` respondeu com `version`, `query.since/until` e `data.pageviews/visitors`. Nenhuma contagem observada foi copiada para a produção. Nenhum scraping foi utilizado.

A função consulta **visualizações de páginas de produção nos últimos 30 dias de calendário UTC, incluindo hoje**. Não é contador de pessoas únicas nem total acumulado desde a criação do site. O campo público é `metric: pageviews`, `period: last_30_days`. Persistência, coleta e concorrência permanecem sob responsabilidade do serviço existente, sem banco adicional. Retenção, início da coleta e bloqueadores limitam os registros disponíveis.

### Segurança e comportamento

- `/api/visitors` aceita apenas GET, rejeita parâmetros arbitrários e fixa projeto/escopo no ambiente do servidor. Não existe endpoint para incrementar ou definir o total.
- Token exclusivamente server-side, sem prefixo `VITE_`; upstream fixo HTTPS, redirecionamentos recusados e timeout de 5 segundos. Datas da janela e inteiros não negativos são validados. Erros privados são substituídos por resposta genérica 503 sem cache.
- Respostas válidas têm cache CDN de 300 segundos. Isso reduz tráfego, mas não foi implementado rate limiter global ou armazenamento de IP. Cliente consulta somente ao revelar, reutiliza o resultado durante a página atual e não faz polling.
- Estado oculto retira o número dos textos visuais, `aria-label`, descrição e tooltip; a ocultação é uma preferência visual, não controle de acesso à métrica pública. Não persiste em armazenamento do navegador.
- Eye/EyeOff, máscara, loading, indisponibilidade, nova tentativa, zero confirmado, Intl pt-BR, botão de 44 px de altura, foco e teclado. Números extremos usam reticências sem deslocar o tema, mantendo valor completo no nome acessível/tooltip. Animação de 200 ms respeita pausa e movimento reduzido.
- Instagram adicionado com ícone oficial monocromático, nome `@andsonzy`, nova aba e `noopener noreferrer` via `ExternalLink`. Os cinco contatos anteriores foram preservados.

### Prévia de compartilhamento

`public/og-image.png`: **1200 × 630 pixels, PNG, 643.661 bytes**. Imagem única, monocromática, tipográfica, com nome, Full Stack/UX/UI, UFERSA, monograma AR e domínio. A foto real não foi alterada. Favicon AR preservado. Gerada pela ferramenta integrada ImageGen e exportada nas dimensões solicitadas; o original permanece fora do projeto. Prompt registrado no plano desta atualização.

`index.html` inclui title, description, canonical, Open Graph, dimensões/alt/type da imagem e Twitter `summary_large_image`. URLs absolutas usam o domínio confirmado. Esses metadados estão no HTML inicial e no build, sem depender de React ou SSR.

O PNG foi inspecionado no tamanho final e em miniatura de 320 × 168. Nome e composição permanecem legíveis; os textos secundários ficam naturalmente menores. HTTP local de produção retornou **200** e **image/png**, com bytes iguais ao arquivo distribuído em `dist/og-image.png`.

### Verificações executadas nesta atualização

| Verificação                | Resultado                                                                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`             | Aprovado, sem erros ou avisos                                                                                                                                           |
| `npm run build`            | Aprovado, incluindo TypeScript da API e arquivos do servidor                                                                                                            |
| `npm test`                 | **50 testes aprovados** em Microsoft Edge, 2,3 minutos                                                                                                                  |
| `npm run test:production`  | Aprovado: bundle, CSP, nove seções, quatro projetos, tema, foto, imagem OG por HTTP, metadados e Instagram; sem erros de console ou requisições externas no fluxo local |
| API com upstream simulado  | Janela UTC, Bearer server-side, cache, método, configuração ausente, payload inválido, janela incompatível, erro/timeout simulado e zero confirmado                     |
| UI do contador             | Máscara inicial, nenhuma consulta antecipada, loading, pt-BR, teclado, ocultar/revelar, recarga oculta, erro, retry e zero confirmado                                   |
| Responsividade e axe       | Cabeçalho em 320, 390, 1200 e 1440 px, ambos os temas, número máximo inteiro seguro, foco real por Tab; nenhuma violação axe nesses cenários                            |
| Regressão visual/funcional | Suíte preserva menu, swipe, foco, zoom permitido, penas, pausa, redução, foto, abertura e transição em V; auditoria geral sem overflow entre 320 e 1920 px              |
| API local sem configuração | HTTP 503 genérico; POST retorna 405                                                                                                                                     |
| Bundle do navegador        | Sem nomes de token server-side, segredo de teste ou endpoint privado da API Vercel                                                                                      |
| Revisão independente       | Nenhum problema concreto remanescente identificado na API, componentes, segurança ou OG                                                                                 |

Os testes automatizados usam respostas controladas apenas nos arquivos de testes; esses valores não entram no conteúdo de produção. O ensaio de timeout da API simula rejeição da requisição, sem esperar um timeout real de rede da Vercel. Os testes locais não comprovam execução da nova Function no host.

`npm run format:check` foi executado após atualizar os relatórios e aprovado. As divergências iniciais de formatação foram corrigidas.

Capturas: `.verification/social/`, incluindo cabeçalho e contatos nos dois temas e miniatura OG. Inspecionados visualmente cabeçalhos mobile/desktop e contatos claro/escuro. Nenhuma nova dependência foi instalada. Ajustes feitos durante a validação: ícone Instagram passou para React Icons (a versão instalada do Lucide não exporta esse ícone); nome acessível passou a incluir o valor visível; teste de foco passou a usar navegação real por Tab; validação da CSP respeita a origem Vercel Insights que já constava do HTML.

### Arquivos criados e modificados

| Estado      | Arquivos                                                                                      | Finalidade                                             |
| ----------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Criados     | `api/visitors.ts`, `server/visitors.ts`, `server/visitors-plugin.ts`                          | Function, consulta oficial e adaptador local           |
| Criados     | `src/components/ui/VisitorCounter.tsx`, `src/lib/visitor-metric.ts`                           | Interface e contrato validado                          |
| Criados     | `.env.example`                                                                                | Nomes e configuração server-side sem segredo           |
| Criados     | `public/og-image.png`                                                                         | Imagem social personalizada                            |
| Criados     | `tests/visitor-counter.spec.ts`, `tests/visitors-api.spec.ts`, `tests/social-preview.spec.ts` | Cobertura funcional, API, acessibilidade e metadados   |
| Criado      | `docs/superpowers/plans/2026-10-23-counter-instagram-social.md`                               | Plano, decisões e prompt da imagem                     |
| Modificados | `src/components/navigation/Header.tsx`, `src/styles/global.css`                               | Posição do contador e estabilidade responsiva          |
| Modificado  | `src/data/contacts.ts`                                                                        | Instagram, preservando contatos anteriores             |
| Modificado  | `src/app/App.tsx`                                                                             | Remoção da segunda montagem do Analytics               |
| Modificados | `vite.config.ts`, `tsconfig.node.json`                                                        | Adaptador local e verificação dos arquivos server-side |
| Modificado  | `index.html`                                                                                  | Open Graph, canonical e Twitter Card                   |
| Modificado  | `scripts/verify-production.mjs`                                                               | Verificação do PNG/HTML distribuído, Instagram e CSP   |
| Modificados | `README.md`, `docs/validation.md`                                                             | Configuração, evidências e limitações                  |

### Pendências reais

1. Configurar **`ANALYTICS_READ_TOKEN`** e **`ANALYTICS_PROJECT_ID`** no ambiente server-side da Vercel; `ANALYTICS_TEAM_ID` é opcional conforme escopo do token. Valores não secretos e instruções exatas estão no README e `.env.example`. A autenticação do conector não é uma credencial disponível para a aplicação.
2. Após autorização, publicar os arquivos e testar `/api/visitors` com a credencial real no host. Até configurar, o contador mostra indisponibilidade ao revelar.
3. Após deploy, validar HTTP 200, `image/png` e acesso público de `https://andsonrocha.vercel.app/og-image.png`. **A URL pública retornou 404 antes do deploy**, como esperado para um arquivo novo ainda local.
4. Inspecionar a URL no Facebook/LinkedIn e testar cartões efetivos em WhatsApp, Discord e Telegram, renovando caches quando necessário. Esses testes não foram realizados e não são declarados aprovados.

Nenhum serviço pago ou banco foi criado, nenhuma variável remota alterada, nenhum deploy, commit ou push realizado. Permanecem os limites de testes simulados em Edge e ausência de avaliação em aparelhos físicos/leitores de tela reais.

## Atualização de 23/10/2026 — expansão do portfólio e correção do contador

### Diagnóstico e fonte real

O endpoint publicado `https://andsonrocha.vercel.app/api/visitors` respondeu HTTP 500 `FUNCTION_INVOCATION_FAILED`, antes de entregar JSON. O builder oficial `@vercel/node` reproduziu uma falha de importação: o artefato gerava `server/visitors.js`, enquanto `api/visitors.js` ainda importava `../server/visitors.ts`. A importação foi corrigida para `.js`, e o `tsconfig.json` raiz passou a incluir tipos Node exigidos pelo builder. Também faltava `ANALYTICS_READ_TOKEN` no projeto no início da investigação. O proprietário configurou o token privadamente para produção e desenvolvimento; `ANALYTICS_PROJECT_ID` e `ANALYTICS_TEAM_ID` foram adicionados aos mesmos alvos. `.env.local` contém a configuração local e permanece ignorado pelo Git. Nenhum valor secreto foi impresso ou inserido em `VITE_*`.

A função existente agora usa `data.visitors` da API oficial `/v1/query/web-analytics/visits/count`. O contrato público é `metric: estimated_unique_visitors`, `period: last_30_days`, `since`, `until`, `updatedAt` e `total` validado. A janela inclui 30 dias de calendário UTC, contando hoje. A Vercel renova sua identificação anônima após 24 horas, então o agregado é uma estimativa e a mesma pessoa pode ser contada novamente no período. A coleta e persistência global pertencem ao Web Analytics; não há incremento público ou banco adicional.

O servidor registra somente códigos de diagnóstico para falta de configuração, autenticação/permissão, 429, outros status upstream, JSON inválido, formato inválido e falha de rede. O cliente recebe apenas 503 genérico e `Retry-After: 30`. GET sem parâmetros é o único método de leitura; timeout de 5 s, redirecionamento proibido, cache CDN de 300 s e cache curto por instância com agrupamento de consultas simultâneas limitam chamadas redundantes. Esse cache não é um rate limiter global. A UI mantém EyeOff e máscara inicial, carrega sob demanda, formata em pt-BR, esconde novamente e oferece **Tentar novamente** no erro.

### Evidência do fluxo real e limite de produção

Após reiniciar Vite, `GET http://127.0.0.1:5173/api/visitors` respondeu **HTTP 200** com inteiro válido, período e métrica esperados. Um teste de Edge sem interceptação confirmou que o botão revelou o mesmo agregado formatado e voltou à máscara, sem erro de página. O pacote compilado pelo builder oficial `@vercel/node` importou o handler e consultou a API real com `.env.local`, obtendo resposta válida. O artefato compilado sem configuração retornou 503 controlado. Esses ensaios não comprovam o deployment.

O endpoint público continuou retornando **HTTP 500 `FUNCTION_INVOCATION_FAILED`** após a correção local e a configuração das variáveis, pois o deployment atual ainda executa código anterior. Um novo deploy autorizado é necessário para validar a Function e o componente na produção. Não foi feito deploy ou push.

O proprietário realizou um redeploy em 24/10/2026 UTC. A Vercel o marcou `READY` (`dpl_EcXVrmNYD4TDHu2dARc886FGpVkY`), mas a origem Git permaneceu no commit `0b50eb0c00f5a1deb709f9e4401e877fb836dad4`, que antecede estas alterações locais. A URL canônica `/api/visitors` continuou em HTTP 500 após esse redeploy, enquanto `/og-image.png` passou a responder HTTP 200 com `image/png`, 1200 × 630 px e 643.661 bytes. O código corrigido ainda precisa entrar em um deployment para validar o contador remoto.

No Edge, o site público confirmou o mesmo limite de ponta a ponta: após clicar no olho, a requisição `/api/visitors` respondeu 500 e o botão exibiu **“Visualizações Indisponível”**, interface do commit antigo. Isso distingue o deployment `READY` do funcionamento efetivo da Function.

### Conteúdo e movimento

`src/data/projects.ts` contém cinco itens: Entre Mitos e Raízes, Ame-Pet, Sistema Restaurante Dividão, SAPO e Portfólio Pessoal. Clínica foi removida do conteúdo público e seu SVG conceitual foi retirado. Ame-Pet e Dividão são identificados como acadêmicos, colaborativos e de terminal; descrições e links foram conferidos nos repositórios dos projetos. [Ame-Pet](https://github.com/gabrdsp/Ame-Pet/tree/0af63f26d2f2e7cc1f76bf2a02e2ef508dfab5f1) foi inspecionado no SHA `0af63f2`; `MenuCompraAdocao.java` confirma Strategy, enquanto Factory e Observer ficaram de fora por falta de evidência estrutural. [Restaurante Dividão](https://github.com/Mayconsmy/Sistema-de-Gerenciamento-de-Pedidos-para-Restaurante/tree/c5adae206062df3c4521b96747dcd48d81e6b9c1) foi inspecionado no SHA `c5adae2`; `cardapio.c`/`pedidos.c` confirmam CRUD, estados e alocação dinâmica. Os novos SVGs são ilustrações conceituais monocromáticas, não screenshots. O carrossel deriva cinco indicadores do array.

A experiência de desenvolvimento para acessibilidade digital aparece como **Em desenvolvimento**, sem data, organização, cargo ou resultado inventado. O texto Sobre Mim foi atualizado em primeira pessoa. Python e Node.js aparecem nas habilidades, com Node.js identificado como ambiente de execução. A foto gira 720° no eixo Y, com duas faces circulares, desaceleração e halo em camada separada. Três faixas reutilizáveis aparecem antes de Habilidades, Projetos e Contato, com alternativa estática e pausa/redução de movimento. O relógio do rodapé usa `Intl.DateTimeFormat`, `America/Fortaleza`, hora real e atualização por segundo.

### Verificações desta atualização

- `npm run lint`, `npm run build` e `npm run format:check`: aprovados na versão local final.
- `npm test`: **57 testes aprovados** no Edge em 2,6 minutos. Cobre cinco projetos, experiências, relógio, faixas, giro repetido, acessibilidade e responsividade, carrossel, abertura, penas, tema e corte em V. Testes de API com respostas controladas cobrem erros, cache, concorrência, validação e virada UTC; a consulta real foi validada separadamente.
- `npm run test:production`: aprovado no build servido por `vite preview`; nove seções, cinco títulos, tema, CSP, foto pública sem metadados, Open Graph, Instagram e ausência de erros de console/requisições externas no fluxo oculto.
- `GET /api/visitors` no Vite e no preview: **HTTP 200** com métrica `estimated_unique_visitors` e intervalo válido, usando o token local sem expô-lo. O navegador revelou e ocultou o mesmo agregado tanto no desenvolvimento quanto no preview.
- Empacotamento `@vercel/node` 27.0.1 com TypeScript 6.0.3/Node 24: o artefato importou `server/visitors.js`, respondeu 503 sem configuração e consultou o Analytics real com `.env.local`, retornando dados válidos.
- Segurança: `.env.local` ignorado pelo Git; comparação privada confirmou que o valor do token e o endpoint administrativo da Vercel não aparecem em `dist/`.
- Inspeção visual em Edge: capturas desktop/mobile de ambos os temas para cabeçalho, projetos novos, experiências e rodapé; layout monocromático, textos legíveis e sem overflow nos tamanhos ensaiados. Axe não encontrou violação nas configurações automatizadas testadas. Não houve ensaio em aparelho físico ou leitor de tela real.
- Produção atual: **não aprovada para o contador**. O redeploy do commit antigo segue em HTTP 500 e mostra “Visualizações Indisponível”. A imagem OG já responde HTTP 200, `image/png`, 1200 × 630. Nenhum cartão de rede social foi testado diretamente.

## Atualização de produção — 24/10/2026 UTC

O proprietário publicou um novo deployment, agora ligado ao commit `025a4a9b509dfed768f9404f10c02cf78e83d64a` (`dpl_3vZUDP3TZAsEre1SLAQabGhZomq2`). O domínio canônico confirmou `GET /api/visitors` em **HTTP 200** com JSON válido, métrica `estimated_unique_visitors` e período `last_30_days`. A resposta observada tinha `updatedAt` `2026-10-24T01:16:42.658Z`; nenhum total foi gravado em código. Duas requisições GET posteriores retornaram HTTP 200 com `X-Vercel-Cache: HIT` e `Age: 76`, confirmando cache da Vercel.

Teste automatizado no Microsoft Edge contra o domínio publicado, sem interceptar a API: o contador começou mascarado; ao clicar, fez uma requisição que respondeu 200 e apresentou o valor formatado; o segundo clique ocultou o valor; após recarregar, voltou mascarado. Não houve `pageerror`. No mesmo smoke test público, foram confirmados nove seções, cinco projetos na ordem definida, três faixas, experiência de acessibilidade, Python, Node.js, relógio formatado, Instagram e remoção pública da Clínica.

Conclusão atual: contador validado ponta a ponta em desenvolvimento, preview local e produção no deployment acima. O HTML público retornou 200 e inclui title, `og:title`, URL absoluta de `og:image` no domínio real, `twitter:card=summary_large_image` e canonical correto. A imagem Open Graph está acessível em 200 com `image/png`, 1200 × 630 e bytes compatíveis com o build. A abertura do Facebook Sharing Debugger foi limitada por HTTP 429 e o LinkedIn Post Inspector não retornou conteúdo de inspeção; não houve compartilhamento efetivo em WhatsApp/Discord/Telegram. Portanto, o HTML e o asset estão verificados, mas a aparência do cartão nessas plataformas permanece sem confirmação. Também não houve teste físico ou com leitor de tela real.
