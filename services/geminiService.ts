import { GoogleGenAI, Type } from "@google/genai";
import { SLOKA_DATA } from "../constants/slokaData";
import { VEDIC_REMEDIES_DATA } from "../constants/remediesData";
import { TANTRA_BOOK_DATA } from "../constants/tantraBookData";
import type { Sloka, BijaMantraApiResponse, VedicRemedy, SearchResult, TantraBookMantra, ChatMessage, MantraIdentifier, CombinedMantraResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const identifierSchema = {
  type: Type.OBJECT,
  properties: {
    source: { type: Type.STRING, enum: ['Soundarya Lahari', 'Vedic Remedies'], description: "The source dataset of the item." },
    identifier: { type: Type.INTEGER, description: "Use the 'slokaNumber' for Soundarya Lahari, or the 'id' for Vedic Remedies." },
  },
  required: ['source', 'identifier'],
};

const combinedIdentifierSchema = {
  type: Type.ARRAY,
  items: identifierSchema,
};

export const findMantraForProblem = async (problem: string, combine: boolean): Promise<MantraIdentifier[]> => {
  // To make the prompt more efficient, we only send the fields necessary for matching.
  const slokaDataString = JSON.stringify(SLOKA_DATA.map(({slokaNumber, title, beneficialResults, literalResults}) => ({slokaNumber, title, beneficialResults, literalResults})), null, 2);
  const remediesDataString = JSON.stringify(VEDIC_REMEDIES_DATA.map(({id, title, purpose}) => ({id, title, purpose})), null, 2);

  const prompt = `You are an expert scholar of Vedic traditions, specializing in both the Soundarya Lahari and general Vedic remedies. Your task is to analyze the user's problem and recommend the most appropriate spiritual solution(s) from TWO provided JSON datasets.

User's Problem: "${problem}"

Analyze the 'beneficialResults', 'literalResults', and 'title' of the slokas, and the 'purpose' and 'title' of the remedies to find the best match.

${ combine 
    ? "The user wants a powerful, synergistic combination. Please identify the 2 or 3 solutions that work best *together* to solve this problem. You can mix and match from both sources."
    : "Identify all highly relevant slokas AND remedies that individually address the user's problem. Return a result from each dataset if a strong match is found in both. Limit the total results to a maximum of 3."
}

CRITICAL INSTRUCTIONS:
1.  Your entire response MUST be a JSON array of objects matching the provided schema. If you find no matches, return an empty array [].
2.  For each recommended item, you must return an object with two fields:
    - "source": Must be either the exact string 'Soundarya Lahari' or 'Vedic Remedies'.
    - "identifier": Must be the integer value from the 'slokaNumber' field (for Soundarya Lahari) or the 'id' field (for Vedic Remedies).
3.  Do NOT return the full text or any other fields. Only return the source and the identifier.

DATASET 1: Soundarya Lahari Slokas (only relevant fields shown)
${slokaDataString}

DATASET 2: Vedic Remedies (only relevant fields shown)
${remediesDataString}
`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: combinedIdentifierSchema,
        },
      });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    
    let parsedJson = JSON.parse(jsonText);
    
    // The model should return an array, but as a fallback, we wrap it if it's not.
    if (!Array.isArray(parsedJson)) {
        parsedJson = [parsedJson];
    }

    return parsedJson as MantraIdentifier[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to find a mantra. The divine connection might be weak right now. Please try again.`);
  }
};


const explainerSchema = {
    type: Type.OBJECT,
    properties: {
        tableHeaders: {
            type: Type.OBJECT,
            properties: {
                bijaMantra: { type: Type.STRING },
                associatedDeity: { type: Type.STRING },
                associatedChakra: { type: Type.STRING },
                usageAndBenefits: { type: Type.STRING },
                associatedShlokas: { type: Type.STRING },
            },
            required: ['bijaMantra', 'associatedDeity', 'associatedChakra', 'usageAndBenefits', 'associatedShlokas']
        },
        explanations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    bijaMantra: { type: Type.STRING },
                    associatedDeity: { type: Type.STRING },
                    associatedChakra: { type: Type.STRING },
                    usageAndBenefits: { type: Type.STRING },
                    associatedShlokas: { type: Type.STRING },
                },
                required: ['bijaMantra', 'associatedDeity', 'associatedChakra', 'usageAndBenefits', 'associatedShlokas']
            }
        }
    },
    required: ['tableHeaders', 'explanations']
};

export const explainBijaMantras = async (rawBijaMantras: string[], language: string): Promise<BijaMantraApiResponse> => {
    const dataString = JSON.stringify(SLOKA_DATA, null, 2);

    const uniqueMantras = Array.from(
        new Set(
          rawBijaMantras
            .flatMap(m => m.split(','))
            .map(s => s.trim().replace(/[-.,]/g, ''))
            .filter(s => s)
        )
      );

    const prompt = `You are a profound scholar of Vedic traditions, Soundarya Lahari, and tantric sciences. Your task is to provide a detailed, multilingual explanation of specific Bija Mantras based on the provided context of the entire Soundarya Lahari text.

CONTEXT:
Soundarya Lahari Data: ${dataString}

TASK:
Analyze the provided Bija Mantras: [${uniqueMantras.join(', ')}]. For each Bija Mantra, synthesize information from the context above to generate a detailed explanation. The explanation MUST be in ${language}.

The final output MUST be a JSON object with two keys: "tableHeaders" and "explanations".

1.  "tableHeaders": An object containing the translated headers for the table in ${language}. The keys for this object must be: 'bijaMantra', 'associatedDeity', 'associatedChakra', 'usageAndBenefits', 'associatedShlokas'.

2.  "explanations": An array of objects, where each object represents one Bija Mantra and has the following properties:
    *   'bijaMantra': The Bija Mantra sound itself.
    *   'associatedDeity': The associated deity or energy. Infer this from the 'goddess' and context of the slokas where the mantra appears.
    *   'associatedChakra': The associated chakra and its color. Infer this based on tantric principles and the sloka descriptions (e.g., mentions of body parts like 'Naabhi' (navel) for Manipura). If not directly stated, you can make a scholarly inference.
    *   'usageAndBenefits': A summary of the usage and benefits. Synthesize this from the 'beneficialResults' and 'literalResults' of ALL slokas where this Bija Mantra is mentioned.
    *   'associatedShlokas': A string listing the sloka numbers where this mantra is found (e.g., "Slokas #5, #26, #33").

Provide the entire response in ${language}. Do not add any text before or after the JSON object.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: explainerSchema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the API for the explanation.");
        }
        
        return JSON.parse(jsonText) as BijaMantraApiResponse;

    } catch (error) {
        console.error("Error calling Gemini API for explanation:", error);
        throw new Error(`Failed to get an explanation in ${language}. The divine connection might be weak right now. Please try again.`);
    }
};


export const translateSlokas = async (slokas: Sloka[], language: string): Promise<Sloka[]> => {
    if (language === 'English' || slokas.length === 0) {
        return slokas;
    }

    const slokasToTranslate = slokas.map(s => ({ 
        slokaNumber: s.slokaNumber,
        title: s.title,
        goddess: s.goddess,
        modeOfWorship: s.modeOfWorship,
        beneficialResults: s.beneficialResults,
        literalResults: s.literalResults
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual and Vedic texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'title', 'goddess', 'modeOfWorship', 'beneficialResults', and 'literalResults'.
    
    The 'slokaNumber' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(slokasToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                slokaNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                goddess: { type: Type.STRING },
                modeOfWorship: { type: Type.STRING },
                beneficialResults: { type: Type.STRING },
                literalResults: { type: Type.STRING },
            },
            required: ['slokaNumber', 'title', 'goddess', 'modeOfWorship', 'beneficialResults', 'literalResults']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });
        const jsonText = response.text.trim();
        const translatedData = JSON.parse(jsonText) as Array<Omit<Sloka, 'bijaMantra' | 'slokaText'>>;

        // Merge translated data back with original non-translated data
        return slokas.map(originalSloka => {
            const translatedPart = translatedData.find(t => t.slokaNumber === originalSloka.slokaNumber);
            return translatedPart ? { ...originalSloka, ...translatedPart } : originalSloka;
        });

    } catch (error) {
        console.error("Error calling Gemini API for translation:", error);
        throw new Error(`Failed to translate the sloka details into ${language}.`);
    }
};


export const analyzeSlokas = async (slokas: Sloka[], language: string): Promise<string> => {
    const slokaDetails = JSON.stringify(slokas.map(({ slokaNumber, title, bijaMantra, beneficialResults, literalResults }) => ({
        slokaNumber, title, bijaMantra, beneficialResults, literalResults
    })), null, 2);

    const prompt = `You are a wise and insightful spiritual scholar, specializing in the deep meanings of the Soundarya Lahari. Your task is to provide a concise, analytical summary of the provided sloka(s) in a structured format. The entire response must be in ${language}.

Analyze the following sloka data:
${slokaDetails}

Based on the data, generate a summary with the following structure. Use markdown-style bolding for the headers.

*   **Core Purpose & Theme:** What is the central goal or spiritual theme of this sloka (or combination of slokas)?
*   **Key Connections:** Explain the relationship between the Bija Mantra(s), the associated deity/energy, and the stated benefits. How do they work together?
*   **Spiritual Guidance:** Offer a brief piece of actionable spiritual advice or a point of reflection for someone working with this mantra.

Return ONLY the structured text analysis. Do not include any introductory or concluding phrases like "Here is the analysis:".
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const analysisText = response.text;
        if (!analysisText) {
            throw new Error("Received an empty analysis from the API.");
        }
        return analysisText.trim();

    } catch (error) {
        console.error("Error calling Gemini API for analysis:", error);
        throw new Error(`Failed to generate a deeper insight in ${language}. The divine connection may be weak right now. Please try again.`);
    }
};

export const translateVedicRemedies = async (remedies: VedicRemedy[], language: string): Promise<VedicRemedy[]> => {
    if (language === 'English' || remedies.length === 0) {
        return remedies;
    }

    const remediesToTranslate = remedies.map(r => ({
        id: r.id,
        title: r.title,
        purpose: r.purpose,
        chantingInstruction: r.chantingInstruction,
        notes: r.notes
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual and Vedic texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'title', 'purpose', 'chantingInstruction', and the strings within the 'notes' array.
    
    The 'id' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(remediesToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                title: { type: Type.STRING },
                purpose: { type: Type.STRING },
                chantingInstruction: { type: Type.STRING },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'title', 'purpose']
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });
        const jsonText = response.text.trim();
        const translatedData = JSON.parse(jsonText) as Array<Partial<VedicRemedy>>;

        return remedies.map(originalRemedy => {
            const translatedPart = translatedData.find(t => t.id === originalRemedy.id);
            return translatedPart ? { ...originalRemedy, ...translatedPart } : originalRemedy;
        });

    } catch (error) {
        console.error("Error calling Gemini API for remedy translation:", error);
        throw new Error(`Failed to translate the remedy details into ${language}.`);
    }
};

export const translateTantraBookMantras = async (mantras: TantraBookMantra[], language: string): Promise<TantraBookMantra[]> => {
    if (language === 'English' || mantras.length === 0) {
        return mantras;
    }

    const mantrasToTranslate = mantras.map(m => ({
        id: m.id,
        category: m.category,
        title: m.title,
        purpose: m.purpose,
        instructions: m.instructions,
        notes: m.notes
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual and tantric texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'category', 'title', 'instructions', and the strings within the 'purpose' and 'notes' arrays.
    
    The 'id' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(mantrasToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                purpose: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.STRING },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'category', 'title', 'purpose', 'instructions']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationSchema,
            },
        });
        const jsonText = response.text.trim();
        const translatedData = JSON.parse(jsonText) as Array<Partial<TantraBookMantra>>;

        return mantras.map(originalMantra => {
            const translatedPart = translatedData.find(t => t.id === originalMantra.id);
            return translatedPart ? { ...originalMantra, ...translatedPart } : originalMantra;
        });

    } catch (error) {
        console.error("Error calling Gemini API for tantra mantra translation:", error);
        throw new Error(`Failed to translate the mantra compendium details into ${language}.`);
    }
};

export const translateSearchResults = async (results: SearchResult[], language: string): Promise<SearchResult[]> => {
    if (language === 'English' || results.length === 0) {
        return results;
    }

    const slokasToTranslate = results
        .filter((r): r is { type: 'sloka'; data: Sloka } => r.type === 'sloka')
        .map(r => r.data);
    
    const remediesToTranslate = results
        .filter((r): r is { type: 'remedy'; data: VedicRemedy } => r.type === 'remedy')
        .map(r => r.data);

    const [translatedSlokas, translatedRemedies] = await Promise.all([
        slokasToTranslate.length > 0 ? translateSlokas(slokasToTranslate, language) : Promise.resolve([]),
        remediesToTranslate.length > 0 ? translateVedicRemedies(remediesToTranslate, language) : Promise.resolve([])
    ]);

    return results.map(res => {
        if (res.type === 'sloka') {
            const translated = translatedSlokas.find(t => t.slokaNumber === res.data.slokaNumber);
            return { type: 'sloka' as const, data: translated || res.data };
        } else { // remedy
            const translated = translatedRemedies.find(t => t.id === res.data.id);
            return { type: 'remedy' as const, data: translated || res.data };
        }
    });
};

export const getAiChatResponse = async (message: string, history: ChatMessage[], language: string): Promise<string> => {
    // 1. Filter local data based on the user's message
    const lowercasedMessage = message.toLowerCase();
    const keywords = lowercasedMessage.split(/\s+/).filter(word => word.length > 3);

    const filterByKeywords = (text: string) => keywords.some(kw => text.toLowerCase().includes(kw));

    const relevantSlokas = SLOKA_DATA.filter(s => 
        filterByKeywords(s.title) || 
        filterByKeywords(s.beneficialResults) || 
        filterByKeywords(s.literalResults)
    ).slice(0, 3); // Limit to top 3 matches to keep context small

    const relevantRemedies = VEDIC_REMEDIES_DATA.filter(r => 
        filterByKeywords(r.title) || 
        filterByKeywords(r.purpose)
    ).slice(0, 3);

    const relevantTantra = TANTRA_BOOK_DATA.filter(t => 
        filterByKeywords(t.title) || 
        t.purpose.some(p => filterByKeywords(p))
    ).slice(0, 3);
    
    const contextData = {
        slokas: relevantSlokas,
        remedies: relevantRemedies,
        tantraPractices: relevantTantra
    };
    const contextDataString = JSON.stringify(contextData, null, 2);
    
    // 2. Construct the prompt
    const historyString = history.map(h => `${h.role}: ${h.text}`).join('\n');

    const prompt = `You are "Lahari GPT", an insightful and compassionate spiritual guide with deep knowledge of Soundarya Lahari, Vedic Remedies, and Tantric practices. Your role is to provide clear, categorized, and actionable guidance based on the user's query and a pre-filtered set of relevant spiritual texts provided to you.

**CRITICAL INSTRUCTION: You MUST respond exclusively and entirely in the user's requested language: ${language}. Do not use English unless the user's message is in English and they have not specified another language. Adhere to this language requirement strictly.**

Always respond in a supportive and respectful tone.

Here is our conversation history so far for context:
${historyString}

Here is the user's latest message:
"${message}"

Based on the user's message, I have pre-filtered some potentially relevant practices from my knowledge base. Please use these as the primary source for your answer:
${contextDataString}

Your Task:
Analyze the user's request in the context of our conversation. Then, using ONLY the provided relevant practices from the JSON above, craft a helpful response.

**Response Requirements:**
1.  **Structure:** Use clear markdown categories (e.g., ### Soundarya Lahari Practice).
2.  **Explanation:** Briefly explain WHY the recommendation is suitable by referencing its purpose from the provided JSON data.
3.  **Include Mantra Text:** This is critical. For each recommendation, you MUST include all relevant mantra texts.
    *   For a 'sloka', you MUST include its \`bijaMantra\` and its full \`slokaText\`.
    *   For a 'remedy' or 'tantraPractice', list each string from the \`transliteratedMantra\` array on a new line.
    *   Format the mantra text clearly, for example using bold for the Bija Mantra and italics or a blockquote for the sloka/mantra text.
4.  **Conciseness:** Be as concise as possible in your explanations, but ensure all required mantra texts are always included.
5.  **Relevance:** If none of the provided practices seem relevant, politely explain that you couldn't find a direct match and ask the user to rephrase their problem.
6.  **Context:** Do not invent new practices or go beyond the provided JSON context.
7.  **Language:** (Reiterated for emphasis) Your entire response MUST be in ${language}.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const chatResponseText = response.text;
        if (!chatResponseText) {
            throw new Error("Received an empty response from the AI guide.");
        }
        return chatResponseText.trim();

    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        throw new Error(`Failed to get a response from the AI guide in ${language}. The divine connection may be weak. Please try again.`);
    }
};


const combinedMantraSchema = {
    type: Type.OBJECT,
    properties: {
        newMantra: { type: Type.STRING, description: "The newly created, combined Bija Mantra string." },
        mantraName: { type: Type.STRING, description: "A suitable, descriptive name for the new mantra." },
        corePurpose: { type: Type.STRING, description: "A concise summary of the primary purpose of this combined mantra." },
        synergisticBenefits: { type: Type.STRING, description: "An explanation of how the individual bija mantras work together to create a unique, amplified effect." },
        chantingGuidance: { type: Type.STRING, description: "Brief guidance on how or when to chant this mantra for best results." }
    },
    required: ['newMantra', 'mantraName', 'corePurpose', 'synergisticBenefits', 'chantingGuidance']
};

export const createCombinedMantra = async (bijaMantras: string[], slokas: Sloka[], language: string): Promise<CombinedMantraResponse> => {
    const uniqueMantras = Array.from(
        new Set(
          bijaMantras
            .flatMap(m => m.split(','))
            .map(s => s.trim().replace(/[-.,]/g, ''))
            .filter(s => s)
        )
    );
    
    const contextSlokas = JSON.stringify(slokas.map(({ slokaNumber, title, beneficialResults, literalResults }) => ({
        slokaNumber, title, beneficialResults, literalResults
    })), null, 2);

    const prompt = `You are a "Mantra Maharishi," a supreme Vedic scholar and Tantric master with profound knowledge of Shabda Brahman (the ultimate reality in the form of sound). Your task is to synthesize a new, potent mantra from a given set of Bija (seed) Mantras, derived from specific Soundarya Lahari slokas.

CONTEXT:
The Bija Mantras are sourced from the following Soundarya Lahari slokas:
${contextSlokas}

INPUT BIJA MANTRAS:
[${uniqueMantras.join(', ')}]

TASK:
Synthesize these individual Bija Mantras into a single, cohesive, and powerful new mantra. Then, provide a detailed explanation. The entire response must be in ${language}.

CRITICAL INSTRUCTIONS:
1.  **Create the New Mantra:** Do not just list the mantras. Weave them into a new, chantable sequence. Consider the vibrational flow and traditional sequencing rules (e.g., placing certain mantras at the beginning or end).
2.  **Provide a Name:** Give this new combination a fitting Sanskrit-based name that reflects its purpose.
3.  **Explain the Synergy:** Describe how the energies of the individual mantras combine. What unique, amplified effect is created that is greater than the sum of its parts? Reference the original purposes from the sloka context.
4.  **Define Purpose:** Clearly state the core purpose of this new mantra.
5.  **Give Guidance:** Provide brief, practical advice on how and when to chant this mantra for maximum benefit.
6.  **JSON Output:** Your entire response MUST be a single JSON object matching the provided schema. Do not add any text before or after it.

The final output must be in ${language}.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: combinedMantraSchema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the Mantra Maharishi.");
        }
        
        return JSON.parse(jsonText) as CombinedMantraResponse;

    } catch (error) {
        console.error("Error calling Gemini API for mantra creation:", error);
        throw new Error(`Failed to create a combined mantra in ${language}. The divine connection might be weak right now. Please try again.`);
    }
};


export const captureElementAsImage = async (elementToCapture: HTMLElement | null, filename: string): Promise<void> => {
    if (!elementToCapture) {
      console.error("Target element for screenshot not found.");
      throw new Error("Target element for screenshot not found.");
    }
  
    try {
      // Access html2canvas from the global window object, as it's loaded via CDN
      const html2canvas = (window as any).html2canvas;
      if (!html2canvas) {
        console.error("html2canvas library not found. Make sure it's included in your HTML.");
        throw new Error("Screenshot library not loaded.");
      }
  
      const canvas = await html2canvas(elementToCapture, {
        useCORS: true,
        backgroundColor: '#fffbeb', // amber-50, for a consistent background
        onclone: (clonedDoc: Document) => {
          // Find all elements with the gradient text and replace styles for solid text
          // This fixes an issue where html2canvas may not render bg-clip-text correctly
          const gradientElements = clonedDoc.querySelectorAll('.bija-mantra-gradient-text');
          gradientElements.forEach(el => {
              const element = el as HTMLElement;
              // Remove gradient-specific classes
              element.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-amber-700', 'to-red-800');
              // Add a solid text color class
              element.classList.add('text-amber-900');
              // Also apply inline styles for robustness in the cloned environment
              element.style.color = '#78350f'; // Tailwind amber-900
              element.style.backgroundImage = 'none';
              element.style.webkitBackgroundClip = 'border-box';
              element.style.backgroundClip = 'border-box';
          });
        },
      });
  
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Add watermark
        ctx.font = '16px Lora, serif';
        ctx.fillStyle = 'rgba(120, 53, 15, 0.4)'; // amber-900 with opacity
        ctx.textAlign = 'right';
        ctx.fillText('lahari-mantras.ishanoshada.com | github.com/Ishanoshada', canvas.width - 20, canvas.height - 20);
      }
  
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
  
    } catch (error) {
      console.error(`Failed to capture screenshot for ${filename}:`, error);
      alert('Could not capture screenshot. Please try again.');
      throw error; // re-throw to be caught by component's finally block
    }
  };