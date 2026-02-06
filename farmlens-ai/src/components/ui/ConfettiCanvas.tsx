import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiCanvasProps {
  isActive: boolean;
  duration?: number;
  pieceCount?: number;
}

const colors = [
  "hsl(152, 68%, 45%)", // Emerald
  "hsl(38, 92%, 55%)",  // Amber
  "hsl(168, 76%, 42%)", // Teal
  "hsl(48, 96%, 53%)",  // Yellow
  "hsl(142, 76%, 36%)", // Green
];

const ConfettiCanvas = ({ isActive, duration = 3000, pieceCount = 50 }: ConfettiCanvasProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShow(true);
      setPieces(
        Array.from({ length: pieceCount }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
        }))
      );

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, pieceCount]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
              initial={{ 
                y: -20, 
                rotate: piece.rotation,
                opacity: 1,
                scale: 1,
              }}
              animate={{ 
                y: "100vh",
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: "easeIn",
              }}
            />
          ))}

          {/* Sparkle bursts */}
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{ left: `${20 + i * 15}%`, top: "10%" }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 2, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.1 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export { ConfettiCanvas };
