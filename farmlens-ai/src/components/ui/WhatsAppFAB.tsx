import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Share2, Phone, Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WhatsAppFABProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

const WhatsAppFAB = ({
  phoneNumber = "919876543210",
  message = "Hi, I need help with AgriYield!",
  className,
}: WhatsAppFABProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const actions = [
    { icon: Phone, label: "Call Expert", color: "bg-teal-500", action: () => { } },
    { icon: Leaf, label: "Treatment Guide", color: "bg-emerald-500", action: () => { } },
    { icon: Share2, label: "Share", color: "bg-primary", action: () => { } },
  ];

  return (
    <div className={cn("fixed bottom-24 right-4 z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="flex flex-col gap-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-primary-foreground shadow-lg",
                  action.color
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <motion.button
        onClick={() => (isOpen ? setIsOpen(false) : handleWhatsAppClick())}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-primary-foreground shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}

        {/* Pulse Ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-green-400"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      {/* Long press hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute -left-24 bottom-4 text-2xs text-muted-foreground whitespace-nowrap"
      >
        Hold for more
      </motion.p>
    </div>
  );
};

export { WhatsAppFAB };
