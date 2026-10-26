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

Com a prévia de produção em execução, `npm run test:production` verifica o bundle gerado, os seis projetos, suas imagens, a política de segurança e a ausência de requisições a terceiros.

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
    projects/          carrossel e painel modal acessível
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
  images/projects/     capas dos projetos (SVG e PNG fornecido)
  images/feathers/     seis SVGs de penas fornecidos pelo proprietário
  documents/           currículo e documentos públicos opcionais
  icons/               favicon AR
scripts/               verificadores de produção e utilitários
tests/                 testes de comportamento e acessibilidade
docs/                  design, plano e relatório de validação
```

## Personalizar o conteúdo

Edite os arquivos de `src/data/`. Para conteúdo e aparência não é necessária outra conta; o contador usa a configuração server-side descrita abaixo.

| Informação                                              | Arquivo             |
| ------------------------------------------------------- | ------------------- |
| Nome, título, texto sobre, formação e navegação         | `profile.ts`        |
| Quatro interesses expansíveis de No meu radar           | `radar.ts`          |
| Categorias e ícones de habilidades                      | `skills.ts`         |
| Experiências acadêmicas e temas de inclusão             | `experiences.ts`    |
| Seis projetos, imagens, detalhes e links opcionais      | `projects.ts`       |
| Certificados                                            | `certifications.ts` |
| Marcos da trajetória                                    | `timeline.ts`       |
| Eventos                                                 | `events.ts`         |
| E-mail, WhatsApp, GitHub, LinkedIn, Discord e Instagram | `contacts.ts`       |

O período acadêmico é um dado informado, não calculado automaticamente. Atualize-o em `profile.ts` ao revisar sua apresentação. Não acrescente cargos, datas, certificados ou instituições sem confirmação. A experiência de acessibilidade em andamento está em `experiences.ts`, sem data inventada; a trajetória só recebe marcos com data confirmada.

### Foto

A foto fornecida está em `public/images/profile/FotoParaPerfil.png`, servida pelo caminho `/images/profile/FotoParaPerfil.png`. A cópia pública mantém todos os pixels do PNG original; somente metadados de captura e bytes posteriores ao fim da imagem foram removidos. O original foi preservado fora do projeto, na pasta do anexo da atualização (`FotoParaPerfil.original.png`). O Vite procura, nesta ordem: a foto fornecida, `public/images/perfil.png` e `public/images/profile/andson.jpg`. Ao adicionar, substituir o caminho ou remover uma foto, **reinicie o servidor** ou faça novo build, pois a disponibilidade é verificada em `vite.config.ts`.

A apresentação é circular, responsiva, com `object-fit: cover` e escala de cinza aplicada somente pelo CSS. Falha de carregamento exibe o monograma AR. O botão da foto responde a clique, toque, Enter e Espaço; gira 720° no eixo **Y** em 1,6 segundo, desacelera e retorna à orientação original. As duas faces usam a mesma foto, para evitar o espelhamento durante o giro. Cliques durante o movimento são ignorados. O halo é uma camada separada e acompanha somente mouse fino; pausa e movimento reduzido desativam esses efeitos.

### Currículo

Adicione `public/documents/curriculo-andson-rocha.pdf` e **reinicie o servidor** ou faça novo build. Só então aparece o link “Baixar currículo”. O arquivo nunca é simulado. Revise o documento antes de colocá-lo em `public/`: arquivos desta pasta são públicos na versão distribuída.

### Projetos

Cada registro segue `Project` em `src/types/content.ts`: `id`, `title`, `category`, `description`, `technologies`, `highlights`, `image` e `imageAlt`. `detailsSections`, `repository` e `liveUrl` são opcionais; os links devem ser destinos HTTPS públicos reais. Coloque imagens próprias em `public/images/projects/` e use caminhos como `/images/projects/nome.webp`.

Os SVGs atuais são **ilustrações conceituais**, não screenshots de sistemas. Entre Mitos e Raízes utiliza a nova capa fornecida `capa_retangular_mitos_e_raizes.png` (1070 × 622), sem corte, tanto no cartão quanto nos detalhes. A ilustração de Acessibilidade Digital também é conceitual; seu repositório permanece privado e não recebe link público. Ame-Pet e Restaurante Dividão são trabalhos acadêmicos colaborativos de terminal, confirmados nos respectivos repositórios; o portfólio não os apresenta como aplicações web. Os repositórios públicos informados aparecem como links nos cartões e detalhes. Para acrescentar um projeto, edite `src/data/projects.ts`, adicione o arquivo real em `public/images/projects/` e atualize `imageAlt`, `imageWidth`, `imageHeight` e `imageCaption` quando aplicável. Cartão e painel usam a mesma entidade tipada `Project`; somente campos disponíveis são apresentados.

“Um olhar mais de perto” abre um dialog nativo com capa e informações lado a lado no desktop, e uma coluna no mobile. O conteúdo tem rolagem interna; Escape e o botão de fechar devolvem o foco à origem. A página principal fica com rolagem bloqueada enquanto o painel está aberto. Entrada e saída respeitam pausa e movimento reduzido.

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
- **30 penas no desktop (≥1200 px), 18 no tablet e 10 no mobile (<768 px)**, em três planos: primeiro plano nas bordas (240–380 px), intermediário (58–128 px) e fundo (22–52 px). Os seis SVGs transparentes fornecidos mantêm detalhes claros no escuro e escuros no claro. Sementes estáveis controlam tamanho, direção, fase e luminosidade; flutuação, rotação, escala, repulsão amortecida e parallax de scroll compõem transforms sem renderizações React por frame. Mouse fino tem raio de influência de 115 px e deslocamento máximo de 28 px; touch mantém movimento natural e parallax. Pausa, guia oculta e movimento reduzido interrompem o ticker.
- As quatro áreas do Hero alternam com digitação de 80–94 ms por caractere, apagamento de 42 ms, pausa de 1.500 ms e intervalo de 300 ms. Espaço reservado evita saltos, e leitores de tela recebem a lista completa sem anúncios de caracteres. Redução/pausa mostra um título estático.
- O botão ao lado do tema pausa o movimento. `prefers-reduced-motion` é respeitado e reage a mudanças do sistema.
- Carrossel sem reprodução automática: setas, indicadores, swipe horizontal e teclado. Focando a região do carrossel, use ←/→, Home e End. Gestos verticais e zoom por pinça são preservados.
- Três faixas editoriais antecedem Habilidades, Projetos e Contato. Edite palavras, direção e duração em `src/data/marquees.ts`; `SectionMarquee.tsx` oferece uma cópia estática acessível e interrompe movimento por pausa, hover, guia oculta ou preferência de movimento reduzido.
- O relógio discreto do **Hero** usa a hora atual do dispositivo com `Intl.DateTimeFormat` no fuso fixo `America/Fortaleza` e formato de 24 horas. Rótulos e fuso ficam em `src/data/clock.ts`; `LocalClock.tsx` atualiza uma vez por segundo, sincroniza ao voltar à guia e limpa o timer ao desmontar. “Pau dos Ferros, RN” aparece no rodapé.
- “Áreas que eu exploro”, no Hero, oferece Mostrar tudo/Mostrar menos com as quatro áreas já existentes em `professionalRoles`. “No meu radar”, em Sobre, apresenta os quatro resumos de `radar.ts` com botões +/−, teclado, ARIA e expansão suave. Os grupos de Habilidades continuam visíveis.
- O WhatsApp flutuante reutiliza `whatsappContact` de `contacts.ts`: mesmo número e mensagem, codificada com `encodeURIComponent`, em nova aba. Os controles mobile reservam espaço lateral para o botão. A foto mantém halo e giro no eixo Y, com rótulo acessível, sem instrução textual permanente ou cruz decorativa.

As quantidades, tamanhos, raio/força de repulsão, tempos da digitação e parâmetros da foto ficam em **`src/data/motion.ts`**. A timeline Welcome fica em `PageMotion.tsx`, e os estilos do corte em V ficam em `global.css`. A assinatura do nome usa **Space Grotesk**, em caixa alta, peso 600 e espaçamento ajustado; Manrope continua nos textos e controles. Nenhuma nova família ou dependência foi instalada nesta atualização.

Os SVGs atuais são recursos fornecidos pelo proprietário; o gerador antigo `scripts/generate-feathers.mjs` não produz esse conjunto e não faz parte do fluxo de build.

### Desempenho de rolagem

As penas reutilizam camadas de composição (`will-change: transform`) para evitar rasterizar novamente os caminhos SVG a cada rotação. Rotação e escala são escritas juntas; o parallax consome a posição de scroll armazenada por listener passivo. Quantidade, arquivos, tamanhos, blur e parâmetros de movimento permanecem em `motion.ts`, sem redução de qualidade como estratégia de desempenho.

A digitação do Hero e as faixas pausam fora da área visível, usando `IntersectionObserver`, e retomam o progresso ao reaparecer. A digitação conserva inclusive a espera restante entre caracteres/palavras. Os observers e timers são removidos na desmontagem.

Para medir: execute `npm run build`, inicie `npm run preview` em um terminal e rode `node scripts/profile-scroll.mjs nome-do-ensaio` em outro. Requer Microsoft Edge. Evite executar builds/testes ao mesmo tempo: o script mede duas descidas de 4.800 px por combinação de viewport (1440 × 900 e 390 × 844) e CPU normal/4×, usando entrada de mouse nativa e amostragem rAF. Relatórios ficam em `.verification/scroll-performance-nome-do-ensaio.json`. Consulte [as amostras registradas](docs/scroll-performance.json) e [os resultados e limites](docs/validation.md). O viewport estreito não substitui teste em celular físico.

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

## Contador de visitantes estimados

O cabeçalho contém um contador inicialmente oculto, com EyeOff e máscara. Revelar consulta `GET /api/visitors`; ocultar remove o valor da apresentação e dos textos acessíveis. Não há preferência persistida, polling ou consulta antes do primeiro clique. Uma consulta concluída é reutilizada durante a navegação atual; recarregue a página para atualizar. Falhas mostram **Falha** e um botão **Tentar novamente**, sem apresentar zero desconhecido.

A fonte é a [API oficial de Web Analytics da Vercel](https://vercel.com/docs/analytics/web-analytics-api), consultada no servidor. O projeto existente retornou `data.visitors` e `data.pageviews` no conector em 23/10/2026. A interface usa **visitantes estimados nos últimos 30 dias de calendário UTC, incluindo hoje** (`estimated_unique_visitors`, `last_30_days`). A [identificação anônima da Vercel](https://vercel.com/docs/analytics/privacy-policy) se renova após 24 horas; portanto, a mesma pessoa pode integrar o agregado mais de uma vez ao longo dos 30 dias. Não é um total de pessoas únicas de toda a vida do site. A janela começa à meia-noite UTC de 29 dias atrás e termina à meia-noite de amanhã; o dia atual está incompleto. Retenção, início da coleta, bloqueadores e disponibilidade da conta limitam os registros disponíveis.

A coleta e persistência continuam sob responsabilidade do Vercel Web Analytics e sobrevivem a deploys. Não há banco adicional, incremento pelo cliente ou endpoint de gravação. O endpoint público mostra somente o agregado, as datas da janela e `updatedAt`. Cache CDN de cinco minutos e agrupamento de consultas simultâneas por instância reduzem chamadas; não são um limite global de requisições. O cliente não escolhe projeto, filtros ou período. Métodos de escrita e parâmetros são rejeitados; token, detalhes dos erros upstream e dados individuais não são devolvidos. Logs do servidor contêm somente códigos de diagnóstico e status HTTP. Timeout no servidor: 5 s; cliente: 6,5 s. Não foram adicionados cookies, IDs pessoais ou fingerprinting.

### Configuração do contador

No projeto **portfolio-pessoal**, as variáveis abaixo estão configuradas **server-side** para produção e desenvolvimento. Confira seus alvos antes de futuros deployments:

| Variável               | Valor/configuração                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANALYTICS_READ_TOKEN` | Token Vercel válido com acesso ao Web Analytics desse projeto. Use o menor escopo e prazo disponíveis; nunca o prefixo `VITE_`, Git ou `public/`. |
| `ANALYTICS_PROJECT_ID` | `prj_9w2OD5NidVXvsfk0Ih8uGjngq25l` (também aceita o nome `portfolio-pessoal`).                                                                    |
| `ANALYTICS_TEAM_ID`    | Opcional: `team_LvnPD94kY8IS3GskS8NERCmW` quando necessário para o escopo do token.                                                               |

A autenticação do conector usada na inspeção não é transferida para a aplicação. O token foi configurado pelo proprietário sem compartilhá-lo na conversa; as variáveis de escopo não secretas foram adicionadas aos ambientes produção e desenvolvimento. Sem configuração, a função retorna HTTP 503 com `temporarily_unavailable`; não inventa uma contagem. A API consulta dados de produção mesmo em um preview. Para habilitar o contador em previews, configure as mesmas variáveis para esse alvo.

Para desenvolvimento local, copie `.env.example` para `.env.local`, preencha privadamente e reinicie `npm run dev`. O adaptador de `server/visitors-plugin.ts` também atende `npm run preview`. Essas variáveis não entram no bundle do navegador. Na Vercel, `api/visitors.ts` é uma Function Node; em hospedagem puramente estática será necessário oferecer uma função equivalente. A versão local, o preview do build, o artefato compilado pelo builder oficial e o deployment publicado em 24/10/2026 UTC retornaram HTTP 200 com dados reais. O navegador confirmou mostrar, ocultar e iniciar novamente mascarado. Não envie o token em conversas ou tickets.

## Instagram e compartilhamento

Instagram **[@andsonzy](https://www.instagram.com/andsonzy/)** foi acrescentado em `src/data/contacts.ts`, usando ícone monocromático e `ExternalLink`. E-mail, GitHub, LinkedIn, WhatsApp e Discord permanecem.

`public/og-image.png` é uma imagem estável de **1200 × 630 px**, independente do tema, com nome, áreas de atuação, UFERSA e assinatura AR. O favicon AR existente foi preservado. `index.html` contém title, description, canonical, Open Graph e Twitter Card antes de executar JavaScript, sem SSR. Domínio de produção confirmado: **https://andsonrocha.vercel.app/**; imagem absoluta: **https://andsonrocha.vercel.app/og-image.png**.

No deployment publicado pelo proprietário em 24/10/2026 UTC, a imagem respondeu **HTTP 200**, `Content-Type: image/png`, dimensões 1200 × 630 e acesso sem autenticação. O HTML público mantém os metadados Open Graph e Twitter. Para testar o cartão efetivo, use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) e [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) e compartilhe o link no WhatsApp/Discord/Telegram. Serviços mantêm caches independentes; solicite nova inspeção quando necessário. Esses cartões ainda não foram testados diretamente nas plataformas.
