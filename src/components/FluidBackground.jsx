import { useEffect, useRef } from 'react'
import { FluidEngine } from '../lib/fluidEngine'

export function FluidBackground() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let engine
    try {
      engine = new FluidEngine(canvas)
      engineRef.current = engine
    } catch {
      return undefined
    }

    const resize = () => {
      engine.resize(window.innerWidth, window.innerHeight)
    }

    const onMove = (event) => {
      engine.setMouse(event.clientX, event.clientY)
    }

    const loop = () => {
      engine.step()
      frameRef.current = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    frameRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  return (
    <div className="pointer-fine-block fixed inset-0 -z-50 w-screen h-screen pointer-events-none bg-black">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
