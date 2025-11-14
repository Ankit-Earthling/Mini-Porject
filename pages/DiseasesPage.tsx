
import React from 'react';
import { DISEASES } from '../constants';

const DiseasesPage: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Understanding Mental Health</h1>
                <p className="max-w-2xl mx-auto text-slate-400 mt-4">Knowledge is the first step towards understanding and healing. Learn about common mental health challenges.</p>
            </div>

            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg relative mb-12" role="alert">
                <strong className="font-bold">Important:</strong>
                <span className="block sm:inline ml-2">This information is for educational purposes only and is not a substitute for professional medical advice.</span>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">If you need to talk to someone:</h3>
                    <p>National Suicide Prevention Lifeline: <a href="tel:988" className="font-bold underline hover:text-white">988</a></p>
                    <p>Crisis Text Line: Text HOME to <a href="sms:741741" className="font-bold underline hover:text-white">741741</a></p>
                </div>
            </div>

            <div className="space-y-10">
                {DISEASES.map(disease => (
                    <div key={disease.name} className="bg-slate-800/50 p-8 rounded-xl shadow-lg">
                        <h2 className="text-3xl font-bold text-calm-blue-300 mb-4">{disease.name}</h2>
                        <p className="text-slate-300 mb-6">{disease.description}</p>
                        <h3 className="text-xl font-semibold text-slate-200 mb-3">Common Causes & Triggers:</h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                            {disease.causes.map(cause => <li key={cause}>{cause}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-slate-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-slate-100">Ready to Take the Next Step?</h2>
                <p className="text-slate-400 mt-2 mb-6 max-w-xl mx-auto">Speaking with a professional can provide personalized strategies and support for your journey.</p>
                <a href="#/resources" className="bg-calm-green-600 hover:bg-calm-green-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Find a Counselor
                </a>
            </div>
        </div>
    );
};

export default DiseasesPage;
