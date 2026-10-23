import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../../data/projects'
import { usePreferences } from '../../hooks/usePreferences'
import { ExternalLink } from '../ui/ExternalLink'

export function ProjectCarousel() {
  const [index, setIndex] = useState(0)
  const direction = useRef(1)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const slide = useRef<HTMLDivElement>(null)
  const { motionPaused } = usePreferences()
  const project = projects[index]!

  const go = (next: number) => {
    direction.current = next >= index ? 1 : -1
    setIndex((next + projects.length) % projects.length)
  }
  useGSAP(
    () => {
      if (motionPaused) return
      gsap.fromTo(
        slide.current,
        { opacity: 0.3, x: direction.current * 16 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' },
      )
    },
    { scope: slide, dependencies: [index, motionPaused], revertOnUpdate: true },
  )

  const onKeyDown = (event: KeyboardEvent) => {
    // Nested controls retain their native keyboard behavior and focus.
    if (event.target !== event.currentTarget) return
    const keys: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: projects.length - 1,
    }
    if (event.key in keys) {
      event.preventDefault()
      go(keys[event.key]!)
    }
  }
  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      touch.current = null
      return
    }
    const end = event.changedTouches[0]
    if (touch.current && end) {
      const dx = end.clientX - touch.current.x
      const dy = end.clientY - touch.current.y
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1))
    }
    touch.current = null
  }

  return (
    <div
      className="project-carousel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Projetos selecionados"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        ref={slide}
        className="project-slide"
        onTouchStart={(event) => {
          const point = event.touches[0]
          touch.current =
            event.touches.length === 1 && point ? { x: point.clientX, y: point.clientY } : null
        }}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touch.current = null
        }}
      >
        <figure className="project-art">
          <img src={project.image} alt={project.imageAlt} width="900" height="680" loading="lazy" />
          <figcaption>
            <span>ESTUDO VISUAL / 0{index + 1}</span>
            <span>Ilustração conceitual</span>
          </figcaption>
        </figure>
        <div
          className="project-information"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} de ${projects.length}`}
        >
          <span className="eyebrow">{project.category}</span>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <ul className="project-technologies" aria-label="Tecnologias e métodos">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          <details className="project-details" key={project.id}>
            <summary>
              Um olhar mais de perto
              <Plus size={18} aria-hidden="true" />
            </summary>
            <ul>
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </details>
          {project.repository && (
            <ExternalLink href={project.repository} className="text-link">
              Ver repositório
              <ArrowUpRight size={16} />
            </ExternalLink>
          )}
          {project.liveUrl && (
            <ExternalLink href={project.liveUrl} className="text-link">
              Visitar projeto
              <ArrowUpRight size={16} />
            </ExternalLink>
          )}
        </div>
      </div>
      <div className="carousel-controls">
        <p className="project-counter" aria-live="polite" aria-atomic="true">
          <strong>0{index + 1}</strong>
          <span>/ 0{projects.length}</span>
          <span className="sr-only"> — {project.title}</span>
        </p>
        <div className="project-indicators">
          {projects.map((item, itemIndex) => (
            <button
              key={item.id}
              aria-label={`Mostrar projeto ${itemIndex + 1}: ${item.title}`}
              aria-pressed={index === itemIndex}
              onClick={() => go(itemIndex)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="carousel-arrows">
          <button
            className="icon-button"
            onClick={() => go(index - 1)}
            aria-label="Projeto anterior"
          >
            <ArrowLeft />
          </button>
          <button
            className="icon-button"
            onClick={() => go(index + 1)}
            aria-label="Próximo projeto"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}
