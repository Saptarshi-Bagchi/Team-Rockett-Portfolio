import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import DottedGrid from './components/DottedGrid'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Members from './pages/Members'
import LoadingScreen from './components/LoadingScreen'
import Gallery from './pages/Gallery'
import projects, { getProjectSlug } from './data/projects'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return <><LoadingScreen /><HashRouter><DottedGrid /><ScrollToTop /><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} /><Route path="/members" element={<Members />} />{projects.map((project) => <Route key={getProjectSlug(project)} path={`/gallery/${getProjectSlug(project)}`} element={<Gallery project={project} />} />)}<Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></HashRouter></>
}

export default App
