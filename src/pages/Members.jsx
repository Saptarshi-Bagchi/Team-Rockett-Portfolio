import members from '../data/members'
import MemberCard from '../components/MemberCard'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'

function Members() { return <><PageHero eyebrow="The people behind it" heading="Meet the" accent="Team" subtitle="TODO: Meet the curious people learning, building, and growing together." /><section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 lg:px-8">{members.map((member, index) => <MemberCard key={member.name} member={member} index={index} />)}</section></> }

export default Members
