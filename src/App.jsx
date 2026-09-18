import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import DottedGrid from './components/DottedGrid'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Members from './pages/Members'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return <HashRouter><DottedGrid /><ScrollToTop /><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} /><Route path="/members" element={<Members />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></HashRouter>
}

export default App
