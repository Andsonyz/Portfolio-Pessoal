import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { otherProjects, repositoryStudies } from '../../data/projects'
import type { Project } from '../../types/content'
import { ExternalLink } from '../ui/ExternalLink'
import { ProjectDetailDialog } from './ProjectDetailDialog'

export function ProjectArchive() {
  const [project, setProject] = useState<Project | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)

  return (
    <div className="project-archive">
      <h3>Outros trabalhos</h3>
      <p className="project-archive-intro">
        Projetos acadêmicos, propostas e estudos que também fazem parte do caminho.
      </p>
      <ul className="project-archive-list" aria-label="Outros projetos">
        {otherProjects.map((item) => (
          <li key={item.id}>
            <span className="project-archive-name">{item.title}</span>
            <div className="project-archive-actions">
              <button
                type="button"
                className="text-link"
                aria-label={`Detalhes de ${item.title}`}
                onClick={(event) => {
                  trigger.current = event.currentTarget
                  setProject(item)
                }}
              >
                Detalhes
              </button>
              {item.repository && (
                <ExternalLink
                  href={item.repository}
                  className="text-link"
                  aria-label={`GitHub de ${item.title}`}
                >
                  GitHub <ArrowUpRight size={16} aria-hidden="true" />
                </ExternalLink>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h3 className="project-studies-heading">Estudos e experimentos</h3>
      <ul className="repository-studies" aria-label="Estudos e experimentos no GitHub">
        {repositoryStudies.map((item) => (
          <li key={item.repository}>
            <ExternalLink href={item.repository} className="text-link">
              {item.name}
              <ArrowUpRight size={16} aria-hidden="true" />
            </ExternalLink>
          </li>
        ))}
      </ul>
      <ProjectDetailDialog
        project={project}
        triggerRef={trigger}
        onClose={() => setProject(null)}
      />
    </div>
  )
}
