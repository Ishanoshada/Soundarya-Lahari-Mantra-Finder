import React, { useRef, useState } from 'react';
import type { Sloka } from '../types';
import { captureElementAsImage } from '../services/geminiService';
import AudioButton from './AudioButton';

interface MantraCardProps {
  mantra: Sloka;
  onToggleSelect: (mantra: Sloka) => void;
  isSelected: boolean;
  onExplainRequest: () => void;
  onAnalyzeRequest: (sloka: Sloka) => void;
  isNested?: boolean;
  bookmarkedSections?: string[];
  highlightedSections?: string[];
  onToggleSectionBookmark?: (sectionTitle: string) => void;
}

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LoadingSpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const BookmarkSectionIcon: React.FC<{ isBookmarked: boolean }> = ({ isBookmarked }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-2.5L5 16V4z" />
    </svg>
);

const Section: React.FC<{
    title: string;
    children: React.ReactNode;
    isBookmarked?: boolean;
    isHighlighted?: boolean;
    onToggleBookmark?: (title: string) => void;
}> = ({ title, children, isBookmarked = false, isHighlighted = false, onToggleBookmark }) => (
    <div className={`mb-4 transition-all duration-300 ${isHighlighted ? 'bg-yellow-100/70 rounded-lg p-3 -m-3 shadow-inner' : ''}`}>
        <div className="flex justify-between items-center border-b-2 border-amber-200 pb-1 mb-2">
            <h3 className="text-lg font-semibold text-amber-800">{title}</h3>
            {onToggleBookmark && (
                <button
                    onClick={() => onToggleBookmark(title)}
                    className={`p-1 rounded-full transition-colors ${isBookmarked ? 'text-emerald-600 bg-emerald-100/50' : 'text-slate-400 hover:bg-slate-200/50'}`}
                    aria-label={`Bookmark section: ${title}`}
                    aria-pressed={isBookmarked}
                >
                    <BookmarkSectionIcon isBookmarked={isBookmarked} />
                </button>
            )}
        </div>
        <div className="text-slate-700 text-base">{children}</div>
    </div>
);

const formatTitleForDisplay = (title: string): string => {
  return title.replace(/\s*-\s*\d+$/, '').trim();
};

const MantraCard: React.FC<MantraCardProps> = ({ 
    mantra, onToggleSelect, isSelected, onExplainRequest, onAnalyzeRequest, isNested = false,
    bookmarkedSections = [], highlightedSections = [], onToggleSectionBookmark = () => {}
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleScreenshot = async () => {
    setIsCapturing(true);
    try {
      const filename = `sloka-${mantra.slokaNumber}-${mantra.title.split(' ')[0].toLowerCase()}.png`;
      await captureElementAsImage(cardRef.current, filename);
    } catch (error) {
        // The utility function already alerts the user.
    } finally {
      setIsCapturing(false);
    }
  };

  const containerClasses = isNested
    ? "p-6 md:p-8"
    : "w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 border border-amber-300/50 animate-fade-in";
  
  return (
    <div className={`${containerClasses} relative`} ref={cardRef}>
        <button
            onClick={handleScreenshot}
            disabled={isCapturing}
            className="absolute top-4 right-4 p-2 text-amber-600 bg-white/50 rounded-full hover:bg-amber-100 hover:text-amber-800 transition-colors disabled:opacity-50 z-10"
            aria-label="Capture screenshot of this card"
        >
            {isCapturing ? <LoadingSpinnerIcon /> : <CameraIcon />}
        </button>

        <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900">{`Sloka #${mantra.slokaNumber}: ${formatTitleForDisplay(mantra.title)}`}</h2>
            <p className="text-lg text-amber-700 mt-1">Goddess: {mantra.goddess}</p>
            <div className="mt-4">
                <p className="text-sm uppercase tracking-widest text-amber-800/80">Bija Mantra</p>
                <div className="flex justify-center items-center gap-2">
                    <p className="bija-mantra-gradient-text text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-red-800 py-1 font-playfair">
                        {mantra.bijaMantra}
                    </p>
                    <AudioButton textToSpeak={mantra.bijaMantra} />
                </div>
                 <div className="mt-2 flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
                    <button 
                        onClick={onExplainRequest}
                        className="text-sm text-amber-800 hover:text-amber-900 underline transition-colors"
                    >
                        Explain Bija Mantra
                    </button>
                    <button 
                        onClick={() => onAnalyzeRequest(mantra)}
                        className="text-sm text-amber-800 hover:text-amber-900 underline transition-colors"
                    >
                        Analyze Sloka
                    </button>
                 </div>
            </div>
        </div>

        <div className="italic text-slate-800 my-4 p-4 bg-amber-50/50 rounded-lg border-l-4 border-amber-500 text-center">
            <p>"{mantra.slokaText}"</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
                 <Section 
                    title="Beneficial Results"
                    isBookmarked={bookmarkedSections.includes("Beneficial Results")}
                    isHighlighted={highlightedSections.includes("Beneficial Results")}
                    onToggleBookmark={onToggleSectionBookmark}
                 >
                    <p>{mantra.beneficialResults}</p>
                </Section>
                 <Section 
                    title="Literal Results"
                    isBookmarked={bookmarkedSections.includes("Literal Results")}
                    isHighlighted={highlightedSections.includes("Literal Results")}
                    onToggleBookmark={onToggleSectionBookmark}
                 >
                    <p>{mantra.literalResults}</p>
                </Section>
            </div>
            <div>
                 <Section 
                    title="Mode of Worship"
                    isBookmarked={bookmarkedSections.includes("Mode of Worship")}
                    isHighlighted={highlightedSections.includes("Mode of Worship")}
                    onToggleBookmark={onToggleSectionBookmark}
                 >
                    <p>{mantra.modeOfWorship}</p>
                </Section>
            </div>
        </div>
        <div className="mt-6 pt-6 border-t border-amber-200 flex justify-center">
             <button
                onClick={() => onToggleSelect(mantra)}
                className={`px-6 py-2 font-semibold rounded-full text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                    ${isSelected 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-amber-800 hover:bg-amber-900'
                    }`}
            >
                {isSelected ? '✓ Bookmarked' : 'Bookmark for Sadhana'}
            </button>
        </div>
    </div>
  );
};

export default MantraCard;
