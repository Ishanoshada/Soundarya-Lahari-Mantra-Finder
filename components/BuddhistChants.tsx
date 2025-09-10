import React, { useState, useMemo, useEffect } from 'react';
import { BUDDHIST_CHANTS_DATA } from '../constants/buddhistChantsData';
import BuddhistChantCard from './BuddhistChantCard';
import type { BuddhistChant, BookmarkedItem } from '../types';
import { translateBuddhistChants } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface BuddhistChantsProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (chant: BuddhistChant) => void;
    onToggleSectionBookmark: (itemData: BuddhistChant, itemType: 'buddhistChant') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
    onApiUse: () => void;
}

const BuddhistChants: React.FC<BuddhistChantsProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId, onApiUse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChantId, setSelectedChantId] = useState<number | null>(initialSelectedId || BUDDHIST_CHANTS_DATA[0]?.id || null);
    
    const [chantForDisplay, setChantForDisplay] = useState<BuddhistChant | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, BuddhistChant>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedChantId(initialSelectedId);
        }
    }, [initialSelectedId]);

    const groupedAndFilteredChants = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const filtered = BUDDHIST_CHANTS_DATA.filter(chant => 
            chant.title.toLowerCase().includes(lowercasedTerm) ||
            chant.english.join(' ').toLowerCase().includes(lowercasedTerm) ||
            chant.pali.join(' ').toLowerCase().includes(lowercasedTerm) ||
            chant.category.toLowerCase().includes(lowercasedTerm)
        );

        return filtered.reduce((acc, chant) => {
            (acc[chant.category] = acc[chant.category] || []).push(chant);
            return acc;
        }, {} as Record<string, BuddhistChant[]>);

    }, [searchTerm]);
    
    const flatChantList = useMemo(() => Object.values(groupedAndFilteredChants).flat(), [groupedAndFilteredChants]);
    const hasResults = useMemo(() => flatChantList.length > 0, [flatChantList]);

    const { currentIndex, handlePrevious, handleNext } = useMemo(() => {
        if (!selectedChantId || !hasResults) {
            return { currentIndex: -1, handlePrevious: () => {}, handleNext: () => {} };
        }
        const idx = flatChantList.findIndex(chant => chant.id === selectedChantId);
        
        const prev = () => {
            if (idx > 0) {
                setSelectedChantId(flatChantList[idx - 1].id);
            }
        };

        const next = () => {
            if (idx < flatChantList.length - 1) {
                setSelectedChantId(flatChantList[idx + 1].id);
            }
        };
        
        return { currentIndex: idx, handlePrevious: prev, handleNext: next };
    }, [selectedChantId, flatChantList, hasResults]);

    useEffect(() => {
        if (hasResults) {
            const allVisibleIds = flatChantList.map(m => m.id);
            if (!allVisibleIds.includes(selectedChantId as number)) {
                setSelectedChantId(allVisibleIds[0]);
            }
        } else {
            setSelectedChantId(null);
        }
    }, [flatChantList, hasResults, selectedChantId]);
    
    useEffect(() => {
        if (selectedChantId === null) {
            setChantForDisplay(null);
            return;
        }

        const originalChant = BUDDHIST_CHANTS_DATA.find(m => m.id === selectedChantId);
        if (!originalChant) return;

        if (language === 'English') {
            setChantForDisplay(originalChant);
            setError(null);
            return;
        }

        const cacheKey = `${selectedChantId}-${language}`;
        if (translationCache[cacheKey]) {
            setChantForDisplay(translationCache[cacheKey]);
            return;
        }
        
        const fetchTranslation = async () => {
            setIsCardLoading(true);
            setError(null);
            try {
                const translated = await translateBuddhistChants([originalChant], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setChantForDisplay(translated[0]);
                    onApiUse();
                } else {
                     throw new Error("Translation returned empty result.");
                }
            } catch (err: any) {
                setError(err.message);
                setChantForDisplay(originalChant);
            } finally {
                setIsCardLoading(false);
            }
        };

        fetchTranslation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChantId, language]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-amber-900">Buddhist Chanting</h3>
                <p className="text-amber-700 mt-1">
                    A collection from "Buddhist Chanting Book in Pāli and English"
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search chants..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Buddhist Chants"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Chant List</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {Object.entries(groupedAndFilteredChants).map(([category, chants]) => (
                            <div key={category}>
                                <h5 className="text-md font-bold text-amber-800/80 sticky top-0 bg-white/80 backdrop-blur-sm py-1">{category}</h5>
                                {chants.map(chant => (
                                    <button
                                        key={chant.id}
                                        onClick={() => setSelectedChantId(chant.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors text-amber-800 text-sm ${selectedChantId === chant.id ? 'bg-amber-200 font-bold' : 'hover:bg-amber-100'}`}
                                    >
                                        #{chant.id}: {chant.title}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && chantForDisplay ? (
                        <>
                            {(() => {
                                const bookmarkedItem = bookmarkedItems.find(i => i.type === 'buddhistChant' && i.data.id === chantForDisplay.id);
                                const isSelected = !!bookmarkedItem;
                                // FIX: Safely access sections property by checking if it exists on the bookmarkedItem.
                                const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];
                                const highlightKey = `buddhistChant_${chantForDisplay.id}`;
                                return (
                                    <BuddhistChantCard 
                                        chant={chantForDisplay} 
                                        onToggleSelect={onToggleSelect}
                                        isSelected={isSelected}
                                        bookmarkedSections={bookmarkedSections}
                                        highlightedSections={highlightedSections[highlightKey] || []}
                                        onToggleSectionBookmark={onToggleSectionBookmark(chantForDisplay, 'buddhistChant')}
                                    />
                                );
                            })()}
                             <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous Chant"
                                >
                                    &larr; Previous
                                </button>
                                {currentIndex !== -1 && (
                                     <span className="text-sm text-amber-700 font-medium">{currentIndex + 1} / {flatChantList.length}</span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === -1 || currentIndex >= flatChantList.length - 1}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next Chant"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                                <p className="text-amber-700 text-center">
                                   {searchTerm ? "No chants found matching your search." : "Select a chant from the list to view its details."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuddhistChants;