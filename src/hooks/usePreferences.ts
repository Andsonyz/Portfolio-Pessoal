import { createContext, useContext, useSyncExternalStore } from 'react'

export interface Preferences {
  theme: 'dark' | 'light'
  toggleTheme: () => void
  transitioning: boolean
  motionPaused: boolean
  toggleMotion: () => void
  reducedMotion: boolean
}
export const PreferencesContext = createContext<Preferences | null>(null)
export function usePreferences() {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error('PreferencesProvider is required')
  return value
}
const motionQuery = '(prefers-reduced-motion: reduce)'
function subscribe(callback: () => void) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  )
}
