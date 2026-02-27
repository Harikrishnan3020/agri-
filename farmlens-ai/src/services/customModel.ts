import type { DiagnosisResult } from "@/components/screens/ResultsCard";

/**
 * Calls a user-provided inference endpoint for crop disease detection.
 * Configure via env: VITE_MODEL_API_URL (required), VITE_MODEL_API_KEY (optional).
 * The endpoint is expected to accept multipart/form-data with field "image".
 * Response schema expected:
 * {
 *   disease: string;
 *   crop?: string;
 *   confidence?: number; // 0-100
 *   severity?: "low" | "medium" | "high";
 *   treatment?: string;
 *   preventiveMeasures?: string[];
 * }
 */
export const analyzeWithCustomModel = async (file: File): Promise<DiagnosisResult | null> => {
  const apiUrl = import.meta.env.VITE_MODEL_API_URL;
  if (!apiUrl) return null; // not configured

  const apiKey = import.meta.env.VITE_MODEL_API_KEY;

  const form = new FormData();
  form.append("image", file);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      body: form,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[CustomModel] HTTP error", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    // Normalize to DiagnosisResult with safe fallbacks
    const disease = data.disease || "Unknown";
    const confidence = Math.min(100, Math.max(0, Number(data.confidence ?? 70)));
    const severity = (data.severity as DiagnosisResult["severity"]) || "medium";
    const preventiveMeasures = Array.isArray(data.preventiveMeasures) && data.preventiveMeasures.length > 0
      ? data.preventiveMeasures
      : [
          "Remove heavily infected leaves",
          "Improve air circulation",
          "Avoid overhead irrigation"
        ];

    const result: DiagnosisResult = {
      disease,
      crop: data.crop || "Unknown Crop",
      confidence,
      severity,
      treatment: data.treatment || "Apply recommended fungicide as per label. Monitor for 7 days.",
      preventiveMeasures,
      videoUrl: data.videoUrl,
    };

    return result;
  } catch (err) {
    console.error("[CustomModel] Failed", err);
    return null;
  }
};
