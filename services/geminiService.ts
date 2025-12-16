import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageStyle } from "../types";

// Helper to handle the API Key selection flow required for Premium models
export const checkApiKeySelection = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  // If not running in an environment with window.aistudio, we fall back to env var logic
  // which is implicitly handled by the SDK via process.env.API_KEY.
  // We return true here to bypass the UI modal if we are in a dev environment using .env
  return !!process.env.API_KEY;
};

export const promptApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio key selection not available in this environment.");
  }
};

const getClient = () => {
  // Always create a new instance to pick up the latest selected key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceUserPrompt = async (rawInput: string, style: ImageStyle): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    
    const systemInstruction = `You are a professional AI visual artist and prompt engineer. 
    Your mission is to convert ANY user input (Hindi, Hinglish, or English), no matter how short or simple, into a premium, award-winning image generation prompt in English.
    
    TARGET ART STYLE: ${style}

    MANDATORY ENHANCEMENT RULES:
    1. EXPAND THE CORE IDEA: Add intricate details to the main subject (texture, clothing, expression, material).
    2. BUILD THE WORLD: Describe the environment, background, mood, and atmosphere in depth.
    3. CULTURAL INTELLIGENCE (INDIAN CONTEXT):
       - If the user input relates to Indian culture, environment, or uses Hindi/Hinglish terms:
       - Authentically integrate Indian streets, bustling markets, ancient temples, or modern Indian cities.
       - Enhance with festivals (Diwali lights, Holi colors, Eid celebrations) if contextually appropriate.
       - Describe traditional Indian clothing (sarees, kurtas), vibrant colors, and architecture (havelis, arches).
       - IMPORTANT: Do not force Indian elements if the input is clearly unrelated (e.g., "Eiffel Tower", "New York"). Keep the scene natural and authentic.
    4. CINEMATOGRAPHY: Specify camera angles (e.g., low angle, wide shot, macro), lighting (e.g., volumetric, golden hour, neon, rim lighting), and composition.
    5. QUALITY BOOSTERS: Use keywords like "8k resolution", "photorealistic", "cinematic color grading", "ultra-detailed", "unreal engine 5 render".
    6. CREATIVE FILL: If the input is very short (e.g., "a cat"), invent a stunning scenario (e.g., "A majestic cyberpunk cat sitting on a rainy neon rooftop in Tokyo...").
    7. STYLE ENFORCEMENT: Strictly adhere to the "${style}" art style. 
       - If "Anime / Manga", use keywords like "Studio Ghibli", "Makoto Shinkai", "vibrant colors", "cel shading".
       - If "Ultra Realistic", focus on "photorealism", "raw photo", "Fujifilm", "4k texture".
       - If "3D Render", use "Octane Render", "Blender", "Ray Tracing", "CGSociety".
       - If "Sketch / Pencil Art", use "graphite", "charcoal", "rough sketch", "hatching".
       - If "Minimal Clean", use "flat design", "vector art", "minimalist", "solid colors".
       - If "Fantasy / Sci-Fi", use "digital painting", "concept art", "artstation", "ethereal".
       - If "Cinematic", use "movie scene", "shallow depth of field", "anamorphic lens".

    Output ONLY the final enhanced English prompt. Do not include any conversational text or explanations.`;

    const response = await ai.models.generateContent({
      model,
      contents: rawInput,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    return response.text?.trim() || rawInput;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Fallback to original input if enhancement fails
    return rawInput;
  }
};

export const generateImageFromPrompt = async (
  prompt: string, 
  aspectRatio: AspectRatio
): Promise<string> => {
  const ai = getClient();
  
  // Helper function to extract image data from response
  const extractImage = (response: any) => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  };

  try {
    // Attempt 1: Try the Premium model (Gemini 3 Pro)
    // This model provides higher quality but requires specific permissions/billing
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    const image = extractImage(response);
    if (image) return image;

  } catch (error: any) {
    const errorMsg = error.message || JSON.stringify(error);
    const isPermissionError = errorMsg.includes("403") || errorMsg.includes("PERMISSION_DENIED");
    const isNotFoundError = errorMsg.includes("404") || errorMsg.includes("NOT_FOUND");

    // If permission denied or model not found, fallback to the standard model
    if (isPermissionError || isNotFoundError) {
      console.warn("Premium model failed (403/404), falling back to Standard Flash model...", error);
      
      try {
        // Attempt 2: Fallback to Flash Image model
        // Note: Flash model does NOT support 'imageSize' in config
        const fallbackResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [{ text: prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        });

        const fallbackImage = extractImage(fallbackResponse);
        if (fallbackImage) return fallbackImage;

      } catch (fallbackError) {
        console.error("Fallback generation failed:", fallbackError);
        // If fallback also fails, throw the fallback error
        throw fallbackError;
      }
    } else {
      // If it was a different error (e.g. content policy), rethrow original
      console.error("Generation failed with non-permission error:", error);
      throw error;
    }
  }
  
  throw new Error("No image data found in response");
};