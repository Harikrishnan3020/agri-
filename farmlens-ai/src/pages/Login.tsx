
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import {
    Eye, EyeOff, Lock, User, ArrowRight,
    Leaf, ShieldCheck,
    Globe, TrendingUp, Smartphone, UploadCloud, Hexagon,
    Activity, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

// --- Premium 3D & Holographic Scenes ---

const HolographicScan = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Holographic Base */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-emerald-500/20 to-transparent blur-xl" />

            {/* Rotating Rings */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border border-emerald-500/30 rounded-full"
                    style={{ rotateX: 60, scale: 0.8 + i * 0.2 }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                />
            ))}

            {/* Central Leaf Wireframe (simulated) */}
            <motion.div
                className="relative z-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <Leaf className="w-32 h-32 opacity-90" strokeWidth={1} />
                <Leaf className="w-32 h-32 absolute inset-0 opacity-50 blur-sm text-emerald-300" strokeWidth={1} />
            </motion.div>

            {/* Scanning Laser Grid */}
            <motion.div
                initial={{ opacity: 0, height: "0%" }}
                animate={{ opacity: [0, 1, 0], height: "100%", top: ["0%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute w-full bg-gradient-to-b from-emerald-400/50 to-transparent border-t border-emerald-400/80 z-20"
                style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)" }}
            />

            {/* Floating Data Points */}
            <motion.div className="absolute top-10 right-0 bg-black/40 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded text-[10px] text-emerald-400 font-mono">
                HEALTH: 98%
            </motion.div>
            <motion.div className="absolute bottom-10 left-0 bg-black/40 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded text-[10px] text-emerald-400 font-mono">
                PATHOGEN: NONE
            </motion.div>
        </div>
    );
}

const GlobalMarket = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Rotating Globe Wireframe */}
            <div className="absolute inset-0 rounded-full border border-amber-500/10 bg-amber-500/5 blur-3xl animate-pulse" />

            <motion.div
                className="relative z-10 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <Globe className="w-40 h-40 opacity-80" strokeWidth={0.5} />
            </motion.div>

            {/* Floating Currency/Nodes */}
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-12 h-12 bg-black/60 border border-amber-500/40 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg"
                    animate={{
                        x: [0, Math.cos(i) * 60, 0],
                        y: [0, Math.sin(i) * 60, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '50%', left: '50%', marginLeft: '-24px', marginTop: '-24px' }}
                >
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                </motion.div>
            ))}
        </div>
    );
};

const ConnectedCommunity = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center perspective-1000">
            {/* Hexagon Grid Background */}
            <div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-20">
                {[...Array(9)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="bg-purple-500/30 rounded-lg"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Central Node */}
            <motion.div
                className="relative z-20 w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.5)] border border-white/20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            >
                <Star className="w-12 h-12 text-white fill-white/20" />
            </motion.div>

            {/* Satellite Nodes */}
            {[0, 90, 180, 270].map((deg, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-32 bg-gradient-to-t from-purple-500/50 to-transparent z-10 origin-bottom"
                    style={{ rotate: deg, bottom: "50%" }}
                    animate={{ height: ["40%", "60%", "40%"], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,1)]" />
                </motion.div>
            ))}
        </div>
    );
};

const SecurityShield = () => {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Force Field Layers */}
            {[1, 1.2, 1.4].map((scale, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border border-blue-500/20 rounded-full"
                    animate={{ scale: [scale, scale + 0.1, scale], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                />
            ))}

            {/* Hexagon Shield */}
            <motion.div
                className="relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Hexagon className="w-40 h-40 text-blue-500/20 fill-blue-500/10 stroke-1" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-20 h-20 text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" strokeWidth={1.5} />
                </div>
            </motion.div>

            {/* Glitch Effect Particles */}
            <motion.div
                className="absolute inset-x-0 top-1/2 h-[1px] bg-blue-400/50"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

// --- Spotlight Card Effect ---
const SpotlightToogle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`group relative border border-white/10 bg-gray-900/5 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
}


// --- Main Page Component ---

const PortfolioItem = ({
    Scene,
    title,
    desc,
    color
}: {
    Scene: React.ComponentType,
    title: string,
    desc: string,
    color: string
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
    >
        <div className="mb-12 relative">
            <div className={`absolute inset-0 ${color} opacity-20 blur-[60px] rounded-full transition-colors duration-1000`}></div>
            <Scene />
        </div>

        <div className="space-y-4 max-w-lg relative z-10">
            <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight"
            >
                {title}
            </motion.h3>
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100px", opacity: 1 }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                className={`h-1 ${color} mx-auto rounded-full transition-colors duration-1000`}
            />
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="text-lg text-white/70 leading-relaxed font-light"
            >
                {desc}
            </motion.p>
        </div>
    </motion.div>
);

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAppStore();
    const [showPassword, setShowPassword] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [formState, setFormState] = useState({ username: "", password: "" });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation simulation
        if (!formState.username || !formState.password) {
            // In a real app, use toast/sonner here. 
            // For now, simple return or alert could work, but user flow is priority.
            return;
        }

        // Simulate API call/processing
        console.log("Logging in with:", formState);
        login();

        // Navigate to Dashboard
        navigate("/");
    };

    const portfolioItems = [
        {
            id: 1,
            Scene: HolographicScan,
            title: "Bio-Scanning AI",
            desc: "Instant pathogen detection using our proprietary Neural-Agri™ engine. Diagnoses crops with 99.8% accuracy in partial lighting.",
            color: "bg-emerald-500",
        },
        {
            id: 2,
            Scene: GlobalMarket,
            title: "Global Trade Network",
            desc: "Connect directly with verified industrial buyers. Real-time futures pricing and automated logistics handling.",
            color: "bg-amber-500",
        },
        {
            id: 3,
            Scene: ConnectedCommunity,
            title: "Elite Farmer's League",
            desc: "Join the top 1% of cultivators. Compete in regional yield leaderboards and unlock exclusive government grants.",
            color: "bg-purple-500",
        },
        {
            id: 4,
            Scene: SecurityShield,
            title: "CropShield™ Protection",
            desc: "Blockchain-verified insurance coverage. Parametric payouts triggered automatically by satellite weather data.",
            color: "bg-blue-500",
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % portfolioItems.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden relative font-sans selection:bg-emerald-500/30">

            {/* Left: Login Form (Glassmorphism + Spotlight) */}
            <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 lg:p-12">
                <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <SpotlightToogle className="rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl bg-white/60 dark:bg-black/40 p-8 md:p-12">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">AgriYield</span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                                Welcome Back
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Secure access to your agricultural command center.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-20">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username / ID</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                    <Input
                                        id="username"
                                        placeholder="Farmer ID or Email"
                                        className="pl-10 h-12 bg-white/50 border-gray-200/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300"
                                        value={formState.username}
                                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-12 bg-white/50 border-gray-200/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300"
                                        value={formState.password}
                                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                                <Button className="w-full h-12 text-lg font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-500/20 rounded-xl transition-all" type="submit">
                                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                    <span className="bg-white px-4 text-muted-foreground font-medium">
                                        Alternative Access
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button type="button" variant="outline" className="h-11 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                                    <Smartphone className="w-4 h-4 mr-2 text-emerald-600" /> Mobile OTP
                                </Button>
                                <Button type="button" variant="outline" className="h-11 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                                    <UploadCloud className="w-4 h-4 mr-2 text-emerald-600" /> Passkey
                                </Button>
                            </div>
                        </form>
                    </SpotlightToogle>

                    <p className="text-center mt-8 text-sm text-muted-foreground">
                        Don't have an account? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Apply for Access</Link>
                    </p>
                </motion.div>
            </div>

            {/* Right: Premium Animation Portfolio */}
            <div className="hidden lg:block lg:w-1/2 relative bg-[#050505] overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0">
                    {/* Gradient Orbs */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            left: ["10%", "30%", "10%"]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.3, 0.5, 0.3],
                            right: ["10%", "30%", "10%"]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"
                    />

                    {/* Noise Overlay for Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </div>

                {/* Content Container */}
                <div className="relative h-full flex items-center justify-center p-12 z-10">
                    <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">

                        {/* Main Carousel */}
                        <div className="w-full h-full flex items-center justify-center perspective-1000">
                            <AnimatePresence>
                                <PortfolioItem
                                    key={portfolioItems[activeSlide].id}
                                    {...portfolioItems[activeSlide]}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Progress / Navigation */}
                        <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center space-x-4 z-20">
                            {portfolioItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveSlide(index)}
                                    className="group relative py-4"
                                >
                                    <div className={`h-1 rounded-full transition-all duration-500 ease-out ${index === activeSlide ? "w-12 bg-white" : "w-2 bg-white/20 group-hover:bg-white/40"
                                        }`} />
                                    {index === activeSlide && (
                                        <motion.div layoutId="activeGlow" className="absolute inset-0 bg-white/30 blur-md -z-10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
