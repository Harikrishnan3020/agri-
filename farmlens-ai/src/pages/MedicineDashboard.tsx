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
    getInStockMedicines
} from "@/data/plant-medicines";

const MedicineDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeTab } = useAppStore();

    // Get disease info from navigation state (passed from ResultsCard)
    const disease = location.state?.disease || "Late Blight";
    const treatment = location.state?.treatment || "";

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
        if (disease && disease !== "Unknown") {
            const filtered = getMedicinesByDisease(disease);
            // If we found disease-specific medicines, return them
            if (filtered.length > 0) {
                return filtered.filter(m => m.inStock || filtered.length < 3);
            }
        }
        // Otherwise return all stock medicines, limit to 8
        return getInStockMedicines().slice(0, 8);
    }, [disease]);

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
                        <h1 className="text-xl font-bold text-white flex-1 text-center pr-10">Pharmacy</h1>
                        <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-emerald-900 text-[10px] font-bold text-white flex items-center justify-center">{cart.length}</span>
                            )}
                        </Button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">Treatment Plan</h2>
                                <p className="text-emerald-100 text-sm leading-relaxed">
                                    Recommended solutions for <span className="font-semibold text-white">{disease}</span>.
                                    <br />Based on your crop analysis.
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
                        placeholder="Search medicines..."
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
                                            {medicine.inStock ? (
                                                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                    <CheckCircle2 className="w-3 h-3" /> In Stock
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                                                    Out of Stock
                                                </span>
                                            )}
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

                                <div className="flex items-center justify-between gap-4 py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <div className="bg-amber-100 p-1.5 rounded-lg">
                                            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">{medicine.rating}</span>
                                            <span className="text-[10px] text-gray-500">Rating</span>
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100"></div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="bg-blue-100 p-1.5 rounded-lg">
                                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">{medicine.distance}</span>
                                            <span className="text-[10px] text-gray-500">Distance</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400">Price</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-emerald-700">₹{medicine.price}</span>
                                            <span className="text-xs text-gray-500">/{medicine.packaging}</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedMedicine(medicine)}
                                        className="bg-gray-900 hover:bg-black text-white rounded-xl px-5 h-10 shadow-lg shadow-gray-200 transition-transform active:scale-95"
                                    >
                                        View Details
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
                                            Complete Product Information
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
                                {/* Active Ingredient */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold text-gray-900">Active Ingredient</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-purple-50 rounded-lg p-3 border border-purple-100">
                                        {selectedMedicine.activeIngredient}
                                    </p>
                                </div>

                                {/* Application Method */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Droplet className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Application Method</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                        {selectedMedicine.applicationMethod}
                                    </p>
                                </div>

                                {/* Effective Against */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-5 h-5 text-emerald-600" />
                                        <h3 className="font-semibold text-gray-900">Effective Against</h3>
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
                                        <h3 className="font-semibold text-gray-900">Key Benefits</h3>
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

                                {/* Precautions */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                        <h3 className="font-semibold text-gray-900">Precautions</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedMedicine.precautions.map((precaution, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                                {precaution}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500">Total Price</div>
                                        <div className="text-2xl font-bold text-emerald-600">
                                            ₹{selectedMedicine.price}
                                            <span className="text-sm text-gray-500 font-normal">
                                                /{selectedMedicine.packaging}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl"
                                        onClick={() => openPayment(selectedMedicine!)}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart & Pay
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment Gateway Modal */}
            <AnimatePresence>
                {paymentMedicine && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={(e) => { if (paymentStep !== 'processing' && paymentStep !== 'success' && e.target === e.currentTarget) setPaymentMedicine(null); }}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait">
                                {paymentStep === 'summary' && (
                                    <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {/* Razorpay-style header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-3xl sm:rounded-t-3xl px-6 py-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <CreditCard className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-white font-bold text-lg">AgriYield Pay</span>
                                                </div>
                                                <button onClick={() => setPaymentMedicine(null)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-blue-100 text-xs">Secure Payment Powered by AgriYield</p>
                                        </div>

                                        <div className="px-6 py-5 space-y-4">
                                            {/* Order Summary */}
                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                <h3 className="text-sm font-bold text-gray-700 mb-3">Order Summary</h3>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-6 h-6 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">{paymentMedicine.name}</p>
                                                        <p className="text-xs text-gray-500">{paymentMedicine.packaging} • {paymentMedicine.category}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">₹{paymentMedicine.price}</p>
                                                    </div>
                                                </div>
                                                <div className="border-t mt-3 pt-3 space-y-1">
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Subtotal</span><span>₹{paymentMedicine.price}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>Delivery</span><span className="text-green-600">FREE</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-600">
                                                        <span>GST (18%)</span><span>₹{Math.round(paymentMedicine.price * 0.18)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
                                                        <span>Total</span><span className="text-emerald-700">₹{paymentMedicine.price + Math.round(paymentMedicine.price * 0.18)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method Selection */}
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-700 mb-3">Payment Method</h3>
                                                <div className="space-y-2">
                                                    {[
                                                        { id: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Pay via UPI ID or QR', color: 'text-purple-600' },
                                                        { id: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay', color: 'text-blue-600' },
                                                        { id: 'netbanking' as const, label: 'Net Banking', icon: Landmark, desc: 'All major banks supported', color: 'text-green-600' },
                                                    ].map(method => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedPaymentMethod === method.id
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                                                }`}
                                                        >
                                                            <method.icon className={`w-5 h-5 ${method.color}`} />
                                                            <div className="flex-1 text-left">
                                                                <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                                                                <p className="text-xs text-gray-500">{method.desc}</p>
                                                            </div>
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                                                }`}>
                                                                {selectedPaymentMethod === method.id && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>

                                                {selectedPaymentMethod === 'upi' && (
                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
                                                        <Input
                                                            placeholder="Enter UPI ID (e.g. name@upi)"
                                                            value={upiId}
                                                            onChange={(e) => setUpiId(e.target.value)}
                                                            className="border-gray-200 focus:border-blue-500 rounded-xl"
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>

                                            <Button
                                                onClick={() => setPaymentStep('method')}
                                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg"
                                            >
                                                Continue to Pay ₹{paymentMedicine.price + Math.round(paymentMedicine.price * 0.18)} <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>

                                            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5" /> 256-bit SSL secured payment
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {paymentStep === 'method' && (
                                    <motion.div key="method" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-3xl sm:rounded-t-3xl px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => setPaymentStep('summary')} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">
                                                    <ArrowLeft className="w-4 h-4" />
                                                </button>
                                                <span className="text-white font-bold">Confirm Payment</span>
                                            </div>
                                        </div>
                                        <div className="px-6 py-6 space-y-4 text-center">
                                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                                {selectedPaymentMethod === 'upi' && <Smartphone className="w-8 h-8 text-purple-600" />}
                                                {selectedPaymentMethod === 'card' && <CreditCard className="w-8 h-8 text-blue-600" />}
                                                {selectedPaymentMethod === 'netbanking' && <Landmark className="w-8 h-8 text-green-600" />}
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">₹{paymentMedicine.price + Math.round(paymentMedicine.price * 0.18)}</p>
                                                <p className="text-sm text-gray-500 mt-1">{paymentMedicine.name}</p>
                                            </div>
                                            {selectedPaymentMethod === 'upi' && upiId && (
                                                <div className="bg-purple-50 rounded-xl px-4 py-3">
                                                    <p className="text-xs text-purple-600 font-medium">Paying to UPI ID</p>
                                                    <p className="text-sm font-bold text-purple-800">{upiId}</p>
                                                </div>
                                            )}
                                            <Button
                                                onClick={handlePayment}
                                                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl"
                                            >
                                                Pay Now ₹{paymentMedicine.price + Math.round(paymentMedicine.price * 0.18)}
                                            </Button>
                                            <p className="text-xs text-gray-400">By clicking Pay Now, you agree to our Terms & Conditions</p>
                                        </div>
                                    </motion.div>
                                )}

                                {paymentStep === 'processing' && (
                                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 py-16 text-center">
                                        <motion.div
                                            className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 mx-auto mb-6"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                                        <p className="text-sm text-gray-500">Please wait, do not close this window...</p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            {['Connecting...', 'Verifying...', 'Confirming...'].map((step, i) => (
                                                <motion.span
                                                    key={step}
                                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium"
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                                                >{step}</motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {paymentStep === 'success' && (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-12 text-center">
                                        <motion.div
                                            className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h3>
                                        <p className="text-gray-500 mb-2">₹{paymentMedicine.price + Math.round(paymentMedicine.price * 0.18)} paid successfully</p>
                                        <p className="text-sm text-gray-400">Order confirmation sent • Delivery in 2-3 days</p>
                                        <div className="mt-6 bg-emerald-50 rounded-2xl p-4">
                                            <p className="text-xs text-emerald-700 font-medium">Transaction ID</p>
                                            <p className="font-mono text-sm font-bold text-emerald-900">AGR{Date.now().toString().slice(-8)}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedicineDashboard;
