import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Portfolio failed to render.', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <main className="flex min-h-screen items-center justify-center px-6 text-center"><div><p className="eyebrow">Launch error</p><h1 className="mt-4 text-3xl font-bold">This page could not load.</h1><p className="mt-3 text-[var(--muted)]">Refresh the page or check the browser console for details.</p></div></main>
    }
    return this.props.children
  }
}

export default ErrorBoundary
