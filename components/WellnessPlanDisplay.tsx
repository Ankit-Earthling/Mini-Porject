import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { UserInputs, Counselor, Suggestion } from '../types';
import { findLocalCounselors } from '../services/apiService';
import { IconJournal, IconMindfulness, IconSound, IconBot, IconQuote } from './IconComponents';

const useTypewriter = (text: string, speed = 25) => {
    const [displayText, setDisplayText] = useState('');
    useEffect(() => {
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
        }, 500);
       
        return () => clearTimeout(timer);
    }, [text, speed]);
    return displayText;
};

/**
 * Robust Markdown Parser for Local Counselor Listings
 */
const parseCounselorMarkdown = (markdown: string): Counselor[] => {
    if (!markdown) return [];
    
    // Improved regex to handle various markdown list markers and bold labels
    const entryBlocks = markdown.split(/(?:\n\s*[-*]\s+|\n\s*\d+\.\s+)/);
    const counselors: Counselor[] = [];

    for (let block of entryBlocks) {
        if (!block.trim()) continue;

        const lines = block.split('\n').map(l => l.trim());
        let name = 'Unknown Counselor';
        let specialty = '';
        let address = 'Address not available';
        let phone = 'Contact unavailable';

        // Attempt to extract fields based on bold labels or structure
        for (const line of lines) {
            const cleanLine = line.replace(/\*\*/g, '').trim();
            
            if (line.toLowerCase().includes('name:')) {
                name = cleanLine.split(/name:/i)[1]?.trim() || name;
            } else if (line.toLowerCase().includes('specialty:')) {
                specialty = cleanLine.split(/specialty:/i)[1]?.trim() || '';
            } else if (line.toLowerCase().includes('address:')) {
                address = cleanLine.split(/address:/i)[1]?.trim() || address;
            } else if (line.toLowerCase().includes('phone:')) {
                phone = cleanLine.split(/phone:/i)[1]?.trim() || phone;
            } else if (cleanLine && name === 'Unknown Counselor') {
                // If first line isn't a labeled field, assume it's the name
                name = cleanLine;
            }
        }

        if (name !== 'Unknown Counselor') {
            counselors.push({ name, specialty, address, phone });
        }
    }

    return counselors;
};

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
        </div>
        <div className="flex gap-3">
             <a 
                href={`tel:${counselor.phone.replace(/\D/g, '')}`} 
                className="flex-grow bg-primary text-dark-bg font-black py-3 rounded-xl text-[10px] uppercase tracking-widest text-center shadow-lg hover:bg-primary-dark transition-all transform active:scale-95"
            >
                Connect Now
            </a>
            <button className="bg-white/5 text-light-text/40 px-4 py-3 rounded-xl text-[10px] font-bold hover:bg-white/10 transition-all border border-white/5">
                Save
            </button>
        </div>
    </div>
);


const HighRiskPlan: React.FC = () => {
    const typedText = useTypewriter("Based on your assessment, it appears you are navigating a high-intensity crisis period. Your immediate physical and psychological safety is our absolute priority. Reaching out for professional assistance is the most resilient action you can take right now.");
    const [counselors, setCounselors] = useState<Counselor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFindCounselors = () => {
        setIsLoading(true);
        setError('');
        setCounselors([]);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const results = await findLocalCounselors(position.coords.latitude, position.coords.longitude);
                    // FIX: Passing the 'text' property from results object
                    const parsedCounselors = parseCounselorMarkdown(results.text);
                    if (parsedCounselors.length > 0) {
                       setCounselors(parsedCounselors);
                    } else {
                       setError("Direct neural map sync timed out. Please utilize the high-priority helplines below for immediate contact.")
                    }
                } catch (apiError: any) {
                    setError(apiError.message || 'An error occurred while fetching data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            },
            (err) => {
                setError('Geospatial access denied. Please enable location services in your system settings to identify local support nodes.');
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 text-left">
            <p className="text-light-text/90 mb-8 min-h-[6rem] text-lg leading-relaxed">{typedText}</p>
            <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-[2rem] shadow-2xl shadow-red-500/10 animate-fade-in-up">
                    <h3 className="text-xl font-black text-red-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                        Immediate Triage: Call Now
                    </h3>
                    <p className="text-light-text/60 mt-3 text-sm leading-relaxed">Free, 24/7, and confidential crisis support provided by verified national organizations in India.</p>
                    <div className="mt-6 flex flex-col sm:row gap-4">
                        <a href="tel:18005990019" className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl text-center uppercase tracking-widest text-xs">KIRAN (1800-599-0019)</a>
                        <a href="tel:9999666555" className="flex-1 bg-dark-bg/80 border border-red-500/30 text-red-400 font-black py-4 px-6 rounded-2xl transition-all text-center uppercase tracking-widest text-xs">Vandrevala (9999666555)</a>
                    </div>
                </div>

                <div className="bg-dark-neutral/50 p-10 rounded-[2.5rem] border border-light-neutral/50 shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Geospatial Support Nodes</h3>
                            <p className="text-light-text/40 text-xs mt-1">Discover verified clinical professionals in your immediate vicinity.</p>
                        </div>
                        <button 
                            onClick={handleFindCounselors} 
                            disabled={isLoading} 
                            className="bg-primary hover:bg-primary-dark text-dark-bg font-black py-3 px-8 rounded-xl transition-all shadow-lg uppercase tracking-widest text-[10px] disabled:opacity-50"
                        >
                            {isLoading ? 'Scanning Map...' : 'Find Local Help'}
                        </button>
                    </div>

                    {error && <p className="text-yellow-500/80 mt-3 text-xs font-mono uppercase tracking-widest border border-yellow-500/20 p-4 rounded-xl bg-yellow-500/5">{error}</p>}
                    
                    {counselors.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                           {counselors.map((counselor, index) => <CounselorCard key={index} counselor={counselor} />)}
                        </div>
                    )}
                </div>

                <div className="bg-dark-neutral/50 p-10 rounded-[2.5rem] border border-primary/20 shadow-2xl text-center">
                    <h3 className="text-xl font-black text-primary mb-4">Immediate Grounding Protocol</h3>
                    <p className="text-light-text/50 mb-8 max-w-sm mx-auto text-sm italic">Lower your physiological arousal immediately with a guided breathing sequence.</p>
                    <Link to="/activities/mindfulness/breathing" className="inline-block bg-primary/10 text-primary border border-primary/40 hover:bg-primary hover:text-dark-bg font-black py-4 px-10 rounded-2xl transition-all uppercase tracking-widest text-xs">
                        Start 1-Minute Reset
                    </Link>
                </div>
            </div>
        </div>
    );
};


const ModerateRiskPlan: React.FC<{ answers: UserInputs }> = ({ answers }) => {
    const typedText = useTypewriter("It sounds like you're carrying a heavy weight right now, and it's completely valid to feel this way. Let's look at a few small, gentle steps you can take to find some relief. Here are some suggestions based on what you've shared:");

    const getSuggestions = (): Suggestion[] => {
        const suggestions: Suggestion[] = [];
        if (answers.sleepQuality === 'Poor' || answers.sleepQuality === 'Very Poor') {
            suggestions.push({ title: 'For Restless Nights', text: 'When sleep feels out of reach, a calming immersive scene can help quiet the mind.', link: '/activities/mindfulness/immersive', linkText: 'Try an Immersive Escape', Icon: IconSound });
        }
        if (answers.workload === 'Overwhelming' || answers.academicPressure.includes('High')) {
             suggestions.push({ title: 'For Academic Pressure', text: 'When your workload feels overwhelming, a short, focused break can make all the difference.', link: '/activities/mindfulness', linkText: 'Try a Mindful Exercise', Icon: IconMindfulness });
        }
        if (answers.socialSatisfaction.includes('Dissatisfied') || answers.supportSystem.includes('No')) {
             suggestions.push({ title: 'For When You Feel Alone', text: 'Sometimes, just writing things down can make them feel more manageable. Our AI Companion offers a private space to talk.', link: '/chatbot', linkText: 'Talk with AI Companion', Icon: IconBot });
        }
        if (answers.interestLoss.includes('days') || answers.feelingDown.includes('days')) {
             suggestions.push({ title: 'To Find a Spark', text: 'When it\'s hard to feel joy, sometimes a small, positive story or an uplifting quote can offer a glimmer of light.', link: '/activities/inspiration', linkText: 'Find Inspiration', Icon: IconQuote });
        }
        // Fallback suggestion
        if(suggestions.length < 2) {
            suggestions.push({ title: 'A Space to Reflect', text: 'Journaling can be a powerful tool to untangle your thoughts. Consider spending a few minutes with our private journal.', link: '/activities/check-in', linkText: 'Open Your Journal', Icon: IconJournal });
        }
        return suggestions.slice(0, 3);
    }
    
    return (
        <div className="w-full max-w-3xl mx-auto mt-8 text-left">
            <p className="text-light-text/90 mb-6 text-center min-h-[6rem]">{typedText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSuggestions().map((s, i) => (
                     <div key={s.title} className="bg-dark-neutral p-6 rounded-lg border border-light-neutral/50 animate-fade-in-up" style={{ animationDelay: `${i * 150}ms`}}>
                        <div className="flex items-center mb-3">
                            <s.Icon className="w-6 h-6 text-accent mr-3" />
                            <h3 className="text-lg font-bold text-accent">{s.title}</h3>
                        </div>
                        <p className="text-light-text/70 mb-4 text-sm">{s.text}</p>
                        <Link to={s.link} state={{ fromQuiz: true }} className="font-bold text-primary hover:text-primary/80 transition-colors duration-300">
                            {s.linkText} &rarr;
                        </Link>
                    </div>
                ))}
                 <div className="bg-dark-neutral p-6 rounded-lg border border-light-neutral/50 animate-fade-in-up md:col-span-2" style={{ animationDelay: '450ms'}}>
                    <h3 className="text-lg font-bold text-primary">Consider Professional Support</h3>
                    <p className="text-light-text/70 mb-4 mt-2 text-sm">These tools are a great starting point. Speaking with a counselor can provide you with personalized strategies for long-term well-being.</p>
                    <Link to="/resources" className="font-bold text-primary hover:text-primary/80 transition-colors duration-300">
                        Explore Help Resources &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};


const LowRiskPlan: React.FC = () => {
    const typedText = useTypewriter("It's great to see that you're in a good place with your mental well-being. Proactively maintaining it is just as important as addressing challenges. Here are a few ideas to help you continue to thrive and build resilience.");
    const chatInitialMessage = `I just took the wellness test and got a "Low Risk" result, which is great! I'd like to chat about ways to maintain good mental health and build resilience for the future.`;

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 text-left">
            <p className="text-light-text/90 mb-6 text-center min-h-[6rem]">{typedText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-dark-neutral p-6 rounded-lg border border-light-neutral/50 animate-fade-in-up" style={{ animationDelay: '100ms'}}>
                    <IconBot className="w-8 h-8 text-accent mb-3" />
                    <h3 className="text-lg font-bold text-accent">Explore Your Thoughts</h3>
                    <p className="text-light-text/70 my-2 text-sm">Sometimes just talking things out can lead to new insights. Our AI is here to be a sounding board.</p>
                    <Link to="/chatbot" state={{ initialMessage: chatInitialMessage }} className="font-bold text-primary hover:text-primary/80 transition-colors duration-300">
                        Chat with AI Companion &rarr;
                    </Link>
                </div>
                 <div className="bg-dark-neutral p-6 rounded-lg border border-light-neutral/50 animate-fade-in-up" style={{ animationDelay: '250ms'}}>
                     <IconMindfulness className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-lg font-bold text-primary">Build Your Wellbeing Toolkit</h3>
                    <p className="text-light-text/70 my-2 text-sm">Discover new mindfulness practices and positive activities to add to your mental health toolkit.</p>
                    <Link to="/activities" className="font-bold text-primary hover:text-primary/80 transition-colors duration-300">
                        Visit the Wellbeing Hub &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface WellnessPlanDisplayProps {
    riskLevel: string;
    answers: UserInputs;
}

const WellnessPlanDisplay: React.FC<WellnessPlanDisplayProps> = ({ riskLevel, answers }) => {
    switch (riskLevel) {
        case 'High Risk':
            return <HighRiskPlan />;
        case 'Moderate Risk':
            return <ModerateRiskPlan answers={answers} />;
        case 'Low Risk':
            return <LowRiskPlan />;
        default:
            return null;
    }
};

export default WellnessPlanDisplay;
