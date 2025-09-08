import React, { useState } from 'react';

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


interface CopyButtonProps {
    textToCopy: string;
    className?: string;
    ariaLabel?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className, ariaLabel = "Copy text" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent clicks from bubbling up to parent elements
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text.');
        });
    };

    return (
        <button 
            onClick={handleCopy} 
            className={className}
            aria-label={copied ? "Copied!" : ariaLabel}
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
    );
};

export default CopyButton;
