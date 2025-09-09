
import React, { useState, useMemo } from 'react';
import type { BookmarkedItem, Sloka, VedicRemedy, TantraBookMantra } from '../types';
import CopyableLink from './CopyableLink';

const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface BookmarkManagerProps {
    bookmarkedItems: BookmarkedItem[];
    language: string;
}

const LANG_CODE_MAP: { [key: string]: string } = {
    'English': 'en',
    'Sinhala': 'si',
    'Tamil': 'ta',
    'Hindi': 'hi',
    'Malayalam': 'ml'
};

const BookmarkManager: React.FC<BookmarkManagerProps> = ({ bookmarkedItems, language }) => {
    const [showModal, setShowModal] = useState(false);

    const shareableLink = useMemo(() => {
        if (!bookmarkedItems || bookmarkedItems.length === 0) return null;

        const params = new URLSearchParams();
        
        const slokaItems = bookmarkedItems.filter((i): i is { type: 'sloka'; data: Sloka; sections?: string[] } => i.type === 'sloka');
        const remedyItems = bookmarkedItems.filter((i): i is { type: 'remedy'; data: VedicRemedy; sections?: string[] } => i.type === 'remedy');
        const tantraItems = bookmarkedItems.filter((i): i is { type: 'tantra'; data: TantraBookMantra; sections?: string[] } => i.type === 'tantra');

        if (slokaItems.length > 0) {
            params.set('slokas', slokaItems.map(i => i.data.slokaNumber).join(','));
            slokaItems.forEach(item => {
                if (item.sections && item.sections.length > 0) {
                    params.set(`s${item.data.slokaNumber}_sections`, item.sections.map(encodeURIComponent).join(','));
                }
            });
        }
        if (remedyItems.length > 0) {
            params.set('remedies', remedyItems.map(i => i.data.id).join(','));
             remedyItems.forEach(item => {
                if (item.sections && item.sections.length > 0) {
                    params.set(`r${item.data.id}_sections`, item.sections.map(encodeURIComponent).join(','));
                }
            });
        }
        if (tantraItems.length > 0) {
            params.set('tantra', tantraItems.map(i => i.data.id).join(','));
            tantraItems.forEach(item => {
                if (item.sections && item.sections.length > 0) {
                    params.set(`t${item.data.id}_sections`, item.sections.map(encodeURIComponent).join(','));
                }
            });
        }

        if (language !== 'English') {
            const langCode = LANG_CODE_MAP[language];
            if (langCode) {
                params.set('lan', langCode);
            }
        }
        
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }, [bookmarkedItems, language]);
    
    const handleOpenModal = () => {
        if (shareableLink) {
            setShowModal(true);
        } else {
            alert("Please bookmark one or more items to create a shareable link.");
        }
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-800 bg-white/80 rounded-full border border-amber-300/60 shadow-sm hover:bg-amber-100 transition-colors disabled:opacity-50"
                aria-label="Bookmark and Share Selections"
            >
                <BookmarkIcon />
                Bookmark & Share
            </button>
            {showModal && shareableLink && (
                 <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
                    onClick={() => setShowModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="bookmark-title"
                >
                    <div 
                        className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-amber-300/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center pb-4 mb-4 border-b border-amber-200">
                            <h2 id="bookmark-title" className="text-2xl font-bold text-amber-900">Share Your Practice</h2>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                                aria-label="Close"
                            >
                               <CloseIcon />
                            </button>
                        </header>
                        <div>
                            <p className="text-amber-800 mb-2">
                                You can use this link to save your bookmarked practice or share it with others.
                            </p>
                            <CopyableLink link={shareableLink} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookmarkManager;
