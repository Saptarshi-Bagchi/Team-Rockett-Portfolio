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
  return <header className="nav-entrance fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]"><nav className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8" aria-label="Main navigation"><NavLink to="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight" onClick={() => setOpen(false)}><img src="/logo.png" alt="Team Rocket logo" className="h-9 w-9 object-contain" onError={() => console.error('Logo asset failed to load: /logo.png')} /><span>Team Rockett</span></NavLink><div className="hidden items-center gap-6 md:flex"><ThemeSwitch switchRef={switchRef} theme={theme} onSelect={selectTheme} /><div className="h-5 w-px bg-[var(--border)]" aria-hidden="true" /><div className="flex items-center gap-1">{links.map((link) => <NavItem key={link.to} link={link} />)}</div></div><div className="flex items-center gap-3 md:hidden"><ThemeSwitch switchRef={switchRef} theme={theme} onSelect={selectTheme} /><button type="button" className="rounded-lg border border-[var(--border)] p-2 text-sm" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><MenuIcon /></button></div></nav>{open && <div id="mobile-menu" className="border-t border-[var(--border)] bg-[var(--nav-bg)] px-5 py-3 md:hidden"><div>{links.map((link) => <NavItem key={link.to} link={link} onClick={() => setOpen(false)} />)}</div></div>}</header>
}

function NavItem({ link, onClick }) { return <NavLink to={link.to} end={link.to === '/'} onClick={onClick} className={({ isActive }) => `relative block min-h-10 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-[var(--accent)] text-black md:bg-transparent md:text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] md:hover:bg-transparent'}`}>{({ isActive }) => <>{link.label}{isActive && <span className="absolute inset-x-3 -bottom-1 hidden h-0.5 bg-[var(--accent)] md:block" />}</>}</NavLink> }
function ThemeSwitch({ theme, onSelect, switchRef }) { const isDark = theme === 'dark'; const onKeyDown = (event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); onSelect('light', event.currentTarget) } if (event.key === 'ArrowRight') { event.preventDefault(); onSelect('dark', event.currentTarget) } }; return <div ref={switchRef} role="radiogroup" aria-label="Theme" className="relative flex h-[34px] w-[72px] items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-[3px]"><span aria-hidden="true" className={`absolute left-[3px] top-[3px] h-7 w-7 rounded-full bg-[var(--accent)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isDark ? 'translate-x-[34px]' : 'translate-x-0'}`} /><button type="button" role="radio" aria-checked={!isDark} aria-label="Light mode" tabIndex={isDark ? -1 : 0} onClick={(event) => onSelect('light', event.currentTarget)} onKeyDown={onKeyDown} className={`relative z-[1] flex h-7 w-7 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${!isDark ? 'text-black' : 'text-[var(--muted)]'}`}><SunIcon active={!isDark} /></button><button type="button" role="radio" aria-checked={isDark} aria-label="Dark mode" tabIndex={isDark ? 0 : -1} onClick={(event) => onSelect('dark', event.currentTarget)} onKeyDown={onKeyDown} className={`relative z-[1] flex h-7 w-7 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${isDark ? 'text-black' : 'text-[var(--muted)]'}`}><MoonIcon active={isDark} /></button></div> }
function MenuIcon() { return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg> }
function SunIcon({ active }) { return <svg aria-hidden="true" className={`h-4 w-4 ${active ? 'rotate-90 scale-110' : ''} transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg> }
function MoonIcon({ active }) { return <svg aria-hidden="true" className={`h-4 w-4 ${active ? 'scale-100' : 'scale-85'} transition-transform duration-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 15.4A8.5 8.5 0 0 1 8.6 4a8.5 8.5 0 1 0 11.4 11.4Z" /></svg> }

export default Navbar
