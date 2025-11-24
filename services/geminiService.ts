
import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { ScriptureResponse, ArticleInsight, BusinessInsight, WarPlan } from '../types';

// Initialize AI client directly with process.env.API_KEY as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to parse JSON that might be wrapped in markdown
const parseJSON = <T>(text: string | undefined): T | null => {
  if (!text) return null;
  try {
    let cleanText = text.trim();
    // Remove markdown code blocks if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    return null;
  }
};

export const startChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-1.5-pro',
    config: {
      systemInstruction: `You are "The Steward", an AI guide for "The Biblical Man" website.
      Your goal is to help men navigate the resources, entice them to join the "Inner Circle" membership ($3/month), and recommend products like "The Vault" or "Morning Liturgy".
      
      Brand Tone: Stoic, masculine, biblical, direct, encouraging. Use "Brother" occasionally.
      
      Key Information to Reference:
      - Membership ($3/mo) gives access to: The War Room (strategy), The Scriptorium (copywork), Prayer Wall, and 40-Day Protocol.
      - Products: "The Vault" ($297, all access), "Morning Liturgy" ($27, routine), "Strength Training" ($45).
      - Mission: Restoring ancient biblical masculinity in a modern world.
      
      Behavior:
      - Keep responses concise (under 3 sentences unless asked for depth).
      - If they ask about faith/theology, give a brief, sound answer and suggest they read the "Writings" section.
      - Always end with a subtle call to action related to joining the brotherhood or browsing the shop.`,
    }
  });
};

export const getScriptureInsight = async (topic: string): Promise<ScriptureResponse | null> => {
  const modelId = "gemini-1.5-flash";

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

    return parseJSON<ScriptureResponse>(response.text);
  } catch (error) {
    console.error("Error generating scripture insight:", error);
    return null;
  }
};

export const generateScriptureAudio = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
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

export const generateVerseImage = async (verse: string, reference: string): Promise<string | null> => {
  const prompt = `
    Create a museum-quality, baroque-style oil painting that visually represents the themes of this Bible verse: "${verse}" (${reference}).
    
    Style guidelines:
    - Chiaroscuro lighting (high contrast between light and dark).
    - Rembrandt or Caravaggio influence.
    - Somber, stoic, and masculine tone.
    - No text or words in the image.
    - Historical biblical setting or symbolic representation.
    - High detail, realistic texture.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const generateWarPlan = async (struggle: string, goal: string, time: string): Promise<WarPlan | null> => {
  const prompt = `
    You are a Strategic Commander for a spiritual warfare unit. A man has come to the "War Room" with a specific battle.
    
    The Enemy/Struggle: "${struggle}"
    The Objective/Goal: "${goal}"
    Time/Constraints: "${time}"

    Develop a 3-Phase Tactical Protocol to conquer this enemy.
    
    1. Phase 1: The Recon (Immediate mindset shift & removal of triggers).
    2. Phase 2: The Strike (The specific disciplined actions to take).
    3. Phase 3: The Fortification (Long-term habit to prevent return).

    Be extremely direct, stoic, and practical. No fluff. Use military/biblical terminology.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A cool operation name, e.g., 'Operation Iron Will'" },
            phase1: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tactic: { type: Type.STRING },
                scriptureAmmo: { type: Type.STRING }
              },
              required: ["name", "tactic", "scriptureAmmo"]
            },
            phase2: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tactic: { type: Type.STRING },
                scriptureAmmo: { type: Type.STRING }
              },
              required: ["name", "tactic", "scriptureAmmo"]
            },
            phase3: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tactic: { type: Type.STRING },
                scriptureAmmo: { type: Type.STRING }
              },
              required: ["name", "tactic", "scriptureAmmo"]
            }
          },
          required: ["title", "phase1", "phase2", "phase3"]
        }
      }
    });

    return parseJSON<WarPlan>(response.text);

  } catch (error) {
    console.error("Error generating war plan:", error);
    return null;
  }
};


export const generateArticleInsight = async (content: string): Promise<ArticleInsight | null> => {
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
      model: "gemini-1.5-flash",
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

    return parseJSON<ArticleInsight>(response.text);
  } catch (error) {
    console.error("Error generating article insight:", error);
    return null;
  }
};

export const generateAnalyticsInsight = async (dataContext: string): Promise<BusinessInsight | null> => {
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
      model: "gemini-1.5-flash",
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

    return parseJSON<BusinessInsight>(response.text);
  } catch (error) {
    console.error("Error generating analytics insight:", error);
    return null;
  }
};

export const generateTutorialAudio = async (userName: string): Promise<string | null> => {
  const scriptPrompt = `
    You are the voice of "The Biblical Man" brotherhood. 
    Write a short, powerful welcome script for a new member named "${userName}".
    
    The script must explain the 3 core features of the dashboard in under 50 words total:
    1. The War Room (strategic planning).
    2. The 40-Day Protocol (building discipline).
    3. The Prayer Wall (supporting brothers).
    
    Tone: Stoic, encouraging, masculine, authoritative but warm.
    Start with "Welcome, ${userName}."
  `;

  try {
    const scriptResponse = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: scriptPrompt,
    });

    const scriptText = scriptResponse.text;
    if (!scriptText) return null;

    const audioResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [{ text: scriptText }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, authoritative voice
          },
        },
      },
    });

    return audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;

  } catch (error) {
    console.error("Error generating tutorial:", error);
    return null;
  }
};

// --- Scriptorium Methods ---

export const getScribePassage = async (theme: string): Promise<{ reference: string; text: string } | null> => {
  const prompt = `
    Provide a single, powerful Bible verse or short passage (2-3 verses) from the King James Version (KJV) based on the theme: "${theme}".
    
    The passage should be suitable for "Copywork" (typing out word for word to meditate on it).
    It should be profound, challenging, and masculine in tone.
    
    Return JSON:
    {
      "reference": "Book Chapter:Verse",
      "text": "The full KJV text..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ["reference", "text"],
        },
      },
    });

    return parseJSON<{ reference: string; text: string }>(response.text);
  } catch (error) {
    console.error("Error fetching scribe passage:", error);
    return null;
  }
};

export const getScribeAnalysis = async (text: string): Promise<string | null> => {
  const prompt = `
    A man has just finished manually typing out this scripture (KJV) as an act of meditation:
    "${text}"
    
    Provide a brief, deep theological insight (max 2 sentences) affirming his effort and explaining the core weight of this text. 
    Tone: Ancient, approving, solemn.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching scribe analysis:", error);
    return null;
  }
};
