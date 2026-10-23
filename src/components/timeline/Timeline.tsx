import { Plus } from 'lucide-react'
import type { Milestone } from '../../types/content'
export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.id} className="timeline-item">
          <span className="timeline-date">{item.date}</span>
          <details className="timeline-details">
            <summary>
              <span>
                <span className="eyebrow">{item.category}</span>
                <span className="timeline-title">{item.title}</span>
              </span>
              <Plus aria-hidden="true" />
            </summary>
            <p>{item.description}</p>
          </details>
        </li>
      ))}
    </ol>
  )
}
