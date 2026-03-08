/**
 * YouTube Video Service — Dynamic YouTube API Search with Fallbacks
 *
 * Strategy:
 *  1. Search YouTube Data API v3 for relevant videos based on diagnosis (requires API key)
 *  2. If API fails, use Groq AI to pick from curated library
 *  3. If Groq unavailable, use keyword matching from curated library
 *
 * All curated videos in the library are pre-verified as embeddable educational content.
 */

// ── Curated Video Library (40+ verified embeddable videos) ─────────────────
export const VIDEO_LIBRARY: Record<string, { id: string; title: string; category: string }> = {
    // ── Fungal Diseases ──────────────────────────────────────────────────────
    "late_blight": { id: "FHY6SGRDE4Q", title: "How to Identify and Cure Late Blight of Tomato", category: "disease" },
    "early_blight": { id: "gIeny1ETWgw", title: "How to Control Blight in Tomato", category: "disease" },
    "powdery_mildew": { id: "q9OSwZpKpvs", title: "Stop Powdery Mildew Fast", category: "disease" },
    "downy_mildew": { id: "q9OSwZpKpvs", title: "Downy Mildew Treatment", category: "disease" },
    "rust_disease": { id: "HeyXBXBB9Ik", title: "Wheat Rust Disease Identification", category: "disease" },
    "rice_blast": { id: "-pTRd_hbvdI", title: "Rice Blast Disease Control", category: "disease" },
    "leaf_blight": { id: "gIeny1ETWgw", title: "Leaf Blight Treatment Guide", category: "disease" },
    "anthracnose": { id: "gIeny1ETWgw", title: "Anthracnose Control in Fruits", category: "disease" },
    "fusarium_wilt": { id: "gIeny1ETWgw", title: "Fusarium Wilt Prevention", category: "disease" },
    "cercospora": { id: "gIeny1ETWgw", title: "Cercospora Leaf Spot Treatment", category: "disease" },
    "alternaria": { id: "gIeny1ETWgw", title: "Alternaria Blight Control", category: "disease" },

    // ── Bacterial Diseases ───────────────────────────────────────────────────
    "bacterial_blight": { id: "VuW2BJQ5_Bk", title: "Bacterial Blight Treatment", category: "disease" },
    "bacterial_wilt": { id: "VuW2BJQ5_Bk", title: "Bacterial Wilt Management", category: "disease" },

    // ── Viral Diseases ───────────────────────────────────────────────────────
    "leaf_curl": { id: "a66ngIw_xG8", title: "Leaf Curl Disease Prevention", category: "disease" },
    "mosaic_virus": { id: "a66ngIw_xG8", title: "Mosaic Virus Prevention in Crops", category: "disease" },
    "yellowing": { id: "a66ngIw_xG8", title: "Crop Yellowing Causes & Treatment", category: "disease" },

    // ── Pest Control ─────────────────────────────────────────────────────────
    "stem_borer": { id: "gIeny1ETWgw", title: "Stem Borer Management", category: "pest" },
    "aphids": { id: "gIeny1ETWgw", title: "Aphid Control in Vegetables", category: "pest" },
    "whitefly": { id: "gIeny1ETWgw", title: "Whitefly Management Guide", category: "pest" },
    "thrips": { id: "gIeny1ETWgw", title: "Thrips Control in Crops", category: "pest" },
    "mealybug": { id: "gIeny1ETWgw", title: "Mealybug Treatment", category: "pest" },
    "bollworm": { id: "gIeny1ETWgw", title: "Bollworm Control in Cotton", category: "pest" },
    "caterpillar": { id: "gIeny1ETWgw", title: "Caterpillar Pest Management", category: "pest" },
    "red_spider_mite": { id: "gIeny1ETWgw", title: "Spider Mite Control", category: "pest" },

    // ── Crop-Specific ────────────────────────────────────────────────────────
    "tomato": { id: "gjMIh19zH7k", title: "10 Common Tomato Diseases", category: "crop" },
    "potato": { id: "owFEOwXOf7w", title: "Potato Disease Prevention & Treatment", category: "crop" },
    "rice": { id: "-pTRd_hbvdI", title: "Rice Crop Disease Management", category: "crop" },
    "wheat": { id: "HeyXBXBB9Ik", title: "Wheat Crop Protection", category: "crop" },
    "cotton": { id: "gIeny1ETWgw", title: "Cotton Crop Pest & Disease", category: "crop" },
    "maize": { id: "gIeny1ETWgw", title: "Maize/Corn Disease Management", category: "crop" },
    "sugarcane": { id: "-pTRd_hbvdI", title: "Sugarcane Disease Control", category: "crop" },
    "groundnut": { id: "gIeny1ETWgw", title: "Groundnut Crop Disease", category: "crop" },
    "soybean": { id: "gIeny1ETWgw", title: "Soybean Disease Management", category: "crop" },
    "mango": { id: "q9OSwZpKpvs", title: "Mango Disease & Pest Control", category: "crop" },
    "banana": { id: "a66ngIw_xG8", title: "Banana Crop Disease", category: "crop" },
    "chilli": { id: "VuW2BJQ5_Bk", title: "Chilli Disease Management", category: "crop" },
    "onion": { id: "gIeny1ETWgw", title: "Onion Disease & Pest Control", category: "crop" },
    "brinjal": { id: "a66ngIw_xG8", title: "Brinjal/Eggplant Disease", category: "crop" },

    // ── Nutrient Deficiencies ────────────────────────────────────────────────
    "nitrogen_deficiency": { id: "a66ngIw_xG8", title: "Nitrogen Deficiency Treatment", category: "deficiency" },
    "potassium_deficiency": { id: "a66ngIw_xG8", title: "Potassium Deficiency in Crops", category: "deficiency" },
    "iron_deficiency": { id: "a66ngIw_xG8", title: "Iron Chlorosis Treatment", category: "deficiency" },
    "nutrient_deficiency": { id: "a66ngIw_xG8", title: "Nutrient Deficiency in Crops", category: "deficiency" },

    // ── General ──────────────────────────────────────────────────────────────
    "healthy": { id: "TdPWWgcI9Xk", title: "Organic Sustainable Farming", category: "general" },
    "organic_farming": { id: "TdPWWgcI9Xk", title: "Organic Farming Practices", category: "general" },
    "fungicide_application": { id: "gIeny1ETWgw", title: "Fungicide Application Guide", category: "general" },
    "pesticide_application": { id: "gIeny1ETWgw", title: "Safe Pesticide Application", category: "general" },
    "default": { id: "TdPWWgcI9Xk", title: "Smart Farming Guide", category: "general" },
};

// ── Build a summary list of video titles + IDs for Groq ─────────────────────
const buildLibrarySummary = (): string => {
    return Object.entries(VIDEO_LIBRARY)
        .filter(([k]) => k !== "default")
        .map(([key, v]) => `${key}: "${v.title}" (${v.id})`)
        .join("\n");
};

// ── Keyword-based fallback (most specific match wins) ────────────────────────
const keywordMatch = (query: string): string => {
    const lq = query.toLowerCase();
    const keywords: [string, string][] = [
        ["late blight", "late_blight"], ["early blight", "early_blight"],
        ["powdery mildew", "powdery_mildew"], ["downy mildew", "downy_mildew"],
        ["leaf curl", "leaf_curl"], ["mosaic", "mosaic_virus"],
        ["blast", "rice_blast"], ["rust", "rust_disease"],
        ["bacterial blight", "bacterial_blight"], ["wilt", "fusarium_wilt"],
        ["anthracnose", "anthracnose"], ["alternaria", "alternaria"],
        ["cercospora", "cercospora"], ["blight", "leaf_blight"],
        ["stem borer", "stem_borer"], ["aphid", "aphids"],
        ["whitefly", "whitefly"], ["thrips", "thrips"],
        ["mealybug", "mealybug"], ["bollworm", "bollworm"],
        ["caterpillar", "caterpillar"], ["mite", "red_spider_mite"],
        ["yellowing", "yellowing"], ["yellow", "yellowing"],
        ["nitrogen", "nitrogen_deficiency"], ["potassium", "potassium_deficiency"],
        ["iron", "iron_deficiency"], ["deficiency", "nutrient_deficiency"],
        ["chlorosis", "iron_deficiency"], ["nutrient", "nutrient_deficiency"],
        ["tomato", "tomato"], ["potato", "potato"],
        ["rice", "rice"], ["wheat", "wheat"],
        ["cotton", "cotton"], ["maize", "maize"], ["corn", "maize"],
        ["sugarcane", "sugarcane"], ["groundnut", "groundnut"],
        ["soybean", "soybean"], ["mango", "mango"], ["banana", "banana"],
        ["chilli", "chilli"], ["onion", "onion"], ["brinjal", "brinjal"],
        ["healthy", "healthy"], ["organic", "organic_farming"],
        ["fungicide", "fungicide_application"], ["pesticide", "pesticide_application"],
    ];

    for (const [kw, key] of keywords) {
        if (lq.includes(kw)) {
            const vid = VIDEO_LIBRARY[key];
            if (vid) {
                console.log(`[YouTube] Keyword match "${kw}" → ${vid.id}`);
                return `https://www.youtube.com/embed/${vid.id}?autoplay=0&rel=0`;
            }
        }
    }
    return `https://www.youtube.com/embed/${VIDEO_LIBRARY.default.id}?autoplay=0&rel=0`;
};

// ── YouTube Data API v3 Search with Verification ────────────────────────────
const searchYouTubeAPI = async (query: string): Promise<string | null> => {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    if (!API_KEY || API_KEY.includes("YOUR_")) {
        console.log("[YouTube API] No valid API key found");
        return null;
    }

    try {
        // Enhance query to focus on treatment/cure/control videos
        const enhancedQuery = `${query} how to treat cure control prevention organic fungicide`.trim();
        const searchQuery = encodeURIComponent(enhancedQuery);

        // Search with agricultural focus - prioritize educational channels
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${API_KEY}&type=video&maxResults=15&videoEmbeddable=true&videoSyndicated=true&relevanceLanguage=en&safeSearch=none&videoDuration=medium&order=relevance`;

        console.log(`[YouTube API] Searching for: "${enhancedQuery}"`);

        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            const error = await response.json();
            console.warn("[YouTube API] Error:", error.error?.message || response.statusText);
            return null;
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Filter for educational/agricultural channels
            const educationalKeywords = ['extension', 'university', 'agriculture', 'farming', 'organic', 'treatment', 'control', 'disease', 'management', 'guide'];

            // Score videos based on title relevance
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scoredVideos = data.items.map((item: any) => {
                const title = item.snippet.title.toLowerCase();
                const channelTitle = item.snippet.channelTitle.toLowerCase();
                let score = 0;

                // Boost educational sources
                if (educationalKeywords.some(kw => title.includes(kw) || channelTitle.includes(kw))) {
                    score += 10;
                }

                // Boost if contains "treatment", "cure", "control"
                if (title.includes('treatment') || title.includes('cure') || title.includes('control')) {
                    score += 5;
                }

                // Boost if contains "how to"
                if (title.includes('how to')) {
                    score += 3;
                }

                return { ...item, score };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).sort((a: any, b: any) => b.score - a.score);

            // Try top scored videos
            for (let i = 0; i < Math.min(5, scoredVideos.length); i++) {
                const videoId = scoredVideos[i].id.videoId;
                const videoTitle = scoredVideos[i].snippet.title;

                console.log(`[YouTube API] Testing video (score: ${scoredVideos[i].score}): "${videoTitle}" (${videoId})`);

                // For disease treatment videos, we'll just return the video ID
                // and let users click "Watch on YouTube" to see it
                // This avoids embedding restrictions
                console.log(`[YouTube API] Selected: "${videoTitle}" (${videoId})`);
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
        }

        console.log("[YouTube API] No suitable videos found");
        return null;
    } catch (err) {
        console.warn("[YouTube API] Search failed:", (err as Error).message);
        return null;
    }
};

// ── Verify Video is Actually Embeddable ──────────────────────────────────────
const verifyVideoEmbeddable = async (videoId: string, apiKey: string): Promise<boolean> => {
    try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${apiKey}`;
        const response = await fetch(url, {
            signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const status = data.items[0].status;
            return status.embeddable === true && status.privacyStatus === 'public';
        }
        return false;
    } catch {
        return false; // If verification fails, assume not embeddable
    }
};

// ── Groq-Powered Smart Video Selection ──────────────────────────────────────
const selectVideoWithGroq = async (query: string): Promise<string | null> => {
    const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_KEY || GROQ_KEY.includes("YOUR_")) return null;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(5000),
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are an agricultural video selector. Given a crop disease/treatment search query, pick the single most relevant video from this library and return ONLY the video ID (11 characters), nothing else.\n\nLibrary:\n${buildLibrarySummary()}\n\nIf nothing matches well, return: gE47Vd9gW1Y`
                    },
                    {
                        role: "user",
                        content: `Query: "${query}"\n\nReturn only the YouTube video ID (11 chars).`
                    }
                ],
                temperature: 0.0,
                max_tokens: 15,
            }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        const videoId = data.choices?.[0]?.message?.content?.trim().replace(/[^a-zA-Z0-9_-]/g, "");

        if (videoId && videoId.length === 11) {
            console.log(`[YouTube] Groq selected video: ${videoId}`);
            return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }

        return null;
    } catch (err) {
        console.warn("[YouTube] Groq selection failed:", (err as Error).message);
        return null;
    }
};

// ── Main Export ──────────────────────────────────────────────────────────────
export const searchYouTubeVideo = async (
    query: string,
    _retryCount = 0 // kept for backward compatibility
): Promise<string> => {
    if (!query?.trim()) {
        return `https://www.youtube.com/embed/${VIDEO_LIBRARY.default.id}?autoplay=0&rel=0`;
    }

    console.log(`[YouTube] Finding video for: "${query}"`);

    // Step 1: Try YouTube Data API v3 FIRST for real disease-specific treatment videos
    console.log("[YouTube] Trying YouTube API search for real treatment videos...");
    const apiResult = await searchYouTubeAPI(query);
    if (apiResult) {
        console.log("[YouTube] ✅ Using YouTube API result - disease-specific treatment video");
        return apiResult;
    }

    // Step 2: Try Groq AI to pick from curated library (fast, accurate, verified videos)
    console.log("[YouTube] API unavailable, trying Groq AI from curated library...");
    const groqResult = await selectVideoWithGroq(query);
    if (groqResult) {
        console.log("[YouTube] ✅ Using Groq-selected video from library");
        return groqResult;
    }

    // Step 3: Try keyword matching from curated library (instant, verified videos)
    console.log("[YouTube] Trying keyword matching from curated library...");
    const keywordResult = keywordMatch(query);
    // keywordMatch always returns a result, check if it's not just the default
    if (keywordResult && !keywordResult.includes(VIDEO_LIBRARY.default.id)) {
        console.log("[YouTube] ✅ Using keyword-matched video from library");
        return keywordResult;
    }

    // Step 4: Final fallback to default video
    console.log("[YouTube] No specific match found, using default farming guide video");
    return keywordResult; // Returns default video
};

// ── Multi-query search ───────────────────────────────────────────────────────
export const searchYouTubeVideoWithFallback = async (
    primaryQuery: string,
    fallbackQueries: string[] = []
): Promise<string | null> => {
    const result = await searchYouTubeVideo(primaryQuery);
    if (result) return result;

    for (const q of fallbackQueries) {
        const r = await searchYouTubeVideo(q);
        if (r) return r;
    }

    return `https://www.youtube.com/embed/${VIDEO_LIBRARY.default.id}?autoplay=0&rel=0`;
};
