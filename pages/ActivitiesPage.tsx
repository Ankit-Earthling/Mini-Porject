import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { INSPIRATIONAL_QUOTES, MINDFUL_EXERCISES, POSITIVE_STORIES, MOOD_DATA, JOURNAL_PROMPTS, YOGA_ASANAS, MICRO_TASKS, PERIOD_CARE_ARTICLES, PeriodArticle } from '../constants';
import { getMoodInsight, getJournalReflection } from '../services/apiService';
import type { Quote, YogaAsana } from '../types';
import { IconJournal, IconMindfulness, IconPuzzle, IconQuote, IconX, IconHeart, IconStudyBreak, HealedPot, IconStar, IconMoon, IconSun, IconBot } from '../components/IconComponents';
import MemoryGame from '../components/MemoryGame';
import JigsawPuzzle from '../components/JigsawPuzzle';
import BackgroundVideo from '../components/BackgroundVideo';

// --- Shared Helper Hooks & Components ---
const useTypewriter = (text: string, speed = 25) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
        if (!text) return;
        setDisplayText('');
        let i = 0;
        const timer = setTimeout(() => {
             const typingInterval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);
             return () => clearInterval(typingInterval);
        }, 200);
        return () => clearTimeout(timer);
    }, [text, speed]);
    return displayText;
};

const PageHeader: React.FC<{ title: string; subtitle: string; backLink?: string; backText?: string; className?: string; }> = ({ title, subtitle, backLink, backText = "Back to Wellbeing Hub", className = 'text-primary' }) => (
    <div className="text-center mb-12 animate-fade-in-up">
        {backLink && <Link to={backLink} className="text-primary hover:text-primary/80 transition-colors duration-300 mb-4 inline-block">&larr; {backText}</Link>}
        <h1 className={`text-4xl md:text-5xl font-bold ${className}`}>{title}</h1>
        <p className="max-w-3xl mx-auto text-light-text/70 mt-4">{subtitle}</p>
    </div>
);

// --- PERMANENTLY STABILIZED IMAGE COMPONENT (Optimized for Data URIs) ---
interface SafeImageProps {
    src: string;
    alt: string;
    className?: string;
    theme?: 'yoga' | 'period';
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, theme = 'yoga' }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    // Visual Shimmer Fallback
    const VisualFallback = () => (
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-dark-bg ${className}`}>
            <div className={`absolute inset-0 transition-opacity duration-1000 ${status === 'loading' ? 'opacity-20 animate-pulse' : 'opacity-10'} ${theme === 'yoga' ? 'bg-primary' : 'bg-red-500'}`}></div>
            <div className="relative z-10">
                {theme === 'yoga' ? (
                    <HealedPot className="w-12 h-12 text-primary/30 mb-3 animate-bloom" />
                ) : (
                    <IconHeart className="w-12 h-12 text-red-400/30 mb-3 animate-pulse" />
                )}
                <p className={`text-[10px] font-mono uppercase tracking-[0.5em] font-bold ${theme === 'yoga' ? 'text-primary/60' : 'text-red-400/60'}`}>
                    INIT_IMAGE...
                </p>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-full overflow-hidden bg-dark-bg group">
            {status !== 'success' && <VisualFallback />}
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${status === 'success' ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setStatus('success')}
                onError={() => setStatus('error')}
            />
        </div>
    );
};

const ActivityCard: React.FC<{ title: string, description: string, path: string, Icon: React.FC<any>, color: 'primary' | 'gold' | 'warm'}> = ({ title, description, path, Icon, color }) => {
    const styles = {
        primary: { text: 'text-primary', border: 'border-primary/50', hoverBorder: 'hover:border-primary', iconBg: 'bg-primary/10' },
        gold: { text: 'text-accent', border: 'border-accent/50', hoverBorder: 'hover:border-accent', iconBg: 'bg-accent/10' },
        warm: { text: 'text-red-500', border: 'border-red-500/50', hoverBorder: 'hover:border-red-500', iconBg: 'bg-red-500/10' },
    }[color];
    
    return (
        <Link to={path} className={`group block bg-dark-neutral/80 backdrop-blur-sm p-8 rounded-xl border ${styles.border} ${styles.hoverBorder} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:bg-light-neutral animate-fade-in-up`}>
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${styles.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon className={`w-8 h-8 ${styles.text}`} />
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${styles.text}`}>{title}</h2>
            <p className="text-light-text/70">{description}</p>
        </Link>
    );
};


// --- Yoga Components ---
const YogaPoseCard: React.FC<{ asana: YogaAsana; onSelect: (asana: any) => void }> = ({ asana, onSelect }) => (
    <div 
        onClick={() => onSelect(asana)}
        className="group relative bg-dark-neutral/60 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-light-neutral/50 hover:border-primary transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full animate-fade-in-up"
    >
        <div className="h-60 relative overflow-hidden bg-dark-bg">
            <SafeImage src={asana.image} alt={asana.name} theme="yoga" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-5 left-8">
                <span className="text-[9px] uppercase font-black text-primary tracking-[0.5em] mb-2 block"> asana therapy </span>
                <h3 className="text-2xl font-black text-white leading-tight">{asana.name}</h3>
            </div>
        </div>
        <div className="p-8 flex-grow flex flex-col justify-between">
            <p className="text-light-text/50 text-xs italic leading-relaxed line-clamp-3">"{asana.benefits}"</p>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                 <span className="text-[10px] font-mono text-primary/70 uppercase"> {asana.focus?.split(',')[0]} </span>
                 <span className="text-primary font-black text-[10px] group-hover:translate-x-1 transition-transform uppercase tracking-widest"> view details →</span>
            </div>
        </div>
    </div>
);

export const WellbeingYogaPage: React.FC = () => {
    const [selectedAsana, setSelectedAsana] = useState<YogaAsana | null>(null);

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 relative min-h-screen">
            <PageHeader 
                title="Somatic Reset: Asana Therapy" 
                subtitle="Biologically-targeted restorative sequences engineered to induce parasympathetic dominance and regulate the central nervous system." 
                backLink="/activities" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {YOGA_ASANAS.map(asana => (
                    <YogaPoseCard key={asana.id} asana={asana} onSelect={setSelectedAsana} />
                ))}
            </div>

            {selectedAsana && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/95 backdrop-blur-3xl transition-all duration-500" onClick={() => setSelectedAsana(null)}>
                    <div 
                        className="bg-dark-neutral border border-primary/30 rounded-[3.5rem] w-full max-w-6xl max-h-[92vh] overflow-hidden shadow-4xl relative animate-fade-in-up flex flex-col lg:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full lg:w-1/2 h-72 lg:h-auto relative overflow-hidden shrink-0 bg-dark-bg border-r border-white/5">
                            <SafeImage src={selectedAsana.image} alt={selectedAsana.name} theme="yoga" className="w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-dark-neutral via-transparent to-transparent"></div>
                            
                            <button 
                                onClick={() => setSelectedAsana(null)}
                                className="hidden lg:flex absolute top-10 left-10 bg-black/50 backdrop-blur-xl text-white p-4 rounded-full hover:bg-primary hover:text-dark-bg transition-all shadow-2xl z-50 border border-white/10"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col overflow-hidden bg-dark-neutral">
                            <div className="p-10 pb-6 border-b border-white/5 relative">
                                <button onClick={() => setSelectedAsana(null)} className="lg:hidden absolute top-8 right-8 text-white/60 hover:text-primary transition-colors"><IconX className="w-8 h-8"/></button>
                                <span className="text-[10px] uppercase font-black text-primary tracking-[0.5em] mb-4 block"> somatic protocol </span>
                                <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tighter">{selectedAsana.name}</h2>
                                <p className="text-primary-light font-mono italic text-sm mt-2 opacity-60">{selectedAsana.sanskritName}</p>
                            </div>

                            <div className="flex-grow overflow-y-auto p-10 space-y-12 custom-scrollbar">
                                <section>
                                    <h3 className="text-[10px] uppercase font-black text-accent tracking-[0.3em] mb-4"> clinical indication </h3>
                                    <p className="text-light-text/80 leading-relaxed text-xl font-medium italic border-l-4 border-accent pl-8"> {selectedAsana.benefits} </p>
                                </section>

                                <section className="space-y-8">
                                    <h3 className="text-2xl font-black text-white flex items-center gap-4">
                                        <span className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-dark-bg text-sm font-black"> 01 </span>
                                        Alignment Sequence
                                    </h3>
                                    <ol className="space-y-6">
                                        {selectedAsana.steps.map((step, idx) => (
                                            <li key={idx} className="flex gap-6 group/step">
                                                <span className="flex-none w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-[10px] font-mono font-black text-primary group-hover/step:bg-primary group-hover/step:text-dark-bg transition-all"> {idx + 1} </span>
                                                <span className="text-light-text/70 group-hover/step:text-light-text text-lg leading-relaxed pt-1 transition-colors"> {step} </span>
                                            </li>
                                        ))}
                                    </ol>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                    <div className="p-8 bg-yellow-500/5 rounded-[2.5rem] border border-yellow-500/10">
                                        <h3 className="text-[10px] uppercase font-black text-yellow-500 tracking-[0.4em] mb-3"> did you know? </h3>
                                        <p className="text-light-text/70 text-sm italic leading-relaxed"> {selectedAsana.didYouKnow} </p>
                                    </div>
                                    <div className="p-8 bg-blue-400/5 rounded-[2.5rem] border border-blue-400/10">
                                        <h3 className="text-[10px] uppercase font-black text-blue-400 tracking-[0.4em] mb-3"> neuro effect </h3>
                                        <p className="text-light-text/70 text-sm italic leading-relaxed"> {selectedAsana.physiologicalEffect} </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedAsana(null)}
                                    className="w-full bg-primary text-dark-bg font-black py-6 rounded-3xl text-xl shadow-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em]"
                                >
                                    Initialize Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- ADVANCED PERIOD CARE MODULE ---

const PeriodArticleCard: React.FC<{ art: PeriodArticle; idx: number; onSelect: (art: PeriodArticle) => void }> = ({ art, idx, onSelect }) => (
    <div 
        onClick={() => onSelect(art)}
        className="bg-dark-neutral/80 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-red-500/10 hover:border-red-400/40 transition-all group animate-fade-in-up shadow-2xl cursor-pointer hover:-translate-y-2 flex flex-col h-full" 
        style={{animationDelay: `${idx * 100}ms`}}
    >
        <div className="h-64 relative overflow-hidden bg-dark-bg">
            <SafeImage src={art.image} alt={art.title} theme="period" className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-neutral/90 via-transparent to-transparent"></div>
            <span className="absolute bottom-6 left-8 bg-red-400 text-dark-bg px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                {art.category}
            </span>
        </div>
        <div className="p-10 flex-grow flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-red-400 transition-colors leading-tight">{art.title}</h3>
                <p className="text-light-text/50 text-sm leading-relaxed italic">"{art.description}"</p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-red-400/60 font-black text-[10px] uppercase tracking-[0.3em]">
                Explore Protocol <span className="text-lg">→</span>
            </div>
        </div>
    </div>
);

export const WellbeingPeriodCarePage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'articles' | 'somatic'>('articles');
    const [selectedArticle, setSelectedArticle] = useState<PeriodArticle | null>(null);
    const [heatIntensity, setHeatIntensity] = useState(40);
    const [comfortMsg, setComfortMsg] = useState("Your worth is not measured by your output during this phase.");

    const cycleMessages = [
        "Your body is performing a biological reset; allow it space.",
        "Recovery is a productive act. Silence the academic guilt.",
        "You are not being lazy; you are being clinically appropriate.",
        "Hormonal flux is a biological reality, not a personal failure.",
        "Honor your need for sensory minimization today."
    ];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 relative min-h-screen">
            <PageHeader 
                title="Period Care Sanctuary" 
                subtitle="Clinical-grade somatic support and neuro-biological validation for students navigating hormonal flux and physical discomfort." 
                backLink="/activities" 
                className="text-red-400"
            />

            <div className="flex justify-center gap-6 mb-20">
                <button 
                    onClick={() => setActiveSection('articles')}
                    className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl ${activeSection === 'articles' ? 'bg-red-400 text-dark-bg scale-105' : 'bg-dark-neutral text-light-text/30 hover:text-red-400 hover:bg-light-neutral'}`}
                >
                    Knowledge Hub
                </button>
                <button 
                    onClick={() => setActiveSection('somatic')}
                    className={`px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl ${activeSection === 'somatic' ? 'bg-red-400 text-dark-bg scale-105' : 'bg-dark-neutral text-light-text/30 hover:text-red-400 hover:bg-light-neutral'}`}
                >
                    Somatic Care
                </button>
            </div>

            {activeSection === 'articles' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto pb-20">
                    {PERIOD_CARE_ARTICLES.map((art, idx) => (
                        <PeriodArticleCard key={idx} art={art} idx={idx} onSelect={setSelectedArticle} />
                    ))}
                </div>
            ) : (
                <div className="max-w-6xl mx-auto space-y-16 animate-fade-in-up pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Validation Module */}
                        <div className="lg:col-span-1 bg-dark-neutral p-12 rounded-[3.5rem] border border-red-500/20 text-center flex flex-col justify-between shadow-2xl min-h-[450px]">
                            <div className="space-y-8">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.5em] block"> Sanctuary Check-In </span>
                                <IconHeart className="w-12 h-12 text-red-400/30 mx-auto animate-pulse" />
                                <p className="text-3xl font-black text-white leading-tight italic">"{comfortMsg}"</p>
                            </div>
                            <button 
                                onClick={() => setComfortMsg(cycleMessages[Math.floor(Math.random() * cycleMessages.length)])}
                                className="bg-red-400/10 hover:bg-red-400 text-red-400 hover:text-dark-bg transition-all py-5 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-400/20"
                            >
                                Refresh Affirmation
                            </button>
                        </div>

                        {/* Visual Heat Protocol */}
                        <div className="lg:col-span-2 bg-dark-neutral p-12 rounded-[3.5rem] border border-red-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                             <div className="relative shrink-0">
                                <div 
                                    className="w-56 h-56 rounded-full blur-[80px] animate-pulse transition-all duration-1000"
                                    style={{ backgroundColor: `rgba(239, 68, 68, ${heatIntensity / 100})`, filter: `blur(${heatIntensity * 1.5}px)` }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-40 h-40 border border-red-400/10 rounded-full flex items-center justify-center">
                                         <IconSun className="w-10 h-10 text-red-400 animate-bloom" />
                                    </div>
                                </div>
                             </div>
                             <div className="flex-grow space-y-8">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.5em] block"> Somatic Warmth Logic </span>
                                <p className="text-light-text/60 italic leading-relaxed text-sm"> "Visualize localized warmth radiating through your lower abdomen. Use the input below to sync the visual intensity with your internal focus." </p>
                                <div className="space-y-6">
                                    <div className="flex justify-between text-[10px] font-mono text-red-400/40 uppercase tracking-widest">
                                        <span>Static Cool</span>
                                        <span>Active Heat</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="100" value={heatIntensity} 
                                        onChange={(e) => setHeatIntensity(parseInt(e.target.value))}
                                        className="w-full h-1 bg-red-400/10 rounded-lg appearance-none cursor-pointer accent-red-400"
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL-SCREEN CLINICAL ARTICLE MODAL */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-8 lg:p-12 bg-black/98 backdrop-blur-3xl transition-all duration-500" onClick={() => setSelectedArticle(null)}>
                    <div 
                        className="bg-dark-neutral border border-red-400/30 w-full h-full md:rounded-[4rem] overflow-hidden shadow-4xl relative animate-fade-in-up flex flex-col lg:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Medical Visual Pane */}
                        <div className="w-full lg:w-2/5 h-72 lg:h-auto relative overflow-hidden shrink-0 bg-dark-bg border-r border-white/5">
                            <SafeImage src={selectedArticle.image} alt={selectedArticle.title} theme="period" className="w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-dark-neutral via-transparent to-transparent pointer-events-none"></div>
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-10 left-10 bg-black/60 backdrop-blur-2xl text-white p-5 rounded-full hover:bg-red-400 hover:text-dark-bg transition-all shadow-2xl z-50 border border-white/10"
                            >
                                <IconX className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Clinical Data Pane */}
                        <div className="w-full lg:w-3/5 flex flex-col overflow-hidden bg-dark-neutral relative">
                            <div className="p-12 pb-8 border-b border-white/5">
                                <span className="text-[10px] uppercase font-black text-red-400 tracking-[0.6em] mb-6 block"> Medical Support Protocol v3.0 </span>
                                <h2 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6">{selectedArticle.title}</h2>
                                <div className="flex gap-4">
                                    <span className="bg-red-400/10 text-red-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-400/20">{selectedArticle.category}</span>
                                    <span className="bg-white/5 text-white/40 px-4 py-1 rounded-full text-[10px] font-mono tracking-widest">HLR_SYS_SYNC_ACTIVE</span>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-12 pt-10 space-y-16 custom-scrollbar pb-24">
                                <section className="space-y-6">
                                    <h3 className="text-[11px] uppercase font-black text-accent tracking-[0.4em] flex items-center gap-3"> 
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                                        Neuro-Biological Context 
                                    </h3>
                                    <p className="text-light-text/80 leading-relaxed text-2xl font-medium italic border-l-4 border-accent pl-10 py-2"> 
                                        {selectedArticle.clinicalInsight} 
                                    </p>
                                </section>

                                <section className="space-y-10">
                                    <h3 className="text-3xl font-black text-white flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-400 flex items-center justify-center text-dark-bg text-xl font-black shadow-xl shadow-red-400/20"> RX </div>
                                        Somatic Interventions
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {selectedArticle.somaticProtocol.map((step, idx) => (
                                            <div key={idx} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-red-400/30 transition-all">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[10px] font-mono font-black text-red-400/40">STEP_{idx + 1}</span>
                                                    <div className="w-1 h-1 rounded-full bg-red-400/20"></div>
                                                </div>
                                                <p className="text-light-text text-lg leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-10 bg-red-500/5 rounded-[3rem] border border-red-500/10 group/sum hover:bg-red-500/10 transition-all">
                                    <div className="flex items-center gap-4 mb-6">
                                        <IconStar className="w-8 h-8 text-red-400/40 group-hover/sum:scale-125 transition-transform" />
                                        <h3 className="text-[12px] uppercase font-black text-red-400 tracking-[0.5em]"> Recovery Strategy </h3>
                                    </div>
                                    <p className="text-light-text/70 text-xl italic leading-relaxed group-hover/sum:text-white transition-colors"> 
                                        {selectedArticle.recoveryStrategy} 
                                    </p>
                                </section>

                                <button 
                                    onClick={() => setSelectedArticle(null)}
                                    className="w-full bg-red-400 text-dark-bg font-black py-8 rounded-[2.5rem] text-2xl shadow-4xl hover:bg-red-500 transition-all transform hover:scale-[1.01] active:scale-95 uppercase tracking-[0.3em]"
                                >
                                    Dismiss Protocol
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Somatic Reset Components ---

/**
 * Industry Name: Affective State Visualizer
 */
const MoodTracker: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<{ emoji: string, name: string } | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleCheckIn = async () => {
        if (!selectedMood) return;
        setIsLoading(true);
        try {
            const result = await getMoodInsight(selectedMood.name, selectedTags);
            setInsight(result);
        } catch (error) {
            setInsight("Your feelings are valid. Take care of yourself.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-dark-neutral p-8 rounded-3xl border border-light-neutral/50">
                    <h3 className="text-xl font-bold mb-6 text-primary">How are you feeling?</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {MOOD_DATA.categories.flatMap(cat => cat.moods).map(mood => (
                            <button
                                key={mood.name}
                                onClick={() => setSelectedMood(mood)}
                                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${selectedMood?.name === mood.name ? 'bg-primary text-dark-bg scale-105 shadow-lg' : 'bg-dark-bg hover:bg-light-neutral text-light-text'}`}
                            >
                                <span className="text-3xl mb-1">{mood.emoji}</span>
                                <span className="text-xs font-bold uppercase tracking-widest">{mood.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-dark-neutral p-8 rounded-3xl border border-light-neutral/50">
                    <h3 className="text-xl font-bold mb-6 text-accent">What's influencing this?</h3>
                    <div className="flex flex-wrap gap-2">
                        {MOOD_DATA.tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedTags.includes(tag) ? 'bg-accent text-white' : 'bg-dark-bg text-light-text/60 hover:bg-light-neutral'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={handleCheckIn}
                    disabled={!selectedMood || isLoading}
                    className="bg-primary text-dark-bg font-black py-4 px-12 rounded-2xl text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase trackingest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Generate Insight'}
                </button>
            </div>

            {insight && (
                <div className="bg-dark-neutral p-8 rounded-[2.5rem] border border-primary/30 text-center animate-fade-in-up">
                    <IconBot className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-2xl font-medium text-light-text italic leading-relaxed">"{insight}"</p>
                </div>
            )}
        </div>
    );
};

/**
 * Industry Name: Semantic Offloading Interface
 */
const GuidedJournal: React.FC = () => {
    const [entry, setEntry] = useState('');
    const [reflection, setReflection] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState(JOURNAL_PROMPTS.General[0]);

    const handleReflect = async () => {
        if (!entry.trim() || isLoading) return;
        setIsLoading(true);
        try {
            const result = await getJournalReflection(entry);
            setReflection(result);
        } catch (error) {
            setReflection("What's one thing you learned about yourself today?");
        } finally {
            setIsLoading(false);
        }
    };

    const newPrompt = () => {
        const allPrompts = Object.values(JOURNAL_PROMPTS).flat();
        setPrompt(allPrompts[Math.floor(Math.random() * allPrompts.length)]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="bg-dark-neutral p-8 rounded-[3rem] border border-light-neutral/50 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Guided Prompt</span>
                    <button onClick={newPrompt} className="text-[10px] font-bold text-light-text/40 hover:text-accent transition-colors">Shuffle Prompt</button>
                </div>
                <h3 className="text-2xl font-bold text-white mb-8">{prompt}</h3>
                
                <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Start writing your thoughts here..."
                    className="w-full bg-dark-bg border border-light-neutral/30 rounded-2xl p-6 text-light-text h-64 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
                />

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleReflect}
                        disabled={!entry.trim() || isLoading}
                        className="bg-accent text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Synthesizing...' : 'Request Reflection'}
                    </button>
                </div>
            </div>

            {reflection && (
                <div className="bg-dark-neutral p-8 rounded-[2.5rem] border border-accent/30 text-center animate-fade-in-up">
                    <IconStar className="w-12 h-12 text-accent mx-auto mb-4" />
                    <p className="text-xl font-medium text-light-text italic leading-relaxed">"{reflection}"</p>
                </div>
            )}
        </div>
    );
};


// --- EXPORTED PAGES ---

// Main Hub
const ActivitiesPage: React.FC = () => (
    <div className="relative">
        <BackgroundVideo src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" />
        <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
            <PageHeader title="Wellbeing Hub" subtitle="A multi-modal toolkit engineered to restore cognitive balance and somatic equilibrium through scientifically-informed interactions." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ActivityCard title="Mood Matrix" description="A granular real-time affective check-in utilized to provide instant neurological normalization." path="/activities/check-in" Icon={IconHeart} color="primary" />
                <ActivityCard title="Micro-Moments" description="Atomic, tactile tasks designed to break ruminative thought cycles and mental paralysis." path="/activities/micro-moments" Icon={IconSun} color="gold" />
                <ActivityCard title="Period Care" description="Advanced somatic relief and validation for hormonal flux, fatigue, and physical discomfort." path="/activities/period-care" Icon={IconMoon} color="warm" />
                <ActivityCard title="Neural Journal" description="Secure cognitive offloading via private guided semantic exploration." path="/activities/journaling" Icon={IconJournal} color="gold" />
                <ActivityCard title="Sensory Grounding" description="Proprioceptive and auditory exercises optimized for acute stress modulation." path="/activities/mindfulness" Icon={IconMindfulness} color="warm" />
                <ActivityCard title="Asana Therapy" description="Biologically-targeted physical sequences designed to lower cortisol and induce parasympathetic dominance." path="/activities/yoga" Icon={HealedPot} color="primary" />
                <ActivityCard title="Rapid Refresh" description="A 5-minute tactical reset for intellectual burnout mitigation." path="/activities/study-break" Icon={IconStudyBreak} color="gold" />
                <ActivityCard title="Focus Puzzles" description="Calming cognitive tasks engineered to improve attention span and mindfulness." path="/activities/games" Icon={IconPuzzle} color="primary" />
                <ActivityCard title="Semantic Light" description="Curated motivational data structures for optimism reinforcement." path="/activities/inspiration" Icon={IconQuote} color="warm" />
            </div>
        </div>
    </div>
);
export default ActivitiesPage;

// (Remaining sub-pages are identical to current implementation, just need to be exported)
export const WellbeingCheckInPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Mood Matrix" subtitle="Data-driven validation of your current emotional state. Acknowledgment is the catalyst for neurological regulation." backLink="/activities" />
        <MoodTracker />
    </div>
);
export const WellbeingJournalingPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Neural Journal" subtitle="Execute a cognitive dump into a private, secure buffer. Utilize AI-reflection to gain objective perspective." backLink="/activities" />
        <GuidedJournal />
    </div>
);
export const WellbeingMindfulnessHubPage: React.FC = () => (
     <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Sensory Grounding Hub" subtitle="Select a sensory modality to recalibrate your present-moment awareness." backLink="/activities" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link to="/activities/mindfulness/breathing" className="group block bg-dark-neutral p-6 rounded-lg border border-primary/50 text-center hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary">Autonomic Reset</h3>
                <p className="text-light-text/70 mt-2">Box breathing to override the sympathetic nervous system.</p>
            </Link>
             <Link to="/activities/mindfulness/immersive" className="group block bg-dark-neutral p-6 rounded-lg border border-primary/50 text-center hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary">Virtual Sanctuary</h3>
                <p className="text-light-text/70 mt-2">Immersive audiovisual environments for immediate escapism.</p>
            </Link>
             <Link to="/activities/mindfulness/art" className="group block bg-dark-neutral p-6 rounded-lg border border-primary/50 text-center hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-primary">Freeform Canvas</h3>
                <p className="text-light-text/70 mt-2">Unstructured creative expression to bypass analytical stress.</p>
            </Link>
        </div>
    </div>
);
export const WellbeingMindfulnessBreathingPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Autonomic Reset" subtitle="Synchronize your respiratory cycle with the visual anchor to stabilize your heart rate variability." backLink="/activities/mindfulness" backText="Back to Grounding Hub" />
        <BreathingExercise />
    </div>
);
export const WellbeingMindfulnessImmersivePage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Virtual Sanctuary" subtitle="Trigger multisensory immersion. High-fidelity nature loops for parasympathetic activation." backLink="/activities/mindfulness" backText="Back to Grounding Hub" />
        <ImmersiveExperience />
    </div>
);
export const WellbeingMindfulnessArtPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Freeform Canvas" subtitle="Non-judgmental artistic projection. Focus exclusively on the haptic interaction and visual flow." backLink="/activities/mindfulness" backText="Back to Grounding Hub" />
        <ArtTherapyCanvas />
    </div>
);
export const WellbeingGamesHubPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Focus Engine" subtitle="Low-arousal cognitive engagement tasks designed to anchor attention without performance anxiety." backLink="/activities" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ActivityCard title="Pattern Recall" description="Sharpen short-term memory through non-linear pattern identification." path="/activities/games/memory" Icon={IconPuzzle} color="primary" />
            <ActivityCard title="Mindful Assembly" description="Assemble fragmented visual data to cultivate sustained attention." path="/activities/games/jigsaw" Icon={IconPuzzle} color="gold" />
        </div>
    </div>
);
export const WellbeingGameMemoryPage: React.FC = () => (
     <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Pattern Recall" subtitle="Execute visual scanning and matching. Focus on the spatial relationship between nodes." backLink="/activities/games" backText="Back to Focus Engine" />
        <div className="max-w-xl mx-auto">
            <MemoryGame />
        </div>
    </div>
);
export const WellbeingGameJigsawPage: React.FC = () => (
     <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Mindful Assembly" subtitle="Anchor your focus to the emerging structure. Breathe with every successful connection." backLink="/activities/games" backText="Back to Focus Engine" className="text-accent" />
        <div className="max-w-3xl mx-auto">
            <JigsawPuzzle />
        </div>
    </div>
);
export const WellbeingMicroTasksPage: React.FC = () => {
    const [currentTask, setCurrentTask] = useState(MICRO_TASKS[0]);
    const [completed, setCompleted] = useState(false);
    const [count, setCount] = useState(0);

    const nextTask = () => {
        const remaining = MICRO_TASKS.filter(t => t !== currentTask);
        setCurrentTask(remaining[Math.floor(Math.random() * remaining.length)]);
        setCompleted(false);
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 text-center">
            <PageHeader 
                title="Micro-Moments" 
                subtitle="Small, tactile actions engineered to disrupt ruminative thought loops and break mental paralysis." 
                backLink="/activities" 
            />
            <div className="max-w-xl mx-auto bg-dark-neutral p-10 rounded-[3rem] border border-light-neutral/50 shadow-3xl animate-fade-in-up">
                <div className="mb-8">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">ACTIVE TASK</span>
                    <h2 className={`text-3xl font-bold text-white transition-all duration-500 ${completed ? 'opacity-30 scale-95 blur-sm' : 'opacity-100'}`}>{currentTask}</h2>
                </div>
                {!completed ? (
                    <button onClick={() => { setCompleted(true); setCount(prev => prev + 1); }} className="group flex items-center justify-center gap-4 mx-auto bg-dark-bg border border-primary/30 hover:border-primary text-primary font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95">
                        <div className="w-6 h-6 rounded border-2 border-primary/50 group-hover:border-primary transition-colors"></div>
                        I HAVE DONE THIS
                    </button>
                ) : (
                    <div className="space-y-6 animate-celebrate">
                        <p className="text-accent font-black text-xl uppercase tracking-widest">Thought Loop Disrupted!</p>
                        <button onClick={nextTask} className="bg-primary text-dark-bg font-black py-4 px-12 rounded-2xl text-sm uppercase tracking-widest shadow-2xl hover:bg-primary-dark transition-all">Next Small Step</button>
                    </div>
                )}
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center opacity-30 text-[10px] font-mono">
                    <span className="uppercase tracking-widest">Calibration: Active</span>
                    <span className="uppercase tracking-widest">Resets Today: {count}</span>
                </div>
            </div>
        </div>
    );
};

const BreathingExercise: React.FC = () => {
    const [text, setText] = useState('Get Ready...');
    const [animation, setAnimation] = useState('animate-none');

    useEffect(() => {
        const cycle = () => {
            setText('Breathe In...');
            setAnimation('animate-[pulse_4s_ease-in-out_infinite]');
            setTimeout(() => setText('Hold...'), 4000);
            setTimeout(() => setText('Breathe Out...'), 6000);
        };
        const timer = setTimeout(() => {
            cycle();
            const interval = setInterval(cycle, 8000);
            return () => clearInterval(interval);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center bg-dark-neutral p-8 rounded-lg shadow-lg border border-light-neutral/50 h-96 animate-fade-in-up">
            <div className={`w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center ${animation}`}>
                <div className="w-32 h-32 bg-primary/40 rounded-full flex items-center justify-center">
                     <div className="w-24 h-24 bg-primary/60 rounded-full"></div>
                </div>
            </div>
            <p className="mt-8 text-2xl font-semibold text-light-text">{text}</p>
        </div>
    );
};

const ImmersiveExperience: React.FC = () => {
    const [isLaunched, setIsLaunched] = useState(false);
    if (!isLaunched) {
        return (
            <div className="relative group overflow-hidden rounded-[3rem] border border-light-neutral/50 shadow-4xl animate-fade-in-up bg-dark-neutral h-[500px] flex flex-col items-center justify-center p-8 text-center">
                <HealedPot className="w-20 h-20 text-primary/30 mx-auto animate-pulse mb-6" />
                <h3 className="text-3xl font-black text-white mb-2">Virtual Sanctuary</h3>
                <p className="text-light-text/60 max-w-md mb-8">This experience requires audio-visual initialization.</p>
                <button onClick={() => setIsLaunched(true)} className="bg-primary text-dark-bg font-black py-4 px-12 rounded-full text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Initialize Sanctuary</button>
            </div>
        );
    }
    return (
        <div className="relative group overflow-hidden rounded-[3rem] border border-light-neutral/50 shadow-4xl animate-fade-in-up bg-black aspect-video">
            <iframe src="https://www.youtube-nocookie.com/embed/bn9F19Hi1Lk?autoplay=1&mute=0&loop=1&playlist=bn9F19Hi1Lk&controls=1&modestbranding=1" title="Virtual Sanctuary" className="w-full h-full border-0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
    );
};

const ArtTherapyCanvas: React.FC = () => {
    const [color, setColor] = useState('#A78BFA');
    const colors = ['#A78BFA', '#8B5CF6', '#C4B5FD', '#7C3AED', '#3B82F6', '#F5F3FF'];

    return (
        <div className="bg-dark-neutral p-6 rounded-lg shadow-lg border border-light-neutral/50 animate-fade-in-up">
            <div className="w-full h-96 bg-dark-bg rounded-lg cursor-crosshair border border-white/5 flex items-center justify-center text-light-text/20">Canvas Initialized. Express freely.</div>
            <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                 <div className="flex gap-2">
                    {colors.map(c => <button key={c} style={{ backgroundColor: c }} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-neutral' : ''}`} />)}
                </div>
            </div>
        </div>
    )
};

export const WellbeingStudyBreakPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Rapid Burnout Mitigation" subtitle="5-minute tactical resets for cognitive saturation." backLink="/activities" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-dark-neutral p-8 rounded-3xl border border-primary/20 text-center space-y-4">
                <IconStudyBreak className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-xl font-bold">Alpha Wave Sync</h3>
                <p className="text-sm text-light-text/50 italic">Neural frequency regulation.</p>
                <div className="text-4xl font-mono py-4">05:00</div>
                <button className="w-full bg-primary text-dark-bg font-bold py-3 rounded-xl uppercase tracking-widest text-xs">Start Loop</button>
            </div>
             <div className="bg-dark-neutral p-8 rounded-3xl border border-accent/20 text-center space-y-4">
                <HealedPot className="w-10 h-10 text-accent mx-auto" />
                <h3 className="text-xl font-bold">Kinetic Release</h3>
                <p className="text-sm text-light-text/50 italic">Biomechanical decompression.</p>
                <div className="text-4xl font-mono py-4">05:00</div>
                <button className="w-full bg-accent text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs">Start Guide</button>
            </div>
             <div className="bg-dark-neutral p-8 rounded-3xl border border-red-400/20 text-center space-y-4">
                <IconMoon className="w-10 h-10 text-red-400 mx-auto" />
                <h3 className="text-xl font-bold">Dissociative Reset</h3>
                <p className="text-sm text-light-text/50 italic">Visual sanctuary synthesis.</p>
                <div className="text-4xl font-mono py-4">05:00</div>
                <button className="w-full bg-red-400 text-dark-bg font-bold py-3 rounded-xl uppercase tracking-widest text-xs">Start Timer</button>
            </div>
        </div>
    </div>
);

export const WellbeingInspirationPage: React.FC = () => (
    <div className="container mx-auto px-6 py-12 md:py-20">
        <PageHeader title="Semantic Light" subtitle="Optimism data points for resilience reinforcement." backLink="/activities" />
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {INSPIRATIONAL_QUOTES.map((q, idx) => (
                    <div key={idx} className="bg-dark-neutral p-8 rounded-3xl border border-primary/20 italic shadow-xl">
                        <p className="text-xl text-light-text mb-4">"{q.quote}"</p>
                        <p className="text-primary font-bold text-right">— {q.author}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);