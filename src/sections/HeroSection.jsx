import { motion } from 'framer-motion'
import { heroVariants } from '../animations/variants'
import { PortraitImage } from '../components/PortraitImage'
import { SplitText } from '../components/SplitText'
import { profile, aboutParagraphs } from '../data/portfolio'
import { useStore } from '../store/useStore'

function EmailLink() {
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <a
      href={`mailto:${profile.email}`}
      className="transition-opacity duration-500 hover:opacity-75"
      aria-label="Send an email to Adarsha Sapkota"
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      {profile.email}
    </a>
  )
}

export function HeroSection() {
  return (
    <motion.section
      id="home"
      className="snap-section relative w-screen pt-[17.5vh] pl-[10vw] flex flex-col lg:pt-[15vh] lg:pl-[15vw] lg:flex-row lg:items-center lg:gap-[10vw]"
      initial={{ opacity: 0, filter: 'blur(1px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
    >
      <div className="w-[80vw] lg:w-[35vw] lg:h-[clamp(20rem,60vh,40rem)] flex flex-col items-start justify-between font-light leading-none">
        <div>
          <div className="text-[clamp(3rem,6.5vw,7rem)] md:text-[clamp(4rem,7vw,8rem)] font-light lg:font-thin">
            <h1>
              <SplitText
                text={profile.firstName}
                once
                stagger={0.08}
                delay={0.7}
                variants={heroVariants}
              />
              <SplitText
                text={profile.lastName}
                once
                stagger={0.08}
                delay={1}
                variants={heroVariants}
              />
            </h1>
          </div>
          <div className="text-[clamp(0.8rem,1.2vw,1.5rem)] pl-1 lg:pl-2 tracking-wide">
            {profile.role}
          </div>
        </div>

        <div className="pl-1 mt-[10vh] lg:pl-2 flex flex-col items-start justify-start text-[clamp(0.8rem,1.2vw,1.5rem)] leading-tight gap-1">
          <p>For business inquiries, email me at</p>
          <EmailLink />
          <p className="mt-2">{profile.phone}</p>
          <p>{profile.location}</p>
        </div>
      </div>

      <div className="w-[80vw] lg:w-[35vw] lg:h-[clamp(20rem,60vh,40rem)] flex flex-col items-start justify-end mt-[10vh] lg:mt-0 gap-[5vh]">
        <PortraitImage variant="hero" className="mb-[1vh]" />

        <div className="w-full flex flex-col items-start justify-end">
          <div className="h-[8vh] lg:h-[10vh] flex items-end text-[clamp(1rem,1.5vw,2rem)] font-light mb-1">
            <h2>ABOUT ME</h2>
          </div>
          <div className="w-full h-[1px] bg-[#888888aa]" />
          <div className="w-full flex flex-col pt-[4vh] lg:pt-[clamp(1rem,5vh,2.5rem)] text-[clamp(0.7rem,1vw,1.2rem)] tracking-[0.1rem] font-light gap-1 leading-[clamp(1.1rem,3vh,1.4rem)]">
            {aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
