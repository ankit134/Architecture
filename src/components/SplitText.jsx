import { motion } from 'framer-motion'
import { heroVariants } from '../animations/variants'

export function SplitText({
  text,
  once = true,
  stagger = 0.08,
  delay = 0,
  variants = heroVariants,
}) {
  const letters = text.split('')

  return (
    <div className="h-auto overflow-hidden">
      <motion.div
        className="flex gap-[clamp(0.1rem,0.2vw,0.2rem)]"
        initial="initial"
        whileInView="animate"
        viewport={{ once }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {letters.map((char, index) =>
          char === ' ' ? (
            <motion.span
              key={index}
              className="w-[clamp(0.5rem,0.8vw,1rem)]"
              variants={variants}
            />
          ) : (
            <motion.span key={index} variants={variants}>
              {char}
            </motion.span>
          ),
        )}
      </motion.div>
    </div>
  )
}
