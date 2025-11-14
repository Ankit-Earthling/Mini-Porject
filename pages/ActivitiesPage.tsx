import React, { useState, useEffect } from 'react';
import { INSPIRATIONAL_QUOTES } from '../constants';
import type { VideoResource } from '../types';

// --- Sub-Components for Activities ---

const BreathingAnimator: React.FC = () => {
    const [text, setText] = useState('Ready?');
    const [animationClass, setAnimationClass] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        if (!isStarted) {
            return;
        }

        const cycle = () => {
            setText('Breathe In');
            setAnimationClass('animate-breathe-in');
            setTimeout(() => {
                setText('Hold');
                setAnimationClass('animate-breathe-hold');
                setTimeout(() => {
                    setText('Breathe Out');
                    setAnimationClass('animate-breathe-out');
                }, 4000); // Hold duration
            }, 4000); // Inhale duration
        };

        cycle(); // Start the first cycle immediately
        const interval = setInterval(cycle, 12000); // Total cycle time: 4s in + 4s hold + 4s out

        return () => clearInterval(interval);
    }, [isStarted]);

    const handleReset = () => {
        setIsStarted(false);
        setText('Ready?');
        setAnimationClass('');
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-lg h-80">
            <style>
                {`
                @keyframes breathe-in {
                    0% { transform: scale(0.7); }
                    100% { transform: scale(1); }
                }
                @keyframes breathe-out {
                    0% { transform: scale(1); }
                    100% { transform: scale(0.7); }
                }
                .animate-breathe-in { animation: breathe-in 4s ease-in-out forwards; }
                .animate-breathe-hold { transform: scale(1); }
                .animate-breathe-out { animation: breathe-out 4s ease-in-out forwards; }
                `}
            </style>
            <div className={`w-48 h-48 bg-calm-blue-800 rounded-full flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${isStarted ? animationClass : 'transform scale-70'}`}>
                <div className="w-44 h-44 bg-calm-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">{text}</span>
                </div>
            </div>
            <div className="mt-8 h-14"> {/* Container to prevent layout shift */}
                {!isStarted ? (
                     <button
                        onClick={() => setIsStarted(true)}
                        className="bg-calm-green-600 hover:bg-calm-green-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up"
                    >
                        Start
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors animate-fade-in-up"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};


const SOUND_VIDEOS: VideoResource[] = [
    { title: 'Gentle Rain', description: '3 hours of relaxing rain sounds for sleep and study.', videoId: 'q76bMs-mK_4' },
    { title: 'Forest Ambience', description: 'Calm sounds of a forest with birds singing.', videoId: 'M03b3iEcI8g' },
    { title: 'Crackling Fireplace', description: 'Cozy and warm fireplace sounds.', videoId: 'Kpi_42gH5M8' },
];

const VideoCard: React.FC<{ video: VideoResource }> = ({ video }) => (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700/50 flex flex-col">
        <div className="w-full aspect-video">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${video.videoId}`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
        <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{video.title}</h3>
            <p className="text-slate-400 text-sm">{video.description}</p>
        </div>
    </div>
);

const InspirationCorner: React.FC = () => {
    const [quote, setQuote] = useState(INSPIRATIONAL_QUOTES[0]);

    const getNewQuote = () => {
        const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
        setQuote(INSPIRATIONAL_QUOTES[randomIndex]);
    };

    useEffect(getNewQuote, []);

    return (
        <div className="p-8 bg-slate-900 rounded-lg text-center h-64 flex flex-col justify-center">
            <blockquote className="text-xl italic text-slate-300">"{quote.quote}"</blockquote>
            <p className="mt-4 text-calm-green-300 font-semibold">- {quote.author}</p>
            <button onClick={getNewQuote} className="mt-6 mx-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors">
                New Quote
            </button>
        </div>
    );
};

// --- Main Page Component ---
const ActivitiesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Relaxation & Stress Relief</h1>
            <p className="max-w-2xl mx-auto text-slate-400 mt-4">
                A collection of anonymous, privacy-focused activities designed to help you find your calm, destress, and practice mindfulness.
            </p>
        </div>
        
        <div className="space-y-16">
            {/* Breathing Exercise */}
            <section>
                <h2 className="text-3xl font-bold text-calm-blue-300 mb-6">Mindful Breathing</h2>
                <BreathingAnimator />
            </section>
            
            {/* Calming Sounds */}
            <section>
                <h2 className="text-3xl font-bold text-calm-blue-300 mb-6">Calming Sounds & Sleep Aids</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SOUND_VIDEOS.map(video => <VideoCard key={video.videoId} video={video} />)}
                </div>
            </section>
            
            {/* Inspiration Corner */}
            <section>
                <h2 className="text-3xl font-bold text-calm-blue-300 mb-6">Inspiration Corner</h2>
                <InspirationCorner />
            </section>

        </div>
    </div>
  );
};

export default ActivitiesPage;