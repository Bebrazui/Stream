import { create } from 'zustand';

type AuthModalView = 'login' | 'register';

interface AuthModalStore {
  isOpen: boolean;
  view: AuthModalView;
  openModal: (view: AuthModalView) => void;
  closeModal: () => void;
  setView: (view: AuthModalView) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: 'login',
  openModal: (view) => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view }),
}));
