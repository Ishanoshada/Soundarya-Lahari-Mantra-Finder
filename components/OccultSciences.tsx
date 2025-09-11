import React, { useState, useMemo, useEffect } from 'react';
import { OCCULT_SCIENCES_DATA } from '../constants/occultData';
import type { OccultScienceChapter } from '../types';
import { translateOccultChapters } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const SectionContent: React.FC<{ content: OccultScienceChapter['content'] }> = ({ content }) => {
    return (
        <div className="space-y-4">
            {content.map((item, index) => {
                if (typeof item === 'string') {
                    return <p key={index} dangerouslySetInnerHTML={{ __html: item }} />;
                } else if (item.type === 'list') {
                    return (
                        <ul key={index} className="list-disc list-inside space-y-2 pl-4">
                            {item.items.map((li, liIndex) => <li key={liIndex} dangerouslySetInnerHTML={{ __html: li }}/>)}
                        </ul>
                    );
                } else if (item.type === 'subheading') {
                    return <h4 key={index} className="text-xl font-bold mt-6 mb-2">{item.text}</h4>;
                } else if (item.type === 'table') {
                    return (
                        <div key={index} className="overflow-x-auto my-4 rounded-lg border border-[var(--border-color)] shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="font-semibold bg-black/10">
                                    <tr>
                                        {item.headers.map((header, hIndex) => <th key={hIndex} className="p-3 border-b border-[var(--border-color)]">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.rows.map((row, rIndex) => (
                                        <tr key={rIndex} className="border-t border-[var(--border-color)]">
                                            {row.map((cell, cIndex) => <td key={cIndex} className="p-3">{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

interface OccultSciencesProps {
    language: string;
    onApiUse: () => void;
}

const OccultSciences: React.FC<OccultSciencesProps> = ({ language, onApiUse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(OCCULT_SCIENCES_DATA[0]?.id || null);

    const [chapterForDisplay, setChapterForDisplay] = useState<OccultScienceChapter | null>(null);
    const [translationCache, setTranslationCache] = useState<Record<string, OccultScienceChapter>>({});
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredChapters = useMemo(() => {
        if (!searchTerm.trim()) {
            return OCCULT_SCIENCES_DATA;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return OCCULT_SCIENCES_DATA.filter(chapter => 
            chapter.title.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm]);

    useEffect(() => {
        if (filteredChapters.length > 0 && !filteredChapters.some(c => c.id === selectedChapterId)) {
            setSelectedChapterId(filteredChapters[0].id);
        } else if (filteredChapters.length === 0) {
            setSelectedChapterId(null);
        }
    }, [filteredChapters, selectedChapterId]);

    useEffect(() => {
        if (selectedChapterId === null) {
            setChapterForDisplay(null);
            return;
        }

        const originalChapter = OCCULT_SCIENCES_DATA.find(c => c.id === selectedChapterId);
        if (!originalChapter) return;

        if (language === 'English') {
            setChapterForDisplay(originalChapter);
            setError(null);
            return;
        }

        const cacheKey = `${selectedChapterId}-${language}`;
        if (translationCache[cacheKey]) {
            setChapterForDisplay(translationCache[cacheKey]);
            return;
        }
        
        const fetchTranslation = async () => {
            setIsCardLoading(true);
            setError(null);
            try {
                const translated = await translateOccultChapters([originalChapter], language);
                if (translated && translated.length > 0) {
                    setTranslationCache(prev => ({ ...prev, [cacheKey]: translated[0] }));
                    setChapterForDisplay(translated[0]);
                    onApiUse();
                } else {
                     throw new Error("Translation returned empty result.");
                }
            } catch (err: any) {
                setError(err.message);
                setChapterForDisplay(originalChapter); // Fallback to English on error
            } finally {
                setIsCardLoading(false);
            }
        };

        fetchTranslation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChapterId, language]);
    
    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold">Yantra-Mantra-Tantra & Occult Sciences</h3>
                <p className="mt-1">
                   Content from the book by Unknown
                </p>
            </div>
            
            <div className="mb-8 px-2 max-w-3xl mx-auto">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search chapters..."
                    className="w-full px-5 py-3 text-lg rounded-full shadow-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] mt-4"
                    aria-label="Search Occult Sciences Chapters"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 p-4 rounded-xl shadow-lg">
                    <h4 className="text-lg font-bold mb-3 text-center">Chapters</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {filteredChapters.map(chapter => (
                            <button
                                key={chapter.id}
                                onClick={() => setSelectedChapterId(chapter.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors font-medium text-sm ${selectedChapterId === chapter.id ? 'bg-[var(--accent-color)] text-white shadow-inner' : 'hover:bg-black/10'}`}
                            >
                                {chapter.id}. {chapter.title}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="md:col-span-2 p-6 rounded-xl shadow-lg">
                    {isCardLoading && <div className="flex justify-center items-center h-full min-h-[400px]"><LoadingSpinner /></div>}
                    {!isCardLoading && error && <ErrorMessage message={error} />}
                    {!isCardLoading && !error && chapterForDisplay ? (
                        <div className="prose prose-lg max-w-none text-[var(--text-primary)] prose-headings:text-[var(--text-header)] prose-strong:text-[var(--text-header)]">
                            <h3 className="text-2xl font-bold mb-4 border-b pb-2 border-[var(--border-color)]">{chapterForDisplay.title}</h3>
                            <SectionContent content={chapterForDisplay.content} />
                        </div>
                    ) : (
                        !isCardLoading && !error && (
                            <div className="flex items-center justify-center h-full min-h-[400px]">
                                <p className="text-center">
                                   {searchTerm ? "No chapters found matching your search." : "Select a chapter from the list to view its contents."}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default OccultSciences;