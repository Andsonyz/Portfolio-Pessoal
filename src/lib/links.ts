/** Allow only deliberate public links. Editable data must never become executable URLs. */
export function safeHref(value?: string): string | undefined {
  if (
    !value ||
    value !== value.trim() ||
    value.includes('\\') ||
    [...value].some((character) => character.charCodeAt(0) < 32)
  )
    return undefined
  if (/^\/(?!\/)/.test(value)) {
    return value.includes('..') ? undefined : value
  }
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && !url.username && !url.password) return value
    if (url.protocol === 'mailto:' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.pathname)) return value
  } catch {
    /* Missing or malformed links are omitted. */
  }
  return undefined
}
