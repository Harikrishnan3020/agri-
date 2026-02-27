import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Award, Calendar, Camera, Edit2, History, Star, TrendingUp, Activity, Leaf, Shield, Settings, ChevronRight, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, ScanRecord } from "@/store/useAppStore";
import { ResultsCard } from "@/components/screens/ResultsCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SellProductModal } from "./SellProductModal"; // Import Modal
import { Verified } from "lucide-react"; // Import Verified icon
import { translations, LanguageCode } from "@/data/translations";

export const ProfileSection = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout, scanHistory, updateLeaderboard, selectedLanguage } = useAppStore();
    const t = translations[selectedLanguage as LanguageCode] || translations.en;
    const [isEditing, setIsEditing] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false); // Add State
    const [newName, setNewName] = useState(user?.name || "");
    const [newLocation, setNewLocation] = useState(user?.location || "");
    const [activeSection, setActiveSection] = useState<"overview" | "history" | "achievements">("overview");
    const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null); // State for modal

    // Sync user.scans with scanHistory.length on mount (fixes stale persisted data)
    useEffect(() => {
        if (user && user.scans !== scanHistory.length) {
            updateUser({ scans: scanHistory.length });
            // Also refresh leaderboard
            updateLeaderboard(user.score || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = () => {
        updateUser({ name: newName, location: newLocation });
        setIsEditing(false);
    };

    if (!user) return null;

    // Use scanHistory.length as the authoritative scan count
    const totalScans = scanHistory.length;
    const unlockedBadges = [
        totalScans >= 1,
        totalScans >= 10,
        totalScans >= 50,
        user.score >= 1000,
    ];

    // Real achievements based on actual data
    const achievements = [
        { id: 1, title: t.firstScan, description: t.firstScanDesc, unlocked: totalScans >= 1, icon: "🎯" },
        { id: 2, title: t.diseaseDetective, description: t.diseaseDetectiveDesc, unlocked: totalScans >= 10, icon: "🔍" },
        { id: 3, title: t.healthyFarmer, description: t.healthyFarmerDesc, unlocked: totalScans >= 50, icon: "🌱" },
        { id: 4, title: t.expertLevel, description: t.expertLevelDesc, unlocked: user.score >= 1000, icon: "⭐" },
    ];

    // Most scanned crop from real history
    const cropCounts: Record<string, number> = {};
    scanHistory.forEach(s => { cropCounts[s.crop] = (cropCounts[s.crop] || 0) + 1; });
    const mostScannedCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || t.noneYet;

    const severityColor = (s: string) =>
        s === "high" ? "text-red-400" : s === "medium" ? "text-amber-400" : "text-emerald-400";
    const severityBg = (s: string) =>
        s === "high" ? "bg-red-500/15 border-red-500/20" : s === "medium" ? "bg-amber-500/15 border-amber-500/20" : "bg-emerald-500/15 border-emerald-500/20";

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div
            className="min-h-screen pb-24"
            style={{ background: "linear-gradient(160deg, #0a1a0f 0%, #0d2318 40%, #071510 100%)" }}
        >
            <div className="p-4 space-y-4">

                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl overflow-hidden border border-emerald-500/20"
                    style={{ background: "rgba(16,185,129,0.07)", backdropFilter: "blur(20px)" }}
                >
                    {/* Glow accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl" />

                    <div className="relative p-5">
                        <div className="flex items-start gap-4 mb-5">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-900/40">
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <User className="w-10 h-10" />
                                    )}
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md hover:bg-emerald-400 transition-colors">
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-white truncate mb-1">
                                    {user.name || "Guest User"}
                                </h2>
                                <div className="flex items-center text-emerald-400/70 text-sm mb-3">
                                    <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                    <span className="truncate">{user.location || "Location not set"}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30">
                                        Active Member
                                    </span>
                                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                                        <Star className="w-3 h-3" /> Lv {Math.floor(user.score / 500) + 1}
                                    </span>
                                    {totalScans > 0 && (
                                        <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                                            {totalScans} {t.scans}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400">{totalScans}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">{t.scans}</div>
                            </div>
                            <div className="text-center border-x border-white/10">
                                <div className="text-2xl font-bold text-blue-400">{user.score}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">{t.points}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{unlockedBadges.filter(Boolean).length}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">{t.badges}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Section Tabs */}
                <div
                    className="flex gap-1 rounded-xl p-1 border border-white/10"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    {(["overview", "history", "achievements"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveSection(tab)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all capitalize ${activeSection === tab
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/40"
                                : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            {tab === "history" ? t.history : tab === "achievements" ? t.badgesTab : t.overview}
                        </button>
                    ))}
                </div>

                {/* Section Content */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    {/* ── OVERVIEW ── */}
                    {activeSection === "overview" && (
                        <>
                            {/* Insights */}
                            <div
                                className="rounded-2xl border border-white/10 p-4 space-y-3"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                            >
                                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                    <Activity className="w-4 h-4 text-emerald-400" /> {t.yourInsights}
                                </h3>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.totalScans}</div>
                                            <div className="text-xs text-white/50">{t.allTime}</div>
                                        </div>
                                    </div>
                                    <div className="text-xl font-bold text-emerald-400">{totalScans}</div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Leaf className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">{t.mostScanned}</div>
                                            <div className="text-xs text-white/50">{mostScannedCrop}</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/30" />
                                </div>
                            </div>

                            {/* Edit Profile */}
                            {isEditing ? (
                                <div
                                    className="rounded-2xl border border-white/10 p-4 space-y-3"
                                    style={{ background: "rgba(255,255,255,0.04)" }}
                                >
                                    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                                        <Edit2 className="w-4 h-4 text-emerald-400" /> {t.editProfile}
                                    </h3>
                                    <div className="space-y-1">
                                        <Label className="text-white/70 text-xs">{t.fullName}</Label>
                                        <Input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-white/70 text-xs">{t.farmLocation}</Label>
                                        <Input
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">{t.saveProfile || 'Save'}</Button>
                                        <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/10">{t.close}</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
                                        style={{ background: "rgba(255,255,255,0.04)" }}
                                    >
                                        <Edit2 className="w-4 h-4" /> {t.editProfile}
                                    </button>
                                    <button
                                        onClick={() => setIsSellModalOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-sm font-semibold shadow-lg shadow-emerald-900/40"
                                    >
                                        <Verified className="w-4 h-4" /> {t.shareProduct}
                                    </button>
                                </div>
                            )}

                            {/* Sell Product Modal */}
                            <SellProductModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />

                            {/* Account Info */}
                            <div
                                className="rounded-2xl border border-white/10 overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                            >
                                <div className="divide-y divide-white/10">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">{t.memberSince}</span>
                                        </div>
                                        <span className="text-white text-sm font-semibold">{new Date(user.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">{t.accountStatus}</span>
                                        </div>
                                        <span className="text-emerald-400 font-semibold bg-emerald-500/15 px-3 py-1 rounded-full text-xs border border-emerald-500/20">{t.active}</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/settings')}>
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">{t.settingsTitle}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    }

                    {/* ── HISTORY ── */}
                    {
                        activeSection === "history" && (
                            <div className="space-y-3">
                                {scanHistory.length === 0 ? (
                                    <div
                                        className="rounded-2xl border border-white/10 p-8 text-center"
                                        style={{ background: "rgba(255,255,255,0.04)" }}
                                    >
                                        <History className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                        <p className="text-white/50 text-sm">{t.noScansYet}</p>
                                        <p className="text-white/30 text-xs mt-1">{t.scanCropToSeeHistory}</p>
                                    </div>
                                ) : (
                                    scanHistory.map((scan, index) => (
                                        <motion.div
                                            key={scan.id}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedScan(scan)}
                                            className={`rounded-2xl border p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 active:scale-95 transition-all ${severityBg(scan.severity)}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${severityBg(scan.severity)}`}>
                                                {scan.isHealthy
                                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    : <AlertTriangle className={`w-5 h-5 ${severityColor(scan.severity)}`} />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white text-sm truncate">{scan.disease}</h4>
                                                <p className="text-xs text-white/50">{scan.crop} • {formatDate(scan.date)}</p>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityColor(scan.severity)} bg-black/20`}>
                                                {scan.confidence}%
                                            </span>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )
                    }

                    {/* ── ACHIEVEMENTS ── */}
                    {
                        activeSection === "achievements" && (
                            <div className="space-y-3">
                                {achievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.08 }}
                                        className={`rounded-2xl border p-4 flex items-center gap-4 transition-all ${achievement.unlocked
                                            ? "border-amber-500/30 bg-amber-500/10"
                                            : "border-white/10 opacity-50"
                                            }`}
                                        style={achievement.unlocked ? {} : { background: "rgba(255,255,255,0.03)" }}
                                    >
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${achievement.unlocked
                                            ? "bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border-2 border-amber-400/30"
                                            : "bg-white/5 grayscale"
                                            }`}>
                                            {achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                                                {achievement.title}
                                                {achievement.unlocked && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                                            </h4>
                                            <p className="text-xs text-white/50 mt-0.5">{achievement.description}</p>
                                        </div>
                                        {achievement.unlocked && (
                                            <span className="text-xs text-amber-400 font-semibold bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/20">
                                                Unlocked
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )
                    }
                </motion.div >

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full h-11 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
                >
                    Log Out
                </button>

                {/* Scan Details Modal */}
                <AnimatePresence>
                    {selectedScan && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedScan(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-transparent no-scrollbar relative"
                            >
                                <button
                                    onClick={() => setSelectedScan(null)}
                                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-black/60"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <ResultsCard
                                    result={{
                                        disease: selectedScan.disease,
                                        crop: selectedScan.crop,
                                        confidence: selectedScan.confidence,
                                        severity: selectedScan.severity,
                                        treatment: selectedScan.description || "No description available for this scan.",
                                        preventiveMeasures: selectedScan.preventiveMeasures || ["No preventive measures recorded."],
                                        // Weather data is not persisted for history currently
                                    }}
                                    imageUrl={selectedScan.imageUrl}
                                    className="!m-0 w-full"
                                    onTreatmentClick={() => {
                                        navigate("/medicine", {
                                            state: {
                                                disease: selectedScan.disease,
                                                treatment: selectedScan.description
                                            }
                                        });
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
};
