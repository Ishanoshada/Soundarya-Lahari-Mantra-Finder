import React, { useState, useEffect, useRef } from 'react';
import { SLOKA_DATA } from '../constants/slokaData';
import { translateSlokas, analyzeSlokas } from '../services/geminiService';
import type { Sloka, BookmarkedItem } from '../types';
import MantraCard from './MantraCard';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import AnalysisDisplay from './AnalysisDisplay';

interface MantraLookupProps {
  onToggleSelect: (mantra: Sloka) => void;
  bookmarkedItems: BookmarkedItem[];
  highlightedSections: Record<string, string[]>;
  onToggleSectionBookmark: (itemData: Sloka, itemType: 'sloka') => (sectionTitle: string) => void;
  onExplainRequest: (slokas: Sloka[]) => void;
  onAnalyzeRequest: (sloka: Sloka) => void;
  language: string;
  initialSelectedId: number | null;
}

const MantraLookup: React.FC<MantraLookupProps> = ({ 
    onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, 
    onExplainRequest, onAnalyzeRequest, language, initialSelectedId 
}) => {
  const [query, setQuery] = useState('');
  const [untranslatedResults, setUntranslatedResults] = useState<Sloka[] | null>(null);
  const [displayResults, setDisplayResults] = useState<Sloka[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const initialLookupPerformed = useRef(false);

  const performLookup = (lookupQuery: string) => {
    setError(null);
    setUntranslatedResults(null);
    setDisplayResults(null);
    setAnalysisResult(null); 
    setAnalysisError(null);

    const trimmedQuery = lookupQuery.trim();

    if (!trimmedQuery) {
        setError("Please enter a Bija Mantra or a Sloka number to look up.");
        return;
    }

    const slokaNumber = parseInt(trimmedQuery, 10);
    if (!isNaN(slokaNumber) && String(slokaNumber) === trimmedQuery) {
        const foundSloka = SLOKA_DATA.find(s => s.slokaNumber === slokaNumber);
        if (foundSloka) {
            setUntranslatedResults([foundSloka]);
        } else {
            setError(`Sloka #${slokaNumber} could not be found.`);
        }
        return;
    }

    const cleanedQuery = trimmedQuery.toLowerCase().replace(/[^a-zāīūṛḷṃḥṣśñṭḍṇṅkhgjhñcchjñtdṇthdnbpmrlvśṣsh]/gi, '');
    const foundSlokas = SLOKA_DATA.filter(sloka => {
        const mantrasInSloka = sloka.bijaMantra
                                .toLowerCase()
                                .split(/, | /)
                                .map(m => m.replace(/[^a-zāīūṛḷṃḥṣśñṭḍṇṅkhgjhñcchjñtdṇthdnbpmrlvśṣsh]/gi, ''));
        return mantrasInSloka.includes(cleanedQuery);
    });

    if (foundSlokas.length > 0) {
        setUntranslatedResults(foundSlokas);
    } else {
        setError(`No slokas found for the Bija Mantra "${trimmedQuery}". Please check the spelling.`);
    }
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
      if (!untranslatedResults || untranslatedResults.length !== 1) return;

      const currentSlokaNumber = untranslatedResults[0].slokaNumber;
      let targetSlokaNumber: number;

      if (direction === 'next') {
          targetSlokaNumber = currentSlokaNumber + 1;
          if (targetSlokaNumber > SLOKA_DATA.length) return;
      } else {
          targetSlokaNumber = currentSlokaNumber - 1;
          if (targetSlokaNumber < 1) return;
      }

      const targetSlokaId = String(targetSlokaNumber);
      setQuery(targetSlokaId);
      performLookup(targetSlokaId);
  };

  useEffect(() => {
    // This effect handles the initial lookup from a shared URL or bookmark click
    if (initialSelectedId && !initialLookupPerformed.current) {
        const idString = String(initialSelectedId);
        setQuery(idString);
        performLookup(idString);
        initialLookupPerformed.current = true;
    }
    // We only want this to run based on the initialSelectedId, not the query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedId]);
  
  // Reset the ref if the component is viewed without an initial ID, allowing it to work again later
  useEffect(() => {
    if (!initialSelectedId) {
        initialLookupPerformed.current = false;
    }
  }, [initialSelectedId]);


  useEffect(() => {
    const translateResults = async () => {
      if (!untranslatedResults || untranslatedResults.length === 0) {
        setDisplayResults(untranslatedResults);
        return;
      }
      
      if (language === 'English') {
        setDisplayResults(untranslatedResults);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const translated = await translateSlokas(untranslatedResults, language);
        setDisplayResults(translated);
      } catch (err: any) {
        setError(err.message);
        setDisplayResults(untranslatedResults);
      } finally {
        setIsLoading(false);
      }
    };

    translateResults();
  }, [untranslatedResults, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initialLookupPerformed.current = true; // Mark as user-interacted
    performLookup(query);
  };

  const handleAnalyze = async () => {
    if (!displayResults || displayResults.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSlokas(displayResults, language);
      setAnalysisResult(result);
    } catch (err: any) {
      setAnalysisError(err.message || "An error occurred while generating the analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
      <form onSubmit={handleSubmit} className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60">
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Bija Mantra (e.g., Kleem) or Sloka #"
              className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-transparent focus:outline-none flex-grow"
              disabled={isLoading || isAnalyzing}
            />
            <button
              type="submit"
              disabled={isLoading || isAnalyzing}
              className="w-full sm:w-auto px-8 py-3 bg-amber-800 text-white font-bold rounded-full hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Translating...' : 'Lookup'}
            </button>
        </div>
      </form>

      {displayResults && !isLoading && !analysisResult && (
        <div className="my-6 text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-6 py-2 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md"
          >
            {isAnalyzing ? 'Analyzing...' : 'Get Deeper Insight'}
          </button>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && <ErrorMessage message={error} />}

        {isAnalyzing && <LoadingSpinner />}
        {analysisError && !isAnalyzing && <ErrorMessage message={analysisError} />}
        {analysisResult && !isAnalyzing && <AnalysisDisplay text={analysisResult} />}

        {displayResults && !isLoading && displayResults.map(mantra => {
          const bookmarkedItem = bookmarkedItems.find(i => i.type === 'sloka' && i.data.slokaNumber === mantra.slokaNumber);
          const isSelected = !!bookmarkedItem;
          const bookmarkedSections = bookmarkedItem?.sections || [];
          const highlightKey = `sloka_${mantra.slokaNumber}`;

          return (
            <MantraCard
              key={mantra.slokaNumber}
              mantra={mantra}
              onToggleSelect={onToggleSelect}
              isSelected={isSelected}
              bookmarkedSections={bookmarkedSections}
              highlightedSections={highlightedSections[highlightKey] || []}
              onToggleSectionBookmark={onToggleSectionBookmark(mantra, 'sloka')}
              onExplainRequest={() => onExplainRequest([mantra])}
              onAnalyzeRequest={onAnalyzeRequest} />
          );
        })}

        {displayResults && displayResults.length === 1 && !isLoading && (
            <div className="flex justify-between items-center mt-4 px-2">
                <button
                    onClick={() => handleNavigation('prev')}
                    disabled={displayResults[0].slokaNumber <= 1}
                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous Sloka"
                >
                    &larr; Previous Sloka
                </button>
                <span className="text-sm text-amber-700 font-medium">Sloka {displayResults[0].slokaNumber} / {SLOKA_DATA.length}</span>
                <button
                    onClick={() => handleNavigation('next')}
                    disabled={displayResults[0].slokaNumber >= SLOKA_DATA.length}
                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next Sloka"
                >
                    Next Sloka &rarr;
                </button>
            </div>
        )}
        
        {!error && !displayResults && !isLoading && (
            <div className="text-center text-amber-700 mt-16 text-lg">
                <p>Look up a Bija Mantra to see its associated slokas,</p>
                <p className="mt-2 text-base">or enter a Sloka number to view its details directly.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MantraLookup;