import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Info,
    AlertTriangle,
    CheckCircle2,
    Droplet,
    Leaf,
    Clock,
    Shield,
    TrendingUp,
    MapPin,
    Star,
    Sparkles,
    Filter,
    Search,
    Package,
    CreditCard,
    Smartphone,
    Landmark,
    ChevronRight,
    X,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/useAppStore";
import {
    plantMedicinesDatabase,
    PlantMedicine,
    getMedicinesByDisease,
    getMedicinesByCrop,
    getInStockMedicines
} from "@/data/plant-medicines";

const MedicineDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeTab, t } = useAppStore();

    // Get disease info from navigation state (passed from ResultsCard)
    const displayDisease = location.state?.disease || "Late Blight";
    const crop = location.state?.crop || "";
    const treatment = location.state?.treatment || "";

    const normalizedDisease = displayDisease
        .replace(/\(.*?\)/g, "")
        .replace(/^possible\s+/i, "")
        .replace(/^likely\s+/i, "")
        .trim();

    const [selectedMedicine, setSelectedMedicine] = useState<PlantMedicine | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [cart, setCart] = useState<PlantMedicine[]>([]);
    const [paymentMedicine, setPaymentMedicine] = useState<PlantMedicine | null>(null);
    const [paymentStep, setPaymentStep] = useState<'summary' | 'method' | 'processing' | 'success'>('summary');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const openPayment = (medicine: PlantMedicine) => {
        setPaymentMedicine(medicine);
        setPaymentStep('summary');
        setSelectedMedicine(null);
    };

    const handlePayment = async () => {
        setPaymentStep('processing');
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2500));
        setIsProcessing(false);
        setPaymentStep('success');
        setCart(prev => [...prev, paymentMedicine!]);
        setTimeout(() => {
            setPaymentMedicine(null);
        }, 3000);
    };

    // Filter medicines based on disease if provided, otherwise show all
    const medicines = useMemo(() => {
        if (normalizedDisease && normalizedDisease !== "Unknown") {
            const filtered = getMedicinesByDisease(normalizedDisease);
            // If we found disease-specific medicines, return them
            if (filtered.length > 0) {
                return filtered.filter(m => m.inStock || filtered.length < 3);
            }
        }
        if (crop) {
            const cropFiltered = getMedicinesByCrop(crop).filter(m => m.inStock);
            if (cropFiltered.length > 0) {
                return cropFiltered.slice(0, 8);
            }
        }
        // Otherwise return all stock medicines, limit to 8
        return getInStockMedicines().slice(0, 8);
    }, [normalizedDisease, crop]);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
        );
    };

    const getMedicineTypeColor = (type: PlantMedicine["category"]) => {
        switch (type) {
            case "fungicide":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "pesticide":
                return "bg-red-100 text-red-700 border-red-200";
            case "herbicide":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "organic":
            case "bio-pesticide":
                return "bg-green-100 text-green-700 border-green-200";
            case "fertilizer":
                return "bg-purple-100 text-purple-700 border-purple-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    // Filter medicines based on disease if provided, otherwise show all
    const filteredMedicines = useMemo(() => {
        let items = medicines;

        if (searchQuery) {
            items = items.filter(m =>
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeFilter !== "all") {
            items = items.filter(m => m.category === activeFilter);
        }

        return items;
    }, [medicines, searchQuery, activeFilter]);

    const categories = ["all", "fungicide", "pesticide", "herbicide", "fertilizer", "organic"];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Professional Header with Pattern */}
            <div className="bg-emerald-900 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative z-10 px-4 py-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-white flex-1 text-center pr-10">{t.careCenter}</h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-[12px] bg-[#10b981] flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                                <Leaf className="w-7 h-7 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">{t.recommendedTreatmentTitle}</h2>
                                <p className="text-emerald-100 text-sm leading-relaxed">
                                    {t.safeSolutionsFor.replace('{disease}', displayDisease)}
                                    <br />{t.basedOnCropAnalysis}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.header>
            </div>

            {/* Filter & Search Section - Sticky */}
            <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md border-b border-gray-200 -mt-6 rounded-t-3xl shadow-sm px-4 py-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder={t.searchTreatments}
                        className="pl-9 bg-white border-gray-200 focus:border-emerald-500 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === cat
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Medicine Grid */}
            <div className="px-4 py-6 pb-24 space-y-4">
                {filteredMedicines.map((medicine, index) => (
                    <motion.div
                        key={medicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[10px] bg-opacity-50 border-0 ${getMedicineTypeColor(medicine.category)}`}>
                                                {medicine.category.toUpperCase()}
                                            </Badge>
                                            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                <CheckCircle2 className="w-3 h-3" /> {t.verifiedSolution}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                            {medicine.name}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(medicine.id)}
                                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                        <Heart className={`w-4 h-4 transition-colors ${favorites.includes(medicine.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                                    </button>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                    {medicine.description}
                                </p>

                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400">{t.marketValue}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-emerald-700">₹{medicine.price}</span>
                                            <span className="text-xs text-gray-500">/{medicine.packaging}</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedMedicine(medicine)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 h-10 shadow-lg shadow-emerald-200 transition-transform active:scale-95"
                                    >
                                        {t.howToUse}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Medicine Detail Modal */}
            <AnimatePresence>
                {selectedMedicine && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedMedicine(null)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedMedicine.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {t.safeApplicationGuide}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMedicine(null)}
                                        className="p-2 rounded-full hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6 space-y-6">
                                {/* Application Method */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplet className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">{t.applicationMethod}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                        {selectedMedicine.applicationMethod}
                                    </p>
                                </div>

                                {/* Effective Against */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-emerald-600" />
                                        <h3 className="font-semibold text-gray-900">{t.effectiveAgainst}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMedicine.targetDiseases.map((item, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <h3 className="font-semibold text-gray-900">{t.keyBenefits}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedMedicine.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <p className="text-xs text-amber-700 italic">
                                        {t.marketAveragesNote}
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">{t.valueEstimate}</div>
                                        <div className="text-2xl font-bold text-emerald-600">
                                            ₹{selectedMedicine.price}
                                        </div>
                                    </div>
                                    <Button
                                        className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
                                        onClick={() => setSelectedMedicine(null)}
                                    >
                                        {t.closeGuide}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicineDashboard;
