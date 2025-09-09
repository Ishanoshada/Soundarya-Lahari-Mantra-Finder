import React, { useState, useMemo, useEffect } from 'react';
import { TANTRA_BOOK_DATA } from '../constants/tantraBookData';
import TantraMantraCard from './TantraMantraCard';
// FIX: Import BookmarkedItem to use in props.
import type { TantraBookMantra, BookmarkedItem } from '../types';
import { translateTantraBookMantras } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// FIX: Update props to align with App.tsx and handle bookmarking correctly.
interface TantraBookProps {
    bookmarkedItems: BookmarkedItem[];
    highlightedSections: Record<string, string[]>;
    onToggleSelect: (mantra: TantraBookMantra) => void;
    onToggleSectionBookmark: (itemData: TantraBookMantra, itemType: 'tantra') => (sectionTitle: string) => void;
    language: string;
    initialSelectedId: number | null;
}

const TantraBook: React.FC<TantraBookProps> = ({ onToggleSelect, bookmarkedItems, highlightedSections, onToggleSectionBookmark, language, initialSelectedId }) => {
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
            <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-amber-900">Mantra Compendium</h3>
                <p className="text-amber-700 mt-1">
                    Selected practices from 'Secrets of Yantra, Mantra and Tantra'
                </p>
                 <p className="text-xs text-amber-600/80 mt-2 italic px-4">
                    Disclaimer: The practices listed below are sourced directly from the aforementioned text. Their efficacy has not been independently verified by the creators of this application.
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search compendium by purpose or title..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Mantra Compendium"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Practice List (English)</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {filteredMantras.map(mantra => (
                            <button
                                key={mantra.id}
                                onClick={() => setSelectedMantraId(mantra.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors text-amber-800 text-sm ${selectedMantraId === mantra.id ? 'bg-amber-200 font-bold' : 'hover:bg-amber-100'}`}
                            >
                                #{mantra.id}: {mantra.title}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2">
                    {isCardLoading && <LoadingSpinner />}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {/* FIX: Calculate isSelected and pass correct props to TantraMantraCard. */}
                    { !isCardLoading && !error && mantraForDisplay ? (() => {
                        const bookmarkedItem = bookmarkedItems.find(i => i.type === 'tantra' && i.data.id === mantraForDisplay.id);
                        const isSelected = !!bookmarkedItem;
                        const bookmarkedSections = bookmarkedItem?.sections || [];
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
                    })() : (
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