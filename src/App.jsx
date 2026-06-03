import { motion } from 'framer-motion'
import { CustomCursor } from './components/CustomCursor'
import { FluidBackground } from './components/FluidBackground'
import { Nav } from './components/Nav'
import { ThemeOverlay } from './components/ThemeOverlay'
import { ThemeToggle } from './components/ThemeToggle'
import { useLenis } from './hooks/useLenis'
import { EducationSection } from './sections/EducationSection'
import { HeroSection } from './sections/HeroSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'
import { useStore } from './store/useStore'

export default function App() {
  const theme = useStore((s) => s.theme)
  useLenis()

  return (
    <div
      className={`relative w-full min-h-screen select-none transition-colors duration-700 ${
        theme === 'dark' ? 'text-[#ffffffdc]' : 'text-[#101010]'
      }`}
    >
      <FluidBackground />
      <ThemeOverlay />
      <CustomCursor />
      <Nav />
      <ThemeToggle />

      <motion.main
        className="pb-[10vh] overflow-y-scroll snap-y snap-mandatory h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <HeroSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
      </motion.main>

      <footer className="fixed bottom-[0.2rem] md:bottom-[0.8rem] left-[3vw] h-[1rem] text-[clamp(0.5rem,0.8vw,1rem)] font-light z-50">
        <p>Ⓒ Adarsha Sapkota</p>
      </footer>
    </div>
  )
}
