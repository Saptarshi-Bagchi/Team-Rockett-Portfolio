import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

const DEFAULT_SLOT_WIDTH = 72

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = () => setMatches(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [query])

  return matches
}

function Chevron({ direction }) {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={direction === 'left' ? 'm10 3.5-4.5 4.5L10 12.5' : 'm6 3.5 4.5 4.5L6 12.5'} /></svg>
}

function MemberSlot({ member, offset, trackX, slotWidth, visible, active, onClick, onKeyDown }) {
  const distance = useTransform(trackX, (value) => Math.abs(offset * slotWidth + value) / slotWidth)
  const size = useTransform(distance, [0, 1, 2], [56, 44, 36])
  const opacity = useTransform(distance, [0, 1, 2], [1, .85, .55])

  return <div aria-hidden={!visible} className="flex h-full w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1" style={{ width: slotWidth === DEFAULT_SLOT_WIDTH ? undefined : slotWidth }}>
    <motion.button type="button" role={visible ? 'tab' : undefined} aria-selected={visible ? active : undefined} aria-label={visible ? member.name : undefined} tabIndex={visible && active ? 0 : -1} className={`shrink-0 rounded-full ${visible ? 'pointer-events-auto' : 'pointer-events-none'} ${active ? 'border-2 border-white p-[3px]' : ''}`} style={{ width: size, height: size, opacity }} onClick={visible && !active ? onClick : undefined} onKeyDown={visible && active ? onKeyDown : undefined}><img src={member.image} alt="" className="h-full w-full rounded-full object-cover" /></motion.button>
    {active && <span className="max-w-full truncate text-xs text-white">{member.name.split(' ')[0]}</span>}
  </div>
}

function MemberToggle({ members, selectedIndex, onSelect }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const visibleCount = isMobile ? 3 : 5
  const halfCount = (visibleCount - 1) / 2
  const trackX = useMotionValue(0)
  const containerRef = useRef(null)
  const pendingOffset = useRef(null)
  const running = useRef(false)
  const reducedMotion = useRef(false)
  const [slotWidth, setSlotWidth] = useState(DEFAULT_SLOT_WIDTH)

  useLayoutEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const updateSlotWidth = () => {
      const arrowWidth = isMobile ? 88 : 64
      const available = container.getBoundingClientRect().width - arrowWidth - 32
      setSlotWidth(isMobile ? Math.min(DEFAULT_SLOT_WIDTH, Math.max(48, available / 3)) : DEFAULT_SLOT_WIDTH)
    }

    updateSlotWidth()
    const observer = new ResizeObserver(updateSlotWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [isMobile])

  useLayoutEffect(() => {
    trackX.set(0)
    pendingOffset.current = null
    running.current = false
  }, [visibleCount, slotWidth, trackX])

  useLayoutEffect(() => {
    if (pendingOffset.current === null) return undefined
    const offset = pendingOffset.current
    pendingOffset.current = null
    trackX.set(reducedMotion.current ? 0 : offset * slotWidth)

    if (reducedMotion.current) {
      running.current = false
      return undefined
    }

    const controls = animate(trackX, 0, { duration: .4, ease: [0.22, 1, 0.36, 1], onComplete: () => { running.current = false } })
    return () => controls.stop()
  }, [selectedIndex, slotWidth, trackX])

  const selectOffset = (offset) => {
    if (running.current || offset === 0) return
    running.current = true
    pendingOffset.current = offset
    onSelect((selectedIndex + offset + members.length) % members.length)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    selectOffset(event.key === 'ArrowRight' ? 1 : -1)
  }

  const offsets = Array.from({ length: visibleCount + 4 }, (_, index) => index - halfCount - 2)
  const wheelWidth = visibleCount * slotWidth + 16

  return <div ref={containerRef} className="order-3 flex w-full items-center justify-start gap-2 text-white/70 max-md:justify-center md:col-start-1 md:row-start-2">
    <button type="button" aria-label="Previous member" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:text-white md:h-8 md:w-8" onClick={() => selectOffset(-1)}><Chevron direction="left" /></button>
    <div role="tablist" aria-label="Team members" className="h-[4.75rem] w-[23.5rem] max-w-[calc(100%-5rem)] shrink-0 overflow-hidden rounded-full px-2" style={{ width: isMobile ? wheelWidth : undefined }}>
      <motion.div className="flex h-full" style={{ x: trackX, marginLeft: isMobile ? -2 * slotWidth : '-9rem' }}>
        {offsets.map((offset) => {
          const index = (selectedIndex + offset + members.length) % members.length
          return <MemberSlot key={`${members[index].name}-${offset}`} member={members[index]} offset={offset} trackX={trackX} slotWidth={slotWidth} visible={Math.abs(offset) <= halfCount} active={offset === 0} onClick={() => selectOffset(offset)} onKeyDown={handleKeyDown} />
        })}
      </motion.div>
    </div>
    <button type="button" aria-label="Next member" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:text-white md:h-8 md:w-8" onClick={() => selectOffset(1)}><Chevron direction="right" /></button>
  </div>
}

export default MemberToggle
