import React, { useState, useEffect } from 'react';
import type { Sloka } from '../types';
import { analyzeSlokas } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AnalysisDisplay from './AnalysisDisplay';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface SlokaAnalysisModalProps {
    sloka: Sloka;
    language: string;
    onClose: () => void;
}

const SlokaAnalysisModal: React.FC<SlokaAnalysisModalProps> = ({ sloka, language, onClose }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            setAnalysis(null);
            try {
                const result = await analyzeSlokas([sloka], language);
                setAnalysis(result);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred while analyzing the sloka.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalysis();
    }, [sloka, language]);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-title"
        >
            <div
                className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 border border-amber-300/50"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center pb-4 border-b border-amber-200">
                    <h2 id="analysis-title" className="text-2xl font-bold text-amber-900">Deeper Insight: Sloka #{sloka.slokaNumber}</h2>
                    <button
                        onClick={onClose}
                        className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </header>

                <div className="mt-4 flex-grow overflow-y-auto pr-2">
                    {isLoading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                    {analysis && !isLoading && <AnalysisDisplay text={analysis} />}
                </div>
            </div>
        </div>
    );
};

export default SlokaAnalysisModal;
