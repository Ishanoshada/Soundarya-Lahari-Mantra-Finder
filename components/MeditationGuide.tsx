import React, { useState, useRef } from 'react';
import { captureElementAsImage } from '../services/geminiService';
import type { MeditationGuideContent, MeditationGuideData } from '../types';

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SectionContent: React.FC<{ content: (string | { type: 'list'; items: string[] } | { type: 'table'; headers: string[]; rows: string[][] })[] }> = ({ content }) => {
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
                } else if (item.type === 'table') {
                    return (
                        <div key={index} className="overflow-x-auto my-2 rounded-lg border border-amber-200/50 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-amber-100/50 text-amber-900 font-semibold">
                                    <tr>
                                        {item.headers.map((header, hIndex) => <th key={hIndex} className="p-3 border-b border-amber-200">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.rows.map((row, rIndex) => (
                                        <tr key={rIndex} className="hover:bg-amber-50/30 border-t border-amber-200/50">
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


interface MeditationGuideProps {
    guide: MeditationGuideContent;
    isSelected: boolean;
    onToggleSelect: () => void;
}

const MeditationGuide: React.FC<MeditationGuideProps> = ({ guide, isSelected, onToggleSelect }) => {
    const guideRef = useRef<HTMLDivElement>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleScreenshot = async () => {
        setIsCapturing(true);
        try {
            await captureElementAsImage(guideRef.current, 'meditation-guide.png');
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <div ref={guideRef} className="w-full bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 border border-amber-300/50">
            <div className="text-center mb-6 border-b border-amber-200/50 pb-4">
                <p className="text-amber-700 uppercase tracking-widest text-sm">{guide.parent}</p>
                <h3 className="text-3xl font-bold text-amber-900 font-playfair">{guide.title}</h3>
                <h4 className="text-xl text-amber-800 mt-1">{guide.subtitle}</h4>
            </div>

            {guide.safetyNote ? (
                <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg shadow-sm">
                    <p className="font-semibold">{guide.safetyNote}</p>
                </div>
            ) : (
                 <div className="mb-6 bg-amber-100/60 border-l-4 border-amber-500 text-amber-800 p-3 rounded-r-lg shadow-sm">
                    <p className="font-semibold text-sm">Disclaimer:</p>
                    <p className="text-xs italic">
                        The meditation practices described here are for informational purposes. Some advanced techniques may require guidance from a qualified teacher. Practice with awareness and listen to your body and mind. This tool is not a substitute for professional medical or psychological advice.
                    </p>
                </div>
            )}

            <div className="text-slate-700 leading-relaxed space-y-6">
                {guide.sections.map((section, index) => (
                    <div key={index}>
                        <h5 className="text-xl font-bold text-amber-800 mb-2">{section.heading}</h5>
                        <SectionContent content={section.content} />
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-amber-200/50 flex flex-col items-center gap-4">
                 <button
                    onClick={onToggleSelect}
                    className={`px-6 py-2 font-semibold rounded-full text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 hover:shadow-lg hover:-translate-y-0.5
                        ${isSelected 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-amber-800 hover:bg-amber-900'
                        }`}
                >
                    {isSelected ? '✓ Bookmarked' : 'Bookmark this Guide'}
                </button>
                <button
                    onClick={handleScreenshot}
                    disabled={isCapturing}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-800 bg-white/60 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    <CameraIcon />
                    {isCapturing ? 'Capturing...' : 'Share this Guide'}
                </button>
            </div>
        </div>
    );
};

export default MeditationGuide;