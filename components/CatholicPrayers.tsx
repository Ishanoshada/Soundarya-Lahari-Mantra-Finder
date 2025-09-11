import React, { useState, useMemo, useEffect } from 'react';
import { CATHOLIC_PRAYERS_DATA } from '../constants/catholicPrayersData';
import CatholicPrayerCard from './CatholicPrayerCard';
import type { CatholicPrayer, BookmarkedItem } from '../types';
import { translateCatholicPrayers } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface CatholicPrayersProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (prayer: CatholicPrayer) => void;
    onToggleSectionBookmark: (itemData: CatholicPrayer, itemType: 'catholicPrayer') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
    onApiUse: () => void;
}

const CatholicPrayers: React.FC<CatholicPrayersProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId, onApiUse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrayerId, setSelectedPrayerId] = useState<number | null>(initialSelectedId || CATHOLIC_PRAYERS_DATA[0]?.id || null);
    
    const [prayerForDisplay, setPrayerForDisplay] = useState<CatholicPrayer | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, CatholicPrayer>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedPrayerId(initialSelectedId);
        }
    }, [initialSelectedId]);

    const groupedAndFilteredPrayers = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const filtered = CATHOLIC_PRAYERS_DATA.filter(prayer => 
            prayer.title.toLowerCase().includes(lowercasedTerm) ||
            prayer.text.join(' ').toLowerCase().includes(lowercasedTerm) ||
            prayer.category.toLowerCase().includes(lowercasedTerm)
        );

        return filtered.reduce((acc, prayer) => {
            (acc[prayer.category] = acc[prayer.category] || []).push(prayer);
            return acc;
        }, {} as Record<string, CatholicPrayer[]>);

    }, [searchTerm]);

    const flatPrayerList = useMemo(() => Object.values(groupedAndFilteredPrayers).flat(), [groupedAndFilteredPrayers]);
    const hasResults = useMemo(() => flatPrayerList.length > 0, [flatPrayerList]);
    
    const { currentIndex, handlePrevious, handleNext } = useMemo(() => {
        if (!selectedPrayerId || !hasResults) {
            return { currentIndex: -1, handlePrevious: () => {}, handleNext: () => {} };
        }
        const idx = flatPrayerList.findIndex(prayer => prayer.id === selectedPrayerId);
        
        const prev = () => {
            if (idx > 0) setSelectedPrayerId(flatPrayerList[idx - 1].id);
        };
        const next = () => {
            if (idx < flatPrayerList.length - 1) setSelectedPrayerId(flatPrayerList[idx + 1].id);
        };
        
        return { currentIndex: idx, handlePrevious: prev, handleNext: next };
    }, [selectedPrayerId, flatPrayerList, hasResults]);

    useEffect(() => {
        if (hasResults) {
            const allVisibleIds = flatPrayerList.map(p => p.id);
            if (!allVisibleIds.includes(selectedPrayerId as number)) {
                setSelectedPrayerId(allVisibleIds[0]);
            }
        } else {
            setSelectedPrayerId(null);
        }
    }, [flatPrayerList, hasResults, selectedPrayerId]);
    
    useEffect(() => {
        if (selectedPrayerId === null) {
            setPrayerForDisplay(null);
            return;
        }

        const originalPrayer = CATHOLIC_PRAYERS_DATA.find(p => p.id === selectedPrayerId);
        if (!originalPrayer) return;

        if (language === 'English') {
            setPrayerForDisplay(originalPrayer);
            setError(null);
            return;
        }

        const cacheKey = `${selectedPrayerId}-${language}`;
        if (translationCache[cacheKey]) {
            setPrayerForDisplay(translationCache[cacheKey]);
            return;
        }
        
        const fetchTranslation = async () => {
            setIsCardLoading(true);
            setError(null);
            try {
                const translated = await translateCatholicPrayers([originalPrayer], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setPrayerForDisplay(translated[0]);
                    onApiUse();
                } else {
                     throw new Error("Translation returned empty result.");
                }
            } catch (err: any) {
                setError(err.message);
                setPrayerForDisplay(originalPrayer);
            } finally {
                setIsCardLoading(false);
            }
        };

        fetchTranslation();
    }, [selectedPrayerId, language, onApiUse, translationCache]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-amber-900">Catholic Prayers</h3>
                <p className="text-amber-700 mt-1">
                    A collection from "Prayer Time: A Collection of Catholic Prayers"
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search prayers by title or content..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Catholic Prayers"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Prayer List</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {Object.entries(groupedAndFilteredPrayers).map(([category, prayers]) => (
                            <div key={category}>
                                <h5 className="text-md font-bold text-amber-800/80 sticky top-0 bg-white/80 backdrop-blur-sm py-1">{category}</h5>
                                {prayers.map(prayer => (
                                    <button
                                        key={prayer.id}
                                        onClick={() => setSelectedPrayerId(prayer.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors text-amber-800 text-sm ${selectedPrayerId === prayer.id ? 'bg-amber-200 font-bold' : 'hover:bg-amber-100'}`}
                                    >
                                        #{prayer.id}: {prayer.title}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && prayerForDisplay ? (
                        <>
                            {(() => {
                                const bookmarkedItem = bookmarkedItems.find(i => i.type === 'catholicPrayer' && i.data.id === prayerForDisplay.id);
                                const isSelected = !!bookmarkedItem;
                                const bookmarkedSections = (bookmarkedItem && 'sections' in bookmarkedItem && bookmarkedItem.sections) || [];
                                const highlightKey = `catholicPrayer_${prayerForDisplay.id}`;
                                return (
                                    <CatholicPrayerCard 
                                        prayer={prayerForDisplay} 
                                        onToggleSelect={onToggleSelect}
                                        isSelected={isSelected}
                                        bookmarkedSections={bookmarkedSections}
                                        highlightedSections={highlightedSections[highlightKey] || []}
                                        onToggleSectionBookmark={onToggleSectionBookmark(prayerForDisplay, 'catholicPrayer')}
                                    />
                                );
                            })()}
                             <div className="flex justify-between items-center mt-4 px-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous Prayer"
                                >
                                    &larr; Previous
                                </button>
                                {currentIndex !== -1 && (
                                     <span className="text-sm text-amber-700 font-medium">{currentIndex + 1} / {flatPrayerList.length}</span>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={currentIndex === -1 || currentIndex >= flatPrayerList.length - 1}
                                    className="px-6 py-2 font-semibold rounded-full text-amber-800 bg-white/80 hover:bg-amber-100 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next Prayer"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        </>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                                <p className="text-amber-700 text-center">
                                   {searchTerm ? "No prayers found matching your search." : "Select a prayer from the list to view its details."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatholicPrayers;