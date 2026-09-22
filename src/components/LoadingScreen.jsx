import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const MIN_DISPLAY_TIME = 3000
const SAFETY_TIMEOUT = 5000
const LINE_ENTRY_DURATION = 0.7
const lineEntryVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

function LoadingScreen() {
  const [shouldShow] = useState(() => {
    try {
      return sessionStorage.getItem('team-loading-seen') !== 'true'
    } catch {
      return true
    }
  })
  const [visible, setVisible] = useState(shouldShow)
  const [exiting, setExiting] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!shouldShow) return undefined
    try { sessionStorage.setItem('team-loading-seen', 'true') } catch (error) { console.error('Portfolio could not persist loading state.', error) }
    const startedAt = performance.now()
    let finished = false
    let fadeTimer
    let removeTimer
    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_DISPLAY_TIME - (performance.now() - startedAt))
      window.setTimeout(() => {
        setExiting(true)
        removeTimer = window.setTimeout(() => setVisible(false), 500)
      }, wait)
    }
    const onLoad = () => finish()
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', onLoad, { once: true })
    fadeTimer = window.setTimeout(finish, SAFETY_TIMEOUT)
    return () => { window.removeEventListener('load', onLoad); window.clearTimeout(fadeTimer); window.clearTimeout(removeTimer) }
  }, [shouldShow])

  if (!shouldShow || !visible) return null
  return <div className={`loading-screen ${exiting ? 'is-exiting' : ''}`} role="status" aria-live="polite" aria-label="Loading Team Rocket portfolio">
    <div className="loading-screen-content" style={{ '--loading-line-duration': `${MIN_DISPLAY_TIME}ms` }} aria-hidden="true"><motion.div variants={lineEntryVariants} initial={reducedMotion ? false : 'hidden'} animate="visible" transition={{ duration: reducedMotion ? 0 : LINE_ENTRY_DURATION, ease: [0.22, 1, 0.36, 1] }}><p className="loading-line is-visible">Prepare for trouble!</p></motion.div><motion.div variants={lineEntryVariants} initial={reducedMotion ? false : 'hidden'} animate="visible" transition={{ duration: reducedMotion ? 0 : LINE_ENTRY_DURATION, delay: reducedMotion ? 0 : LINE_ENTRY_DURATION, ease: [0.22, 1, 0.36, 1] }}><p className="loading-line loading-screen-accent is-visible">And make it double!</p></motion.div><div className="loading-dots"><span /><span /><span /></div></div>
    <span className="sr-only">Loading Team Rocket portfolio</span>
  </div>
}

export default LoadingScreen
