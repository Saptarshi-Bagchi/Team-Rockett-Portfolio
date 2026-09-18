import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

document.documentElement.classList.add('js')
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Portfolio could not mount: #root was not found in index.html.')
} else {
  createRoot(rootElement).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>)
}
