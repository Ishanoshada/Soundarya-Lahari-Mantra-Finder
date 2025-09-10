import React, { useState, useMemo, useEffect } from 'react';
import { VEDIC_REMEDIES_DATA } from '../constants/remediesData';
import RemedyCard from './RemedyCard';
import type { VedicRemedy, BookmarkedItem } from '../types';
import { translateVedicRemedies } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface VedicRemediesProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (remedy: VedicRemedy) => void;
    onToggleSectionBookmark: (itemData: VedicRemedy, itemType: 'remedy') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
    onApiUse: () => void;
}

const VedicRemedies: React.FC<VedicRemediesProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId, onApiUse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRemedyId, setSelectedRemedyId] = useState<number | null>(initialSelectedId || VEDIC_REMEDIES_DATA[0]?.id || null);
    
    const [remedyForDisplay, setRemedyForDisplay] = useState<VedicRemedy | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, VedicRemedy>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Effect to handle initialization from a shared URL
    useEffect(() => {
        if (initialSelectedId) {
            setSelectedRemedyId(initialSelectedId);
        }
    }, [initialSelectedId]);

    // List is always based on English data, for fast filtering and consistent display.
    const filteredRemedies = useMemo(() => {
        if (!searchTerm.trim()) {
            return VEDIC_REMEDIES_DATA;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return VEDIC_REMEDIES_DATA.filter(remedy => 
            remedy.title.toLowerCase().includes(lowercasedTerm) ||
            remedy.purpose.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm]);

    const { currentIndex, handlePrevious, handleNext } = useMemo(() => {
        if (!selectedRemedyId || filteredRemedies.length === 0) {
            return { currentIndex: -1, handlePrevious: () => {}, handleNext: () => {} };
        }
        const idx = filteredRemedies.findIndex(remedy => remedy.id === selectedRemedyId);
        
        const prev = () => {
            if (idx > 0) {
                setSelectedRemedyId(filteredRemedies[idx - 1].id);
            }
        };

        const next = () => {
            if (idx < filteredRemedies.length - 1) {
                setSelectedRemedyId(filteredRemedies[idx + 1].id);
            }
        };
        
        return { currentIndex: idx, handlePrevious: prev, handleNext: next };
    }, [selectedRemedyId, filteredRemedies]);
    
    // Auto-select the first item in the list if the current selection is filtered out or not set.
    useEffect(() => {
        if (filteredRemedies.length > 0 && !filteredRemedies.some(r => r.id === selectedRemedyId)) {
            setSelectedRemedyId(filteredRemedies[0].id);
        } else if (filteredRemedies.length === 0) {
            setSelectedRemedyId(null);
        }
    }, [filteredRemedies, selectedRemedyId]);

    // Core logic: Fetch translation for the selected remedy on-demand.
    useEffect(() => {
        if (selectedRemedyId === null) {
            setRemedyForDisplay(null);
            return;
        }

        const originalRemedy = VEDIC_REMEDIES_DATA.find(r => r.id === selectedRemedyId);
        if (!originalRemedy) return;

        if (language === 'English') {
            setRemedyForDisplay(originalRemedy);
            setError(null);
            return;
        }

        const cacheKey = `${selectedRemedyId}-${language}`;
        if (translationCache[cacheKey]) {
            setRemedyForDisplay(translationCache[cacheKey]);
            return;
        }
        
        const fetchTranslation = async () => {
            setIsCardLoading(true);
            setError(null);
            try {
                const translated = await translateVedicRemedies([originalRemedy], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setRemedyForDisplay(translated[0]);
                    onApiUse();
                } else {
                    throw new Error("Translation returned empty result.");
                }
            } catch (err: any) {
                setError(err.message);
                setRemedyForDisplay(originalRemedy); // Fallback to English on error
            } finally {
                setIsCardLoading(false);
            }
        };

        fetchTranslation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRemedyId, language]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="text-center mb-4">
                <h3 className="text-3xl font-bold text-amber-900">Vedic Remedies</h3>
                <p className="text-amber-800 mt-1">
                    Practices from "Infallible Vedic Remedies" by Swami Shantananda Puri
                </p>
            </div>
            <div className="mb-6 max-w-3xl mx-auto bg-amber-100/60 border-l-4 border-amber-500 text-amber-800 p-3 rounded-r-lg flex items-start shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs italic">
                    <strong>Disclaimer:</strong> The remedies listed below are sourced directly from the aforementioned text. Their efficacy has not been independently verified by the creators of this application.
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search remedies by purpose or title..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-700/70 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Vedic Remedies"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-xl">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Remedy List (English)</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {filteredRemedies.map(remedy => (
                            <button
                                key={remedy.id}
                                onClick={() => setSelectedRemedyId(remedy.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors text-amber-900 font-medium text-sm ${selectedRemedyId === remedy.id ? 'bg-amber-200 shadow-inner' : 'hover:bg-amber-100/70'}`}
                            >
                                #{remedy.id}: {remedy.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && remedyForDisplay ? (
                        <>
                          {(() => {
                              const bookmarkedItem = bookmarkedItems.find(i => i.type === 'remedy' && i.data.id === remedyForDisplay.id);
                              const isSelected = !!bookmarkedItem;
                              // FIX: Safely access sections property by checking if it exists on the bookmarkedItem.
                              const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];
                              const highlightKey = `remedy_${remedyForDisplay.id}`;
                              return (
                                  <RemedyCard 
                                      remedy={remedyForDisplay} 
                                      onToggleSelect={onToggleSelect}
                                      isSelected={isSelected}
                                      bookmarkedSections={bookmarkedSections}
                                      highlightedSections={highlightedSections[highlightKey] || []}
                                      onToggleSectionBookmark={onToggleSectionBookmark(remedyForDisplay, 'remedy')}
                                  />
                              );
                          })()}
                           <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous Remedy"
                                >
                                    &larr; Previous
                                </button>
                                {currentIndex !== -1 && (
                                    <span className="text-sm text-amber-700 font-medium">{currentIndex + 1} / {filteredRemedies.length}</span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === -1 || currentIndex >= filteredRemedies.length - 1}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next Remedy"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                                <p className="text-amber-700 text-center">
                                    {searchTerm ? "No remedies found matching your search." : "Select a remedy from the list to view its details."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default VedicRemedies;