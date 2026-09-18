import projects from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import PageHero from '../components/PageHero'

function Projects() { return <><PageHero eyebrow="What we've built" heading="Our" accent="Projects" subtitle="TODO: A quick look at the experiments and builds taking shape inside Team Rockett." />{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</> }

export default Projects
