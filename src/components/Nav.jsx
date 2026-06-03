import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const links = [
  { title: 'HOME', href: '#home' },
  { title: 'EDUCATION', href: '#education' },
  { title: 'SKILLS', href: '#skills' },
  { title: 'PROJECTS', href: '#projects' },
]

function NavLink({ title, href }) {
  const theme = useStore((s) => s.theme)
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <a
      href={href}
      className={`group lg:w-[clamp(3.5rem,7vw,10rem)] relative text-[clamp(0.4rem,2vw,1.5rem)] md:text-[clamp(0.8rem,1vw,1.5rem)] tracking-widest font-light transition-colors duration-500 ${
        theme === 'dark'
          ? 'text-[#ffffff77] hover:text-white'
          : 'text-[#888888aa] font-medium hover:text-[#101010cc]'
      }`}
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      {title}
      <span
        className={`hidden lg:block lg:absolute lg:bottom-0 lg:left-0 lg:h-[0.5px] lg:w-0 lg:transition-all lg:duration-500 lg:ease-out lg:group-hover:w-full ${
          theme === 'dark' ? 'lg:bg-white' : 'lg:bg-[#101010cc]'
        }`}
      />
    </a>
  )
}

function DesktopContactLinks() {
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <div className="hidden lg:flex lg:flex-col lg:items-start lg:gap-2 lg:pt-5 lg:text-[clamp(1rem,1.5vw,1.5rem)] lg:font-extralight">
      <a
        href="mailto:00adarshasapkota@gmail.com"
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
      >
        Email
      </a>
      <a
        href="tel:+9779848666317"
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
      >
        Phone
      </a>
    </div>
  )
}

function ContactLinks() {
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <div className="lg:hidden flex flex-row items-end justify-center gap-3 text-[clamp(0.4rem,1.5vw,1.5rem)] font-extralight">
      <a
        href="mailto:00adarshasapkota@gmail.com"
        className="hover:opacity-80"
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
      >
        Email
      </a>
      <a
        href="tel:+9779848666317"
        className="hover:opacity-80"
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
      >
        Phone
      </a>
    </div>
  )
}

export function Nav() {
  const theme = useStore((s) => s.theme)

  return (
    <div className="fixed top-0 left-0 lg:top-[12vh] lg:left-[3vw] z-50">
      <motion.div
        className={`lg:hidden pt-3 pl-[5vw] pr-[5vw] w-screen h-[clamp(3rem,6vh,4rem)] flex flex-row items-center justify-between border-[#888888aa] border-b-[0.5px] transition-colors duration-700 ${
          theme === 'dark' ? 'bg-[#151515]' : 'bg-[#f2f2f2]'
        }`}
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex flex-row items-center gap-5">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>
        <ContactLinks />
      </motion.div>

      <motion.div
        className="hidden lg:flex lg:flex-col lg:items-start lg:gap-4 lg:w-[10vw]"
        initial={{ opacity: 0, filter: 'blur(5px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {links.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
        <DesktopContactLinks />
      </motion.div>
    </div>
  )
}
