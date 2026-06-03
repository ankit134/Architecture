import { motion } from 'framer-motion'
import { education } from '../data/portfolio'

export function EducationSection() {
  return (
    <motion.section
      id="education"
      className="snap-section relative w-screen pt-[5vh] pl-[10vw] lg:pt-[clamp(5rem,15vh,10rem)] lg:pl-[15vw] flex flex-col lg:flex-row lg:items-center lg:gap-[10vw]"
      initial={{ opacity: 0, filter: 'blur(1px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className="lg:h-[clamp(20rem,60vh,40rem)] flex flex-col items-start justify-start w-full">
        <div className="h-[15vh] flex items-end text-[clamp(1rem,1.5vw,2rem)] font-light mb-1">
          <h2>ACADEMIC QUALIFICATIONS</h2>
        </div>
        <div className="w-[80vw] lg:w-[75vw] h-[1px] bg-[#888888aa]" />
        <div className="w-[80vw] lg:w-[75vw] flex flex-col pt-[5vh] lg:pt-[clamp(1rem,7.5vh,3rem)] gap-[5vh]">
          {education.map((item) => (
            <article
              key={item.title}
              className="text-[clamp(0.7rem,1vw,1.2rem)] tracking-[0.1rem] font-light leading-[clamp(1.1rem,3vh,1.4rem)]"
            >
              <h3 className="text-[clamp(0.9rem,1.2vw,1.4rem)] mb-1">
                {item.title}
              </h3>
              <p>{item.school}</p>
              {item.university && <p>{item.university}</p>}
              <p className="text-[#888888aa] mt-1">{item.period}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
