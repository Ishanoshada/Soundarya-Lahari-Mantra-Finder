import React, { useState } from 'react';

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

interface CopyableLinkProps {
    link: string;
}

const CopyableLink: React.FC<CopyableLinkProps> = ({ link }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy link.');
        });
    };

    return (
        <div className="flex items-center gap-2 mt-4">
            <input
                type="text"
                value={link}
                readOnly
                className="w-full px-3 py-2 text-sm text-amber-900 bg-white/80 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Shareable link"
            />
            <button
                onClick={handleCopy}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    copied
                        ? 'bg-emerald-600 text-white focus:ring-emerald-500'
                        : 'bg-amber-800 text-white hover:bg-amber-900 focus:ring-amber-500'
                }`}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
        </div>
    );
};

export default CopyableLink;
