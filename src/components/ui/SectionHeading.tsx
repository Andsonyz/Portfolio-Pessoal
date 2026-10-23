import type { ReactNode } from 'react'
export function SectionHeading({
  number,
  label,
  children,
  aside,
}: {
  number: string
  label: string
  children: ReactNode
  aside?: string
}) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">
        <span>{number}</span> {label}
      </p>
      <div className="section-heading-line">
        <h2>{children}</h2>
        {aside && <p className="section-aside">{aside}</p>}
      </div>
    </div>
  )
}
