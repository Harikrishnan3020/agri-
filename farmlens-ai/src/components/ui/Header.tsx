import { motion } from "framer-motion";
import { Bell, Settings, Sparkles, Leaf, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

interface HeaderProps {
  userName?: string;
  isPremium?: boolean;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  className?: string;
}

const Header = ({
  userName = "Farmer",
  isPremium = false,
  onSettingsClick,
  onNotificationsClick,
  className,
}: HeaderProps) => {
  const { selectedLanguage, setLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-30 px-4 py-3 bg-transparent",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo & Welcome */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20"
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
          </Link>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-tight">
              <h1 className="text-xl font-extrabold text-[#0a2d1c]">AgriYield</h1>
              {isPremium && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[10px] text-white font-bold tracking-wider"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {t.eliteBadge}
                </motion.span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 leading-tight">
              {t.helloUser.replace("{name}", userName)}
            </p>
          </div>
        </div>

        {/* Actions - Using White background to match design */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher
            value={selectedLanguage}
            onChange={setLanguage}
          />

          <motion.button
            onClick={onNotificationsClick}
            className="relative w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <motion.span
              className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>

          <motion.button
            onClick={onSettingsClick}
            className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export { Header };
