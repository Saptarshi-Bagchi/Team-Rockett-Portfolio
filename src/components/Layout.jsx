import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
  const { pathname } = useLocation()
  return <div className="relative z-[1] min-h-screen overflow-x-hidden"><Navbar /><main key={pathname} className="relative z-[1] route-fade"><Outlet /></main><Footer /></div>
}

export default Layout
