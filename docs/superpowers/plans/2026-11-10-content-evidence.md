# Certificados, trajetória e seleção de projetos

**Objetivo:** integrar os oito anexos e revisar os repositórios públicos, preservando conteúdo confirmado, privacidade e a interface existente.

**Arquitetura:** dados tipados em `src/data`; três cursos em Certificações e cinco registros em Eventos. A trajetória começa com JavaScript em 2023. Cinco projetos recebem o carrossel; os demais ficam em lista compacta, com os painéis de detalhes existentes preservados. Sem dependências novas de produção, push ou deploy.

**Decisão:** executar diretamente, conforme autonomia já solicitada. Não divulgar CPF/matrícula dos anexos. Preservar arquivos originais em Downloads; publicar derivados identificados com dados pessoais ocultados, sem alegar assinatura original. Não presumir validação remota dos certificados nem implantação dos projetos.

## Etapas

- [x] Conferir texto e renderização dos oito anexos; separar data da atividade da emissão; registrar fontes e seleção dos 13 repositórios públicos.
- [x] Adicionar testes de cursos, eventos, trajetória anterior à faculdade, hierarquia dos projetos e documentos públicos; confirmar falhas antes da implementação.
- [x] Cadastrar três cursos e cinco eventos; criar links de comprovação com instruções de validação; adicionar marco de 2023. Gerar e conferir derivados públicos dos PDFs sem CPF/matrícula.
- [x] Ampliar dados de projetos com Pedidos, Dashboard, Catálogo e Site institucional; destacar cinco no carrossel e manter os demais em lista de nomes/links com detalhes opcionais existentes. Não expor o repositório privado de acessibilidade.
- [x] Atualizar regressões afetadas pela seleção, testar teclado, swipe, foco, temas, telas pequenas e PDFs HTTP/MIME.
- [x] Executar lint, build, testes, formatação e verificação de produção. Registrar resultados e limitações no README e em docs/validation.md.

## Verificação prioritária

- Dados certificados devem refletir o período de atividade, não a emissão em novembro de 2026.
- Evento Semana de Ciências: 4 horas como membro; evento com 30 horas totais.
- CPF/matrícula não podem permanecer no texto nem nos objetos dos PDFs públicos; imagens renderizadas devem continuar legíveis.
- Links privados/duplicações/README vazio não devem ganhar destaque indevido.
- Detalhes preservam Escape, bloqueio de rolagem e retorno de foco; novas listas não podem causar overflow.

## Decisões e correções verificadas

- Usuário confirmou os cinco destaques propostos; demais trabalhos mantêm detalhes e estudos menores recebem somente nomes/links.
- Códigos/números de validação também foram ocultados nas cópias e omitidos do frontend para evitar uma possível recuperação do original com dados pessoais. Portal oficial e orientação de solicitar original permanecem.
- Testes iniciais reproduziram ausência dos novos dados; teste visual automatizado reproduziu colisão de datas/títulos nos eventos mobile.
- Corrigida expansão indevida da grade da trajetória em 320 px com `minmax(0, ...)` e quebra de palavras. Datas dos eventos ficam acima dos títulos no mobile.
- Corrigido nome acessível dos links GitHub para conter o texto visível, conforme achado do axe.
- Uma execução intermediária teve falhas `ENOENT` de traces causadas por duas execuções Playwright usando a mesma pasta de resultados. A execução final deve ser isolada, sem alterar testes para mascarar falhas.
- Revisão independente: dados/fontes conferidos e nenhum identificador dos originais encontrado nos PDFs públicos, inclusive em streams descomprimidos. Nenhuma dependência de produção adicionada.
- Resultado final: lint, build, formatação e verificação de produção aprovados; 85 testes aprovados em 4,5 minutos. Não houve push ou deploy.
