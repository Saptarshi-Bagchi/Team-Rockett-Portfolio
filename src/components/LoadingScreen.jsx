import { useEffect, useState } from 'react'

const SECOND_LINE_DELAY = 1300
const MIN_DISPLAY_TIME = 3000
const SAFETY_TIMEOUT = 5000

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
  const [secondLineVisible, setSecondLineVisible] = useState(false)

  useEffect(() => {
    if (!shouldShow) return undefined
    try { sessionStorage.setItem('team-loading-seen', 'true') } catch (error) { console.error('Portfolio could not persist loading state.', error) }
    const startedAt = performance.now()
    let finished = false
    let secondLineTimer
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
    secondLineTimer = window.setTimeout(() => setSecondLineVisible(true), SECOND_LINE_DELAY)
    const onLoad = () => finish()
    if (document.readyState === 'complete') finish()
    else window.addEventListener('load', onLoad, { once: true })
    fadeTimer = window.setTimeout(finish, SAFETY_TIMEOUT)
    return () => { window.removeEventListener('load', onLoad); window.clearTimeout(secondLineTimer); window.clearTimeout(fadeTimer); window.clearTimeout(removeTimer) }
  }, [shouldShow])

  if (!shouldShow || !visible) return null
  return <div className={`loading-screen ${exiting ? 'is-exiting' : ''}`} role="status" aria-live="polite" aria-label="Loading Team Rocket portfolio">
    <div className="loading-screen-content" aria-hidden="true"><p className="loading-line is-visible">Prepare for trouble!</p><p className={`loading-line loading-screen-accent ${secondLineVisible ? 'is-visible' : ''}`}>And make it double!</p><div className="loading-dots"><span /><span /><span /></div></div>
    <span className="sr-only">Loading Team Rocket portfolio</span>
  </div>
}

export default LoadingScreen
