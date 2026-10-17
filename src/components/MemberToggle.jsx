import { useLayoutEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'

const SLOT_WIDTH = 72
const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4]

function Chevron({ direction }) {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={direction === 'left' ? 'm10 3.5-4.5 4.5L10 12.5' : 'm6 3.5 4.5 4.5L6 12.5'} /></svg>
}

function MemberSlot({ member, offset, trackX, visible, active, onClick, onKeyDown }) {
  const distance = useTransform(trackX, (value) => Math.abs(offset * SLOT_WIDTH + value) / SLOT_WIDTH)
  const size = useTransform(distance, [0, 1, 2], [56, 44, 36])
  const opacity = useTransform(distance, [0, 1, 2], [1, .85, .55])

  return <div aria-hidden={!visible} className="flex h-full w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1">
    <motion.button type="button" role={visible ? 'tab' : undefined} aria-selected={visible ? active : undefined} aria-label={visible ? member.name : undefined} tabIndex={visible && active ? 0 : -1} className={`shrink-0 rounded-full ${visible ? 'pointer-events-auto' : 'pointer-events-none'} ${active ? 'border-2 border-white p-[3px]' : ''}`} style={{ width: size, height: size, opacity }} onClick={visible && !active ? onClick : undefined} onKeyDown={visible && active ? onKeyDown : undefined}><img src={member.image} alt="" className="h-full w-full rounded-full object-cover" /></motion.button>
    {active && <span className="max-w-[4.5rem] truncate text-xs text-white">{member.name.split(' ')[0]}</span>}
  </div>
}

function MemberToggle({ members, selectedIndex, onSelect }) {
  const trackX = useMotionValue(0)
  const pendingOffset = useRef(null)
  const running = useRef(false)
  const reducedMotion = useRef(false)

  useLayoutEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useLayoutEffect(() => {
    if (pendingOffset.current === null) return undefined
    const offset = pendingOffset.current
    pendingOffset.current = null
    trackX.set(reducedMotion.current ? 0 : offset * SLOT_WIDTH)

    if (reducedMotion.current) {
      running.current = false
      return undefined
    }

    const controls = animate(trackX, 0, { duration: .4, ease: [0.22, 1, 0.36, 1], onComplete: () => { running.current = false } })
    return () => controls.stop()
  }, [selectedIndex, trackX])

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

  return <div className="flex w-full items-center justify-start gap-2 text-white/70">
    <button type="button" aria-label="Previous member" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:text-white" onClick={() => selectOffset(-1)}><Chevron direction="left" /></button>
    <div role="tablist" aria-label="Team members" className="h-[4.75rem] w-[23.5rem] max-w-[calc(100%-5rem)] overflow-hidden rounded-full px-2">
      <motion.div className="flex h-full" style={{ x: trackX, marginLeft: '-9rem' }}>
        {offsets.map((offset) => {
          const index = (selectedIndex + offset + members.length) % members.length
          return <MemberSlot key={`${members[index].name}-${offset}`} member={members[index]} offset={offset} trackX={trackX} visible={Math.abs(offset) <= 2} active={offset === 0} onClick={() => selectOffset(offset)} onKeyDown={handleKeyDown} />
        })}
      </motion.div>
    </div>
    <button type="button" aria-label="Next member" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:text-white" onClick={() => selectOffset(1)}><Chevron direction="right" /></button>
  </div>
}

export default MemberToggle
