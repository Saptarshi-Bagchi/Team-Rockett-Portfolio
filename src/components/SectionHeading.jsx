import ReactiveText from './ReactiveText'

function SectionHeading({ eyebrow, title, intro, align = 'left' }) { return <div className={`accent-line ${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl"><ReactiveText text={title} /></h2>{intro && <p className="mt-5 text-lg leading-8 text-[var(--muted)]"><ReactiveText text={intro} mode="paragraph" /></p>}</div> }

export default SectionHeading
