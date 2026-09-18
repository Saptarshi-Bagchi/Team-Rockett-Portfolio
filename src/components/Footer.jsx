import Reveal from './Reveal'

function Footer() { return <footer className="relative z-[2] border-t border-[var(--border)] bg-[var(--bg)]"><div className="mx-auto flex max-w-7xl px-5 py-10 lg:px-8"><Reveal variant="fade-up" className="w-full"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><img src="/logo.png" alt="Team Rocket logo" className="h-10 w-10 object-contain" /><span className="font-script text-2xl text-[var(--accent)]">Prepare for trouble! And make it double!</span></div><div className="flex gap-5 text-sm text-[var(--muted)]"><a href="https://www.instagram.com/teamrockett2026/" aria-label="Instagram" className="hover:text-[var(--accent)]">Instagram</a></div></div></Reveal></div></footer> }

export default Footer
