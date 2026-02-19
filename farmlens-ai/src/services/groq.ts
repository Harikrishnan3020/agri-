import { searchYouTubeVideo } from "./youtube";
import { DiagnosisResult } from "@/components/screens/ResultsCard";

export const analyzeCropImage = async (imageFile: File): Promise<DiagnosisResult | null> => {
    // Get API key from env
    const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

    if (!API_KEY || API_KEY.includes("YOUR_")) {
        console.warn("Groq API Key is missing.");
        return null;
    }

    console.log("Initializing Groq analysis with model: meta-llama/llama-4-maverick-17b-128e-instruct");

    try {
        // Convert file to base64
        const base64Image = await fileToBase64(imageFile);

        const prompt = `
      Analyze this image of a crop plant focused on agricultural diagnostics.
      Identify any diseases, pests, deficiencies, or physical damage.
      If the plant looks healthy, explicitly state "Healthy".

      Provide the response in raw JSON format without markdown code blocks.
      Structure:
      {
        "disease": "Name of the disease (or 'Healthy Crop')",
        "crop": "Name of the crop plant (e.g. Rice, Tomato, Wheat, Potato)",
        "confidence": 0-100 (number),
        "severity": "low", "medium", or "high" (string),
        "treatment": "Detailed organic and chemical treatment recommendation steps.",
        "preventiveMeasures": ["Measure 1", "Measure 2", "Measure 3"] (array of strings),
        "videoQuery": "Search query for YouTube: Treating [disease name] in [crop name]"
      }
    `;

        const payload = {
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
                    ]
                }
            ],
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,

            stream: false
            // response_format: { type: "json_object" } // Removing strict JSON mode to avoid compatibility issues with Vision
        };

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMsg = `Groq API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                console.error("Groq API Error Data:", errorData);
                if (errorData.error && errorData.error.message) {
                    errorMsg += ` - ${errorData.error.message}`;
                }
            } catch (e) {
                // Ignore json parse error
            }
            throw new Error(errorMsg);
        }

        const dataResponse = await response.json();
        const content = dataResponse.choices[0]?.message?.content;

        if (!content) return null;

        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse JSON response:", content);
            return null;
        }

        // Fetch video from YouTube API if a query is provided
        let videoUrl = "https://www.youtube.com/embed/gE47Vd9gW1Y"; // Default fallback

        if (data.videoQuery) {
            const foundVideo = await searchYouTubeVideo(data.videoQuery);
            if (foundVideo) {
                videoUrl = foundVideo;
            }
        }

        return {
            disease: data.disease || "Unknown",
            crop: data.crop || "Unknown Crop",
            confidence: data.confidence || 0,
            severity: (data.severity as "low" | "medium" | "high") || "low",
            treatment: data.treatment || "No treatment suggestions available.",
            preventiveMeasures: data.preventiveMeasures || [],
            weather: { // Mock weather based on typical planting conditions
                humidity: 70,
                temperature: 28,
                condition: "Sunny"
            },
            videoUrl: videoUrl
        };

    } catch (error) {
        console.error("Error analyzing image with Groq:", error);
        throw error;
    }
};

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = error => reject(error);
    });
}
