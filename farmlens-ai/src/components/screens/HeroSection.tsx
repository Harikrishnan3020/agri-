import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { Camera, Sparkles, Zap, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

interface HeroSectionProps {
  onScanClick?: () => void;
  className?: string;
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

const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const HeroSection = ({ onScanClick, className }: HeroSectionProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for button
  const springConfig = { stiffness: 400, damping: 30 };
  const buttonX = useSpring(useTransform(mouseX, [-100, 100], [-2, 2]), springConfig);
  const buttonY = useSpring(useTransform(mouseY, [-100, 100], [-2, 2]), springConfig);

  const stats = [
    { value: "98%", label: t.statAccuracy, icon: Shield },
    { value: "50+", label: t.statDiseases, icon: TrendingUp },
    { value: "1M+", label: t.statFarmers, icon: Users },
  ];

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

        {/* Main Headline - Premium Fintech Copy */}
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

        {/* Primary CTA Button */}
        <motion.div
          variants={itemVariants}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-primary-gradient blur-xl"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />

          <motion.div
            style={{ x: buttonX, y: buttonY }}
            whileHover={{
              scale: 1.03,
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={onScanClick}
              size="xl"
              className="relative group h-16 px-10 rounded-2xl bg-primary-gradient text-primary-foreground font-bold text-lg shadow-primary-glow hover:shadow-2xl transition-shadow duration-500"
            >
              <motion.div
                className="flex items-center gap-3"
                animate={isHovered ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Camera className="w-6 h-6" />
                </motion.div>
                <span>{t.scanButton}</span>
              </motion.div>

              {/* Animated shimmer */}
              <motion.span
                className="absolute inset-0 rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.5 }}
              >
                <span className="absolute inset-0 animate-shimmer" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Indicator */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-sm text-muted-foreground/80"
        >
          No signup required • Results in 3 seconds • 100% free
        </motion.p>

        {/* Stats Row - Trust Indicators */}
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

      {/* Camera Preview Mockup */}
      <motion.div
        className="relative mt-14 w-full max-w-sm"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
    </section>
  );
};

export { HeroSection };
