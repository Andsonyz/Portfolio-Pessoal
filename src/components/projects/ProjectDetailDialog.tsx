import { useEffect, useRef, type RefObject } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Project } from '../../types/content'
import { usePreferences } from '../../hooks/usePreferences'
import { ExternalLink } from '../ui/ExternalLink'

interface Props {
  project: Project | null
  triggerRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function ProjectDetailDialog({ project, triggerRef, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const { motionPaused } = usePreferences()

  useEffect(() => {
    if (!project || !dialog.current || dialog.current.open) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closing.current = false
    delete dialog.current.dataset.closing
    dialog.current.showModal()
    closeButton.current?.focus()
    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [project])

  const { contextSafe } = useGSAP(
    () => {
      if (!project || motionPaused || !dialog.current) return
      gsap.fromTo(
        dialog.current,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.32, ease: 'power2.out', clearProps: 'transform' },
      )
      if (!motionPaused)
        gsap.fromTo(
          '.project-dialog-art img',
          { scale: 1.025 },
          { scale: 1, duration: 0.4, ease: 'power2.out' },
        )
    },
    { scope: dialog, dependencies: [project, motionPaused], revertOnUpdate: true },
  )

  useEffect(() => {
    if (motionPaused && closing.current) dialog.current?.close()
  }, [motionPaused])

  const dismiss = () =>
    contextSafe(() => {
      const element = dialog.current
      if (!element?.open || closing.current) return
      closing.current = true
      element.dataset.closing = 'true'
      if (motionPaused) {
        element.close()
        return
      }
      gsap.to(element, {
        opacity: 0,
        x: 28,
        duration: 0.2,
        ease: 'power1.in',
        onComplete: () => element.close(),
      })
    })()

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-modal="true"
      aria-labelledby={project ? `project-dialog-title-${project.id}` : undefined}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex="0"]',
        )
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
      aria-describedby={project ? `project-dialog-description-${project.id}` : undefined}
      onCancel={(event) => {
        event.preventDefault()
        dismiss()
      }}
      onClose={() => {
        closing.current = false
        onClose()
        triggerRef.current?.focus({ preventScroll: true })
      }}
    >
      {project && (
        <div className="project-dialog-panel">
          <button
            ref={closeButton}
            type="button"
            className="project-dialog-close"
            aria-label={`Fechar detalhes de ${project.title}`}
            onClick={dismiss}
          >
            <X aria-hidden="true" size={19} />
          </button>
          <figure className="project-dialog-art">
            <img
              src={project.image}
              alt={project.imageAlt}
              width={project.imageWidth ?? 900}
              height={project.imageHeight ?? 680}
            />
          </figure>
          <div
            className="project-dialog-content"
            role="region"
            aria-label={`Informações sobre ${project.title}`}
            tabIndex={0}
          >
            <span className="eyebrow">{project.category}</span>
            <h2 id={`project-dialog-title-${project.id}`}>{project.title}</h2>
            <p id={`project-dialog-description-${project.id}`} className="project-dialog-summary">
              {project.description}
            </p>
            {(
              project.detailsSections ??
              (project.highlights.length > 0
                ? [{ title: 'Destaques', items: project.highlights }]
                : [])
            ).map((section, index) => (
              <section
                className="project-dialog-section"
                aria-labelledby={`project-section-${project.id}-${index}`}
                key={section.title}
              >
                <h3 id={`project-section-${project.id}-${index}`}>{section.title}</h3>
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
            {project.technologies.length > 0 && (
              <section
                className="project-dialog-section"
                aria-labelledby={`project-tech-${project.id}`}
              >
                <h3 id={`project-tech-${project.id}`}>Tecnologias e métodos</h3>
                <ul className="project-dialog-technologies">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </section>
            )}
            <div className="project-dialog-links">
              {project.repository && (
                <ExternalLink href={project.repository} className="text-link">
                  Repositório GitHub <ArrowUpRight aria-hidden="true" size={16} />
                </ExternalLink>
              )}
              {project.liveUrl && (
                <ExternalLink href={project.liveUrl} className="text-link">
                  Demonstração online <ArrowUpRight aria-hidden="true" size={16} />
                </ExternalLink>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
