import { motion } from 'motion/react'

function Chevron({ direction }) {
  return <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={direction === 'up' ? 'm3.5 10 4.5-4.5 4.5 4.5' : 'm3.5 6 4.5 4.5L12.5 6'} /></svg>
}

function SectionDots({ activeIndex, onSelect, count }) {
  const atFirst = activeIndex === 0
  const atLast = activeIndex === count - 1

  return <nav className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex" aria-label="Page sections">
    <motion.button type="button" aria-label="Previous section" disabled={atFirst} className="grid h-5 w-5 place-items-center rounded-full border-0 bg-transparent p-0 text-[var(--muted)] disabled:cursor-not-allowed" animate={{ opacity: atFirst ? .25 : 1 }} whileHover={atFirst ? undefined : { scale: 1.15, color: 'var(--accent)' }} onClick={() => onSelect(activeIndex - 1, true)}><Chevron direction="up" /></motion.button>
    {Array.from({ length: count }, (_, index) => {
      const active = index === activeIndex
      return <motion.button key={index} type="button" aria-label={`Go to section ${index + 1}`} aria-current={active ? 'step' : undefined} className="block h-2 w-2 rounded-full border-0 p-0" animate={{ scale: active ? 1.35 : 1, backgroundColor: active ? 'var(--accent)' : 'var(--muted)', opacity: active ? 1 : .5 }} transition={{ duration: .2 }} onClick={() => onSelect(index, true)} />
    })}
    <motion.button type="button" aria-label="Next section" disabled={atLast} className="grid h-5 w-5 place-items-center rounded-full border-0 bg-transparent p-0 text-[var(--muted)] disabled:cursor-not-allowed" animate={{ opacity: atLast ? .25 : 1 }} whileHover={atLast ? undefined : { scale: 1.15, color: 'var(--accent)' }} onClick={() => onSelect(activeIndex + 1, true)}><Chevron direction="down" /></motion.button>
  </nav>
}

export default SectionDots
