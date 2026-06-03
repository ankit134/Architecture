import { useEffect, useState } from 'react'

export const SECTION_IDS = ['home', 'education', 'skills', 'projects']

function getActiveSection(sections, scrollRoot) {
  const anchor = (scrollRoot?.clientHeight ?? window.innerHeight) * 0.4
  let current = sections[0]?.id ?? 'home'
  let bestDistance = Infinity

  for (const section of sections) {
    const rect = section.getBoundingClientRect()
    const rootTop = scrollRoot?.getBoundingClientRect().top ?? 0
    const relativeTop = rect.top - rootTop
    const relativeCenter = relativeTop + rect.height * 0.35

    if (relativeTop <= anchor && relativeTop + rect.height >= anchor) {
      return section.id
    }

    const distance = Math.abs(relativeCenter - anchor)
    if (distance < bestDistance) {
      bestDistance = distance
      current = section.id
    }
  }

  return current
}

export function useActiveSection(scrollRootRef) {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const scrollRoot = scrollRootRef?.current
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    )

    if (!sections.length) return undefined

    const update = () => {
      setActiveSection(getActiveSection(sections, scrollRoot))
    }

    update()

    const target = scrollRoot ?? window
    target.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        } else {
          update()
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-40% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      target.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [scrollRootRef])

  return activeSection
}
