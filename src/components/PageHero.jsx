import HeroFade from './HeroFade'
import ReactiveText from './ReactiveText'
import Reveal from './Reveal'

function PageHero({ eyebrow, heading, accent, subtitle }) {
  return <section data-hero className="relative box-border flex min-h-[100vh] min-h-[100svh] flex-col items-start justify-center pt-[var(--nav-h)] pb-[var(--nav-h)] pl-[var(--hero-pad-left)] pr-5 text-left lg:pr-8"><HeroFade><div className="relative z-[1] w-full max-w-[900px] translate-y-3"><Reveal variant="fade-up"><p className="eyebrow">{eyebrow}</p></Reveal><Reveal variant="fade-up" delay={120}><h1 className="mt-5 max-w-5xl text-6xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-8xl"><ReactiveText text={`${heading} ${accent}`} accentWords={[accent]} /></h1></Reveal><Reveal variant="fade-up" delay={240}><p className="mt-7 max-w-xl font-mono text-sm leading-7 text-[var(--muted)]"><ReactiveText text={subtitle} mode="paragraph" /></p></Reveal></div></HeroFade></section>
}

export default PageHero
