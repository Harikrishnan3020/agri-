import { create } from "zustand";

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  showPremiumPaywall: boolean;
  setShowPremiumPaywall: (show: boolean) => void;

  showResults: boolean;
  setShowResults: (show: boolean) => void;

  scanCount: number;
  incrementScanCount: () => void;

  isPremium: boolean;
  setPremium: (premium: boolean) => void;

  selectedLanguage: string;
  setLanguage: (lang: string) => void;

  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),

  showPremiumPaywall: false,
  setShowPremiumPaywall: (show) => set({ showPremiumPaywall: show }),

  showResults: false,
  setShowResults: (show) => set({ showResults: show }),

  scanCount: 0,
  incrementScanCount: () => set((state) => ({ scanCount: state.scanCount + 1 })),

  isPremium: false,
  setPremium: (premium) => set({ isPremium: premium }),

  selectedLanguage: "en",
  setLanguage: (lang) => set({ selectedLanguage: lang }),

  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
