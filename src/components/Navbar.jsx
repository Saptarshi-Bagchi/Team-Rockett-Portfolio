import { forwardRef, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeSwitch from './ThemeSwitch'

const links = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: 'Members', to: '/members' }]

function Navbar() {
  const [open, setOpen] = useState(false)
  const membersLinkRef = useRef(null)
  const navRef = useRef(null)
  const headerRef = useRef(null)
  const menuIconRef = useRef(null)
  return <header ref={headerRef} className="nav-entrance fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]"><nav ref={navRef} className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8" aria-label="Main navigation"><NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2 font-bold tracking-tight" onClick={() => setOpen(false)}><img src="/logo.png" alt="Team Rocket logo" className="h-9 w-9 shrink-0 object-contain" onError={() => console.error('Logo asset failed to load: /logo.png')} /><span className="brand-wordmark">Team Rockett</span></NavLink><div className="hidden items-center gap-1 md:flex">{links.map((link) => <NavItem key={link.to} link={link} linkRef={link.label === 'Members' ? membersLinkRef : undefined} />)}</div><div className="md:hidden"><button type="button" className="rounded-lg border border-[var(--border)] p-2 text-sm" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><MenuIcon ref={menuIconRef} /></button></div></nav>{open && <div id="mobile-menu" className="border-t border-[var(--border)] bg-[var(--nav-bg)] px-5 py-3 md:hidden"><div>{links.map((link) => <NavItem key={link.to} link={link} onClick={() => setOpen(false)} />)}</div></div>}<ThemeSwitch anchorTargetRef={membersLinkRef} fallbackRef={menuIconRef} navbarRef={headerRef} /></header>
}

function NavItem({ link, onClick, linkRef }) { return <NavLink ref={linkRef} to={link.to} end={link.to === '/'} onClick={onClick} className={({ isActive }) => `relative block min-h-10 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'bg-[var(--accent)] text-black md:bg-transparent md:text-[var(--text)]' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] md:hover:bg-transparent'}`}>{({ isActive }) => <>{link.label}{isActive && <span className="absolute inset-x-3 -bottom-1 hidden h-0.5 bg-[var(--accent)] md:block" />}</>}</NavLink> }
const MenuIcon = forwardRef(function MenuIcon(_, ref) { return <svg ref={ref} aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg> })
export default Navbar
