import React, { useState, useRef, useEffect } from 'react';

// Sutta text data (extracted from buddhistChantsData.ts)
const suttas = [
    {
        title: "Mangala Sutta - Discourse on Blessings",
        english: [
            "\"Avoiding those of foolish ways, Associating with the wise, And honoring those worthy of honor. These are the highest blessings.",
            "\"Living in places of suitable kinds, With the fruits of past good deeds And guided by the rightfùl way. These are the highest blessings.",
            "\"Accomplished in learning and craftsman's skills, With discipline, highly trained, And speech that is true and pleasant to hear. These are the highest blessings.",
            "\"Providing for mother and father's support And cherishing family, And ways of work that harm no being. These are the highest blessings.",
            "\"Generosity and a righteous life, Offering help to relatives and kin, And acting in ways that leave no blame. These are the highest blessings.",
            "\"Steadfast in restraint, and shunning evil ways, Avoiding intoxicants that dùll the mind, And heedfulness in all things that arise. These are the highest blessings.",
            "\"Respectfulness and of humble ways, Contentment and gratitude, And hearing the Dhamma frequently taught. These are the highest blessings.",
            "\"Patience and willingness to accept one's faults, Seeing venerated seekers of the truth, And sharing often the words of Dhamma. These are the highest blessings.",
            "\"The Holy Life lived with ardent effort, Seeing for oneself the Noble Truths And the realization of Nibblna. These are the highest blessings.",
            "\"Although involved in worldly tasks, Unshaken the mind remains And beyond all sorrow, spotless, secure. These are the highest blessings.",
            "\"They who live by following this path Know victory wherever they go, And every place for them is safe. These are the highest blessings.\""
        ]
    },
    {
        title: "Ratana Sutta - The Jewel Discourse",
        english: [
            "Whatever treasure is here or beyond, Or precious jewel in the heavens None is equal to the Perfect One. In the Buddha is this precious jewel. By this truth may there be well-being.",
            "The calm Sakyan sage found cessation, Dispassion, the deathless, the sublime There is nothing equal to that state. In the Dhamma is this precious jewel. By this truth may there be well-being.",
            "The eight persons, praised by the good These four pairs are the gift-worthy Disciples of the Well-Gone One. Gifts to them yield abundant fruit. In the Sangha is this precious jewel. By this truth may there be well-being.",
            "Those who comprehend the Noble Truths Well taught by him of deep wisdom, Even if they were slightly negligent Would not take an eighth existence. In the Sangha is this precious jewel. By this truth may there be well-being.",
            "Like woodland groves in blossom In the first heat of summer, So is the most excellent Dhamma that he taught, Leading to Nibbana, the highest good. In the Buddha is this precious jewel. By this truth may there be well-being.",
            "Their past is extinct with no new arising, Their minds not drawn to future birth. Their old seeds destroyed, their desires no more growing, The wise go out just like this lamp. In the Sangha is this precious jewel. By this truth may there be well-being."
        ]
    },
    {
        title: "Karaniya Metta Sutta - Chant of Loving-Kindness",
        english: [
            "This is what should be done By one who is skilled in goodness And who knows the path of peace:",
            "Let them be able and upright, Straightforward and gentle in speech, Humble and not conceited,",
            "Contented and easily satisfied, Not busy with duties and frugal in their ways.",
            "Peaceful and calm, and wise and skillful, Not proud and demanding in nature.",
            "Let them not do the slightest thing That the wise would later reprove, Wishing: In gladness and in safety, May all beings be happy.",
            "Whatever living beings there may be, Whether they are weak or strong, omitting none, The great or the mighty, medium, short, or small,",
            "The seen and the unseen, Those living near and far away, Those born and to be born, May all beings be happy.",
            "Let none deceive another Or despise any being in any state.",
            "Let none through anger or ill-will Wish harm upon another.",
            "Even as a mother protects with her life Her child, her only child,",
            "So with a boundless heart Should one cherish all living beings,",
            "Radiating kindness over the entire world: Spreading upwards to the skies And downwards to the depths, Outwards and unbounded, Freed from hatred and ill-will.",
            "Whether standing or walking, seated or lying down, Free from drowsiness, One should sustain this recollection.",
            "This is said to be the sublime abiding.",
            "By not holding to fixed views, The pure-hearted one, having clarity of vision, Being freed from all sense-desires, Is not born again into this world."
        ]
    }
];

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void }> = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-amber-200/50">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center py-3 px-4 text-left text-lg font-semibold text-amber-800 hover:bg-amber-100/50 transition-colors"
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


const MahaPirithaPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [audioData, setAudioData] = useState<number[]>(new Array(20).fill(0));
    const audioRef = useRef<HTMLAudioElement>(null);
    const [openSutta, setOpenSutta] = useState<string | null>(null);

    const generateAudioData = () => {
        if (isPlaying) {
            const newData = Array.from({ length: 20 }, () => {
                const base = Math.random() * 0.8 + 0.1;
                const spike = Math.random() > 0.85 ? Math.random() * 0.4 : 0;
                return Math.min(base + spike, 1);
            });
            setAudioData(newData);
        } else {
            setAudioData(new Array(20).fill(0.05));
        }
    };

    useEffect(() => {
        const interval = setInterval(generateAudioData, 80);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
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

    // Icons
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

    const toggleSutta = (title: string) => {
        setOpenSutta(openSutta === title ? null : title);
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-amber-200/50">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-amber-900 mb-2">Maha Piritha (මහ පිරිත)</h3>
                    <p className="text-amber-700">The Great Protective Chants</p>
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
                    <div className="flex items-center gap-3 text-sm text-amber-700">
                        <span className="min-w-[40px]">{formatTime(currentTime)}</span>
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
                        <span className="min-w-[40px]">{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={handlePlayPause}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                    </div>

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
                            aria-label="Volume control"
                        />
                        <span className="text-sm text-amber-700 min-w-[30px]">{Math.round(volume * 100)}%</span>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    preload="metadata"
                    src="https://github.com/Ishanoshada/Soundarya-Lahari-Mantra-Finder/raw/refs/heads/main/audios/maha-piritha-1.mp3"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="hidden"
                >
                    Your browser does not support the audio element.
                </audio>

                <div className="mt-8 pt-6 border-t border-amber-200/50">
                    <h4 className="text-xl font-bold text-center text-amber-900 mb-4">Core Chants of the Maha Piritha</h4>
                    <div className="bg-white/50 rounded-xl overflow-hidden border border-amber-200/50 shadow-inner">
                        {suttas.map((sutta) => (
                            <AccordionItem
                                key={sutta.title}
                                title={sutta.title}
                                isOpen={openSutta === sutta.title}
                                onClick={() => toggleSutta(sutta.title)}
                            >
                                {sutta.english.map((line, index) => <p key={index}>{line}</p>)}
                            </AccordionItem>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-amber-800/80">
                        Audio source credit: <a 
                            href="https://www.pirith.org/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline hover:text-amber-600 transition-colors"
                        >
                            pirith.org
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

export default MahaPirithaPlayer;
