import { useEffect, useState } from 'react'

function CountUp({ value }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const end = Number(value)
    if (!Number.isFinite(end)) { setCount(value); return undefined }
    const start = performance.now()
    const timer = requestAnimationFrame(function tick(now) { const progress = Math.min(1, (now - start) / 700); setCount(Math.round(end * progress)); if (progress < 1) requestAnimationFrame(tick) })
    return () => cancelAnimationFrame(timer)
  }, [value])
  return <>{count}</>
}

export default CountUp
