import { motion } from "framer-motion";
import { Crown, Scan, Sparkles, Star, TrendingUp, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PremiumPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: "monthly" | "yearly") => void;
  className?: string;
}



const PremiumPaywall = ({ isOpen, onClose, onSubscribe, className }: PremiumPaywallProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  const features: PremiumFeature[] = [
    {
      icon: <Scan className="w-5 h-5" />,
      title: t.unlimitedScans,
      description: t.unlimitedScansDesc,
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: t.priorityExpert,
      description: t.priorityExpertDesc,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: t.advancedAnalytics,
      description: t.advancedAnalyticsDesc,
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: t.aiRecommendations,
      description: t.aiRecommendationsDesc,
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/20 backdrop-blur-sm p-4",
        className
      )}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <GlassCard variant="elevated" className="relative overflow-hidden">
          {/* Premium gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center pt-4 pb-6">
            <motion.div
              className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{t.premiumTitle}</h2>
            <p className="text-muted-foreground">{t.premiumSubtitle}</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-medium text-emerald-900 text-sm">{feature.title}</div>
                  <div className="text-xs text-emerald-600/70">{feature.description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Monthly */}
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all text-left",
                selectedPlan === "monthly"
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-muted bg-muted/30"
              )}
            >
              <div className="text-xs text-emerald-600 mb-1">Standard</div>
              <div className="text-xl font-bold text-emerald-900">FREE</div>
              <div className="text-xs text-emerald-500">Foundation Supported</div>
            </button>

            {/* Yearly */}
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden",
                selectedPlan === "yearly"
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-muted bg-muted/30"
              )}
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-2xs text-white font-medium">
                Best Value
              </div>
              <div className="text-xs text-emerald-600 mb-1">Pro Tier</div>
              <div className="text-xl font-bold text-emerald-900">FREE</div>
              <div className="text-xs text-emerald-500">Community Choice</div>
            </button>
          </div>

          {/* Subscribe button */}
          <Button
            onClick={() => onSubscribe?.(selectedPlan)}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg shadow-emerald-glow"
          >
            Activate Free Pro Tools
          </Button>

          {/* Fine print */}
          <p className="text-center text-2xs text-muted-foreground mt-4">
            Cancel anytime • Secure payment via Razorpay
          </p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export { PremiumPaywall };
