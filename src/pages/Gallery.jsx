// TODO: Add real gallery photos and project descriptions to these sections later.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import projects from '../data/projects'
import ReactiveText from '../components/ReactiveText'

function Gallery() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return undefined
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!target) return undefined
    const frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  return <div><section className="mx-auto max-w-7xl px-5 pb-10 pt-[calc(var(--nav-h)+5rem)] lg:px-8"><p className="eyebrow">Project galleries</p><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl"><ReactiveText text="Coming soon." /></h1></section>{projects.map((project) => { const galleryId = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); return <section key={project.title} id={galleryId} className="mx-auto min-h-[50vh] max-w-7xl scroll-mt-[var(--nav-h)] border-t border-[var(--border)] px-5 py-20 lg:px-8"><p className="eyebrow">Gallery / {project.title}</p><h2 className="mt-4 text-4xl font-bold sm:text-6xl"><ReactiveText text={project.title} /></h2><p className="mt-6 max-w-xl text-lg text-[var(--muted)]">Gallery coming soon. Photos and project details will be added here.</p><div className="mt-10 flex min-h-40 items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">Placeholder for future gallery content</div></section> })}</div>
}

export default Gallery
