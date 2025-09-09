import React, { useState, useEffect, useRef } from 'react';
import type { Sloka, CombinedMantraResponse } from '../types';
import { createCombinedMantra, captureElementAsImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h4 className="text-lg font-bold text-amber-800 mt-3 first:mt-0">{title}</h4>
        <div className="text-slate-700 text-base">{children}</div>
    </div>
);


interface CombinedMantraModalProps {
    slokas: Sloka[];
    language: string;
    onClose: () => void;
}

const CombinedMantraModal: React.FC<CombinedMantraModalProps> = ({ slokas, language, onClose }) => {
    const [result, setResult] = useState<CombinedMantraResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    
    useEffect(() => {
        const fetchCombinedMantra = async () => {
            setIsLoading(true);
            setError(null);
            setResult(null);
            try {
                const bijaMantras = slokas.map(s => s.bijaMantra);
                const response = await createCombinedMantra(bijaMantras, slokas, language);
                setResult(response);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred while creating the mantra.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCombinedMantra();
    }, [slokas, language]);
    
    const handleScreenshot = async () => {
        setIsCapturing(true);
        try {
          await captureElementAsImage(modalRef.current, 'combined-mantra.png');
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
            aria-labelledby="combined-mantra-title"
        >
            <div
                ref={modalRef}
                className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 border border-amber-300/50"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center pb-4 border-b border-amber-200">
                    <h2 id="combined-mantra-title" className="text-2xl font-bold text-amber-900">AI-Generated Combined Mantra</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleScreenshot}
                            disabled={isCapturing || isLoading || !result}
                            className="text-amber-700 hover:text-amber-900 transition-colors p-1 rounded-full hover:bg-amber-100 disabled:opacity-50"
                            aria-label="Capture mantra"
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
                    {result && !isLoading && (
                        <div className="space-y-4">
                             <div className="text-center p-4 bg-amber-100/50 rounded-lg">
                                <p className="text-sm uppercase tracking-widest text-amber-800/80">{result.mantraName}</p>
                                <p className="bija-mantra-gradient-text text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-red-800 py-1 font-playfair">
                                    {result.newMantra}
                                </p>
                             </div>
                             <div className="p-4">
                                <Section title="Core Purpose">
                                    <p>{result.corePurpose}</p>
                                </Section>
                                <Section title="Synergistic Benefits">
                                    <p>{result.synergisticBenefits}</p>
                                </Section>
                                <Section title="Chanting Guidance">
                                    <p>{result.chantingGuidance}</p>
                                </Section>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CombinedMantraModal;