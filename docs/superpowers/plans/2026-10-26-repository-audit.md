# Auditoria e otimização do repositório

> Execução nativa com revisão final. Autorização: pedido de auditoria completa de 26/10/2026, com implementação incremental e autonomia.

**Objetivo:** eliminar desperdícios comprovados e melhorar estabilidade e entrega sem mudar conteúdo, aparência ou funcionalidades.

**Arquitetura:** preservar React/Vite, os nove blocos da página, GSAP, o adaptador local e a Vercel Function. Não reorganizar diretórios nem adicionar dependências à aplicação. Relatório em `docs/repository-audit.md`; inventário detalhado e evidências locais em `.verification/audit/`.

## Restrições

- Preservar foto original, composição monocromática, abertura, penas, tema em V, carrossel, dados e links reais.
- Não alterar segredos, infraestrutura, publicar, fazer push ou descartar arquivos locais.
- Excluir apenas legados com referências verificadas; manter documentação histórica e artefatos locais ignorados.
- Comparar pixels ao converter imagens; manter Open Graph em PNG com URL estável.
- Não instalar ferramentas de auditoria no manifesto da aplicação.

## Etapas e evidências

- [x] Registrar Git inicial; inventariar fontes, configuração, dados, assets, testes, scripts e documentação.
- [x] Executar baseline: lint, build, 75 testes e formatação. Registrar bundle e auditoria npm.
- [x] Medir recursos, carregamento e memória com o build inicial; analisar dependências, grafo de imports e referências públicas.
- [x] Validar e remover `scripts/generate-feathers.mjs` e a capa conceitual antiga `public/images/projects/mitos.svg`.
- [x] Converter foto/capa para WebP lossless somente se menores, atualizar configuração/referências/testes e verificar igualdade de pixels e metadados.
- [x] Avaliar a reducao SVG/PNG apenas sem mudança geométrica ou de pixels comprovada.
- [x] Restringir a detecção Tailwind a `src/` e `index.html`, evitando CSS derivado de testes, planos e ferramentas; comparar capturas e build.
- [x] Criar teste de ciclo de vida para listeners de pular a abertura, observar falha e removê-los após o fim da abertura.
- [x] Criar testes para cache CDN na virada UTC e cooldown de erros; observar falha e corrigir o reader sem expor credenciais ou esconder diagnóstico.
- [x] Repetir métricas de recursos e memória em condições equivalentes; comparar desktop/mobile e claro/escuro.
- [x] Executar lint, build, suíte completa, formatação e verificador do preview de produção. Verificar API real e ausência de segredo no bundle sem imprimir valores.
- [x] Atualizar README, AGENTS somente se necessário e `docs/validation.md`; entregar relatório com classificação de cada área e limitações.

## Revisão

Verificar caminhos opcionais de foto/currículo, import `.js` da Function, novas tentativas após erro, UTC/cache, limpeza de contextos/listeners/timers, foco dos dialogs, CSP, imagens públicas, metadados e fonte real do contador. Não remover testes, estilos de estados vazios ou assets referenciados indiretamente.

## Limpeza temporaria

- [ ] Remover `.verification/audit-tools/` e `.verification/function-fixture-audit/`: revisao automatica rejeitou a exclusao com "blocked by policy" mesmo com caminhos conferidos. Mantidos ignorados e fora do build; nao contornar o bloqueio.
