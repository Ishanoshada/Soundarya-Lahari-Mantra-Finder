import React, { useRef, useState } from 'react';
import type { TantraBookMantra } from '../types';
import { captureElementAsImage } from '../services/geminiService';

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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h3 className="text-lg font-semibold text-amber-800 border-b-2 border-amber-200 pb-1 mb-2">{title}</h3>
        <div className="text-slate-700 text-base space-y-2">{children}</div>
    </div>
);

interface TantraMantraCardProps {
  mantra: TantraBookMantra;
  onToggleSelect: (mantra: TantraBookMantra) => void;
  isSelected: boolean;
}

const TantraMantraCard: React.FC<TantraMantraCardProps> = ({ mantra, onToggleSelect, isSelected }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleScreenshot = async () => {
    setIsCapturing(true);
    try {
      const filename = `mantra-compendium-${mantra.id}-${mantra.title.split(' ')[0].toLowerCase()}.png`;
      await captureElementAsImage(cardRef.current, filename);
    } catch (error) {
      // The utility function already alerts the user.
    } finally {
      setIsCapturing(false);
    }
  };

  const containerClasses = "w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 border border-amber-300/50 relative";

  return (
    <div ref={cardRef} className={containerClasses}>
      <button
        onClick={handleScreenshot}
        disabled={isCapturing}
        className="absolute top-4 right-4 p-2 text-amber-600 bg-white/50 rounded-full hover:bg-amber-100 hover:text-amber-800 transition-colors disabled:opacity-50 z-10"
        aria-label="Capture screenshot of this mantra"
      >
        {isCapturing ? <LoadingSpinnerIcon /> : <CameraIcon />}
      </button>

      <div className="text-center mb-6">
        <p className="text-amber-700 uppercase tracking-widest text-sm">{mantra.category}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mt-1">{mantra.title}</h2>
      </div>

      <Section title="Purpose">
        <ul className="list-disc list-inside space-y-1">
            {mantra.purpose.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </Section>

      <Section title="Transliterated Mantra">
        <div className="italic text-slate-800 my-2 p-4 bg-amber-50/50 rounded-lg border-l-4 border-amber-500 text-center space-y-1">
            {mantra.transliteratedMantra.map((line, i) => <p key={i}>"{line}"</p>)}
        </div>
      </Section>

      <Section title="Instructions">
          <p>{mantra.instructions}</p>
      </Section>


      {mantra.notes && (
        <Section title="Notes">
          {mantra.notes.map((note, i) => <p key={i} className="text-sm text-slate-600">- {note}</p>)}
        </Section>
      )}

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

export default TantraMantraCard;
