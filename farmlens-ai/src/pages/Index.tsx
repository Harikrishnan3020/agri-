
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { BottomNav } from "@/components/ui/BottomNav";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { ConfettiCanvas } from "@/components/ui/ConfettiCanvas";
import { HeroSection } from "@/components/screens/HeroSection";
import { ResultsCard, DiagnosisResult } from "@/components/screens/ResultsCard";
import { MarketplaceSection, MarketplaceListing } from "@/components/screens/Marketplace";
import { Leaderboard, LeaderboardEntry } from "@/components/screens/Leaderboard";
import { InsuranceCard, InsuranceData } from "@/components/screens/InsuranceCard";
import { PremiumPaywall } from "@/components/screens/PremiumPaywall";
import { useAppStore } from "@/store/useAppStore";
import heroImage from "@/assets/hero-farm.jpg";
import { translations, LanguageCode } from "@/data/translations";

// Sample data
const sampleDiagnosis: DiagnosisResult = {
  disease: "Late Blight",
  confidence: 98,
  severity: "high",
  treatment: "Spray Mancozeb 75% WP @ 2.5g/L immediately. Repeat after 7 days if symptoms persist.",
  preventiveMeasures: [
    "Remove and destroy infected plant parts",
    "Improve field drainage to reduce humidity",
    "Apply copper-based fungicide preventively",
  ],
  weather: {
    humidity: 85,
    temperature: 28,
    condition: "Humid",
  },
};

const sampleListings: MarketplaceListing[] = [
  {
    id: "1",
    title: "Premium Rice Seedlings",
    seller: "Ravi Ji Nursery",
    price: 10,
    unit: "bundle",
    distance: "2km",
    rating: 4.8,
    isVerified: true,
    deliveryAvailable: true,
    category: "seeds",
  },
  {
    id: "2",
    title: "Mancozeb 75% WP",
    seller: "Agro Chemicals Ltd",
    price: 180,
    unit: "kg",
    distance: "5km",
    rating: 4.6,
    isVerified: true,
    deliveryAvailable: true,
    category: "pesticide",
  },
  {
    id: "3",
    title: "Organic Vermicompost",
    seller: "Green Earth Farm",
    price: 25,
    unit: "kg",
    distance: "3km",
    rating: 4.9,
    isVerified: false,
    deliveryAvailable: false,
    category: "fertilizer",
  },
];

const sampleLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Muthu Krishnan", location: "Coimbatore East", score: 12450, change: "same" },
  { rank: 2, name: "Lakshmi Devi", location: "Pollachi", score: 11200, change: "up" },
  { rank: 3, name: "You", location: "Tirupur", score: 10850, change: "up", isCurrentUser: true },
  { rank: 4, name: "Rajan Kumar", location: "Mettupalayam", score: 9800, change: "down" },
  { rank: 5, name: "Selvi Amma", location: "Ooty", score: 9200, change: "same" },
];

const sampleInsurance: InsuranceData = {
  claimAmount: 8750,
  policyId: "PMFBY-2024-TN-45678",
  cropType: "Paddy Rice",
  damageType: "Pest Infestation",
  status: "approved",
  estimatedDays: 3,
};

const Index = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, showPremiumPaywall, setShowPremiumPaywall, isPremium, selectedLanguage, isAuthenticated } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleScanClick = () => {
    // Simulate scan completion
    setShowResults(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
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
                <HeroSection onScanClick={handleScanClick} />

                {/* Hero background image */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  <motion.img
                    src={heroImage}
                    alt="Farm landscape"
                    className="w-full h-full object-cover opacity-20"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-hero-gradient" />
                </div>
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
                  result={sampleDiagnosis}
                  onTreatmentClick={() => setActiveTab("market")}
                />

                <InsuranceCard data={sampleInsurance} />

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

      case "market":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <MarketplaceSection listings={sampleListings} />
          </motion.div>
        );

      case "ranks":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Leaderboard entries={sampleLeaderboard} />
          </motion.div>
        );

      case "scan":
        // Trigger scan when tab is selected
        if (!showResults) {
          handleScanClick();
        }
        setActiveTab("home");
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
    <div className="relative min-h-screen bg-hero-gradient overflow-x-hidden">
      {/* Floating particles background */}
      <FloatingParticles count={10} />

      {/* Confetti effect */}
      <ConfettiCanvas isActive={showConfetti} />

      {/* Header */}
      <Header
        userName="Ravi"
        isPremium={isPremium}
        onSettingsClick={() => setShowPremiumPaywall(true)}
      />

      {/* Main Content */}
      <main className="pb-safe min-h-[calc(100vh-4rem)]">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* WhatsApp FAB */}
      <WhatsAppFAB />

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
