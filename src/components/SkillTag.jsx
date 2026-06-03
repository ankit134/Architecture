import { useStore } from '../store/useStore'

export function SkillTag({ text }) {
  const theme = useStore((s) => s.theme)
  const setCursorType = useStore((s) => s.setCursorType)

  return (
    <p
      className={`w-fit h-fit p-1 px-5 m-1 border border-[#888888aa] rounded-full duration-500 ${
        theme === 'dark'
          ? 'hover:bg-white hover:text-[#101010]'
          : 'hover:bg-black hover:text-[#ffffffcc]'
      }`}
      onMouseEnter={() => setCursorType('hover')}
      onMouseLeave={() => setCursorType('default')}
    >
      {text}
    </p>
  )
}
