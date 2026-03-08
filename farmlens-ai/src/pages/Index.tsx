
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { ConfettiCanvas } from "@/components/ui/ConfettiCanvas";
import HeroSection from "@/components/screens/HeroSection";
import { ResultsCard, DiagnosisResult } from "@/components/screens/ResultsCard";
import { MarketplaceSection, MarketplaceListing } from "@/components/screens/Marketplace";
import { Leaderboard, LeaderboardEntry } from "@/components/screens/Leaderboard";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, Info, Calendar } from "lucide-react";

import { PremiumPaywall } from "@/components/screens/PremiumPaywall";
import { ProfileSection } from "@/components/screens/ProfileSection";
import { useAppStore } from "@/store/useAppStore";
import { verifyDiagnosis } from "@/services/diagnosisVerification";
import { analyzeWithCustomModel } from "@/services/customModel";
import { fetchListings, subscribeListings } from "@/services/marketplace";
import heroImage from "@/assets/hero-farm.jpg";
import { translations, LanguageCode } from "@/data/translations";
import { toast } from "sonner";

// Sample data


const Index = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, showPremiumPaywall, setShowPremiumPaywall, isPremium, selectedLanguage, isAuthenticated, leaderboard, user, incrementScanCount, addScanRecord, listings, scanHistory, setListings, addListing } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  // Use ONLY user listings (Real Data)
  const allListings = listings || [];

  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);

  // Dynamic Seasonal Advice
  // Dynamic Seasonal Advice
  const getSeasonalAdvice = () => {
    const month = new Date().getMonth(); // 0-11

    const adviceMap = [
      { // January
        title: "January Crop Alert",
        desc: "High risk of Late Blight in Potatoes due to low temps.",
        detail: "Spray Mancozeb at 2g/L water. Protect seedlings from frost.",
        crop: "Potato & Wheat"
      },
      { // February
        title: "February Protection",
        desc: "Watch for Yellow Rust in Wheat as temperature rises.",
        detail: "Apply Propiconazole 25 EC if yellow streaks appear.",
        crop: "Wheat"
      },
      { // March
        title: "March Harvest Prep",
        desc: "Powdery Mildew risk in Mango and seasonal vegetables.",
        detail: "Sulfur dusting (25kg/ha) helps control mildew.",
        crop: "Mango & Vegetables"
      },
      { // April
        title: "April Sowing Guide",
        desc: "Prepare for Zaid crops. Pest alert: Aphids on new shoots.",
        detail: "Use Neem oil spray for early pest control.",
        crop: "Cucurbits & Pulses"
      },
      { // May
        title: "May Irrigation Alert",
        desc: "Peak heat. High evaporation. Risk of spider mites.",
        detail: "Increase irrigation frequency. Mulch soil to retain water.",
        crop: "Summer Vegetables"
      },
      { // June
        title: "Monsoon Prep",
        desc: "Kharif sowing begins. Treat seeds before sowing.",
        detail: "Seed treatment with Carbendazim prevents fungal rot.",
        crop: "Paddy (Rice)"
      },
      { // July
        title: "July Crop Care",
        desc: "Blast disease risk in Paddy due to high humidity.",
        detail: "Maintain water growing level. Apply Tricyclazole if spots seen.",
        crop: "Paddy (Rice)"
      },
      { // August
        title: "August Pest Watch",
        desc: "Stem Borer attack potential in growing paddy fields.",
        detail: "Install pheromone traps. Apply Chlorpyriphos if needed.",
        crop: "Paddy & Maize"
      },
      { // September
        title: "September Alert",
        desc: "End of monsoon. Watch for False Smut in paddy.",
        detail: "Drain excess water. Spray Copper Hydroxide.",
        crop: "Paddy (Rice)"
      },
      { // October
        title: "Rabi Pre-Sowing",
        desc: "Prepare for Mustard sowing. Soil moisture conservation.",
        detail: "Test soil health. Treat Mustard seeds for White Rust.",
        crop: "Mustard"
      },
      { // November
        title: "November Sowing",
        desc: "Ideal time for Wheat sowing. Risk of termite attack.",
        detail: "Chlorpyriphos soil treatment before sowing.",
        crop: "Wheat"
      },
      { // December
        title: "December Frost",
        desc: "Frost warning for potato and young mustard crop.",
        detail: "Light irrigation at night prevents frost damage.",
        crop: "Potato & Mustard"
      }
    ];

    return adviceMap[month] || adviceMap[0];
  };
  const seasonalAdvice = getSeasonalAdvice();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let isCancelled = false;

    const refreshListings = () => {
      fetchListings()
        .then((data) => {
          if (!isCancelled) setListings(data);
        })
        .catch(() => {
          // Keep existing listings if server is unavailable
        });
    };

    refreshListings();

    const intervalId = window.setInterval(refreshListings, 15000);
    const unsubscribe = subscribeListings((listing) => {
      addListing(listing);
    });

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
      unsubscribe();
    };
  }, [addListing, setListings]);

  useEffect(() => {
    if (activeTab === "scan") {
      setShowResults(false);
      setScannedImage(null);
      setAutoStartCamera(true);
      setActiveTab("home");
    }
  }, [activeTab, setActiveTab]);

  const [autoStartCamera, setAutoStartCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleScanClick = async (file?: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setScannedImage(imageUrl);
      setIsAnalyzing(true);

      try {
        // Use multi-model verification system for accurate diagnosis
        console.log("[Scan] Starting multi-model verification...");

        const verificationResult = await verifyDiagnosis(file);

        // Show warnings to user if any
        if (verificationResult.warnings.length > 0) {
          verificationResult.warnings.forEach(warning => {
            toast.info(warning, { duration: 5000 });
          });
        }

        // Log consensus level
        console.log(`[Scan] Consensus: ${verificationResult.consensusLevel} (${verificationResult.confidence}% confidence)`);

        const result = verificationResult.finalDiagnosis;

        if (result) {
          setDiagnosisResult(result);

          // Compress image for localStorage (avoid quota issues)
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 500;
              const scaleSize = MAX_WIDTH / img.width;
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
              canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

              const scanId = Date.now().toString();
              setCurrentScanId(scanId);

              // Manually create scan record with ID for feedback tracking
              const newScan = {
                id: scanId,
                date: new Date().toISOString(),
                disease: result.disease,
                crop: result.crop || "Unknown Crop",
                severity: result.severity as "low" | "medium" | "high",
                confidence: result.confidence,
                isHealthy: result.disease.toLowerCase().includes("healthy"),
                imageUrl: compressedBase64,
                description: result.treatment,
                preventiveMeasures: result.preventiveMeasures
              };

              // Update store
              addScanRecord({
                disease: result.disease,
                crop: result.crop || "Unknown Crop",
                severity: result.severity as "low" | "medium" | "high",
                confidence: result.confidence,
                isHealthy: result.disease.toLowerCase().includes("healthy"),
                imageUrl: compressedBase64,
                description: result.treatment,
                preventiveMeasures: result.preventiveMeasures
              });
            };
          };
          reader.readAsDataURL(file);
          incrementScanCount();

          setIsAnalyzing(false);
          setShowResults(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          throw new Error("No analysis result returned.");
        }

      } catch (error) {
        console.error("[Scan] Analysis failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        // Import toast at top if not already done — using window.alert as fallback
        import("sonner").then(({ toast }) => {
          toast.error(`Analysis failed: ${errorMessage}`);
        });
        setIsAnalyzing(false);
      }
    } else {
      console.log("No file selected for scan");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HeroSection
                  onScanClick={handleScanClick}
                  autoStartCamera={autoStartCamera}
                  onCameraStarted={() => setAutoStartCamera(false)}
                />

                {/* Quick Access Feature Cards */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                  className="px-4 pb-8 space-y-4"
                >
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-4 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />
                    <h3 className="text-xs font-bold text-emerald-400/70 uppercase tracking-widest">{t.quickAccess}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: t.qaAILabel, desc: t.qaAIDesc, emoji: "🤖", route: "/ai-assistant", from: "rgba(16,185,129,0.15)", to: "rgba(5,150,105,0.08)", border: "rgba(16,185,129,0.25)", glow: "rgba(16,185,129,0.15)" },
                      { label: t.qaWeatherLabel, desc: t.qaWeatherDesc, emoji: "🌤️", route: "/weather", from: "rgba(59,130,246,0.15)", to: "rgba(6,182,212,0.08)", border: "rgba(59,130,246,0.25)", glow: "rgba(59,130,246,0.15)" },
                      { label: t.qaAnalyticsLabel, desc: t.qaAnalyticsDesc, emoji: "📊", route: "/analytics", from: "rgba(139,92,246,0.15)", to: "rgba(217,70,239,0.08)", border: "rgba(139,92,246,0.25)", glow: "rgba(139,92,246,0.15)" },
                      { label: t.qaMedicinesLabel, desc: t.qaMedicinesDesc, emoji: "💊", route: "/medicine", from: "rgba(236,72,153,0.15)", to: "rgba(244,63,94,0.08)", border: "rgba(236,72,153,0.25)", glow: "rgba(236,72,153,0.15)" },
                      { label: "Land Analysis", desc: "Soil & Crop Insights", emoji: "🏞️", route: "/land-analysis", from: "rgba(245,158,11,0.15)", to: "rgba(217,119,6,0.08)", border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.15)" },
                    ].map((card, i) => (
                      <motion.button
                        key={card.label}
                        onClick={() => navigate(card.route)}
                        variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative rounded-2xl p-4 text-left overflow-hidden group border backdrop-blur-sm"
                        style={{
                          background: `linear-gradient(135deg, ${card.from} 0%, ${card.to} 100%)`,
                          borderColor: card.border,
                        }}
                      >
                        {/* Hover glow */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                          style={{ boxShadow: `inset 0 0 30px ${card.glow}` }}
                        />
                        {/* Top-right orb */}
                        <motion.div
                          className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                          style={{ background: `radial-gradient(circle, ${card.border} 0%, transparent 70%)`, filter: "blur(8px)" }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                        />
                        <div className="relative">
                          <motion.div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border"
                            style={{ background: card.from, borderColor: card.border }}
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                          >
                            <span className="text-xl">{card.emoji}</span>
                          </motion.div>
                          <h4 className="font-bold text-white text-sm mb-0.5">{card.label}</h4>
                          <p className="text-[11px] text-white/50">{card.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Hero background image */}
                <div className="absolute inset-0 -z-10 overflow-hidden mix-blend-overlay opacity-10">
                  <motion.img
                    src={heroImage}
                    alt="Farm landscape"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-white/20" />
                </div>

                {/* Analysis Loading Overlay */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl"
                      style={{ background: "rgba(5,20,10,0.92)" }}
                    >
                      {/* Background glow */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.15) 0%, transparent 70%)" }}
                      />

                      {/* Spinner */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Outer pulse rings */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-emerald-400/20"
                          animate={{ scale: [1, 1.9, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                        />
                        {/* Spinning arc */}
                        <motion.div
                          className="absolute inset-4 rounded-full border-t-[3px] border-r-[3px] border-emerald-400"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Counter arc */}
                        <motion.div
                          className="absolute inset-6 rounded-full border-b-[3px] border-l-[3px] border-emerald-300/60"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Center image or icon */}
                        {scannedImage ? (
                          <motion.img
                            src={scannedImage}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/50"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          />
                        ) : (
                          <motion.div
                            className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <span className="text-2xl">🌿</span>
                          </motion.div>
                        )}
                      </div>

                      <motion.h3
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-2xl font-extrabold text-white tracking-wide"
                      >
                        {t.analyzingTitle}
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2 text-sm font-mono text-emerald-400"
                      >
                        {t.analyzingSubtitle}
                      </motion.p>

                      {/* Progress bar */}
                      <motion.div
                        className="mt-6 w-48 h-1 rounded-full bg-white/10 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
                          animate={{ width: ["0%", "90%"] }}
                          transition={{ duration: 4, ease: "easeOut" }}
                        />
                      </motion.div>

                      {/* Steps */}
                      <motion.div
                        className="mt-6 flex flex-col gap-2 items-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {[t.stepPreprocess, t.stepDetect, t.stepTreatment].map((step, i) => (
                          <motion.div
                            key={step}
                            className="flex items-center gap-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.6 }}
                          >
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <span className="text-emerald-300/70">{step}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-4 py-6 space-y-6"
              >
                <ResultsCard
                  result={diagnosisResult}
                  imageUrl={scannedImage}
                  scanId={currentScanId || undefined}
                  onTreatmentClick={() => navigate("/medicine", {
                    state: {
                      disease: diagnosisResult.disease,
                      crop: diagnosisResult.crop,
                      treatment: diagnosisResult.treatment
                    }
                  })}
                />

                <motion.button
                  onClick={() => setShowResults(false)}
                  className="w-full text-center text-primary font-medium py-3"
                  whileTap={{ scale: 0.98 }}
                >
                  {t.scanAnother}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        );

      case "market": {
        // Sort listings: User's listings and Relevant items first, then others
        const sortedListings = [...allListings].sort((a, b) => {
          // 1. User's own listings first
          if (a.seller === user?.name) return -1;
          if (b.seller === user?.name) return 1;

          // 2. Relevant to diagnosis (if exists)
          if (diagnosisResult) {
            const treatment = diagnosisResult.treatment.toLowerCase();
            const disease = diagnosisResult.disease.toLowerCase();

            const isRelevant = (item: MarketplaceListing) => {
              const title = item.title.toLowerCase();
              const category = item.category.toLowerCase();
              return treatment.includes(title) || treatment.includes(category) ||
                disease.includes(category) || title.includes(category);
            };

            const aRel = isRelevant(a);
            const bRel = isRelevant(b);

            if (aRel && !bRel) return -1;
            if (!aRel && bRel) return 1;
          }

          return 0;
        });

        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {diagnosisResult && (
              <div className="px-4 pt-4 pb-2">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💊</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">{t.recommendedForCrop}</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {t.recommendedDesc} <strong>{diagnosisResult.disease}</strong>. {t.recommendedDesc2}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <MarketplaceSection listings={sortedListings} />
          </motion.div>
        );
      }

      case "ranks":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Leaderboard entries={leaderboard} />
          </motion.div>
        );

      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ProfileSection />
          </motion.div>
        );

      case "scan":
        return null;

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[60vh] px-4"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl">🚧</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{t.comingSoon}</h2>
              <p className="text-muted-foreground">{t.featureDev}</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#e0f8f1]">
      {/* Confetti effect */}
      <ConfettiCanvas isActive={showConfetti} />

      {/* Header */}
      <Header
        userName={user?.name || "Farmer"}
        isPremium={isPremium}
        onSettingsClick={() => setShowPremiumPaywall(true)}
        onNotificationsClick={() => setIsNotificationsOpen(true)}
      />

      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-[85vw] sm:max-w-md overflow-y-auto">
          <SheetHeader className="mt-4 mb-6">
            <SheetTitle className="text-2xl font-bold text-left">{t.notifTitle}</SheetTitle>
            <SheetDescription className="text-left">
              {t.notifSubtitle}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4">
            {/* Dynamic Seasonal Notification */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{seasonalAdvice.title}</h4>
                  <p className="text-sm text-gray-800 font-medium mt-1">{t.focusLabel}: {seasonalAdvice.crop}</p>
                  <p className="text-sm text-gray-600 mt-1">{seasonalAdvice.desc}</p>
                  <p className="text-xs text-emerald-700 mt-2 bg-emerald-200/50 p-1.5 rounded-lg">{seasonalAdvice.detail}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.notif2Title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{t.notif2Desc}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{t.hourAgo}</span>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="pb-safe min-h-[calc(100vh-4rem)]">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* WhatsApp FAB */}
      <WhatsAppFAB />

      {/* Land Analysis FAB - Visible on all tabs */}
      <motion.button
        onClick={() => navigate("/land-analysis")}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 left-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/30 flex items-center justify-center text-white"
        style={{ boxShadow: "0 0 15px rgba(245,158,11,0.5)" }}
      >
        <span className="text-xl">🏞️</span>
      </motion.button>

      {/* Premium Paywall Modal */}
      <PremiumPaywall
        isOpen={showPremiumPaywall}
        onClose={() => setShowPremiumPaywall(false)}
        onSubscribe={(plan) => {
          console.log(`Subscribing to ${plan} plan`);
          setShowPremiumPaywall(false);
        }}
      />
    </div>
  );
};

export default Index;
