import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [audioData, setAudioData] = useState<number[]>(new Array(20).fill(0));
    const audioRef = useRef<HTMLAudioElement>(null);

    // Generate realistic audio visualization data
    const generateAudioData = () => {
        if (isPlaying) {
            const newData = Array.from({ length: 20 }, () => {
                const base = Math.random() * 0.8 + 0.1; // Base level
                const spike = Math.random() > 0.85 ? Math.random() * 0.4 : 0; // Occasional spikes
                return Math.min(base + spike, 1);
            });
            setAudioData(newData);
        } else {
            setAudioData(new Array(20).fill(0.05));
        }
    };

    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(generateAudioData, 80);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const handlePause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handlePlay2 = () => {
        setIsPlaying(true);
    };

    const handlePause2 = () => {
        setIsPlaying(false);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const PlayIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
    );

    const PauseIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
    );

    const VolumeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
    );

    return (
        <div className="w-full max-w-2xl mx-auto my-6">
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-amber-200/50">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-amber-900 mb-2">Soundarya Lahari</h3>
                    <p className="text-amber-700">Complete rendition of all 100 slokas</p>
                </div>

                {/* Audio Visualization */}
                <div className="flex justify-center items-end h-32 mb-8 gap-1 px-4">
                    {audioData.map((height, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-t from-amber-600 to-amber-400 rounded-full transition-all duration-150 ease-out ${
                                isPlaying ? 'animate-pulse' : ''
                            }`}
                            style={{
                                width: '6px',
                                height: `${Math.max(height * 100, 8)}%`,
                                transform: isPlaying ? `scaleY(${0.8 + height * 0.4})` : 'scaleY(1)',
                            }}
                        />
                    ))}
                </div>

                {/* Custom Controls */}
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 text-sm text-amber-700">
                        <span className="min-w-[40px]">{formatTime(currentTime)}</span>
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #d97706 0%, #d97706 ${(currentTime / duration) * 100}%, #fbbf24 ${(currentTime / duration) * 100}%, #fbbf24 100%)`
                                }}
                            />
                        </div>
                        <span className="min-w-[40px]">{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={handlePlayPause}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center justify-center gap-3">
                        <VolumeIcon />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-amber-700 min-w-[30px]">{Math.round(volume * 100)}%</span>
                    </div>
                </div>

                {/* Hidden HTML5 Audio Element */}
                <audio
                    ref={audioRef}
                    preload="metadata"
                    src="https://github.com/Ishanoshada/Soundarya-Lahari-Mantra-Finder/raw/refs/heads/main/audios/soundarya-lahari.mp3"
                    onPlay={handlePlay2}
                    onPause={handlePause2}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="hidden"
                >
                    Your browser does not support the audio element.
                </audio>

                {/* Credit */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-amber-800/80">
                        Audio source: <a 
                            href="https://ctraghavan.blogspot.com/2015/03/soundarya-lahari-full-audio.html" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline hover:text-amber-600 transition-colors"
                        >
                            C.T.Raghavan's Blog
                        </a>
                    </p>
                </div>
            </div>

            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #d97706;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .slider::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #d97706;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default AudioPlayer;