import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Camera, Sparkles, Zap, Shield, TrendingUp, Users, X, Image as ImageIcon, ScanLine, SwitchCamera, Leaf, Activity } from "lucide-react";
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

const HeroSection = ({ onScanClick, className, autoStartCamera, onCameraStarted }: HeroSectionProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const stats = [
    { value: "98%", label: t.statAccuracy, icon: Shield, color: "from-emerald-400 to-teal-500" },
    { value: "50+", label: t.statDiseases, icon: TrendingUp, color: "from-amber-400 to-orange-500" },
    { value: "1M+", label: t.statFarmers, icon: Users, color: "from-violet-400 to-purple-500" },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [scanPhase, setScanPhase] = useState(0); // 0=idle, 1=scanning, 2=done

  // Cycle through scan phases for the mockup
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPhase(p => (p + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      setIsCameraOpen(false);
      setTimeout(() => fileInputRef.current?.click(), 300);
    }
  };

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  }, [cameraStream]);

  const switchCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  useEffect(() => {
    if (autoStartCamera && !isCameraOpen) {
      startCamera();
      onCameraStarted?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartCamera]);

  useEffect(() => {
    if (isCameraOpen) startCamera();
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
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    };
  }, [previewUrl, cameraStream]);

  const scanLabels = ["Initializing...", "Scanning leaf...", "Analysis complete ✓"];
  const scanColors = ["text-yellow-400", "text-emerald-400", "text-green-300"];

  return (
    <section className={cn("relative min-h-[90vh] flex flex-col items-center justify-center px-5 py-12 overflow-hidden", className)}>

      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0f] via-[#0d2318] to-[#071510]" />

        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 70%)"
          }}
        />

        {/* Large glowing orb - top right */}
        <motion.div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(5,150,105,0.2) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Large glowing orb - bottom left */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(217,119,6,0.15) 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Mid orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Floating leaf particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${5 + i * 8}%`,
              bottom: "-5%",
            }}
            animate={{
              y: [0, -(600 + Math.random() * 300)],
              x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 40)],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 8 + i * 0.7,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          >
            <Leaf
              style={{
                width: 10 + (i % 4) * 5,
                height: 10 + (i % 4) * 5,
                color: i % 3 === 0 ? "rgba(16,185,129,0.5)" : i % 3 === 1 ? "rgba(52,211,153,0.4)" : "rgba(245,158,11,0.35)",
              }}
              strokeWidth={1.5}
            />
          </motion.div>
        ))}

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </motion.div>
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-300">
            {t.aiBadge}
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl font-extrabold mb-3 leading-[1.1] tracking-tight"
        >
          <span className="text-white">{t.heroTitle1}</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #34d399 0%, #10b981 40%, #f59e0b 100%)" }}
          >
            {t.heroTitle2}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base text-emerald-100/60 mb-8 leading-relaxed max-w-xs"
        >
          {t.heroSubtitle}
        </motion.p>

        {/* ── HERO CARD ── */}
        <AnimatePresence mode="wait">
          {previewUrl ? (
            /* Preview card */
            <motion.div
              key="preview"
              className="w-full mb-7"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.35 }}
            >
              <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
                <div className="aspect-[4/3] relative">
                  <img src={previewUrl} alt="Crop" className="w-full h-full object-cover" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  {/* Scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)" }}
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Glow behind scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-8 blur-md"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }}
                    animate={{ top: ["3%", "90%", "3%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Corner brackets */}
                  {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 left-3 -rotate-90", "bottom-3 right-3 rotate-180"].map((pos, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${pos} w-7 h-7 border-l-[3px] border-t-[3px] border-emerald-400`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    />
                  ))}
                  {/* Status badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs font-semibold text-emerald-300">Ready to Diagnose</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Animated mockup card */
            <motion.div
              key="mockup"
              className="w-full mb-7"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.4 }}
            >
              <motion.div
                className="relative rounded-3xl overflow-hidden border border-emerald-500/20"
                style={{
                  background: "linear-gradient(145deg, rgba(10,26,15,0.95) 0%, rgba(5,46,22,0.9) 100%)",
                  boxShadow: "0 0 0 1px rgba(16,185,129,0.1), 0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.1)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 0 1px rgba(16,185,129,0.3), 0 30px 80px rgba(0,0,0,0.6), 0 0 80px rgba(16,185,129,0.2)" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Card inner glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, transparent 60%)" }}
                />

                <div className="aspect-[4/3] relative flex flex-col items-center justify-center p-6">
                  {/* Central camera ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    {/* Outer pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    {/* Second pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-emerald-400/20"
                      animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                    {/* Spinning dashed ring */}
                    <motion.div
                      className="absolute inset-2 rounded-full border-2 border-dashed border-emerald-500/40"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner spinning arc */}
                    <motion.div
                      className="absolute inset-4 rounded-full border-t-2 border-r-2 border-emerald-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Camera icon */}
                    <motion.div
                      className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))", border: "1px solid rgba(16,185,129,0.3)" }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Camera className="w-7 h-7 text-emerald-400" />
                    </motion.div>
                  </div>

                  {/* Scan line across card */}
                  <motion.div
                    className="absolute left-6 right-6 h-[1.5px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(52,211,153,1), rgba(16,185,129,0.8), transparent)" }}
                    animate={{ top: ["15%", "85%", "15%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Scan glow */}
                  <motion.div
                    className="absolute left-0 right-0 h-10 blur-lg pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)" }}
                    animate={{ top: ["10%", "80%", "10%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Corner brackets */}
                  {["top-4 left-4", "top-4 right-4 rotate-90", "bottom-4 left-4 -rotate-90", "bottom-4 right-4 rotate-180"].map((pos, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${pos} w-6 h-6 border-l-2 border-t-2 border-emerald-400/60`}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}

                  {/* Status bar */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={scanPhase}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                      <span className={`text-xs font-mono font-semibold ${scanColors[scanPhase]}`}>
                        {scanLabels[scanPhase]}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress bar */}
                  <div className="mt-3 w-40 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }}
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Data points */}
                  <div className="absolute top-4 right-14 flex flex-col gap-1">
                    {["CNN", "98%", "AI"].map((label, i) => (
                      <motion.div
                        key={label}
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-300 border border-emerald-500/20 bg-emerald-500/10"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      >
                        {label}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-5 py-3 border-t border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300/70 font-medium">Neural-Agri™ CV</span>
                  </div>
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-emerald-400" style={{ opacity: 0.3 + i * 0.3 }} />
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Tip below card */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-4 text-xs text-emerald-300/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </motion.div>
                <span>Point at any leaf for instant AI analysis</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA BUTTONS ── */}
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              <div className="flex gap-3 w-full">
                {/* Take Photo */}
                <motion.button
                  onClick={startCamera}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex-1 h-14 rounded-2xl font-bold text-white text-sm overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: "0 0 30px rgba(16,185,129,0.5)" }} />
                  <span className="relative flex items-center justify-center gap-2">
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </span>
                </motion.button>

                {/* Upload */}
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex-1 h-14 rounded-2xl font-bold text-emerald-300 text-sm border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm overflow-hidden group hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Upload
                  </span>
                </motion.button>
              </div>

              <p className="text-[11px] text-white/30">No signup required • Results in 3 seconds • 100% free</p>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <motion.button
                onClick={handleStartScan}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative w-full h-14 rounded-2xl font-bold text-white text-base overflow-hidden group"
                style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)" }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <ScanLine className="w-5 h-5" />
                  Start AI Diagnosis
                </span>
              </motion.button>

              <button
                onClick={handleClearFile}
                className="text-sm text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Retake Photo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => (e.target as HTMLInputElement).value = ''}
        />

        {/* ── STATS ── */}
        <motion.div
          className="flex items-center justify-center gap-5 mt-10 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1 group cursor-default"
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-1 shadow-lg`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <motion.span
                className="text-xl font-extrabold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-[10px] text-white/40 text-center leading-tight">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── FULL SCREEN CAMERA ── */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={stopCamera}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-full max-w-md flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 bottom-1/4 left-8 right-8 border border-white/30 rounded-xl">
                  {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8 border-l-[3px] border-t-[3px] border-emerald-400 -m-px`} />
                  ))}
                  {/* Scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-10">
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all border border-white/20"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>

                <motion.button
                  onClick={capturePhoto}
                  whileTap={{ scale: 0.92 }}
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white"
                    whileHover={{ backgroundColor: "#34d399" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>

                <div className="w-12" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
