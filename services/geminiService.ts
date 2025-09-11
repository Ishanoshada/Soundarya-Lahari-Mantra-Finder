import { GoogleGenAI, Type } from "@google/genai";
import { SLOKA_DATA } from "../constants/slokaData";
import { VEDIC_REMEDIES_DATA } from "../constants/remediesData";
import { TANTRA_BOOK_DATA } from "../constants/tantraBookData";
import { MANTRA_BOOK_DATA } from "../constants/mantraBookData";
import { BUDDHIST_CHANTS_DATA } from "../constants/buddhistChantsData";
import { CATHOLIC_PRAYERS_DATA } from "../constants/catholicPrayersData";
import { MEDITATION_GUIDES } from "../constants/meditationData";
import type { Sloka, BijaMantraApiResponse, VedicRemedy, SearchResult, TantraBookMantra, MantraBookItem, ChatMessage, MantraIdentifier, CombinedMantraResponse, BuddhistChant, CatholicPrayer, MeditationGuideData, OccultScienceChapter } from "../types";

// --- API Rate Limiting ---
export const API_LIMIT = 7;
const USAGE_KEY = 'geminiApiUsage';
const SECRET_KEY = "PathToWisdomRequiresPatience";

// Obfuscated keys for localStorage to make direct editing less obvious
const V_KEY = 'd1'; 
const R_KEY = 'd2'; 
const S_KEY = 's1'; 
const C_KEY = 'c';

// Transformation for the shadow count to verify integrity
const transformCount = (count: number): number => (count * 17) + 23;

interface StoredApiUsage {
    [V_KEY]: string; // base64 encoded count
    [R_KEY]: string; // base64 encoded resetTime
    [S_KEY]: string; // base64 encoded shadow count
    [C_KEY]: string; // base64 encoded checksum
}

// Safely decodes a base64 string to a number, returning null on failure
const safeDecode = (str: string): number | null => {
    try {
        const decoded = atob(str);
        const num = parseInt(decoded, 10);
        return isNaN(num) ? null : num;
    } catch (e) {
        return null;
    }
};

// Reads and validates the usage data from localStorage
const readUsage = (): { count: number, resetTime: number } | { tampered: true } => {
    const now = Date.now();
    try {
        const storedItem = localStorage.getItem(USAGE_KEY);
        if (!storedItem) {
            return { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
        }
        
        const parsed: StoredApiUsage = JSON.parse(storedItem);

        if (!parsed[V_KEY] || !parsed[R_KEY] || !parsed[S_KEY] || !parsed[C_KEY]) {
            localStorage.removeItem(USAGE_KEY); // Clean up invalid/old format
            return { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
        }

        const count = safeDecode(parsed[V_KEY]);
        const resetTime = safeDecode(parsed[R_KEY]);
        const shadow = safeDecode(parsed[S_KEY]);
        
        if (count === null || resetTime === null || shadow === null) {
            return { tampered: true };
        }
        
        // Integrity check 1: Shadow count must match the transformed real count
        if (transformCount(count) !== shadow) {
            return { tampered: true };
        }

        // Integrity check 2: Checksum must match the expected value
        const expectedChecksum = btoa(`${parsed[V_KEY]}:${parsed[R_KEY]}:${parsed[S_KEY]}:${SECRET_KEY}`);
        if (parsed[C_KEY] !== expectedChecksum) {
            return { tampered: true };
        }
        
        if (now > resetTime) {
            return { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
        }
        
        return { count, resetTime };
    } catch (e) {
        // Any error during parsing is treated as tampering
        return { tampered: true };
    }
};

export const getApiUsage = (): { count: number; limit: number } => {
    const usage = readUsage();
    if (!('count' in usage)) {
        return { count: API_LIMIT, limit: API_LIMIT };
    }
    return { count: usage.count, limit: API_LIMIT };
};

const checkAndRecordApiUsage = (): void => {
    const usage = readUsage();

    if (!('count' in usage)) {
        const now = Date.now();
        const newResetTime = now + 24 * 60 * 60 * 1000;
        const lockCount = API_LIMIT;
        
        const v = btoa(String(lockCount));
        const r = btoa(String(newResetTime));
        const s = btoa(String(transformCount(lockCount)));
        const c = btoa(`${v}:${r}:${s}:${SECRET_KEY}`);
        
        localStorage.setItem(USAGE_KEY, JSON.stringify({ [V_KEY]: v, [R_KEY]: r, [S_KEY]: s, [C_KEY]: c }));

        throw new Error("The flow of divine energy is based on trust and integrity. Attempting to manipulate the natural order disrupts this connection. True progress comes not from circumvention, but from patience and acceptance. Your access is temporarily paused for reflection.");
    }
    
    let { count, resetTime } = usage;

    if (count >= API_LIMIT) {
        const resetDate = new Date(resetTime).toLocaleString();
        throw new Error(`You have reached your daily limit of ${API_LIMIT} AI interactions. The path to wisdom requires patience. Your connection will be restored around ${resetDate}. Embrace the pause to reflect on the teachings you have already received.`);
    }

    count++;
    
    const v = btoa(String(count));
    const r = btoa(String(resetTime));
    const s = btoa(String(transformCount(count)));
    const c = btoa(`${v}:${r}:${s}:${SECRET_KEY}`);

    const dataToWrite: StoredApiUsage = { [V_KEY]: v, [R_KEY]: r, [S_KEY]: s, [C_KEY]: c };
    localStorage.setItem(USAGE_KEY, JSON.stringify(dataToWrite));
};


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const identifierSchema = {
  type: Type.OBJECT,
  properties: {
    source: { type: Type.STRING, enum: ['Soundarya Lahari', 'Vedic Remedies', 'Mantra Book', 'Buddhist Chants', 'Catholic Prayers', 'Meditation'], description: "The source dataset of the item." },
    identifier: { type: Type.INTEGER, description: "Use 'slokaNumber' for Soundarya Lahari, or 'id' for other sources." },
  },
  required: ['source', 'identifier'],
};

const combinedIdentifierSchema = {
  type: Type.ARRAY,
  items: identifierSchema,
};

export const findMantraForProblem = async (problem: string, combine: boolean): Promise<MantraIdentifier[]> => {
  checkAndRecordApiUsage();
  // To make the prompt more efficient, we only send the fields necessary for matching.
  const slokaDataString = JSON.stringify(SLOKA_DATA.map(({slokaNumber, title, beneficialResults, literalResults}) => ({slokaNumber, title, beneficialResults, literalResults})), null, 2);
  const remediesDataString = JSON.stringify(VEDIC_REMEDIES_DATA.map(({id, title, purpose}) => ({id, title, purpose})), null, 2);
  const mantraBookDataString = JSON.stringify(MANTRA_BOOK_DATA.map(({id, title, category, meaning}) => ({id, title, purpose: `${category}: ${meaning.join(' ')}`})), null, 2);
  const buddhistChantsDataString = JSON.stringify(BUDDHIST_CHANTS_DATA.map(({id, title, english}) => ({id, title, purpose: english.join(' ')})), null, 2);
  const catholicPrayersDataString = JSON.stringify(CATHOLIC_PRAYERS_DATA.map(({id, title, text}) => ({id, title, purpose: text.join(' ')})), null, 2);
  const meditationDataString = JSON.stringify(MEDITATION_GUIDES.map(guide => ({ id: guide.id, title: guide.title, purpose: guide.subtitle })), null, 2);


  const prompt = `You are a wise and compassionate spiritual scholar with deep knowledge of Hindu Vedic traditions, Buddhist philosophy, and Catholic prayers. Your task is to analyze the user's problem and recommend the most appropriate spiritual solution(s) from the provided JSON datasets.

User's Problem: "${problem}"

Analyze the 'beneficialResults', 'literalResults', and 'title' of the slokas, and the 'purpose' and 'title' of other items to find the best match. Buddhist chants and meditations often focus on mental states like peace and loving-kindness. Catholic prayers often address needs for guidance, forgiveness, strength, and intercession. Match these to relevant problems.

${ combine 
    ? "The user wants a powerful, synergistic combination. Please identify the 2 or 3 solutions that work best *together* to solve this problem. You can mix and match from all sources."
    : "Identify all highly relevant items from all datasets that individually address the user's problem. Return a result from each dataset if a strong match is found. Limit the total results to a maximum of 4."
}

CRITICAL INSTRUCTIONS:
1.  Your entire response MUST be a JSON array of objects matching the provided schema. If you find no matches, return an empty array [].
2.  For each recommended item, you must return an object with two fields:
    - "source": Must be one of the exact strings: 'Soundarya Lahari', 'Vedic Remedies', 'Mantra Book', 'Buddhist Chants', 'Catholic Prayers', or 'Meditation'.
    - "identifier": Must be the integer value from the 'slokaNumber' field (for Soundarya Lahari) or the 'id' field (for other sources).
3.  Do NOT return the full text or any other fields. Only return the source and the identifier.

DATASET 1: Soundarya Lahari Slokas
${slokaDataString}

DATASET 2: Vedic Remedies
${remediesDataString}

DATASET 3: Mantra Book
${mantraBookDataString}

DATASET 4: Buddhist Chants
${buddhistChantsDataString}

DATASET 5: Catholic Prayers
${catholicPrayersDataString}

DATASET 6: Meditation Guides
${meditationDataString}
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
    checkAndRecordApiUsage();
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


export const translateSlokas = async (slokas: Sloka[], language: string, skipLimitCheck = false): Promise<Sloka[]> => {
    if (language === 'English' || slokas.length === 0) {
        return slokas;
    }
    
    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
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
    checkAndRecordApiUsage();
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

export const translateVedicRemedies = async (remedies: VedicRemedy[], language: string, skipLimitCheck = false): Promise<VedicRemedy[]> => {
    if (language === 'English' || remedies.length === 0) {
        return remedies;
    }
    
    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
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

export const translateTantraBookMantras = async (mantras: TantraBookMantra[], language: string, skipLimitCheck = false): Promise<TantraBookMantra[]> => {
    if (language === 'English' || mantras.length === 0) {
        return mantras;
    }

    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
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

export const translateMantraBookItems = async (items: MantraBookItem[], language: string, skipLimitCheck = false): Promise<MantraBookItem[]> => {
    if (language === 'English' || items.length === 0) {
        return items;
    }

    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
    }

    const itemsToTranslate = items.map(m => ({
        id: m.id,
        category: m.category,
        title: m.title,
        meaning: m.meaning,
        notes: m.notes
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'category', 'title', and the strings within the 'meaning' and 'notes' arrays.
    
    The 'id' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(itemsToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                meaning: { type: Type.ARRAY, items: { type: Type.STRING } },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'category', 'title', 'meaning']
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
        const translatedData = JSON.parse(jsonText) as Array<Partial<MantraBookItem>>;

        return items.map(originalItem => {
            const translatedPart = translatedData.find(t => t.id === originalItem.id);
            return translatedPart ? { ...originalItem, ...translatedPart } : originalItem;
        });

    } catch (error) {
        console.error("Error calling Gemini API for mantra book translation:", error);
        throw new Error(`Failed to translate the mantra book details into ${language}.`);
    }
};

export const translateBuddhistChants = async (chants: BuddhistChant[], language: string, skipLimitCheck = false): Promise<BuddhistChant[]> => {
    if (language === 'English' || chants.length === 0) {
        return chants;
    }

    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
    }

    const chantsToTranslate = chants.map(c => ({
        id: c.id,
        category: c.category,
        title: c.title,
        english: c.english,
        notes: c.notes
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual and Buddhist texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'category', 'title', and the strings within the 'english' and 'notes' arrays. The 'english' field should be translated to the target language.
    
    The 'id' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(chantsToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                english: { type: Type.ARRAY, items: { type: Type.STRING } },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'category', 'title', 'english']
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
        const translatedData = JSON.parse(jsonText) as Array<Partial<BuddhistChant>>;

        return chants.map(originalChant => {
            const translatedPart = translatedData.find(t => t.id === originalChant.id);
            // We only replace the translated fields, keeping the 'pali' field from the original.
            const updatedChant = { ...originalChant };
            if (translatedPart) {
                if (translatedPart.category) updatedChant.category = translatedPart.category;
                if (translatedPart.title) updatedChant.title = translatedPart.title;
                if (translatedPart.english) updatedChant.english = translatedPart.english;
                if (translatedPart.notes) updatedChant.notes = translatedPart.notes;
            }
            return updatedChant;
        });

    } catch (error) {
        console.error("Error calling Gemini API for Buddhist chant translation:", error);
        throw new Error(`Failed to translate the Buddhist chant details into ${language}.`);
    }
};

export const translateCatholicPrayers = async (prayers: CatholicPrayer[], language: string, skipLimitCheck = false): Promise<CatholicPrayer[]> => {
    if (language === 'English' || prayers.length === 0) {
        return prayers;
    }

    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
    }

    const prayersToTranslate = prayers.map(p => ({
        id: p.id,
        category: p.category,
        title: p.title,
        text: p.text,
        author: p.author,
        source: p.source
    }));

    const prompt = `You are an expert multilingual translator specializing in religious and spiritual texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for the following keys: 'category', 'title', 'author', 'source', and the strings within the 'text' array.
    
    The 'id' key must be preserved as is.
    
    Return ONLY the final translated JSON array. Do not include any other text or explanation in your response.

    JSON to Translate:
    ${JSON.stringify(prayersToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                text: { type: Type.ARRAY, items: { type: Type.STRING } },
                author: { type: Type.STRING },
                source: { type: Type.STRING },
            },
            required: ['id', 'category', 'title', 'text']
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
        const translatedData = JSON.parse(jsonText) as Array<Partial<CatholicPrayer>>;

        return prayers.map(originalPrayer => {
            const translatedPart = translatedData.find(t => t.id === originalPrayer.id);
            return translatedPart ? { ...originalPrayer, ...translatedPart } : originalPrayer;
        });

    } catch (error) {
        console.error("Error calling Gemini API for Catholic prayer translation:", error);
        throw new Error(`Failed to translate the Catholic prayer details into ${language}.`);
    }
};

export const translateMeditationGuides = async (guides: MeditationGuideData[], language: string, skipLimitCheck = false): Promise<MeditationGuideData[]> => {
    if (language === 'English' || guides.length === 0) {
        return guides;
    }
    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
    }

    const guidesToTranslate = guides.map(guide => ({
        id: guide.id,
        content: guide.translations['English'] // Always translate from the English source
    }));

    const prompt = `You are an expert multilingual translator specializing in spiritual and meditation texts.
    Your task is to translate the content of the provided JSON object(s) into ${language}.

    You need to translate the values for 'parent', 'title', 'subtitle', 'safetyNote', and all 'heading' and 'content' strings within the 'sections' array. For content items that are lists or tables, translate all strings within them.

    The 'id' key must be preserved. The structure of the 'sections' array (including types like 'list' or 'table') must be preserved.

    Return ONLY the final translated JSON array. Do not include any other text or explanation.

    JSON to Translate:
    ${JSON.stringify(guidesToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.INTEGER },
                content: {
                    type: Type.OBJECT,
                    properties: {
                        parent: { type: Type.STRING },
                        title: { type: Type.STRING },
                        subtitle: { type: Type.STRING },
                        safetyNote: { type: Type.STRING },
                        sections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    heading: { type: Type.STRING },
                                    content: { type: Type.ARRAY, items: {
                                        oneOf: [
                                            { type: Type.STRING },
                                            {
                                                type: Type.OBJECT,
                                                properties: {
                                                    type: { type: Type.STRING, enum: ['list'] },
                                                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                                                },
                                                required: ['type', 'items']
                                            },
                                            {
                                                type: Type.OBJECT,
                                                properties: {
                                                    type: { type: Type.STRING, enum: ['table'] },
                                                    headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                                                    rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
                                                },
                                                required: ['type', 'headers', 'rows']
                                            }
                                        ]
                                    }}
                                },
                                required: ['heading', 'content']
                            }
                        }
                    },
                    required: ['parent', 'title', 'subtitle', 'sections']
                }
            },
            required: ['id', 'content']
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
        const translatedData = JSON.parse(jsonText) as { id: number; content: any }[];

        return guides.map(originalGuide => {
            const translatedPart = translatedData.find(t => t.id === originalGuide.id);
            if (translatedPart) {
                // Create a new guide object with all translations, updating the specific language
                const newGuide = JSON.parse(JSON.stringify(originalGuide)); // Deep copy
                newGuide.translations[language] = translatedPart.content;
                return newGuide;
            }
            return originalGuide;
        });

    } catch (error) {
        console.error("Error calling Gemini API for meditation guide translation:", error);
        throw new Error(`Failed to translate the meditation guide into ${language}.`);
    }
};

export const translateOccultChapters = async (chapters: OccultScienceChapter[], language: string, skipLimitCheck = false): Promise<OccultScienceChapter[]> => {
    if (language === 'English' || chapters.length === 0) {
        return chapters;
    }

    if (!skipLimitCheck) {
        checkAndRecordApiUsage();
    }

    // Don't send ID to AI
    const chaptersToTranslate = chapters.map(({ id, ...rest }) => rest);

    const prompt = `You are an expert multilingual translator specializing in spiritual and esoteric texts.
    Your task is to translate the text content of the provided JSON object(s) into ${language}.
    
    You must translate the values for 'title' and all string content within the 'content' array. For items within 'content' that are objects (like 'list', 'table', 'subheading'), you must translate the text inside them ('items', 'headers', 'rows', 'text'). Do not translate numbers in table rows.
    
    Preserve the structure of the JSON objects, including the 'type' keys. Return ONLY the final translated JSON array. Do not include any other text or explanation.

    JSON to Translate:
    ${JSON.stringify(chaptersToTranslate, null, 2)}
    `;

    const translationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: {
                    type: Type.ARRAY,
                    items: {
                        oneOf: [
                            { type: Type.STRING },
                            {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, enum: ['list'] },
                                    items: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ['type', 'items']
                            },
                            {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, enum: ['table'] },
                                    headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { oneOf: [{ type: Type.STRING }, { type: Type.NUMBER }] } } }
                                },
                                required: ['type', 'headers', 'rows']
                            },
                            {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, enum: ['subheading'] },
                                    text: { type: Type.STRING }
                                },
                                required: ['type', 'text']
                            }
                        ]
                    }
                }
            },
            required: ['title', 'content']
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
        const translatedData = JSON.parse(jsonText) as Array<Omit<OccultScienceChapter, 'id'>>;

        return chapters.map((originalChapter, index) => {
            const translatedPart = translatedData[index];
            return translatedPart ? { ...originalChapter, ...translatedPart } : originalChapter;
        });

    } catch (error) {
        console.error(`Error calling Gemini API for occult chapter translation into ${language}:`, error);
        throw new Error(`Failed to translate the occult science details into ${language}.`);
    }
};


export const translateSearchResults = async (results: SearchResult[], language: string): Promise<SearchResult[]> => {
    if (language === 'English' || results.length === 0) {
        return results;
    }

    checkAndRecordApiUsage(); // Count this bundle of translations as ONE usage.

    const slokasToTranslate = results.filter((r): r is { type: 'sloka'; data: Sloka } => r.type === 'sloka').map(r => r.data);
    const remediesToTranslate = results.filter((r): r is { type: 'remedy'; data: VedicRemedy } => r.type === 'remedy').map(r => r.data);
    const mantraBookToTranslate = results.filter((r): r is { type: 'mantraBook'; data: MantraBookItem } => r.type === 'mantraBook').map(r => r.data);
    const buddhistChantsToTranslate = results.filter((r): r is { type: 'buddhistChant'; data: BuddhistChant } => r.type === 'buddhistChant').map(r => r.data);
    const catholicPrayersToTranslate = results.filter((r): r is { type: 'catholicPrayer'; data: CatholicPrayer } => r.type === 'catholicPrayer').map(r => r.data);
    const meditationToTranslate = results.filter((r): r is { type: 'meditation'; data: MeditationGuideData } => r.type === 'meditation').map(r => r.data);

    const [translatedSlokas, translatedRemedies, translatedMantraBook, translatedBuddhistChants, translatedCatholicPrayers, translatedMeditations] = await Promise.all([
        slokasToTranslate.length > 0 ? translateSlokas(slokasToTranslate, language, true) : Promise.resolve([]),
        remediesToTranslate.length > 0 ? translateVedicRemedies(remediesToTranslate, language, true) : Promise.resolve([]),
        mantraBookToTranslate.length > 0 ? translateMantraBookItems(mantraBookToTranslate, language, true) : Promise.resolve([]),
        buddhistChantsToTranslate.length > 0 ? translateBuddhistChants(buddhistChantsToTranslate, language, true) : Promise.resolve([]),
        catholicPrayersToTranslate.length > 0 ? translateCatholicPrayers(catholicPrayersToTranslate, language, true) : Promise.resolve([]),
        meditationToTranslate.length > 0 ? translateMeditationGuides(meditationToTranslate, language, true) : Promise.resolve([]),
    ]);

    return results.map(res => {
        if (res.type === 'sloka') {
            const translated = translatedSlokas.find(t => t.slokaNumber === res.data.slokaNumber);
            return { type: 'sloka' as const, data: translated || res.data };
        } else if (res.type === 'remedy') {
            const translated = translatedRemedies.find(t => t.id === res.data.id);
            return { type: 'remedy' as const, data: translated || res.data };
        } else if (res.type === 'mantraBook') {
            const translated = translatedMantraBook.find(t => t.id === res.data.id);
            return { type: 'mantraBook' as const, data: translated || res.data };
        } else if (res.type === 'buddhistChant') {
            const translated = translatedBuddhistChants.find(t => t.id === res.data.id);
            return { type: 'buddhistChant' as const, data: translated || res.data };
        } else if (res.type === 'catholicPrayer') {
            const translated = translatedCatholicPrayers.find(t => t.id === res.data.id);
            return { type: 'catholicPrayer' as const, data: translated || res.data };
        } else if (res.type === 'meditation') {
            const translated = translatedMeditations.find(t => t.id === res.data.id);
            return { type: 'meditation' as const, data: translated || res.data };
        }
        return res;
    });
};

export const getAiChatResponse = async (message: string, history: ChatMessage[], language: string): Promise<string> => {
    checkAndRecordApiUsage();
    const lowercasedMessage = message.toLowerCase().replace(/[?.,]/g, '');

    // Keywords to detect general questions
    const generalQueryKeywords = [
        'help', 'what can you do', 'about this app', 'guide me', 'how to use',
        'what is this', 'types of mantras', 'mantra types', 'what kind of mantras',
        'who are you', 'explain yourself', 'show me'
    ];

    const isGeneralQuery = generalQueryKeywords.some(kw => lowercasedMessage.includes(kw));

    let contextDataString: string;
    let taskInstruction: string;

    if (isGeneralQuery) {
        // Handle general queries by providing an overview of the application and examples
        contextDataString = `
This application is a comprehensive, interactive spiritual guide. When asked about the types of mantras or chants available, you should explain these categories and provide examples from the data below.
This project was created by Ishan Oshada. Visit: ishanoshada.com

**Application Sections:**
1.  **Find Mantra for Problem:** AI search for user problems (Hindu traditions).
2.  **Lookup Sloka:** Browser for the 100 verses of the Soundarya Lahari.
3.  **Vedic Remedies:** A collection from "Infallible Vedic Remedies" by Swami Shantananda Puri.
4.  **Mantra Compendium:** A broad collection from "Mantra" by Govinda Das Aghori.
5.  **Tantric Practices:** Yantras and rituals from "Secrets of Yantra, Mantra and Tantra".
6.  **Buddhist Chants:** A collection of chants in Pāli with English translations.
7.  **Catholic Prayers:** A collection of traditional Catholic prayers.
8.  **Meditation:** Guided meditation practices like Loving-Kindness (Mettā) and Vedic Breathing (Prāṇāyāma).

**Your capabilities as Lahari GPT:**
- You can find specific mantras for user problems (e.g., "mantra for courage").
- You can explain what the different sections of the app are for and what types of practices they contain, using the examples below.
- You can guide users on how to use the features.
- Your knowledge is based *only* on the data within this application.

**EXAMPLE DATA (Use this to answer "what type mantras have"):**

*   **From Soundarya Lahari:** These are verses (slokas) combined with a Bija (seed) mantra for specific benefits.
    *   **Sloka #1:** Title: "Waves of Happiness", Bija Mantra: "Kleem", Purpose: "All prosperity, granting of cherished purposes and solution to intricate problems."
*   **From Vedic Remedies:** These are powerful mantras for various life challenges.
    *   **Remedy #2:** Title: "Dhanvantari Mantra", Purpose: "For all Physical and Mental Diseases".
*   **From Buddhist Chants:** These are devotional and protective chants from the Pāli Canon.
    *   **Chant #308:** Title: "Chant of Loving-Kindness", Purpose: "To radiate kindness over the entire world.".
*   **From Catholic Prayers:** These are devotional prayers from the Christian tradition.
    *   **Prayer #403:** Title: "Our Father", Purpose: "A core Christian prayer for daily needs, forgiveness, and guidance."
*   **From Meditation:**
    *   **Guide #501:** Title: "Loving-Kindness Meditation", Purpose: "Cultivate boundless goodwill and compassion for all living beings."
`;
        taskInstruction = `The user has asked a general question about the application or the types of practices available. Based on the **Application Sections** and **EXAMPLE DATA** provided above, provide a helpful and guiding response. Explain your purpose and what the user can do with this spiritual tool. When asked about mantra/chant types, list the categories and give some specific examples of practices and their purposes from the provided data. Structure the response clearly.`;

    } else {
        // Handle specific queries by filtering relevant practices
        const keywords = lowercasedMessage.split(/\s+/).filter(word => word.length > 2);
        const filterByKeywords = (text: string) => keywords.some(kw => text.toLowerCase().includes(kw));

        const relevantSlokas = SLOKA_DATA.filter(s => filterByKeywords(s.title) || filterByKeywords(s.beneficialResults) || filterByKeywords(s.literalResults)).slice(0, 1);
        const relevantRemedies = VEDIC_REMEDIES_DATA.filter(r => filterByKeywords(r.title) || filterByKeywords(r.purpose)).slice(0, 1);
        const relevantTantra = TANTRA_BOOK_DATA.filter(t => filterByKeywords(t.title) || t.purpose.some(p => filterByKeywords(p))).slice(0, 1);
        const relevantMantraBook = MANTRA_BOOK_DATA.filter(m => filterByKeywords(m.title) || m.meaning.some(p => filterByKeywords(p))).slice(0, 1);
        const relevantBuddhistChants = BUDDHIST_CHANTS_DATA.filter(c => filterByKeywords(c.title) || c.english.join(' ').toLowerCase().includes(lowercasedMessage)).slice(0, 1);
        const relevantCatholicPrayers = CATHOLIC_PRAYERS_DATA.filter(p => filterByKeywords(p.title) || p.text.join(' ').toLowerCase().includes(lowercasedMessage)).slice(0, 1);
        
        const contextData = {
            slokas: relevantSlokas,
            remedies: relevantRemedies,
            tantraPractices: relevantTantra,
            mantraBook: relevantMantraBook,
            buddhistChants: relevantBuddhistChants,
            catholicPrayers: relevantCatholicPrayers,
        };
        contextDataString = JSON.stringify(contextData, null, 2);

        taskInstruction = `Analyze the user's request in the context of our conversation. Then, using ONLY the provided relevant practices from the JSON above, craft a helpful response.
This project was created by Ishan Oshada. Visit: ishanoshada.com
**Response Requirements:**
1.  **Structure:** Use clear markdown categories (e.g., ### Soundarya Lahari Practice).
2.  **Explanation:** Briefly explain WHY the recommendation is suitable by referencing its purpose from the provided JSON data.
3.  **Include Mantra/Chant Text:** This is critical. For each recommendation, you MUST include all relevant texts.
    *   For a 'sloka', include its \`bijaMantra\` and \`slokaText\`.
    *   For 'remedies', 'mantraBook', or 'tantraPractices', list each string from the transliterated mantra array.
    *   For a 'buddhistChant', include the \`pali\` text.
    *   For a 'catholicPrayer', include the full \`text\`.
    *   Format the text clearly, using bolding or italics.
4.  **Conciseness:** Be concise in your explanations, but ensure all required texts are always included.
5.  **Relevance:** If none of the provided practices seem relevant, politely explain that you couldn't find a direct match and ask the user to rephrase their problem.
6.  **Context:** Do not invent new practices or go beyond the provided JSON context.`;
    }
    
    const historyString = history.map(h => `${h.role}: ${h.text}`).join('\n');

    const prompt = `You are "Lahari GPT", an insightful and compassionate spiritual guide with deep knowledge of Soundarya Lahari, Vedic Remedies, Tantric practices, a general Mantra collection, Buddhist Chanting, and Catholic Prayers. Your role is to provide clear, categorized, and actionable guidance based on the user's query and the context provided to you.
This project was created by Ishan Oshada. Visit: ishanoshada.com
**CRITICAL INSTRUCTION: You MUST respond exclusively and entirely in the user's requested language: ${language}. Do not use English unless the user's message is in English and they have not specified another language. Adhere to this language requirement strictly.**

Always respond in a supportive and respectful tone.

Here is our conversation history so far for context:
${historyString}

Here is the user's latest message:
"${message}"

Here is the context for your response:
${contextDataString}

Your Task:
${taskInstruction}
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
    checkAndRecordApiUsage();
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