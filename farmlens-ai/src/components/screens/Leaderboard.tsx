import { motion } from "framer-motion";
import { Award, Crown, Medal, TrendingUp, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
  avatar?: string;
  change?: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const rankStyles = {
  1: {
    bg: "bg-gradient-to-br from-amber-400 to-amber-600",
    icon: Crown,
    iconColor: "text-amber-100",
    textColor: "text-amber-600",
  },
  2: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-500",
    icon: Medal,
    iconColor: "text-slate-100",
    textColor: "text-slate-600",
  },
  3: {
    bg: "bg-gradient-to-br from-orange-400 to-orange-600",
    icon: Medal,
    iconColor: "text-orange-100",
    textColor: "text-orange-600",
  },
};

import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

const Leaderboard = ({
  entries,
  title, // Default values removed to allow dynamic translation fallback
  subtitle,
  className,
}: LeaderboardProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const displayTitle = title || t.leaderboardTitle;
  const displaySubtitle = subtitle || t.leaderboardSubtitle;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section className={cn("px-4 py-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            {displayTitle}
          </h2>
          <p className="text-sm text-muted-foreground">{displaySubtitle}</p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {entries.map((entry) => {
          const rankStyle = rankStyles[entry.rank as keyof typeof rankStyles];
          const RankIcon = rankStyle?.icon || User;

          return (
            <motion.div key={entry.rank} variants={itemVariants}>
              <GlassCard
                variant={entry.isCurrentUser ? "success" : "default"}
                className={cn(
                  "py-3 px-4",
                  entry.isCurrentUser && "ring-2 ring-primary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                      rankStyle?.bg || "bg-muted"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {entry.rank <= 3 ? (
                      <RankIcon className={cn("w-5 h-5", rankStyle?.iconColor || "text-foreground")} />
                    ) : (
                      <span className="text-foreground">{entry.rank}</span>
                    )}
                  </motion.div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {entry.avatar ? (
                      <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-semibold truncate",
                        entry.isCurrentUser ? "text-primary" : "text-foreground"
                      )}>
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                          {t.rankYou}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{entry.location}</p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={cn(
                      "font-bold",
                      rankStyle?.textColor || "text-foreground"
                    )}>
                      {entry.score.toLocaleString()}
                    </div>
                    {entry.change && (
                      <div className={cn(
                        "flex items-center justify-end gap-0.5 text-xs",
                        entry.change === "up" ? "text-emerald-600" :
                          entry.change === "down" ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {entry.change === "up" && <TrendingUp className="w-3 h-3" />}
                        {entry.change === "up" ? "+2" : entry.change === "down" ? "-1" : "—"}
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export { Leaderboard };
export type { LeaderboardEntry };
