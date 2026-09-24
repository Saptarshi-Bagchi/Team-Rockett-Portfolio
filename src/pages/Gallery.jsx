// TODO: Add real gallery photos and project descriptions to these sections later.
import ReactiveText from '../components/ReactiveText'

function Gallery({ project }) {
  const lineFollowerImages = project.id === 'line-follower' ? [...(project.gallery?.images || [])].sort((a, b) => a.order - b.order) : []
  return <div><section className="mx-auto max-w-7xl px-5 pb-16 pt-[calc(var(--nav-h)+5rem)] lg:px-8"><p className="eyebrow">Project gallery</p><h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl"><ReactiveText text={project.title} /></h1>{project.id === 'line-follower' ? <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{lineFollowerImages.map((item) => <figure key={item.order} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"><img src={item.src} alt={`${project.title} image ${item.order}`} className="aspect-[4/3] w-full object-cover" /><figcaption className="min-h-10 px-4 py-3 text-sm leading-5 text-[var(--muted)]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</figcaption></figure>)}</div> : <><p className="mt-6 max-w-xl text-lg text-[var(--muted)]">Gallery coming soon. Photos and project details will be added here.</p><div className="mt-10 flex min-h-40 items-center justify-center border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">Placeholder for future gallery content</div></>}</section></div>
}

export default Gallery
