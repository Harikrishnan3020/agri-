import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    TrendingUp,
    BarChart3,
    PieChart,
    Activity,
    Calendar,
    Leaf,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    Target,
    Award,
    Download,
    Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/useAppStore";

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAppStore();

    const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

    // Mock analytics data
    const analytics = {
        overview: {
            totalScans: user?.scans || 0,
            healthyScans: Math.floor((user?.scans || 0) * 0.6),
            diseaseDetected: Math.floor((user?.scans || 0) * 0.4),
            avgAccuracy: 96.5,
        },
        diseaseBreakdown: [
            { name: "Late Blight", count: 12, percentage: 35, color: "bg-red-500" },
            { name: "Powdery Mildew", count: 8, percentage: 24, color: "bg-amber-500" },
            { name: "Leaf Spot", count: 6, percentage: 18, color: "bg-orange-500" },
            { name: "Healthy", count: 20, percentage: 60, color: "bg-green-500" },
            { name: "Others", count: 4, percentage: 12, color: "bg-blue-500" },
        ],
        cropTypes: [
            { name: "Tomato", scans: 18, trend: "up" },
            { name: "Potato", scans: 12, trend: "up" },
            { name: "Rice", scans: 8, trend: "same" },
            { name: "Cucumber", scans: 6, trend: "down" },
        ],
        monthlyTrend: [
            { month: "Jan", scans: 5, diseases: 2 },
            { month: "Feb", scans: 8, diseases: 3 },
            { month: "Mar", scans: 12, diseases: 4 },
            { month: "Apr", scans: 15, diseases: 6 },
            { month: "May", scans: 10, diseases: 4 },
            { month: "Jun", scans: 14, diseases: 5 },
        ],
        insights: [
            {
                title: "Peak Disease Season",
                description: "April shows highest disease detection. Consider preventive measures.",
                type: "warning",
                icon: AlertTriangle,
            },
            {
                title: "Healthy Trend",
                description: "60% of your crops are healthy - great job!",
                type: "success",
                icon: CheckCircle2,
            },
            {
                title: "Focus Area",
                description: "Tomatoes need more attention. Consider soil testing.",
                type: "info",
                icon: Target,
            },
        ],
        achievements: [
            { title: "Scan Streak", value: "7 days", icon: "🔥" },
            { title: "Detection Rate", value: "96.5%", icon: "🎯" },
            { title: "Crops Monitored", value: "4 types", icon: "🌱" },
            { title: "Healthy Rate", value: "60%", icon: "✅" },
        ],
    };

    const getTrendIcon = (trend: string) => {
        return trend === "up" ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
        ) : trend === "down" ? (
            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
        ) : (
            <Activity className="w-4 h-4 text-gray-400" />
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
            >
                <div className="px-4 py-4 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-xs text-gray-500">Your farming insights & trends</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.header>

            <div className="px-4 py-6 space-y-6 pb-24">
                {/* Time Range Selector */}
                <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                    {(["week", "month", "year"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${timeRange === range
                                    ? "bg-purple-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-3"
                >
                    <GlassCard className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm opacity-90">Healthy</span>
                        </div>
                        <p className="text-3xl font-bold">{analytics.overview.healthyScans}</p>
                        <p className="text-xs opacity-75 mt-1">Total scans</p>
                    </GlassCard>

                    <GlassCard className="p-4 bg-gradient-to-br from-red-500 to-pink-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm opacity-90">Diseases</span>
                        </div>
                        <p className="text-3xl font-bold">{analytics.overview.diseaseDetected}</p>
                        <p className="text-xs opacity-75 mt-1">Detected</p>
                    </GlassCard>

                    <GlassCard className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-sm opacity-90">Total Scans</span>
                        </div>
                        <p className="text-3xl font-bold">{analytics.overview.totalScans}</p>
                        <p className="text-xs opacity-75 mt-1">This {timeRange}</p>
                    </GlassCard>

                    <GlassCard className="p-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="w-5 h-5" />
                            <span className="text-sm opacity-90">Accuracy</span>
                        </div>
                        <p className="text-3xl font-bold">{analytics.overview.avgAccuracy}%</p>
                        <p className="text-xs opacity-75 mt-1">Average</p>
                    </GlassCard>
                </motion.div>

                {/* Disease Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-purple-600" />
                        Disease Distribution
                    </h3>
                    <GlassCard className="p-4">
                        <div className="space-y-3">
                            {analytics.diseaseBreakdown.map((disease, index) => (
                                <div key={disease.name}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-700">{disease.name}</span>
                                        <span className="text-sm font-bold text-gray-900">{disease.count}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${disease.percentage}%` }}
                                            transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                                            className={`h-full ${disease.color} rounded-full`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{disease.percentage}% of total</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Crop Types Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        Crop Analysis
                    </h3>
                    <GlassCard>
                        <div className="divide-y divide-gray-100">
                            {analytics.cropTypes.map((crop, index) => (
                                <motion.div
                                    key={crop.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{crop.name}</p>
                                            <p className="text-xs text-gray-500">{crop.scans} scans</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getTrendIcon(crop.trend)}
                                        <span className="text-sm font-bold text-gray-900">{crop.scans}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Monthly Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Monthly Trend
                    </h3>
                    <GlassCard className="p-4">
                        <div className="space-y-4">
                            {analytics.monthlyTrend.map((month, index) => {
                                const maxScans = Math.max(...analytics.monthlyTrend.map((m) => m.scans));
                                const scanWidth = (month.scans / maxScans) * 100;
                                const diseaseWidth = (month.diseases / month.scans) * 100;

                                return (
                                    <div key={month.month}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                                            <div className="flex-1 ml-4">
                                                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scanWidth}%` }}
                                                        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                                                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-end pr-2"
                                                    >
                                                        <span className="text-xs font-bold text-white">{month.scans}</span>
                                                    </motion.div>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${diseaseWidth}%` }}
                                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                                        className="absolute top-0 left-0 h-full bg-red-500/40"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-600">Total Scans</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-gray-600">Diseases</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-600" />
                        Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {analytics.achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                <GlassCard className="p-4 text-center">
                                    <div className="text-3xl mb-2">{achievement.icon}</div>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{achievement.value}</p>
                                    <p className="text-xs text-gray-600">{achievement.title}</p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        AI-Powered Insights
                    </h3>
                    <div className="space-y-3">
                        {analytics.insights.map((insight, index) => {
                            const IconComponent = insight.icon;
                            const bgColor =
                                insight.type === "success"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : insight.type === "warning"
                                        ? "bg-amber-100 text-amber-700 border-amber-200"
                                        : "bg-blue-100 text-blue-700 border-blue-200";

                            return (
                                <motion.div
                                    key={insight.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                    <GlassCard className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bgColor}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                                                <p className="text-sm text-gray-600">{insight.description}</p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Export Options */}
                <GlassCard className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Export Your Data</h4>
                            <p className="text-sm text-gray-600">Download detailed reports and analytics</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
