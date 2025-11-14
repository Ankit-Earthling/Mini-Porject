import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { runChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { IconSend, IconUser, IconBot } from '../components/IconComponents';

const ChatbotPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I'm Serene, your AI companion. How are you feeling today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [journalText, setJournalText] = useState('');

    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const initialMessageSent = useRef(false);
    const location = useLocation();

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        const initialMessageFromQuiz = location.state?.initialMessage;
        if (initialMessageFromQuiz && !initialMessageSent.current) {
            initialMessageSent.current = true; // Prevent re-runs

            const userMessage: ChatMessage = { role: 'user', text: initialMessageFromQuiz };
            // Replace default message with contextual one
            setMessages([userMessage]); 
            setIsLoading(true);

            const fetchResponse = async () => {
                try {
                    // History is empty for the first turn from quiz
                    const response = await runChat(initialMessageFromQuiz, []); 
                    const modelMessage: ChatMessage = { role: 'model', text: response };
                    setMessages(prev => [...prev, modelMessage]);
                } catch (error) {
                    const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I had trouble processing that. Could you please try again?' };
                    setMessages(prev => [...prev, errorMessage]);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchResponse();
            
            // Clean up location state to prevent re-triggering on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);


    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await runChat(input, messages);
            const modelMessage: ChatMessage = { role: 'model', text: response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-100">AI Companion & Journal</h1>
                <p className="text-slate-400 mt-2">A private space to talk and reflect. Your conversation is not stored.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chatbot Column */}
                <div className="lg:col-span-2 bg-slate-800/50 rounded-xl shadow-2xl flex flex-col h-[75vh]">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-100">Chat with Serene</h2>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="bg-calm-blue-600 rounded-full p-2"><IconBot className="w-6 h-6 text-white"/></div>}
                                <div className={`max-w-md p-3 rounded-xl ${msg.role === 'user' ? 'bg-calm-blue-800 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                {msg.role === 'user' && <div className="bg-slate-600 rounded-full p-2"><IconUser className="w-6 h-6 text-white"/></div>}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 my-4 justify-start">
                                <div className="bg-calm-blue-600 rounded-full p-2"><IconBot className="w-6 h-6 text-white"/></div>
                                <div className="max-w-md p-3 rounded-lg bg-slate-700 text-slate-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-calm-blue-300 rounded-full animate-pulse-slow"></div>
                                        <div className="w-2 h-2 bg-calm-blue-300 rounded-full animate-pulse-slow delay-200"></div>
                                        <div className="w-2 h-2 bg-calm-blue-300 rounded-full animate-pulse-slow delay-400"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex items-center bg-slate-700 rounded-lg">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                className="w-full bg-transparent p-3 text-slate-200 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="p-3 text-calm-blue-400 hover:text-calm-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
                                <IconSend className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Journaling Column */}
                <div className="lg:col-span-1 bg-slate-800/50 rounded-xl shadow-2xl flex flex-col h-[75vh]">
                    <div className="p-4 border-b border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-100">Private Journal</h2>
                    </div>
                    <div className="flex-grow p-4">
                        <textarea
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value)}
                            placeholder="Write down your thoughts and feelings here. This is only saved in your browser."
                            className="w-full h-full bg-slate-700/50 p-4 rounded-lg text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-calm-blue-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;