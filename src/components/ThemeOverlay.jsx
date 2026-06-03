import { useStore } from '../store/useStore'

export function ThemeOverlay() {
  const theme = useStore((s) => s.theme)

  return (
    <div>
      <div
        className={`fixed inset-0 -z-10 transition-colors duration-700 ${
          theme === 'dark'
            ? 'bg-[#ffffff15]'
            : 'bg-[#ffffffdd] mix-blend-difference'
        }`}
      />
      <div
        className={
          theme === 'light'
            ? 'fixed inset-0 -z-10 bg-[#ffffffa0] duration-700'
            : 'hidden'
        }
      />
    </div>
  )
}
