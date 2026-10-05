import projects from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import PageHero from '../components/PageHero'
import SectionDots from '../components/SectionDots'
import useSectionSnap from '../hooks/useSectionSnap'
import { DEBUG_SECTION_BORDERS } from '../config/debug'

function Projects() {
  const { activeIndex, goToSection, setSectionRef } = useSectionSnap(projects.length + 1)
  const debugClass = DEBUG_SECTION_BORDERS ? 'debug-section' : ''

  return <><PageHero ref={setSectionRef(0)} className={debugClass} eyebrow="What we've built" heading="Our" accent="Projects" subtitle="TODO: A quick look at the experiments and builds taking shape inside Team Rockett." /><SectionDots activeIndex={activeIndex} onSelect={goToSection} count={projects.length + 1} />{projects.map((project, index) => <section ref={setSectionRef(index + 1)} key={project.title} className={`${debugClass} min-h-[100dvh]`}><ProjectCard project={project} index={index} /></section>)}</>
}

export default Projects
