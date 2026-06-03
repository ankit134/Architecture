import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  const lenisRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      autoResize: true,
      touchMultiplier: 0,
    })
    lenisRef.current = lenis

    const raf = (time) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
