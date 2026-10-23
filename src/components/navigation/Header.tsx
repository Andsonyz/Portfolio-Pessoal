import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Moon, Pause, Play, Sun, X } from 'lucide-react'
import { navigation } from '../../data/profile'
import { usePreferences } from '../../hooks/usePreferences'
import { Monogram } from '../ui/Monogram'

export function Header() {
  const { theme, toggleTheme, transitioning, motionPaused, toggleMotion, reducedMotion } =
    usePreferences()
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const candidate = entries.find((entry) => entry.isIntersecting)
        if (candidate) setActive(candidate.target.id)
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )
    document.querySelectorAll('main > section').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const query = window.matchMedia('(min-width: 1200px)')
    const closeOnDesktop = () => {
      if (query.matches) dialog.current?.close()
    }
    query.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.style.overflow = previous
      query.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  const close = () => dialog.current?.close()
  const navigate = (id: string) => {
    close()
    // Native dialog returns focus to the trigger; move it to the destination afterwards.
    requestAnimationFrame(() => document.getElementById(id)?.focus({ preventScroll: true }))
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Andson Rocha — início">
          <Monogram />
          <span>
            ANDSON
            <br />
            ROCHA
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-controls">
          <button
            className="icon-button motion-toggle"
            type="button"
            aria-label={
              reducedMotion
                ? 'Movimento reduzido pelo sistema'
                : motionPaused
                  ? 'Retomar animações'
                  : 'Pausar animações'
            }
            title={
              reducedMotion
                ? 'Movimento reduzido pelo sistema'
                : motionPaused
                  ? 'Retomar animações'
                  : 'Pausar animações'
            }
            onClick={toggleMotion}
            disabled={reducedMotion}
          >
            {motionPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            onClick={toggleTheme}
            disabled={transitioning}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              dialog.current?.showModal()
              setOpen(true)
            }}
          >
            <Menu size={23} />
          </button>
        </div>
      </header>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className="mobile-menu"
        aria-label="Menu de navegação"
        onClose={() => {
          setOpen(false)
          menuButton.current?.focus()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
      >
        <div className="mobile-menu-inner">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Explore o portfólio</p>
            <button className="icon-button" aria-label="Fechar menu" onClick={close}>
              <X />
            </button>
          </div>
          <nav aria-label="Navegação mobile">
            {navigation.map((item, index) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => navigate(item.id)}>
                <span className="menu-number">0{index + 1}</span>
                {item.label}
                <ArrowUpRight size={20} />
              </a>
            ))}
          </nav>
          <p className="menu-footnote">Andson Rocha · Pau dos Ferros, RN</p>
        </div>
      </dialog>
    </>
  )
}
