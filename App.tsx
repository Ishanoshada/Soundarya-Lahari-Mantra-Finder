import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MantraCard from './components/MantraCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import CombinedSelections from './components/CombinedSelections';
import BijaMantraExplainer from './components/BijaMantraExplainer';
import IntroModal from './components/IntroModal';
import MantraLookup from './components/MantraLookup';
import ScreenshotButton from './components/ScreenshotButton';
import VedicRemedies from './components/VedicRemedies';
import RemedyCard from './components/RemedyCard';
import TantraBook from './components/TantraBook';
import MantraBook from './components/MantraBook';
import MantraBookCard from './components/MantraBookCard';
import AIChat from './components/AIChat';
import BookmarkManager from './components/BookmarkManager';
import SlokaAnalysisModal from './components/SlokaAnalysisModal';
import CombinedMantraModal from './components/CombinedMantraModal';
import BookmarkToggleButton from './components/BookmarkToggleButton';
import HowToUseModal from './components/HowToUseModal';
import AudioLibrary from './components/AudioLibrary';
import ResearchSummaries from './components/ResearchSummaries';
import { findMantraForProblem, translateSearchResults, getApiUsage, API_LIMIT } from './services/geminiService';
import { SLOKA_DATA } from './constants/slokaData';
import { VEDIC_REMEDIES_DATA } from './constants/remediesData';
import { TANTRA_BOOK_DATA } from './constants/tantraBookData';
import { MANTRA_BOOK_DATA } from './constants/mantraBookData';
import { BUDDHIST_CHANTS_DATA } from './constants/buddhistChantsData';
import { AUDIO_TRACKS } from './constants/audioData';
import { BACKGROUND_MUSIC_TRACKS } from './constants/backgroundMusicData';
import BuddhistChantCard from './components/BuddhistChantCard';
import BuddhistChants from './components/BuddhistChants';
import type { Sloka, SearchResult, VedicRemedy, TantraBookMantra, MantraBookItem, BookmarkedItem, BuddhistChant, AudioTrack, BackgroundMusicTrack } from './types';

const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Malayalam"];
const CODE_LANG_MAP: { [key: string]: string } = {
    'en': 'English',
    'si': 'Sinhala',
    'ta': 'Tamil',
    'hi': 'Hindi',
    'ml': 'Malayalam'
};
type AppMode = 'find' | 'lookup' | 'vedic' | 'tantraBook' | 'mantraBook' | 'buddhistChants' | 'listen' | 'aiChat' | 'research';

const formatTitleForDisplay = (title: string): string => {
    return title.replace(/\s*-\s*\d+$/, '').trim();
};

// --- Search Results Component ---
interface SearchResultsProps {
  results: SearchResult[];
  bookmarkedItems: BookmarkedItem[];
  highlightedSections: Record<string, string[]>;
  onToggleSloka: (sloka: Sloka) => void;
  onToggleRemedy: (remedy: VedicRemedy) => void;
  onToggleMantraBookItem: (item: MantraBookItem) => void;
  onToggleBuddhistChant: (item: BuddhistChant) => void;
  onToggleSlokaSection: (sloka: Sloka, sectionTitle: string) => void;
  onToggleRemedySection: (remedy: VedicRemedy, sectionTitle: string) => void;
  onToggleMantraBookSection: (item: MantraBookItem, sectionTitle: string) => void;
  onToggleBuddhistChantSection: (item: BuddhistChant, sectionTitle: string) => void;
  onExplainRequest: (slokas: Sloka[]) => void;
  onAnalyzeRequest: (sloka: Sloka) => void;
}

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const SearchResults: React.FC<SearchResultsProps> = (props) => {
    const { 
        results, bookmarkedItems, highlightedSections, 
        onToggleSloka, onToggleRemedy, onToggleMantraBookItem, onToggleBuddhistChant,
        onToggleSlokaSection, onToggleRemedySection, onToggleMantraBookSection, onToggleBuddhistChantSection,
        onExplainRequest, onAnalyzeRequest 
    } = props;
    
    const [openIndex, setOpenIndex] = useState<number | null>(() => {
        const firstHighlightedIndex = results.findIndex(result => {
            let key;
            switch (result.type) {
                case 'sloka': key = `sloka_${result.data.slokaNumber}`; break;
                case 'remedy': key = `remedy_${result.data.id}`; break;
                case 'mantraBook': key = `mantraBook_${result.data.id}`; break;
                case 'buddhistChant': key = `buddhistChant_${result.data.id}`; break;
                default: return false;
            }
            return highlightedSections && highlightedSections[key];
        });
        return firstHighlightedIndex !== -1 ? firstHighlightedIndex : 0;
    });


    if (results.length === 1) {
        const result = results[0];
        const isBookmarked = (item: SearchResult) => bookmarkedItems.some(i => 
            i.type === item.type && 
            ('slokaNumber' in i.data ? i.data.slokaNumber : i.data.id) === ('slokaNumber' in item.data ? item.data.slokaNumber : item.data.id)
        );
        const bookmarkedItem = bookmarkedItems.find(i => i.type === result.type && ('slokaNumber' in i.data ? i.data.slokaNumber : i.data.id) === ('slokaNumber' in result.data ? result.data.slokaNumber : result.data.id));
        
        const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];

        let highlightKey: string = '';
        switch (result.type) {
            case 'sloka': highlightKey = `sloka_${result.data.slokaNumber}`; break;
            case 'remedy': highlightKey = `remedy_${result.data.id}`; break;
            case 'mantraBook': highlightKey = `mantraBook_${result.data.id}`; break;
            case 'buddhistChant': highlightKey = `buddhistChant_${result.data.id}`; break;
        }

        switch (result.type) {
            case 'sloka':
                return <MantraCard mantra={result.data} onToggleSelect={() => onToggleSloka(result.data)} isSelected={isBookmarked(result)} bookmarkedSections={bookmarkedSections} highlightedSections={highlightedSections[highlightKey] || []} onToggleSectionBookmark={(title) => onToggleSlokaSection(result.data, title)} onExplainRequest={() => onExplainRequest([result.data])} onAnalyzeRequest={onAnalyzeRequest} />;
            case 'remedy':
                return <RemedyCard remedy={result.data} onToggleSelect={() => onToggleRemedy(result.data)} isSelected={isBookmarked(result)} bookmarkedSections={bookmarkedSections} highlightedSections={highlightedSections[highlightKey] || []} onToggleSectionBookmark={(title) => onToggleRemedySection(result.data, title)} />;
            case 'mantraBook':
                return <div className="p-0 md:p-0"><MantraBookCard mantra={result.data} onToggleSelect={() => onToggleMantraBookItem(result.data)} isSelected={isBookmarked(result)} bookmarkedSections={bookmarkedSections} highlightedSections={highlightedSections[highlightKey] || []} onToggleSectionBookmark={(title) => onToggleMantraBookSection(result.data, title)} /></div>;
            case 'buddhistChant':
                return <div className="p-0 md:p-0"><BuddhistChantCard chant={result.data} onToggleSelect={() => onToggleBuddhistChant(result.data)} isSelected={isBookmarked(result)} bookmarkedSections={bookmarkedSections} highlightedSections={highlightedSections[highlightKey] || []} onToggleSectionBookmark={(title) => onToggleBuddhistChantSection(result.data, title)} /></div>;
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
                let key, title, identifier, highlightKey;
                switch (result.type) {
                    case 'sloka':
                        key = result.data.slokaNumber;
                        title = formatTitleForDisplay(result.data.title);
                        identifier = `Sloka #${key}`;
                        highlightKey = `sloka_${key}`;
                        break;
                    case 'remedy':
                        key = result.data.id;
                        title = result.data.title;
                        identifier = `Remedy #${key}`;
                        highlightKey = `remedy_${key}`;
                        break;
                    case 'mantraBook':
                        key = result.data.id;
                        title = result.data.title;
                        identifier = `Compendium #${key}`;
                        highlightKey = `mantraBook_${key}`;
                        break;
                    case 'buddhistChant':
                        key = result.data.id;
                        title = result.data.title;
                        identifier = `Chant #${key}`;
                        highlightKey = `buddhistChant_${key}`;
                        break;
                }

                const bookmarkedItem = bookmarkedItems.find(i => i.type === result.type && ('slokaNumber' in i.data ? i.data.slokaNumber : i.data.id) === key);
                const isSelected = !!bookmarkedItem;
                const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];
                const highlightedSectionsList = highlightedSections[highlightKey] || [];
                
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
                                        onToggleSelect={() => onToggleSloka(result.data)}
                                        isSelected={isSelected}
                                        bookmarkedSections={bookmarkedSections}
                                        highlightedSections={highlightedSectionsList}
                                        onToggleSectionBookmark={(sectionTitle) => onToggleSlokaSection(result.data, sectionTitle)}
                                        onExplainRequest={() => onExplainRequest([result.data])}
                                        onAnalyzeRequest={onAnalyzeRequest}
                                        isNested={true}
                                    />
                                ) : result.type === 'remedy' ? (
                                    <div className="p-6 md:p-8">
                                        <RemedyCard 
                                            remedy={result.data} 
                                            onToggleSelect={() => onToggleRemedy(result.data)} 
                                            isSelected={isSelected}
                                            bookmarkedSections={bookmarkedSections}
                                            highlightedSections={highlightedSectionsList}
                                            onToggleSectionBookmark={(sectionTitle) => onToggleRemedySection(result.data, sectionTitle)}
                                        />
                                    </div>
                                ) : result.type === 'mantraBook' ? (
                                    <div className="p-6 md:p-8">
                                        <MantraBookCard
                                          mantra={result.data}
                                          onToggleSelect={() => onToggleMantraBookItem(result.data)}
                                          isSelected={isSelected}
                                          bookmarkedSections={bookmarkedSections}
                                          highlightedSections={highlightedSectionsList}
                                          onToggleSectionBookmark={(title) => onToggleMantraBookSection(result.data, title)}
                                        />
                                    </div>
                                ) : result.type === 'buddhistChant' ? (
                                    <div className="p-6 md:p-8">
                                        <BuddhistChantCard
                                          chant={result.data}
                                          onToggleSelect={() => onToggleBuddhistChant(result.data)}
                                          isSelected={isSelected}
                                          bookmarkedSections={bookmarkedSections}
                                          highlightedSections={highlightedSectionsList}
                                          onToggleSectionBookmark={(title) => onToggleBuddhistChantSection(result.data, title)}
                                        />
                                    </div>
                                ) : null}
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
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>([]);
  
  // UI/Flow states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [slokasToExplain, setSlokasToExplain] = useState<Sloka[] | null>(null);
  const [slokaToAnalyze, setSlokaToAnalyze] = useState<Sloka | null>(null);
  const [showCombinedMantraCreator, setShowCombinedMantraCreator] = useState<Sloka[] | null>(null);
  const [language, setLanguage] = useState('English');
  const [showIntroModal, setShowIntroModal] = useState<boolean>(false);
  const [showHowToUseModal, setShowHowToUseModal] = useState<boolean>(false);
  const [mode, setMode] = useState<AppMode>('find');
  const [searchParams, setSearchParams] = useState<{query: string, combine: boolean} | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialViewTarget, setInitialViewTarget] = useState<{ mode: AppMode, id: number | string } | null>(null);
  const initialViewTargetRef = useRef(initialViewTarget);
  initialViewTargetRef.current = initialViewTarget;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [areFloatingButtonsVisible, setAreFloatingButtonsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const [currentBgTrack, setCurrentBgTrack] = useState<BackgroundMusicTrack>(BACKGROUND_MUSIC_TRACKS[0]);
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const [apiUsage, setApiUsage] = useState({ count: 0, limit: API_LIMIT });


  const [showBookmarkPanel, setShowBookmarkPanel] = useState(true);
  const [highlightedSections, setHighlightedSections] = useState<Record<string, string[]>>({});

  const handleApiUsageUpdate = useCallback(() => {
    setApiUsage(getApiUsage());
  }, []);

  // Effect to lock body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
    };
}, [isMobileNavOpen]);

  // Effect to show/hide floating buttons on scroll
  useEffect(() => {
    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (isMobileNavOpen) return;

        if (currentScrollY < 10) {
            setAreFloatingButtonsVisible(true);
        } else if (currentScrollY > lastScrollY.current + 10) { // Scrolling down
            setAreFloatingButtonsVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) { // Scrolling up
            setAreFloatingButtonsVisible(true);
        }
        
        lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileNavOpen]);

  // Effect to control background music playback
  useEffect(() => {
    const audioEl = bgAudioRef.current;
    if (audioEl) {
        if (isBgMusicPlaying) {
            audioEl.play().catch(error => {
                console.warn("Background music playback failed:", error);
                // Autoplay can be blocked by browsers. User interaction is often required.
                // We'll leave the state as `true` and let the user click again if needed.
            });
        } else {
            audioEl.pause();
        }
    }
  }, [isBgMusicPlaying, currentBgTrack]); // Rerun when track changes to play if needed


  // Effect for loading bookmarked items from URL on initial load
  useEffect(() => {
    handleApiUsageUpdate(); // Set initial API usage count
    const urlParams = new URLSearchParams(window.location.search);
    const loadedBookmarks: BookmarkedItem[] = [];
    const loadedHighlights: Record<string, string[]> = {};
    
    const langCode = urlParams.get('lan');
    if (langCode && CODE_LANG_MAP[langCode]) {
        setLanguage(CODE_LANG_MAP[langCode]);
    }

    const slokaIds = urlParams.get('slokas')?.split(',').map(Number).filter(n => !isNaN(n));
    if (slokaIds) {
        slokaIds.forEach(id => {
            const sloka = SLOKA_DATA.find(s => s.slokaNumber === id);
            if (sloka) {
                const sectionsParam = urlParams.get(`s${id}_sections`);
                const sections = sectionsParam ? sectionsParam.split(',').map(decodeURIComponent) : undefined;
                loadedBookmarks.push({ type: 'sloka', data: sloka, sections });
                if (sections) {
                    loadedHighlights[`sloka_${id}`] = sections;
                }
            }
        });
    }

    const remedyIds = urlParams.get('remedies')?.split(',').map(Number).filter(n => !isNaN(n));
    if (remedyIds) {
        remedyIds.forEach(id => {
            const remedy = VEDIC_REMEDIES_DATA.find(r => r.id === id);
            if (remedy) {
                 const sectionsParam = urlParams.get(`r${id}_sections`);
                const sections = sectionsParam ? sectionsParam.split(',').map(decodeURIComponent) : undefined;
                loadedBookmarks.push({ type: 'remedy', data: remedy, sections });
                if (sections) {
                    loadedHighlights[`remedy_${id}`] = sections;
                }
            }
        });
    }

    const tantraIds = urlParams.get('tantra')?.split(',').map(Number).filter(n => !isNaN(n));
    if (tantraIds) {
        tantraIds.forEach(id => {
            const tantra = TANTRA_BOOK_DATA.find(t => t.id === id);
            if (tantra) {
                const sectionsParam = urlParams.get(`t${id}_sections`);
                const sections = sectionsParam ? sectionsParam.split(',').map(decodeURIComponent) : undefined;
                loadedBookmarks.push({ type: 'tantra', data: tantra, sections });
                if (sections) {
                    loadedHighlights[`tantra_${id}`] = sections;
                }
            }
        });
    }

    const mantraBookIds = urlParams.get('mantraBook')?.split(',').map(Number).filter(n => !isNaN(n));
    if (mantraBookIds) {
        mantraBookIds.forEach(id => {
            const item = MANTRA_BOOK_DATA.find(t => t.id === id);
            if (item) {
                const sectionsParam = urlParams.get(`mb${id}_sections`);
                const sections = sectionsParam ? sectionsParam.split(',').map(decodeURIComponent) : undefined;
                loadedBookmarks.push({ type: 'mantraBook', data: item, sections });
                if (sections) {
                    loadedHighlights[`mantraBook_${id}`] = sections;
                }
            }
        });
    }

    const buddhistChantIds = urlParams.get('buddhistChants')?.split(',').map(Number).filter(n => !isNaN(n));
    if (buddhistChantIds) {
        buddhistChantIds.forEach(id => {
            const item = BUDDHIST_CHANTS_DATA.find(t => t.id === id);
            if (item) {
                const sectionsParam = urlParams.get(`bc${id}_sections`);
                const sections = sectionsParam ? sectionsParam.split(',').map(decodeURIComponent) : undefined;
                loadedBookmarks.push({ type: 'buddhistChant', data: item, sections });
                if (sections) {
                    loadedHighlights[`buddhistChant_${id}`] = sections;
                }
            }
        });
    }

    const audioIds = urlParams.get('audio')?.split(',');
    if (audioIds) {
        audioIds.forEach(id => {
            const track = AUDIO_TRACKS.find(t => t.id === id);
            if (track) {
                loadedBookmarks.push({ type: 'audio', data: track });
            }
        });
    }


    if (loadedBookmarks.length > 0) {
        setBookmarkedItems(loadedBookmarks);
        setHighlightedSections(loadedHighlights);
        
        // Set initial view with priority
        const firstAudio = loadedBookmarks.find(i => i.type === 'audio');
        const firstBuddhistChant = loadedBookmarks.find(i => i.type === 'buddhistChant');
        const firstRemedy = loadedBookmarks.find(i => i.type === 'remedy');
        const firstTantra = loadedBookmarks.find(i => i.type === 'tantra');
        const firstMantraBook = loadedBookmarks.find(i => i.type === 'mantraBook');
        const firstSloka = loadedBookmarks.find(i => i.type === 'sloka');

        if (firstAudio) {
            setMode('listen');
            setInitialViewTarget({ mode: 'listen', id: (firstAudio.data as AudioTrack).id });
        } else if (firstBuddhistChant) {
            setMode('buddhistChants');
            setInitialViewTarget({ mode: 'buddhistChants', id: (firstBuddhistChant.data as BuddhistChant).id });
        } else if (firstRemedy) {
            setMode('vedic');
            setInitialViewTarget({ mode: 'vedic', id: (firstRemedy.data as VedicRemedy).id });
        } else if (firstTantra) {
            setMode('tantraBook');
            setInitialViewTarget({ mode: 'tantraBook', id: (firstTantra.data as TantraBookMantra).id });
        } else if (firstMantraBook) {
            setMode('mantraBook');
            setInitialViewTarget({ mode: 'mantraBook', id: (firstMantraBook.data as MantraBookItem).id });
        } else if (firstSloka) {
            setMode('lookup');
            setInitialViewTarget({ mode: 'lookup', id: (firstSloka.data as Sloka).slokaNumber });
        }
    }

    if (urlParams.toString()) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    setIsInitialLoad(false);
  }, [handleApiUsageUpdate]); // Empty dependency array ensures it runs only once.


  const handleSearch = (query: string, combine: boolean) => {
    setUntranslatedMantraResults(null);
    setMantraResults(null);
    setSearchParams({ query, combine });
  };
  
  const handleLocalSearch = (slokaNumbers: number[]) => {
    setUntranslatedMantraResults(null);
    setMantraResults(null);
    setSearchParams(null); // Clear any pending AI search
    setError(null);

    const localResults: SearchResult[] = slokaNumbers
      .map(num => {
        const sloka = SLOKA_DATA.find(s => s.slokaNumber === num);
        return sloka ? { type: 'sloka' as const, data: sloka } : null;
      })
      .filter((item): item is { type: "sloka"; data: Sloka } => item !== null);

    if (localResults.length > 0) {
      setUntranslatedMantraResults(localResults);
    } else {
      setError("Could not find the selected slokas.");
    }
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
            handleApiUsageUpdate();
            if (identifiers.length === 0) {
                setUntranslatedMantraResults([]);
                return;
            }

            const localResults: SearchResult[] = identifiers.map(item => {
                if (item.source === 'Soundarya Lahari') {
                    const sloka = SLOKA_DATA.find(s => s.slokaNumber === item.identifier);
                    return sloka ? { type: 'sloka' as const, data: sloka } : null;
                } else if (item.source === 'Vedic Remedies'){
                    const remedy = VEDIC_REMEDIES_DATA.find(r => r.id === item.identifier);
                    return remedy ? { type: 'remedy' as const, data: remedy } : null;
                } else if (item.source === 'Mantra Book') {
                    const mantraItem = MANTRA_BOOK_DATA.find(m => m.id === item.identifier);
                    return mantraItem ? { type: 'mantraBook' as const, data: mantraItem } : null;
                } else if (item.source === 'Buddhist Chants') {
                    const chant = BUDDHIST_CHANTS_DATA.find(c => c.id === item.identifier);
                    return chant ? { type: 'buddhistChant' as const, data: chant } : null;
                }
                return null; // Handle potential unknown source
            }).filter(item => item !== null) as SearchResult[];
            
            if (localResults.length === 0 && identifiers.length > 0) {
                 throw new Error("The AI returned identifiers that could not be found in our records.");
            }
            
            // Prioritize Soundarya Lahari slokas in the results
            localResults.sort((a, b) => {
                if (a.type === 'sloka' && b.type !== 'sloka') return -1;
                if (a.type !== 'sloka' && b.type === 'sloka') return 1;
                return 0;
            });

            setUntranslatedMantraResults(localResults);

        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
            setUntranslatedMantraResults(null);
        } finally {
            setIsLoading(false);
        }
    };
    performSearch();
  }, [searchParams, isInitialLoad, handleApiUsageUpdate]);

  // Effect to handle translation when untranslated results or language changes
  useEffect(() => {
      if (isInitialLoad) return;
      if (!untranslatedMantraResults) {
          setMantraResults(null);
          return;
      }

      const translate = async () => {
          if (language === 'English') {
              setMantraResults(untranslatedMantraResults);
              return;
          }
          setIsLoading(true);
          setError(null);
          try {
              const translated = await translateSearchResults(untranslatedMantraResults, language);
              handleApiUsageUpdate();
              setMantraResults(translated);
          } catch (e: any) {
              setError(e.message);
              setMantraResults(untranslatedMantraResults); // Fallback to English on error
          } finally {
              setIsLoading(false);
          }
      };
      translate();
  }, [untranslatedMantraResults, language, isInitialLoad, handleApiUsageUpdate]);
  
  const handleToggleSloka = (slokaToToggle: Sloka) => {
      const existingIndex = bookmarkedItems.findIndex(item => 
          item.type === 'sloka' && item.data.slokaNumber === slokaToToggle.slokaNumber
      );

      if (existingIndex > -1) {
          setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
      } else {
          const newItem: BookmarkedItem = { type: 'sloka', data: slokaToToggle };
          setBookmarkedItems(items => [...items, newItem]);
          setShowBookmarkPanel(true);
      }
  };

  const handleToggleRemedy = (remedyToToggle: VedicRemedy) => {
      const existingIndex = bookmarkedItems.findIndex(item => 
          item.type === 'remedy' && item.data.id === remedyToToggle.id
      );

      if (existingIndex > -1) {
          setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
      } else {
          const newItem: BookmarkedItem = { type: 'remedy', data: remedyToToggle };
          setBookmarkedItems(items => [...items, newItem]);
          setShowBookmarkPanel(true);
      }
  };

  const handleToggleTantraMantra = (mantraToToggle: TantraBookMantra) => {
      const existingIndex = bookmarkedItems.findIndex(item => 
          item.type === 'tantra' && item.data.id === mantraToToggle.id
      );

      if (existingIndex > -1) {
          setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
      } else {
          const newItem: BookmarkedItem = { type: 'tantra', data: mantraToToggle };
          setBookmarkedItems(items => [...items, newItem]);
          setShowBookmarkPanel(true);
      }
  };

  const handleToggleMantraBookItem = (itemToToggle: MantraBookItem) => {
      const existingIndex = bookmarkedItems.findIndex(item => 
          item.type === 'mantraBook' && item.data.id === itemToToggle.id
      );

      if (existingIndex > -1) {
          setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
      } else {
          const newItem: BookmarkedItem = { type: 'mantraBook', data: itemToToggle };
          setBookmarkedItems(items => [...items, newItem]);
          setShowBookmarkPanel(true);
      }
  };

  const handleToggleBuddhistChant = (chantToToggle: BuddhistChant) => {
      const existingIndex = bookmarkedItems.findIndex(item =>
          item.type === 'buddhistChant' && item.data.id === chantToToggle.id
      );

      if (existingIndex > -1) {
          setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
      } else {
          const newItem: BookmarkedItem = { type: 'buddhistChant', data: chantToToggle };
          setBookmarkedItems(items => [...items, newItem]);
          setShowBookmarkPanel(true);
      }
  };
  
  const handleToggleAudioBookmark = (trackToToggle: AudioTrack) => {
    const existingIndex = bookmarkedItems.findIndex(item =>
        item.type === 'audio' && item.data.id === trackToToggle.id
    );

    if (existingIndex > -1) {
        setBookmarkedItems(items => items.filter((_, index) => index !== existingIndex));
    } else {
        const newItem: BookmarkedItem = { type: 'audio', data: trackToToggle };
        setBookmarkedItems(items => [...items, newItem]);
        setShowBookmarkPanel(true);
    }
  };

  const createSectionToggleHandler = <T extends Sloka | VedicRemedy | TantraBookMantra | MantraBookItem | BuddhistChant>(
    itemData: T,
    itemType: BookmarkedItem['type']
  ) => (sectionTitle: string) => {
      const idKey = 'slokaNumber' in itemData ? 'slokaNumber' : 'id';
      const itemId = itemData[idKey as keyof T];

      setBookmarkedItems(currentItems => {
        const itemIndex = currentItems.findIndex(item =>
            item.type === itemType &&
            (item.data as T)[idKey as keyof T] === itemId
        );

        if (itemIndex === -1) {
            const newItem: BookmarkedItem = { type: itemType, data: itemData, sections: [sectionTitle] } as any;
            setShowBookmarkPanel(true);
            return [...currentItems, newItem];
        } else {
            const updatedItems = [...currentItems];
            const existingItem = { ...updatedItems[itemIndex] };
            if ('sections' in existingItem) {
                const existingSections = existingItem.sections || [];

                if (existingSections.includes(sectionTitle)) {
                    existingItem.sections = existingSections.filter(s => s !== sectionTitle);
                } else {
                    existingItem.sections = [...existingSections, sectionTitle];
                }
                updatedItems[itemIndex] = existingItem;
            }
            return updatedItems;
        }
      });
  };

  const handleRemoveBookmark = (itemToRemove: BookmarkedItem) => {
    setBookmarkedItems(currentItems => currentItems.filter(item => {
        if (item.type !== itemToRemove.type) return true;
        const idKey = 'slokaNumber' in item.data ? 'slokaNumber' : 'id';
        const removeIdKey = 'slokaNumber' in itemToRemove.data ? 'slokaNumber' : 'id';
        return (item.data as any)[idKey] !== (itemToRemove.data as any)[removeIdKey];
    }));
  };

  const handleClearAllBookmarks = () => {
    if (window.confirm("Are you sure you want to clear all your bookmarked items? This action cannot be undone.")) {
        setBookmarkedItems([]);
    }
  };

    const handleNavigateToBookmark = (item: BookmarkedItem) => {
        setShowBookmarkPanel(false); // Hide panel for better view
        setInitialViewTarget(null); // Reset target
        setTimeout(() => { // Use timeout to ensure state update propagates
            switch (item.type) {
                case 'sloka':
                    setMode('lookup');
                    setInitialViewTarget({ mode: 'lookup', id: item.data.slokaNumber });
                    break;
                case 'remedy':
                    setMode('vedic');
                    setInitialViewTarget({ mode: 'vedic', id: item.data.id });
                    break;
                case 'tantra':
                    setMode('tantraBook');
                    setInitialViewTarget({ mode: 'tantraBook', id: item.data.id });
                    break;
                case 'mantraBook':
                    setMode('mantraBook');
                    setInitialViewTarget({ mode: 'mantraBook', id: item.data.id });
                    break;
                case 'buddhistChant':
                    setMode('buddhistChants');
                    setInitialViewTarget({ mode: 'buddhistChants', id: item.data.id });
                    break;
                case 'audio':
                    setMode('listen');
                    setInitialViewTarget({ mode: 'listen', id: item.data.id });
                    break;
            }
        }, 0);
    };

  const handleExplainRequest = (slokas: Sloka[]) => {
    setSlokasToExplain(slokas);
  };
  
  const handleAnalyzeRequest = (sloka: Sloka) => {
    setSlokaToAnalyze(sloka);
  };
  
  const handleCreateCombinedMantraRequest = (slokas: Sloka[]) => {
    setShowCombinedMantraCreator(slokas);
  };

  const handleCloseExplainer = () => setSlokasToExplain(null);
  const handleCloseAnalysis = () => setSlokaToAnalyze(null);
  const handleCloseCombinedMantraCreator = () => setShowCombinedMantraCreator(null);

  const toggleBgMusic = () => {
    setIsBgMusicPlaying(prev => !prev);
  };

  const renderNavButton = (buttonMode: AppMode, text: string, index: number) => (
    <button
      onClick={() => {
        setMode(buttonMode);
        setInitialViewTarget(null); // Clear target when manually changing modes
      }}
      className={`px-4 py-2 rounded-full text-md md:text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 animate-landing animate-fade-in ${
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
  
  const renderMobileNavButton = (buttonMode: AppMode, text: string) => (
    <button
      onClick={() => {
        setMode(buttonMode);
        setInitialViewTarget(null);
        setIsMobileNavOpen(false); // Close nav on selection
      }}
      className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
        mode === buttonMode
          ? 'bg-amber-800 text-white'
          : 'text-amber-800 hover:bg-amber-200/50'
      }`}
      aria-pressed={mode === buttonMode}
    >
      {text}
    </button>
);

    const PlayIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
        </svg>
    );

    const PauseIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-slate-800 p-4 sm:p-8 flex flex-col items-center">
      
      <audio
        ref={bgAudioRef}
        key={currentBgTrack.src}
        src={currentBgTrack.src}
        loop
        preload="auto"
      />

      {/* Mobile Nav Button */}
      <button
          onClick={() => setIsMobileNavOpen(true)}
          className={`md:hidden fixed top-5 left-5 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30 transition-all duration-300 ease-in-out ${areFloatingButtonsVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
          aria-label="Open navigation menu"
          aria-hidden={!areFloatingButtonsVisible}
      >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
      </button>

      {/* Mobile Nav Panel */}
      {isMobileNavOpen && (
            <div className="md:hidden fixed inset-0 z-[60] flex" role="dialog" aria-modal="true">
              {/* Backdrop */}
              <div className="fixed inset-0 bg-black/50 animate-fade-in" onClick={() => setIsMobileNavOpen(false)}></div>
              
              {/* Sidebar */}
              <div className="relative w-72 bg-amber-50 shadow-xl flex flex-col p-6 animate-slide-in-left">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-amber-900">Navigation</h2>
                      <button onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation menu" className="p-1 text-amber-700 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
                  <nav className="flex flex-col space-y-2">
                      {renderMobileNavButton('find', 'Find Mantra for Problem')}
                      {renderMobileNavButton('lookup', 'Lookup Sloka')}
                      {renderMobileNavButton('vedic', 'Vedic Remedies')}
                      {renderMobileNavButton('mantraBook', 'Mantra Compendium')}
                      {renderMobileNavButton('tantraBook', 'Tantric Practices')}
                      {renderMobileNavButton('buddhistChants', 'Buddhist Chants')}
                      {renderMobileNavButton('listen', 'Listen to Chants')}
                      {renderMobileNavButton('aiChat', 'AI Chat Guide')}
                      {renderMobileNavButton('research', 'Research')}
                  </nav>
              </div>
          </div>
      )}
      
      <main className="w-full">
        <Header />
         <div className="text-center mb-4 animate-landing animate-fade-in flex justify-center items-center gap-4" style={{ animationDelay: '0.4s' }}>
             <button
                onClick={() => setShowIntroModal(true)}
                className="text-amber-800 hover:text-amber-900 underline transition-colors"
                aria-label="Learn more about Soundarya Lahari"
             >
                What is Soundarya Lahari?
             </button>
             <span className="text-amber-300">|</span>
             <button
                onClick={() => setShowHowToUseModal(true)}
                className="text-amber-800 hover:text-amber-900 underline transition-colors"
                aria-label="Learn how to use these mantras"
             >
                How to Use These Mantras
             </button>
         </div>

        <div className="hidden md:flex justify-center flex-wrap gap-2 md:gap-4 my-6">
          {renderNavButton('find', 'Find Mantra for Problem', 0)}
          {renderNavButton('lookup', 'Lookup Sloka', 1)}
          {renderNavButton('vedic', 'Vedic Remedies', 2)}
          {renderNavButton('mantraBook', 'Mantra Compendium', 3)}
          {renderNavButton('tantraBook', 'Tantric Practices', 4)}
          {renderNavButton('buddhistChants', 'Buddhist Chants', 5)}
          {renderNavButton('listen', 'Listen to Chants', 6)}
          {renderNavButton('aiChat', 'AI Chat Guide', 7)}
          {renderNavButton('research', 'Research', 8)}
        </div>

        <div className="w-full max-w-2xl mx-auto mb-4 flex justify-center items-center flex-wrap gap-4 animate-landing animate-fade-in" style={{ animationDelay: '1.2s' }}>
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
              bookmarkedItems={bookmarkedItems}
              language={language}
            />
            <div className="bg-white/80 text-amber-800 text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm border border-amber-300/60" title={`Daily AI Interaction Count. Resets daily.`}>
                AI Usage: {apiUsage.count}/{apiUsage.limit}
            </div>
        </div>
        
        {mode === 'find' && (
          <>
            <SearchBar 
                onSearch={handleSearch} 
                onLocalSearch={handleLocalSearch}
                isLoading={isLoading} 
            />
            <div className="mt-8 space-y-8">
              {isLoading && <LoadingSpinner />}
              {error && !isLoading && <ErrorMessage message={error} />}
              {mantraResults && mantraResults.length > 0 && !isLoading && (
                <SearchResults
                  results={mantraResults}
                  bookmarkedItems={bookmarkedItems}
                  highlightedSections={highlightedSections}
                  onToggleSloka={handleToggleSloka}
                  onToggleRemedy={handleToggleRemedy}
                  onToggleMantraBookItem={handleToggleMantraBookItem}
                  onToggleBuddhistChant={handleToggleBuddhistChant}
                  onToggleSlokaSection={(sloka, title) => createSectionToggleHandler(sloka, 'sloka')(title)}
                  onToggleRemedySection={(remedy, title) => createSectionToggleHandler(remedy, 'remedy')(title)}
                  onToggleMantraBookSection={(item, title) => createSectionToggleHandler(item, 'mantraBook')(title)}
                  onToggleBuddhistChantSection={(item, title) => createSectionToggleHandler(item, 'buddhistChant')(title)}
                  onExplainRequest={handleExplainRequest}
                  onAnalyzeRequest={handleAnalyzeRequest}
                />
              )}
              {mantraResults && mantraResults.length === 0 && !isLoading && (
                 <div className="text-center text-amber-700 mt-16 text-lg animate-fade-in">
                    <p>No specific mantra found for your query.</p>
                    <p className="mt-2 text-base">Please try rephrasing your problem or explore the other sections.</p>
                </div>
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
                bookmarkedItems={bookmarkedItems}
                highlightedSections={highlightedSections}
                onToggleSelect={handleToggleSloka}
                onToggleSectionBookmark={createSectionToggleHandler}
                onExplainRequest={handleExplainRequest}
                onAnalyzeRequest={handleAnalyzeRequest}
                language={language}
                initialSelectedId={initialViewTargetRef.current?.mode === 'lookup' ? initialViewTargetRef.current.id as number : null}
                onApiUse={handleApiUsageUpdate}
            />
        )}

        {mode === 'vedic' && (
           <VedicRemedies 
                bookmarkedItems={bookmarkedItems}
                highlightedSections={highlightedSections}
                onToggleSelect={handleToggleRemedy}
                onToggleSectionBookmark={createSectionToggleHandler}
                language={language}
                initialSelectedId={initialViewTargetRef.current?.mode === 'vedic' ? initialViewTargetRef.current.id as number : null}
                onApiUse={handleApiUsageUpdate}
           />
        )}
        
        {mode === 'mantraBook' && (
           <MantraBook 
                bookmarkedItems={bookmarkedItems}
                highlightedSections={highlightedSections}
                onToggleSelect={handleToggleMantraBookItem}
                onToggleSectionBookmark={createSectionToggleHandler}
                language={language}
                initialSelectedId={initialViewTargetRef.current?.mode === 'mantraBook' ? initialViewTargetRef.current.id as number : null}
                onApiUse={handleApiUsageUpdate}
           />
        )}

        {mode === 'tantraBook' && (
           <TantraBook 
                bookmarkedItems={bookmarkedItems}
                highlightedSections={highlightedSections}
                onToggleSelect={handleToggleTantraMantra}
                onToggleSectionBookmark={createSectionToggleHandler}
                language={language}
                initialSelectedId={initialViewTargetRef.current?.mode === 'tantraBook' ? initialViewTargetRef.current.id as number : null}
                onApiUse={handleApiUsageUpdate}
           />
        )}

        {mode === 'buddhistChants' && (
           <BuddhistChants
                bookmarkedItems={bookmarkedItems}
                highlightedSections={highlightedSections}
                onToggleSelect={handleToggleBuddhistChant}
                onToggleSectionBookmark={createSectionToggleHandler}
                language={language}
                initialSelectedId={initialViewTargetRef.current?.mode === 'buddhistChants' ? initialViewTargetRef.current.id as number : null}
                onApiUse={handleApiUsageUpdate}
           />
        )}

        {mode === 'listen' && (
            <AudioLibrary
                bookmarkedItems={bookmarkedItems}
                onToggleBookmark={handleToggleAudioBookmark}
                initialSelectedId={initialViewTargetRef.current?.mode === 'listen' ? initialViewTargetRef.current.id as string : null}
            />
        )}
        
        {mode === 'aiChat' && (
            <AIChat language={language} onApiUse={handleApiUsageUpdate} />
        )}

        {mode === 'research' && (
            <ResearchSummaries initialLanguage={language} />
        )}
      </main>
      
      {/* Floating Background Music Player */}
        <div
            className={`fixed bottom-5 left-5 z-40 flex items-end gap-2 transition-all duration-300 ease-in-out group ${areFloatingButtonsVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
            aria-hidden={!areFloatingButtonsVisible}
        >
            <div className="transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-focus-within:max-w-xs group-focus-within:opacity-100 overflow-hidden">
                <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-2 space-y-1 w-48 mb-1">
                    <p className="text-xs text-center font-semibold text-amber-800 px-2 pb-1">Ambient Sound</p>
                    {BACKGROUND_MUSIC_TRACKS.map(track => (
                        <button
                            key={track.id}
                            onClick={() => {
                                setCurrentBgTrack(track);
                            }}
                            className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                                currentBgTrack.id === track.id
                                    ? 'bg-amber-200 text-amber-900 font-semibold'
                                    : 'text-amber-700 hover:bg-amber-100'
                            }`}
                        >
                            {track.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={toggleBgMusic}
                className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-white/70 backdrop-blur-md text-amber-800 rounded-full shadow-lg hover:bg-amber-100 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/80"
                aria-label={isBgMusicPlaying ? 'Pause background music' : 'Play background music'}
            >
                {isBgMusicPlaying ? <PauseIcon /> : <PlayIcon />}
                {isBgMusicPlaying && (
                    <div className="absolute inset-0 rounded-full border-2 border-amber-500 animate-ping-slow opacity-75"></div>
                )}
            </button>
        </div>


      {bookmarkedItems.length > 0 && showBookmarkPanel && (
        <CombinedSelections 
            bookmarkedItems={bookmarkedItems}
            onRemoveBookmark={handleRemoveBookmark}
            onExplainRequest={handleExplainRequest}
            onCreateCombinedMantraRequest={handleCreateCombinedMantraRequest}
            onClose={() => setShowBookmarkPanel(false)}
            onNavigateToBookmark={handleNavigateToBookmark}
            onClearAll={handleClearAllBookmarks}
        />
      )}

      {bookmarkedItems.length > 0 && !showBookmarkPanel && (
        <BookmarkToggleButton
            count={bookmarkedItems.length}
            onClick={() => setShowBookmarkPanel(true)}
        />
      )}

      {slokasToExplain && (
        <BijaMantraExplainer
          slokas={slokasToExplain}
          onClose={handleCloseExplainer}
          onApiUse={handleApiUsageUpdate}
        />
      )}
      
      {slokaToAnalyze && (
        <SlokaAnalysisModal 
          sloka={slokaToAnalyze}
          language={language}
          onClose={handleCloseAnalysis}
          onApiUse={handleApiUsageUpdate}
        />
      )}

      {showCombinedMantraCreator && (
        <CombinedMantraModal
            slokas={showCombinedMantraCreator}
            language={language}
            onClose={handleCloseCombinedMantraCreator}
            onApiUse={handleApiUsageUpdate}
        />
      )}

      {showIntroModal && (
        <IntroModal onClose={() => setShowIntroModal(false)} />
      )}
      
      {showHowToUseModal && (
        <HowToUseModal initialLanguage={language} onClose={() => setShowHowToUseModal(false)} />
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
         <p className="mt-2">
            Website Source: <a href="https://github.com/Ishanoshada/Soundarya-Lahari-Mantra-Finder/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 underline transition-colors">GitHub Repository</a>
        </p>
        <p className="mt-2">&copy; 2025 Divine Guidance Systems</p>
      </footer>
    </div>
  );
};

export default App;