import { motion, useMotionValue, useTransform, useSpring, Variants, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Zap, Shield, TrendingUp, Users, X, Image as ImageIcon, ScanLine, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

interface HeroSectionProps {
  onScanClick?: (file?: File) => void;
  className?: string;
  autoStartCamera?: boolean;
  onCameraStarted?: () => void;
}

// Premium animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 12,
      delay: 0.6 + i * 0.1,
    },
  }),
};



const HeroSection = ({ onScanClick, className, autoStartCamera, onCameraStarted }: HeroSectionProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;



  const stats = [
    { value: "98%", label: t.statAccuracy, icon: Shield },
    { value: "50+", label: t.statDiseases, icon: TrendingUp },
    { value: "1M+", label: t.statFarmers, icon: Users },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartScan = () => {
    if (selectedFile) {
      onScanClick?.(selectedFile);
      // We don't clear the file here, letting the parent handle navigation or overlay
    }
  };

  // Custom Camera Logic
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      let stream: MediaStream | null = null;

      try {
        // First attempt: Prefer requested facing mode (usually environment for phones)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
      } catch (err) {
        console.warn("Specific facing mode not supported, trying default camera...", err);
        // Fallback: Try any available video source
        stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
      }

      setCameraStream(stream);

      // Use a timeout to ensure the video element is mounted and ref is available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback to file input if camera fails
      setIsCameraOpen(false);

      // Small delay to allow modal to close before file picker opens
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 300);
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  }, [cameraStream]);

  const switchCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null); // Clear stream before switching
    }
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  // Effect to auto-start camera when requested
  useEffect(() => {
    if (autoStartCamera && !isCameraOpen) {
      startCamera();
      onCameraStarted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartCamera]);

  // Effect to restart camera when facing mode changes
  useEffect(() => {
    // Only restart if the camera was explicitly opened
    if (isCameraOpen) {
      // If stream exists, we are switching. If not (null), we might be initializing or just switched.
      // The key is to check if we intend for the camera to be open.
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob/file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            stopCamera();
          }
        }, 'image/jpeg', 0.85);
      }
    }
  };

  // Cleanup preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [previewUrl, cameraStream]); // Added cameraStream to deps


  return (
    <section className={cn("relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-16", className)}>
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb */}
        <motion.div
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Secondary gradient orb */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/15 to-secondary/5 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating leaf particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut" as const,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Premium Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t.aiBadge}
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight"
        >
          <span className="text-foreground">{t.heroTitle1}</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-emerald-500 to-secondary bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </motion.h1>

        {/* Supporting Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto"
        >
          {t.heroSubtitle}
        </motion.p>

        {/* Preview or Mockup Area */}
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              className="relative mb-8 w-full max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <div className="glass-card p-2 rounded-3xl border border-primary/20 shadow-2xl overflow-hidden relative group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/5">
                  <img src={previewUrl} alt="Crop Preview" className="w-full h-full object-cover" />

                  {/* Scanning Overlay Effect */}
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-primary/70 shadow-[0_0_20px_2px_rgba(16,185,129,0.5)] z-10"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Ready to Scan
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mockup"
              className="relative mb-8 w-full max-w-sm mx-auto"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
            >
              <motion.div
                className="glass-card aspect-[4/3] rounded-3xl overflow-hidden relative border border-white/30 shadow-2xl"
                whileHover={{
                  y: -8,
                  rotateX: 2,
                  boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Simulated camera view */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-secondary/5 flex items-center justify-center">
                  <motion.div
                    className="w-28 h-28 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Camera className="w-12 h-12 text-primary/50" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Scanning line */}
                <motion.div
                  className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  animate={{ top: ["15%", "85%", "15%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Corner brackets */}
                {[
                  "top-3 left-3",
                  "top-3 right-3 rotate-90",
                  "bottom-3 left-3 -rotate-90",
                  "bottom-3 right-3 rotate-180",
                ].map((position, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${position} w-8 h-8 border-l-2 border-t-2 border-primary/40`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                ))}
              </motion.div>

              {/* Quick tip */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-5 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4 text-secondary" />
                </motion.div>
                <span>Point at any leaf for instant AI analysis</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA Area */}
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="action-buttons"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              variants={itemVariants}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center justify-center gap-4">
                {/* Take Photo - Opens Custom Camera */}
                <Button
                  onClick={startCamera}
                  size="xl"
                  className="relative group h-16 px-8 rounded-2xl bg-primary-gradient text-primary-foreground font-bold text-lg shadow-primary-glow hover:shadow-2xl transition-all duration-300"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  Take Photo
                  <motion.div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                {/* Upload - Native File Picker */}
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="xl"
                  variant="outline"
                  className="h-16 px-8 rounded-2xl border-2 border-primary/20 text-foreground font-bold text-lg hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                >
                  <ImageIcon className="w-6 h-6 mr-3 text-primary" />
                  Upload
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirm-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <Button
                onClick={handleStartScan}
                size="xl"
                className="relative overflow-hidden group h-14 px-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xl shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
              >
                <ScanLine className="w-6 h-6 mr-3 animate-pulse" />
                Start Diagnosis
                <span className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-shimmer" />
              </Button>

              <Button
                onClick={handleClearFile}
                variant="ghost"
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Retake Photo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input for Upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => (e.target as HTMLInputElement).value = ''}
        />

        {/* Trust Indicator */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-sm text-muted-foreground/80"
        >
          No signup required • Results in 3 seconds • 100% free
        </motion.p>

        {/* Stats Row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              custom={index}
              variants={statVariants}
              whileHover={{
                y: -4,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group text-center cursor-default"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                <motion.span
                  className="text-2xl sm:text-3xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>


      {/* Full Screen Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={stopCamera}
                className="text-white hover:bg-white/20 rounded-full w-12 h-12"
              >
                <X className="w-8 h-8" />
              </Button>
            </div>

            <div className="relative w-full h-full max-w-md bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 bottom-1/4 left-8 right-8 border-2 border-white/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchCamera}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                >
                  <SwitchCamera className="w-6 h-6" />
                </Button>

                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 rounded-full bg-white group-hover:bg-emerald-400 transition-colors" />
                </button>

                <div className="w-12" /> {/* Spacer for symmetry */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export { HeroSection };
