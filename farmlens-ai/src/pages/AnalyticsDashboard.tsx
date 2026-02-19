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
    Legend
} from 'recharts';


const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ["#ef4444", "#f59e0b", "#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const { user, scanHistory } = useAppStore();
    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

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
            res.push({ title: "No Scans Yet", description: "Scan your first crop to see personalized insights here.", type: "info", icon: ScanLine });
        } else {
            const healthRate = Math.round((healthyScans / totalScans) * 100);
            if (healthRate >= 70) {
                res.push({ title: "Healthy Trend 🌿", description: `${healthRate}% of your crops are healthy — great job!`, type: "success", icon: CheckCircle2 });
            } else {
                res.push({ title: "Disease Alert ⚠️", description: `${100 - healthRate}% of scans detected diseases. Consider preventive measures.`, type: "warning", icon: AlertTriangle });
            }
            if (cropTypes.length > 0) {
                res.push({ title: "Focus Crop", description: `${cropTypes[0].name} is your most scanned crop with ${cropTypes[0].scans} scan(s).`, type: "info", icon: Leaf });
            }
            if (avgConfidence > 0) {
                res.push({ title: "AI Accuracy", description: `Average detection confidence is ${avgConfidence}% across your scans.`, type: avgConfidence >= 85 ? "success" : "warning", icon: Target });
            }
        }
        return res;
    }, [totalScans, healthyScans, cropTypes, avgConfidence]);

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
                    <h1 className="text-base font-bold text-white">Analytics</h1>
                    <p className="text-xs text-emerald-400/70">Based on your real scan data</p>
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
                            {range.charAt(0).toUpperCase() + range.slice(1)}
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
                            <span className="text-xs text-emerald-300/80">Healthy</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{healthyScans}</p>
                        <p className="text-xs text-white/40 mt-1">scans</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-red-500/20" style={{ background: "rgba(239,68,68,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs text-red-300/80">Diseases</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{diseaseScans}</p>
                        <p className="text-xs text-white/40 mt-1">detected</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-blue-500/20" style={{ background: "rgba(59,130,246,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-blue-300/80">Total Scans</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{totalScans}</p>
                        <p className="text-xs text-white/40 mt-1">this {timeRange}</p>
                    </GlassPanel>

                    <GlassPanel className="p-4 border-purple-500/20" style={{ background: "rgba(139,92,246,0.1)" } as React.CSSProperties}>
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-purple-300/80">Avg Confidence</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{avgConfidence > 0 ? `${avgConfidence}%` : "—"}</p>
                        <p className="text-xs text-white/40 mt-1">accuracy</p>
                    </GlassPanel>
                </motion.div>

                {/* Financial Overview Cards */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Financial Overview
                    </h2>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <GlassPanel className="p-3 border-emerald-500/20" style={{ background: "rgba(16,185,129,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-emerald-300/80 mb-1">Revenue</p>
                            <p className="text-sm font-bold text-white">₹{(totalRevenue / 1000).toFixed(1)}k</p>
                        </GlassPanel>
                        <GlassPanel className="p-3 border-blue-500/20" style={{ background: "rgba(59,130,246,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-blue-300/80 mb-1">Profit</p>
                            <p className="text-sm font-bold text-white">₹{(totalProfit / 1000).toFixed(1)}k</p>
                        </GlassPanel>
                        <GlassPanel className="p-3 border-red-500/20" style={{ background: "rgba(239,68,68,0.1)" } as React.CSSProperties}>
                            <p className="text-xs text-red-300/80 mb-1">Spend</p>
                            <p className="text-sm font-bold text-white">₹{(totalSpend / 1000).toFixed(1)}k</p>
                        </GlassPanel>
                    </div>

                    {/* Financial Chart */}
                    <GlassPanel className="p-4">
                        <h3 className="text-sm font-bold text-white mb-3">Revenue vs Profit</h3>
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
                                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                                    <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </motion.section>

                {/* Monthly Trend */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" /> Monthly Trend
                    </h3>
                    <GlassPanel className="p-4">
                        {scanHistory.length === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-white/30">
                                <BarChart3 className="w-8 h-8 mb-2" />
                                <p className="text-sm">No scan data yet</p>
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
                                        <Bar dataKey="scans" name="Total Scans" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                                        <Bar dataKey="diseases" name="Diseases" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
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
                            <PieChartIcon className="w-4 h-4 text-purple-400" /> Disease Distribution
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
                        <Leaf className="w-4 h-4 text-emerald-400" /> Crop Analysis
                    </h3>
                    <GlassPanel>
                        {cropTypes.length === 0 ? (
                            <div className="p-6 text-center text-white/30">
                                <Leaf className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">No crop data yet</p>
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
                                                <p className="text-xs text-white/40">{crop.scans} scan{crop.scans !== 1 ? "s" : ""}</p>
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
                        <Award className="w-4 h-4 text-amber-400" /> Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: "🔥", label: "Total Scans", value: user?.scans ?? 0 },
                            { icon: "🎯", label: "Avg Confidence", value: avgConfidence > 0 ? `${avgConfidence}%` : "—" },
                            { icon: "🌱", label: "Crop Types", value: Object.keys(cropCounts).length || "—" },
                            { icon: "✅", label: "Healthy Rate", value: totalScans > 0 ? `${Math.round((healthyScans / totalScans) * 100)}%` : "—" },
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
                        <Activity className="w-4 h-4 text-purple-400" /> AI-Powered Insights
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

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
