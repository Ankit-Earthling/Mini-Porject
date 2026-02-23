
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEARN_TOPICS } from '../constants/learnContent';
import { findLocalCounselors } from '../services/apiService';
import type { Counselor, LearnTopic } from '../types';

const CounselorCard: React.FC<{ counselor: Counselor }> = ({ counselor }) => (
    <div className="bg-dark-neutral/60 p-6 rounded-2xl border border-light-neutral hover:border-primary transition-all shadow-xl animate-fade-in-up group">
        <div className="flex justify-between items-start mb-4">
            <h4 className="text-xl font-black text-primary leading-tight">{counselor.name}</h4>
        </div>
        {counselor.specialty && (
            <div className="mb-4">
                <span className="text-[9px] font-black text-accent uppercase tracking-[0.4em] px-3 py-1 bg-accent/5 rounded-full border border-accent/20">
                    {counselor.specialty}
                </span>
            </div>
        )}
        <div className="space-y-3 mb-6">
            <p className="text-light-text/50 text-xs leading-relaxed italic">
                <span className="text-white/20 font-mono text-[10px] uppercase block mb-1">Location</span>
                {counselor.address}
            </p>
            <p className="text-light-text/70 font-mono text-[10px] uppercase tracking-widest">{counselor.phone}</p>
        </div>
        <div className="flex gap-3">
             <a 
                href={`tel:${counselor.phone.replace(/\D/g, '')}`} 
                className="flex-grow bg-primary text-dark-bg font-black py-3 rounded-xl text-[10px] uppercase tracking-widest text-center shadow-lg hover:bg-primary-dark transition-all transform active:scale-95"
            >
                Connect Now
            </a>
             {counselor.phone.startsWith('http') && (
                 <a href={counselor.phone} target="_blank" rel="noopener noreferrer" className="bg-white/5 text-light-text/60 px-4 py-3 rounded-xl text-[10px] font-bold hover:bg-light-neutral transition-all border border-white/5 uppercase tracking-widest">Map View</a>
             )}
        </div>
    </div>
);

const LearnCard: React.FC<{ topic: LearnTopic }> = ({ topic }) => (
    <Link to={`/diseases/${topic.slug}`} className="group relative block bg-dark-neutral rounded-[2rem] overflow-hidden shadow-2xl border border-light-neutral/50 hover:border-primary transition-all duration-500 transform hover:-translate-y-2">
        <div className="h-56">
            <img src={topic.cardImage} alt={topic.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent"></div>
        </div>
        <div className="p-8 pt-4">
            <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors duration-300 tracking-tight leading-none mb-3">{topic.title}</h3>
            <p className="text-light-text/50 text-sm line-clamp-2">"{topic.cardDescription}"</p>
            <div className="mt-6 flex items-center text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                Explore Deep-Dive <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
    </Link>
);

const DiseasesPage: React.FC = () => {
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFindCounselors = () => {
        setIsLoading(true);
        setError('');
        setResults(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const data = await findLocalCounselors(position.coords.latitude, position.coords.longitude);
                    setResults(data);
                } catch (apiError: any) {
                    setError('Local directory sync failed. Please use National Helpline 1800-599-0019.');
                } finally {
                    setIsLoading(false);
                }
            },
            () => {
                setError('Location access required for local directory. Please check permissions.');
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-20 animate-fade-in-up">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-4 block">Knowledge Hub</span>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-6">Learn & Understand</h1>
                <p className="max-w-3xl mx-auto text-light-text/60 text-lg md:text-xl italic">"The first step toward healing is the courage to understand your own internal landscape."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
                {LEARN_TOPICS.map(topic => (
                    <LearnCard key={topic.slug} topic={topic} />
                ))}
            </div>

            <div className="max-w-4xl mx-auto bg-dark-neutral p-12 rounded-[4rem] border border-light-neutral/50 text-center shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Personalized Clinical Discovery</h2>
                <p className="text-light-text/50 mb-10 max-w-xl mx-auto leading-relaxed">Need professional guidance? Our Intelligent Directory utilizes geospatial grounding to identify trusted counselors near your current location.</p>
                
                <button 
                    onClick={handleFindCounselors} 
                    disabled={isLoading}
                    className="bg-primary text-dark-bg font-black py-5 px-12 rounded-2xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 flex items-center justify-center mx-auto disabled:opacity-50 uppercase tracking-widest"
                >
                    {isLoading ? 'Syncing Neural Map...' : 'Find Counselors Nearby'}
                </button>

                {error && <p className="text-red-400 mt-6 font-mono text-xs uppercase tracking-widest">{error}</p>}

                {results && (
                    <div className="mt-16 text-left space-y-12 animate-fade-in-up">
                        <div className="prose prose-invert max-w-none prose-p:text-light-text/60">
                            <h3 className="text-2xl font-bold text-accent mb-6 border-b border-white/5 pb-4">AI Recommendations</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{results.text}</p>
                        </div>
                        
                        {results.maps?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-6">Verified Local Listings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {results.maps.map((place: any, i: number) => (
                                        <CounselorCard 
                                            key={i} 
                                            counselor={{
                                                name: place.title || "Counseling Center",
                                                address: place.title || "Address in recommendations above",
                                                phone: place.uri || "Visit website",
                                                specialty: "Clinical Support"
                                            }} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiseasesPage;
