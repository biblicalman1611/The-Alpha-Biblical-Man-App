import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScriptureResponse, ArticleInsight } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to prevent crashes if key is missing during dev, 
// though per instructions we assume it's there.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getScriptureInsight = async (topic: string): Promise<ScriptureResponse | null> => {
  if (!ai) {
    console.error("API Key is missing.");
    return null;
  }

  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are a wise spiritual mentor representing "The Biblical Man". 
    The user is asking for guidance or thinking about this topic: "${topic}".
    
    Please provide:
    1. A relevant Bible verse strictly from the King James Version (KJV). Ensure the language reflects the KJV text (thee, thou, etc.).
    2. The scripture reference (Book Chapter:Verse).
    3. A "microLesson": A profound, stoic, and biblically grounded insight (max 40 words).
    4. A "reflectionQuestion": A direct and challenging question to help the user apply this to their life.
    
    Return the response strictly as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING },
            reference: { type: Type.STRING },
            microLesson: { type: Type.STRING },
            reflectionQuestion: { type: Type.STRING },
          },
          required: ["verse", "reference", "microLesson", "reflectionQuestion"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as ScriptureResponse;
  } catch (error) {
    console.error("Error generating scripture insight:", error);
    return null;
  }
};

export const generateScriptureAudio = async (text: string): Promise<string | null> => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Error generating audio:", error);
    return null;
  }
};

export const generateArticleInsight = async (content: string): Promise<ArticleInsight | null> => {
  if (!ai) return null;

  const prompt = `
    Analyze the following article content from "The Biblical Man".
    Provide a "Micro-Learning" summary that helps the reader retain and apply the knowledge.
    
    Content:
    ${content.substring(0, 5000)}

    Return a JSON object with:
    1. corePrinciple: The one central truth of this article (max 15 words).
    2. actionItem: A specific, immediate action the reader can take (max 20 words).
    3. reflection: A question to challenge their current mindset.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corePrinciple: { type: Type.STRING },
            actionItem: { type: Type.STRING },
            reflection: { type: Type.STRING },
          },
          required: ["corePrinciple", "actionItem", "reflection"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as ArticleInsight;
  } catch (error) {
    console.error("Error generating article insight:", error);
    return null;
  }
};