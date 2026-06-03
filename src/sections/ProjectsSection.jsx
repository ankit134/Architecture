import { motion } from 'framer-motion'
import { SkillTag } from '../components/SkillTag'
import { projects } from '../data/portfolio'
import { useStore } from '../store/useStore'

function ProjectCard({ project }) {
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <article
      className="w-[80vw] lg:w-[35vw] flex flex-col gap-3 pb-[5vh] border-b border-[#888888aa] border-b-[0.5px] last:border-0"
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      <h3 className="text-[clamp(1rem,1.5vw,1.6rem)] font-light tracking-wide">
        {project.name}
      </h3>
      <div className="flex flex-wrap gap-2">
        {project.techs.map((tech) => (
          <SkillTag key={tech} text={tech} />
        ))}
      </div>
    </article>
  )
}

export function ProjectsSection() {
  return (
    <motion.section
      id="projects"
      className="relative flex flex-col w-screen pt-[5vh] px-[10vw] snap-center lg:pt-[clamp(2rem,5vh,5rem)] lg:pl-[15vw] lg:pr-[10vw] pb-[15vh]"
      initial={{ opacity: 0, filter: 'blur(1px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className="w-full flex flex-col">
        <div className="h-[15vh] flex items-end text-[clamp(1rem,1.5vw,2rem)] font-light mb-1">
          <h2>FORMER PROJECTS</h2>
        </div>
        <div className="w-[80vw] lg:w-[75vw] h-[1px] bg-[#888888aa]" />
        <div className="mt-[5vh] flex flex-col gap-[3vh] lg:flex-row lg:flex-wrap lg:gap-[5vw]">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
        <p className="cursive w-full flex items-center justify-center mt-[clamp(3rem,10vh,5rem)] text-[clamp(1rem,1.5vw,2rem)] lg:-translate-x-[5vw] md:text-[clamp(1.5rem,2vw,2.5rem)] md:font-thin font-light">
          Thank you for visiting.
        </p>
      </div>
    </motion.section>
  )
}
