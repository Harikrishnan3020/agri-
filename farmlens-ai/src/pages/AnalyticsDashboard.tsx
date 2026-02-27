import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
    Calendar,
    Leaf,
    AlertTriangle,
    CheckCircle2,
    Target,
    Award,
    Download,
    Share2,
    ScanLine,
    Clock,
    MapPin,
    Droplets,
    ShieldCheck,
    Zap,
    History,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    Area,
    AreaChart,
} from 'recharts';


const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ["#ef4444", "#f59e0b", "#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const { user, scanHistory, t } = useAppStore();
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
    
    const MONTH_NAMES = [t.jan, t.feb, t.mar, t.apr, t.may, t.jun, t.jul, t.aug, t.sep, t.oct, t.nov, t.dec];

    // ── Derived real analytics from scanHistory ──────────────────────────────

    const analyticsData = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();
        if (timeRange === "week") cutoff.setDate(now.getDate() - 7);
        else if (timeRange === "month") cutoff.setMonth(now.getMonth() - 1);
        else cutoff.setFullYear(now.getFullYear() - 1);

        const filtered = scanHistory.filter(s => new Date(s.date) >= cutoff);

        const totalScans = filtered.length;
        const healthyScans = filtered.filter(s => s.isHealthy).length;
        const diseaseScans = totalScans - healthyScans;
        const avgConfidence = totalScans > 0
            ? Math.round(filtered.reduce((sum, s) => sum + s.confidence, 0) / totalScans)
            : 0;

        // Disease breakdown for pie chart
        const diseaseCounts: Record<string, number> = {};
        filtered.forEach(s => {
            const key = s.isHealthy ? "Healthy" : s.disease;
            diseaseCounts[key] = (diseaseCounts[key] || 0) + 1;
        });
        const diseaseBreakdown = Object.entries(diseaseCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }));

        // Monthly trend (last 6 months)
        const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            const m = d.getMonth();
            const y = d.getFullYear();
            const monthScans = scanHistory.filter(s => {
                const sd = new Date(s.date);
                return sd.getMonth() === m && sd.getFullYear() === y;
            });
            return {
                month: MONTH_NAMES[m],
                scans: monthScans.length,
                diseases: monthScans.filter(s => !s.isHealthy).length,
            };
        });

        // Crop type breakdown
        const cropCounts: Record<string, number> = {};
        filtered.forEach(s => { cropCounts[s.crop] = (cropCounts[s.crop] || 0) + 1; });
        const cropTypes = Object.entries(cropCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, scans]) => ({ name, scans }));

        return { filtered, totalScans, healthyScans, diseaseScans, avgConfidence, diseaseBreakdown, monthlyTrend, cropTypes };
    }, [scanHistory, timeRange]);

    const { filtered, totalScans, healthyScans, diseaseScans, avgConfidence, diseaseBreakdown, monthlyTrend, cropTypes } = analyticsData;

    // Financial Data (Mocked for now)
    const financialData = useMemo(() => [
        { month: 'Jan', revenue: 12000, spend: 8000, profit: 4000 },
        { month: 'Feb', revenue: 15000, spend: 9000, profit: 6000 },
        { month: 'Mar', revenue: 18000, spend: 10000, profit: 8000 },
        { month: 'Apr', revenue: 14000, spend: 11000, profit: 3000 },
        { month: 'May', revenue: 22000, spend: 12000, profit: 10000 },
        { month: 'Jun', revenue: 25000, spend: 13000, profit: 12000 },
    ], []);

    const { totalRevenue, totalProfit, totalSpend } = useMemo(() => ({
        totalRevenue: financialData.reduce((acc, curr) => acc + curr.revenue, 0),
        totalProfit: financialData.reduce((acc, curr) => acc + curr.profit, 0),
        totalSpend: financialData.reduce((acc, curr) => acc + curr.spend, 0)
    }), [financialData]);

    // AI Insights generated from real data
    const insights = useMemo(() => {
        const res = [];
        if (totalScans === 0) {
            res.push({ title: t.noScansYetAnalytics, description: t.scanFirstCropInsights, type: "info", icon: ScanLine });
        } else {
            const healthRate = Math.round((healthyScans / totalScans) * 100);
            if (healthRate >= 70) {
                res.push({ title: t.healthyTrend, description: t.healthyTrendDesc.replace('{percent}', healthRate.toString()), type: "success", icon: CheckCircle2 });
            } else {
                res.push({ title: t.diseaseAlert, description: t.diseaseAlertDesc.replace('{percent}', (100 - healthRate).toString()), type: "warning", icon: AlertTriangle });
            }
            if (cropTypes.length > 0) {
                res.push({ title: t.focusCrop, description: t.focusCropDesc.replace('{crop}', cropTypes[0].name).replace('{count}', cropTypes[0].scans.toString()), type: "info", icon: Leaf });
            }
            if (avgConfidence > 0) {
                res.push({ title: t.aiAccuracy, description: t.aiAccuracyDesc.replace('{percent}', avgConfidence.toString()), type: avgConfidence >= 85 ? "success" : "warning", icon: Target });
            }
        }
        return res;
    }, [totalScans, healthyScans, cropTypes, avgConfidence, t]);

    const GlassPanel = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
        <div
            className={`rounded-2xl border border-white/10 ${className}`}
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", ...style }}
        >
            {children}
        </div>
    );

    return (
        <div
            className="min-h-screen"
            style={{ background: "linear-gradient(160deg, #0a1a0f 0%, #0d2318 40%, #071510 100%)" }}
        >
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 border-b border-white/10 px-4 py-3 flex items-center gap-3"
                style={{ background: "rgba(7,21,10,0.85)", backdropFilter: "blur(20px)" }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")}
                    className="rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-base font-bold text-white">{t.analytics}</h1>
                    <p className="text-xs text-emerald-400/70">{t.basedOnRealScanData}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl text-white/50 hover:text-white hover:bg-white/10">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-white/50 hover:text-white hover:bg-white/10">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </motion.header>

            <div className="px-4 py-5 space-y-5 pb-24">

                {/* Time Range Selector */}
                <div
                    className="flex gap-1 rounded-xl p-1 border border-white/10"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    {(["week", "month", "year"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all capitalize ${timeRange === range
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/40"
                                : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            {range === 'week' ? t.week : range === 'month' ? t.month : t.year}
                        </button>
                    ))}
                </div>

                {/* Overview Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <GlassPanel className="p-4 border-emerald-500/20" style={{ background: "rgba(16,185,129,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-300/80">{t.healthy}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{healthyScans}</p>
                        <p className="text-xs text-white/40 mt-1">{t.scans}</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-red-500/20" style={{ background: "rgba(239,68,68,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-300/80">{t.diseases}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{diseaseScans}</p>
                        <p className="text-xs text-white/40 mt-1">{t.detected}</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-blue-500/20" style={{ background: "rgba(59,130,246,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-300/80">{t.totalScansLabel}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{totalScans}</p>
                        <p className="text-xs text-white/40 mt-1">{timeRange === 'week' ? t.thisWeek : timeRange === 'month' ? t.thisMonth : t.thisYear}</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-purple-500/20" style={{ background: "rgba(139,92,246,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-purple-300/80">{t.avgConfidence}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{avgConfidence > 0 ? `${avgConfidence}%` : "—"}</p>
                        <p className="text-xs text-white/40 mt-1">{t.accuracy}</p>
                    </GlassPanel>
                </motion.div>

                {/* Community Impact Overview */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> {t.communityContribution}
                    </h2>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <GlassPanel className="p-3 border-emerald-500/20" style={{ background: "rgba(16,185,129,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-emerald-300/80 mb-1">{t.supportGiven}</p>
                            <p className="text-sm font-bold text-white">{(totalRevenue / 100).toFixed(0)} {t.units}</p>
                        </GlassPanel>
                        <GlassPanel className="p-3 border-blue-500/20" style={{ background: "rgba(59,130,246,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-blue-300/80 mb-1">{t.growthIndex}</p>
                            <p className="text-sm font-bold text-white">+{(totalProfit / 1000).toFixed(1)}%</p>
                        </GlassPanel>
                        <GlassPanel className="p-3 border-red-500/20" style={{ background: "rgba(239,68,68,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-red-300/80 mb-1">{t.resources}</p>
                            <p className="text-sm font-bold text-white">{(totalSpend / 100).toFixed(0)} {t.packs}</p>
                        </GlassPanel>
                    </div>

                    {/* Impact Chart */}
                    <GlassPanel className="p-4">
                        <h3 className="text-sm font-bold text-white mb-3">{t.supportVsGrowth}</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                        contentStyle={{ backgroundColor: '#0d2318', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                                    <Bar dataKey="revenue" name={t.support} fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                                    <Bar dataKey="profit" name={t.growth} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </motion.section>

                {/* Monthly Trend */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" /> {t.monthlyTrend}
                    </h3>
                    <GlassPanel className="p-4">
                        {scanHistory.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-white/30">
                                <BarChart3 className="w-8 h-8 mb-2" />
                                <p className="text-sm">{t.noScanDataYet}</p>
                            </div>
                        ) : (
                            <div className="h-52 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTrend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} allowDecimals={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                            contentStyle={{ backgroundColor: '#0d2318', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                                        <Bar dataKey="scans" name={t.totalScansLabel} fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                                        <Bar dataKey="diseases" name={t.diseases} fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </GlassPanel>
                </motion.div>

                {/* Disease Distribution */}
                {diseaseBreakdown.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-purple-400" /> {t.diseaseDistribution}
                        </h3>
                        <GlassPanel className="p-4">
                            <div className="h-52 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={diseaseBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {diseaseBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0d2318', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}

                {/* Crop Analysis */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-emerald-400" /> {t.cropAnalysis}
                    </h3>
                    <GlassPanel>
                        {cropTypes.length === 0 ? (
                            <div className="p-6 text-center text-white/30">
                                <Leaf className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">{t.noCropDataYet}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {cropTypes.map((crop, index) => (
                                    <motion.div
                                        key={crop.name}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + index * 0.07 }}
                                        className="p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                                                <Leaf className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{crop.name}</p>
                                                <p className="text-xs text-white/40">{crop.scans} {t.scan}{crop.scans !== 1 ? "s" : ""}</p>
                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-bold text-white">{crop.scans}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </GlassPanel>
                </motion.div>

                {/* Key Metrics */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" /> {t.keyMetrics}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: "🔥", label: t.totalScansLabel, value: user?.scans ?? 0 },
                            { icon: "🎯", label: t.avgConfidence, value: avgConfidence > 0 ? `${avgConfidence}%` : "—" },
                            { icon: "🌱", label: t.cropTypes, value: Object.keys(cropCounts).length || "—" },
                            { icon: "✅", label: t.healthyRate, value: totalScans > 0 ? `${Math.round((healthyScans / totalScans) * 100)}%` : "—" },
                        ].map((m, i) => (
                            <motion.div
                                key={m.label}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.35 + i * 0.07 }}
                            >
                                <GlassPanel className="p-4 text-center">
                                    <div className="text-2xl mb-1">{m.icon}</div>
                                    <p className="text-xl font-bold text-white mb-0.5">{m.value}</p>
                                    <p className="text-xs text-white/40">{m.label}</p>
                                </GlassPanel>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insights */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-400" /> {t.aiPoweredInsights}
                    </h3>
                    <div className="space-y-3">
                        {insights.map((insight, index) => {
                            const IconComponent = insight.icon;
                            const colors = insight.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : insight.type === "warning"
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                    : "bg-blue-500/10 border-blue-500/20 text-blue-400";
                            return (
                                <motion.div
                                    key={insight.title}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.45 + index * 0.08 }}
                                >
                                    <GlassPanel className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${colors}`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm mb-0.5">{insight.title}</h4>
                                                <p className="text-xs text-white/50">{insight.description}</p>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Scan History with Treatment Details */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-cyan-400" /> {t.scanHistoryTreatment}
                    </h3>
                    {filtered.length === 0 ? (
                        <GlassPanel className="p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                <ScanLine className="w-8 h-8 text-white/20" />
                            </div>
                            <p className="text-white/40 text-sm">{t.noScanHistoryTimeRange}</p>
                            <p className="text-white/20 text-xs mt-1">{t.uploadFirstCropImage}</p>
                        </GlassPanel>
                    ) : (
                        <div className="space-y-3">
                            {filtered.slice(0, 10).reverse().map((scan, index) => {
                                const severityColors = {
                                    low: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: "🟢" },
                                    medium: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", icon: "🟡" },
                                    high: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", icon: "🔴" },
                                };
                                const severity = severityColors[scan.severity];
                                const scanDate = new Date(scan.date);
                                const dateStr = scanDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                const timeStr = scanDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <motion.div
                                        key={scan.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                    >
                                        <GlassPanel className={`overflow-hidden border ${severity.border}`}>
                                            {/* Header with Image */}
                                            <div className="flex gap-3 p-3">
                                                {/* Crop Image */}
                                                {scan.imageUrl && (
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black/40">
                                                        <img
                                                            src={scan.imageUrl}
                                                            alt={scan.disease}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm leading-tight mb-0.5">
                                                                {scan.isHealthy ? `✅ ${t.healthyCrop}` : scan.disease}
                                                            </h4>
                                                            <p className="text-xs text-white/50">{scan.crop}</p>
                                                        </div>
                                                        <div className={`px-2 py-1 rounded-lg ${severity.bg} border ${severity.border} flex items-center gap-1`}>
                                                            <span className="text-xs">{severity.icon}</span>
                                                            <span className={`text-xs font-semibold capitalize ${severity.text}`}>
                                                                {scan.severity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Metadata */}
                                                    <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{dateStr}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Target className="w-3 h-3" />
                                                            <span>{scan.confidence}% {t.confidence}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Confidence Bar */}
                                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                scan.confidence >= 90 ? 'bg-emerald-500' :
                                                                scan.confidence >= 75 ? 'bg-blue-500' :
                                                                scan.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${scan.confidence}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Treatment Section */}
                                            {!scan.isHealthy && (
                                                <div className={`${severity.bg} border-t ${severity.border} p-3 space-y-2.5`}>
                                                    {/* Treatment Description */}
                                                    {scan.description && (
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <Zap className={`w-3.5 h-3.5 ${severity.text}`} />
                                                                <span className={`text-xs font-bold ${severity.text} uppercase tracking-wide`}>
                                                                    {t.recommendedTreatmentLabel}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-white/70 leading-relaxed">
                                                                {scan.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Preventive Measures */}
                                                    {scan.preventiveMeasures && scan.preventiveMeasures.length > 0 && (
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <ShieldCheck className={`w-3.5 h-3.5 ${severity.text}`} />
                                                                <span className={`text-xs font-bold ${severity.text} uppercase tracking-wide`}>
                                                                    {t.preventiveMeasuresLabel}
                                                                </span>
                                                            </div>
                                                            <ul className="space-y-1">
                                                                {scan.preventiveMeasures.slice(0, 3).map((measure, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2 text-xs text-white/70">
                                                                        <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${severity.text}`} 
                                                                            style={{ backgroundColor: 'currentColor' }} />
                                                                        <span>{measure}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </GlassPanel>
                                    </motion.div>
                                );
                            })}
                            
                            {/* Show More Indicator */}
                            {filtered.length > 10 && (
                                <GlassPanel className="p-3 text-center">
                                    <p className="text-xs text-white/40">
                                        {t.showingScans.replace('{count}', filtered.length.toString())}
                                    </p>
                                </GlassPanel>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Severity Trend Chart */}
                {filtered.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" /> {t.severityTrendOverTime}
                        </h3>
                        <GlassPanel className="p-4">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={filtered.slice(-10).map((scan, idx) => ({
                                            name: `Scan ${idx + 1}`,
                                            confidence: scan.confidence,
                                            severity: scan.severity === 'high' ? 3 : scan.severity === 'medium' ? 2 : 1,
                                        }))}
                                        margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0d2318', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        />
                                        <Line type="monotone" dataKey="confidence" name={t.confidencePercent} stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
