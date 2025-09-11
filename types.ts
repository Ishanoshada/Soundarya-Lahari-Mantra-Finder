

export interface Sloka {
  slokaNumber: number;
  title: string;
  bijaMantra: string;
  slokaText: string;
  goddess: string;
  modeOfWorship: string;
  beneficialResults: string;
  literalResults: string;
}

export interface BijaMantraExplanation {
  bijaMantra: string;
  associatedDeity: string;
  associatedChakra: string;
  usageAndBenefits: string;
  associatedShlokas: string;
}

export interface BijaMantraTableHeaders {
  bijaMantra: string;
  associatedDeity: string;
  associatedChakra: string;
  usageAndBenefits: string;
  associatedShlokas: string;
}

export interface BijaMantraApiResponse {
  tableHeaders: BijaMantraTableHeaders;
  explanations: BijaMantraExplanation[];
}

export interface VedicRemedy {
  id: number;
  title: string;
  purpose: string;
  sanskritMantra?: string[];
  transliteratedMantra: string[];
  chantingInstruction?: string;
  notes?: string[];
  source: string;
}

export interface TantraBookMantra {
  id: number;
  category: string;
  title: string;
  purpose: string[];
  transliteratedMantra: string[];
  instructions: string;
  notes?: string[];
  source: "Secrets of Yantra, Mantra and Tantra";
}

export interface MantraBookItem {
  id: number;
  category: string;
  title: string;
  sanskrit?: string[];
  transliteration: string[];
  meaning: string[];
  notes?: string[];
  source: "Mantra by Govinda Das Aghori";
}

export interface BuddhistChant {
  id: number;
  category: string;
  title: string;
  pali: string[];
  english: string[];
  source: "Buddhist Chanting Book";
  notes?: string[];
}

export interface CatholicPrayer {
  id: number;
  category: string;
  title: string;
  text: string[];
  author?: string;
  source?: string;
}

export interface MeditationGuideContent {
    parent: string;
    title: string;
    subtitle: string;
    safetyNote?: string;
    sections: {
        heading: string;
        content: (string | { type: 'list'; items: string[] } | { type: 'table'; headers: string[]; rows: string[][] })[];
    }[];
}

export interface MeditationGuideData {
    id: number;
    title: string; // English title for list view
    subtitle: string; // English subtitle for list view
    icon: string; // Emoji icon
    category: 'Buddhist' | 'Vedic';
    translations: Record<string, MeditationGuideContent>;
}


export interface AudioTrack {
    id: 'lahari' | 'pirith';
    title: string;
    subtitle: string;
    audioSrc: string;
}

export interface BackgroundMusicTrack {
  id: string;
  name: string;
  src: string;
}

export type SearchResult = 
  | { type: 'sloka'; data: Sloka }
  | { type: 'remedy'; data: VedicRemedy }
  | { type: 'mantraBook'; data: MantraBookItem }
  | { type: 'buddhistChant'; data: BuddhistChant }
  | { type: 'catholicPrayer'; data: CatholicPrayer }
  | { type: 'meditation'; data: MeditationGuideData };

export interface MantraIdentifier {
  source: 'Soundarya Lahari' | 'Vedic Remedies' | 'Mantra Book' | 'Buddhist Chants' | 'Catholic Prayers' | 'Meditation';
  identifier: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type BookmarkedItem = 
  | { type: 'sloka'; data: Sloka; sections?: string[] }
  | { type: 'remedy'; data: VedicRemedy; sections?: string[] }
  | { type: 'tantra'; data: TantraBookMantra; sections?: string[] }
  | { type: 'mantraBook'; data: MantraBookItem; sections?: string[] }
  | { type: 'buddhistChant'; data: BuddhistChant; sections?: string[] }
  | { type: 'catholicPrayer'; data: CatholicPrayer; sections?: string[] }
  | { type: 'meditation'; data: MeditationGuideData }
  | { type: 'audio'; data: AudioTrack };

export interface CombinedMantraResponse {
    newMantra: string;
    mantraName: string;
    corePurpose: string;
    synergisticBenefits: string;
    chantingGuidance: string;
}

// Type for the structured content of a research summary
export type ResearchSummaryContentType =
  | { type: 'paragraphs'; content: string[] }
  | { type: 'list'; content: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface ResearchSummarySection {
  heading: string;
  content: ResearchSummaryContentType;
}

export interface ResearchSummary {
  id: number;
  title: string;
  authors: string;
  year: string;
  source: string;
  sourceUrl: string;
  doi?: string;
  citations?: string;
  lastUpdated?: string;
  affiliation?: string;
  summarySections: ResearchSummarySection[];
}