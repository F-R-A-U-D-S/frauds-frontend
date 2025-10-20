import React, { useEffect, useRef, useState } from 'react'
import './Layout.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Trap focus when open (simple cycle)
  useEffect(() => {
    if (!open || !drawerRef.current) return
    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()
  }, [open])

  const toggle = () => setOpen(v => !v)
  const close = () => setOpen(false)

  return (
    <div className="page">
      <header className="siteHeader headerRow">
        <h1 className="title">F.R.A.U.D.S</h1>
        <button
          ref={btnRef}
          className="hamburger"
          aria-label="Open menu"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="app-drawer"
          onClick={toggle}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </header>

      {/* Overlay */}
      {open && <div className="overlay" onClick={close} />}

      {/* Right Drawer */}
      <aside
        id="app-drawer"
        ref={drawerRef}
        className={`drawer ${open ? 'open' : ''}`}
        role="menu"
        aria-hidden={!open}
      >
        <nav className="drawerNav">
          <button className="closeBtn" onClick={close} aria-label="Close menu">
            ×
          </button>
          <a href="#upload" role="menuitem" className="drawerLink">Upload</a>
          <a href="#about" role="menuitem" className="drawerLink">About</a>
          <a href="#help" role="menuitem" className="drawerLink">Help</a>
        </nav>
      </aside>

      {children}
    </div>
  )
}
