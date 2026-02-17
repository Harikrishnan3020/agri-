
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { searchYouTubeVideo } from "./youtube";
import { DiagnosisResult } from "@/components/screens/ResultsCard";

// Initialize the API with the key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeCropImage = async (imageFile: File): Promise<DiagnosisResult | null> => {
    // If no API key, return mock data
    if (!API_KEY || API_KEY.includes("YOUR_")) {
        console.warn("Gemini API Key is missing. Returning simulated data.");
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try to fetch a real video if YouTube API key is available
        const searchTerms = ["agricultural disease treatment", "crop pest control", "organic farming tips"];
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        let videoUrl = "https://www.youtube.com/embed/gE47Vd9gW1Y"; // Default fallback

        try {
            const foundVideo = await searchYouTubeVideo(randomTerm);
            if (foundVideo) {
                videoUrl = foundVideo;
            }
        } catch (e) {
            console.warn("Failed to fetch mock video", e);
        }

        return {
            disease: "Simulated Disease (Demo Mode)",
            confidence: 95,
            severity: "medium",
            treatment: "This is a simulated diagnosis because no API key was found. Please add a valid VITE_GEMINI_API_KEY to your .env file for real AI analysis.",
            preventiveMeasures: [
                "Add your API Key to .env",
                "Restart the development server",
                "Check documentation for setup"
            ],
            weather: {
                humidity: 60,
                temperature: 25,
                condition: "Simulated"
            },
            videoUrl: videoUrl
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert file to base64
        const base64Image = await fileToGenerativePart(imageFile);

        const prompt = `
      Analyze this image of a crop plant. Identify any diseases, pests, or deficiencies.
      If the plant looks healthy, state that.
      
      Provide the response in STRICT JSON format with the following structure:
      {
        "disease": "Name of the disease or 'Healthy'",
        "confidence": 0-100 (number),
        "severity": "low", "medium", or "high" (string),
        "treatment": "Detailed treatment recommendation (string)",
        "preventiveMeasures": ["Measure 1", "Measure 2", "Measure 3"] (array of strings),
        "videoQuery": "Search query for a YouTube video on treating this disease" (string)
      }

      Ensure the JSON is valid and does not contain markdown formatting like \`\`\`json.
    `;

        const result = await model.generateContent([prompt, base64Image]);
        const response = await result.response;
        const text = response.text();

        // Clean up the response if it contains markdown code blocks
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(cleanText);

        // Fetch video from YouTube API if a query is provided
        let videoUrl = "https://www.youtube.com/embed/gE47Vd9gW1Y"; // Default fallback (Sustainable Farming)

        if (data.videoQuery) {
            const foundVideo = await searchYouTubeVideo(data.videoQuery);
            if (foundVideo) {
                videoUrl = foundVideo;
            }
        }

        return {
            disease: data.disease,
            confidence: data.confidence,
            severity: data.severity,
            treatment: data.treatment,
            preventiveMeasures: data.preventiveMeasures,
            weather: { // Mock weather
                humidity: 65,
                temperature: 28,
                condition: "Sunny"
            },
            videoUrl: videoUrl
        };

    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw error;
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
