import { useEffect, useRef, useState } from 'react'

function Reveal({ children, variant = 'fade-up', delay = 0, duration = 700, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setVisible(true); return undefined }
    const show = () => setVisible(true)
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { show(); observer.disconnect() } }, { threshold: .15, rootMargin: '0px 0px -8% 0px' })
    observer.observe(element)
    const fallback = window.setTimeout(show, 1500)
    if (element.getBoundingClientRect().top < window.innerHeight) show()
    return () => { observer.disconnect(); window.clearTimeout(fallback) }
  }, [])

  return <div ref={ref} className={`reveal reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms`, '--reveal-duration': `${duration}ms` }}>{children}</div>
}

export default Reveal
