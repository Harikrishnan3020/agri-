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
        "bg-card/90 backdrop-blur-xl border-t border-white/20",
        "px-2 pt-2 pb-safe",
        className
      )}
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
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
                isActive && !isScan && "text-primary",
                !isActive && !isScan && "text-muted-foreground"
              )}
              whileTap={{ scale: 0.9 }}
            >
              {isScan ? (
                <motion.div
                  className="relative -mt-8 w-14 h-14 rounded-full bg-primary-gradient flex items-center justify-center shadow-primary-glow"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-6 h-6 text-primary-foreground" />

                  {/* Animated ring */}
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ) : (
                <>
                  <item.icon className={cn("w-5 h-5 mb-1", isActive && "text-primary")} />
                  <span className={cn("text-2xs font-medium", isActive && "text-primary")}>
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export { BottomNav };
