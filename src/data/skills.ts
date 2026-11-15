import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiVite,
  SiReact,
  SiPython,
  SiNodedotjs,
  SiC,
  SiCplusplus,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiFigma,
  SiVitest,
  SiPytest,
  SiNpm,
  SiGithubactions,
  SiVercel,
  SiCloudflarepages,
  SiDjango,
  SiExpress,
  SiSocketdotio,
  SiSqlite,
  SiSupabase,
  SiGreensock,
  SiFramer,
  SiReactrouter,
  SiEslint,
  SiPrettier,
  SiTestinglibrary,
} from 'react-icons/si'
import { FaJava, FaAws } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

type SkillCategory = {
  category: string
  note: string
  items: { name: string; icon: IconType; detail?: string }[]
}

export const skills: {
  id: string
  title: string
  description?: string
  categories: SkillCategory[]
}[] = [
  {
    id: 'utilizo',
    title: 'Tecnologias que utilizo',
    categories: [
      {
        category: 'Front-end',
        note: 'Interfaces e interação',
        items: [
          { name: 'HTML5', icon: SiHtml5 },
          { name: 'CSS3', icon: SiCss },
          { name: 'JavaScript', icon: SiJavascript },
          { name: 'TypeScript', icon: SiTypescript },
          { name: 'Tailwind CSS', icon: SiTailwindcss },
          { name: 'Vite', icon: SiVite },
          { name: 'React', icon: SiReact },
        ],
      },
      {
        category: 'Linguagens e execução',
        note: 'Lógica, estrutura e runtime',
        items: [
          { name: 'Java', icon: FaJava },
          { name: 'Python', icon: SiPython },
          { name: 'Node.js', icon: SiNodedotjs, detail: 'Ambiente de execução JavaScript' },
          { name: 'C', icon: SiC },
          { name: 'C++', icon: SiCplusplus },
        ],
      },
      {
        category: 'Bancos de dados',
        note: 'Modelagem e informação',
        items: [
          { name: 'MySQL', icon: SiMysql },
          { name: 'PostgreSQL', icon: SiPostgresql },
        ],
      },
      {
        category: 'Testes',
        note: 'Verificação de comportamento',
        items: [
          { name: 'Vitest', icon: SiVitest },
          { name: 'pytest', icon: SiPytest },
        ],
      },
      {
        category: 'Desenvolvimento e colaboração',
        note: 'Versionamento, design e pacotes',
        items: [
          { name: 'Git', icon: SiGit },
          { name: 'GitHub', icon: SiGithub },
          { name: 'Figma', icon: SiFigma },
          { name: 'npm', icon: SiNpm },
          { name: 'npm Workspaces', icon: SiNpm },
        ],
      },
      {
        category: 'Nuvem, automação e hospedagem',
        note: 'Infraestrutura e publicação',
        items: [
          { name: 'AWS', icon: FaAws },
          { name: 'GitHub Actions', icon: SiGithubactions },
          { name: 'Vercel', icon: SiVercel },
          { name: 'Vercel Web Analytics', icon: SiVercel },
          { name: 'Cloudflare Pages', icon: SiCloudflarepages },
        ],
      },
    ],
  },
  {
    id: 'conhecimento-inicial',
    title: 'Tecnologias com conhecimento inicial',
    description:
      'Tive contato com estas tecnologias em projetos e estudos e continuo aprofundando meu conhecimento na prática.',
    categories: [
      {
        category: 'Back-end e APIs',
        note: 'Serviços e comunicação',
        items: [
          { name: 'Django', icon: SiDjango },
          { name: 'Django REST Framework', icon: SiDjango },
          { name: 'Express', icon: SiExpress },
          { name: 'Socket.IO', icon: SiSocketdotio },
        ],
      },
      {
        category: 'Bancos de dados e serviços',
        note: 'Persistência e integração',
        items: [
          { name: 'SQLite', icon: SiSqlite },
          { name: 'Supabase', icon: SiSupabase },
        ],
      },
      {
        category: 'Interfaces e animações',
        note: 'Movimento e navegação',
        items: [
          { name: 'GSAP', icon: SiGreensock },
          { name: 'Motion', icon: SiFramer },
          { name: 'React Router', icon: SiReactrouter },
        ],
      },
      {
        category: 'Java para desktop e gráficos',
        note: 'Interfaces e desenho',
        items: [
          { name: 'Swing', icon: FaJava },
          { name: 'AWT/Graphics2D', icon: FaJava },
          { name: 'JavaFX', icon: FaJava },
        ],
      },
      {
        category: 'Testes e qualidade',
        note: 'Verificação e padronização',
        items: [
          { name: 'Supertest', icon: SiTestinglibrary },
          { name: 'pytest-django', icon: SiPytest },
          { name: 'ESLint', icon: SiEslint },
          { name: 'Prettier', icon: SiPrettier },
        ],
      },
      {
        category: 'Containers',
        note: 'Ambientes de execução',
        items: [{ name: 'Docker', icon: SiDocker }],
      },
    ],
  },
]
