
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { searchYouTubeVideo } from "./youtube";
import { DiagnosisResult } from "@/components/screens/ResultsCard";

// Initialize the API with the key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_YOUTUBE_API_KEY;

// Get real-time weather conditions (using Open-Meteo free API - no key needed)
const fetchRealWeather = async (): Promise<{ humidity: number; temperature: number; condition: string }> => {
    try {
        // Try to get location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            } else {
                reject(new Error("Geolocation not supported"));
            }
        });

        const { latitude, longitude } = position.coords;

        // Use Open-Meteo free weather API (no API key needed)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`,
            { signal: AbortSignal.timeout(8000) }
        );

        if (!response.ok) throw new Error("Weather API failed");

        const data = await response.json();
        const current = data.current;

        // Map weather code to condition
        const weatherCode = current.weather_code;
        let condition = "Sunny";
        if (weatherCode >= 0 && weatherCode <= 3) condition = weatherCode === 0 ? "Clear Sky" : "Partly Cloudy";
        else if (weatherCode >= 45 && weatherCode <= 48) condition = "Foggy";
        else if (weatherCode >= 51 && weatherCode <= 67) condition = "Rainy";
        else if (weatherCode >= 71 && weatherCode <= 77) condition = "Snowy";
        else if (weatherCode >= 80 && weatherCode <= 99) condition = "Heavy Rain / Storm";

        return {
            humidity: Math.round(current.relative_humidity_2m),
            temperature: Math.round(current.temperature_2m),
            condition,
        };
    } catch (error) {
        // Fallback to seasonal defaults based on current date
        const month = new Date().getMonth();
        const isMonsoon = month >= 6 && month <= 9;
        const isSummer = month >= 3 && month <= 5;
        return {
            humidity: isMonsoon ? 85 : isSummer ? 40 : 60,
            temperature: isMonsoon ? 28 : isSummer ? 35 : 24,
            condition: isMonsoon ? "Rainy" : isSummer ? "Sunny" : "Partly Cloudy",
        };
    }
};

export const analyzeCropImage = async (imageFile: File): Promise<DiagnosisResult | null> => {
    // If no API key, return mock data
    if (!API_KEY || API_KEY.length < 10) {
        console.warn("Gemini API Key is missing. Returning simulated data.");
        await new Promise(resolve => setTimeout(resolve, 2000));

        const weather = await fetchRealWeather();

        return {
            disease: "Simulated Disease (Demo Mode)",
            confidence: 95,
            severity: "medium",
            treatment: "This is a simulated diagnosis. Please add a valid VITE_GEMINI_API_KEY to your .env file for real AI analysis.",
            preventiveMeasures: [
                "Add your API Key to .env",
                "Restart the development server",
                "Check documentation for setup"
            ],
            weather,
            videoUrl: "https://www.youtube.com/embed/gE47Vd9gW1Y"
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64
        const base64Image = await fileToGenerativePart(imageFile);

        const prompt = `
You are an expert agricultural AI system. Analyze this crop plant image to identify diseases, pests, nutrient deficiencies, or any health issues.

CRITICAL: Be VERY CAREFUL when identifying healthy plants. If the plant looks GREEN, VIBRANT, and has NO VISIBLE SPOTS, WILTING, or DISCOLORATION, it is likely HEALTHY.

Provide the response in STRICT JSON format with this exact structure:
{
  "disease": "Precise name of the disease/condition (e.g., 'Tomato Late Blight', 'Rice Blast', 'Wheat Yellow Rust') or 'Healthy Plant' if no disease detected",
  "crop": "Identified crop type (e.g., 'Tomato', 'Rice', 'Wheat', 'Cotton')",
  "confidence": 85,
  "severity": "low",
  "treatment": "Detailed, practical treatment steps. Include: 1) Immediate action, 2) Specific chemical/organic treatment with product names and dosage, 3) Application method. If healthy, say 'No treatment needed - continue regular care'",
  "preventiveMeasures": [
    "Specific preventive measure 1",
    "Specific preventive measure 2",
    "Specific preventive measure 3",
    "Specific preventive measure 4"
  ],
  "videoQuery": "Specific YouTube search query for this disease treatment (e.g., 'tomato late blight treatment fungicide'). If healthy, use 'organic farming best practices'",
  "soilDeficiencySymptoms": ["List any visible nutrient deficiency symptoms like yellowing, purple tint, brown edges, stunted growth, etc."]
}

Rules:
- ONLY diagnose a disease if you see CLEAR SIGNS: spots, wilting, discoloration, pests, mold, rot
- ALSO CHECK for nutrient deficiency symptoms: yellowing (nitrogen), purple tint (phosphorus), brown edges (potassium), interveinal chlorosis (iron/magnesium)
- IF the plant looks GREEN and HEALTHY with NO VISIBLE PROBLEMS, return "Healthy Plant" and empty soilDeficiencySymptoms
- severity must be exactly "low", "medium", or "high"
- confidence is 0-100 number
- Be specific about the disease name - do not be vague
- Treatment must include actual medicine/fungicide names farmers can buy
- If healthy, set disease to "Healthy Plant", severity to "low" and confidence to 90+
- Do NOT diagnose diseases on perfectly healthy-looking plants
- Do NOT include markdown code blocks (no \`\`\`json)
- Return ONLY the JSON object
`;

        const result = await model.generateContent([prompt, base64Image]);
        const response = await result.response;
        const text = response.text();

        // Clean up the response
        const cleanJson = (str: string) => {
            const match = str.match(/```json?\s*([\s\S]*?)\s*```/);
            return match ? match[1].trim() : str.trim();
        };

        let data;
        try {
            data = JSON.parse(cleanJson(text));
        } catch (e) {
            console.warn("Gemini JSON parse failed, trying fallback...", e);
            const startIndex = text.indexOf('{');
            const endIndex = text.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                data = JSON.parse(text.substring(startIndex, endIndex + 1));
            } else {
                throw new Error("Invalid AI response format");
            }
        }

        // Fetch real weather in parallel with video search
        const [videoUrl, weather] = await Promise.all([
            (async () => {
                if (data.videoQuery) {
                    const searchQuery = `${data.videoQuery} treatment how to cure`;
                    const found = await searchYouTubeVideo(searchQuery);
                    if (found) return found;
                }
                // Fallback: search by disease name
                if (data.disease && !data.disease.includes("Healthy")) {
                    const found = await searchYouTubeVideo(`${data.disease} agricultural treatment`);
                    if (found) return found;
                }
                return "https://www.youtube.com/embed/gE47Vd9gW1Y";
            })(),
            fetchRealWeather(),
        ]);

        return {
            disease: data.disease || "Unknown Disease",
            crop: data.crop,
            confidence: Math.max(0, Math.min(100, data.confidence || 80)),
            severity: (["low", "medium", "high"].includes(data.severity) ? data.severity : "medium") as "low" | "medium" | "high",
            treatment: data.treatment || "Consult a local agricultural expert.",
            preventiveMeasures: Array.isArray(data.preventiveMeasures) ? data.preventiveMeasures : ["Follow good agricultural practices"],
            weather,
            videoUrl,
            soilDeficiencySymptoms: Array.isArray(data.soilDeficiencySymptoms) ? data.soilDeficiencySymptoms : [],
        };

    } catch (error) {
        // Return null so the caller (Index.tsx) can fall through to Groq
        console.warn("[Gemini] Analysis failed, will fall back to Groq:", (error as Error).message);
        return null;
    }
};

export const analyzeLandImage = async (imageFile: File): Promise<{
    soilType: string;
    phLevel: string;
    organicCarbon: string;
    improvements: string[];
    suitableCrops: Array<{ name: string; match: string; yield: string; profit: string; duration: string }>;
    tricks: string[];
    financials: { estimatedCost: string; estimatedRevenue: string; projectedProfit: string; roi: string };
} | null> => {
    if (!API_KEY || API_KEY.length < 10) return null;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const base64Image = await fileToGenerativePart(imageFile);

    const prompt = `Analyze this land/soil/farm photo and provide agricultural analysis in JSON format:
{
  "soilType": "soil type description",
  "phLevel": "estimated pH range",
  "organicCarbon": "organic carbon level",
  "improvements": ["tip 1", "tip 2", "tip 3"],
  "suitableCrops": [
    {"name": "crop name", "match": "XX%", "yield": "X tons/acre", "profit": "High/Medium/Low", "duration": "X days"},
    {"name": "crop name", "match": "XX%", "yield": "X tons/acre", "profit": "High/Medium/Low", "duration": "X days"},
    {"name": "crop name", "match": "XX%", "yield": "X tons/acre", "profit": "High/Medium/Low", "duration": "X days"}
  ],
  "tricks": ["trick 1", "trick 2", "trick 3"],
  "financials": {
    "estimatedCost": "₹XX,XXX / acre",
    "estimatedRevenue": "₹XX,XXX / acre",
    "projectedProfit": "₹XX,XXX / acre",
    "roi": "XX%"
  }
}
Return only JSON, no markdown.`;

    const result = await model.generateContent([prompt, base64Image]);
    const text = result.response.text();
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
        return JSON.parse(text.substring(startIdx, endIdx + 1));
    }
    return null;
};

export const verifyProductImage = async (imageFile: File, productName: string): Promise<{
    verified: boolean;
    confidence: number;
    reasoning: string;
}> => {
    if (!API_KEY || API_KEY.length < 10) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { verified: true, confidence: 88, reasoning: "Simulated verification." };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Image = await fileToGenerativePart(imageFile);

        const prompt = `Analyze this image. The user claims this is a "${productName}".
Does the image contain the claimed product?
Respond in JSON: {"verified": true/false, "confidence": 0-100, "reasoning": "explanation"}
No markdown formatting.`;

        const result = await model.generateContent([prompt, base64Image]);
        const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
        const data = JSON.parse(text.substring(startIdx, endIdx + 1));
        return { verified: data.verified, confidence: data.confidence, reasoning: data.reasoning };

    } catch (error) {
        console.error("Error verifying image:", error);
        return { verified: false, confidence: 0, reasoning: "Verification failed due to technical error." };
    }
};

async function fileToGenerativePart(file: File): Promise<Part> {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    } as Part;
}
