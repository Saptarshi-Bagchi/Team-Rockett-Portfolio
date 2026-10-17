import { useEffect, useLayoutEffect, useState } from 'react'
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

const memberSectionFrame = 'box-border h-[100dvh] pt-[var(--nav-h)] pb-[var(--nav-h)]'

function GithubIcon() {
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.4.3.7 1 .7 1.9V21c0 .3.2.5.7.5A10 10 0 0 0 12 2Z" /></svg>
}

function LinkedinIcon() {
  return <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M5.1 8.2H2.3V21h2.8V8.2ZM3.7 3A1.7 1.7 0 1 0 3.7 6.4 1.7 1.7 0 0 0 3.7 3ZM21.7 13.7c0-3.9-2.1-5.7-4.9-5.7-2.2 0-3.2 1.2-3.8 2v-1.8h-2.8V21H13v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21h2.8l-.5-7.3Z" /></svg>
}

function Members() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { activeIndex, goToSection, setSectionRef } = useSectionSnap(3)
  const selectedMember = memberDetails[selectedIndex]
  const [imageFailed, setImageFailed] = useState(false)
  const initials = selectedMember.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
  const debugClass = DEBUG_SECTION_BORDERS ? 'debug-section' : ''

  useEffect(() => setImageFailed(false), [selectedIndex])

  useLayoutEffect(() => {
    setSectionRef(2)(document.querySelector('footer'))
  }, [setSectionRef])

  return <><PageHero ref={setSectionRef(0)} className={`${debugClass} ${memberSectionFrame}`} eyebrow="The people behind it" heading="Meet the" accent="Team" subtitle="TODO: Meet the curious people learning, building, and growing together." /><SectionDots activeIndex={Math.min(activeIndex, 1)} onSelect={goToSection} count={2} /><section ref={setSectionRef(1)} className={`${debugClass} ${memberSectionFrame} flex min-h-0 flex-col px-5 lg:px-8`}>
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-black px-4 pb-4 pt-4 text-white sm:px-6 sm:pb-6 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article key={selectedIndex} className="mx-auto grid h-full min-h-0 max-w-5xl flex-1 grid-rows-[minmax(0,1fr)_auto] items-center gap-4 md:grid-cols-2 md:grid-rows-none md:gap-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3, ease: 'easeOut' }}>
                  <div className="order-1 flex h-full min-h-0 items-center justify-center md:order-2">
              <div className="flex h-full min-h-0 w-full items-center justify-center rounded-2xl bg-[var(--surface-2)]">
                {selectedMember.image && !imageFailed ? <img src={selectedMember.image} alt={selectedMember.name} className="max-h-full max-w-full h-auto w-auto rounded-xl object-contain" onError={() => setImageFailed(true)} /> : <div className="flex h-full w-full items-center justify-center font-bold text-6xl text-[var(--accent)]">{initials}</div>}
              </div>
            </div>
            <div className="order-2 min-h-0 md:order-1">
              <p className="font-mono text-5xl font-bold text-white/45">{String(selectedIndex + 1).padStart(2, '0')}</p>
              <h2 className="mt-2 text-4xl font-bold sm:text-5xl"><ReactiveText text={selectedMember.name} /></h2>
              {selectedMember.position && <p className="mt-3 text-sm font-semibold uppercase tracking-[.16em] text-[var(--accent)]">{selectedMember.position}</p>}
              <p className="mt-3 max-w-lg text-base leading-6 text-white/70"><ReactiveText text={selectedMember.bio} mode="paragraph" /></p>
              {selectedMember.skills.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{selectedMember.skills.map((skill) => <span key={skill} className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-white/70">{skill}</span>)}</div>}
              {(selectedMember.github || selectedMember.linkedin) && <div className="mt-5 flex gap-5 text-white/70">{selectedMember.github && <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMember.name} on GitHub`} className="transition-colors hover:text-[var(--accent)]"><GithubIcon /></a>}{selectedMember.linkedin && <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${selectedMember.name} on LinkedIn`} className="transition-colors hover:text-[var(--accent)]"><LinkedinIcon /></a>}</div>}
            </div>
          </motion.article>
        </AnimatePresence>
        <MemberToggle members={memberDetails} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      </div>
    </div>
  </section></>
}

export default Members
