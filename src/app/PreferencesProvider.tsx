import { useEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { PreferencesContext, useReducedMotion } from '../hooks/usePreferences'

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const busy = useRef(false)
  const activeTransition = useRef<ViewTransition | null>(null)

  useEffect(() => {
    document.documentElement.dataset.motion = paused || reducedMotion ? 'reduced' : 'full'
    if (paused || reducedMotion) activeTransition.current?.skipTransition()
  }, [paused, reducedMotion])

  useEffect(() => () => activeTransition.current?.skipTransition(), [])

  const toggleTheme = async () => {
    if (busy.current) return
    const next = theme === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', next === 'dark' ? '#080808' : '#fafafa')
      setTheme(next)
      try {
        localStorage.setItem('ar-theme', next)
      } catch {
        /* Theme works even when storage is unavailable. */
      }
    }
    if (reducedMotion || paused || !document.startViewTransition) {
      apply()
      return
    }
    busy.current = true
    setTransitioning(true)
    try {
      const transition = document.startViewTransition(() => flushSync(apply))
      activeTransition.current = transition
      // Hidden tabs and interrupted captures may skip the animation. The update
      // still completes; consume ready's rejection without reapplying the theme.
      void transition.ready.catch(() => undefined)
      await transition.finished
    } catch {
      // A hidden tab or interrupted snapshot must not prevent the selected theme.
      apply()
    } finally {
      activeTransition.current = null
      busy.current = false
      setTransitioning(false)
    }
  }

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        toggleTheme,
        transitioning,
        motionPaused: paused || reducedMotion,
        toggleMotion: () => setPaused((value) => !value),
        reducedMotion,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}
