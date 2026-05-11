import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  email: string;
  companyName: string;
  phone: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'coveplast-client-data', // clave en localStorage
    }
  )
);
