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

export interface MantraIdentifier {
    source: 'Soundarya Lahari' | 'Vedic Remedies';
    identifier: number;
}

export type SearchResult = 
  | { type: 'sloka'; data: Sloka }
  | { type: 'remedy'; data: VedicRemedy };

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type BookmarkedItem = 
  | { type: 'sloka'; data: Sloka }
  | { type: 'remedy'; data: VedicRemedy }
  | { type: 'tantra'; data: TantraBookMantra };
