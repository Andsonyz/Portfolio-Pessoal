# Otimização da rolagem sem alteração visual

Objetivo: reduzir o trabalho de desenho e de animações durante a rolagem, mantendo arquivos SVG, quantidades, tamanhos, desfoque, velocidades, parallax, repulsão e a transição em V.

1. Medir o build atual com rolagem nativa no Edge, desktop/mobile e CPU normal/4×. Registrar amostras, sem prometer resultados em dispositivos físicos.
2. Confirmar o custo de rasterização dos SVGs por comparação controlada com promoção das imagens para composição; consolidar atualizações de transformação por quadro.
3. Suspender somente trabalho fora da tela (digitação e faixas), retomando quando necessário, com observers limpos na desmontagem.
4. Testar preservação de movimento, pausa, temas e navegação; repetir exatamente o perfil de rolagem e executar lint/build/test/format e validação de produção.
5. Documentar resultados e limites. Não publicar nem alterar parâmetros do design.

Concluído: medições antes/depois, três testes de regressão, revisão de código e visual, 73 testes aprovados, lint/build/format e verificação de produção aprovados. Resultados e limites registrados em `docs/validation.md` e `docs/scroll-performance.json`. Sem publicação.
