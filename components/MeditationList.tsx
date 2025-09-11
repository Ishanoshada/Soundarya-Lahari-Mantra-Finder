import React, { useState, useMemo, useEffect } from 'react';
import { MEDITATION_GUIDES } from '../constants/meditationData';
import MeditationGuide from './MeditationGuide';
import type { MeditationGuideData, BookmarkedItem } from '../types';

interface MeditationListProps {
    bookmarkedItems: BookmarkedItem[];
    onToggleSelect: (guide: MeditationGuideData) => void;
    language: string;
    initialSelectedId: number | null;
}

const MeditationList: React.FC<MeditationListProps> = ({ onToggleSelect, bookmarkedItems, language, initialSelectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGuideId, setSelectedGuideId] = useState<number | null>(initialSelectedId || MEDITATION_GUIDES[0]?.id || null);
    const [guideForDisplay, setGuideForDisplay] = useState<MeditationGuideData | null>(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedGuideId(initialSelectedId);
        }
    }, [initialSelectedId]);

    const groupedAndFilteredGuides = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        
        const filtered = MEDITATION_GUIDES.filter(guide => 
            guide.title.toLowerCase().includes(lowercasedTerm) ||
            guide.subtitle.toLowerCase().includes(lowercasedTerm) ||
            guide.category.toLowerCase().includes(lowercasedTerm)
        );

        return filtered.reduce((acc, guide) => {
            (acc[guide.category] = acc[guide.category] || []).push(guide);
            return acc;
        }, {} as Record<string, MeditationGuideData[]>);

    }, [searchTerm]);

    const flatGuideList = useMemo(() => Object.values(groupedAndFilteredGuides).flat(), [groupedAndFilteredGuides]);
    const hasResults = useMemo(() => flatGuideList.length > 0, [flatGuideList]);
    
    useEffect(() => {
        if (hasResults && !flatGuideList.some(g => g.id === selectedGuideId)) {
            setSelectedGuideId(flatGuideList[0].id);
        } else if (!hasResults) {
            setSelectedGuideId(null);
        }
    }, [flatGuideList, hasResults, selectedGuideId]);
    
    useEffect(() => {
        if (selectedGuideId === null) {
            setGuideForDisplay(null);
            return;
        }
        const guide = MEDITATION_GUIDES.find(g => g.id === selectedGuideId);
        setGuideForDisplay(guide || null);
    }, [selectedGuideId]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search meditation guides..."
                    className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-4"
                    aria-label="Search Meditation Guides"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Meditation List</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {Object.entries(groupedAndFilteredGuides).map(([category, guides]) => (
                             <div key={category}>
                                <h5 className="text-md font-bold text-amber-800/80 sticky top-0 bg-white/80 backdrop-blur-sm py-1 px-3">{category} Practices</h5>
                                {guides.map(guide => (
                                    <button
                                        key={guide.id}
                                        onClick={() => setSelectedGuideId(guide.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors text-amber-900 font-medium text-sm flex items-center gap-3 ${selectedGuideId === guide.id ? 'bg-amber-200 shadow-inner' : 'hover:bg-amber-100'}`}
                                    >
                                        <span className="text-xl">{guide.icon}</span>
                                        <span>{guide.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2">
                    {guideForDisplay ? (
                        <>
                            {(() => {
                                const isSelected = bookmarkedItems.some(i => i.type === 'meditation' && i.data.id === guideForDisplay.id);
                                return (
                                    <MeditationGuide 
                                        guide={guideForDisplay.translations[language] || guideForDisplay.translations['English']} 
                                        isSelected={isSelected}
                                        onToggleSelect={() => onToggleSelect(guideForDisplay)}
                                    />
                                );
                            })()}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                            <p className="text-amber-700 text-center">
                               {searchTerm ? "No guides found matching your search." : "Select a guide from the list to begin."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeditationList;