export interface MarketplaceListing {
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
    description?: string;
    category: "seeds" | "fertilizer" | "pesticide" | "equipment" | "produce";
}
