import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Cloud, Droplets, Info, Leaf, ThermometerSun } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AccuracyMeter } from "@/components/ui/AccuracyMeter";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { VideoErrorBoundary } from "@/components/ui/VideoErrorBoundary";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

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
}

interface ResultsCardProps {
  result: DiagnosisResult;
  imageUrl?: string | null;
  onTreatmentClick?: () => void;
  onShareClick?: () => void;
  className?: string;
}

const ResultsCard = ({ result, imageUrl, onTreatmentClick, onShareClick, className }: ResultsCardProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

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
            className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring" }}
          >
            <Leaf className="w-6 h-6 text-primary" />
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

      {/* Treatment Recommendation */}
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
            cropName={result.disease.split(' ')[0]}
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
        className="flex gap-3"
      >
        <Button
          onClick={onTreatmentClick}
          className="flex-1 h-12 rounded-xl bg-primary-gradient text-primary-foreground font-semibold shadow-primary-glow"
        >
          {t.buyMedicines}
        </Button>
        <Button
          onClick={onShareClick}
          variant="outline"
          className="h-12 px-4 rounded-xl border-2"
        >
          {t.shareReport}
        </Button>
      </motion.div>
    </GlassCard>
  );
};

export { ResultsCard };
export type { DiagnosisResult };
