import { GoogleGenAI } from "@google/genai";
import { AspectRatio, Resolution, VideoStyle } from "../types";

// Helper to ensure we have a valid instance with the latest key
const getAIClient = async (): Promise<GoogleGenAI> => {
  // Check if a key is selected (Veo requirement)
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      throw new Error("API Key not selected. Please select a key via the UI.");
    }
  }
  
  // process.env.API_KEY is populated by the environment after selection
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceTextPrompt = async (
  originalText: string,
  instruction: string
): Promise<string> => {
  try {
    const ai = await getAIClient();
    const model = 'gemini-2.5-flash';
    
    const prompt = `You are a professional video script writer. Rewrite the following text based on this instruction: "${instruction}".
    
    Keep the output concise, vivid, and optimized for a video generation AI model. Return ONLY the rewritten text.
    
    Original Text: "${originalText}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for simple rewrites
      }
    });

    return response.text || originalText;
  } catch (error) {
    console.error("Enhance Text Error:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioFile: File): Promise<string> => {
    try {
        const ai = await getAIClient();
        const base64 = await fileToBase64(audioFile);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { 
                        inlineData: { 
                            mimeType: audioFile.type.includes('audio') ? audioFile.type : 'audio/mp3', 
                            data: base64 
                        } 
                    },
                    { text: "Transcribe the spoken audio into a clear, concise text script for a video. Ignore silence and background noise." }
                ]
            }
        });
        return response.text?.trim() || "Could not transcribe audio.";
    } catch (e) {
        console.error("Transcription failed", e);
        throw new Error("Audio transcription unavailable.");
    }
}

export const generateVideo = async (
  prompt: string,
  style: VideoStyle,
  aspectRatio: AspectRatio,
  resolution: Resolution,
  imageFile?: File
): Promise<string> => {
  const ai = await getAIClient();

  // Enhance prompt for Veo specifically
  const fullPrompt = `Cinematic video, ${style} style. ${prompt}. High quality, detailed, 4k.`;

  // Veo Config Mapping
  // Veo only supports 16:9 or 9:16. We map others to closest.
  let targetRatio: '16:9' | '9:16' = '16:9';
  if (aspectRatio === AspectRatio.Portrait || aspectRatio === AspectRatio.Vertical) {
    targetRatio = '9:16';
  }

  // Veo fast supports 720p or 1080p
  const targetResolution = resolution === Resolution.HD ? '720p' : '1080p';

  // Convert File to Base64 if present
  let imagePart = null;
  if (imageFile) {
    const base64 = await fileToBase64(imageFile);
    imagePart = {
      imageBytes: base64,
      mimeType: imageFile.type,
    };
  }

  try {
    let operation;
    
    // Use Veo Fast for responsive UX
    const model = 'veo-3.1-fast-generate-preview';

    if (imagePart) {
      operation = await ai.models.generateVideos({
        model,
        prompt: fullPrompt,
        image: imagePart,
        config: {
          numberOfVideos: 1,
          resolution: targetResolution,
          aspectRatio: targetRatio
        }
      });
    } else {
      operation = await ai.models.generateVideos({
        model,
        prompt: fullPrompt,
        config: {
          numberOfVideos: 1,
          resolution: targetResolution,
          aspectRatio: targetRatio
        }
      });
    }

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("No video URI returned");

    // We must append the API Key to the download link
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
