import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MarketplaceListing } from "@/components/screens/Marketplace";
import { translations, LanguageCode } from "@/data/translations";

interface UserData {
  name: string;
  email: string;
  location: string;
  joinedDate: string;
  scans: number;
  score: number;
  image?: string;
}

export interface ScanRecord {
  id: string;
  disease: string;
  crop: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  date: string; // ISO string
  isHealthy: boolean;
  imageUrl?: string;
  description?: string; // Treatment or diagnosis description
  preventiveMeasures?: string[];
  userFeedback?: {
    wasCorrect: boolean;
    actualDisease?: string;
    actualCrop?: string;
    notes?: string;
    timestamp: string;
  };
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
  scans: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

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
  t: (typeof translations)[LanguageCode];

  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;

  scanHistory: ScanRecord[];
  addScanRecord: (record: Omit<ScanRecord, "id" | "date">) => void;
  clearScanHistory: () => void;
  updateScanFeedback: (scanId: string, feedback: ScanRecord['userFeedback']) => void;

  leaderboard: LeaderboardEntry[];
  updateLeaderboard: (score: number) => void;

  listings: MarketplaceListing[];
  setListings: (listings: MarketplaceListing[]) => void;
  addListing: (listing: MarketplaceListing) => void;

  // Settings
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: "home",
      setActiveTab: (tab) => set({ activeTab: tab }),

      showPremiumPaywall: false,
      setShowPremiumPaywall: (show) => set({ showPremiumPaywall: show }),

      showResults: false,
      setShowResults: (show) => set({ showResults: show }),

      scanCount: 0,
      // incrementScanCount kept for backward compat — addScanRecord handles everything now
      incrementScanCount: () => {
        // No-op: addScanRecord already updates scans + score + leaderboard atomically
      },

      isPremium: false,
      setPremium: (premium) => set({ isPremium: premium }),

      selectedLanguage: "en",
      setLanguage: (lang) => {
        const normalized = (lang in translations ? lang : "en") as LanguageCode;
        set({
          selectedLanguage: normalized,
          t: translations[normalized],
        });
      },
      t: translations.en,

      isAuthenticated: false,
      user: null,
      // NO fake leaderboard data - starts empty, only real users get added
      leaderboard: [],
      listings: [],
      setListings: (listings) => set({ listings }),
      addListing: (listing) => set((state) => {
        const exists = state.listings.some((item) => item.id === listing.id);
        if (exists) return state;
        return { listings: [listing, ...state.listings] };
      }),
      scanHistory: [],

      addScanRecord: (record) => {
        const newRecord: ScanRecord = {
          ...record,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };

        // Atomically update history + user.scans + scanCount + score
        set((state) => {
          const newHistory = [newRecord, ...state.scanHistory].slice(0, 100);
          const newScanCount = newHistory.length;
          const newScore = (state.user?.score || 0) + 100;
          const updatedUser = state.user
            ? { ...state.user, scans: newScanCount, score: newScore }
            : state.user;
          return {
            scanHistory: newHistory,
            scanCount: newScanCount,
            user: updatedUser,
          };
        });

        // Update leaderboard with new score
        const newScore = (get().user?.score || 0);
        get().updateLeaderboard(newScore);
      },

      clearScanHistory: () => {
        set((state) => ({
          scanHistory: [],
          scanCount: 0,
          user: state.user ? { ...state.user, scans: 0 } : state.user,
        }));
      },

      updateScanFeedback: (scanId, feedback) => {
        set((state) => ({
          scanHistory: state.scanHistory.map(scan =>
            scan.id === scanId
              ? { ...scan, userFeedback: feedback }
              : scan
          ),
        }));
      },

      login: (email, name) => {
        // Simulate login
        const existingUser = get().user;
        if (!existingUser) {
          // Derive a display name: use provided name, or email prefix, or phone number fallback
          const isEmail = email.includes("@");
          const derivedName = name?.trim() ||
            (isEmail ? email.split("@")[0] : "Farmer");
          const newUser: UserData = {
            name: derivedName,
            email,
            location: "Unknown",
            joinedDate: new Date().toISOString(),
            scans: 0,
            score: 0,
          };
          set({ isAuthenticated: true, user: newUser });
          // Add user to leaderboard initially
          get().updateLeaderboard(0);
        } else {
          // If logging in again, update name if provided
          if (name?.trim()) {
            set((state) => ({
              isAuthenticated: true,
              user: state.user ? { ...state.user, name: name.trim() } : state.user,
            }));
          } else {
            set({ isAuthenticated: true });
          }
          // Ensure user is in leaderboard
          get().updateLeaderboard(existingUser.score || 0);
        }
      },

      logout: () => set({ isAuthenticated: false, activeTab: "home" }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      updateLeaderboard: (newScore) => {
        const state = get();
        const currentUser = state.user;
        if (!currentUser) return;

        let newLeaderboard = [...state.leaderboard];

        // Remove existing current user entry
        newLeaderboard = newLeaderboard.filter(entry => !entry.isCurrentUser);

        // Get current scan count from history
        const totalScans = state.scanHistory.length;

        // Add current user with updated score and scans
        newLeaderboard.push({
          rank: 0, // Will be recalculated
          name: currentUser.name || "You",
          location: currentUser.location || "Unknown",
          score: newScore,
          scans: totalScans,
          change: "same",
          isCurrentUser: true,
        });

        // Sort by score (primary) then scans (secondary)
        newLeaderboard.sort((a, b) => b.score - a.score || b.scans - a.scans);

        // Assign ranks and limit to top 10
        newLeaderboard = newLeaderboard.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })).slice(0, 10);

        set({ leaderboard: newLeaderboard });
      },

      // Settings
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      darkMode: true,
      setDarkMode: (enabled) => set({ darkMode: enabled }),

    }),
    {
      name: "agriyield-storage", // local storage key
      partialize: (state) => ({
        isPremium: state.isPremium,
        scanCount: state.scanCount,
        user: state.user,
        leaderboard: state.leaderboard,
        scanHistory: state.scanHistory,
        listings: state.listings,
        selectedLanguage: state.selectedLanguage,
        isAuthenticated: state.isAuthenticated,
        notificationsEnabled: state.notificationsEnabled,
        darkMode: state.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.selectedLanguage) {
          state.setLanguage(state.selectedLanguage);
        }
      },
    }
  )
);
