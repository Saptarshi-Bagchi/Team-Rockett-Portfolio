import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import members from '../data/members'
import MemberToggle from '../components/MemberToggle'
import PageHero from '../components/PageHero'
import ReactiveText from '../components/ReactiveText'
import SectionDots from '../components/SectionDots'
import useSectionSnap from '../hooks/useSectionSnap'
import { DEBUG_SECTION_BORDERS } from '../config/debug'

const memberDetails = members.map((member) => ({
  ...member,
  position: member.position || member.role || '',
  skills: member.skills || [],
  github: member.github || member.links?.github || '',
  linkedin: member.linkedin || member.links?.linkedin || '',
}))

const memberSectionFrame = 'box-border h-[calc(100dvh-var(--member-navbar-height))] !min-h-0'

function GithubIcon() {
  return <svg aria-hidden="true" className="h-5 w-5 max-[799px]:h-4 max-[799px]:w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.4.3.7 1 .7 1.9V21c0 .3.2.5.7.5A10 10 0 0 0 12 2Z" /></svg>
}

function LinkedinIcon() {
  return <svg aria-hidden="true" className="h-5 w-5 max-[799px]:h-4 max-[799px]:w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.2H2.3V21h2.8V8.2ZM3.7 3A1.7 1.7 0 1 0 3.7 6.4 1.7 1.7 0 0 0 3.7 3ZM21.7 13.7c0-3.9-2.1-5.7-4.9-5.7-2.2 0-3.2 1.2-3.8 2v-1.8h-2.8V21H13v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21h2.8l-.5-7.3Z" /></svg>
}

function Members() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { activeIndex, goToSection, setSectionRef } = useSectionSnap(3)
  const selectedMember = memberDetails[selectedIndex]
  const [imageFailed, setImageFailed] = useState(false)
  const initials = selectedMember.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
  const debugClass = DEBUG_SECTION_BORDERS ? 'debug-section' : ''
  const membersPageRef = useRef(null)

  useEffect(() => setImageFailed(false), [selectedIndex])

  useLayoutEffect(() => {
    setSectionRef(2)(document.querySelector('footer'))
  }, [setSectionRef])

  useLayoutEffect(() => {
    const wrapper = membersPageRef.current
    const navbar = document.querySelector('header')
    if (!wrapper || !navbar) return undefined

    const updateNavbarHeight = () => wrapper.style.setProperty('--member-navbar-height', `${navbar.getBoundingClientRect().height}px`)
    updateNavbarHeight()
    const observer = new ResizeObserver(updateNavbarHeight)
    observer.observe(navbar)
    window.addEventListener('resize', updateNavbarHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateNavbarHeight)
    }
  }, [])

  return <div ref={membersPageRef} className="relative" style={{ '--member-navbar-height': 'var(--nav-h)' }}><PageHero ref={setSectionRef(0)} className={debugClass} eyebrow="The people behind it" heading="Meet the" accent="Team" subtitle="TODO: Meet the curious people learning, building, and growing together." /><SectionDots activeIndex={Math.min(activeIndex, 1)} onSelect={goToSection} count={2} /><section ref={setSectionRef(1)} style={{ scrollMarginTop: 'calc(var(--member-navbar-height) - var(--nav-h))' }} className={`${debugClass} ${memberSectionFrame} flex flex-col px-5 lg:px-8`}>
    <div className="box-border mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-3 py-8 md:px-0">
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto_auto] gap-3 rounded-2xl bg-black p-5 text-white md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)_auto] md:gap-x-12 md:gap-y-0 md:px-12 md:py-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`text-${selectedIndex}`} className="order-2 flex min-h-0 shrink-0 flex-col items-center justify-center gap-3 text-center md:order-1 md:col-start-1 md:row-start-1 md:h-full md:items-start md:text-left" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3, ease: 'easeOut' }}>
            <h2 className="max-w-full break-words text-[clamp(1.375rem,calc(1rem+2vw),1.75rem)] font-bold leading-tight text-balance line-clamp-2 md:text-[clamp(1.75rem,calc(1.4rem+1.2vw),2.75rem)]"><ReactiveText text={selectedMember.name} /></h2>
            {selectedMember.position && <p className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--accent)] md:text-sm md:tracking-[.16em]">{selectedMember.position}</p>}
            <p className="line-clamp-3 max-w-lg text-sm leading-5 text-white/70 md:text-base md:leading-6"><ReactiveText text={selectedMember.bio} mode="paragraph" /></p>
            {selectedMember.skills.length > 0 && <div className="flex flex-wrap justify-center gap-2 md:justify-start">{selectedMember.skills.map((skill) => <span key={skill} className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70 md:px-2.5 md:py-1">{skill}</span>)}</div>}
            {(selectedMember.github || selectedMember.linkedin) && <div className="flex justify-center gap-5 text-white/70 md:justify-start">{selectedMember.github && <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMember.name} on GitHub`} className="transition-colors hover:text-[var(--accent)]"><GithubIcon /></a>}{selectedMember.linkedin && <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMember.name} on LinkedIn`} className="transition-colors hover:text-[var(--accent)]"><LinkedinIcon /></a>}</div>}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`image-${selectedIndex}`} className="order-1 flex min-h-0 min-w-0 flex-1 items-center justify-center md:order-1 md:col-start-2 md:row-span-2 md:row-start-1 md:h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3, ease: 'easeOut' }}>
            {selectedMember.image && !imageFailed ? <img src={selectedMember.image} alt={selectedMember.name} className="h-auto max-h-full max-w-full w-auto rounded-xl object-contain" onError={() => setImageFailed(true)} /> : <div className="flex h-full min-h-0 w-full items-center justify-center font-bold text-6xl text-[var(--accent)]">{initials}</div>}
          </motion.div>
        </AnimatePresence>
        <MemberToggle members={memberDetails} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      </div>
    </div>
  </section></div>
}

export default Members
