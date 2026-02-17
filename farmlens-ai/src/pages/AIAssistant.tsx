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
    Camera,
    Mic,
    Image as ImageIcon,
    Leaf,
    Sun,
    Droplets,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAppStore } from "@/store/useAppStore";

interface Message {
    id: string;
    type: "user" | "ai";
    content: string;
    timestamp: Date;
    suggestions?: string[];
}

const AIAssistant = () => {
    const navigate = useNavigate();
    const { user } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "ai",
            content: `Hello ${user?.name || "Farmer"}! 👋 I'm your AI farming assistant. I can help you with crop diseases, treatments, farming tips, weather advice, and much more. What would you like to know?`,
            timestamp: new Date(),
            suggestions: [
                "How to prevent late blight?",
                "Best fertilizer for tomatoes",
                "When to plant rice?",
                "Organic pest control methods",
            ],
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Simulated AI response generator
    const generateAIResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        // Disease-related queries
        if (lowerMsg.includes("blight") || lowerMsg.includes("disease")) {
            return `🌿 **Late Blight Management:**

1. **Immediate Action:**
   - Remove infected plants immediately
   - Apply Mancozeb 75% WP @ 2.5g/L
   - Improve drainage to reduce humidity

2. **Prevention:**
   - Use resistant varieties
   - Maintain proper spacing
   - Apply copper fungicide preventively

3. **Monitoring:**
   - Check daily for symptoms
   - Monitor weather (high humidity increases risk)
   - Keep field records

Would you like me to recommend specific medicines or show you nearby suppliers?`;
        }

        // Fertilizer queries
        if (lowerMsg.includes("fertilizer") || lowerMsg.includes("nutrient")) {
            return `🌱 **Fertilizer Recommendations:**

**For Tomatoes:**
- NPK 19:19:19 during vegetative stage
- NPK 13:0:45 during flowering/fruiting
- Organic compost (5 tons/acre)

**Application Tips:**
- Apply in split doses
- Water immediately after application
- Avoid over-fertilization

**Timing:**
- First dose: 15 days after transplant
- Second dose: 30 days after transplant
- Third dose: 45 days after transplant

Need help calculating the right amount for your farm size?`;
        }

        // Planting time queries
        if (lowerMsg.includes("when") && (lowerMsg.includes("plant") || lowerMsg.includes("sow"))) {
            return `📅 **Planting Calendar:**

**Rice:**
- Kharif: June-July
- Rabi: November-December
- Summer: January-February

**Tomato:**
- Best: October-November
- Avoid: May-June (too hot)

**Vegetables (General):**
- Summer crops: February-March
- Monsoon crops: June-July
- Winter crops: September-October

Check current weather conditions for optimal planting window!`;
        }

        // Organic queries
        if (lowerMsg.includes("organic") || lowerMsg.includes("natural")) {
            return `🌿 **Organic Pest Control Methods:**

1. **Neem Solution:**
   - Mix 5ml neem oil per liter
   - Spray evening time
   - Repeat weekly

2. **Garlic-Chili Spray:**
   - Blend 10 garlic cloves + 5 chilies
   - Mix with 1L water
   - Strain and spray

3. **Beneficial Insects:**
   - Ladybugs for aphids
   - Trichogramma for borers
   - Chrysoperla for various pests

4. **Cultural Practices:**
   - Crop rotation
   - Companion planting
   - Mulching

Want to visit our organic medicine marketplace?`;
        }

        // Weather queries
        if (lowerMsg.includes("weather") || lowerMsg.includes("rain") || lowerMsg.includes("temperature")) {
            return `🌤️ **Weather Insights for Farming:**

**Current Conditions:**
- Temperature: 28°C
- Humidity: 70%
- Expected Rain: 60% (next 3 days)

**Recommendations:**
- ✅ Good for irrigation
- ⚠️ Hold fertilizer application (rain expected)
- ✅ Safe for pesticide application today
- ⚠️ Monitor for fungal diseases due to humidity

Stay updated with our Weather Dashboard for daily forecasts!`;
        }

        // Default helpful response
        return `I'd be happy to help! I can assist with:

🌱 **Crop Management**
- Disease identification & treatment
- Fertilizer recommendations
- Irrigation scheduling

🔬 **Technical Advice**
- Soil testing interpretation
- Pest control strategies
- Organic farming methods

📊 **Planning & Analytics**
- Planting calendars
- Yield predictions
- Cost optimization

💰 **Market Info**
- Best time to sell
- Price trends
- Nearby buyers

Feel free to ask me anything specific about your crops!`;
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            type: "user",
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate AI thinking time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const aiResponse = generateAIResponse(inputMessage);
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content: aiResponse,
            timestamp: new Date(),
            suggestions: [
                "Tell me more",
                "Show me medicines",
                "View weather forecast",
                "Connect with expert",
            ],
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputMessage(suggestion);
        inputRef.current?.focus();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
            >
                <div className="px-4 py-4 flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center animate-pulse">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">AI Farm Assistant</h1>
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Online & Ready to Help
                                </p>
                            </div>
                        </div>
                    </div>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
            </motion.header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "ai"
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                                    }`}
                            >
                                {message.type === "ai" ? (
                                    <Bot className="w-6 h-6 text-white" />
                                ) : (
                                    <User className="w-6 h-6 text-white" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div className="flex-1 max-w-[75%]">
                                <GlassCard
                                    className={`p-4 ${message.type === "ai"
                                            ? "bg-white/90"
                                            : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                    <p
                                        className={`text-xs mt-2 ${message.type === "ai" ? "text-gray-400" : "text-white/70"
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </GlassCard>

                                {/* Quick Reply Suggestions */}
                                {message.suggestions && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium hover:bg-emerald-50 transition-colors"
                                            >
                                                {suggestion}
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <GlassCard className="p-4 bg-white/90">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                                <span
                                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></span>
                                <span
                                    className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></span>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border-t border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                        <Leaf className="w-4 h-4 text-green-600" />
                        Crop Tips
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                        <Sun className="w-4 h-4 text-amber-600" />
                        Weather
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        Irrigation
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        Market
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="flex gap-2 items-end">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Camera className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything about farming..."
                            className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm"
                        />
                    </div>

                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Mic className="w-5 h-5 text-gray-600" />
                    </button>

                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="p-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg disabled:opacity-50"
                    >
                        {isTyping ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
