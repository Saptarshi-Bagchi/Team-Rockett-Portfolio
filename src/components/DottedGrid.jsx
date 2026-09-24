import { useEffect, useRef } from 'react'

const lerp = (from, to, amount) => from + (to - from) * amount
const hexToRgb = (value) => { const hex = value.replace('#', ''); if (hex.length !== 6) return [115, 115, 115]; return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)] }
const mix = (from, to, amount) => from.map((value, index) => Math.round(lerp(value, to[index], amount)))
const color = (value, alpha = 1) => `rgba(${value.join(', ')}, ${alpha})`

function DottedGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined
    let dots = []
    let frame = 0
    let dpr = 1
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, glow: 0, targetGlow: 0 }
    let dotColor = [115, 115, 115]
    let accentColor = [179, 62, 85]
    let targetDotColor = dotColor
    let targetAccentColor = accentColor

    const readColors = () => { const styles = getComputedStyle(document.documentElement); targetDotColor = hexToRgb(styles.getPropertyValue('--grid-dot').trim()); targetAccentColor = hexToRgb(styles.getPropertyValue('--accent').trim()) }
    const draw = () => {
      dotColor = mix(dotColor, targetDotColor, .1)
      accentColor = mix(accentColor, targetAccentColor, .1)
      pointer.x = lerp(pointer.x, pointer.targetX, .15)
      pointer.y = lerp(pointer.y, pointer.targetY, .15)
      pointer.glow = lerp(pointer.glow, pointer.targetGlow, .15)
      context.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach((item) => {
        const distance = Math.hypot(pointer.x - item.x, pointer.y - item.y)
        const raw = Math.max(0, 1 - distance / 150)
        const influence = raw * raw * (3 - 2 * raw) * pointer.glow
        const blended = mix(dotColor, accentColor, influence * .55)
        if (influence > .01) { context.beginPath(); context.fillStyle = color(accentColor, .08 * influence); context.arc(item.x * dpr, item.y * dpr, 3.5 * dpr, 0, Math.PI * 2); context.fill() }
        context.beginPath(); context.fillStyle = color(blended, .18 + influence * .37); context.arc(item.x * dpr, item.y * dpr, 1.5 * dpr, 0, Math.PI * 2); context.fill()
      })
    }
    const render = () => { draw(); if (!document.hidden && !reducedMotion) frame = requestAnimationFrame(render) }
    const resize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; dots = []; for (let y = 16; y < window.innerHeight + 32; y += 30) for (let x = 16; x < window.innerWidth + 32; x += 30) dots.push({ x, y }); draw() }
    const updatePointer = (event) => { pointer.targetX = event.clientX; pointer.targetY = event.clientY; pointer.targetGlow = 1 }
    const updateTouch = (event) => { const touch = event.touches[0]; if (touch) updatePointer(touch) }
    const clearPointer = () => { pointer.targetGlow = 0 }
    const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden && !reducedMotion) frame = requestAnimationFrame(render) }
    const themeObserver = new MutationObserver(() => readColors())
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionChange = (event) => { reducedMotion = event.matches; cancelAnimationFrame(frame); resize(); if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(render) }

    readColors(); resize(); if (!reducedMotion) frame = requestAnimationFrame(render)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', updatePointer, { passive: true })
    window.addEventListener('pointerleave', clearPointer, { passive: true })
    window.addEventListener('touchmove', updateTouch, { passive: true })
    window.addEventListener('touchend', clearPointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    motionQuery.addEventListener?.('change', motionChange)
    return () => { cancelAnimationFrame(frame); themeObserver.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', updatePointer); window.removeEventListener('pointerleave', clearPointer); window.removeEventListener('touchmove', updateTouch); window.removeEventListener('touchend', clearPointer); document.removeEventListener('visibilitychange', visibility); motionQuery.removeEventListener?.('change', motionChange) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
}

export default DottedGrid
