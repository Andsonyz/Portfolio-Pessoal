# Andson Rocha — Portfólio pessoal

Portfólio editorial monocromático, desenvolvido do zero em React e TypeScript. Nove seções apresentam a formação na UFERSA, habilidades, experiências acadêmicas, projetos e contatos. Conteúdo não fornecido permanece ausente ou com um estado vazio explícito.

## Executar

Requer **Node.js 22.12+**. Desenvolvimento e validação realizados com Node 24 e npm 11.

```bash
npm ci
npm run dev
```

Acesse **http://127.0.0.1:5173**. O servidor fica limitado à máquina local. Para gerar e inspecionar a versão de produção:

```bash
npm run build
npm run preview
```

A prévia de produção usa **http://127.0.0.1:4173**. O resultado está em `dist/`. A integração com Vercel Web Analytics está preparada para o deployment; esta alteração não executa publicação ou push.

Com a prévia de produção em execução, `npm run test:production` verifica o bundle gerado, os quatro projetos, a política de segurança e a ausência de requisições a terceiros.

## Comandos de qualidade

```bash
npm run lint
npm run build
npm test
npm run format:check
npm audit
```

Os testes usam Playwright com **Microsoft Edge**, instalado neste ambiente. Em outra máquina, instale Edge ou execute `npx playwright install chromium` e altere `channel` em `playwright.config.ts` para `chromium`. Os testes iniciam o Vite automaticamente se não houver servidor na porta 5173. `npm run test:ui` abre a interface dos testes.

Screenshots de verificação são salvos em `.verification/`, ignorada pelo Git. Falhas produzem traces em `test-results/`. O relatório em `docs/validation.md` descreve a validação executada e seus limites.

## Stack

- React 19 + TypeScript 6, com verificações estritas.
- Vite 8 + Tailwind CSS 4 pelo plugin oficial.
- GSAP 3 + `@gsap/react`, com limpeza dos contextos.
- Lucide React e React Icons, sempre monocromáticos.
- Space Grotesk e Manrope variáveis, servidas localmente via Fontsource.
- ESLint 10, Prettier, Playwright e axe-core para desenvolvimento e verificação.

O `package-lock.json` fixa as versões resolvidas; use `npm ci` para reproduzi-las.

## Organização

```text
src/
  app/                 aplicação e provedor de preferências
  components/
    animations/        penas, abertura Welcome e texto digitado
    layout/            rodapé
    navigation/        cabeçalho e menu móvel
    projects/          carrossel acessível
    timeline/          linha do tempo expansível
    ui/                retrato interativo, monograma, títulos e links seguros
  data/                textos, projetos, habilidades, contatos e registros
  hooks/               preferências de tema e movimento
  lib/                 validação dos links
  sections/            nove seções do portfólio
  styles/              fontes locais, tokens, layouts e animações
  types/               contratos de conteúdo
public/
  images/profile/      foto opcional
  images/projects/     quatro ilustrações conceituais em SVG
  images/feathers/     duas penas vetoriais detalhadas
  documents/           currículo e documentos públicos opcionais
  icons/               favicon AR
scripts/               geração determinística das penas locais
tests/                 testes de comportamento e acessibilidade
docs/                  design, plano e relatório de validação
```

## Personalizar o conteúdo

Edite os arquivos de `src/data/`. Nenhuma configuração de conta ou serviço é necessária.

| Informação                                                  | Arquivo             |
| ----------------------------------------------------------- | ------------------- |
| Nome, título, texto sobre, formação, interesses e navegação | `profile.ts`        |
| Categorias e ícones de habilidades                          | `skills.ts`         |
| Experiências acadêmicas e temas de inclusão                 | `experiences.ts`    |
| Quatro projetos, imagens, destaques e links opcionais       | `projects.ts`       |
| Certificados                                                | `certifications.ts` |
| Marcos da trajetória                                        | `timeline.ts`       |
| Eventos                                                     | `events.ts`         |
| E-mail, WhatsApp, GitHub, LinkedIn e Discord                | `contacts.ts`       |

O período acadêmico é um dado informado, não calculado automaticamente. Atualize-o em `profile.ts` ao revisar sua apresentação. Não acrescente cargos, datas, certificados ou instituições sem confirmação.

### Foto

A foto fornecida está em `public/images/profile/FotoParaPerfil.png`, servida pelo caminho `/images/profile/FotoParaPerfil.png`. A cópia pública mantém todos os pixels do PNG original; somente metadados de captura e bytes posteriores ao fim da imagem foram removidos. O original foi preservado fora do projeto, na pasta do anexo da atualização (`FotoParaPerfil.original.png`). O Vite procura, nesta ordem: a foto fornecida, `public/images/perfil.png` e `public/images/profile/andson.jpg`. Ao adicionar, substituir o caminho ou remover uma foto, **reinicie o servidor** ou faça novo build, pois a disponibilidade é verificada em `vite.config.ts`.

A apresentação é circular, responsiva, com `object-fit: cover` e escala de cinza aplicada somente pelo CSS. Falha de carregamento exibe o monograma AR. O botão da foto responde a clique, toque, Enter e Espaço; gira 720° em 1,6 segundo, desacelera e retorna à orientação original. Cliques durante o giro são ignorados. O halo suave acompanha somente mouse fino; pausa e movimento reduzido desativam esses efeitos.

### Currículo

Adicione `public/documents/curriculo-andson-rocha.pdf` e **reinicie o servidor** ou faça novo build. Só então aparece o link “Baixar currículo”. O arquivo nunca é simulado. Revise o documento antes de colocá-lo em `public/`: arquivos desta pasta são públicos na versão distribuída.

### Projetos

Cada registro segue `Project` em `src/types/content.ts`: `id`, `title`, `category`, `description`, `technologies`, `highlights`, `image` e `imageAlt`. `repository` e `liveUrl` são opcionais e devem ser URLs HTTPS reais. Coloque imagens próprias em `public/images/projects/` e use caminhos como `/images/projects/nome.webp`.

Os SVGs atuais são **ilustrações conceituais**, não screenshots de sistemas. Ao substituí-los por capturas reais, atualize o texto alternativo e o `figcaption` em `ProjectCarousel.tsx`. A interface usa escala de cinza para preservar a identidade.

### Certificados

Adicione registros ao array vazio em `certifications.ts`, seguindo `Certification`: `id`, `name`, `institution`, `date`, `category`, `hours?`, `pdf?`, `validationUrl?`. Use apenas informações do certificado. Para PDFs, adicione o arquivo em `public/documents/` e indique seu caminho. O grid aparece automaticamente quando existem registros; links opcionais ausentes não aparecem.

### Eventos

Adicione registros em `events.ts`, seguindo `PortfolioEvent`: `id`, `name`, `date`, `institution`, `location`, `description`, `participation`, `certificate?`. Eles aparecem como linha do tempo com itens expansíveis por clique ou teclado. Sem registros, permanece o estado vazio.

### Trajetória

Adicione marcos em `timeline.ts`, com `id`, `date`, `title`, `description` e `category`. Categorias aceitas: Formação, Projeto, Experiência, Evento, Certificação e Conquista. Apenas o ingresso em **2024.1** foi cadastrado inicialmente. As datas são textos editoriais; ordene os registros conscientemente.

## Aparência e movimento

Os tokens claro/escuro ficam no início de `src/styles/global.css`. Use apenas preto, branco e cinzas neutros. Tipografia: `fonts.css`. O monograma está em `Monogram.tsx` e no favicon `public/icons/monogram.svg`.

- Tema inicial escuro; preferência válida persistida em `localStorage` sob `ar-theme`. Armazenamento bloqueado não impede o uso.
- Corte em V de **1,4 segundo**, aplicado ao snapshot completo com View Transitions. A geometria do próprio V forma o corte; não há uma linha DOM independente. Navegadores sem a API recebem a troca imediata. Movimento reduzido e pausa também usam troca imediata.
- Durante o V, o navegador suspende cliques nos elementos capturados até terminar a transição. Essa limitação nativa dura 1,4 segundo; os controles voltam a responder ao final. A abertura Welcome tem comportamento separado e pode ser pulada imediatamente.
- Welcome com três ícones Lucide, blur e chuva de penas, coordenado por uma timeline GSAP de aproximadamente **3,2 segundos**. A página permanece montada; teclado, clique, toque ou rolagem encerram imediatamente a abertura. Ela se repete no reload, sem reiniciar ao trocar o tema.
- **30 penas no desktop (≥1200 px), 18 no tablet e 10 no mobile (<768 px)**, com larguras de 12–34 px. São brancas no escuro e pretas no claro. Flutuação e repulsão usam transforms sem renderizações React por frame. Mouse fino tem raio de influência de 115 px e deslocamento máximo de 28 px; touch mantém só o movimento natural.
- As quatro áreas do Hero alternam com digitação de 80–94 ms por caractere, apagamento de 42 ms, pausa de 1.500 ms e intervalo de 300 ms. Espaço reservado evita saltos, e leitores de tela recebem a lista completa sem anúncios de caracteres. Redução/pausa mostra um título estático.
- O botão ao lado do tema pausa o movimento. `prefers-reduced-motion` é respeitado e reage a mudanças do sistema.
- Carrossel sem reprodução automática: setas, indicadores, swipe horizontal e teclado. Focando a região do carrossel, use ←/→, Home e End. Gestos verticais e zoom por pinça são preservados.

As quantidades, tamanhos, raio/força de repulsão, tempos da digitação e parâmetros da foto ficam em **`src/data/motion.ts`**. A timeline Welcome fica em `PageMotion.tsx`, e os estilos do corte em V ficam em `global.css`. A assinatura do nome usa **Space Grotesk**, em caixa alta, peso 600 e espaçamento ajustado; Manrope continua nos textos e controles. Nenhuma nova família ou dependência foi instalada nesta atualização.

Para regenerar os SVGs após editar seu desenho: `node scripts/generate-feathers.mjs`.

## Privacidade e segurança

Frontend estático com uma função server-side somente leitura para o contador, sem formulário ou credenciais no cliente. Fontes e ilustrações são locais. A preferência de tema é gravada no navegador. O site publicado inclui Vercel Web Analytics para métricas de visita; os contatos fornecidos são deliberadamente parte do conteúdo público e não são segredos.

### Vercel Web Analytics

`@vercel/analytics` está integrado em `src/main.tsx` por meio de `<Analytics mode="production" />`. O componente é habilitado no build de produção, exceto nos endereços locais `localhost`, `127.0.0.1` e `[::1]`. Assim, `npm run dev` e `npm run preview` local não enviam visitas nem tentam buscar um endpoint inexistente no Vite. Não é necessário colocar token ou ID de projeto no código.

No painel da Vercel, abra o projeto e habilite **Analytics → Enable**. Depois publique um novo deployment contendo esta integração e visite sua URL. Aguarde a atualização do painel; se não houver dados, verifique bloqueadores e a requisição `/_vercel/insights/script.js` na aba Network do navegador. Essa etapa remota não é comprovada pelos testes locais. Consulte a [documentação oficial](https://vercel.com/docs/analytics/quickstart).

O script e os endpoints de coleta usam a mesma origem do deployment, compatíveis com `script-src 'self'` e `connect-src 'self'`. `vercel.json` replica os cabeçalhos de segurança de `public/_headers`, pois a Vercel utiliza sua própria configuração. Mantenha as duas políticas sincronizadas ao alterá-las. Outra hospedagem exige suporte próprio aos endpoints do Analytics ou a remoção/desativação do componente.

O portfólio possui uma única página com seções por âncoras. Navegar para `#projetos` ou `#contato` não representa uma nova página; eventos específicos de cliques não foram adicionados.

Links editáveis aceitam HTTPS, e-mail válido e caminhos locais; protocolos executáveis e URLs com credenciais são omitidos. Links externos usam `noopener noreferrer`. Source maps de produção estão desativados. `.env`, dependências e artefatos de testes são ignorados pelo Git.

Há uma Content Security Policy no HTML. `public/_headers` fornece cabeçalhos adicionais para hosts estáticos compatíveis com esse formato. Em outro host, configure os mesmos cabeçalhos no servidor; Vite não interpreta `_headers`. `frame-ancestors` exige cabeçalho HTTP. CSS inline é permitido para as animações GSAP; scripts inline e `eval` não são liberados na política de produção. O canal WebSocket local é permitido somente para desenvolvimento.

Antes de uma futura publicação, revise arquivos em `public/`, metadados de fotos/PDFs e os contatos que deseja tornar públicos. `VITE_*` nunca deve conter segredos, pois entra no cliente. Revalide o convite do Discord, que pode expirar. A verificação automatizada não garante ausência absoluta de vulnerabilidades.

Referências de implementação: [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite), [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) e [GSAP em React](https://gsap.com/resources/React/).

## Contador de visualizações

O cabeçalho contém um contador inicialmente oculto, com EyeOff e máscara. Revelar consulta `GET /api/visitors`; ocultar remove o valor da apresentação e dos textos acessíveis. Não há preferência persistida, polling ou consulta antes do primeiro clique. Uma consulta concluída é reutilizada durante a navegação atual; recarregue a página para atualizar. Falhas mostram **Indisponível**; ocultar/revelar tenta novamente. Zero só aparece quando confirmado pela fonte.

A fonte é a [API oficial de Web Analytics da Vercel](https://vercel.com/docs/rest-api/web-analytics/counts-page-views), consultada no servidor, e não um método do SDK React. A disponibilidade para `portfolio-pessoal` foi confirmada pelo conector em 23/10/2026. A métrica é **visualizações de páginas de produção nos últimos 30 dias de calendário UTC, incluindo hoje** (`pageviews`, `last_30_days`). Não representa pessoas únicas, nem acessos de toda a vida do site. A janela começa à meia-noite UTC de 29 dias atrás e termina à meia-noite de amanhã; o dia atual está incompleto. Retenção, início da coleta, bloqueadores e disponibilidade da conta limitam os registros disponíveis. Âncoras da mesma página não são novas páginas.

A coleta e persistência continuam sob responsabilidade do Vercel Web Analytics e sobrevivem a deploys. Não há banco adicional, incremento pelo cliente ou endpoint de gravação. O endpoint público mostra somente o agregado e as datas da janela. Cache CDN de cinco minutos reduz consultas; não equivale a um rate limiter global. O cliente não escolhe projeto, filtros ou período. Métodos de escrita e parâmetros são rejeitados; token, detalhes dos erros upstream e dados individuais não são devolvidos. Timeout no servidor: 5 s; cliente: 6,5 s. Não foram adicionados cookies, IDs pessoais ou fingerprinting.

### Configuração pendente do contador

No projeto **portfolio-pessoal**, configure variáveis **server-side** na Vercel antes do próximo deploy autorizado:

| Variável               | Valor/configuração                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANALYTICS_READ_TOKEN` | Token Vercel válido com acesso ao Web Analytics desse projeto. Use o menor escopo e prazo disponíveis; nunca o prefixo `VITE_`, Git ou `public/`. |
| `ANALYTICS_PROJECT_ID` | `prj_9w2OD5NidVXvsfk0Ih8uGjngq25l` (também aceita o nome `portfolio-pessoal`).                                                                    |
| `ANALYTICS_TEAM_ID`    | Opcional: `team_LvnPD94kY8IS3GskS8NERCmW` quando necessário para o escopo do token.                                                               |

A autenticação do conector usada na inspeção não é transferida para a aplicação. Nenhum token, variável remota ou serviço foi criado nesta atualização. Sem configuração, a função retorna HTTP 503 com `temporarily_unavailable`; não inventa uma contagem. O token precisa ser configurado apenas nos ambientes em que o endpoint deve funcionar. A API consulta produção mesmo em um preview.

Para desenvolvimento local, copie `.env.example` para `.env.local`, preencha privadamente e reinicie `npm run dev`. O adaptador de `server/visitors-plugin.ts` também atende `npm run preview`. Essas variáveis não entram no bundle do navegador. Na Vercel, `api/visitors.ts` é uma Function Node; em hospedagem puramente estática será necessário oferecer uma função equivalente. Não envie o token em conversas ou tickets.

## Instagram e compartilhamento

Instagram **[@andsonzy](https://www.instagram.com/andsonzy/)** foi acrescentado em `src/data/contacts.ts`, usando ícone monocromático e `ExternalLink`. E-mail, GitHub, LinkedIn, WhatsApp e Discord permanecem.

`public/og-image.png` é uma imagem estável de **1200 × 630 px**, independente do tema, com nome, áreas de atuação, UFERSA e assinatura AR. O favicon AR existente foi preservado. `index.html` contém title, description, canonical, Open Graph e Twitter Card antes de executar JavaScript, sem SSR. Domínio de produção confirmado: **https://andsonrocha.vercel.app/**; imagem absoluta: **https://andsonrocha.vercel.app/og-image.png**.

Depois de um deploy autorizado, verifique a imagem com HTTP 200, `Content-Type: image/png` e acesso sem autenticação. Em seguida use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) e [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) e compartilhe o link no WhatsApp/Discord/Telegram. Serviços mantêm caches independentes; solicite nova inspeção quando necessário. Não foi feito deploy nem teste efetivo do cartão nessas plataformas. A URL pública da nova imagem ainda retornou 404 na inspeção anterior à publicação; os testes locais não substituem essa etapa.
