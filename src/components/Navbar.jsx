import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { NavLink } from 'react-router-dom'

const links = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: 'Members', to: '/members' }]
const REVEAL_DURATION = 650

function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [transitioning, setTransitioning] = useState(false)
  const switchRef = useRef(null)
  const selectTheme = (nextTheme, activatedElement) => {
    if (nextTheme === theme || transitioning) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const applyTheme = () => { document.documentElement.dataset.theme = nextTheme; flushSync(() => setTheme(nextTheme)); try { localStorage.setItem('team-theme', nextTheme) } catch (error) { console.error('Portfolio could not persist the theme preference.', error) } }
    if (reducedMotion) { applyTheme(); return }
    setTransitioning(true)
    const element = activatedElement || switchRef.current
    const rect = element?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    if (document.startViewTransition) {
      const transition = document.startViewTransition(applyTheme)
      transition.ready.then(() => { const width = Math.max(window.innerWidth, document.documentElement.clientWidth); const height = Math.max(window.innerHeight, document.documentElement.clientHeight); const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)); document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: REVEAL_DURATION, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }) }).catch(() => {}).finally(() => setTransitioning(false))
    } else {
      applyTheme(); document.documentElement.classList.add('theme-transition'); window.setTimeout(() => { document.documentElement.classList.remove('theme-transition'); setTransitioning(false) }, 400)
    }
  }
  return <header className="nav-entrance fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]"><nav className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8" aria-label="Main navigation"><NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2 font-bold tracking-tight" onClick={() => setOpen(false)}><img src="/logo.png" alt="Team Rocket logo" className="h-9 w-9 shrink-0 object-contain" onError={() => console.error('Logo asset failed to load: /logo.png')} /><span className="brand-wordmark">Team Rockett</span></NavLink><div className="hidden items-center gap-6 md:flex"><ThemeSwitch switchRef={switchRef} theme={theme} onSelect={selectTheme} /><div className="h-5 w-px bg-[var(--border)]" aria-hidden="true" /><div className="flex items-center gap-1">{links.map((link) => <NavItem key={link.to} link={link} />)}</div></div><div className="flex items-center gap-3 md:hidden"><ThemeSwitch switchRef={switchRef} theme={theme} onSelect={selectTheme} /><button type="button" className="rounded-lg border border-[var(--border)] p-2 text-sm" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><MenuIcon /></button></div></nav>{open && <div id="mobile-menu" className="border-t border-[var(--border)] bg-[var(--nav-bg)] px-5 py-3 md:hidden"><div>{links.map((link) => <NavItem key={link.to} link={link} onClick={() => setOpen(false)} />)}</div></div>}</header>
}

function NavItem({ link, onClick }) { return <NavLink to={link.to} end={link.to === '/'} onClick={onClick} className={({ isActive }) => `relative block min-h-10 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-[var(--accent)] text-black md:bg-transparent md:text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] md:hover:bg-transparent'}`}>{({ isActive }) => <>{link.label}{isActive && <span className="absolute inset-x-3 -bottom-1 hidden h-0.5 bg-[var(--accent)] md:block" />}</>}</NavLink> }
function ThemeSwitch({ theme, onSelect, switchRef }) {
  const knobRef = useRef(null)
  const dragStart = useRef(null)
  const suppressClick = useRef(false)
  const tugTimer = useRef(null)
  const [dragPosition, setDragPosition] = useState(null)
  const [tugging, setTugging] = useState(false)
  const isDark = theme === 'dark'
  const travel = 18
  const position = dragPosition ?? (isDark ? travel : 0)
  const commitTheme = (nextTheme) => { if (nextTheme !== theme) onSelect(nextTheme, knobRef.current) }
  const toggle = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { commitTheme(isDark ? 'light' : 'dark'); return }
    setTugging(true)
    window.clearTimeout(tugTimer.current)
    tugTimer.current = window.setTimeout(() => { commitTheme(isDark ? 'light' : 'dark'); setTugging(false) }, 70)
  }
  const onPointerDown = (event) => { event.currentTarget.setPointerCapture(event.pointerId); dragStart.current = { y: event.clientY, position }; setDragPosition(position); suppressClick.current = false }
  const onPointerMove = (event) => {
    if (!dragStart.current) return
    const nextPosition = Math.max(0, Math.min(travel, dragStart.current.position + event.clientY - dragStart.current.y))
    if (Math.abs(nextPosition - dragStart.current.position) > 2) suppressClick.current = true
    setDragPosition(nextPosition)
  }
  const onPointerUp = (event) => {
    if (!dragStart.current) return
    const nextTheme = position > travel / 2 ? 'dark' : 'light'
    dragStart.current = null
    setDragPosition(null)
    if (suppressClick.current) commitTheme(nextTheme)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }
  const onClick = () => { if (suppressClick.current) { suppressClick.current = false; return } toggle() }
  return <button ref={switchRef} type="button" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" className="pull-cord-toggle" onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
    <span className="pull-cord-fixture" aria-hidden="true"><span className={`pull-cord-bulb ${isDark ? 'is-lit' : ''}`} /></span>
    <span className="pull-cord-line" aria-hidden="true" />
    <span ref={knobRef} className={`pull-cord-knob ${isDark ? 'is-on' : ''} ${tugging ? 'is-tugging' : ''}`} style={{ transform: `translateY(${position + (tugging ? 5 : 0)}px)` }} aria-hidden="true" />
  </button>
}
function MenuIcon() { return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg> }
export default Navbar
