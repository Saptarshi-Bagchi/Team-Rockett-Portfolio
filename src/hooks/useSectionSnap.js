import { useCallback, useEffect, useRef, useState } from 'react'

const WHEEL_THRESHOLD = 10
const SWIPE_THRESHOLD = 40
const TRANSITION_LOCK_MS = 700

function useSectionSnap(sectionCount) {
  const sectionRefs = useRef([])
  const activeIndexRef = useRef(0)
  const touchStartY = useRef(null)
  const transitionTimeout = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const setSectionRef = useCallback((index) => (element) => {
    sectionRefs.current[index] = element
  }, [])

  const getSectionTarget = useCallback((index) => {
    const section = sectionRefs.current[index]
    if (!section) return 0
    const scrollPaddingTop = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    return Math.max(0, section.getBoundingClientRect().top + window.scrollY - scrollPaddingTop)
  }, [])

  const goToSection = useCallback((nextIndex, force = false) => {
    const clampedIndex = Math.max(0, Math.min(sectionCount - 1, nextIndex))
    const alreadyAtTarget = Math.abs(getSectionTarget(clampedIndex) - window.scrollY) < 4
    if (!force && clampedIndex === activeIndexRef.current && alreadyAtTarget) return false

    activeIndexRef.current = clampedIndex
    setActiveIndex(clampedIndex)
    sectionRefs.current[clampedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    window.clearTimeout(transitionTimeout.current)
    transitionTimeout.current = window.setTimeout(() => {
      transitionTimeout.current = null
    }, TRANSITION_LOCK_MS)

    return true
  }, [getSectionTarget, sectionCount])

  useEffect(() => {
    const container = sectionRefs.current[0]?.parentElement
    if (!container) return undefined

    document.documentElement.classList.add('no-scrollbar')

    const getNearestSectionIndex = () => {
      const scrollY = window.scrollY
      return sectionRefs.current.reduce((nearestIndex, section, index) => {
        if (!section) return nearestIndex
        return Math.abs(getSectionTarget(index) - scrollY) < Math.abs(getSectionTarget(nearestIndex) - scrollY) ? index : nearestIndex
      }, 0)
    }

    const syncActiveIndex = () => {
      if (transitionTimeout.current) return
      const nearestIndex = getNearestSectionIndex()
      if (nearestIndex !== activeIndexRef.current) {
        activeIndexRef.current = nearestIndex
        setActiveIndex(nearestIndex)
      }
    }

    syncActiveIndex()

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) <= WHEEL_THRESHOLD) return

      const direction = event.deltaY > 0 ? 1 : -1
      syncActiveIndex()
      const currentIndex = activeIndexRef.current
      const lastIndex = sectionCount - 1
      const beforeFirstSection = window.scrollY < getSectionTarget(0) - 20
      const beyondLastSection = currentIndex === lastIndex && window.scrollY > getSectionTarget(lastIndex) + 20

      if (direction > 0 && beforeFirstSection) {
        event.preventDefault()
        goToSection(0, true)
        return
      }

      if (direction < 0 && beyondLastSection) {
        event.preventDefault()
        goToSection(lastIndex, true)
        return
      }

      const nextIndex = currentIndex + direction
      const canSnap = nextIndex >= 0 && nextIndex < sectionCount

      if (transitionTimeout.current) {
        if (canSnap) event.preventDefault()
        return
      }

      if (canSnap) {
        event.preventDefault()
        goToSection(nextIndex)
      }
    }

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchEnd = (event) => {
      if (touchStartY.current === null) return

      const endY = event.changedTouches[0]?.clientY ?? touchStartY.current
      const distance = touchStartY.current - endY
      touchStartY.current = null
      if (Math.abs(distance) < SWIPE_THRESHOLD || transitionTimeout.current) return

      const direction = distance > 0 ? 1 : -1
      syncActiveIndex()
      const lastIndex = sectionCount - 1
      const beforeFirstSection = window.scrollY < getSectionTarget(0) - 20
      if (direction > 0 && beforeFirstSection) {
        event.preventDefault()
        goToSection(0, true)
        return
      }

      if (direction < 0 && activeIndexRef.current === lastIndex && window.scrollY > getSectionTarget(lastIndex) + 20) {
        event.preventDefault()
        goToSection(lastIndex, true)
        return
      }

      const nextIndex = activeIndexRef.current + direction
      if (nextIndex >= 0 && nextIndex < sectionCount) {
        event.preventDefault()
        goToSection(nextIndex)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', syncActiveIndex, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', syncActiveIndex)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.clearTimeout(transitionTimeout.current)
      document.documentElement.classList.remove('no-scrollbar')
    }
  }, [getSectionTarget, goToSection, sectionCount])

  return { activeIndex, goToSection, setSectionRef }
}

export default useSectionSnap
