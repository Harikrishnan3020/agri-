import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Users } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

// Re-export LeaderboardEntry type for backward compatibility
export interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
  scans: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Leaderboard = (_props?: { entries?: LeaderboardEntry[] }) => {
  const { leaderboard, selectedLanguage, user } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  // Filter to only show users (no fake data)
  const displayLeaderboard = leaderboard.filter(e => e.score >= 0 || e.scans >= 0);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { bg: "bg-gradient-to-r from-amber-400/20 to-yellow-400/20", border: "border-amber-400/30", text: "text-amber-400", medal: "🥇" };
    if (rank === 2) return { bg: "bg-gradient-to-r from-slate-300/20 to-slate-400/20", border: "border-slate-400/30", text: "text-slate-300", medal: "🥈" };
    if (rank === 3) return { bg: "bg-gradient-to-r from-amber-700/20 to-orange-700/20", border: "border-amber-700/30", text: "text-amber-600", medal: "🥉" };
    return { bg: "bg-white/5", border: "border-white/10", text: "text-white/60", medal: null };
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
    if (change === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
    return <Minus className="w-3.5 h-3.5 text-white/30" />;
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: "linear-gradient(160deg, #070d14 0%, #0d1a24 40%, #060b12 100%)" }}
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-2"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">{t.leaderboardTitle || "Global League"}</h2>
            </div>
            <p className="text-sm text-white/40">
              {t.leaderboardSubtitle || "Based on scans & activity"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">Live</span>
          </div>
        </motion.div>

        {/* Scoring Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 p-4"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs text-white/50 font-medium mb-2 uppercase tracking-wider">How Points Work</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-lg font-bold text-emerald-400">+100</div>
              <div className="text-[10px] text-white/40">per scan</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-lg font-bold text-blue-400">+50</div>
              <div className="text-[10px] text-white/40">{t.productListed}</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-lg font-bold text-amber-400">+200</div>
              <div className="text-[10px] text-white/40">land analysis</div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard List */}
        {displayLeaderboard.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 p-10 text-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Be the First on the Board!</h3>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              {user
                ? "Scan crops to earn points and claim your spot on the leaderboard!"
                : "Login and scan crops to join the global farmer rankings."}
            </p>
            {!user && (
              <div className="mt-4 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-xl inline-block text-emerald-400 text-sm font-semibold">
                Login to Compete
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } }
            }}
          >
            {displayLeaderboard.map((entry, index) => {
              const style = getRankStyle(entry.rank);
              return (
                <motion.div
                  key={`${entry.name}-${index}`}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 }
                  }}
                  className={`relative rounded-2xl border p-4 flex items-center gap-3 ${style.bg} ${style.border} ${entry.isCurrentUser ? "ring-1 ring-emerald-500/40" : ""}`}
                >
                  {/* Rank */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${style.text} border ${style.border} flex-shrink-0 ${style.bg}`}>
                    {style.medal || `#${entry.rank}`}
                  </div>

                  {/* Avatar Initial */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${entry.isCurrentUser ? "bg-emerald-600" : "bg-white/10"}`}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-sm truncate">{entry.name}</h4>
                      {entry.isCurrentUser && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex-shrink-0">
                          {t.rankYou || "You"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{entry.location}</p>
                  </div>

                  {/* Score & Scans */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black text-white">{entry.score.toLocaleString()}</div>
                    <div className="text-[10px] text-white/30">{entry.scans} scans</div>
                  </div>

                  {/* Change */}
                  <div className="flex-shrink-0 ml-1">
                    {getChangeIcon(entry.change)}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Motivational Footer */}
        {displayLeaderboard.length > 0 && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/10 p-4 text-center"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs">Scan more crops to earn points and climb the ranks!</p>
            <p className="text-white/30 text-[10px] mt-1">{t.rankingsUpdateRealtime}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export { Leaderboard };
export default Leaderboard;
