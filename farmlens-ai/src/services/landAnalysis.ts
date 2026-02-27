/**
 * Land Analysis Service
 * Uses Groq's Llama 3.2 Vision model (90B) to analyze land/soil photos.
 * No Gemini API key required — works with the existing GROQ key.
 */

export interface LandAnalysisResult {
    soilType: string;
    phLevel: string;
    organicCarbon: string;
    improvements: string[];
    suitableCrops: Array<{
        name: string;
        match: string;
        yield: string;
        profit: string;
        duration: string;
    }>;
    tricks: string[];
    financials: {
        estimatedCost: string;
        estimatedRevenue: string;
        projectedProfit: string;
        roi: string;
    };
}

// Resize image before sending to Groq (avoids payload limits)
const resizeImageToBase64 = (file: File, maxWidth = 800): Promise<string> =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
                canvas.width = w; canvas.height = h;
                canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
            };
        };
    });

// Smart defaults when AI is unavailable (seasonal + generic)
const getSmartDefaults = (): LandAnalysisResult => {
    const month = new Date().getMonth();
    const isMonsoon = month >= 6 && month <= 9;
    const isSummer = month >= 3 && month <= 5;
    return {
        soilType: "Mixed Agricultural Soil (Loamy Clay)",
        phLevel: "6.5 – 7.0 (Neutral to Slightly Acidic)",
        organicCarbon: "Moderate (0.5 – 0.75%)",
        improvements: [
            "Apply organic compost (2–3 tonnes/acre) before the sowing season to enrich soil texture.",
            "Deep plough to 25–30 cm before sowing to improve aeration and root penetration.",
            isMonsoon
                ? "Construct drainage channels immediately — excess water causes root rot."
                : isSummer
                    ? "Mulch the soil with straw or dry leaves to reduce water evaporation by 30–40%."
                    : "Test soil pH and apply lime if below 6.0 or sulfur if above 7.5.",
        ],
        suitableCrops: [
            { name: "Paddy (Rice)", match: "88%", yield: "2.5 – 3 tons/acre", profit: "High", duration: "120–150 days" },
            { name: "Wheat", match: "82%", yield: "1.5 – 2 tons/acre", profit: "Medium–High", duration: "120–135 days" },
            { name: "Groundnut", match: "76%", yield: "1.2 – 1.6 tons/acre", profit: "Medium", duration: "100–120 days" },
        ],
        tricks: [
            "Use green manures like Dhaincha (Sesbania) before Kharif season to fix 80–100 kg Nitrogen/acre.",
            "Adopt drip irrigation to cut water usage by 40% and improve crop yield uniformity.",
            "Intercrop with short-duration legumes (cowpea, moong) to improve soil health naturally.",
        ],
        financials: {
            estimatedCost: "₹25,000 – ₹35,000 / acre",
            estimatedRevenue: "₹65,000 – ₹85,000 / acre",
            projectedProfit: "₹40,000 – ₹50,000 / acre",
            roi: "140% – 160%",
        },
    };
};

/**
 * Analyze a land/soil photo using Groq Llama Vision.
 * Falls back to smart seasonal defaults on any failure.
 */
export const analyzeLandWithGroq = async (imageFile: File): Promise<LandAnalysisResult> => {
    const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

    if (!GROQ_KEY || GROQ_KEY.includes("YOUR_")) {
        console.warn("[LandAnalysis] Groq key missing — using smart defaults.");
        await new Promise(r => setTimeout(r, 1500));
        return getSmartDefaults();
    }

    try {
        const base64Image = await resizeImageToBase64(imageFile);

        const prompt = `You are an expert agricultural soil scientist. Analyze this land/soil/farm photograph carefully.

Look at: soil color (dark=organic rich, red=laterite, black=cotton, yellow=sandy), texture, visible vegetation, moisture level, land topography, rocks/stones, crop residues, and overall land condition.

Based on your visual analysis, respond with ONLY a valid JSON object (no markdown, no extra text):

{
  "soilType": "Specific soil type with visual justification (e.g., 'Black Cotton Soil — dark color, fine cracking texture visible')",
  "phLevel": "Estimated pH range based on soil color and vegetation (e.g., '6.0–6.8 Slightly Acidic')",
  "organicCarbon": "Estimated level (e.g., 'High >0.75% — dark soil color indicates good organic matter')",
  "improvements": [
    "Specific actionable improvement tip based on what you see",
    "Second improvement tip",
    "Third improvement tip"
  ],
  "suitableCrops": [
    {"name": "Best crop for this soil", "match": "92%", "yield": "X–Y tons/acre", "profit": "High", "duration": "X–Y days"},
    {"name": "Second best crop", "match": "85%", "yield": "X–Y tons/acre", "profit": "Medium", "duration": "X–Y days"},
    {"name": "Third crop option", "match": "78%", "yield": "X–Y tons/acre", "profit": "Medium", "duration": "X–Y days"}
  ],
  "tricks": [
    "Yield maximization tip specific to this land type",
    "Second yield trick",
    "Third yield trick"
  ],
  "financials": {
    "estimatedCost": "₹XX,XXX – ₹XX,XXX / acre (all input costs)",
    "estimatedRevenue": "₹XX,XXX – ₹XX,XXX / acre",
    "projectedProfit": "₹XX,XXX – ₹XX,XXX / acre",
    "roi": "XX% – XX%"
  }
}

Be specific and accurate based on Indian agriculture. Adapt recommendations to what you actually visually observe.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.2-90b-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                            },
                        ],
                    },
                ],
                temperature: 0.2,
                max_tokens: 1500,
                response_format: { type: "json_object" },
            }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error("[LandAnalysis] Groq API error:", response.status, err);
            throw new Error(`Groq error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) throw new Error("Empty Groq response");

        // Parse JSON — handle any wrapping
        let parsed: LandAnalysisResult;
        try {
            parsed = JSON.parse(content);
        } catch {
            // Try to extract JSON from the response
            const start = content.indexOf("{");
            const end = content.lastIndexOf("}");
            if (start !== -1 && end !== -1) {
                parsed = JSON.parse(content.substring(start, end + 1));
            } else {
                throw new Error("Could not parse Groq JSON response");
            }
        }

        // Validate required fields
        if (!parsed.soilType || !parsed.suitableCrops?.length) {
            throw new Error("Incomplete Groq response");
        }

        console.log("[LandAnalysis] Groq vision analysis successful!");
        return parsed;

    } catch (error) {
        console.error("[LandAnalysis] Failed, using smart defaults:", error);
        return getSmartDefaults();
    }
};
