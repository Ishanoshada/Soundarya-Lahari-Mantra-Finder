import React from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface FullScreenWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const FullScreenWrapper: React.FC<FullScreenWrapperProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    // Use a unique ID for ARIA
    const titleId = `fullscreen-title-${title.replace(/\s+/g, '-')}`;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <div
                className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col border border-white/30"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex justify-between items-center p-4 border-b border-amber-200/50">
                    <h2 id={titleId} className="text-xl font-bold text-amber-900 truncate pr-4">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                        aria-label="Close full screen view"
                    >
                        <CloseIcon />
                    </button>
                </header>
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FullScreenWrapper;
