import { motion } from "framer-motion";
import { User, MapPin, Award, Calendar, Camera, Edit2, History, Star, TrendingUp, Activity, Leaf, Shield, Settings, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProfileSection = () => {
    const { user, updateUser, logout, scanHistory } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const [newLocation, setNewLocation] = useState(user?.location || "");
    const [activeSection, setActiveSection] = useState<"overview" | "history" | "achievements">("overview");

    // Sync user.scans with scanHistory.length on mount (fixes stale persisted data)
    useEffect(() => {
        if (user && user.scans !== scanHistory.length) {
            updateUser({ scans: scanHistory.length });
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
        { id: 1, title: "First Scan", description: "Complete your first crop scan", unlocked: totalScans >= 1, icon: "🎯" },
        { id: 2, title: "Disease Detective", description: "Identify 10 diseases", unlocked: totalScans >= 10, icon: "🔍" },
        { id: 3, title: "Healthy Farmer", description: "50+ scans completed", unlocked: totalScans >= 50, icon: "🌱" },
        { id: 4, title: "Expert Level", description: "Reach 1000 points", unlocked: user.score >= 1000, icon: "⭐" },
    ];

    // Most scanned crop from real history
    const cropCounts: Record<string, number> = {};
    scanHistory.forEach(s => { cropCounts[s.crop] = (cropCounts[s.crop] || 0) + 1; });
    const mostScannedCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None yet";

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
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400">{totalScans}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Scans</div>
                            </div>
                            <div className="text-center border-x border-white/10">
                                <div className="text-2xl font-bold text-blue-400">{user.score}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Points</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">{unlockedBadges.filter(Boolean).length}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wide mt-0.5">Badges</div>
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
                            {tab === "history" ? "History" : tab === "achievements" ? "Badges" : "Overview"}
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
                                    <Activity className="w-4 h-4 text-emerald-400" /> Your Insights
                                </h3>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-white">Total Scans</div>
                                            <div className="text-xs text-white/50">All time</div>
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
                                            <div className="text-sm font-semibold text-white">Most Scanned</div>
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
                                        <Edit2 className="w-4 h-4 text-emerald-400" /> Edit Profile
                                    </h3>
                                    <div className="space-y-1">
                                        <Label className="text-white/70 text-xs">Full Name</Label>
                                        <Input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-white/70 text-xs">Farm Location</Label>
                                        <Input
                                            value={newLocation}
                                            onChange={(e) => setNewLocation(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-emerald-500/50"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">Save</Button>
                                        <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 border-white/20 text-white/70 hover:text-white hover:bg-white/10">Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm font-medium"
                                    style={{ background: "rgba(255,255,255,0.04)" }}
                                >
                                    <Edit2 className="w-4 h-4" /> Edit Profile Details
                                </button>
                            )}

                            {/* Account Info */}
                            <div
                                className="rounded-2xl border border-white/10 overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)" }}
                            >
                                <div className="divide-y divide-white/10">
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">Member Since</span>
                                        </div>
                                        <span className="text-white text-sm font-semibold">{new Date(user.joinedDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">Account Status</span>
                                        </div>
                                        <span className="text-emerald-400 font-semibold bg-emerald-500/15 px-3 py-1 rounded-full text-xs border border-emerald-500/20">Active</span>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-4 h-4 text-white/40" />
                                            <span className="text-white/70 text-sm font-medium">Settings</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/30" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── HISTORY ── */}
                    {activeSection === "history" && (
                        <div className="space-y-3">
                            {scanHistory.length === 0 ? (
                                <div
                                    className="rounded-2xl border border-white/10 p-8 text-center"
                                    style={{ background: "rgba(255,255,255,0.04)" }}
                                >
                                    <History className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                    <p className="text-white/50 text-sm">No scans yet.</p>
                                    <p className="text-white/30 text-xs mt-1">Scan a crop to see your history here.</p>
                                </div>
                            ) : (
                                scanHistory.map((scan, index) => (
                                    <motion.div
                                        key={scan.id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`rounded-2xl border p-4 flex items-center gap-3 ${severityBg(scan.severity)}`}
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
                    )}

                    {/* ── ACHIEVEMENTS ── */}
                    {activeSection === "achievements" && (
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
                    )}
                </motion.div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full h-11 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-semibold"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};
