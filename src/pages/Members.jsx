import members from '../data/members'
import MemberCard from '../components/MemberCard'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'
import SectionDots from '../components/SectionDots'
import useSectionSnap from '../hooks/useSectionSnap'
import { DEBUG_SECTION_BORDERS } from '../config/debug'

function Members() {
  const { activeIndex, goToSection, setSectionRef } = useSectionSnap(members.length + 1)
  const debugClass = DEBUG_SECTION_BORDERS ? 'debug-section' : ''

  return <><PageHero ref={setSectionRef(0)} className={debugClass} eyebrow="The people behind it" heading="Meet the" accent="Team" subtitle="TODO: Meet the curious people learning, building, and growing together." /><SectionDots activeIndex={activeIndex} onSelect={goToSection} count={members.length + 1} /><section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 lg:px-8">{members.map((member, index) => <section ref={setSectionRef(index + 1)} key={member.name} className={`${debugClass} flex min-h-[100dvh] items-center`}><MemberCard member={member} index={index} /></section>)}</section></>
}

export default Members
