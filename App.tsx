import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MantraCard from './components/MantraCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CombinedSelections from './components/CombinedMantras';
import BijaMantraExplainer from './components/BijaMantraExplainer';
import IntroModal from './components/IntroModal';
import MantraLookup from './components/MantraLookup';
import ScreenshotButton from './components/ScreenshotButton';
import VedicRemedies from './components/VedicRemedies';
import RemedyCard from './components/RemedyCard';
import TantraBook from './components/TantraBook';
import AIChat from './components/AIChat';
import BookmarkManager from './components/BookmarkManager';
import SlokaAnalysisModal from './components/SlokaAnalysisModal';
import { findMantraForProblem, translateSearchResults } from './services/geminiService';
import { SLOKA_DATA } from './constants/slokaData';
import { VEDIC_REMEDIES_DATA } from './constants/remediesData';
import { TANTRA_BOOK_DATA } from './constants/tantraBookData';
import type { Sloka, SearchResult, VedicRemedy, TantraBookMantra, BookmarkedItem } from './types';

const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Malayalam"];
const CODE_LANG_MAP: { [key: string]: string } = {
    'en': 'English',
    'si': 'Sinhala',
    'ta': 'Tamil',
    'hi': 'Hindi',
    'ml': 'Malayalam'
};
type AppMode = 'find' | 'lookup' | 'vedic' | 'tantraBook' | 'aiChat';


// --- Search Results Component ---
interface SearchResultsProps {
  results: SearchResult[];
  onToggleSelect: (mantra: Sloka) => void;
  isSelected: (mantra: Sloka) => boolean;
  onExplainRequest: (slokas: Sloka[]) => void;
  onAnalyzeRequest: (sloka: Sloka) => void;
  onToggleRemedy: (remedy: VedicRemedy) => void;
  isRemedySelected: (remedy: VedicRemedy) => boolean;
}

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const SearchResults: React.FC<SearchResultsProps> = ({ results, onToggleSelect, isSelected, onExplainRequest, onAnalyzeRequest, onToggleRemedy, isRemedySelected }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (results.length === 1) {
        const result = results[0];
        if (result.type === 'sloka') {
            return (
                <MantraCard
                    mantra={result.data}
                    onToggleSelect={onToggleSelect}
                    isSelected={isSelected(result.data)}
                    onExplainRequest={() => onExplainRequest([result.data])}
                    onAnalyzeRequest={onAnalyzeRequest}
                />
            );
        } else { // type is 'remedy'
            return <RemedyCard remedy={result.data} onToggleSelect={onToggleRemedy} isSelected={isRemedySelected(result.data)} />;
        }
    }

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 animate-fade-in">
            <p className="text-center text-amber-800 text-lg font-semibold px-4">
                The divine wisdom suggests a combination of {results.length} synergistic remedies for your situation:
            </p>
            {results.map((result, index) => {
                const key = result.type === 'sloka' ? result.data.slokaNumber : result.data.id;
                const title = result.data.title;
                const identifier = result.type === 'sloka' 
                    ? `Sloka #${result.data.slokaNumber}` 
                    : `Remedy #${result.data.id}`;

                return (
                    <div key={`${result.type}-${key}`} className="border border-amber-300/50 rounded-xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md">
                        <button
                            onClick={() => handleToggle(index)}
                            className="w-full text-left p-4 md:p-5 flex justify-between items-center hover:bg-amber-100/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                            aria-expanded={openIndex === index}
                            aria-controls={`content-${key}`}
                        >
                            <h3 className="text-xl font-bold text-amber-900">{`${identifier}: ${title}`}</h3>
                            <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                <ChevronDownIcon />
                            </div>
                        </button>
                        {openIndex === index && (
                            <div id={`content-${key}`} className="border-t border-amber-200 animate-accordion-content">
                                {result.type === 'sloka' ? (
                                    <MantraCard
                                        mantra={result.data}
                                        onToggleSelect={onToggleSelect}
                                        isSelected={isSelected(result.data)}
                                        onExplainRequest={() => onExplainRequest([result.data])}
                                        onAnalyzeRequest={onAnalyzeRequest}
                                        isNested={true}
                                    />
                                ) : (
                                    <div className="p-6 md:p-8">
                                        <RemedyCard 
                                            remedy={result.data} 
                                            onToggleSelect={onToggleRemedy} 
                                            isSelected={isRemedySelected(result.data)} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};


const App: React.FC = () => {
  // Core data states
  const [untranslatedMantraResults, setUntranslatedMantraResults] = useState<SearchResult[] | null>(null);
  const [mantraResults, setMantraResults] = useState<SearchResult[] | null>(null); // For display
  
  // Selection states
  const [bookmarkedItem, setBookmarkedItem] = useState<BookmarkedItem | null>(null);
  
  // UI/Flow states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [slokasToExplain, setSlokasToExplain] = useState<Sloka[] | null>(null);
  const [slokaToAnalyze, setSlokaToAnalyze] = useState<Sloka | null>(null);
  const [language, setLanguage] = useState('English');
  const [showIntroModal, setShowIntroModal] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>('find');
  const [searchParams, setSearchParams] = useState<{query: string, combine: boolean} | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialViewTarget, setInitialViewTarget] = useState<{ mode: AppMode, id: number } | null>(null);

  // Effect for loading bookmarked items from URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const langCode = urlParams.get('lan');
    if (langCode && CODE_LANG_MAP[langCode]) {
        setLanguage(CODE_LANG_MAP[langCode]);
    }

    const slokaId = urlParams.get('slokas')?.split(',').map(Number).filter(n => !isNaN(n))[0];
    const remedyId = urlParams.get('remedies')?.split(',').map(Number).filter(n => !isNaN(n))[0];
    const tantraId = urlParams.get('tantra')?.split(',').map(Number).filter(n => !isNaN(n))[0];

    const bookmarkedSloka = slokaId ? SLOKA_DATA.find(s => s.slokaNumber === slokaId) : undefined;
    const bookmarkedRemedy = remedyId ? VEDIC_REMEDIES_DATA.find(r => r.id === remedyId) : undefined;
    const bookmarkedTantra = tantraId ? TANTRA_BOOK_DATA.find(t => t.id === tantraId) : undefined;

    if (bookmarkedSloka) {
        const item: BookmarkedItem = { type: 'sloka', data: bookmarkedSloka };
        setBookmarkedItem(item);
        setUntranslatedMantraResults([item]); // Also show it in main view
        setMode('find');
    } else if (bookmarkedRemedy) {
        setBookmarkedItem({ type: 'remedy', data: bookmarkedRemedy });
        setMode('vedic');
        setInitialViewTarget({ mode: 'vedic', id: bookmarkedRemedy.id });
    } else if (bookmarkedTantra) {
        setBookmarkedItem({ type: 'tantra', data: bookmarkedTantra });
        setMode('tantraBook');
        setInitialViewTarget({ mode: 'tantraBook', id: bookmarkedTantra.id });
    }

    if (slokaId || remedyId || tantraId) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsInitialLoad(false);
  }, []); // Empty dependency array ensures it runs only once.


  const handleSearch = (query: string, combine: boolean) => {
    setUntranslatedMantraResults(null);
    setMantraResults(null);
    setSearchParams({ query, combine });
  };

  // Effect to perform AI search
  useEffect(() => {
    if (searchParams === null || isInitialLoad) {
      return;
    }
    const performSearch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const identifiers = await findMantraForProblem(searchParams.query, searchParams.combine);
            if (identifiers.length === 0) {
                setUntranslatedMantraResults([]);
                return;
            }

            const localResults: SearchResult[] = identifiers.map(item => {
                if (item.source === 'Soundarya Lahari') {
                    const sloka = SLOKA_DATA.find(s => s.slokaNumber === item.identifier);
                    return sloka ? { type: 'sloka' as const, data: sloka } : null;
                } else { // 'Vedic Remedies'
                    const remedy = VEDIC_REMEDIES_DATA.find(r => r.id === item.identifier);
                    return remedy ? { type: 'remedy' as const, data: remedy } : null;
                }
            }).filter((item): item is SearchResult => item !== null);
            
            if (localResults.length === 0) {
                 throw new Error("The AI returned identifiers that could not be found in our records.");
            }
            setUntranslatedMantraResults(localResults);

        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
            setUntranslatedMantraResults(null);
        } finally {
            setIsLoading(false);
        }
    };
    performSearch();
  }, [searchParams, isInitialLoad]);

  // Effect to handle translation when untranslated results or language changes
  useEffect(() => {
      if (isInitialLoad) return;
      if (!untranslatedMantraResults) {
          setMantraResults(null);
          return;
      }

      const translate = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const translated = await translateSearchResults(untranslatedMantraResults, language);
              setMantraResults(translated);
          } catch (e: any) {
              setError(e.message);
              setMantraResults(untranslatedMantraResults); // Fallback to English on error
          } finally {
              setIsLoading(false);
          }
      };
      translate();
  }, [untranslatedMantraResults, language, isInitialLoad]);
  
  const handleToggleMantra = (mantraToToggle: Sloka) => {
    const newItem: BookmarkedItem = { type: 'sloka', data: mantraToToggle };
    if (bookmarkedItem?.type === 'sloka' && bookmarkedItem.data.slokaNumber === mantraToToggle.slokaNumber) {
      setBookmarkedItem(null);
    } else {
      setBookmarkedItem(newItem);
    }
  };

  const handleToggleRemedy = (remedyToToggle: VedicRemedy) => {
    const newItem: BookmarkedItem = { type: 'remedy', data: remedyToToggle };
    if (bookmarkedItem?.type === 'remedy' && bookmarkedItem.data.id === remedyToToggle.id) {
        setBookmarkedItem(null);
    } else {
        setBookmarkedItem(newItem);
    }
  };

  const handleToggleTantraMantra = (mantraToToggle: TantraBookMantra) => {
    const newItem: BookmarkedItem = { type: 'tantra', data: mantraToToggle };
    if (bookmarkedItem?.type === 'tantra' && bookmarkedItem.data.id === mantraToToggle.id) {
        setBookmarkedItem(null);
    } else {
        setBookmarkedItem(newItem);
    }
  };

  const isMantraSelected = (mantra: Sloka) => bookmarkedItem?.type === 'sloka' && bookmarkedItem.data.slokaNumber === mantra.slokaNumber;
  const isRemedySelected = (remedy: VedicRemedy) => bookmarkedItem?.type === 'remedy' && bookmarkedItem.data.id === remedy.id;
  const isTantraMantraSelected = (mantra: TantraBookMantra) => bookmarkedItem?.type === 'tantra' && bookmarkedItem.data.id === mantra.id;


  const handleExplainRequest = (slokas: Sloka[]) => {
    setSlokasToExplain(slokas);
  };
  
  const handleAnalyzeRequest = (sloka: Sloka) => {
    setSlokaToAnalyze(sloka);
  };

  const handleCloseExplainer = () => {
    setSlokasToExplain(null);
  };
  
  const handleCloseAnalysis = () => {
    setSlokaToAnalyze(null);
  };

  const renderNavButton = (buttonMode: AppMode, text: string, index: number) => (
    <button
      onClick={() => setMode(buttonMode)}
      className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 animate-landing animate-fade-in ${
        mode === buttonMode
          ? 'bg-amber-800 text-white shadow-md'
          : 'bg-white/80 text-amber-800 hover:bg-amber-100'
      }`}
      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
      aria-pressed={mode === buttonMode}
    >
      {text}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-slate-800 p-4 sm:p-8 flex flex-col items-center">
      <main className="w-full">
        <Header />
         <div className="text-center mb-4 animate-landing animate-fade-in" style={{ animationDelay: '0.4s' }}>
             <button
                onClick={() => setShowIntroModal(true)}
                className="text-amber-800 hover:text-amber-900 underline transition-colors"
                aria-label="Learn more about Soundarya Lahari"
             >
                What is Soundarya Lahari?
             </button>
         </div>

        <div className="flex justify-center flex-wrap gap-4 my-6">
          {renderNavButton('find', 'Find Mantra for Problem', 0)}
          {renderNavButton('lookup', 'Lookup Mantra or Sloka', 1)}
          {renderNavButton('vedic', 'Vedic Remedies', 2)}
          {renderNavButton('tantraBook', 'Mantra Compendium', 3)}
          {renderNavButton('aiChat', 'AI Chat Guide', 4)}
        </div>

        <div className="w-full max-w-xl mx-auto mb-4 flex justify-center items-center gap-4 animate-landing animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <div>
              <label htmlFor="language-select" className="text-amber-800 font-medium mr-2">Select Language:</label>
              <select 
                  id="language-select"
                  value={language} 
                  onChange={e => setLanguage(e.target.value)}
                  className="p-2 border border-amber-300 rounded-lg shadow-sm bg-white/80 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  aria-label="Select language for results"
                  disabled={isLoading}
              >
                  {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
            </div>
            <BookmarkManager
              bookmarkedItem={bookmarkedItem}
              language={language}
            />
        </div>

        {mode === 'find' && (
          <>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <div className="mt-8 space-y-8">
              {isLoading && <LoadingSpinner />}
              {error && !isLoading && <ErrorMessage message={error} />}
              {mantraResults && !isLoading && (
                <SearchResults
                  results={mantraResults}
                  onToggleSelect={handleToggleMantra}
                  isSelected={isMantraSelected}
                  onExplainRequest={handleExplainRequest}
                  onAnalyzeRequest={handleAnalyzeRequest}
                  onToggleRemedy={handleToggleRemedy}
                  isRemedySelected={isRemedySelected}
                />
              )}
              {!isLoading && !error && !mantraResults && !untranslatedMantraResults && (
                 <div className="text-center text-amber-700 mt-16 text-lg">
                    <p>Welcome to your guide to divine mantras.</p>
                    <p className="mt-2 text-base">Describe your problem above or select an intention to begin your journey.</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {mode === 'lookup' && (
           <MantraLookup 
                onToggleSelect={handleToggleMantra}
                isSelected={isMantraSelected}
                onExplainRequest={handleExplainRequest}
                onAnalyzeRequest={handleAnalyzeRequest}
                language={language}
            />
        )}

        {mode === 'vedic' && (
           <VedicRemedies 
                onToggleSelect={handleToggleRemedy}
                isRemedySelected={isRemedySelected}
                language={language}
                initialSelectedId={initialViewTarget?.mode === 'vedic' ? initialViewTarget.id : null}
           />
        )}

        {mode === 'tantraBook' && (
           <TantraBook 
                onToggleSelect={handleToggleTantraMantra}
                isTantraMantraSelected={isTantraMantraSelected}
                language={language}
                initialSelectedId={initialViewTarget?.mode === 'tantraBook' ? initialViewTarget.id : null}
           />
        )}

        {mode === 'aiChat' && (
            <AIChat language={language} />
        )}
      </main>
      
      {bookmarkedItem && (
        <CombinedSelections 
            bookmarkedItem={bookmarkedItem}
            onRemoveBookmark={() => setBookmarkedItem(null)}
            onExplainRequest={(slokas) => handleExplainRequest(slokas)}
        />
      )}

      {slokasToExplain && (
        <BijaMantraExplainer
          slokas={slokasToExplain}
          onClose={handleCloseExplainer}
        />
      )}
      
      {slokaToAnalyze && (
        <SlokaAnalysisModal 
          sloka={slokaToAnalyze}
          language={language}
          onClose={handleCloseAnalysis}
        />
      )}

      {showIntroModal && (
        <IntroModal onClose={() => setShowIntroModal(false)} />
      )}

      <footer className="mt-auto pt-8 text-center text-amber-700/80 text-sm animate-landing animate-slide-in-up" style={{ animationDelay: '1.5s' }}>
        <div className="mb-4 flex justify-center">
            <ScreenshotButton />
        </div>
        <p>This tool is for spiritual guidance and exploration. Always consult with a qualified professional for serious life matters.</p>
        <div className="flex justify-center items-center gap-4 mt-2">
            <a href="https://ishanoshada.com/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 underline transition-colors">ishanoshada.com</a>
            <span>|</span>
            <a href="https://github.com/Ishanoshada/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 underline transition-colors">GitHub</a>
        </div>
        <p className="mt-2">&copy; 2024 Divine Guidance Systems</p>
      </footer>
    </div>
  );
};

export default App;
