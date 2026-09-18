import { useEffect, useRef } from 'react'

function HeroFade({ children }) {
  const ref = useRef(null)
  useEffect(() => {
    const element = ref.current
    const hero = element?.closest('[data-hero]')
    if (!element || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(hero.offsetHeight, 1))); element.style.opacity = `${1 - progress}`; element.style.transform = `translateY(${-40 * progress}px)` }) }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div ref={ref}>{children}</div>
}

export default HeroFade
