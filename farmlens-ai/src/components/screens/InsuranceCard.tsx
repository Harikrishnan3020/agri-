import { motion } from "framer-motion";
import { Shield, Zap, Clock, CreditCard } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InsuranceData {
  claimAmount: number;
  policyId: string;
  cropType: string;
  damageType: string;
  status: "pending" | "approved" | "processing" | "paid";
  estimatedDays?: number;
}

interface InsuranceCardProps {
  data: InsuranceData;
  onClaimClick?: () => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  processing: {
    label: "Processing",
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  paid: {
    label: "Paid",
    color: "text-primary",
    bg: "bg-primary/10",
  },
};

import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

const InsuranceCard = ({ data, onClaimClick, className }: InsuranceCardProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const status = statusConfig[data.status];

  return (
    <GlassCard
      variant="elevated"
      className={cn("overflow-hidden", className)}
    >
      {/* Header with gradient accent */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-12 h-12 rounded-2xl bg-secondary-gradient flex items-center justify-center"
          whileHover={{ rotate: 10 }}
        >
          <Shield className="w-6 h-6 text-primary-foreground" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{t.insuranceTitle}</h3>
          <p className="text-xs text-muted-foreground">Policy: {data.policyId}</p>
        </div>
        <div className={cn("px-2 py-1 rounded-full text-xs font-medium", status.bg, status.color)}>
          {status.label}
        </div>
      </div>

      {/* Claim amount */}
      <motion.div
        className="text-center py-6 mb-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-muted-foreground mb-1">{t.claimAmount}</div>
        <motion.div
          className="text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          ₹{data.claimAmount.toLocaleString()}
        </motion.div>
      </motion.div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-muted/50">
          <div className="text-xs text-muted-foreground mb-0.5">{t.cropType}</div>
          <div className="font-medium text-foreground text-sm">{data.cropType}</div>
        </div>
        <div className="p-3 rounded-xl bg-muted/50">
          <div className="text-xs text-muted-foreground mb-0.5">{t.damageType}</div>
          <div className="font-medium text-foreground text-sm">{data.damageType}</div>
        </div>
      </div>

      {/* Features */}
      <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-secondary" />
          {t.oneTapClaim}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {data.estimatedDays || 3} {t.daysPayout}
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onClaimClick}
        className="w-full h-12 rounded-xl bg-secondary-gradient text-primary-foreground font-semibold shadow-secondary-glow"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {t.claimButton}
      </Button>
    </GlassCard>
  );
};

export { InsuranceCard };
export type { InsuranceData };
