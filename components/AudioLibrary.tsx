import React, { useState, useEffect, useMemo, useRef } from 'react';
import GenericAudioPlayer from './GenericAudioPlayer';
import { AUDIO_TRACKS } from '../constants/audioData';
import type { BookmarkedItem, AudioTrack } from '../types';

interface AudioLibraryProps {
    bookmarkedItems: BookmarkedItem[];
    onToggleBookmark: (track: AudioTrack) => void;
    initialSelectedId: string | null;
}

const suttas = [
    {
        title: "Mangala Sutta - Discourse on Blessings",
        content: [
            "Avoiding those of foolish ways, Associating with the wise, And honoring those worthy of honor. These are the highest blessings.",
            "Living in places of suitable kinds, With the fruits of past good deeds And guided by the rightfùl way. These are the highest blessings.",
            "Accomplished in learning and craftsman's skills, With discipline, highly trained, And speech that is true and pleasant to hear. These are the highest blessings.",
            "Providing for mother and father's support And cherishing family, And ways of work that harm no being. These are the highest blessings.",
            "Generosity and a righteous life, Offering help to relatives and kin, And acting in ways that leave no blame. These are the highest blessings.",
            "Steadfast in restraint, and shunning evil ways, Avoiding intoxicants that dùll the mind, And heedfulness in all things that arise. These are the highest blessings.",
            "Respectfulness and of humble ways, Contentment and gratitude, And hearing the Dhamma frequently taught. These are the highest blessings.",
            "Patience and willingness to accept one's faults, Seeing venerated seekers of the truth, And sharing often the words of Dhamma. These are the highest blessings.",
            "The Holy Life lived with ardent effort, Seeing for oneself the Noble Truths And the realization of Nibblna. These are the highest blessings.",
            "Although involved in worldly tasks, Unshaken the mind remains And beyond all sorrow, spotless, secure. These are the highest blessings.",
            "They who live by following this path Know victory wherever they go, And every place for them is safe. These are the highest blessings."
        ]
    },
    {
        title: "Ratana Sutta - The Jewel Discourse",
        content: [
            "Whatever treasure is here or beyond, Or precious jewel in the heavens None is equal to the Perfect One. In the Buddha is this precious jewel. By this truth may there be well-being.",
            "The calm Sakyan sage found cessation, Dispassion, the deathless, the sublime There is nothing equal to that state. In the Dhamma is this precious jewel. By this truth may there be well-being.",
            "The eight persons, praised by the good These four pairs are the gift-worthy Disciples of the Well-Gone One. Gifts to them yield abundant fruit. In the Sangha is this precious jewel. By this truth may there be well-being.",
        ]
    },
    {
        title: "Karaniya Metta Sutta - Chant of Loving-Kindness",
        content: [
            "Let them be able and upright, Straightforward and gentle in speech, Humble and not conceited, Contented and easily satisfied...",
            "Radiating kindness over the entire world: Spreading upwards to the skies And downwards to the depths, Outwards and unbounded, Freed from hatred and ill-will.",
            "By not holding to fixed views, The pure-hearted one, having clarity of vision, Being freed from all sense-desires, Is not born again into this world."
        ]
    }
];

const AudioLibrary: React.FC<AudioLibraryProps> = ({ bookmarkedItems, onToggleBookmark, initialSelectedId }) => {
    
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(initialSelectedId || (AUDIO_TRACKS.length > 0 ? AUDIO_TRACKS[0].id : null));
    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialSelectedId) {
            setSelectedTrackId(initialSelectedId);
            // Scroll the player into view when an initial ID is provided (from a bookmark link)
            setTimeout(() => {
                playerContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [initialSelectedId]);

    const selectedTrack = useMemo(() => {
        return AUDIO_TRACKS.find(track => track.id === selectedTrackId);
    }, [selectedTrackId]);

    const credits = {
        lahari: { text: "C.T.Raghavan's Blog", url: "https://ctraghavan.blogspot.com/2015/03/soundarya-lahari-full-audio.html" },
        pirith: { text: "pirith.org", url: "https://www.pirith.org/" }
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
             <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-amber-900">Audio Library</h3>
                <p className="text-amber-700 mt-1">
                    Listen to complete renditions of sacred chants.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white/60 backdrop-blur-lg p-4 rounded-2xl border border-white/30 shadow-xl">
                    <h4 className="text-lg font-bold text-amber-900 mb-3 text-center">Available Chants</h4>
                    <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
                        {AUDIO_TRACKS.map(track => (
                            <button
                                key={track.id}
                                onClick={() => setSelectedTrackId(track.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors text-amber-900 font-medium text-sm ${selectedTrackId === track.id ? 'bg-amber-200 shadow-inner' : 'hover:bg-amber-100/70'}`}
                            >
                                {track.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2" ref={playerContainerRef}>
                    {selectedTrack ? (() => {
                        const isBookmarked = bookmarkedItems.some(item => item.type === 'audio' && item.data.id === selectedTrack.id);
                        return (
                            <GenericAudioPlayer
                                key={selectedTrack.id}
                                track={selectedTrack}
                                accordionData={selectedTrack.id === 'pirith' ? suttas : undefined}
                                credit={credits[selectedTrack.id as keyof typeof credits]}
                                isSelected={isBookmarked}
                                onToggleBookmark={onToggleBookmark}
                            />
                        );
                    })() : (
                         <div className="flex items-center justify-center h-full bg-white/60 p-4 rounded-xl border border-amber-300/50 shadow-lg min-h-[400px]">
                            <p className="text-amber-700 text-center">
                                Select a chant from the list to begin listening.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AudioLibrary;