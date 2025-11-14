import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Link } from 'react-router-dom';
import { generateWellnessPlan } from '../services/geminiService';

const WellnessPlanRenderer: React.FC<{ planText: string }> = ({ planText }) => {
    const lines = planText.split('\n').filter(line => line.trim() !== '');

    const renderLine = (line: string, index: number) => {
        if (line.startsWith('## ')) {
            return <h2 key={index} className="text-xl font-bold text-calm-blue-300 mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
                <li key={index} className="flex items-start text-slate-300">
                    <span className="text-calm-green-400 mr-3 mt-1.5 flex-shrink-0">◆</span>
                    <span>{line.substring(2)}</span>
                </li>
            );
        }
        return <p key={index} className="text-slate-300 my-2">{line}</p>;
    };
    
    const renderedElements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            renderedElements.push(<ul key={`ul-${renderedElements.length}`} className="space-y-2 list-none p-0">{listItems}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            listItems.push(renderLine(line, index));
        } else {
            flushList();
            renderedElements.push(renderLine(line, index));
        }
    });
    flushList(); 

    return <>{renderedElements}</>;
};


const QuizPage: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [wellnessPlan, setWellnessPlan] = useState<string | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResults(newAnswers);
            setShowResults(true);
        }
    };

    const calculateResults = (finalAnswers: number[]) => {
        const totalScore = finalAnswers.reduce((sum, answer) => sum + answer, 0);
        setScore(totalScore);
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setShowResults(false);
        setScore(0);
        setWellnessPlan(null);
        setIsPlanLoading(false);
    };

    const getResultContent = () => {
        if (score <= 5) {
            return {
                level: "Low Distress",
                color: "text-calm-green-400",
                message: "Your responses suggest you are likely experiencing low levels of mental distress. It's a great time to focus on building resilience and maintaining your well-being.",
                actions: ["Explore our mindfulness guides.", "Try our journaling tool to track your mood.", "Continue practicing self-care routines."]
            };
        } else if (score <= 10) {
            return {
                level: "Mild to Moderate Distress",
                color: "text-yellow-400",
                message: "Your responses suggest you may be experiencing mild to moderate symptoms of distress. It's important to pay attention to these feelings and explore supportive resources.",
                actions: ["Take a look at our self-help resources for stress and anxiety.", "Consider chatting with our AI companion to talk through your feelings.", "Connecting with a campus counselor could be a beneficial next step."]
            };
        } else {
            return {
                level: "Significant Distress",
                color: "text-red-400",
                message: "Your responses indicate you may be experiencing significant emotional distress. Reaching out for support is a crucial and brave step. You are not alone.",
                actions: ["We strongly recommend speaking with a mental health professional.", "Please visit our Resources page for crisis hotlines and professional support options.", "Sharing these feelings with a trusted person can be a powerful first step."]
            };
        }
    };
    
    const handleGetPlan = async () => {
        setIsPlanLoading(true);
        setWellnessPlan(null);
        const { level, message } = getResultContent();
        const prompt = `My wellness quiz result is: "${level}". The summary says: "${message}". Please generate a wellness plan based on this.`;
        try {
            const plan = await generateWellnessPlan(prompt);
            setWellnessPlan(plan);
        } catch (error) {
            setWellnessPlan("I'm sorry, I was unable to generate a wellness plan at this time. Please try again in a moment. In the meantime, exploring the self-help guides in our Resources section is a great next step.");
        } finally {
            setIsPlanLoading(false);
        }
    };

    const renderResults = () => {
        const { level, color, message } = getResultContent();
        const chatInitialMessage = `I just took the wellness test. My result was "${level}" and the summary mentioned: "${message}". I'd like to talk about it.`;

        return (
            <div className="text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-4">Your Anonymous Results</h2>
                <div className={`text-4xl font-bold mb-4 ${color}`}>{level}</div>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8">{message}</p>
                
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto mb-8">
                     <button
                        onClick={handleGetPlan}
                        disabled={isPlanLoading}
                        className="w-full bg-calm-green-600 hover:bg-calm-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                    >
                        {isPlanLoading ? 'Generating Plan...' : 'Get a Wellness Plan'}
                    </button>
                    <Link
                        to="/chatbot"
                        state={{ initialMessage: chatInitialMessage }}
                        className="w-full bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg text-center"
                    >
                        Share with AI Companion
                    </Link>
                </div>
                
                {wellnessPlan && (
                    <div className="bg-slate-800 p-6 rounded-lg text-left max-w-2xl mx-auto mb-8 animate-fade-in-up">
                        <h3 className="font-semibold text-xl mb-4 text-slate-100">Your Personal Wellness Plan</h3>
                         <WellnessPlanRenderer planText={wellnessPlan} />
                    </div>
                )}


                <button onClick={resetQuiz} className="text-slate-400 hover:text-calm-blue-300 transition-colors underline">
                    Take Quiz Again
                </button>

                <p className="text-xs text-slate-500 mt-8 max-w-md mx-auto">Disclaimer: This is not a diagnostic tool. It is for informational purposes only. Please consult a healthcare professional for a diagnosis.</p>
            </div>
        );
    };

    const renderQuiz = () => {
        const question = QUIZ_QUESTIONS[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-calm-blue-300">Progress</span>
                        <span className="text-sm font-medium text-calm-blue-300">{currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-calm-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-100">{question.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="p-4 bg-slate-800 text-slate-200 rounded-lg text-lg hover:bg-calm-blue-800 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="bg-slate-800/50 p-8 md:p-12 rounded-xl shadow-2xl">
                {!showResults ? renderQuiz() : renderResults()}
            </div>
        </div>
    );
};

export default QuizPage;