
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import { Leaf, User, Lock, ArrowRight, Eye, EyeOff, X, Mail, Smartphone, RefreshCw, CheckCircle, Globe, Hexagon, Star, MessageCircle, UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

// --- OTP Modal Component ---
const OTPModal = ({ onClose, onSuccess, initialContact = "" }: { onClose: () => void; onSuccess: (contact: string) => void; initialContact?: string }) => {
    const [step, setStep] = useState<'input' | 'verify' | 'success'>('input');
    const [otpContact, setOtpContact] = useState(initialContact);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpError, setOtpError] = useState('');

    useEffect(() => {
        if (resendCooldown > 0) {
            const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [resendCooldown]);

    const { t } = useAppStore();

    const handleSendOtp = async () => {
        if (!otpContact.trim()) {
            toast.error(t.pleaseEnterEmailPhone);
            return;
        }
        setIsSending(true);
        // Generate a 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        // Simulate sending delay
        await new Promise(r => setTimeout(r, 1500));
        setIsSending(false);
        setStep('verify');
        setResendCooldown(30);
        // Show OTP in toast for demo (in production, this would be sent via email/SMS)
        toast.success(
            t.otpSentFrom
                .replace("{email}", "AgriYield@gmail.com")
                .replace("{code}", code),
            { duration: 15000 }
        );
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError('');
        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            setOtpError(t.otpCompleteRequired);
            return;
        }
        if (enteredOtp === generatedOtp) {
            setStep('success');
            setTimeout(() => {
                onSuccess(otpContact);
                onClose();
            }, 1500);
        } else {
            setOtpError(t.otpInvalidTryAgain);
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0')?.focus();
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-sm relative overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <AnimatePresence mode="wait">
                        {step === 'input' && (
                            <motion.div key="input" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <Smartphone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.mobileOTP}</h2>
                                        <p className="text-sm text-gray-500">{t.quickSecureLogin}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="otp-contact" className="text-sm font-medium">{t.emailOrPhone}</Label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="otp-contact"
                                                placeholder={t.emailOrPhonePlaceholder}
                                                className="pl-9 h-11"
                                                value={otpContact}
                                                onChange={(e) => setOtpContact(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSendOtp}
                                        disabled={isSending}
                                        className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl"
                                    >
                                        {isSending ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {t.sendingOTP}
                                            </span>
                                        ) : t.sendOTP}
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'verify' && (
                            <motion.div key="verify" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                                        <Mail className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.enterOTP}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{t.sentTo} <strong>{otpContact}</strong></p>
                                </div>
                                <div className="flex gap-2 justify-center mb-4">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${otpError ? 'border-red-400 bg-red-50' : digit ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                                                } focus:border-emerald-500 focus:bg-emerald-50`}
                                        />
                                    ))}
                                </div>
                                {otpError && <p className="text-xs text-red-500 text-center mb-3">{otpError}</p>}
                                <Button
                                    onClick={handleVerifyOtp}
                                    className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl mb-3"
                                >
                                    {t.verifyOTP}
                                </Button>
                                <div className="text-center">
                                    {resendCooldown > 0 ? (
                                        <p className="text-sm text-gray-400">{t.resendIn.replace("{seconds}", resendCooldown.toString())}</p>
                                    ) : (
                                        <button onClick={handleSendOtp} className="text-sm text-emerald-600 hover:text-emerald-500 font-medium flex items-center gap-1 mx-auto">
                                            <RefreshCw className="w-3.5 h-3.5" /> {t.resendOTP}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Success Step */}
                        {step === 'success' && (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                                <motion.div
                                    className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                                </motion.div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.verifiedCheck}</h2>
                                <p className="text-sm text-gray-500 mt-1">{t.loggingYouIn}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

// --- Premium 3D & Holographic Scenes ---

const HolographicScan = () => {
    const { t } = useAppStore();
    return (
        <div className="relative w-80 h-80 flex items-center justify-center perspective-1000">
            {/* 3D Scanning Base */}
            <motion.div
                className="absolute inset-x-0 bottom-10 h-32 bg-gradient-to-t from-emerald-500/20 to-transparent blur-2xl transform-gpu rotate-x-60"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* DNA Helix Simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-40 h-40 border border-emerald-500/30 rounded-full"
                        style={{ rotateX: 60, rotateY: i * 22.5 }}
                        animate={{ rotateZ: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                    />
                ))}
            </div>

            {/* Central Leaf Hologram */}
            <motion.div
                className="relative z-10 text-emerald-400 filter drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]"
                animate={{
                    y: [0, -15, 0],
                    rotateY: [0, 10, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <Leaf className="w-40 h-40 opacity-90 stroke-[0.5]" />
                <Leaf className="w-40 h-40 absolute inset-0 opacity-40 blur-md text-emerald-200" strokeWidth={0.5} />

                {/* Glitch Effect */}
                <motion.div
                    className="absolute inset-0 bg-emerald-400/20 mix-blend-overlay"
                    animate={{ clipPath: ["inset(0 0 0 0)", "inset(10% 0 80% 0)", "inset(0 0 0 0)"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
            </motion.div>

            {/* Scanning Laser Beam */}
            <motion.div
                className="absolute w-full h-2 bg-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,1)] z-20"
                initial={{ top: "0%", scaleX: 1.2, opacity: 0 }}
                animate={{ top: ["10%", "90%", "10%"], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Analysis Data */}
            <div className="absolute top-0 right-0 space-y-2">
                {[98, 99, 95].map((val, i) => (
                    <motion.div
                        key={i}
                        className="bg-black/60 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-2"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t.scanLabelPrefix}{i + 1}: {val}% {t.matchLabel}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const GlobalMarket = () => {
    const { t } = useAppStore();
    return (
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Digital Globe Skeleton */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl animate-pulse" />

            <motion.div
                className="relative z-10 w-48 h-48 rounded-full border border-amber-500/20 grid grid-cols-6 grid-rows-6 overflow-hidden perspective-1000"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(36)].map((_, i) => (
                    <div key={i} className="border border-amber-500/10 bg-amber-500/5" />
                ))}

                {/* Simulated Continents */}
                <Globe className="absolute inset-0 w-full h-full text-amber-500/40 p-2" strokeWidth={0.5} />
            </motion.div>

            {/* Orbital Trade Routes */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border border-dashed border-amber-500/30 rounded-full"
                    style={{ rotateX: 70 + i * 10, scale: 1.2 + i * 0.3 }}
                    animate={{ rotateZ: [0, 360] }}
                    transition={{ duration: 20 - i * 5, repeat: Infinity, ease: "linear" }}
                />
            ))}

            {/* Floating Market Tickers */}
            {[
                { label: t.wheatLabel, val: "+2.4%", x: -80, y: -60 },
                { label: t.riceLabel, val: "+1.2%", x: 80, y: 40 },
                { label: t.cornLabel, val: "-0.5%", x: -60, y: 70 },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-black/80 border border-amber-500/40 px-3 py-1.5 rounded-lg flex flex-col items-center shadow-lg backdrop-blur-sm"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ x: item.x, y: item.y, opacity: 1 }}
                    transition={{ duration: 1, delay: i * 0.3 }}
                >
                    <span className="text-[10px] text-amber-500/70 font-bold tracking-wider">{item.label}</span>
                    <span className={`text-xs font-mono font-bold ${item.val.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {item.val}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

const ConnectedCommunity = () => {
    return (
        <div className="relative w-80 h-80 flex items-center justify-center perspective-1000">
            {/* Rippling Hex Grid */}
            <div className="absolute inset-0 grid grid-cols-4 gap-2 opacity-30">
                {[...Array(16)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/10"
                        animate={{
                            scale: [1, 0.9, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
                    />
                ))}
            </div>

            {/* Central Hub */}
            <div className="relative z-20">
                <motion.div
                    className="w-28 h-28 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.6)] border border-white/20"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Hexagon className="w-16 h-16 text-white/90" strokeWidth={1} />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <Star className="w-10 h-10 text-white fill-white" />
                </div>
            </div>

            {/* Connecting User Nodes */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
                <motion.div
                    key={i}
                    className="absolute w-36 h-1 bg-gradient-to-r from-purple-500 to-transparent origin-left z-10"
                    style={{ rotate: deg, left: "50%", top: "50%" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: [0, 1, 0] }}
                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-900 border border-purple-400 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-4 h-4 text-purple-200" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const SecurityShield = () => {
    return (
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Active Force Fields */}
            {[1.2, 1.5, 1.8].map((scale, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-blue-500/20 rounded-full"
                    animate={{
                        scale: [scale, scale + 0.1, scale],
                        opacity: [0.3, 0, 0.3],
                        rotate: i % 2 === 0 ? 360 : -360
                    }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full blur-sm" />
                </motion.div>
            ))}

            {/* Main Shield Hologram */}
            <motion.div
                className="relative z-10 w-48 h-48"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500/30 fill-blue-500/10 stroke-[0.5]" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Lock className="w-16 h-16 text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.8)]" />
                    </motion.div>
                </div>

                {/* Scanning Light sweep */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/20 to-transparent"
                    animate={{ left: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ clipPath: "path('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')" }}
                />
            </motion.div>

            {/* Blockchain verification particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
                >
                    <div className="absolute top-0 w-1 h-8 bg-blue-400/50 rounded-full blur-[1px]" />
                </motion.div>
            ))}
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
    const { login, t } = useAppStore();
    const [showPassword, setShowPassword] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    // Form State
    const [fullName, setFullName] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; contact?: string; password?: string }>({});

    const portfolioItems = useMemo(() => ([
        {
            id: 1,
            Scene: HolographicScan,
            title: t.bioScanningAiTitle,
            desc: t.bioScanningAiDesc,
            color: "bg-emerald-500",
        },
        {
            id: 2,
            Scene: GlobalMarket,
            title: t.globalTradeTitle,
            desc: t.globalTradeDesc,
            color: "bg-amber-500",
        },
        {
            id: 3,
            Scene: ConnectedCommunity,
            title: t.eliteFarmersLeagueTitle,
            desc: t.eliteFarmersLeagueDesc,
            color: "bg-purple-500",
        },
        {
            id: 4,
            Scene: SecurityShield,
            title: t.cropShieldTitle,
            desc: t.cropShieldDesc,
            color: "bg-blue-500",
        },
    ]), [t]);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!fullName.trim()) newErrors.name = t.nameRequired;
        if (!contact.trim()) newErrors.contact = t.contactRequired;
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+?[1-9]\d{6,14}$/;
            if (!emailRegex.test(contact) && !phoneRegex.test(contact))
            newErrors.contact = t.validEmailOrPhone;
        }
        if (!password) newErrors.password = t.passwordRequired;
        else if (password.length < 6) newErrors.password = t.passwordMin;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        // Instant login — no fake delay
        login(contact, fullName.trim());
        toast.success(t.welcomeUser.replace("{name}", fullName.trim()));
        navigate("/dashboard");
    };

    const handleOtpSuccess = (otpContact: string) => {
        const name = otpContact.includes('@') ? otpContact.split('@')[0] : t.farmerLabel;
        login(otpContact, name);
        toast.success(t.welcomeOtpUser.replace("{name}", name));
        navigate("/dashboard");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % PORTFOLIO_ITEMS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden relative font-sans selection:bg-emerald-500/30">

            {/* Left: Login Form */}
            <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 lg:p-12">
                <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <SpotlightToogle className="rounded-3xl border border-white/20 shadow-2xl backdrop-blur-3xl bg-white/60 dark:bg-black/40 p-8 md:p-10">

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-[12px] bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                                    <Leaf className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 font-sans tracking-tight">AgriYield</span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{t.welcomeBack}</h1>
                            <p className="text-muted-foreground">{t.signInSubtitle}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">

                            {/* Name */}
                            <div className="space-y-1">
                                <Label htmlFor="fullName">{t.fullName}</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                    <Input
                                        id="fullName"
                                        placeholder={t.fullNamePlaceholder}
                                        className={`pl-10 h-12 bg-white/50 border-gray-200/50 focus:border-emerald-500/50 transition-all ${errors.name ? "border-red-400" : ""}`}
                                        value={fullName}
                                        onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Email / Phone */}
                            <div className="space-y-1">
                                <Label htmlFor="contact">{t.emailOrPhoneShort}</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                    <Input
                                        id="contact"
                                        placeholder={t.emailOrPhonePlaceholder}
                                        className={`pl-10 h-12 bg-white/50 border-gray-200/50 focus:border-emerald-500/50 transition-all ${errors.contact ? "border-red-400" : ""}`}
                                        value={contact}
                                        onChange={(e) => { setContact(e.target.value); setErrors(p => ({ ...p, contact: undefined })); }}
                                    />
                                </div>
                                {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">{t.passwordLabel}</Label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`pl-10 pr-10 h-12 bg-white/50 border-gray-200/50 focus:border-emerald-500/50 transition-all ${errors.password ? "border-red-400" : ""}`}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            {/* Submit */}
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-2">
                                <Button
                                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 rounded-xl transition-all"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                            />
                                            {t.signingIn}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {t.signIn} <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>
                            </motion.div>


                        </form>
                    </SpotlightToogle>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        {t.noAccountQuestion} <Link to="/register" className="text-emerald-600 font-semibold hover:underline">{t.applyForAccess}</Link>
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
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.4, 0.3],
                            left: ["10%", "20%", "10%"]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[60px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.1, 1, 1.1],
                            opacity: [0.3, 0.4, 0.3],
                            right: ["10%", "20%", "10%"]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[60px]"
                    />

                    {/* Noise Overlay for Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </div>

                {/* Content Container */}
                <div className="relative h-full flex items-center justify-center p-12 z-10">
                    <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">

                        {/* Main Carousel */}
                        <div className="w-full h-full flex items-center justify-center perspective-1000">
                            <AnimatePresence mode="wait">
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
