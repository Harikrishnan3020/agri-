import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

const FloatingParticles = ({ count = 10, className }: FloatingParticlesProps) => {
  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      driftX: (Math.random() - 0.5) * 80,
      travelY: -(screenH * 1.1),
      delay: Math.random() * 6,
      duration: 10 + Math.random() * 8,
      size: 3 + Math.random() * 5,
      color: i % 3 === 0
        ? "rgba(16,185,129,0.7)"
        : i % 3 === 1
          ? "rgba(52,211,153,0.5)"
          : "rgba(245,158,11,0.5)",
      glowColor: i % 3 === 0
        ? "rgba(16,185,129,0.4)"
        : i % 3 === 1
          ? "rgba(52,211,153,0.3)"
          : "rgba(245,158,11,0.3)",
    }));
  }, [count, screenH]);

  const orbs = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 10 + i * 25,
      travelY: -(screenH * 1.3),
      size: 80 + i * 30,
      delay: i * 3,
      duration: 18 + i * 4,
      color: i % 2 === 0
        ? "rgba(16,185,129,0.08)"
        : "rgba(245,158,11,0.06)",
    }));
  }, [screenH]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className ?? ""}`}>
      {/* Floating glowing dots */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-2%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.glowColor}`,
          }}
          animate={{
            y: [0, p.travelY],
            x: [0, p.driftX],
            opacity: [0, 0.9, 0.9, 0],
            scale: [0.5, 1.2, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Large slow-moving background orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            bottom: "-10%",
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            y: [0, orb.travelY],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Twinkling star dots (static positions) */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${(i * 5.3) % 100}%`,
            top: `${(i * 7.7) % 100}%`,
            width: 1.5 + (i % 3) * 0.5,
            height: 1.5 + (i % 3) * 0.5,
            backgroundColor: i % 4 === 0 ? "rgba(245,158,11,0.6)" : "rgba(52,211,153,0.5)",
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 2 + (i % 4),
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export { FloatingParticles };
