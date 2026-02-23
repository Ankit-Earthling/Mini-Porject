
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import type { UserFeedback } from '../types';

const FeedbackPage: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [type, setType] = useState<UserFeedback['type']>('general');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dbService.saveFeedback(feedback, type);
        setSubmitted(true);
    };

    if (submitted) {
        return (
             <div className="container mx-auto px-6 py-12 md:py-20 text-center animate-fade-in-up">
                <div className="bg-dark-neutral border border-light-neutral/50 p-12 rounded-3xl max-w-lg mx-auto shadow-2xl">
                    <h1 className="text-3xl font-bold text-primary mb-4">Message Received</h1>
                    <p className="text-light-text/70 mb-8">Thank you for your input. Our administrative team will review your {type} to improve Healer.</p>
                     <button onClick={() => { setSubmitted(false); setFeedback(''); setType('general'); }} className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-bold py-4 rounded-xl transition-all shadow-xl">
                        Submit More Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold text-light-text tracking-tight">System Feedback</h1>
                <p className="max-w-2xl mx-auto text-light-text/60 mt-4">Help us evolve. Share your complaints, suggestions, or general thoughts anonymously.</p>
            </div>

            <div className="max-w-xl mx-auto bg-dark-neutral p-10 rounded-[2.5rem] shadow-2xl border border-light-neutral/50 animate-fade-in-up">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] uppercase font-black text-light-text/40 tracking-[0.4em] block mb-4">Input Classification</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['suggestion', 'complaint', 'general'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${type === t ? 'bg-primary text-dark-bg border-primary shadow-lg shadow-primary/20' : 'bg-dark-bg text-light-text/40 border-light-neutral/50 hover:border-primary/50'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="feedback" className="text-[10px] uppercase font-black text-light-text/40 tracking-[0.4em] block mb-4">Your Message</label>
                        <textarea
                            id="feedback"
                            rows={6}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            placeholder={`What's on your mind? If it's a ${type}, please be as specific as possible...`}
                            className="mt-1 block w-full bg-dark-bg border border-light-neutral/80 rounded-2xl shadow-sm py-4 px-5 text-light-text focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-light-text/20 transition-all"
                        ></textarea>
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-dark-bg font-black py-4 px-4 rounded-xl transition-all shadow-xl shadow-primary/10 uppercase tracking-[0.2em]">
                            Transmit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;
