import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import teamPhotos from '../data/teamPhotos'

function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef(null)
  const touchStart = useRef(null)

  const goTo = (index) => setActiveIndex((index + teamPhotos.length) % teamPhotos.length)
  const next = () => setActiveIndex((index) => (index + 1) % teamPhotos.length)
  const previous = () => setActiveIndex((index) => (index - 1 + teamPhotos.length) % teamPhotos.length)
  const relativePosition = (index) => {
    const distance = index - activeIndex
    if (distance === 0) return 0
    if (distance === 1 || distance === -(teamPhotos.length - 1)) return 1
    if (distance === -1 || distance === teamPhotos.length - 1) return -1
    return 2
  }

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.15 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    const onVisibilityChange = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibilityChange) }
  }, [])

  useEffect(() => {
    if (paused || !isVisible) return undefined
    const timer = window.setInterval(next, 5000)
    return () => window.clearInterval(timer)
  }, [isVisible, paused])

  useEffect(() => {
    ;[activeIndex - 1, activeIndex + 1].forEach((index) => {
      const image = new Image()
      image.src = teamPhotos[(index + teamPhotos.length) % teamPhotos.length].src
    })
  }, [activeIndex])

  const handleTouchStart = (event) => { touchStart.current = event.touches[0].clientX; setPaused(true) }
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const delta = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 40) (delta < 0 ? next : previous)()
    touchStart.current = null
    window.setTimeout(() => setPaused(false), 3000)
  }

  return <Reveal variant="fade-up"><section ref={sectionRef} className="team-carousel" role="region" aria-roledescription="carousel" aria-label="Team photos" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); previous() } if (event.key === 'ArrowRight') { event.preventDefault(); next() } }} tabIndex="0">
    <div className="team-carousel-frame" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={`team-carousel-wheel ${reducedMotion ? 'is-reduced-motion' : ''}`}>
        {teamPhotos.map((photo, index) => {
          const position = relativePosition(index)
          const isCenter = position === 0
          return <button key={photo.src} type="button" className={`team-carousel-slide team-carousel-slide-${position}`} aria-hidden={!isCenter} tabIndex={isCenter ? 0 : -1} onClick={() => { if (!isCenter) goTo(index) }}><img src={photo.src} alt={isCenter ? photo.alt : ''} /></button>
        })}
      </div>
      <button type="button" className="team-carousel-control team-carousel-prev" aria-label="Previous photo" onClick={previous}>‹</button>
      <button type="button" className="team-carousel-control team-carousel-next" aria-label="Next photo" onClick={next}>›</button>
    </div>
    <p className="sr-only" aria-live="polite">Photo {activeIndex + 1} of {teamPhotos.length}</p>
    <div className="team-carousel-dots" aria-label="Choose team photo">{teamPhotos.map((photo, index) => <button key={photo.src} type="button" aria-label={`Go to photo ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => goTo(index)} />)}</div>
  </section></Reveal>
}

export default TeamCarousel
