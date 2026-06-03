import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <div className="fixed top-[clamp(3.5rem,7vh,10rem)] left-1/2 -translate-x-1/2 landscape:top-[clamp(0.8rem,4vh,1rem)] lg:top-[5vh] lg:right-[3vw] lg:left-auto lg:translate-x-0 z-50">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(1px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <button
          type="button"
          className={`group w-[3rem] p-[0.1rem] lg:w-[5rem] lg:p-[0.2rem] aspect-[5/2] rounded-full border lg:border-2 flex flex-row items-center transition-colors duration-700 ${
            theme === 'dark' ? 'border-[#ffffffcc]' : 'border-[#101010cc]'
          } ${theme === 'dark' ? 'justify-start' : 'justify-end'}`}
          onMouseEnter={() => setCursorType('hover')}
          onMouseLeave={() => setCursorType('default')}
          onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle light and dark mode"
        >
          <div
            className={`w-[1rem] lg:w-[1.6rem] aspect-square rounded-full transition-all duration-700 ease-out ${
              theme === 'dark' ? 'bg-[#888888aa]' : 'bg-[#101010cc]'
            }`}
          />
        </button>
      </motion.div>
    </div>
  )
}
