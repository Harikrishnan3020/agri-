/**
 * Plant Medicines Database
 * Curated collection of real plant medicines available in India
 * Data structure matches Flipkart product format
 */

export interface PlantMedicine {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    image: string;
    category: 'fungicide' | 'pesticide' | 'herbicide' | 'organic' | 'fertilizer' | 'bio-pesticide';
    type: string;
    activeIngredient: string;
    dosage: string;
    safetyPeriod: string;
    targetCrops: string[];
    targetDiseases: string[];
    description: string;
    benefits: string[];
    precautions: string[];
    applicationMethod: string;
    inStock: boolean;
    seller: string;
    distance?: string;
    packaging: string;
}

export const plantMedicinesDatabase: PlantMedicine[] = [
    // FUNGICIDES
    {
        id: "med_001",
        name: "Tata Rallis Blitox Copper Oxychloride 50% WP Fungicide",
        brand: "Tata Rallis",
        price: 299,
        originalPrice: 450,
        discount: 34,
        rating: 4.6,
        reviews: 1842,
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop",
        category: "fungicide",
        type: "Copper-based Fungicide",
        activeIngredient: "Copper Oxychloride 50%",
        dosage: "2-3 g/L of water",
        safetyPeriod: "7-10 days",
        targetCrops: ["Tomato", "Potato", "Chili", "Grapes", "Mango"],
        targetDiseases: ["Late Blight", "Early Blight", "Downy Mildew", "Anthracnose"],
        description: "Broad-spectrum protective fungicide effective against various fungal diseases. Suitable for organic farming when used as per guidelines.",
        benefits: [
            "Wide range of disease control",
            "Compatible with most pesticides",
            "Cost-effective solution",
            "Suitable for organic farming"
        ],
        precautions: [
            "Avoid mixing with sulfur or oil-based products",
            "Do not spray during flowering period",
            "Wear protective gear during application",
            "Keep away from water bodies"
        ],
        applicationMethod: "Foliar spray - Apply evenly on both sides of leaves. Mix thoroughly before use.",
        inStock: true,
        seller: "Agro Chemicals India",
        distance: "2.5 km",
        packaging: "500g pack"
    },
    {
        id: "med_002",
        name: "Bayer Nativo Fungicide (Trifloxystrobin 25% + Tebuconazole 50% WG)",
        brand: "Bayer CropScience",
        price: 850,
        originalPrice: 1200,
        discount: 29,
        rating: 4.8,
        reviews: 2156,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
        category: "fungicide",
        type: "Systemic Fungicide",
        activeIngredient: "Trifloxystrobin 25% + Tebuconazole 50%",
        dosage: "0.4-0.5 g/L of water",
        safetyPeriod: "15-20 days",
        targetCrops: ["Rice", "Wheat", "Tomato", "Chili", "Cotton"],
        targetDiseases: ["Sheath Blight", "Blast", "Powdery Mildew", "Leaf Spot"],
        description: "Premium dual-action fungicide providing both preventive and curative action against major fungal diseases.",
        benefits: [
            "Dual mode of action",
            "Long-lasting protection",
            "Improves crop quality and yield",
            "Effective against resistant strains"
        ],
        precautions: [
            "Use only recommended doses",
            "Avoid contact with skin and eyes",
            "Do not contaminate water sources",
            "Store in cool, dry place"
        ],
        applicationMethod: "Foliar application. Mix recommended dose in water and spray uniformly.",
        inStock: true,
        seller: "Premium Agro Solutions",
        distance: "4.2 km",
        packaging: "100g pack"
    },

    // ORGANIC SOLUTIONS
    {
        id: "med_003",
        name: "Dhanuka Neem Gold Neem Oil 1500 PPM Organic Pesticide",
        brand: "Dhanuka Agritech",
        price: 185,
        originalPrice: 250,
        discount: 26,
        rating: 4.5,
        reviews: 3241,
        image: "https://images.unsplash.com/photo-1605283176568-9b41fde6f01d?w=400&h=400&fit=crop",
        category: "organic",
        type: "100% Organic Bio-Pesticide",
        activeIngredient: "Azadirachtin 1500 PPM",
        dosage: "3-5 ml/L of water",
        safetyPeriod: "No waiting period",
        targetCrops: ["All Vegetables", "Fruits", "Pulses", "Cereals"],
        targetDiseases: ["Aphids", "White fly", "Thrips", "Mites", "Leaf miners"],
        description: "100% organic neem-based solution for effective pest management. Safe for beneficial insects and pollinators.",
        benefits: [
            "Completely organic and safe",
            "No residue issues",
            "Protects beneficial insects",
            "Improves plant immunity"
        ],
        precautions: [
            "Spray during evening hours",
            "Avoid spraying in direct sunlight",
            "Mix fresh solution each time",
            "Safe for organic certification"
        ],
        applicationMethod: "Foliar spray. Mix in water and apply as fine mist on entire plant surface.",
        inStock: true,
        seller: "Organic Farm Supplies",
        distance: "1.8 km",
        packaging: "1 liter bottle"
    },
    {
        id: "med_004",
        name: "Katyayani Organics Trichoderma Viride Bio-fungicide",
        brand: "Katyayani Organics",
        price: 240,
        originalPrice: 350,
        discount: 31,
        rating: 4.7,
        reviews: 1524,
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop",
        category: "organic",
        type: "Bio-Fungicide",
        activeIngredient: "Trichoderma viride 1% WP",
        dosage: "5-10 g/L of water",
        safetyPeriod: "No waiting period",
        targetCrops: ["All crops"],
        targetDiseases: ["Root rot", "Damping off", "Wilt", "Seedling diseases"],
        description: "Biological fungicide containing beneficial microorganisms that protect plants from soil-borne diseases.",
        benefits: [
            "Eco-friendly biological control",
            "Improves soil health",
            "Enhances plant growth",
            "Long-term disease suppression"
        ],
        precautions: [
            "Store in cool place away from sunlight",
            "Use within 6 months of opening",
            "Do not mix with chemical fungicides",
            "Apply during cooler hours"
        ],
        applicationMethod: "Soil application or seed treatment. Mix with water and drench soil or coat seeds before sowing.",
        inStock: true,
        seller: "BioTech Agro",
        distance: "3.1 km",
        packaging: "250g powder"
    },

    // PESTICIDES
    {
        id: "med_005",
        name: "Syngenta Actara Insecticide (Thiamethoxam 25% WG)",
        brand: "Syngenta",
        price: 425,
        originalPrice: 580,
        discount: 27,
        rating: 4.7,
        reviews: 1987,
        image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&h=400&fit=crop",
        category: "pesticide",
        type: "Systemic Insecticide",
        activeIngredient: "Thiamethoxam 25%",
        dosage: "0.3-0.5 g/L of water",
        safetyPeriod: "7-14 days",
        targetCrops: ["Rice", "Cotton", "Vegetables", "Fruits"],
        targetDiseases: ["White fly", "Jassids", "Aphids", "Thrips"],
        description: "Highly effective systemic insecticide with quick action and long residual effect against sucking pests.",
        benefits: [
            "Rapid knockdown effect",
            "Long-lasting protection",
            "Translaminar movement",
            "Effective against resistant pests"
        ],
        precautions: [
            "Highly toxic to bees - avoid spraying during bloom",
            "Use recommended protective equipment",
            "Do not apply near water bodies",
            "Store away from food and feed"
        ],
        applicationMethod: "Foliar spray. Dissolve in water and apply uniformly covering all plant parts.",
        inStock: true,
        seller: "Green Harvest Traders",
        distance: "5.3 km",
        packaging: "100g sachet"
    },

    // FERTILIZERS
    {
        id: "med_006",
        name: "IFFCO NPK 19:19:19 Water Soluble Fertilizer",
        brand: "IFFCO",
        price: 320,
        originalPrice: 450,
        discount: 29,
        rating: 4.6,
        reviews: 2653,
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop",
        category: "fertilizer",
        type: "Water Soluble NPK",
        activeIngredient: "N:P:K - 19:19:19",
        dosage: "5-7 g/L of water",
        safetyPeriod: "Not applicable",
        targetCrops: ["All crops", "Vegetables", "Fruits", "Flowers"],
        targetDiseases: ["Nutrient deficiency"],
        description: "Balanced NPK fertilizer suitable for all growth stages. Completely water-soluble for quick absorption.",
        benefits: [
            "Quick nutrient availability",
            "Balanced nutrition",
            "Improves overall plant health",
            "Suitable for drip and foliar application"
        ],
        precautions: [
            "Do not apply in hot sunny conditions",
            "Follow recommended dosage",
            "Store in dry place",
            "Avoid mixing with incompatible chemicals"
        ],
        applicationMethod: "Foliar spray or fertigation. Dissolve in water as per recommended rate and apply.",
        inStock: true,
        seller: "Krishi Seva Kendra",
        distance: "1.5 km",
        packaging: "1 kg pack"
    },
    {
        id: "med_007",
        name: "Multiplex Humic Acid Organic Fertilizer",
        brand: "Multiplex",
        price: 280,
        originalPrice: 380,
        discount: 26,
        rating: 4.5,
        reviews: 1345,
        image: "https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?w=400&h=400&fit=crop",
        category: "organic",
        type: "Organic Growth Enhancer",
        activeIngredient: "Humic Acid 12%",
        dosage: "2-3 ml/L of water",
        safetyPeriod: "Not applicable",
        targetCrops: ["All crops"],
        targetDiseases: ["Nutrient uptake issues", "Poor plant growth"],
        description: "Natural organic supplement that improves nutrient uptake and soil health. Enhances root development.",
        benefits: [
            "Improves nutrient absorption",
            "Enhances root development",
            "Increases stress tolerance",
            "Improves soil structure"
        ],
        precautions: [
            "Can be used throughout crop cycle",
            "Safe for organic farming",
            "Store away from direct sunlight",
            "Mix fresh solution each time"
        ],
        applicationMethod: "Soil drench or foliar application. Mix with water and apply to root zone or spray on foliage.",
        inStock: true,
        seller: "Organic Solutions Ltd",
        distance: "2.9 km",
        packaging: "500ml bottle"
    },

    // BIO-PESTICIDES
    {
        id: "med_008",
        name: "Anand Agro Bacillus Thuringiensis (Bt) Bio-Insecticide",
        brand: "Anand Agro Care",
        price: 195,
        originalPrice: 275,
        discount: 29,
        rating: 4.6,
        reviews: 892,
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop",
        category: "bio-pesticide",
        type: "Biological Insecticide",
        activeIngredient: "Bacillus thuringiensis var. kurstaki",
        dosage: "1-2 g/L of water",
        safetyPeriod: "No waiting period",
        targetCrops: ["Vegetables", "Cotton", "Pulses"],
        targetDiseases: ["Caterpillars", "Larvae", "DBM", "Fruit borers"],
        description: "Organic biological insecticide specific to lepidopteran pests. Safe for humans, animals, and beneficial insects.",
        benefits: [
            "Target-specific action",
            "Safe for beneficial insects",
            "No chemical residues",
            "Suitable for organic farming"
        ],
        precautions: [
            "Apply during early larval stages",
            "Spray during evening hours",
            "Do not expose to direct sunlight",
            "Use within recommended period after opening"
        ],
        applicationMethod: "Foliar spray. Mix in water and spray thoroughly on affected parts.",
        inStock: true,
        seller: "Bio Control Products",
        distance: "4.7 km",
        packaging: "100g pack"
    },
    {
        id: "med_009",
        name: "Coromandel Saaf Fungicide (Carbendazim 12% + Mancozeb 63% WP)",
        brand: "Coromandel",
        price: 380,
        originalPrice: 520,
        discount: 27,
        rating: 4.8,
        reviews: 3421,
        image: "https://images.unsplash.com/photo-1551712484-485a3b09a351?w=400&h=400&fit=crop",
        category: "fungicide",
        type: "Combination Fungicide",
        activeIngredient: "Carbendazim 12% + Mancozeb 63%",
        dosage: "2 g/L of water",
        safetyPeriod: "7-10 days",
        targetCrops: ["Tomato", "Chili", "Grapes", "Mango", "Rice"],
        targetDiseases: ["Early Blight", "Late Blight", "Leaf Spot", "Anthracnose", "Blast"],
        description: "Powerful combination fungicide providing both contact and systemic action for comprehensive disease control.",
        benefits: [
            "Dual mode of action",
            "Wide disease spectrum",
            "Preventive and curative",
            "Cost-effective"
        ],
        precautions: [
            "Follow recommended dosage strictly",
            "Wear protective clothing",
            "Do not spray against wind",
            "Keep livestock away from treated areas"
        ],
        applicationMethod: "Foliar spray. Prepare fresh suspension and spray uniformly.",
        inStock: true,
        seller: "Farm Fresh Chemicals",
        distance: "3.5 km",
        packaging: "500g pack"
    },
    {
        id: "med_010",
        name: "FMC Fipronil 5% SC Insecticide (Regent)",
        brand: "FMC India",
        price: 465,
        originalPrice: 625,
        discount: 26,
        rating: 4.7,
        reviews: 1567,
        image: "https://images.unsplash.com/photo-1599629954294-b5fc6db5f3ca?w=400&h=400&fit=crop",
        category: "pesticide",
        type: "Systemic Insecticide",
        activeIngredient: "Fipronil 5% SC",
        dosage: "2-3 ml/L of water",
        safetyPeriod: "21 days",
        targetCrops: ["Rice", "Sugarcane", "Cotton"],
        targetDiseases: ["Stem borer", "Shoot fly", "Termites", "White grubs"],
        description: "Broad-spectrum insecticide effective against soil and foliar pests. Long-lasting residual action.",
        benefits: [
            "Excellent soil and foliar activity",
            "Controls resistant pests",
            "Long residual effect",
            "Low application rate"
        ],
        precautions: [
            "Highly toxic to bees and fish",
            "Use protective equipment",
            "Do not mix with alkaline products",
            "Keep children and pets away"
        ],
        applicationMethod: "Foliar spray or soil application as per recommended method for target pest.",
        inStock: false,
        seller: "AgriChem Suppliers",
        distance: "6.2 km",
        packaging: "500ml bottle"
    },
    {
        id: "med_011",
        name: "Bayer Confidor Insecticide (Imidacloprid 17.8% SL)",
        brand: "Bayer CropScience",
        price: 245,
        originalPrice: 320,
        discount: 23,
        rating: 4.9,
        reviews: 4120,
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop",
        category: "pesticide",
        type: "Systemic Insecticide",
        activeIngredient: "Imidacloprid 17.8%",
        dosage: "0.5 ml/L of water",
        safetyPeriod: "15 days",
        targetCrops: ["Tomato", "Chili", "Potato", "Cotton", "Rice"],
        targetDiseases: ["Leaf Curl", "Aphids", "Whitefly", "Thrips", "Jassids"],
        description: "World-renowned systemic insecticide for managing sucking pests. Best for preventing leaf curl virus transmission.",
        benefits: [
            "Highly effective at low doses",
            "Long-lasting control",
            "Excellent systemic action",
            "Safe for crops when used as directed"
        ],
        precautions: [
            "Avoid spraying during bee activity",
            "Do not exceed recommended dose",
            "Wear gloves and mask"
        ],
        applicationMethod: "Foliar spray or soil drenching. Quick absorption by plant parts.",
        inStock: true,
        seller: "Krishi Seva Store",
        distance: "1.2 km",
        packaging: "100ml bottle"
    },
    {
        id: "med_012",
        name: "Aries Plantomycin Bactericide",
        brand: "Aries Agro",
        price: 120,
        originalPrice: 160,
        discount: 25,
        rating: 4.7,
        reviews: 2840,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
        category: "pesticide",
        type: "Antibiotic Bactericide",
        activeIngredient: "Streptomycin Sulphate + Tetracycline Hydrochloride",
        dosage: "1 g/10 L of water",
        safetyPeriod: "10 days",
        targetCrops: ["Tomato", "Chili", "Citrus", "Paddy"],
        targetDiseases: ["Bacterial Spot", "Bacterial Canker", "Black arm", "Bacterial Blight"],
        description: "Potent antibiotic combination for controlling wide range of bacterial diseases in plants.",
        benefits: [
            "Specific action against bacteria",
            "Rapid absorption",
            "Compatible with fungicides",
            "Prevents spread of infection"
        ],
        precautions: [
            "Use only for bacterial infections",
            "Store in cool, dark place",
            "Avoid inhalation"
        ],
        applicationMethod: "Foliar spray. Ensure uniform coverage of affected areas.",
        inStock: true,
        seller: "Agri Solutions Hub",
        distance: "3.8 km",
        packaging: "6g sachet"
    }
];

// Helper functions to filter medicines
export const getMedicinesByCategory = (category: PlantMedicine['category']) => {
    return plantMedicinesDatabase.filter(med => med.category === category);
};

export const getMedicinesByDisease = (disease: string) => {
    if (!disease || disease === "Unknown") return [];

    const keywords = disease.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    return plantMedicinesDatabase.filter(med => {
        const medDiseases = med.targetDiseases.map(d => d.toLowerCase());

        // Exact match first
        if (medDiseases.some(d => d.includes(disease.toLowerCase()) || disease.toLowerCase().includes(d))) {
            return true;
        }

        // Keyword match if no exact match
        return keywords.some(word =>
            medDiseases.some(d => d.includes(word))
        );
    });
};

export const getMedicinesByCrop = (crop: string) => {
    return plantMedicinesDatabase.filter(med =>
        med.targetCrops.some(c => c.toLowerCase().includes(crop.toLowerCase()))
    );
};

export const getInStockMedicines = () => {
    return plantMedicinesDatabase.filter(med => med.inStock);
};

export const getMedicinesByPriceRange = (min: number, max: number) => {
    return plantMedicinesDatabase.filter(med => med.price >= min && med.price <= max);
};
