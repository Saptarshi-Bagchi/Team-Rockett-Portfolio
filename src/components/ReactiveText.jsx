import { useEffect, useRef } from 'react'

const instances = new Set()
const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false }
let frame = 0
let listening = false

const clamp = (value) => Math.max(0, Math.min(1, value))
const updatePointer = (event) => { const touch = event.touches?.[0]; pointer.targetX = touch?.clientX ?? event.clientX; pointer.targetY = touch?.clientY ?? event.clientY; pointer.active = true }
const clearPointer = () => { pointer.targetX = -1000; pointer.targetY = -1000; pointer.active = false }
const tick = () => {
  pointer.x += (pointer.targetX - pointer.x) * .15
  pointer.y += (pointer.targetY - pointer.y) * .15
  instances.forEach((instance) => {
    const box = instance.element.getBoundingClientRect()
    const onScreen = box.bottom >= 0 && box.top <= window.innerHeight
    if (!onScreen) return
    instance.spans.forEach((span) => {
      const rect = span.node.getBoundingClientRect()
      const distance = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2))
      const raw = pointer.active ? clamp(1 - distance / 120) : 0
      const eased = raw * raw * (3 - 2 * raw)
      span.value += (eased - span.value) * .15
      span.node.style.setProperty('--t', span.value.toFixed(3))
    })
  })
  if (listening) frame = requestAnimationFrame(tick)
}
const start = () => { if (listening) return; listening = true; window.addEventListener('pointermove', updatePointer, { passive: true }); window.addEventListener('pointerleave', clearPointer, { passive: true }); window.addEventListener('touchmove', updatePointer, { passive: true }); window.addEventListener('touchend', clearPointer, { passive: true }); document.addEventListener('visibilitychange', clearPointer); frame = requestAnimationFrame(tick) }
const stop = () => { listening = false; cancelAnimationFrame(frame); window.removeEventListener('pointermove', updatePointer); window.removeEventListener('pointerleave', clearPointer); window.removeEventListener('touchmove', updatePointer); window.removeEventListener('touchend', clearPointer); document.removeEventListener('visibilitychange', clearPointer) }

function ReactiveText({ text, as: Tag = 'span', accentWords = [], mode = 'heading', className = '' }) {
  const ref = useRef(null)
  const words = text.split(' ')
  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches && mode === 'heading') return undefined
    const spans = [...element.querySelectorAll('[data-reactive-span]')].map((node) => ({ node, value: 0 }))
    const instance = { element, spans }
    instances.add(instance); start()
    return () => { instances.delete(instance); if (!instances.size) stop() }
  }, [mode])
  return <Tag ref={ref} aria-label={text} className={`reactive-text reactive-${mode} ${className}`}>{words.map((word, wordIndex) => <span key={`${word}-${wordIndex}`} className="reactive-word">{[...word].map((character, characterIndex) => <span key={`${character}-${characterIndex}`} data-reactive-span aria-hidden="true" className={`reactive-char ${accentWords.includes(word) ? 'is-accent' : ''}`}>{character}</span>)}{wordIndex < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}</span>)}</Tag>
}

export default ReactiveText
