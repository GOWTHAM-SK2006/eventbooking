import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

type Theme = 'light' | 'dark' | 'system'

interface AuthState {
  user: User | null
  theme: Theme
  setTheme: (theme: Theme) => void
  setUser: (user: User | null) => void
}

export const useStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'eventbook-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)