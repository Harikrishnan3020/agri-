import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
];

interface LanguageSwitcherProps {
  value?: string;
  onChange?: (lang: string) => void;
  className?: string;
}

const LanguageSwitcher = ({ value = "en", onChange, className }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = languages.find((l) => l.code === value) || languages[0];

  return (
    <div className={cn("relative", className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-lg border border-white/30 text-sm font-medium text-foreground"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-primary" />
        <span>{currentLang.native}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-full right-0 mt-2 w-48 z-50 bg-card/95 backdrop-blur-xl rounded-2xl border border-white/30 shadow-glass-hover overflow-hidden"
            >
              <div className="py-2 max-h-64 overflow-y-auto">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      onChange?.(lang.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                      value === lang.code
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span>{lang.native}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export { LanguageSwitcher };
