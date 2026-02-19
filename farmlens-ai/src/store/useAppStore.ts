import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
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

  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserData>) => void;

  scanHistory: ScanRecord[];
  addScanRecord: (record: Omit<ScanRecord, "id" | "date">) => void;

  leaderboard: LeaderboardEntry[];
  updateLeaderboard: (score: number) => void;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

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
      setLanguage: (lang) => set({ selectedLanguage: lang }),

      isAuthenticated: false,
      user: null,
      leaderboard: INITIAL_LEADERBOARD,
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

        // Add current user
        newLeaderboard.push({
          rank: 0, // Will be recalculated
          name: currentUser.name || "You",
          location: currentUser.location || "Unknown",
          score: newScore,
          change: "same",
          isCurrentUser: true,
        });

        // Sort by score
        newLeaderboard.sort((a, b) => b.score - a.score);

        // Assign ranks and limit to top 10
        newLeaderboard = newLeaderboard.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        })).slice(0, 10);

        set({ leaderboard: newLeaderboard });
      },

    }),
    {
      name: "agriyield-storage", // local storage key
      partialize: (state) => ({
        isPremium: state.isPremium,
        scanCount: state.scanCount,
        user: state.user,
        leaderboard: state.leaderboard,
        scanHistory: state.scanHistory,
        selectedLanguage: state.selectedLanguage,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
