import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'motion/react'

const REVEAL_DURATION = 650
const REST_DANGLE = 60
const PULL_THRESHOLD = 36
const MAX_PULL_DISTANCE = 200
const CORD_START = 2

function ThemeSwitch({ anchorTargetRef, fallbackRef, navbarRef }) {
  const knobRef = useRef(null)
  const mobileKnobRef = useRef(null)
  const dragStart = useRef(null)
  const latestPointer = useRef(null)
  const frameRef = useRef(null)
  const suppressClick = useRef(false)
  const tugTimer = useRef(null)
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  const [anchor, setAnchor] = useState({ x: 32, y: 72 })
  const [mobileLayout, setMobileLayout] = useState(false)
  const [position, setPosition] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [springing, setSpringing] = useState(false)
  const [tugging, setTugging] = useState(false)
  const isDark = theme === 'dark'
  const rest = { x: 32, y: CORD_START + REST_DANGLE }
  const knobPosition = position || rest

  useEffect(() => {
    const measureAnchor = () => {
      const target = anchorTargetRef.current
      const fallback = fallbackRef.current
      const navbar = navbarRef.current
      if (!target || !navbar) return
      const targetRect = target.getBoundingClientRect()
      const navbarRect = navbar.getBoundingClientRect()
      const mobile = window.matchMedia('(max-width: 767px)').matches
      const fallbackRect = fallback?.getBoundingClientRect()
      const x = mobile && fallbackRect ? fallbackRect.left + fallbackRect.width / 2 : targetRect.right + (window.innerWidth - targetRect.right) / 2
      setMobileLayout(mobile)
      setAnchor({ x, y: navbarRect.bottom })
      setPosition(null)
    }
    measureAnchor()
    window.addEventListener('resize', measureAnchor)
    window.addEventListener('load', measureAnchor)
    const observer = new ResizeObserver(measureAnchor)
    observer.observe(navbarRef.current)
    if (document.fonts?.ready) document.fonts.ready.then(measureAnchor)
    return () => { window.removeEventListener('resize', measureAnchor); window.removeEventListener('load', measureAnchor); observer.disconnect() }
  }, [anchorTargetRef, fallbackRef, navbarRef])

  useEffect(() => () => { window.clearTimeout(tugTimer.current); window.cancelAnimationFrame(frameRef.current) }, [])

  const selectTheme = (nextTheme, activatedElement = knobRef.current) => {
    if (nextTheme === theme) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const applyTheme = () => { document.documentElement.dataset.theme = nextTheme; flushSync(() => setTheme(nextTheme)); try { localStorage.setItem('team-theme', nextTheme) } catch (error) { console.error('Portfolio could not persist the theme preference.', error) } }
    if (reducedMotion) { applyTheme(); return }
    const rect = activatedElement?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    if (document.startViewTransition) {
      const transition = document.startViewTransition(applyTheme)
      transition.ready.then(() => { const width = Math.max(window.innerWidth, document.documentElement.clientWidth); const height = Math.max(window.innerHeight, document.documentElement.clientHeight); const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y)); document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: REVEAL_DURATION, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }) }).catch(() => {})
    } else { applyTheme(); document.documentElement.classList.add('theme-transition'); window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 400) }
  }

  const toggle = (activatedElement = knobRef.current) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { selectTheme(isDark ? 'light' : 'dark', activatedElement); return }
    setTugging(true)
    window.clearTimeout(tugTimer.current)
    tugTimer.current = window.setTimeout(() => { selectTheme(isDark ? 'light' : 'dark', activatedElement); setTugging(false) }, 70)
  }

  const updateFromPointer = (clientX, clientY) => {
    if (!dragStart.current) return null
    const raw = { x: dragStart.current.position.x + clientX - dragStart.current.x, y: dragStart.current.position.y + clientY - dragStart.current.y }
    const dx = raw.x - rest.x
    const dy = raw.y - rest.y
    const distance = Math.hypot(dx, dy)
    const scale = distance > MAX_PULL_DISTANCE ? MAX_PULL_DISTANCE / distance : 1
    const next = { x: rest.x + dx * scale, y: rest.y + dy * scale }
    if (distance > 3) suppressClick.current = true
    setPosition(next)
    return next
  }

  const schedulePointerFrame = () => {
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      if (latestPointer.current) updateFromPointer(latestPointer.current.x, latestPointer.current.y)
    })
  }

  const onWindowPointerMove = (event) => {
    if (!dragStart.current || event.pointerId !== dragStart.current.pointerId) return
    latestPointer.current = { x: event.clientX, y: event.clientY }
    schedulePointerFrame()
  }
  const removeWindowListeners = () => {
    window.removeEventListener('pointermove', onWindowPointerMove)
    window.removeEventListener('pointerup', onWindowPointerUp)
    window.removeEventListener('pointercancel', onWindowPointerUp)
  }
  const onWindowPointerUp = (event) => {
    if (!dragStart.current || event.pointerId !== dragStart.current.pointerId) return
    latestPointer.current = { x: event.clientX, y: event.clientY }
    const finalPosition = updateFromPointer(event.clientX, event.clientY)
    const pulled = finalPosition ? Math.hypot(finalPosition.x - rest.x, finalPosition.y - rest.y) : 0
    dragStart.current = null
    latestPointer.current = null
    window.cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    setDragging(false)
    setSpringing(true)
    setPosition(rest)
    if (pulled >= PULL_THRESHOLD) selectTheme(isDark ? 'light' : 'dark', knobRef.current)
    removeWindowListeners()
    try { knobRef.current?.releasePointerCapture(event.pointerId) } catch { /* capture may already be released */ }
  }
  const onPointerDown = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId, position: knobPosition }
    latestPointer.current = { x: event.clientX, y: event.clientY }
    suppressClick.current = false
    setDragging(true)
    setSpringing(false)
    window.addEventListener('pointermove', onWindowPointerMove)
    window.addEventListener('pointerup', onWindowPointerUp)
    window.addEventListener('pointercancel', onWindowPointerUp)
  }
  const onClick = () => { if (suppressClick.current) { suppressClick.current = false; return } toggle(knobRef.current) }

  const desktopPosition = { right: `${window.innerWidth - anchor.x - 32}px` }
  const mobilePosition = { left: anchor.x - 32 }
  return <><button type="button" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" className={`navbar-theme-toggle ${dragging ? 'is-dragging' : ''}`} style={mobileLayout ? mobilePosition : desktopPosition} onClick={onClick}><svg className="navbar-theme-cord" aria-hidden="true" viewBox="0 0 64 140" preserveAspectRatio="none"><line x1="32" y1={CORD_START} x2={knobPosition.x} y2={knobPosition.y} /></svg><span ref={knobRef} className={`navbar-theme-knob ${springing ? 'is-springing' : ''} ${tugging ? 'is-tugging' : ''}`} style={{ left: knobPosition.x, top: knobPosition.y }} onPointerDown={onPointerDown} aria-hidden="true">{isDark ? <MoonIcon /> : <SunIcon />}</span></button><button type="button" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" className="navbar-theme-mobile" onClick={() => toggle(mobileKnobRef.current)}><SunIcon /><motion.span ref={mobileKnobRef} className="navbar-theme-mobile-thumb" animate={{ x: isDark ? 28 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}><span>{isDark ? <MoonIcon /> : <SunIcon />}</span></motion.span><MoonIcon /></button></>
}

function SunIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> }
function MoonIcon() { return <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 15.5A8.4 8.4 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" /></svg> }

export default ThemeSwitch
