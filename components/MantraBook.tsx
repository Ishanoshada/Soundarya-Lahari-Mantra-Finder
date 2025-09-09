import React, { useState, useMemo, useEffect } from 'react';
import { MANTRA_BOOK_DATA } from '../constants/mantraBookData';
import MantraBookCard from './MantraBookCard';
import type { MantraBookItem, BookmarkedItem } from '../types';
import { translateMantraBookItems } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface MantraBookProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (mantra: MantraBookItem) => void;
    onToggleSectionBookmark: (itemData: MantraBookItem, itemType: 'mantraBook') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
}

const MantraBook: React.FC<MantraBookProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMantraId, setSelectedMantraId] = useState<number | null>(initialSelectedId || MANTRA_BOOK_DATA[0]?.id || null);
    
    const [mantraForDisplay, setMantraForDisplay] = useState<MantraBookItem | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, MantraBookItem>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Effect to handle initialization from a shared URL
    useEffect(() => {
        if (initialSelectedId) {
            setSelectedMantraId(initialSelectedId);
        }
    }, [initialSelectedId]);

    // Group and filter mantras
    const groupedAndFilteredMantras = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const filtered = MANTRA_BOOK_DATA.filter(mantra => 
            mantra.title.toLowerCase().includes(lowercasedTerm) ||
            mantra.meaning.join(' ').toLowerCase().includes(lowercasedTerm) ||
            mantra.category.toLowerCase().includes(lowercasedTerm)
        );

        return filtered.reduce((acc, mantra) => {
            (acc[mantra.category] = acc[mantra.category] || []).push(mantra);
            return acc;
        }, {} as Record<string, MantraBookItem[]>);

    }, [searchTerm]);

    const flatMantraList = useMemo(() => Object.values(groupedAndFilteredMantras).flat(), [groupedAndFilteredMantras]);
    const hasResults = useMemo(() => flatMantraList.length > 0, [flatMantraList]);
    
    const { currentIndex, handlePrevious, handleNext } = useMemo(() => {
        if (!selectedMantraId || !hasResults) {
            return { currentIndex: -1, handlePrevious: () => {}, handleNext: () => {} };
        }
        const idx = flatMantraList.findIndex(mantra => mantra.id === selectedMantraId);
        
        const prev = () => {
            if (idx > 0) {
                setSelectedMantraId(flatMantraList[idx - 1].id);
            }
        };

        const next = () => {
            if (idx < flatMantraList.length - 1) {
                setSelectedMantraId(flatMantraList[idx + 1].id);
            }
        };
        
        return { currentIndex: idx, handlePrevious: prev, handleNext: next };
    }, [selectedMantraId, flatMantraList, hasResults]);


    // Auto-select the first item in the list if the current selection is filtered out or not set.
    useEffect(() => {
        if (hasResults) {
            const allVisibleIds = flatMantraList.map(m => m.id);
            if (!allVisibleIds.includes(selectedMantraId as number)) {
                setSelectedMantraId(allVisibleIds[0]);
            }
        } else {
            setSelectedMantraId(null);
        }
    }, [flatMantraList, hasResults, selectedMantraId]);
    
    // Core logic: Fetch translation for the selected mantra on-demand.
    useEffect(() => {
        if (selectedMantraId === null) {
            setMantraForDisplay(null);
            return;
        }

        const originalMantra = MANTRA_BOOK_DATA.find(m => m.id === selectedMantraId);
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
                const translated = await translateMantraBookItems([originalMantra], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setMantraForDisplay(translated[0]);
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
                <h3 className="text-3xl font-bold text-amber-900">Mantra Compendium</h3>
                <p className="text-amber-700 mt-1">
                    A collection from "Mantra" by Govinda Das Aghori
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
                    placeholder="Search mantras by purpose or title..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Mantra Book"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Mantra List (English)</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {Object.entries(groupedAndFilteredMantras).map(([category, mantras]) => (
                            <div key={category}>
                                <h5 className="text-md font-bold text-amber-800/80 sticky top-0 bg-white/80 backdrop-blur-sm py-1">{category}</h5>
                                {mantras.map(mantra => (
                                    <button
                                        key={mantra.id}
                                        onClick={() => setSelectedMantraId(mantra.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors text-amber-800 text-sm ${selectedMantraId === mantra.id ? 'bg-amber-200 font-bold' : 'hover:bg-amber-100'}`}
                                    >
                                        #{mantra.id}: {mantra.title}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && mantraForDisplay ? (
                        <>
                            {(() => {
                                const bookmarkedItem = bookmarkedItems.find(i => i.type === 'mantraBook' && i.data.id === mantraForDisplay.id);
                                const isSelected = !!bookmarkedItem;
                                const bookmarkedSections = bookmarkedItem?.sections || [];
                                const highlightKey = `mantraBook_${mantraForDisplay.id}`;
                                return (
                                    <MantraBookCard 
                                        mantra={mantraForDisplay} 
                                        onToggleSelect={onToggleSelect}
                                        isSelected={isSelected}
                                        bookmarkedSections={bookmarkedSections}
                                        highlightedSections={highlightedSections[highlightKey] || []}
                                        onToggleSectionBookmark={onToggleSectionBookmark(mantraForDisplay, 'mantraBook')}
                                    />
                                );
                            })()}
                            <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous Mantra"
                                >
                                    &larr; Previous
                                </button>
                                {currentIndex !== -1 && (
                                     <span className="text-sm text-amber-700 font-medium">{currentIndex + 1} / {flatMantraList.length}</span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === -1 || currentIndex >= flatMantraList.length - 1}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next Mantra"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                                <p className="text-amber-700 text-center">
                                   {searchTerm ? "No mantras found matching your search." : "Select a mantra from the list to view its details."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MantraBook;