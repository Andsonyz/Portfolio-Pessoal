# Orientações do projeto

## Escopo e identidade

- Este é o portfólio pessoal de **Andson Rocha**, graduando em TI na UFERSA, campus Pau dos Ferros/RN.
- Preserve a interface estritamente monocromática: preto, branco e cinzas neutros. Nunca adicione cores decorativas, gradientes coloridos, barras de domínio fictícias ou frameworks visuais prontos.
- Mantenha as nove seções, a composição editorial assimétrica, o monograma AR, as penas orgânicas e a transição de tema em V.
- Não invente dados pessoais, cargos, SGBDs, certificados, eventos ou datas. Dados ainda não fornecidos ficam ausentes ou com estado vazio.
- Não publique nem execute push sem autorização explícita do usuário.

## Desenvolvimento

- React + TypeScript estrito + Vite + Tailwind CSS v4. GSAP e `@gsap/react` para movimento. Use componentes funcionais e dados centralizados em `src/data`.
- Preserve a separação entre conteúdo, componentes de apresentação, preferências e helpers. Evite dependências sem necessidade.
- Mantenha português brasileiro nos textos e nomes acessíveis. Cuidado com UTF-8 no PowerShell.
- Faça cleanup de animações e listeners. Respeite `prefers-reduced-motion` e o controle de pausa. Nunca bloqueie a navegação para exibir uma abertura.
- A troca de tema deve revelar a interface inteira. Preserve o fallback imediato quando View Transitions não existir. Ela não pode reiniciar a abertura.
- Controles precisam funcionar por teclado, ter foco visível e área de toque adequada. Carrossel não pode capturar teclas de controles internos nem bloquear zoom por pinça.
- Foto e currículo dependem de presença real no disco; Vite verifica em `vite.config.ts`, exigindo reinício/build após adicionar esses arquivos. A foto pública usa WebP lossless, com os caminhos PNG/JPG anteriores mantidos como alternativas opcionais.
- Mantenha projetos, experiências, habilidades, faixas e rótulos do relógio centralizados em `src/data`. Não atribua datas aos novos projetos sem confirmação. Node.js é ambiente de execução, não linguagem independente.
- O retrato gira no eixo Y com faces circulares; o halo permanece em camada separada. Faixas pausam por preferência do usuário, movimento reduzido e guia oculta. O relógio usa `America/Fortaleza` e horário real.

## Segurança

- Não coloque segredos, tokens, `.env`, arquivos pessoais privados ou logs em `public/` ou no bundle.
- Use `ExternalLink`/`safeHref` para links editáveis. Nunca use `dangerouslySetInnerHTML` para conteúdo dos dados.
- Mantenha o servidor local restrito a `127.0.0.1` por padrão.
- Preserve a CSP e os cabeçalhos em `public/_headers`. Configuração de produção deve usar cabeçalhos do host quando `_headers` não for suportado.
- O contador lê `data.visitors` da API oficial Vercel somente no servidor. Token `ANALYTICS_READ_TOKEN` nunca entra em `VITE_*`; `ANALYTICS_PROJECT_ID` e `ANALYTICS_TEAM_ID` configuram o escopo. O agregado de 30 dias é estimado, pois a identificação anônima se renova após 24 horas. Não rotule como pessoas únicas definitivas.
- O cache do contador respeita o TTL restante e a virada UTC. Falhas retornam 503 sem cache público, com cooldown de 30 segundos por instância; não tratá-lo como um limite global.

## Verificação

Execute `npm run lint`, `npm run build`, `npm test` e `npm run format:check` após mudanças relevantes. Testes requerem Microsoft Edge ou ajuste explícito do canal em `playwright.config.ts`.

Faça inspeção visual desktop/mobile em ambos os temas ao modificar layout. Verifique navegação móvel, teclado, swipe, foco, zoom, ausência de overflow, animações, pausa, movimento reduzido, arquivos opcionais e erros de console. Não declare testes aprovados sem executá-los.

Atualize README e `docs/validation.md` quando procedimentos ou limitações mudarem. Não mantenha fixtures fictícias no conteúdo de produção.
