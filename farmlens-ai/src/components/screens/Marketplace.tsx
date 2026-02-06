import { motion } from "framer-motion";
import { MapPin, MessageCircle, Star, Truck, Verified } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketplaceListing {
  id: string;
  title: string;
  seller: string;
  price: number;
  unit: string;
  distance: string;
  rating: number;
  image?: string;
  isVerified?: boolean;
  deliveryAvailable?: boolean;
  category: "seeds" | "fertilizer" | "pesticide" | "equipment" | "produce";
}

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  onChatClick?: () => void;
  onBuyClick?: () => void;
  className?: string;
}

const categoryColors = {
  seeds: "from-emerald-400 to-emerald-600",
  fertilizer: "from-teal-400 to-teal-600",
  pesticide: "from-amber-400 to-amber-600",
  equipment: "from-slate-400 to-slate-600",
  produce: "from-orange-400 to-orange-600",
};

const categoryIcons = {
  seeds: "🌱",
  fertilizer: "🧪",
  pesticide: "💧",
  equipment: "🔧",
  produce: "🌾",
};

const MarketplaceCard = ({ listing, onChatClick, onBuyClick, className }: MarketplaceCardProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  return (
    <GlassCard
      variant="interactive"
      className={cn("overflow-hidden", className)}
    >
      <div className="flex gap-4">
        {/* Product Image/Icon */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br",
            categoryColors[listing.category]
          )}
        >
          {listing.image ? (
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            categoryIcons[listing.category]
          )}
        </motion.div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm text-muted-foreground">{listing.seller}</span>
                {listing.isVerified && (
                  <Verified className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">₹{listing.price}</div>
              <div className="text-xs text-muted-foreground">/{listing.unit}</div>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.distance}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {listing.rating.toFixed(1)}
            </div>
            {listing.deliveryAvailable && (
              <div className="flex items-center gap-1 text-primary">
                <Truck className="w-3 h-3" />
                Delivery
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              onClick={onBuyClick}
              size="sm"
              className="flex-1 h-8 rounded-lg bg-primary-gradient text-primary-foreground text-xs font-medium"
            >
              {t.buyNow}
            </Button>
            <Button
              onClick={onChatClick}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-lg"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// Marketplace Section with multiple cards
interface MarketplaceSectionProps {
  listings: MarketplaceListing[];
  className?: string;
}

import { useAppStore } from "@/store/useAppStore";
import { translations, LanguageCode } from "@/data/translations";

const MarketplaceSection = ({ listings, className }: MarketplaceSectionProps) => {
  const { selectedLanguage } = useAppStore();
  const t = translations[selectedLanguage as LanguageCode] || translations.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className={cn("px-4 py-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.marketplaceTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.marketplaceSubtitle}</p>
        </div>
        <Button variant="ghost" className="text-primary text-sm">
          {t.viewAll}
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {listings.map((listing) => (
          <motion.div key={listing.id} variants={itemVariants}>
            <MarketplaceCard listing={listing} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export { MarketplaceCard, MarketplaceSection };
export type { MarketplaceListing };
