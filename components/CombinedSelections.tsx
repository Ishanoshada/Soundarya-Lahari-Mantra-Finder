import React, { useRef, useState } from 'react';
import type { BookmarkedItem, Sloka } from '../types';
import { captureElementAsImage } from '../services/geminiService';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

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

interface CombinedSelectionsProps {
  bookmarkedItems: BookmarkedItem[];
  onRemoveBookmark: (item: BookmarkedItem) => void;
  onExplainRequest: (slokas: Sloka[]) => void;
  onCreateCombinedMantraRequest: (slokas: Sloka[]) => void;
  onClose: () => void;
  onNavigateToBookmark: (item: BookmarkedItem) => void;
}

const CombinedSelections: React.FC<CombinedSelectionsProps> = ({ bookmarkedItems, onRemoveBookmark, onExplainRequest, onCreateCombinedMantraRequest, onClose, onNavigateToBookmark }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    if (!bookmarkedItems || bookmarkedItems.length === 0) return null;

    const handleScreenshot = async () => {
        setIsCapturing(true);
        try {
            await captureElementAsImage(cardRef.current, 'bookmarked-practices.png');
        } catch (error) {
            // The utility function already alerts the user.
        } finally {
            setIsCapturing(false);
        }
    };

    const getItemDisplay = (item: BookmarkedItem): string => {
        switch (item.type) {
            case 'sloka':
                return `Sloka #${item.data.slokaNumber}: ${item.data.title}`;
            case 'remedy':
                return `Remedy #${item.data.id}: ${item.data.title}`;
            case 'tantra':
                return `Practice #${item.data.id}: ${item.data.title}`;
            case 'mantraBook':
                return `Compendium #${item.data.id}: ${item.data.title}`;
            case 'buddhistChant':
                return `Chant #${item.data.id}: ${item.data.title}`;
            default:
                // This exhaustive check ensures we handle all bookmark types.
                const invalidItem: never = item;
                console.warn("Unknown bookmarked item type:", invalidItem);
                return 'Bookmarked Item';
        }
    };
    
    const slokasInBookmarks = bookmarkedItems
        .filter((i): i is { type: 'sloka', data: Sloka } => i.type === 'sloka')
        .map(i => i.data);

    return (
        <div ref={cardRef} className="fixed bottom-4 right-4 w-full max-w-xs bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-amber-300/50 p-4 animate-fade-in z-50 flex flex-col">
            <h3 className="text-lg font-bold text-amber-900 text-center pb-2 mb-2 border-b border-amber-200 flex justify-between items-center">
                <span>Bookmarked for Sadhana</span>
                 <div className="flex items-center gap-1">
                    <button
                        onClick={handleScreenshot}
                        disabled={isCapturing}
                        className="p-1 text-amber-600 rounded-full hover:bg-amber-100 hover:text-amber-800 transition-colors disabled:opacity-50"
                        aria-label="Capture screenshot of this selection"
                    >
                        {isCapturing ? <LoadingSpinnerIcon/> : <CameraIcon />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 text-amber-600 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors"
                        aria-label="Close bookmarks panel"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                 </div>
            </h3>
            <div className="overflow-y-auto flex-grow pr-2 space-y-2 max-h-48">
                {bookmarkedItems.map((item) => (
                    <div key={`${item.type}-${'id' in item.data ? item.data.id : item.data.slokaNumber}`} className="flex justify-between items-center bg-amber-50/70 rounded-md p-2 text-sm group">
                        <button 
                            onClick={() => onNavigateToBookmark(item)}
                            className="flex-1 pr-2 text-left"
                            aria-label={`Go to ${getItemDisplay(item)}`}
                        >
                            <span className="font-semibold text-amber-800 truncate group-hover:underline" title={getItemDisplay(item)}>
                                {getItemDisplay(item)}
                            </span>
                        </button>
                        <button 
                            onClick={() => onRemoveBookmark(item)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                            aria-label={`Remove ${getItemDisplay(item)}`}
                        >
                           <CloseIcon/>
                        </button>
                    </div>
                ))}
            </div>
            {slokasInBookmarks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200 space-y-2">
                     <button 
                        onClick={() => onExplainRequest(slokasInBookmarks)}
                        className="w-full text-sm text-white bg-amber-800 hover:bg-amber-900 rounded-full py-1.5 transition-colors"
                    >
                        Explain All Bija Mantras ({slokasInBookmarks.length})
                    </button>
                    <button 
                        onClick={() => onCreateCombinedMantraRequest(slokasInBookmarks)}
                        className="w-full text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-full py-1.5 transition-colors shadow"
                    >
                        Create Combined Mantra
                    </button>
                </div>
            )}
        </div>
    );
};

export default CombinedSelections;