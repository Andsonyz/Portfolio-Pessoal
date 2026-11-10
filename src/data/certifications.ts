import type { Certification } from '../types/content'
export const certifications: Certification[] = [
  {
    id: 'claude-2026',
    name: 'Intensivão de Claude',
    institution: 'Hashtag Treinamentos',
    date: '29/10/2026',
    hours: 8,
    category: 'Inteligência artificial · Intensivão',
    pdf: '/documents/certificates/intensivao-claude-2026.pdf',
  },
  {
    id: 'godot-2023',
    name: 'Introdução ao Desenvolvimento de Games com o Godot',
    institution: 'UFERSA · VI Encontro de Computação do Oeste Potiguar',
    date: '14 e 15/12/2023',
    hours: 6,
    category: 'Desenvolvimento de jogos · Atividade de extensão',
    pdf: '/documents/certificates/godot-2023.pdf',
    validation: {
      issuedAt: '10/11/2026',
      kind: 'Participante',
    },
  },
  {
    id: 'javascript-2023',
    name: 'Curso de JavaScript para Iniciantes: 2023.1',
    institution: 'UFERSA · Departamento de Engenharias e Tecnologia — Pau dos Ferros',
    date: '30/07 a 30/10/2023',
    hours: 30,
    category: 'Programação · Curso de extensão',
    pdf: '/documents/certificates/javascript-2023.pdf',
    validation: {
      issuedAt: '10/11/2026',
      kind: 'Participante',
    },
  },
]
