import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { safeHref } from '../../lib/links'

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string
  children: ReactNode
}
export function ExternalLink({ href, children, ...props }: Props) {
  const safe = safeHref(href)
  if (!safe) return null
  const external = safe.startsWith('https:')
  return (
    <a
      {...props}
      href={safe}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
