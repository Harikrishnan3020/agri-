import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Cloud, Droplets, Info, Leaf, ThermometerSun, ThumbsUp, ThumbsDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccuracyMeter } from "@/components/ui/AccuracyMeter";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { VideoErrorBoundary } from "@/components/ui/VideoErrorBoundary";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";
import { useState } from "react";
import { toast } from "sonner";

interface DiagnosisResult {
  disease: string;
  crop?: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  treatment: string;
  preventiveMeasures: string[];
  weather?: {
    humidity: number;
    temperature: number;
    condition: string;
  };
  videoUrl?: string; // URL for the prevention/treatment video
  soilDeficiencySymptoms?: string[]; // Nutrient deficiency symptoms detected
  traditionalTreatments?: string[]; // Nattupuram method (1980-2015 farmer knowledge)
  scientificTreatments?: string[]; // Modern eco-friendly treatments
  soilDeficiencies?: Array<{
    nutrient: string;
    severity: "low" | "medium" | "high";
    symptoms: string[];
    organicSolutions: string[];
    chemicalSolutions: string[];
  }>;
}

interface ResultsCardProps {
  result: DiagnosisResult;
  imageUrl?: string | null;
  onTreatmentClick?: () => void;
  onShareClick?: () => void;
  className?: string;
  scanId?: string; // For feedback tracking
}

const ResultsCard = ({ result, imageUrl, onTreatmentClick, onShareClick, className, scanId }: ResultsCardProps) => {
  const { selectedLanguage, updateScanFeedback, scanHistory } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  // Check if feedback already given for this scan
  const existingFeedback = scanId ? scanHistory.find(s => s.id === scanId)?.userFeedback : null;

  const severityConfig = {
    low: {
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
      icon: Info,
      label: t.severityLow,
    },
    medium: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: AlertTriangle,
      label: t.severityMedium,
    },
    high: {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertTriangle,
      label: t.severityHigh,
    },
  };

  const severity = severityConfig[result.severity];
  const SeverityIcon = severity.icon;

  return (
    <GlassCard
      variant="elevated"
      className={cn("max-w-md mx-auto", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Uploaded Image Preview */}
      {imageUrl && (
        <motion.div
          className="w-full h-48 rounded-xl overflow-hidden mb-6 relative group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src={imageUrl}
            alt="Scanned Crop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white text-xs font-medium px-2 py-1 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
            {t.scannedImage}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-[14px] bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring" }}
          >
            <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <motion.h3
              className="text-xl font-bold text-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {result.disease}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                severity.bg,
                severity.color
              )}
            >
              <SeverityIcon className="w-3 h-3" />
              {severity.label}
            </motion.div>
          </div>
        </div>

        {/* Weather badge */}
        {result.weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
          >
            <Cloud className="w-3 h-3" />
            {result.weather.condition}
          </motion.div>
        )}
      </div>

      {/* Confidence Meter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <AccuracyMeter value={result.confidence} label={t.confidence} size="lg" />
      </motion.div>

      {/* Treatment Recommendations - Two Categories */}
      {!result.disease.toLowerCase().includes('healthy') && (
        <>
          {/* Traditional Treatment (Nattupuram Method) */}
          {result.traditionalTreatments && result.traditionalTreatments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">🌾 Nattupuram Method (Traditional Wisdom)</span>
                </div>
                <p className="text-xs text-amber-700 mb-2 italic">{t.farmerKnowledge}</p>
                <ul className="space-y-1.5">
                  {result.traditionalTreatments.map((treatment, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-start gap-2 text-sm text-amber-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                      {treatment}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Scientific Treatment (Modern Medicine) */}
          {result.scientificTreatments && result.scientificTreatments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-4"
            >
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-900">🔬 Scientific Treatment (Modern Method)</span>
                </div>
                <p className="text-xs text-emerald-700 mb-2 italic">{t.advancedEcoFriendly}</p>
                <ul className="space-y-1.5">
                  {result.scientificTreatments.map((treatment, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start gap-2 text-sm text-emerald-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                      {treatment}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Fallback: General Treatment (if specific ones not available) */}
          {(!result.traditionalTreatments || result.traditionalTreatments.length === 0) &&
           (!result.scientificTreatments || result.scientificTreatments.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "p-4 rounded-2xl border mb-4",
                result.severity === "high" ? "bg-red-50/80 border-red-200" : "bg-primary/5 border-primary/20"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={cn("w-4 h-4", result.severity === "high" ? "text-red-600" : "text-primary")} />
                <span className="text-sm font-semibold text-foreground">{t.recommendedTreatment}</span>
              </div>
              <p className={cn("text-sm", result.severity === "high" ? "text-red-700 font-medium" : "text-muted-foreground")}>
                {result.treatment}
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Soil Deficiency Analysis */}
      {result.soilDeficiencies && result.soilDeficiencies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-4"
        >
          <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-900">🌱 Soil Nutrient Analysis</span>
            </div>
            {result.soilDeficiencies.map((deficiency, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded",
                    deficiency.severity === "high" ? "bg-red-100 text-red-700" :
                    deficiency.severity === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {deficiency.severity.toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-purple-900">{deficiency.nutrient} Deficiency</span>
                </div>
                <p className="text-xs text-purple-700 mb-2">
                  Symptoms: {deficiency.symptoms.join(", ")}
                </p>
                
                {/* Organic Solutions */}
                <div className="ml-2 mb-2">
                  <p className="text-xs font-semibold text-amber-800 mb-1">🌿 Organic Solutions:</p>
                  <ul className="space-y-0.5">
                    {deficiency.organicSolutions.slice(0, 3).map((solution, sIndex) => (
                      <li key={sIndex} className="flex items-start gap-1 text-xs text-purple-700">
                        <span className="text-amber-600">•</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Chemical Solutions */}
                <div className="ml-2">
                  <p className="text-xs font-semibold text-emerald-800 mb-1">🔬 Chemical Solutions:</p>
                  <ul className="space-y-0.5">
                    {deficiency.chemicalSolutions.slice(0, 3).map((solution, sIndex) => (
                      <li key={sIndex} className="flex items-start gap-1 text-xs text-purple-700">
                        <span className="text-emerald-600">•</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Treatment Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "p-4 rounded-2xl border mb-4",
          result.severity === "high" ? "bg-red-50/80 border-red-200" : "bg-primary/5 border-primary/20"
        )}
        style={{ display: 'none' }} // Hidden - replaced by new treatment sections above
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className={cn("w-4 h-4", result.severity === "high" ? "text-red-600" : "text-primary")} />
          <span className="text-sm font-semibold text-foreground">{t.recommendedTreatment}</span>
        </div>
        <p className={cn("text-sm", result.severity === "high" ? "text-red-700 font-medium" : "text-muted-foreground")}>
          {result.treatment}
        </p>
      </motion.div>

      {/* Weather conditions */}
      {result.weather && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4 mb-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-teal-500" />
            <span>{result.weather.humidity}% {t.humidity}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThermometerSun className="w-4 h-4 text-amber-500" />
            <span>{result.weather.temperature}°C</span>
          </div>
        </motion.div>
      )}

      {/* Preventive measures */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <h4 className="text-sm font-semibold text-foreground mb-2">{t.preventiveMeasures}</h4>
        <ul className="space-y-1">
          {result.preventiveMeasures.slice(0, 3).map((measure, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {measure}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Video Reference - Always show for diseases */}
      {!result.disease.toLowerCase().includes('healthy') && (
        <VideoErrorBoundary>
          <VideoPlayer
            initialVideoUrl={result.videoUrl}
            cropName={result.crop || result.disease.split(' ')[0]}
            diseaseName={result.disease}
            className="mb-6"
          />
        </VideoErrorBoundary>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-3"
      >
        {/* Feedback Section */}
        {!existingFeedback && !feedbackGiven && scanId && (
          <div className="bg-black/20 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-white/70 mb-3 font-medium">Was this diagnosis correct?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateScanFeedback(scanId, {
                    wasCorrect: true,
                    timestamp: new Date().toISOString(),
                  });
                  setFeedbackGiven(true);
                  toast.success("Thank you! Your feedback helps improve our AI 🌱");
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 transition-all text-sm font-semibold"
              >
                <ThumbsUp className="w-4 h-4" /> Yes, Correct
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all text-sm font-semibold"
              >
                <ThumbsDown className="w-4 h-4" /> No, Wrong
              </button>
            </div>

            {/* Correction Form */}
            {showFeedbackForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-white/10 space-y-2"
              >
                <input
                  type="text"
                  placeholder="What is the actual disease?"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm placeholder:text-white/40 focus:border-emerald-500/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        updateScanFeedback(scanId, {
                          wasCorrect: false,
                          actualDisease: value.trim(),
                          timestamp: new Date().toISOString(),
                        });
                        setShowFeedbackForm(false);
                        setFeedbackGiven(true);
                        toast.success("Correction recorded! AI will learn from this 🧠");
                      }
                    }
                  }}
                />
                <p className="text-[10px] text-white/40">{t.pressEnterSubmit}</p>
              </motion.div>
            )}
          </div>
        )}

        {existingFeedback && (
          <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-300 font-medium">
              Feedback submitted - Thank you for improving our AI! 🌱
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onTreatmentClick}
            className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20"
          >
            {t.viewSolutions || "View Treatment Solutions"}
          </Button>
          <Button
            onClick={onShareClick}
            variant="outline"
            className="h-12 px-4 rounded-xl border-2"
          >
            {t.shareReport}
          </Button>
        </div>
      </motion.div>
    </GlassCard>
  );
};

export { ResultsCard };
export type { DiagnosisResult };
