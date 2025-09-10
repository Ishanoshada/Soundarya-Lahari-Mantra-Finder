import React, { useRef, useState } from 'react';
import type { VedicRemedy } from '../types';
import { captureElementAsImage } from '../services/geminiService';
import FullScreenWrapper from './FullScreenWrapper';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FullscreenEnterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
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
        <div className="flex justify-between items-center border-b-2 border-amber-200/50 pb-1 mb-2">
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
        <div className="text-slate-700 text-base space-y-2">{children}</div>
    </div>
);


interface RemedyCardProps {
  remedy: VedicRemedy;
  onToggleSelect?: (remedy: VedicRemedy) => void;
  isSelected?: boolean;
  isFullScreenView?: boolean;
  bookmarkedSections?: string[];
  highlightedSections?: string[];
  onToggleSectionBookmark?: (sectionTitle: string) => void;
}

const RemedyCard: React.FC<RemedyCardProps> = (props) => {
  const { remedy, onToggleSelect, isSelected = false, isFullScreenView = false, bookmarkedSections = [], highlightedSections = [], onToggleSectionBookmark } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleScreenshot = async () => {
    const elementToCapture = isFullScreen ? document.querySelector(`#fullscreen-remedy-${remedy.id}`) : cardRef.current;
    setIsCapturing(true);
    try {
      const filename = `remedy-${remedy.id}-${remedy.title.split(' ')[0].toLowerCase()}.png`;
      await captureElementAsImage(elementToCapture as HTMLElement, filename);
    } catch (error) {
      // The utility function already alerts the user.
    } finally {
      setIsCapturing(false);
    }
  };

  const containerClasses = isFullScreenView 
    ? "p-6 md:p-8" 
    : "w-full bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/30 relative";
    
  const CardContent = () => (
    <div ref={isFullScreenView ? null : cardRef} className={containerClasses}>
      {!isFullScreenView && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                  onClick={() => setIsFullScreen(true)}
                  className="p-2 text-amber-700 bg-white/50 rounded-full hover:bg-amber-100 hover:text-amber-900 transition-colors"
                  aria-label="Enter full screen"
              >
                  <FullscreenEnterIcon />
              </button>
              <button
                onClick={handleScreenshot}
                disabled={isCapturing}
                className="p-2 text-amber-700 bg-white/50 rounded-full hover:bg-amber-100 hover:text-amber-900 transition-colors disabled:opacity-50"
                aria-label="Capture screenshot of this remedy"
              >
                {isCapturing ? <LoadingSpinnerIcon /> : <CameraIcon />}
              </button>
          </div>
      )}

      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900">{`Remedy #${remedy.id}: ${remedy.title}`}</h2>
      </div>

      <Section 
        title="Purpose"
        isBookmarked={bookmarkedSections.includes("Purpose")}
        isHighlighted={highlightedSections.includes("Purpose")}
        onToggleBookmark={onToggleSectionBookmark}
      >
        <p>{remedy.purpose}</p>
      </Section>

      {remedy.sanskritMantra && (
         <Section 
            title="Sanskrit Mantra"
            isBookmarked={bookmarkedSections.includes("Sanskrit Mantra")}
            isHighlighted={highlightedSections.includes("Sanskrit Mantra")}
            onToggleBookmark={onToggleSectionBookmark}
        >
             <div className="italic text-slate-800 my-2 p-4 bg-amber-100/40 rounded-lg border-l-4 border-amber-500 text-center space-y-1 font-noto-sans-sinhala text-lg">
                {remedy.sanskritMantra.map((line, i) => <p key={i}>{line}</p>)}
            </div>
        </Section>
      )}

      <Section 
        title="Transliterated Mantra"
        isBookmarked={bookmarkedSections.includes("Transliterated Mantra")}
        isHighlighted={highlightedSections.includes("Transliterated Mantra")}
        onToggleBookmark={onToggleSectionBookmark}
      >
        <div className="italic text-slate-800 my-2 p-4 bg-amber-100/40 rounded-lg border-l-4 border-amber-500 text-center space-y-1">
            {remedy.transliteratedMantra.map((line, i) => <p key={i}>"{line}"</p>)}
        </div>
      </Section>

      {remedy.chantingInstruction && (
        <Section 
            title="Chanting Instruction"
            isBookmarked={bookmarkedSections.includes("Chanting Instruction")}
            isHighlighted={highlightedSections.includes("Chanting Instruction")}
            onToggleBookmark={onToggleSectionBookmark}
        >
          <p>{remedy.chantingInstruction}</p>
        </Section>
      )}

      {remedy.notes && (
        <Section 
            title="Notes"
            isBookmarked={bookmarkedSections.includes("Notes")}
            isHighlighted={highlightedSections.includes("Notes")}
            onToggleBookmark={onToggleSectionBookmark}
        >
          {remedy.notes.map((note, i) => <p key={i} className="text-sm text-slate-600">- {note}</p>)}
        </Section>
      )}

      {onToggleSelect && (
        <div className="mt-6 pt-6 border-t border-amber-200/50 flex justify-center">
             <button
                onClick={() => onToggleSelect(remedy)}
                className={`px-6 py-2 font-semibold rounded-full text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 hover:shadow-lg hover:-translate-y-0.5
                    ${isSelected 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-amber-800 hover:bg-amber-900'
                    }`}
            >
                {isSelected ? '✓ Bookmarked' : 'Bookmark for Sadhana'}
            </button>
        </div>
    )}
    </div>
  );
  
  return (
    <>
      <CardContent />
      {isFullScreen && (
        <FullScreenWrapper isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} title={`Remedy #${remedy.id}: ${remedy.title}`}>
          <div id={`fullscreen-remedy-${remedy.id}`}>
            <RemedyCard {...props} isFullScreenView={true} />
          </div>
        </FullScreenWrapper>
      )}
    </>
  );
};

export default RemedyCard;
