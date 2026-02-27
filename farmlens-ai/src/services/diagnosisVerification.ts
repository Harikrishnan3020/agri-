/**
 * Multi-Source Diagnosis Verification System
 * 
 * Uses multiple AI models and validation rules to ensure accurate diagnoses
 * before presenting results to farmers.
 */

import { DiagnosisResult } from "@/components/screens/ResultsCard";
import { analyzeCropImage as analyzeWithGemini } from "./gemini";
import { analyzeCropImage as analyzeWithGroq } from "./groq";
import { validateWithResearch, getResearchBasedTreatment, analyzeSoilDeficiency } from "./agricultureResearch";

interface VerificationResult {
  finalDiagnosis: DiagnosisResult;
  confidence: number;
  consensusLevel: "high" | "medium" | "low" | "conflict";
  models: {
    gemini?: DiagnosisResult | null;
    groq?: DiagnosisResult | null;
  };
  warnings: string[];
}

/**
 * Normalize disease names for comparison
 * "Late Blight", "late blight", "Potato Late Blight" should all match
 */
const normalizeDiseaseName = (disease: string): string => {
  return disease
    .toLowerCase()
    .replace(/healthy plant/gi, "healthy")
    .replace(/no disease/gi, "healthy")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Check if two disease names are similar
 */
const areDiseasesSimilar = (disease1: string, disease2: string): boolean => {
  const norm1 = normalizeDiseaseName(disease1);
  const norm2 = normalizeDiseaseName(disease2);

  // Exact match
  if (norm1 === norm2) return true;

  // Check if one contains the other (e.g., "blight" in "late blight")
  const words1 = norm1.split(" ");
  const words2 = norm2.split(" ");
  
  // If they share 2+ significant words, consider them similar
  const sharedWords = words1.filter(w => 
    w.length > 3 && words2.includes(w)
  );
  
  return sharedWords.length >= 2;
};

/**
 * Validate visual symptoms match the diagnosis
 * This should prioritize VISUAL analysis over weather conditions
 */
const validateVisualSymptoms = (result: DiagnosisResult, warnings: string[]): void => {
  const disease = result.disease.toLowerCase();
  
  // If diagnosing disease on harvested produce (not leaves/plants)
  if (disease.includes("blight") || disease.includes("mildew") || disease.includes("rot")) {
    warnings.push(
      "⚠️ Disease detected on harvested produce. Verify by inspecting for actual spots, rot, or discoloration - not just weather conditions."
    );
  }

  // If confidence is very high but disease is serious, add warning
  if (result.confidence > 90 && !disease.includes("healthy")) {
    warnings.push(
      "ℹ️ High confidence disease detection. Please verify by checking for visible symptoms: spots, wilting, discoloration, or mold."
    );
  }
};

/**
 * Analyze crop image using multiple AI models and verify consensus
 */
export const verifyDiagnosis = async (imageFile: File): Promise<VerificationResult> => {
  console.log("[Verification] Starting multi-model analysis...");
  
  const warnings: string[] = [];
  
  // Run both AI models in parallel
  const [geminiResult, groqResult] = await Promise.allSettled([
    analyzeWithGemini(imageFile),
    analyzeWithGroq(imageFile),
  ]);

  const gemini = geminiResult.status === "fulfilled" ? geminiResult.value : null;
  const groq = groqResult.status === "fulfilled" ? groqResult.value : null;

  console.log("[Verification] Gemini result:", gemini?.disease, gemini?.confidence);
  console.log("[Verification] Groq result:", groq?.disease, groq?.confidence);

  const adjustConfidence = (
    confidence: number,
    consensusLevel: "high" | "medium" | "low" | "conflict",
    warningList: string[]
  ) => {
    let adjusted = confidence;

    if (confidence < 60) {
      warningList.push(
        "⚠️ Low confidence result. Please retake a clear, well-lit photo and verify visually."
      );
      adjusted = Math.max(35, confidence);
    } else if (confidence < 75) {
      adjusted = confidence - 5;
    }

    if (consensusLevel === "conflict") {
      adjusted = Math.max(30, adjusted - 15);
    } else if (consensusLevel === "low") {
      adjusted = Math.max(35, adjusted - 10);
    }

    return Math.round(Math.min(100, Math.max(0, adjusted)));
  };

  // Helper function to apply research validation
  const applyResearchValidation = async (
    baseResult: DiagnosisResult,
    aiConfidence: number,
    consensusLevel: "high" | "medium" | "low" | "conflict"
  ): Promise<VerificationResult> => {
    const adjustedConfidence = adjustConfidence(aiConfidence, consensusLevel, warnings);

    // Detect if image likely has visible symptoms (placeholder - in production would use image analysis)
    const hasVisibleSymptoms = !baseResult.disease.toLowerCase().includes("healthy");

    // Validate with agricultural research sources
    const research = await validateWithResearch(
      baseResult.disease,
      baseResult.crop || "unknown",
      adjustedConfidence,
      hasVisibleSymptoms
    );

    console.log(`[Research] Validation result: ${research.isValidated ? "VALIDATED" : "NEEDS INSPECTION"}`);
    console.log(`[Research] Confidence adjusted: ${adjustedConfidence}% → ${research.confidence}%`);

    // Add research notes to warnings
    warnings.push(...research.researchNotes);

    // Add alternative diagnoses if any
    if (research.alternativeDiagnoses.length > 0) {
      warnings.push(
        `Alternative possibilities from database: ${research.alternativeDiagnoses.join(", ")}`
      );
    }

    // Get research-based treatment recommendations (Traditional + Scientific)
    if (!baseResult.disease.toLowerCase().includes("healthy")) {
      const normalizedDisease = baseResult.disease
        .replace(/\(.*?\)/g, "")
        .replace(/^possible\s+/i, "")
        .replace(/^likely\s+/i, "")
        .trim();

      const treatments = await getResearchBasedTreatment(
        normalizedDisease,
        baseResult.crop || ""
      );
      
      // Add traditional and scientific treatments to result
      if (treatments.traditionalTreatments.length > 0) {
        baseResult.traditionalTreatments = treatments.traditionalTreatments;
      }
      if (treatments.scientificTreatments.length > 0) {
        baseResult.scientificTreatments = treatments.scientificTreatments;
      }
      
      // If neither are available, use general treatments or defaults
      if (
        treatments.traditionalTreatments.length === 0 &&
        treatments.scientificTreatments.length === 0
      ) {
        if (treatments.generalTreatments.length > 0) {
          baseResult.treatment = `${treatments.generalTreatments.join("\n\n")}\n\n${baseResult.treatment}`;
        } else {
          baseResult.traditionalTreatments = [
            "Apply neem oil spray (3-5 ml/L) during early morning or evening.",
            "Use fermented buttermilk spray once a week for 2-3 weeks.",
            "Remove infected leaves and avoid overhead watering.",
          ];
          baseResult.scientificTreatments = [
            "Use a broad-spectrum fungicide or bio-fungicide as per label dose.",
            "Improve airflow by spacing plants and pruning dense foliage.",
            "Rotate crops and sanitize tools to reduce re-infection.",
          ];
        }
      }
    }

    // Analyze soil deficiencies if symptoms detected
    const soilSymptoms = baseResult.soilDeficiencySymptoms || [];
    if (soilSymptoms.length > 0 && baseResult.crop) {
      console.log(`[Soil] Analyzing potential nutrient deficiencies...`);
      const deficiencies = await analyzeSoilDeficiency(baseResult.crop, soilSymptoms);
      if (deficiencies.length > 0) {
        baseResult.soilDeficiencies = deficiencies;
        warnings.push(
          `🌱 Soil Analysis: ${deficiencies.length} potential nutrient deficiency detected. Check soil nutrient section for solutions.`
        );
      }
    }

    // Mark if visual inspection required
    if (research.requiresVisualInspection) {
      baseResult.disease = `${baseResult.disease} (Requires Verification)`;
      warnings.push(
        "⚠️ VISUAL INSPECTION REQUIRED: Please physically inspect the plant/produce for actual disease symptoms before treatment."
      );
    }

    return {
      finalDiagnosis: {
        ...baseResult,
        confidence: research.confidence,
      },
      confidence: research.confidence,
      consensusLevel: research.isValidated ? consensusLevel : "low",
      models: { gemini, groq },
      warnings,
    };
  };

  // Case 1: Both models agree on the diagnosis
  if (gemini && groq && areDiseasesSimilar(gemini.disease, groq.disease)) {
    console.log("[Verification] ✅ Consensus reached - both models agree");
    
    // Average confidence between both models
    const avgConfidence = Math.round((gemini.confidence + groq.confidence) / 2);
    
    // Use the result with higher confidence as base
    const baseResult = gemini.confidence >= groq.confidence ? gemini : groq;
    
    validateVisualSymptoms(baseResult, warnings);
    
    // Apply research validation before returning
    return await applyResearchValidation(baseResult, avgConfidence, "high");
  }

  // Case 2: Both models say healthy (even if different wording)
  const geminiHealthy = gemini && normalizeDiseaseName(gemini.disease).includes("healthy");
  const groqHealthy = groq && normalizeDiseaseName(groq.disease).includes("healthy");
  
  if (geminiHealthy && groqHealthy) {
    console.log("[Verification] ✅ Both models agree: Healthy plant");
    
    const avgConfidence = Math.round(
      ((gemini?.confidence || 0) + (groq?.confidence || 0)) / 2
    );
    
    const healthyResult: DiagnosisResult = {
      disease: "Healthy Plant",
      crop: gemini?.crop || groq?.crop || "Unknown Crop",
      confidence: avgConfidence,
      severity: "low",
      treatment: "No treatment needed. Continue with regular care and monitoring.",
      preventiveMeasures: gemini?.preventiveMeasures || groq?.preventiveMeasures || [
        "Maintain proper watering schedule",
        "Ensure good soil drainage",
        "Monitor for early signs of pests or disease",
        "Apply balanced fertilizers as needed",
      ],
      weather: gemini?.weather || groq?.weather,
      videoUrl: gemini?.videoUrl || groq?.videoUrl,
    };

    // Apply research validation (will confirm healthy status)
    return await applyResearchValidation(healthyResult, avgConfidence, "high");
  }

  // Case 3: Models disagree - use more conservative approach
  if (gemini && groq && !areDiseasesSimilar(gemini.disease, groq.disease)) {
    console.log("[Verification] ⚠️ Models disagree - using conservative approach");
    
    warnings.push(
      "⚠️ AI models detected different conditions. Diagnosis confidence reduced. Please verify visually."
    );
    warnings.push(
      `Model 1 detected: ${gemini.disease} (${gemini.confidence}% confidence)`
    );
    warnings.push(
      `Model 2 detected: ${groq.disease} (${groq.confidence}% confidence)`
    );

    // If one says healthy and other says disease, be very conservative
    if (geminiHealthy || groqHealthy) {
      const healthyResult = geminiHealthy ? gemini : groq;
      const diseaseResult = geminiHealthy ? groq : gemini;
      
      warnings.push(
        "ℹ️ Conflicting results. One model detected disease, another says healthy. Please inspect plant visually for spots, wilting, or discoloration."
      );
      
      const conflictResult: DiagnosisResult = {
        disease: `Possible ${diseaseResult?.disease || "Unknown Issue"}`,
        crop: gemini.crop || groq.crop || "Unknown Crop",
        confidence: Math.min(diseaseResult?.confidence || 50, 60),
        severity: "low",
        treatment: `${diseaseResult?.treatment || "Consult expert"}\n\nNote: AI models showed conflicting results. Verify condition visually before treatment.`,
        preventiveMeasures: diseaseResult?.preventiveMeasures || healthyResult?.preventiveMeasures || [],
        weather: gemini.weather || groq.weather,
        videoUrl: diseaseResult?.videoUrl || healthyResult?.videoUrl,
      };

      // Apply research validation - this will likely require visual inspection
      return await applyResearchValidation(conflictResult, 50, "conflict");
    }

    // Both detected diseases but different ones - use higher confidence one but mark as uncertain
    const higherConfidence = gemini.confidence >= groq.confidence ? gemini : groq;
    const lowerConfidence = gemini.confidence >= groq.confidence ? groq : gemini;
    
    // Reduce confidence due to disagreement
    const adjustedConfidence = Math.min(higherConfidence.confidence - 20, 75);
    
    validateVisualSymptoms(higherConfidence, warnings);
    
    const uncertainResult: DiagnosisResult = {
      ...higherConfidence,
      disease: `Likely ${higherConfidence.disease}`,
      confidence: adjustedConfidence,
      treatment: `${higherConfidence.treatment}\n\n⚠️ Note: Multiple AI analyses showed different results. Alternative diagnosis: ${lowerConfidence.disease}. Please verify symptoms visually.`,
    };

    // Apply research validation
    return await applyResearchValidation(uncertainResult, adjustedConfidence, "low");
  }

  // Case 4: Only one model returned a result
  const singleResult = gemini || groq;
  if (singleResult) {
    console.log("[Verification] ⚠️ Only one AI model available");
    
    warnings.push(
      "ℹ️ Only one AI model was able to analyze the image. Confidence may be lower."
    );
    
    validateVisualSymptoms(singleResult, warnings);
    
    // Reduce confidence when only one model available
    const reducedConfidence = Math.max(Math.round(singleResult.confidence * 0.8), 50);
    
    // Apply research validation - extra important when only one AI model
    return await applyResearchValidation(singleResult, reducedConfidence, "medium");
  }

  // Case 5: Both models failed
  console.error("[Verification] ❌ All AI models failed to analyze image");
  
  throw new Error(
    "Unable to analyze image. Both AI models failed. Please check your API keys and internet connection."
  );
};
