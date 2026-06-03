import { motion } from 'framer-motion'
import { profile } from '../data/portfolio'
import { useStore } from '../store/useStore'

export function PortraitImage({ className = '', variant = 'hero' }) {
  const theme = useStore((s) => s.theme)
  const setCursorType = useStore((s) => s.setCursorType)
  const isDark = theme === 'dark'

  const sizeClass =
    variant === 'hero'
      ? 'size-[clamp(11rem,38vw,14.5rem)] lg:size-[clamp(10.5rem,16vw,12.5rem)]'
      : 'size-40'

  const borderClass = isDark
    ? 'border-[#88888866] bg-[#151515]'
    : 'border-[#888888aa] bg-[#f2f2f2]'

  return (
    <motion.figure
      className={`group relative m-0 shrink-0 ${sizeClass} ${className}`}
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.2, 1, 0.4, 1], delay: 0.12 }}
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      <div
        className={`size-full overflow-hidden rounded-full border border-solid p-[3px] transition-colors duration-700 ${borderClass}`}
      >
        <div className="relative size-full overflow-hidden rounded-full">
          <img
            src={profile.portraitSrc}
            alt={profile.portraitAlt}
            width={profile.portraitWidth}
            height={profile.portraitHeight}
            className="size-full object-cover object-[center_32%] transition-[filter] duration-700"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
      <figcaption className="sr-only">{profile.portraitAlt}</figcaption>
    </motion.figure>
  )
}
