// TODO: Add real gallery photos and project descriptions to these sections later.
import ReactiveText from '../components/ReactiveText'

function Gallery({ project }) {
  return <div><section className="mx-auto max-w-7xl px-5 pb-16 pt-[calc(var(--nav-h)+5rem)] lg:px-8"><p className="eyebrow">Project gallery</p><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl"><ReactiveText text={project.title} /></h1><p className="mt-6 max-w-xl text-lg text-[var(--muted)]">Gallery coming soon. Photos and project details will be added here.</p><div className="mt-10 flex min-h-40 items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">Placeholder for future gallery content</div></section></div>
}

export default Gallery
