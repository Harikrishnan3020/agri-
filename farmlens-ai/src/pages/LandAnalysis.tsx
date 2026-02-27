import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    CheckCircle2,
    Sprout,
    TrendingUp,
    IndianRupee,
    AlertCircle,
    Loader2,
    ScanLine,
    Leaf,
    MapPin,
    CloudSun,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";
import { analyzeLandWithGroq, LandAnalysisResult } from "@/services/landAnalysis";

const LandAnalysis = () => {
    const navigate = useNavigate();
    const { user, selectedLanguage } = useAppStore();
    const t = translations[selectedLanguage as LanguageCode] || translations.en;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<LandAnalysisResult | null>(null);
    const [location, setLocation] = useState<string>(t.detectingLocation);
    const [weather, setWeather] = useState<string>(t.fetchingWeather);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(`${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° E`);
                    // Use season-based weather
                    const month = new Date().getMonth();
                    const isMonsoon = month >= 6 && month <= 9;
                    const isSummer = month >= 3 && month <= 5;
                    const condition = isMonsoon ? t.conditionRainy : isSummer ? t.conditionSunny : t.conditionPartlyCloudy;
                    const temp = isMonsoon ? "28" : isSummer ? "35" : "28";
                    setWeather(t.weatherFormat.replace("{condition}", condition).replace("{temp}", temp));
                },
                () => {
                    setLocation(t.locationAccessDenied);
                    setWeather(t.weatherFormat.replace("{condition}", t.conditionPartlyCloudy).replace("{temp}", "28"));
                }
            );
        } else {
            setLocation(t.locationUnavailable);
            setWeather(t.weatherFormat.replace("{condition}", t.conditionPartlyCloudy).replace("{temp}", "28"));
        }
    }, [t]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
            setAnalysisResult(null);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!selectedFile || !selectedImage) return;

        setIsAnalyzing(true);
        toast.info(t.landAnalyzingToast, { duration: 5000 });

        try {
            const result = await analyzeLandWithGroq(selectedFile);
            setAnalysisResult(result);
            toast.success(t.landAnalysisCompleteToast);
        } catch (error) {
            console.error("Land analysis failed:", error);
            toast.error(t.landAnalysisFailedToast);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-sans text-slate-900">
            {/* Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-58f26c07174b?q=80&w=1000&auto=format&fit=crop')",
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50/95" />

            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/20 px-4 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/50 hover:bg-white/80">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <h1 className="text-xl font-bold text-slate-900">{t.landAnalysisTitle}</h1>
                </div>
                <div className="flex flex-col items-end text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {location}
                    </div>
                    <div className="flex items-center gap-1">
                        <CloudSun className="w-3 h-3 text-amber-500" />
                        {weather}
                    </div>
                </div>
            </motion.header>

            <div className="max-w-2xl mx-auto p-4 space-y-6 relative z-10">

                {/* AI Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50/80 border border-emerald-200/50 rounded-2xl w-fit"
                >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">{t.landAnalysisBadge}</span>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg text-center space-y-4"
                >
                    <div className="border-2 border-dashed border-emerald-500/30 bg-emerald-50/30 rounded-2xl p-8 transition-all hover:bg-emerald-50/50 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                        {selectedImage ? (
                            <div className="relative">
                                <img src={selectedImage} alt="Land" className="w-full h-64 object-cover rounded-xl shadow-md transform group-hover:scale-[1.01] transition-transform" />
                                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">{t.changePhoto}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 py-6">
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
                                    <Upload className="w-10 h-10 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-slate-900 font-bold text-lg mb-1">{t.uploadLandPhoto}</p>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto">{t.uploadLandPhotoDesc}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center text-xs text-slate-400">
                                    <span className="px-2 py-1 bg-white/60 rounded-lg border border-slate-200">📸 {t.cameraPhoto}</span>
                                    <span className="px-2 py-1 bg-white/60 rounded-lg border border-slate-200">🖼️ {t.galleryImage}</span>
                                    <span className="px-2 py-1 bg-white/60 rounded-lg border border-slate-200">🔍 {t.soilCloseUp}</span>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {selectedImage && !analysisResult && (
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full rounded-2xl py-6 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-white font-bold"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    {t.aiAnalyzingLand}
                                </>
                            ) : (
                                <>
                                    <ScanLine className="w-5 h-5 mr-2" />
                                    {t.analyzeLandWithAI}
                                </>
                            )}
                        </Button>
                    )}

                    {analysisResult && (
                        <Button
                            onClick={() => { setAnalysisResult(null); setSelectedImage(null); setSelectedFile(null); }}
                            variant="outline"
                            className="w-full rounded-2xl py-5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                            {t.analyzeAnotherPhoto}
                        </Button>
                    )}
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 pb-20"
                        >
                            {/* Summary Card */}
                            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-emerald-100 font-medium mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t.aiAnalysisComplete}</p>
                                            <h2 className="text-3xl font-bold tracking-tight">{analysisResult.soilType}</h2>
                                        </div>
                                        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md shadow-sm border border-white/10">
                                            <Sprout className="w-8 h-8 text-emerald-100" />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-md border border-white/10">
                                            <span>{t.phLabel}: <strong>{analysisResult.phLevel}</strong></span>
                                        </div>
                                        <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full text-sm backdrop-blur-md border border-white/10">
                                            <span>{t.organicCarbonLabel}: <strong>{analysisResult.organicCarbon}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Improvements */}
                            {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-blue-600" /> {t.improveLandTitle}
                                    </h3>
                                    <ul className="space-y-3">
                                        {analysisResult.improvements.map((tip, i) => (
                                            <li key={i} className="flex gap-3 text-slate-700 text-sm">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <span className="pt-0.5">{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Crop Recommendations */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 px-1">
                                    <Leaf className="w-5 h-5 text-emerald-600" /> {t.bestSuitableCrops}
                                </h3>
                                <div className="space-y-3">
                                    {analysisResult.suitableCrops.map((crop: LandAnalysisResult['suitableCrops'][0], index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-lg">{crop.name}</h4>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-500">{t.aiMatchLabel}:</span>
                                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: crop.match }}></div>
                                                            </div>
                                                            <span className="text-emerald-600 font-bold">{crop.match}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                                                        {crop.profit} {t.profitLabel}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">{t.expYieldLabel}</span>
                                                    <span className="font-semibold text-slate-700">{crop.yield}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">{t.durationLabel}</span>
                                                    <span className="font-semibold text-slate-700">{crop.duration}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Financial Analysis */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5 text-blue-600" /> {t.financialProjection}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-red-50/80 rounded-2xl border border-red-100">
                                        <p className="text-xs text-red-500 uppercase font-bold tracking-wider mb-1">{t.investmentLabel}</p>
                                        <p className="text-lg font-bold text-red-700">{analysisResult.financials.estimatedCost}</p>
                                    </div>
                                    <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                                        <p className="text-xs text-emerald-500 uppercase font-bold tracking-wider mb-1">{t.revenueLabel}</p>
                                        <p className="text-lg font-bold text-emerald-700">{analysisResult.financials.estimatedRevenue}</p>
                                    </div>
                                    <div className="col-span-2 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-1">{t.netProfitPotential}</p>
                                            <p className="text-2xl font-bold text-blue-700">{analysisResult.financials.projectedProfit}</p>
                                            <p className="text-xs text-blue-400 mt-1">{t.roiLabel}: {analysisResult.financials.roi}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Yield Tricks */}
                            <div className="bg-amber-50/90 backdrop-blur-sm rounded-3xl p-6 border border-amber-100 shadow-sm">
                                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-600" /> {t.yieldMaxTips}
                                </h3>
                                <ul className="space-y-4">
                                    {analysisResult.tricks.map((trick: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-amber-900 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className="pt-0.5">{trick}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default LandAnalysis;
