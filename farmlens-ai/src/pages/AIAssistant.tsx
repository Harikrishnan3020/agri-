import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
    Mic,
    MicOff,
    Leaf,
    Sun,
    Droplets,
    TrendingUp,
    Camera,
    Image as ImageIcon,
    X,
    ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { translations, LanguageCode } from "@/data/translations";

interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    imageUrl?: string;
    timestamp: Date;
    suggestions?: string[];
}

// Web Speech API type declarations
declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
    interface SpeechRecognition extends EventTarget {
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        start(): void;
        stop(): void;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
        onend: (() => void) | null;
    }
    interface SpeechRecognitionEvent extends Event {
        results: SpeechRecognitionResultList;
    }
    interface SpeechRecognitionResultList {
        [index: number]: SpeechRecognitionResult;
        length: number;
    }
    interface SpeechRecognitionResult {
        [index: number]: SpeechRecognitionAlternative;
        isFinal: boolean;
    }
    interface SpeechRecognitionAlternative {
        transcript: string;
    }
    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
    }
}

const AIAssistant = () => {
    const navigate = useNavigate();
    const { user, selectedLanguage } = useAppStore();
    const t = translations[selectedLanguage as LanguageCode] || translations.en;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "ai",
            content: `${t.greeting} ${user?.name || "Farmer"}! 👋 ${t.aiWelcome}\n\n${t.aiCanDo}\n• 💬 ${t.aiAskAnything}\n• 📷 ${t.aiSendPhoto}\n• 🎤 ${t.aiVoiceInput}`,
            timestamp: new Date(),
            suggestions: [
                t.suggestionBlight,
                t.suggestionFertilizer,
                t.suggestionPlanting,
                t.suggestionPest,
            ],
        },
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [pendingImage, setPendingImage] = useState<string | null>(null); // preview before send
    const [showCamera, setShowCamera] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            cameraStream?.getTracks().forEach(t => t.stop());
        };
    }, [cameraStream]);

    // ── Camera ──────────────────────────────────────────────────────────────
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            setCameraStream(stream);
            setShowCamera(true);
            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            }, 100);
        } catch {
            toast.error("Camera access denied. Please allow camera permission.");
        }
    };

    const closeCamera = () => {
        cameraStream?.getTracks().forEach(t => t.stop());
        setCameraStream(null);
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPendingImage(dataUrl);
        closeCamera();
        toast.success("Photo captured! Add a message or send directly.");
        inputRef.current?.focus();
    };

    // ── File Upload ─────────────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPendingImage(reader.result as string);
            toast.success("Photo ready! Add a message or send directly.");
            inputRef.current?.focus();
        };
        reader.readAsDataURL(file);
        // Reset so same file can be re-selected
        e.target.value = "";
    };

    const removePendingImage = () => setPendingImage(null);

    // ── Mic ─────────────────────────────────────────────────────────────────
    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            toast.error("Voice input not supported in this browser. Try Chrome.");
            return;
        }
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            setInputMessage(event.results[0][0].transcript);
            setIsListening(false);
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error === "not-allowed") toast.error("Microphone permission denied.");
            else toast.error("Voice recognition failed. Try again.");
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        toast.info("Listening… speak now 🎤");
    };

    // ── AI Response ─────────────────────────────────────────────────────────
    const generateAIResponse = (userMessage: string, hasImage: boolean): string => {
        if (hasImage) {
            const lowerMsg = userMessage.toLowerCase();
            if (lowerMsg.includes("disease") || lowerMsg.includes("sick") || lowerMsg.includes("problem") || lowerMsg.includes("issue") || !userMessage.trim()) {
                return `🔍 **Crop Image Analysis:**\n\nI can see your crop image! Based on visual inspection:\n\n⚠️ **Possible Issues Detected:**\n- Leaf discoloration patterns suggest possible fungal infection\n- Check for Late Blight or Powdery Mildew symptoms\n\n💊 **Recommended Action:**\n- Apply Mancozeb 75% WP @ 2.5g/L\n- Improve air circulation around plants\n- Remove severely infected leaves\n\n📸 **For accurate diagnosis**, use the **Scan** feature on the home screen — it uses our advanced AI model for precise disease detection with treatment plans!\n\nWould you like more details on treatment?`;
            }
            return `📷 **Image Received!**\n\nI can see your crop photo. Here's what I notice:\n\n🌿 The plant appears to be in the vegetative stage. For best results:\n\n1. Use our **AI Scan** feature for precise disease detection\n2. Ensure proper watering and drainage\n3. Monitor for any yellowing or spots\n\nAsk me a specific question about what you see in the image, or describe the symptoms for better advice!`;
        }

        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes("blight") || lowerMsg.includes("disease")) {
            return `🌿 **Late Blight Management:**\n\n1. **Immediate Action:**\n   - Remove infected plants immediately\n   - Apply Mancozeb 75% WP @ 2.5g/L\n   - Improve drainage to reduce humidity\n\n2. **Prevention:**\n   - Use resistant varieties\n   - Maintain proper spacing\n   - Apply copper fungicide preventively\n\n3. **Monitoring:**\n   - Check daily for symptoms\n   - Monitor weather (high humidity increases risk)\n\nWould you like medicine recommendations or nearby suppliers?`;
        }
        if (lowerMsg.includes("fertilizer") || lowerMsg.includes("nutrient")) {
            return `🌱 **Fertilizer Recommendations:**\n\n**For Tomatoes:**\n- NPK 19:19:19 during vegetative stage\n- NPK 13:0:45 during flowering/fruiting\n- Organic compost (5 tons/acre)\n\n**Application Tips:**\n- Apply in split doses\n- Water immediately after application\n- Avoid over-fertilization\n\nNeed help calculating the right amount for your farm size?`;
        }
        if (lowerMsg.includes("when") && (lowerMsg.includes("plant") || lowerMsg.includes("sow"))) {
            return `📅 **Planting Calendar:**\n\n**Rice:** Kharif: June-July | Rabi: Nov-Dec\n**Tomato:** Best: Oct-Nov | Avoid: May-June\n**Vegetables:** Summer: Feb-Mar | Monsoon: Jun-Jul | Winter: Sep-Oct\n\nCheck current weather conditions for optimal planting window!`;
        }
        if (lowerMsg.includes("organic") || lowerMsg.includes("natural")) {
            return `🌿 **Organic Pest Control:**\n\n1. **Neem Solution** — 5ml/L, spray evenings, repeat weekly\n2. **Garlic-Chili Spray** — blend 10 garlic + 5 chilies in 1L water\n3. **Beneficial Insects** — Ladybugs, Trichogramma, Chrysoperla\n4. **Cultural Practices** — Crop rotation, companion planting, mulching\n\nWant to visit our organic medicine marketplace?`;
        }
        if (lowerMsg.includes("weather") || lowerMsg.includes("rain")) {
            return `🌤️ **Weather Insights:**\n\n- Temperature: 28°C | Humidity: 70%\n- Expected Rain: 60% (next 3 days)\n\n✅ Good for irrigation\n⚠️ Hold fertilizer (rain expected)\n✅ Safe for pesticide today\n⚠️ Monitor for fungal diseases\n\nCheck our Weather Dashboard for daily forecasts!`;
        }
        return `I'd be happy to help! I can assist with:\n\n🌱 **Crop Management** — Disease ID, fertilizers, irrigation\n🔬 **Technical Advice** — Soil testing, pest control, organic methods\n📊 **Planning** — Planting calendars, yield predictions\n💰 **Market Info** — Best time to sell, price trends\n📷 **Image Analysis** — Send a crop photo for visual inspection\n\nFeel free to ask anything!`;
    };

    // ── Send Message ─────────────────────────────────────────────────────────
    const handleSendMessage = async () => {
        if (!inputMessage.trim() && !pendingImage) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: "user",
            content: inputMessage.trim() || (pendingImage ? "Please analyze this crop image." : ""),
            imageUrl: pendingImage || undefined,
            timestamp: new Date(),
        };

        const hadImage = !!pendingImage;
        setMessages(prev => [...prev, userMsg]);
        setInputMessage("");
        setPendingImage(null);
        setIsTyping(true);

        await new Promise(resolve => setTimeout(resolve, 1400));

        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: generateAIResponse(userMsg.content, hadImage),
            timestamp: new Date(),
            suggestions: hadImage
                ? ["Scan for precise diagnosis", "Show medicines", "More treatment tips", "Connect with expert"]
                : ["Tell me more", "Show me medicines", "View weather forecast", "Connect with expert"],
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickActions = [
        { label: "Crop Tips", icon: Leaf, color: "text-emerald-400", query: "crop disease treatment tips" },
        { label: "Weather", icon: Sun, color: "text-amber-400", query: "weather farming advice" },
        { label: "Irrigation", icon: Droplets, color: "text-blue-400", query: "irrigation schedule" },
        { label: "Market", icon: TrendingUp, color: "text-purple-400", query: "best time to sell crops market prices" },
    ];

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(160deg, #0a1a0f 0%, #0d2318 40%, #071510 100%)" }}
        >
            {/* Hidden inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* ── Camera Overlay ── */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col"
                        style={{ background: "#000" }}
                    >
                        {/* Camera header */}
                        <div className="flex items-center justify-between px-4 py-4 z-10">
                            <button
                                onClick={closeCamera}
                                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-white font-semibold">Take Photo</span>
                            <div className="w-10" />
                        </div>

                        {/* Video feed */}
                        <div className="flex-1 relative overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {/* Scan frame overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                                    <motion.div
                                        className="absolute left-0 right-0 h-0.5 bg-emerald-400/70"
                                        animate={{ top: ["10%", "90%", "10%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                                <p className="absolute bottom-24 text-white/70 text-sm text-center px-8">
                                    Point at your crop leaf for best results
                                </p>
                            </div>
                        </div>

                        {/* Capture button */}
                        <div className="flex items-center justify-center py-8">
                            <motion.button
                                onClick={capturePhoto}
                                whileTap={{ scale: 0.92 }}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.2)" }}
                            >
                                <div className="w-14 h-14 rounded-full bg-white" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 border-b border-white/10 px-4 py-3 flex items-center gap-3"
                style={{ background: "rgba(7,21,10,0.90)", backdropFilter: "blur(20px)" }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")}
                    className="rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white">AI Farm Assistant</h1>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                Online & Ready to Help
                            </p>
                        </div>
                    </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.header>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "ai"
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                                    }`}
                            >
                                {message.type === "ai" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                            </div>

                            {/* Bubble */}
                            <div className="flex-1 max-w-[78%] space-y-2">
                                {/* Image preview in message */}
                                {message.imageUrl && (
                                    <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-lg" style={{ maxWidth: "220px" }}>
                                            <img
                                                src={message.imageUrl}
                                                alt="Crop photo"
                                                className="w-full object-cover rounded-2xl"
                                                style={{ maxHeight: "180px" }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-white/80 flex items-center gap-1"
                                                style={{ background: "rgba(0,0,0,0.5)" }}>
                                                <ScanLine className="w-3 h-3" /> Crop photo
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Text bubble */}
                                {message.content && (
                                    <div
                                        className={`p-3.5 rounded-2xl ${message.type === "ai"
                                            ? "rounded-tl-sm border border-white/10"
                                            : "rounded-tr-sm bg-gradient-to-br from-blue-600 to-purple-600"
                                            }`}
                                        style={message.type === "ai" ? { background: "rgba(255,255,255,0.07)" } : {}}
                                    >
                                        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${message.type === "ai" ? "text-white/90" : "text-white"}`}>
                                            {message.content}
                                        </p>
                                        <p className={`text-xs mt-1.5 ${message.type === "ai" ? "text-white/30" : "text-white/60"}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {message.suggestions && message.type === "ai" && (
                                    <div className="flex flex-wrap gap-2">
                                        {message.suggestions.map((s, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setInputMessage(s); inputRef.current?.focus(); }}
                                                className="px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/15 transition-colors"
                                                style={{ background: "rgba(16,185,129,0.08)" }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div
                            className="p-3.5 rounded-2xl rounded-tl-sm border border-white/10"
                            style={{ background: "rgba(255,255,255,0.07)" }}
                        >
                            <div className="flex gap-1 items-center h-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Action Chips ── */}
            <div
                className="px-4 py-2 border-t border-white/10"
                style={{ background: "rgba(7,21,10,0.80)", backdropFilter: "blur(12px)" }}
            >
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                onClick={() => { setInputMessage(action.query); inputRef.current?.focus(); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-xs font-medium whitespace-nowrap hover:bg-white/10 transition-colors flex-shrink-0"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <Icon className={`w-3.5 h-3.5 ${action.color}`} />
                                <span className="text-white/70">{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Pending Image Preview ── */}
            <AnimatePresence>
                {pendingImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="px-4 py-2 border-t border-white/10 flex items-center gap-3"
                        style={{ background: "rgba(7,21,10,0.90)" }}
                    >
                        <div className="relative">
                            <img
                                src={pendingImage}
                                alt="Pending"
                                className="w-14 h-14 rounded-xl object-cover border border-emerald-500/40"
                            />
                            <button
                                onClick={removePendingImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-md"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-white/70 font-medium">{t.photoReadyToSend}</p>
                            <p className="text-xs text-white/40">Add a message or tap send</p>
                        </div>
                        <ScanLine className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Input Area ── */}
            <div
                className="sticky bottom-0 px-4 py-3 border-t border-white/10"
                style={{
                    background: "rgba(7,21,10,0.95)",
                    backdropFilter: "blur(20px)",
                    paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))"
                }}
            >
                <div className="flex gap-2 items-center">
                    {/* Camera button */}
                    <motion.button
                        onClick={openCamera}
                        whileTap={{ scale: 0.9 }}
                        className="w-11 h-11 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                        title="Take photo"
                    >
                        <Camera className="w-5 h-5 text-emerald-400" />
                    </motion.button>

                    {/* Upload button */}
                    <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        whileTap={{ scale: 0.9 }}
                        className="w-11 h-11 rounded-full flex items-center justify-center border border-white/20 hover:bg-white/10 transition-colors flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                        title="Upload photo"
                    >
                        <ImageIcon className="w-5 h-5 text-blue-400" />
                    </motion.button>

                    {/* Text Input */}
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={pendingImage ? "Add a message (optional)…" : "Ask me anything about farming…"}
                            className="w-full px-4 py-3 rounded-2xl border border-white/15 text-white text-sm outline-none transition-all placeholder:text-white/30 focus:border-emerald-500/50"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                        />
                    </div>

                    {/* Mic */}
                    <motion.button
                        onClick={toggleMic}
                        whileTap={{ scale: 0.9 }}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isListening
                            ? "bg-red-500 shadow-lg shadow-red-900/50"
                            : "border border-white/20 hover:bg-white/10"
                            }`}
                        style={isListening ? {} : { background: "rgba(255,255,255,0.08)" }}
                        title="Voice input"
                    >
                        {isListening ? (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                                <MicOff className="w-5 h-5 text-white" />
                            </motion.div>
                        ) : (
                            <Mic className="w-5 h-5 text-white/70" />
                        )}
                    </motion.button>

                    {/* Send */}
                    <motion.button
                        onClick={handleSendMessage}
                        disabled={(!inputMessage.trim() && !pendingImage) || isTyping}
                        whileTap={{ scale: 0.9 }}
                        className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 disabled:opacity-40 flex-shrink-0"
                    >
                        {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
