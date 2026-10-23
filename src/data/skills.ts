import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiVite,
  SiReact,
  SiC,
  SiCplusplus,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiDocker,
  SiFigma,
} from 'react-icons/si'
import { FaJava, FaAws } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

export const skills: {
  category: string
  note: string
  items: { name: string; icon: IconType }[]
}[] = [
  {
    category: 'Front-end',
    note: 'Interfaces & interação',
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
    category: 'Back-end / Linguagens',
    note: 'Lógica & estrutura',
    items: [
      { name: 'Java', icon: FaJava },
      { name: 'C', icon: SiC },
      { name: 'C++', icon: SiCplusplus },
    ],
  },
  {
    category: 'Banco de Dados',
    note: 'Modelagem & informação',
    items: [
      { name: 'MySQL', icon: SiMysql },
      { name: 'PostgreSQL', icon: SiPostgresql },
    ],
  },
  {
    category: 'Ferramentas',
    note: 'Processo & colaboração',
    items: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Docker', icon: SiDocker },
      { name: 'AWS', icon: FaAws },
      { name: 'Figma', icon: SiFigma },
    ],
  },
]
