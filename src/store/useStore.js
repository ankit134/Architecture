import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'dark',
  toggleTheme: (next) => set({ theme: next }),
  cursorType: 'default',
  setCursorType: (cursorType) => set({ cursorType }),
}))
