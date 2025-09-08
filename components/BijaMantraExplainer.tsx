import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Sloka, BijaMantraApiResponse } from '../types';
import { explainBijaMantras, captureElementAsImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface BijaMantraExplainerProps {
  slokas: Sloka[];
  onClose: () => void;
}

const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Malayalam"];

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LoadingSpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const BijaMantraExplainer: React.FC<BijaMantraExplainerProps> = ({ slokas, onClose }) => {
  const [explanation, setExplanation] = useState<BijaMantraApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState('English');
  const explainerRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const bijaMantras = useMemo(() => slokas.map(s => s.bijaMantra), [slokas]);

  useEffect(() => {
    const fetchExplanation = async () => {
      if (bijaMantras.length === 0) return;
      
      setIsLoading(true);
      setError(null);
      setExplanation(null);

      try {
        const result = await explainBijaMantras(bijaMantras, language);
        setExplanation(result);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred while fetching the explanation.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExplanation();
  }, [bijaMantras, language]);

  const handleScreenshot = async () => {
    setIsCapturing(true);
    try {
        await captureElementAsImage(explainerRef.current, 'bija-mantra-explanation.png');
    } catch (error) {
        // The utility function already alerts the user.
    } finally {
        setIsCapturing(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explainer-title"
    >
      <div 
        ref={explainerRef}
        className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-6 border border-amber-300/50"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center pb-4 border-b border-amber-200">
            <h2 id="explainer-title" className="text-2xl font-bold text-amber-900">Understanding Bija Mantras</h2>
            <div className="flex items-center gap-4">
                <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                    className="p-2 border border-amber-300 rounded-lg shadow-sm bg-white/80 focus:ring-amber-500 focus:border-amber-500 text-sm"
                    aria-label="Select language for explanation"
                >
                    {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <button
                    onClick={handleScreenshot}
                    disabled={isCapturing}
                    className="text-amber-700 hover:text-amber-900 transition-colors p-1 rounded-full hover:bg-amber-100"
                    aria-label="Capture explanation"
                >
                    {isCapturing ? <LoadingSpinnerIcon /> : <CameraIcon />}
                </button>
                <button 
                    onClick={onClose} 
                    className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                    aria-label="Close"
                >
                   <CloseIcon />
                </button>
            </div>
        </header>

        <div className="mt-4 flex-grow overflow-y-auto pr-2">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {explanation && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-amber-100/80 backdrop-blur-md">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{explanation.tableHeaders.bijaMantra}</th>
                                <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{explanation.tableHeaders.associatedDeity}</th>
                                <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{explanation.tableHeaders.associatedChakra}</th>
                                <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{explanation.tableHeaders.usageAndBenefits}</th>
                                <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{explanation.tableHeaders.associatedShlokas}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {explanation.explanations.map((item, index) => (
                                <tr key={index} className="bg-white/50 hover:bg-amber-50/50 transition-colors">
                                    <td className="p-3 border-b border-amber-100 font-bold text-amber-900 align-top">{item.bijaMantra}</td>
                                    <td className="p-3 border-b border-amber-100 text-slate-800 align-top">{item.associatedDeity}</td>
                                    <td className="p-3 border-b border-amber-100 text-slate-800 align-top">{item.associatedChakra}</td>
                                    <td className="p-3 border-b border-amber-100 text-slate-800 align-top">{item.usageAndBenefits}</td>
                                    <td className="p-3 border-b border-amber-100 text-slate-800 align-top">{item.associatedShlokas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BijaMantraExplainer;