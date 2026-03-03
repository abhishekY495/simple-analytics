import { create } from "zustand";

interface User {
  id: string;
  full_name?: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isRestoring: boolean;
  setAuth: (accessToken: string | null, user: User | null) => void;
  clearAuth: () => void;
  setIsRestoring: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isRestoring: true,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setIsRestoring: (value) => set({ isRestoring: value }),
}));
