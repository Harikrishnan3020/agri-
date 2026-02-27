import { useState, useEffect } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Cloud,
    CloudRain,
    Sun,
    Wind,
    Droplets,
    Gauge,
    Calendar,
    MapPin,
    Navigation,
    Umbrella,
    Sunrise,
    Sunset,
    AlertTriangle,
    Leaf,
    Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeatherData {
    current: {
        temp: number;
        feelsLike: number;
        humidity: number;
        windSpeed: number;
        pressure: number;
        visibility: number;
        condition: string;
        uvIndex: number;
        sunrise: string;
        sunset: string;
        icon: React.ElementType;
    };
    hourly: Array<{
        time: string;
        temp: number;
        rainChance: number;
    }>;
    forecast: Array<{
        day: string;
        temp: { high: number; low: number };
        condition: string;
        rainChance: number;
        icon: React.ElementType;
    }>;
    farmingAdvice: Array<{
        title: string;
        status: "safe" | "warning" | "danger";
        description: string;
        icon: React.ElementType;
    }>;
}

const WeatherDashboard = () => {
    const navigate = useNavigate();
    const { user, selectedLanguage } = useAppStore();
    const t = translations[selectedLanguage as LanguageCode] || translations.en;

    const [location, setLocation] = useState(t.defaultLocation);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [tempLocation, setTempLocation] = useState(location);

    const handleLocationSave = () => {
        setLocation(tempLocation);
        setIsEditingLocation(false);
    };

    // Dynamic Weather Data Generation based on season
    const getSeasonalWeatherData = () => {
        const month = new Date().getMonth(); // 0-11
        const hour = new Date().getHours();

        // Determine season: Winter(11-1), Pre-Monsoon(2-5), Monsoon(6-9), Post-Monsoon(10)
        let season = "Winter";
        if (month >= 2 && month <= 5) season = "Summer";
        else if (month >= 6 && month <= 9) season = "Monsoon";
        else if (month === 10) season = "Autumn";

        const seasonLabel = season === "Winter"
            ? t.seasonWinter
            : season === "Summer"
                ? t.seasonSummer
                : season === "Monsoon"
                    ? t.seasonMonsoon
                    : t.seasonAutumn;

        return {
            current: {
                temp: season === "Summer" ? 34 : season === "Winter" ? 22 : 28,
                feelsLike: season === "Summer" ? 38 : season === "Winter" ? 21 : 31,
                humidity: season === "Monsoon" ? 85 : season === "Summer" ? 45 : 60,
                windSpeed: season === "Monsoon" ? 18 : 12,
                pressure: 1010,
                visibility: season === "Winter" && hour < 9 ? 2 : 10,
                uvIndex: season === "Summer" && (hour > 10 && hour < 16) ? 9 : 4,
                sunrise: t.sunriseTime,
                sunset: t.sunsetTime,
                condition: season === "Monsoon" ? t.conditionRainy : season === "Summer" ? t.conditionSunny : t.conditionPartlyCloudy,
                icon: season === "Monsoon" ? CloudRain : season === "Summer" ? Sun : Cloud,
            },
            hourly: Array.from({ length: 7 }, (_, i) => {
                const h = (hour + i) % 24;
                const isDay = h > 6 && h < 18;
                const isPm = h >= 12;
                const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                return {
                    time: i === 0 ? t.now : `${hour12} ${isPm ? t.pm : t.am}`,
                    temp: isDay ? (season === "Summer" ? 34 : 28) : (season === "Summer" ? 28 : 22),
                    rainChance: season === "Monsoon" ? 60 + (i * 5) : 10
                };
            }),
            forecast: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayName = date.toLocaleDateString(t.localeCode, { weekday: 'short' });
                return {
                    day: i === 0 ? t.today : dayName,
                    temp: {
                        high: season === "Summer" ? 38 : 30,
                        low: season === "Summer" ? 28 : 22
                    },
                    condition: season === "Monsoon" ? t.conditionRainy : t.conditionSunny,
                    rainChance: season === "Monsoon" ? 80 : 10,
                    icon: season === "Monsoon" ? CloudRain : Sun
                };
            }),
            farmingAdvice: [
                {
                    title: season === "Monsoon" ? t.drainageAlert : t.irrigationPlan,
                    status: (season === "Monsoon" ? "danger" : "warning") as "safe" | "warning" | "danger",
                    description: season === "Monsoon"
                        ? t.drainageAlertDesc
                        : t.irrigationPlanDesc,
                    icon: Droplets,
                },
                {
                    title: t.pestForecast,
                    status: "warning" as "safe" | "warning" | "danger",
                    description: season === "Winter"
                        ? t.pestForecastDescWinter
                        : t.pestForecastDescWarm,
                    icon: AlertTriangle,
                },
                {
                    title: t.sprayingGuide,
                    status: "safe" as "safe" | "warning" | "danger",
                    description: t.sprayingGuideDesc,
                    icon: Sprout,
                },
            ],
        };
    };

    const [weatherData] = useState<WeatherData>(getSeasonalWeatherData());

    // Auto-detect location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // For a real app, we would use a reverse geocoding API here
                    // identifying location by coordinates for now to show "live" aspect
                    const lat = position.coords.latitude.toFixed(4);
                    const lon = position.coords.longitude.toFixed(4);
                    // Mocking a reverse geocode for a better UX based on coords (usually requires API)
                    // We'll show the coordinates as "Live Location" indicating it's active
                    const locString = `${t.liveLocation} (${lat}, ${lon})`;
                    setLocation(locString);
                    setTempLocation(locString);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback or keep default
                }
            );
        }
    }, []);

    const getStatusColor = (status: "safe" | "warning" | "danger") => {
        switch (status) {
            case "safe": return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
            case "warning": return "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
            case "danger": return "text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
            >
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                            <Navigation className="w-3 h-3" />
                            {isEditingLocation ? (
                                <input
                                    type="text"
                                    value={tempLocation}
                                    onChange={(e) => setTempLocation(e.target.value)}
                                    className="bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-500 w-full max-w-[200px]"
                                    autoFocus
                                />
                            ) : (
                                location
                            )}
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t.weatherTitle}</h1>
                    </div>
                    {isEditingLocation ? (
                        <div className="flex gap-2">
                            <Button onClick={handleLocationSave} size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-full h-8 px-3 text-xs">
                                {t.save}
                            </Button>
                            <Button onClick={() => setIsEditingLocation(false)} variant="ghost" size="sm" className="rounded-full h-8 px-3 text-xs">
                                {t.cancel}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setTempLocation(location);
                                setIsEditingLocation(true);
                            }}
                            className="gap-2 rounded-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            {t.change}
                        </Button>
                    )}
                </div>
            </motion.header>

            <div className="max-w-5xl mx-auto px-4 py-8 pb-24 space-y-8">

                {/* Main Weather Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2D68FF] to-[#1E40AF] text-white shadow-2xl shadow-blue-900/30"
                >
                    <div className="absolute -top-24 -right-24 opacity-20 rotate-12">
                        <Cloud className="w-96 h-96" />
                    </div>

                    {/* Glassy Overlay Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

                    <div className="relative p-6 sm:p-10">
                        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide shadow-inner">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                                    {t.liveUpdates}
                                </div>
                                <div>
                                    <h2 className="text-7xl sm:text-8xl font-light tracking-tighter relative inline-flex items-start leading-none">
                                        {weatherData.current.temp}°
                                    </h2>
                                    <p className="text-blue-100 text-xl font-medium flex items-center gap-3 mt-2">
                                        {weatherData.current.condition}
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300/50"></span>
                                        <span className="opacity-90">{t.highAbbrev} {weatherData.forecast[0].temp.high}°</span>
                                        <span className="opacity-90">{t.lowAbbrev} {weatherData.forecast[0].temp.low}°</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 w-full lg:w-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2 text-center transition-transform hover:scale-105">
                                        <Wind className="w-6 h-6 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200 mb-0.5">{t.wind}</p>
                                            <p className="text-sm font-bold">{weatherData.current.windSpeed} {t.kmPerHour}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2 text-center transition-transform hover:scale-105">
                                        <Droplets className="w-6 h-6 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200 mb-0.5">{t.humidity}</p>
                                            <p className="text-sm font-bold">{weatherData.current.humidity}%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2 text-center transition-transform hover:scale-105">
                                        <Gauge className="w-6 h-6 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200 mb-0.5">{t.pressure}</p>
                                            <p className="text-sm font-bold">{weatherData.current.pressure} {t.hPa}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-2 text-center transition-transform hover:scale-105">
                                        <Sun className="w-6 h-6 text-blue-200" />
                                        <div>
                                            <p className="text-xs text-blue-200 mb-0.5">{t.uvIndex}</p>
                                            <p className="text-sm font-bold">{weatherData.current.uvIndex}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hourly Chart */}
                    <div className="bg-black/10 backdrop-blur-sm border-t border-white/5 p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-white/90 flex items-center gap-2">
                                <span className="w-1 h-4 bg-white/40 rounded-full"></span>
                                {t.tempTrend}
                            </p>
                            <p className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-md border border-white/5">{t.next6Hours}</p>
                        </div>
                        <div className="h-40 w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weatherData.hourly}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                        itemStyle={{ color: '#93c5fd' }}
                                        formatter={(value: number | string) => [`${value}°C`, t.tempLabel]}
                                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temp"
                                        stroke="#ffffff"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#tempGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Farming Insights */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.farmingInsights}</h3>
                        </div>

                        <div className="grid gap-4">
                            {weatherData.farmingAdvice.map((advice, i) => (
                                <GlassCard
                                    key={i}
                                    className={`p-5 flex gap-5 items-start transition-all hover:scale-[1.01] hover:shadow-lg ${getStatusColor(advice.status)} bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-l-4`}
                                    style={{ borderLeftColor: advice.status === 'safe' ? '#10b981' : advice.status === 'warning' ? '#d97706' : '#ef4444' }}
                                >
                                    <div className={`mt-1 p-2.5 rounded-xl shadow-sm ${advice.status === 'safe' ? 'bg-emerald-200/50' : advice.status === 'warning' ? 'bg-amber-200/50' : 'bg-red-200/50'}`}>
                                        <advice.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1.5">{advice.title}</h4>
                                        <p className="text-sm opacity-90 leading-relaxed font-medium">{advice.description}</p>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>

                    {/* 7 Day Forecast */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 h-fit"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.forecastTitle}</h3>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {weatherData.forecast.map((day, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <div className="flex items-center gap-4 w-1/3">
                                        <p className="font-semibold text-slate-700 dark:text-slate-300 w-12">{day.day}</p>
                                        {day.rainChance > 0 && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md">
                                                <Umbrella className="w-3 h-3" />
                                                {day.rainChance}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center w-1/3">
                                        <day.icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 w-1/3">
                                        <span className="font-bold text-slate-400 text-sm">{day.temp.low}°</span>
                                        <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                            <div
                                                className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-amber-400"
                                                style={{
                                                    left: '10%',
                                                    right: '10%'
                                                }}
                                            />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{day.temp.high}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>



            </div>
        </div>
    );
};

export default WeatherDashboard;
