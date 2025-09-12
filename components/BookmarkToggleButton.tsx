import React from 'react';

const BookmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

interface BookmarkToggleButtonProps {
    count: number;
    onClick: () => void;
}

const BookmarkToggleButton: React.FC<BookmarkToggleButtonProps> = ({ count, onClick }) => {
    return (
        <button
            id="floating-bookmark-toggle"
            onClick={onClick}
            className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-16 h-16 bg-amber-800 text-white rounded-full shadow-2xl hover:bg-amber-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/50 translate-x-0 opacity-100"
            aria-label={`Show ${count} bookmarked items`}
        >
            <BookmarkIcon />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-emerald-600 rounded-full border-2 border-white">
                {count}
            </span>
        </button>
    );
};

export default BookmarkToggleButton;