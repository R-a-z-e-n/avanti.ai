
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client using the environment variable
export const getGeminiClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in environment variables");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const translateText = async (text: string, sourceLang: string, targetLang: string = "English") => {
  if (!text.trim()) return "";
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are an expert linguist. Translate the following ${sourceLang} text to ${targetLang}. If it's for an "analysis" request, provide the translation and a brief grammatical note. Text: "${text}"`,
    });
    return response.text || "Could not translate.";
  } catch (error) {
    console.error("Translation error:", error);
    return "Error connecting to AI service.";
  }
};

export const researchGrammarUsage = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Find 3 real-world examples of how "${topic}" is used in ${language} from recent news, literature, or blogs. Provide the examples and briefly explain the context. Focus on modern, authentic usage.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    // Extract URLs from groundingChunks
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })).filter((s: any) => s.uri !== '#');

    return {
      text: response.text || "No explanation found.",
      sources: sources
    };
  } catch (error) {
    console.error("Grammar research error:", error);
    return { text: "Research failed.", sources: [] };
  }
};

export const explainGrammarDeeply = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `Provide a deep, professional linguistic analysis of "${topic}" in the context of the ${language} language. 
      Explain the history, subtle nuances that trip up intermediate learners, and comparison with English structures. 
      Go beyond basics. Use a sophisticated tone. Format as JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            deepAnalysis: { type: Type.STRING },
            nuances: { type: Type.ARRAY, items: { type: Type.STRING } },
            proTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["topic", "deepAnalysis", "nuances", "proTips"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Deep analysis error:", error);
    return null;
  }
};

export const visualizeCulture = async (prompt: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [{ text: `A vibrant, photorealistic cultural scene for a language learner: ${prompt}` }],
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (error) {
    console.error("Image generation error:", error);
  }
  return null;
};

export const generateReadingPassage = async (language: string, level: string = "B1") => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Generate an interesting 150-word reading passage in ${language} at ${level} level. Include 3 multiple-choice comprehension questions with a "correctIndex". Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            passage: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER }
                }
              }
            }
          },
          required: ["title", "passage", "questions"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Reading generation error:", error);
    return null;
  }
};

export const generateWritingPrompt = async (language: string, topic: string = "General") => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Generate a writing prompt in ${language} about "${topic}" for an intermediate learner. Include 5 keywords to use. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            suggestedWords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["prompt", "suggestedWords"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Writing prompt error:", error);
    return { prompt: "Write about your day.", suggestedWords: [] };
  }
};

export const analyzeWriting = async (text: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: `Analyze this ${language} text for an intermediate learner: "${text}". Provide a score (0-100), feedback, and a list of specific corrections. Format as JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 5000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrections: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedback: { type: Type.STRING },
            score: { type: Type.INTEGER }
          },
          required: ["corrections", "feedback", "score"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis error:", error);
    return { corrections: [], feedback: "Analysis unavailable.", score: 0 };
  }
};

export const generateGrammarExplanation = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Explain ${topic} in ${language} for an intermediate student. Provide 3 example sentences. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            explanation: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["topic", "explanation", "examples"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Grammar generation error:", error);
    return { topic, explanation: "Could not generate lesson.", examples: [] };
  }
};

export const generateGrammarExercise = async (topic: string, language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Generate a challenging interactive grammar exercise for the topic "${topic}" in ${language}. 
      Choose one of these types: 'MCQ' (multiple choice), 'SCRAMBLE' (sentence ordering), or 'ERROR' (find the mistake).
      Include the type, the sentence/options, the correct answer, and a detailed explanation.
      Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "MCQ, SCRAMBLE, or ERROR" },
            sentence: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["type", "sentence", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Exercise generation error:", error);
    return null;
  }
};

export const generateWorkout = async (language: string) => {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Create a 3-part workout for ${language} (B1 level). 1: Translation sentence, 2: Cloze sentence, 3: Short essay prompt. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translationTask: { type: Type.STRING },
            clozeTask: { type: Type.STRING },
            compositionPrompt: { type: Type.STRING }
          },
          required: ["translationTask", "clozeTask", "compositionPrompt"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Workout generation error:", error);
    return null;
  }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const decode = decodeBase64;
export const encode = encodeBase64;

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
