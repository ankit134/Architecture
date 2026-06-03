import { motion } from 'framer-motion'
import { SkillTag } from '../components/SkillTag'
import { skillGroups } from '../data/portfolio'

export function SkillsSection() {
  return (
    <motion.section
      id="skills"
      className="relative flex flex-col w-screen pt-[5vh] px-[10vw] snap-center lg:pt-[clamp(2rem,5vh,5rem)] lg:pl-[15vw] lg:pr-[10vw] min-h-screen"
      initial={{ opacity: 0, filter: 'blur(1px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className="w-full flex flex-col">
        <div className="h-[15vh] flex items-end text-[clamp(1rem,1.5vw,2rem)] font-light mb-1">
          <h2>SKILLS</h2>
        </div>
        <div className="w-[80vw] lg:w-[75vw] h-[1px] bg-[#888888aa]" />
        <div className="mt-[5vh] w-[80vw] lg:w-[75vw] flex flex-col gap-10 lg:flex-row lg:justify-between">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="flex flex-col w-[80vw] lg:w-[35vw] gap-3 font-light"
            >
              <div className="text-[clamp(1rem,1.5vw,2rem)] h-auto tracking-wide">
                <h3>{group.title}</h3>
              </div>
              <div className="w-full text-[clamp(0.8rem,1.2vw,1rem)] flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <SkillTag key={skill} text={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
