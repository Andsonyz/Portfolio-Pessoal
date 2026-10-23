# Contador, Instagram e prévia social — plano

> Execução: inline, autorizada pelo pedido de implementação. Revisão independente ao final. Não criar infraestrutura, publicar, fazer push ou sobrescrever mudanças locais.

**Objetivo:** acrescentar contador real com privacidade visual, Instagram e Open Graph ao portfólio existente.

**Arquitetura:** função Vercel Node somente leitura consulta a API oficial Web Analytics e entrega apenas um agregado validado ao navegador. A métrica será visualizações nos últimos 30 dias de calendário UTC, incluindo hoje. A UI começa oculta e consulta somente ao revelar. Persistência e concorrência pertencem ao Analytics já configurado, sem um segundo contador/banco. Open Graph estático no HTML inicial, domínio confirmado na Vercel: `https://andsonrocha.vercel.app`.

**Stack:** React/TypeScript/Vite existentes, fetch nativo, Lucide, Vercel Functions, Playwright. Sem nova dependência de runtime planejada.

**Especificação:** pedido integral do usuário nesta conversa (23/10/2026).

## Evidências da inspeção

- `@vercel/analytics` 2.0.1 instalado e componente configurado. Nenhum backend ou armazenamento no repositório.
- Projeto `portfolio-pessoal`, domínio de produção confirmado pelo conector. API oficial `/v1/query/web-analytics/visits/count` respondeu com campos `data.pageviews`, `data.visitors` e `query.since/until`.
- Não copiar contagens observadas para o código. O endpoint consultará os dados atuais.
- Sem credencial de API no ambiente local. Documentar configuração server-side; não criar token ou alterar infraestrutura sem autorização.
- `src/main.tsx` tem alteração local prévia; preservá-la. Também preservar a CSP editada pelo usuário.

## Etapas

1. [x] Testes de contador: máscara inicial, loading, pt-BR, ocultar/recarregar, zero confirmado, erro, payload inválido, teclado e número grande. Testes da função: método, configuração ausente, contrato, falhas, timeout simulado, cache e ausência de vazamento de segredos.
2. [x] Implementar função `/api/visitors`, contrato compartilhado, cache de cinco minutos e variáveis somente server-side. Sem endpoint de gravação pública; sem IDs pessoais, cookies adicionais ou fingerprinting.
3. [x] Implementar `VisitorCounter`, integrar ao lado do tema e ajustar somente espaçamento necessário no cabeçalho. Inserir Instagram em `contacts.ts`.
4. [x] Criar imagem original 1200×630 e inspecionar em miniatura; configurar OG/Twitter/canonical no `index.html` com domínio real, sem SSR.
5. [x] Rodar lint/build/test/format, validar API com upstream simulado e UI desktop/mobile claro/escuro, confirmar asset no build e HTTP local. Não confundir mocks de teste com dados de produção. Formatação final conferida após atualizar os relatórios.
6. [x] Revisão independente, correções e README/validation com resultados e limites. URLs novas e cartão nas plataformas só podem ser verificados após deploy autorizado.

## Decisões

- Reutilizar a API oficial comprovadamente disponível; alternativa com banco não é necessária.
- Visualizações, não visitantes únicos: sem prometer deduplicação de pessoas em uma janela de 30 dias.
- Ausência de configuração ou falha upstream resulta em indisponibilidade, nunca zero inventado.
- A visibilidade não persiste e a UI não faz polling. Cache limita tráfego; não usar IPs para rate limiting nem introduzir rastreamento adicional.
- Imagem tipográfica monocromática, sem alterar o retrato real. Preservar monograma e fontes do portfólio na direção visual.

## Imagem — prompt final e ferramenta

Ferramenta integrada ImageGen, geração nova sem referências fotográficas. Imagem gerada em 1730×909, exportada em 1200×630 por redimensionamento de alta qualidade para atender ao formato solicitado. Arquivo final: `public/og-image.png`. Original preservado em `C:\Users\anton\.codex\generated_images\01a16126-38ab-7a41-80be-3c019a9897d0\exec-fe26e469-3626-4693-9121-dd5600ee7d08.png`.

```text
Create a finished professional Open Graph social-sharing banner for Andson Rocha's personal portfolio. EXACT output size 1200 x 630 pixels, landscape ratio 1.90476:1. Strict black, white and neutral gray only. Pure minimal Swiss editorial typographic graphic design, asymmetric composition. Matte near-black background; enormous bold elegant modern grotesk white name on left, two lines: 'Andson' then 'Rocha', generous whitespace. Smaller perfectly legible exact Portuguese secondary text below: 'Desenvolvimento Full Stack • UX/UI Design'. Beneath it: 'Tecnologia da Informação | UFERSA'. Small domain 'andsonrocha.vercel.app' in footer. On right, a sophisticated geometric interlocking AR monogram in thin white lines and a restrained abstract thin feather contour, balanced quiet negative space. Subtle thin horizontal dividing rule above footer. Top-left small uppercase PORTFÓLIO. Legible at thumbnail size, clean flat vector-like typography rendered as PNG, absolutely no colored accents, no gradients, no mockup framing, no photos, no shadows, no glowing effects. All essential content within 65px safe margins; name dominates. Precise spelling. A single finished image.
```
