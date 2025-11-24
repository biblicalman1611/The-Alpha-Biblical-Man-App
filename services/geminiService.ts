import { ScriptureResponse, ArticleInsight, BusinessInsight } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Use direct REST API to completely bypass service worker issues
async function callGeminiAPI(modelId: string, contents: any, config: any = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: typeof contents === 'string' ? [{ parts: [{ text: contents }] }] : contents,
  };

  if (config.generationConfig) {
    requestBody.generationConfig = config.generationConfig;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  return { text, candidates: data.candidates };
}

/**
 * Generate a personalized welcome tutorial script for new members
 */
export const getWelcomeTutorialScript = async (userName: string): Promise<string[]> => {
  if (!apiKey) {
    console.error("API Key is missing.");
    return [];
  }

  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are a wise, masculine mentor welcoming a new brother named "${userName}" to "The Biblical Man" member area.

    Generate a 5-step voice tutorial script that will be read aloud using text-to-speech. Each step should:
    1. Be conversational and personal (address him by name in the first step)
    2. Be concise (2-3 sentences max per step)
    3. Have a tone of strength, wisdom, and brotherhood
    4. Explain one key feature of the member dashboard

    The 5 steps should cover:
    1. Welcome and overview
    2. The 40-Day Protocol (daily discipline tracker)
    3. Prayer Wall (community prayer requests)
    4. Bible Study section (audio lessons and teachings)
    5. Closing encouragement and call to action

    Return ONLY a JSON array of 5 strings, one for each step.
    Each string should be suitable for text-to-speech (avoid special characters, use natural speech patterns).
  `;

  try {
    const response = await callGeminiAPI(modelId, prompt, {
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];

    const script = JSON.parse(text) as string[];
    return script.length === 5 ? script : [];
  } catch (error) {
    console.error("Error generating tutorial script:", error);
    return [];
  }
};

export const getScriptureInsight = async (topic: string): Promise<ScriptureResponse | null> => {
  if (!apiKey) {
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

    Return the response strictly as a JSON object with keys: verse, reference, microLesson, reflectionQuestion.
  `;

  try {
    const response = await callGeminiAPI(modelId, prompt, {
      generationConfig: {
        responseMimeType: "application/json",
      }
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
  if (!apiKey) return null;

  // Note: Audio generation requires the SDK - skip for now or implement via REST API
  console.warn("Audio generation temporarily disabled");
  return null;
};

export const generateArticleInsight = async (content: string): Promise<ArticleInsight | null> => {
  if (!apiKey) return null;

  const prompt = `
    Analyze the following article content from "The Biblical Man".
    Provide a "Micro-Learning" summary that helps the reader retain and apply the knowledge.

    Content:
    ${content.substring(0, 5000)}

    Return a JSON object with:
    1. corePrinciple: The one central truth of this article (max 15 words).
    2. actionItem: A specific, immediate action the reader can take (max 20 words).
    3. reflection: A question to challenge their current mindset.

    Use these exact JSON keys: corePrinciple, actionItem, reflection
  `;

  try {
    const response = await callGeminiAPI("gemini-2.5-flash", prompt, {
      generationConfig: {
        responseMimeType: "application/json",
      }
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
  if (!apiKey) return null;

  const prompt = `
    You are a Data Scientist and Business Strategist for "The Biblical Man", a subscription platform.
    Analyze the following raw data JSON snapshot representing current user engagement:

    ${dataContext}

    Provide a strategic report in JSON format:
    1. summary: A 2-sentence executive summary of the health of the platform.
    2. keyObservation: One specific trend that stands out (e.g., high churn, high scripture tool usage).
    3. strategicAction: One concrete recommendation to improve metrics.
    4. churnRiskAssessment: A brief assessment of user retention risk (Low/Medium/High) and why.

    Use these exact JSON keys: summary, keyObservation, strategicAction, churnRiskAssessment
  `;

  try {
    const response = await callGeminiAPI("gemini-2.5-flash", prompt, {
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as BusinessInsight;
  } catch (error) {
    console.error("Error generating analytics insight:", error);
    return null;
  }
};
