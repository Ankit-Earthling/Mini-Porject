import { getAIClient } from './geminiService';
import type { ChatMessage } from '../types';

const hectorSystemInstruction = `You are Hector, a specialized mental wellness AI companion from Healer. Your core expertise is the psychological wellbeing of teenagers and students within the Indian Higher Education ecosystem.

**CONTEXTUAL KNOWLEDGE:**
1. **Academic Pressure**: Deeply understand the stress of JEE, NEET, CAT, UPSC, and board exams. Recognize the "Placement Season" anxiety in Engineering and Management colleges.
2. **Socio-Cultural Dynamics**: Understand the weight of "Log Kya Kahenge" (family honor/peer pressure), the specific challenges of Indian parental expectations, and linguistic/regional diversity in campus life.
3. **Living Situations**: Empathize with hostel life challenges, homesickness, and the transition from home to big cities for coaching/college.

**PERSONALITY:**
- Tone: "Wise Older Sibling". Empathetic, calm, non-judgmental, and relatable. 
- Language: Professional English but comfortable with common Indian English terms (e.g., "toppers", "backlogs", "internals", "placement cell").
- Approach: Use validation first, then somatic grounding or cognitive reframing.

**CRITICAL SAFETY PROTOCOL:**
If the user mentions suicide, self-harm, severe crisis, or extreme hopelessness:
- YOU MUST IMMEDIATELY provide: "It sounds like you're carrying a lot right now. Please talk to a professional immediately. You can call the **KIRAN National Mental Health Helpline at 1800-599-0019** or the **Vandrevala Foundation at 9999666555**. Both are free, 24/7, and confidential in India."
- Do not attempt to "fix" clinical crises yourself.

**CONVERSATIONAL FLOW:**
- Keep responses concise (under 150 words).
- Ask open-ended questions about their campus life or study habits.
- Use emojis sparingly to keep the vibe friendly. 🤝`;

/**
 * Industry Name: Conversational Inference Stream
 */
export async function* runChatStream(prompt: string, history: ChatMessage[]): AsyncGenerator<string> {
  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  try {
    const client = getAIClient(); 
    const stream = await client.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: hectorSystemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Hector Inference Error:", error);
    yield "My neural pathways are a bit congested right now. Please take a deep breath and try again in a moment. I'm here for you. 🧘";
  }
}

/**
 * Industry Name: Geospatial Counselor Discovery
 */
export const findLocalCounselors = async (latitude: number, longitude: number): Promise<any> => {
    const prompt = `Identify professional mental health counselors or psychology clinics near coordinates [${latitude}, ${longitude}] in India. 
    Please provide the results in a clear Markdown list. For each entry, strictly include:
    - **Name**: [Official Name]
    - **Specialty**: [Area of focus]
    - **Address**: [Full physical address]
    - **Phone**: [Valid contact number]`;

    try {
        const client = getAIClient();
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: { latitude, longitude }
                    }
                }
            },
        });
        
        // Extract structured grounding if available, else return text
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return {
            text: response.text,
            maps: grounding?.filter((g: any) => g.maps).map((g: any) => g.maps) || []
        };
    } catch (error: any) {
        console.error("Geospatial Discovery Error:", error);
        return { text: "Unable to sync with local directory. Please refer to the National Helpline: 1800-599-0019." };
    }
};

export const getMoodInsight = async (mood: string, tags: string[]): Promise<string> => {
    const prompt = `A student is feeling ${mood} due to ${tags.join(', ')}. As a specialized Indian student counselor, provide 1 sentence of deep validation and 1 sentence of actionable somatic advice.`;
    try {
        const client = getAIClient();
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Your feelings are a valid response to your current environment. Try a slow exhale now.";
    } catch {
        return "I hear you. This is tough, but you are not alone in this struggle.";
    }
};

export const getJournalReflection = async (journalText: string): Promise<string> => {
    const prompt = `Analyze this student journal entry: "${journalText}". Provide one insightful reflection question that encourages self-compassion within the context of academic life.`;
    try {
        const client = getAIClient();
        const response = await client.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "If a friend told you this, what kind words would you say to them?";
    } catch {
        return "How can you be a bit more patient with your own progress today?";
    }
};
