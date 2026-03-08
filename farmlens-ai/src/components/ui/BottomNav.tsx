import { motion } from "framer-motion";
import { Home, Camera, ShoppingBag, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

const BottomNav = ({ activeTab = "home", onTabChange, className }: BottomNavProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const navItems: NavItem[] = [
    { id: "home", icon: Home, label: t.navHome },
    { id: "scan", icon: Camera, label: t.navScan },
    { id: "market", icon: ShoppingBag, label: t.navMarket },
    { id: "ranks", icon: Trophy, label: t.navRanks },
    { id: "profile", icon: User, label: t.navProfile },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]",
        "px-2 pt-2 pb-safe",
        className
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isScan = item.id === "scan";

          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-colors",
                isActive && !isScan && "text-[#10b981]",
                !isActive && !isScan && "text-gray-500 hover:text-gray-900"
              )}
              whileTap={{ scale: 0.9 }}
            >
              {isScan ? (
                <motion.div
                  className="relative -mt-10 w-16 h-16 rounded-full flex items-center justify-center bg-[#25ce93] shadow-lg shadow-emerald-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-7 h-7 text-white" />
                  {/* Outer animated ring */}
                  <div className="absolute inset-[-12px] rounded-full border border-emerald-500/20" />
                  <motion.div
                    className="absolute inset-[-6px] rounded-full border-2 border-[#81e8c7]"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              ) : (
                <>
                  <item.icon className={cn("w-[22px] h-[22px] mb-1.5", isActive ? "text-[#10b981]" : "text-gray-500")} />
                  <span className={cn("text-[10px] font-bold", isActive ? "text-[#10b981]" : "text-gray-500")}>
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-[4px] h-[4px] rounded-full bg-[#10b981]"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav >
  );
};

export { BottomNav };
