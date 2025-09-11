import React, { useRef, useState } from 'react';
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

interface AnalysisDisplayProps {
    text: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ text }) => {
    const analysisRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleScreenshot = async () => {
      setIsCapturing(true);
      try {
        await captureElementAsImage(analysisRef.current, 'soundarya-lahari-analysis.png');
      } catch (error) {
        // The utility function already alerts the user.
      } finally {
        setIsCapturing(false);
      }
    };

    return (
        <div ref={analysisRef} className="relative bg-amber-100/50 p-6 rounded-lg border border-amber-300/50 text-slate-700 leading-relaxed space-y-2">
            <button
                onClick={handleScreenshot}
                disabled={isCapturing}
                className="absolute top-4 right-4 p-2 text-amber-600 bg-white/50 rounded-full hover:bg-amber-100 hover:text-amber-800 transition-colors disabled:opacity-50 z-10"
                aria-label="Capture screenshot of this analysis"
            >
                {isCapturing ? <LoadingSpinnerIcon /> : <CameraIcon />}
            </button>
            {text.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                const match = line.match(/\*\s*\*\*(.*?)\*\*:/);
                if (match && match[1]) {
                    const header = match[1].trim();
                    const content = line.substring(match[0].length).trim();
                    return (
                        <div key={index}>
                            <h4 className="text-lg font-bold text-amber-800 mt-3 first:mt-0">{header}</h4>
                            {content && <p>{content}</p>}
                        </div>
                    );
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

export default AnalysisDisplay;