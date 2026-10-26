import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { radarItems } from '../../data/radar'

export function RadarAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <div className="radar-list">
      {radarItems.map(({ title, summary, icon: Icon }, index) => {
        const expanded = openItem === title
        const panelId = `radar-description-${index}`
        return (
          <article className="radar-item" key={title}>
            <div className="radar-item-heading">
              <Icon aria-hidden="true" size={19} />
              <h3>{title}</h3>
              <button
                type="button"
                aria-label={title}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpenItem(expanded ? null : title)}
              >
                {expanded ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
              </button>
            </div>
            <div
              className="radar-description"
              id={panelId}
              data-expanded={expanded}
              aria-hidden={!expanded}
              inert={!expanded}
            >
              <div>
                <p>{summary}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
