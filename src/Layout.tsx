import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from './auth/AuthContext.tsx'
import { Link } from 'react-router-dom'
import './Layout.css'
import './Schema.tsx'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const {logout} = useContext(AuthContext)

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
          <a href="/upload" role="menuitem" className="drawerLink">Upload</a>
          <Link to="/schema" role="menuitem" className="drawerLink">Schema Mapping</Link>
          <button
            role="menuitem"
            className="drawerLink"
            onClick={logout}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {children}
    </div>
  )
}
