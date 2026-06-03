import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useStore } from '../store/useStore'

const cursorVariants = {
  default: { scale: 1, backgroundColor: 'transparent' },
  hover: { scale: 2, backgroundColor: '#888888aa', border: 'none' },
  hidden: { scale: 0, opacity: 0 },
}

export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const [visible, setVisible] = useState(false)
  const cursorType = useStore((s) => s.cursorType)

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [x, y, visible])

  return (
    <div className="pointer-fine-block">
      <motion.div
        className="fixed w-[clamp(1.5rem,2vw,2rem)] h-[clamp(1.5rem,2vw,2rem)] flex items-center justify-center rounded-full bg-transparent border-solid border border-[#888888aa] pointer-events-none select-none z-[100]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        variants={cursorVariants}
        animate={visible ? cursorType : 'hidden'}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}
