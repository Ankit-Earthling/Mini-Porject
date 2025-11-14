
import React, { useState } from 'react';

const FeedbackPage: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Feedback submitted:", feedback);
        setSubmitted(true);
    };

    if (submitted) {
        return (
             <div className="container mx-auto px-6 py-12 md:py-20 text-center">
                <div className="bg-slate-800/50 p-12 rounded-xl max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-calm-green-400 mb-4">Thank you for your feedback!</h1>
                    <p className="text-slate-300">Your input is invaluable in helping us improve Healer for everyone.</p>
                     <button onClick={() => { setSubmitted(false); setFeedback(''); }} className="mt-8 bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Submit More Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Share Your Feedback</h1>
                <p className="max-w-2xl mx-auto text-slate-400 mt-4">Help us make this platform better. All feedback is anonymous and greatly appreciated.</p>
            </div>

            <div className="max-w-xl mx-auto bg-slate-800/50 p-8 rounded-xl shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-slate-300 mb-2">Your Feedback</label>
                        <textarea
                            id="feedback"
                            rows={8}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            placeholder="What's on your mind? What can we improve?"
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-calm-blue-500 focus:border-calm-blue-500"
                        ></textarea>
                    </div>
                    <div className="mt-6">
                         <button type="submit" className="w-full bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300">
                            Submit Anonymously
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackPage;