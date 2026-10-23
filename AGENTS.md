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
- Foto e currículo dependem de presença real no disco; Vite verifica em `vite.config.ts`, exigindo reinício/build após adicionar esses arquivos.

## Segurança

- Não coloque segredos, tokens, `.env`, arquivos pessoais privados ou logs em `public/` ou no bundle.
- Use `ExternalLink`/`safeHref` para links editáveis. Nunca use `dangerouslySetInnerHTML` para conteúdo dos dados.
- Mantenha o servidor local restrito a `127.0.0.1` por padrão.
- Preserve a CSP e os cabeçalhos em `public/_headers`. Configuração de produção deve usar cabeçalhos do host quando `_headers` não for suportado.

## Verificação

Execute `npm run lint`, `npm run build`, `npm test` e `npm run format:check` após mudanças relevantes. Testes requerem Microsoft Edge ou ajuste explícito do canal em `playwright.config.ts`.

Faça inspeção visual desktop/mobile em ambos os temas ao modificar layout. Verifique navegação móvel, teclado, swipe, foco, zoom, ausência de overflow, animações, pausa, movimento reduzido, arquivos opcionais e erros de console. Não declare testes aprovados sem executá-los.

Atualize README e `docs/validation.md` quando procedimentos ou limitações mudarem. Não mantenha fixtures fictícias no conteúdo de produção.
