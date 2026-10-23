# Portfólio Andson Rocha — especificação

Fonte: objetivo completo fornecido pelo usuário em `goal-objective.md`, lido antes da implementação.

## Resultado

Portfólio local para apresentar a formação de Andson Rocha na UFERSA, seus quatro projetos, habilidades e contatos. Não publicar nem executar push. Diretório inspecionado: vazio, sem repositório Git ou instruções ancestrais.

## Direção

Minimalismo editorial monocromático. Space Grotesk nos títulos e Manrope na interface, ambas hospedadas localmente. Hero assimétrico, nome grande à esquerda, foto circular ou monograma AR à direita. Régua de navegação, separadores finos, títulos numerados, bastante espaço negativo. Cada seção tem composição própria. Penas detalhadas em SVG são o motivo orgânico central.

## Arquitetura

SPA estática em React/TypeScript/Vite e Tailwind v4, sem backend, formulários, analytics ou segredos. Dados tipados em `src/data`. Nove seções semânticas. Componentes separados para navegação, tema, penas, carrossel, timelines, links e monograma.

## Interações

GSAP para entrada, penas contínuas, seção e carrossel. Controles para pausar movimento; preferência do sistema respeitada. Tema persistido, padrão escuro. View Transitions revela a interface inteira por um polígono V em 1,4s, com linha central descendente; fallback aplica o tema imediatamente. Trocar tema não remonta a página. Carrossel sem autoplay: setas, indicadores, swipe horizontal e teclado. Menu móvel usa diálogo nativo com foco e Escape. Timelines usam detalhes expansíveis nativos.

## Integridade

Apenas dados fornecidos. Nenhum certificado, evento, cargo ou SGBD inventado. Projetos usam ilustrações conceituais identificadas. Links de repositório ausentes são omitidos. Currículo e foto são descobertos pelo Vite apenas se os arquivos locais existirem. Links HTTPS externos isolados com noopener/noreferrer; URLs editáveis validadas. Documento inclui CSP adequada à aplicação estática, sem scripts remotos, eval ou dados privados.

## Evidência

Lint e build obrigatórios. Playwright em Edge verifica desktop/mobile, tema e persistência, fallback, teclado/swipe, menu, contatos, arquivos opcionais, ausência de erros e overflow. Axe valida acessibilidade. Inspeção visual em ambos os temas e tamanhos. Revisão final das dependências, links e bundle.
