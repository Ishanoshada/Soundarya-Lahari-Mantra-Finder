import React, { useState, useRef, useEffect } from 'react';
import type { AudioTrack } from '../types';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-amber-200/50">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center py-3 px-4 text-left text-lg font-semibold text-amber-800 hover:bg-amber-100/50 transition-colors"
            aria-expanded={isOpen}
        >
            <span>{title}</span>
            <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {isOpen && (
            <div className="p-4 bg-amber-50/50 text-slate-700 space-y-2">
                {children}
            </div>
        )}
    </div>
);

interface GenericAudioPlayerProps {
    track: AudioTrack;
    accordionData?: { title: string; content: string[] }[];
    credit: { text: string; url: string };
    isSelected: boolean;
    onToggleBookmark: (track: AudioTrack) => void;
}

const GenericAudioPlayer: React.FC<GenericAudioPlayerProps> = ({ track, accordionData, credit, isSelected, onToggleBookmark }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [audioData, setAudioData] = useState<number[]>(new Array(40).fill(0));
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    const generateAudioData = () => {
        if (isPlaying) {
            const newData = Array.from({ length: 40 }, () => Math.random() * 0.9 + 0.1);
            setAudioData(newData);
        } else {
            setAudioData(new Array(40).fill(0.05));
        }
    };

    useEffect(() => {
        const interval = setInterval(generateAudioData, 100);
        return () => clearInterval(interval);
    }, [isPlaying]);
    
    // Reset player state when track changes
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
        }
    }, [track]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };
    
    const handleTimeUpdate = () => audioRef.current && setCurrentTime(audioRef.current.currentTime);
    const handleLoadedMetadata = () => audioRef.current && setDuration(audioRef.current.duration);
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) audioRef.current.volume = newVolume;
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) audioRef.current.currentTime = newTime;
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const PlayIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>);
    const PauseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>);
    const VolumeIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>);
    const DownloadIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
    const FullscreenEnterIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>);
    const CloseIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

    const containerClasses = isFullScreen
        ? "fixed inset-0 z-50 bg-gradient-to-br from-amber-50 to-orange-100 p-8 flex flex-col justify-center items-center"
        : "bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-amber-200/50";

    return (
        <div className={containerClasses} id={`audio-player-${track.id}`}>
             {isFullScreen && (
                <button onClick={() => setIsFullScreen(false)} className="absolute top-6 right-6 text-amber-800 hover:text-red-600 transition-colors p-2 rounded-full bg-white/50 hover:bg-red-100">
                    <CloseIcon />
                </button>
            )}
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-amber-900 mb-2">{track.title}</h3>
                <p className="text-amber-700">{track.subtitle}</p>
            </div>

            <div className={`flex justify-center items-end gap-1 px-4 ${isFullScreen ? 'h-48' : 'h-32 mb-8'}`}>
                {audioData.map((height, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-t from-amber-600 to-amber-400 rounded-full transition-all duration-150 ease-out"
                        style={{ width: '6px', height: `${Math.max(height * 100, 5)}%` }}
                    />
                ))}
            </div>

            <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3 text-sm text-amber-700">
                    <span>{formatTime(currentTime)}</span>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek}
                        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{ background: `linear-gradient(to right, #d97706 0%, #d97706 ${(currentTime / duration) * 100}%, #fbbf24 ${(currentTime / duration) * 100}%, #fbbf24 100%)`}} />
                    <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <a href={track.audioSrc} download className="p-3 text-amber-700 bg-white/60 rounded-full hover:bg-amber-100 transition-colors shadow-sm"><DownloadIcon /></a>
                    <button onClick={handlePlayPause} className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={() => setIsFullScreen(true)} className="p-3 text-amber-700 bg-white/60 rounded-full hover:bg-amber-100 transition-colors shadow-sm"><FullscreenEnterIcon /></button>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                    <VolumeIcon />
                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-24 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer" />
                    <span className="text-sm text-amber-700 min-w-[30px]">{Math.round(volume * 100)}%</span>
                </div>
            </div>

            <audio ref={audioRef} preload="metadata" src={track.audioSrc} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} className="hidden" />
            
            {accordionData && (
                <div className="mt-8 pt-6 border-t border-amber-200/50">
                    <h4 className="text-xl font-bold text-center text-amber-900 mb-4">Core Chants</h4>
                    <div className="bg-white/50 rounded-xl overflow-hidden border border-amber-200/50 shadow-inner">
                        {accordionData.map((item) => (
                            <AccordionItem key={item.title} title={item.title} isOpen={openAccordion === item.title} onClick={() => setOpenAccordion(openAccordion === item.title ? null : item.title)}>
                                {item.content.map((line, index) => <p key={index}>{line}</p>)}
                            </AccordionItem>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
                 <button
                    onClick={() => onToggleBookmark(track)}
                    className={`px-6 py-2 font-semibold rounded-full text-white transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 hover:shadow-lg hover:-translate-y-0.5
                        ${isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-800 hover:bg-amber-900'}`}
                >
                    {isSelected ? '✓ Bookmarked' : 'Bookmark for Practice'}
                </button>
                <p className="text-xs text-amber-800/80">
                    Audio source: <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-600 transition-colors">{credit.text}</a>
                </p>
            </div>

            <style>{`.slider::-webkit-slider-thumb { appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #d97706; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); } .slider::-moz-range-thumb { height: 16px; width: 16px; border-radius: 50%; background: #d97706; cursor: pointer; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }`}</style>
        </div>
    );
};

export default GenericAudioPlayer;