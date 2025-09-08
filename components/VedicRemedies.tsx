import React, { useState, useMemo, useEffect } from 'react';
import { VEDIC_REMEDIES_DATA } from '../constants/remediesData';
import RemedyCard from './RemedyCard';
import type { VedicRemedy } from '../types';
import { translateVedicRemedies } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface VedicRemediesProps {
    onToggleSelect: (remedy: VedicRemedy) => void;
    isRemedySelected: (remedy: VedicRemedy) => boolean;
    language: string;
    initialSelectedId: number | null;
}

const VedicRemedies: React.FC<VedicRemediesProps> = ({ onToggleSelect, isRemedySelected, language, initialSelectedId }) => {
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
            <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-amber-900">Vedic Remedies</h3>
                <p className="text-amber-700 mt-1">
                    Practices from "Infallible Vedic Remedies" by Swami Shantananda Puri
                </p>
                <p className="text-xs text-amber-600/80 mt-2 italic px-4">
                    Disclaimer: The remedies listed below are sourced directly from the aforementioned text. Their efficacy has not been independently verified by the creators of this application.
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search remedies by purpose or title..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Vedic Remedies"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Remedy List (English)</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {filteredRemedies.map(remedy => (
                            <button
                                key={remedy.id}
                                onClick={() => setSelectedRemedyId(remedy.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors text-amber-800 text-sm ${selectedRemedyId === remedy.id ? 'bg-amber-200 font-bold' : 'hover:bg-amber-100'}`}
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
                        <RemedyCard 
                            remedy={remedyForDisplay} 
                            onToggleSelect={onToggleSelect}
                            isSelected={isRemedySelected(remedyForDisplay)}
                        />
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