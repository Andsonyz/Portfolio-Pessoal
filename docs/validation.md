# Relatório de validação — Atualização 3 — 22/10/2026

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
