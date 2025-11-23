import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScriptureResponse, ArticleInsight, BusinessInsight } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
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

export const generateAnalyticsInsight = async (dataContext: string): Promise<BusinessInsight | null> => {
  if (!ai) return null;

  const prompt = `
    You are a Data Scientist and Business Strategist for "The Biblical Man", a subscription platform.
    Analyze the following raw data JSON snapshot representing current user engagement:
    
    ${dataContext}

    Provide a strategic report in JSON format:
    1. summary: A 2-sentence executive summary of the health of the platform.
    2. keyObservation: One specific trend that stands out (e.g., high churn, high scripture tool usage).
    3. strategicAction: One concrete recommendation to improve metrics.
    4. churnRiskAssessment: A brief assessment of user retention risk (Low/Medium/High) and why.
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
            summary: { type: Type.STRING },
            keyObservation: { type: Type.STRING },
            strategicAction: { type: Type.STRING },
            churnRiskAssessment: { type: Type.STRING },
          },
          required: ["summary", "keyObservation", "strategicAction", "churnRiskAssessment"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as BusinessInsight;
  } catch (error) {
    console.error("Error generating analytics insight:", error);
    return null;
  }
};
