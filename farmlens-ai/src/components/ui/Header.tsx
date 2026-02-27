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
        "sticky top-0 z-30 px-4 py-3 backdrop-blur-xl border-b border-emerald-500/10",
        className
      )}
      style={{ background: "rgba(7,21,10,0.85)" }}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo & Welcome */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <motion.div
              className="w-10 h-10 rounded-[12px] bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20"
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-white">AgriYield</h1>
              {isPremium && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-2xs text-white font-bold tracking-wider"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {t.eliteBadge}
                </motion.span>
              )}
            </div>
            <p className="text-2xs text-emerald-400/70">
              {t.helloUser.replace("{name}", userName)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher
            value={selectedLanguage}
            onChange={setLanguage}
          />

          <Link to="/login">
            <motion.button
              className="w-10 h-10 rounded-xl backdrop-blur-lg border border-emerald-500/20 flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
              style={{ background: "rgba(16,185,129,0.08)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={t.loginPageTitle}
            >
              <User className="w-4 h-4" />
            </motion.button>
          </Link>

          <motion.button
            onClick={onNotificationsClick}
            className="relative w-10 h-10 rounded-xl backdrop-blur-lg border border-emerald-500/20 flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
            style={{ background: "rgba(16,185,129,0.08)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-4 h-4" />
            <motion.span
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>

          <motion.button
            onClick={onSettingsClick}
            className="w-10 h-10 rounded-xl backdrop-blur-lg border border-emerald-500/20 flex items-center justify-center text-emerald-300/60 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
            style={{ background: "rgba(16,185,129,0.08)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export { Header };
