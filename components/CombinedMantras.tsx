import React, { useRef, useState } from 'react';
// FIX: Import Sloka type for updated prop definition.
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
  bookmarkedItem: BookmarkedItem | null;
  onRemoveBookmark: () => void;
  // FIX: onExplainRequest should only handle Slokas, as it's only called for them. This resolves the type error in App.tsx.
  onExplainRequest: (slokas: Sloka[]) => void;
}

const CombinedSelections: React.FC<CombinedSelectionsProps> = ({ bookmarkedItem, onRemoveBookmark, onExplainRequest }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    if (!bookmarkedItem) return null;

    const handleScreenshot = async () => {
        setIsCapturing(true);
        try {
            await captureElementAsImage(cardRef.current, 'bookmarked-practice.png');
        } catch (error) {
            // The utility function already alerts the user.
        } finally {
            setIsCapturing(false);
        }
    };

    const isSloka = bookmarkedItem.type === 'sloka';
    // FIX: Use type guards on `bookmarkedItem` to correctly access properties.
    // TypeScript can infer the type of `bookmarkedItem.data` within the ternary expressions.
    const identifier = isSloka ? `#${bookmarkedItem.data.slokaNumber}` : `#${bookmarkedItem.data.id}`;
    // FIX: Use type guards on `bookmarkedItem` for the title property as well.
    const title = isSloka ? bookmarkedItem.data.bijaMantra : bookmarkedItem.data.title;

    return (
        <div ref={cardRef} className="fixed bottom-4 right-4 w-full max-w-xs bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-amber-300/50 p-4 animate-fade-in z-50 flex flex-col">
            <h3 className="text-lg font-bold text-amber-900 text-center pb-2 mb-2 border-b border-amber-200 flex justify-between items-center">
                <span>Your Bookmarked Practice</span>
                 <button
                    onClick={handleScreenshot}
                    disabled={isCapturing}
                    className="p-1 text-amber-600 rounded-full hover:bg-amber-100 hover:text-amber-800 transition-colors disabled:opacity-50"
                    aria-label="Capture screenshot of this selection"
                >
                    {isCapturing ? <LoadingSpinnerIcon/> : <CameraIcon />}
                </button>
            </h3>
            <div className="overflow-y-auto flex-grow pr-2">
                <div className="flex justify-between items-center bg-amber-50/70 rounded-md p-2 text-sm">
                    <span className="font-semibold text-amber-800 flex-1 pr-2 truncate">{`${identifier}: ${title}`}</span>
                    <button 
                        onClick={onRemoveBookmark}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-colors"
                        aria-label={`Remove bookmarked item`}
                    >
                       <CloseIcon/>
                    </button>
                </div>
            </div>
            {isSloka && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                     <button 
                        // FIX: Pass `bookmarkedItem.data` which is correctly typed as Sloka here due to the `isSloka` check.
                        onClick={() => onExplainRequest([bookmarkedItem.data])}
                        className="w-full mt-1 text-sm text-white bg-amber-800 hover:bg-amber-900 rounded-full py-1.5 transition-colors"
                    >
                        Explain Mantra
                    </button>
                </div>
            )}
        </div>
    );
};

export default CombinedSelections;