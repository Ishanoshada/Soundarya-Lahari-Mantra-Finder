import React, { useState, useEffect } from 'react';

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.858l4.707-4.707a1 1 0 011.414 0V19.707a1 1 0 01-1.414 0L5.858 15z" />
    </svg>
);

interface AudioButtonProps {
    textToSpeak: string;
    lang?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({ textToSpeak, lang = 'sa-IN' }) => {
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true);
            const loadVoices = () => {
                setVoices(window.speechSynthesis.getVoices());
            };
            // The voices list is populated asynchronously.
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices(); // For browsers that load it immediately.

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const handleSpeak = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent card clicks or other parent events
        if (!isSupported) {
            alert('Your browser does not support text-to-speech.');
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any previous speech

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Find a suitable voice from the loaded voices
        let selectedVoice = voices.find(voice => voice.lang === lang); // Try for Sanskrit
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === 'hi-IN'); // Fallback to Hindi
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            // If no specific voice is found, set the lang property and let the browser pick.
            utterance.lang = lang;
        }
        
        utterance.rate = 0.7; // Slower for mantras
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    };

    if (!isSupported) {
        return null;
    }

    return (
        <button
            onClick={handleSpeak}
            className="p-1 rounded-full text-amber-700 hover:bg-amber-200/50 transition-colors"
            aria-label={`Listen to ${textToSpeak}`}
        >
            <SpeakerIcon />
        </button>
    );
};

export default AudioButton;
