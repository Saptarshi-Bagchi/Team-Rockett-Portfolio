import { useEffect, useState } from 'react'
import projects from '../data/projects'
import CountUp from '../components/CountUp'
import HeroFade from '../components/HeroFade'
import ReactiveText from '../components/ReactiveText'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'

const milestones = ['The spark', 'First launch', 'Learning loop', 'Next horizon']

function Home() {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])

  return <>
    <section data-hero className="relative box-border flex min-h-[100vh] min-h-[100svh] flex-col items-start justify-center pt-[var(--nav-h)] pb-[var(--nav-h)] pl-[var(--hero-pad-left)] pr-5 text-left lg:pr-8">
      <HeroFade>
        <div className="relative z-[1] w-full max-w-[900px] translate-y-3">
          <Reveal variant="fade-up"><p className="eyebrow">Introducing</p></Reveal>
          <Reveal variant="fade-up" delay={120}><h1 className="mt-5 max-w-4xl text-6xl font-extrabold leading-[.95] tracking-[-.06em] sm:text-8xl"><ReactiveText text="Team Rockett" accentWords={['Rockett']} /></h1></Reveal>
          <Reveal variant="fade-up" delay={240}><p className="mt-7 max-w-xl font-mono text-sm leading-7 text-[var(--muted)]"><ReactiveText text="गन्ने का जूस, बड़ा गिलास, 20 रुपये" mode="paragraph" /></p></Reveal>
          <Reveal variant="scale-in" delay={360}><a href="#about" className="mt-9 inline-flex rounded-full border border-[var(--accent)] px-6 py-3 font-mono text-sm text-[var(--accent)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-white">Explore the mission <span className="ml-3">→</span></a></Reveal>
        </div>
      </HeroFade>
    </section>
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <Reveal variant="fade-left"><SectionHeading eyebrow="01 / About us" title="Different skills. One orbit." intro="Crazy Team fr fr" /></Reveal>
      <Reveal variant="fade-up" className="w-full"><div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]"><img src="/team-photo.jpg" alt="Team Rockett" className="h-auto max-h-[560px] w-full object-cover" /></div></Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['✦', 'Build'], ['⌁', 'Innovate'], ['↗', 'Grow'], ['∞', 'Make an Impact']].map(([icon, title], index) => <Reveal key={title} variant="scale-in" delay={index * 100}><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--accent)]"><span className="text-3xl text-[var(--accent)]">{icon}</span><h3 className="mt-7 font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">TODO: Add a sentence about this value.</p></div></Reveal>)}</div>
    </section>
    <section className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal variant="fade-left"><SectionHeading eyebrow="02 / Our journey" title="Still writing the story." /></Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-4">{milestones.map((title, index) => <Reveal key={title} variant={index % 2 === 0 ? 'fade-up' : 'fade-right'} delay={index * 100}><div className="border-l-2 border-[var(--accent)] pl-5"><p className="font-mono text-xs text-[var(--accent)]">0{index + 1}</p><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">TODO: Add a timeline milestone and its date.</p></div></Reveal>)}</div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl grid-cols-3 gap-5 px-5 py-24 text-center lg:px-8">{[[String(projects.length), 'Projects'], ['06', 'Curious members'], ['∞', 'Possibilities ahead']].map(([number, label], index) => <Reveal key={label} variant="scale-in" delay={index * 120}><div><p className="text-4xl font-bold text-[var(--accent)] sm:text-6xl">{number === '∞' ? number : reducedMotion ? number : <CountUp value={number} />}</p><p className="mt-3 text-xs text-[var(--muted)] sm:text-sm">{label}</p></div></Reveal>)}</section>
  </>
}

export default Home
