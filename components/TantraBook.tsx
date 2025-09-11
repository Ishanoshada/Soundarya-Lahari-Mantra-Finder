import React, { useState, useMemo, useEffect } from 'react';
import { TANTRA_BOOK_DATA } from '../constants/tantraBookData';
import TantraMantraCard from './TantraMantraCard';
import type { TantraBookMantra, BookmarkedItem } from '../types';
import { translateTantraBookMantras } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface TantraBookProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (mantra: TantraBookMantra) => void;
    onToggleSectionBookmark: (itemData: TantraBookMantra, itemType: 'tantra') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
    onApiUse: () => void;
}

const TantraBook: React.FC<TantraBookProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId, onApiUse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMantraId, setSelectedMantraId] = useState<number | null>(initialSelectedId || TANTRA_BOOK_DATA[0]?.id || null);
    
    const [mantraForDisplay, setMantraForDisplay] = useState<TantraBookMantra | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, TantraBookMantra>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Effect to handle initialization from a shared URL
    useEffect(() => {
        if (initialSelectedId) {
            setSelectedMantraId(initialSelectedId);
        }
    }, [initialSelectedId]);

    // List is always based on English data for fast filtering and consistent display.
    const filteredMantras = useMemo(() => {
        if (!searchTerm.trim()) {
            return TANTRA_BOOK_DATA;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return TANTRA_BOOK_DATA.filter(mantra => 
            mantra.title.toLowerCase().includes(lowercasedTerm) ||
            mantra.purpose.join(' ').toLowerCase().includes(lowercasedTerm) ||
            mantra.category.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm]);
    
    const { currentIndex, handlePrevious, handleNext } = useMemo(() => {
        if (!selectedMantraId || filteredMantras.length === 0) {
            return { currentIndex: -1, handlePrevious: () => {}, handleNext: () => {} };
        }
        const idx = filteredMantras.findIndex(mantra => mantra.id === selectedMantraId);
        
        const prev = () => {
            if (idx > 0) {
                setSelectedMantraId(filteredMantras[idx - 1].id);
            }
        };

        const next = () => {
            if (idx < filteredMantras.length - 1) {
                setSelectedMantraId(filteredMantras[idx + 1].id);
            }
        };
        
        return { currentIndex: idx, handlePrevious: prev, handleNext: next };
    }, [selectedMantraId, filteredMantras]);


    // Auto-select the first item in the list if the current selection is filtered out or not set.
    useEffect(() => {
        if (filteredMantras.length > 0 && !filteredMantras.some(m => m.id === selectedMantraId)) {
            setSelectedMantraId(filteredMantras[0].id);
        } else if (filteredMantras.length === 0) {
            setSelectedMantraId(null);
        }
    }, [filteredMantras, selectedMantraId]);
    
    // Core logic: Fetch translation for the selected mantra on-demand.
    useEffect(() => {
        if (selectedMantraId === null) {
            setMantraForDisplay(null);
            return;
        }

        const originalMantra = TANTRA_BOOK_DATA.find(m => m.id === selectedMantraId);
        if (!originalMantra) return;

        if (language === 'English') {
            setMantraForDisplay(originalMantra);
            setError(null);
            return;
        }

        const cacheKey = `${selectedMantraId}-${language}`;
        if (translationCache[cacheKey]) {
            setMantraForDisplay(translationCache[cacheKey]);
            return;
        }
        
        const fetchTranslation = async () => {
            setIsCardLoading(true);
            setError(null);
            try {
                const translated = await translateTantraBookMantras([originalMantra], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setMantraForDisplay(translated[0]);
                    onApiUse();
                } else {
                    throw new Error("Translation returned empty result.");
                }
            } catch (err: any) {
                setError(err.message);
                setMantraForDisplay(originalMantra); // Fallback to English on error
            } finally {
                setIsCardLoading(false);
            }
        };

        fetchTranslation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMantraId, language]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-amber-900">Tantric Practices</h3>
                <p className="text-amber-800 mt-1">
                    Practices from "Secrets of Yantra, Mantra and Tantra"
                </p>
            </div>
            <div className="mb-6 max-w-3xl mx-auto bg-amber-100/60 border-l-4 border-amber-500 text-amber-800 p-3 rounded-r-lg flex items-start shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs italic">
                    <strong>Disclaimer:</strong> The practices listed below are sourced directly from the aforementioned text. Their efficacy has not been independently verified by the creators of this application.
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search practices by purpose or title..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-700/70 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Tantric Practices"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-xl">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Practice List (English)</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {filteredMantras.map(mantra => (
                            <button
                                key={mantra.id}
                                onClick={() => setSelectedMantraId(mantra.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors text-amber-900 font-medium text-sm ${selectedMantraId === mantra.id ? 'bg-amber-200 shadow-inner' : 'hover:bg-amber-100/70'}`}
                            >
                                #{mantra.id}: {mantra.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && mantraForDisplay ? (
                        <>
                          {(() => {
                              const bookmarkedItem = bookmarkedItems.find(i => i.type === 'tantra' && i.data.id === mantraForDisplay.id);
                              const isSelected = !!bookmarkedItem;
                              const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];
                              const highlightKey = `tantra_${mantraForDisplay.id}`;
                              return (
                                  <TantraMantraCard 
                                      mantra={mantraForDisplay} 
                                      onToggleSelect={onToggleSelect}
                                      isSelected={isSelected}
                                      bookmarkedSections={bookmarkedSections}
                                      highlightedSections={highlightedSections[highlightKey] || []}
                                      onToggleSectionBookmark={onToggleSectionBookmark(mantraForDisplay, 'tantra')}
                                  />
                              );
                          })()}
                           <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous Practice"
                                >
                                    &larr; Previous
                                </button>
                                {currentIndex !== -1 && (
                                    <span className="text-sm text-amber-700 font-medium">{currentIndex + 1} / {filteredMantras.length}</span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === -1 || currentIndex >= filteredMantras.length - 1}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next Practice"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                                <p className="text-amber-700 text-center">
                                    {searchTerm ? "No practices found matching your search." : "Select a practice from the list to view its details."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TantraBook;