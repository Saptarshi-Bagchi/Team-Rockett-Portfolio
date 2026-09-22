import { useState } from 'react'
import Reveal from './Reveal'
import ReactiveText from './ReactiveText'

function MemberCard({ member, index }) {
  const imageOnRight = index % 2 === 0
  const [imageFailed, setImageFailed] = useState(false)
  const initials = member.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
  return <article className="grid items-center gap-8 border-t-0 py-12 md:grid-cols-2 md:gap-16"><Reveal variant={imageOnRight ? 'fade-right' : 'fade-left'} className={imageOnRight ? 'md:order-2' : ''}><div className={`member-photo-frame ${imageFailed ? 'member-photo-placeholder' : ''}`}>{member.image && !imageFailed ? <img src={member.image} alt={member.name} onError={() => setImageFailed(true)} /> : <div className="flex h-full items-center justify-center font-bold text-7xl text-[var(--accent)]">{initials}</div>}</div></Reveal><Reveal variant={imageOnRight ? 'fade-left' : 'fade-right'} className={imageOnRight ? 'md:order-1' : ''}><div><p className="eyebrow">0{index + 1} / {member.role}</p><h2 className="mt-4 text-4xl font-bold"><ReactiveText text={member.name} /></h2><p className="mt-5 max-w-lg text-lg leading-8 text-[var(--muted)]"><ReactiveText text={member.bio} mode="paragraph" /></p><div className="mt-6 flex flex-wrap gap-2">{member.skills.map((skill, skillIndex) => <span key={`${skill}-${skillIndex}`} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">{skill}</span>)}</div><div className="mt-7 flex gap-5 text-sm text-[var(--accent)]"><a href={member.links.github} className="hover:underline">GitHub ↗</a><a href={member.links.linkedin} className="hover:underline">LinkedIn ↗</a></div></div></Reveal></article>
}

export default MemberCard
