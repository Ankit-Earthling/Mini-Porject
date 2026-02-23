
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import type { Contribution, UserFeedback } from '../types';
import { IconX, IconUser, IconBot, IconQuote, IconStar, HealedPot } from '../components/IconComponents';

type AdminTab = 'moderation' | 'wall-manager' | 'insights' | 'system';

const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('moderation');
    const [pending, setPending] = useState<Contribution[]>([]);
    const [published, setPublished] = useState<Contribution[]>([]);
    const [feedback, setFeedback] = useState<UserFeedback[]>([]);
    const [newPost, setNewPost] = useState({ name: '', content: '', type: 'quote' as 'quote' | 'story' });
    const [adminName, setAdminName] = useState('Admin');
    const navigate = useNavigate();

    const loadData = () => {
        setPending(dbService.getPending());
        setPublished(dbService.getPublished());
        setFeedback(dbService.getFeedback());
        const savedName = sessionStorage.getItem('healer_admin_name');
        if (savedName) setAdminName(savedName);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('healer_admin_session');
        sessionStorage.removeItem('healer_admin_name');
        navigate('/admin/login');
    };

    const handleApprove = (id: string) => {
        dbService.approveContribution(id);
        loadData();
    };

    const handleDeleteContribution = (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this motivational story/quote?')) {
            dbService.deleteContribution(id);
            loadData();
        }
    };

    const handleAdminPost = (e: React.FormEvent) => {
        e.preventDefault();
        dbService.submitContribution(newPost.name || `Admin (${adminName})`, newPost.content, newPost.type, 'published');
        setNewPost({ name: '', content: '', type: 'quote' });
        loadData();
        alert('Motivational content added directly to the wall.');
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-dark-neutral border-r border-light-neutral/50 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <IconBot className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold tracking-tighter">Healer_OS</span>
                </div>
                
                <nav className="flex-grow space-y-2">
                    {[
                        { id: 'moderation', label: 'Moderation Queue', icon: IconQuote },
                        { id: 'wall-manager', label: 'Motivation Hub', icon: HealedPot },
                        { id: 'insights', label: 'User Feedback', icon: IconStar },
                        { id: 'system', label: 'System Logs', icon: IconBot }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AdminTab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary text-dark-bg shadow-lg shadow-primary/20' : 'text-light-text/50 hover:bg-light-neutral hover:text-light-text'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-light-neutral/20">
                    <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-light-neutral/30">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                            {adminName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-light-text/40 font-mono uppercase truncate">Session Active</p>
                            <p className="text-sm font-bold text-light-text truncate capitalize">{adminName}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20"
                    >
                        <IconX className="w-5 h-5" />
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen custom-scrollbar">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-light-text capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
                    <p className="text-light-text/40 mt-2 font-mono text-xs uppercase tracking-widest">Administrative Control Level 03 // Logged: {adminName}</p>
                </header>

                <div className="animate-fade-in-up">
                    {/* MODERATION TAB */}
                    {activeTab === 'moderation' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-3 text-yellow-400">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                Awaiting Review ({pending.length})
                            </h2>
                            {pending.length === 0 ? (
                                <div className="p-20 text-center border border-dashed border-light-neutral rounded-3xl">
                                    <p className="text-light-text/30">The moderation queue is healthy and empty.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {pending.map(item => (
                                        <div key={item.id} className="bg-dark-neutral border border-light-neutral/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.type}</span>
                                                    <span className="text-xs text-light-text/40 font-mono">ID: {item.id.substring(0,8)}</span>
                                                </div>
                                                <p className="text-light-text/80 italic leading-relaxed">"{item.content}"</p>
                                                <p className="text-xs text-primary mt-3 font-bold">Contributor: {item.name}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => handleApprove(item.id)} className="bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">APPROVE</button>
                                                <button onClick={() => handleDeleteContribution(item.id)} className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all">REJECT</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* WALL MANAGER TAB */}
                    {activeTab === 'wall-manager' && (
                        <div className="space-y-12">
                            <section className="bg-dark-neutral border border-primary/30 p-8 rounded-3xl shadow-2xl shadow-primary/5">
                                <h2 className="text-xl font-bold text-primary mb-6">Create Admin Post</h2>
                                <form onSubmit={handleAdminPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] uppercase font-mono text-light-text/40 block mb-1">Display Identity</label>
                                        <input 
                                            type="text" 
                                            value={newPost.name}
                                            onChange={e => setNewPost({...newPost, name: e.target.value})}
                                            placeholder={`Admin (${adminName})`}
                                            className="w-full bg-dark-bg border border-light-neutral/50 rounded-xl p-3 text-light-text focus:outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] uppercase font-mono text-light-text/40 block mb-1">Content Type</label>
                                        <select 
                                            value={newPost.type}
                                            onChange={e => setNewPost({...newPost, type: e.target.value as any})}
                                            className="w-full bg-dark-bg border border-light-neutral/50 rounded-xl p-3 text-light-text focus:outline-none"
                                        >
                                            <option value="quote">Motivational Quote</option>
                                            <option value="story">Resilience Story</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] uppercase font-mono text-light-text/40 block mb-1">Message Payload</label>
                                        <textarea 
                                            required
                                            value={newPost.content}
                                            onChange={e => setNewPost({...newPost, content: e.target.value})}
                                            rows={4}
                                            placeholder="Enter your motivational message here..."
                                            className="w-full bg-dark-bg border border-light-neutral/50 rounded-xl p-3 text-light-text focus:outline-none"
                                        />
                                    </div>
                                    <button type="submit" className="md:col-span-2 bg-primary text-dark-bg font-bold py-4 rounded-xl hover:bg-primary-dark transition-all uppercase tracking-widest">Inject Content</button>
                                </form>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-light-text mb-6">Active Wall Elements</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {published.map(item => (
                                        <div key={item.id} className="p-6 bg-dark-neutral border border-light-neutral/30 rounded-2xl relative group hover:border-red-500/50 transition-all">
                                            <button 
                                                onClick={() => handleDeleteContribution(item.id)} 
                                                className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-400/10 rounded-full"
                                                title="Delete"
                                            >
                                                <IconX className="w-5 h-5" />
                                            </button>
                                            <div className="mb-3">
                                                <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${item.type === 'quote' ? 'border-primary/40 text-primary' : 'border-accent/40 text-accent'}`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <p className="text-xs italic text-light-text/60 line-clamp-4 mb-4 leading-relaxed">"{item.content}"</p>
                                            <p className="text-[10px] font-bold text-primary uppercase">Author: {item.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* INSIGHTS TAB (FEEDBACK) */}
                    {activeTab === 'insights' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-accent uppercase tracking-widest">User Feedback Loop</h2>
                                <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold border border-accent/20">Total: {feedback.length}</span>
                            </div>
                            {feedback.length === 0 ? (
                                <div className="p-20 text-center border border-dashed border-light-neutral rounded-3xl">
                                    <p className="text-light-text/30 italic">No user feedback data captured.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {feedback.slice().reverse().map(f => (
                                        <div key={f.id} className={`bg-dark-neutral border p-8 rounded-3xl relative group transition-all hover:scale-[1.01] ${f.type === 'complaint' ? 'border-red-500/30 bg-red-500/5' : 'border-accent/30'}`}>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm('Archive this entry?')) {
                                                        dbService.deleteFeedback(f.id);
                                                        loadData();
                                                    }
                                                }}
                                                className="absolute top-6 right-6 text-light-text/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <IconX className="w-5 h-5" />
                                            </button>
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${f.type === 'complaint' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' : 'bg-accent text-white border-accent shadow-lg shadow-accent/20'}`}>
                                                    {f.type}
                                                </span>
                                                <span className="text-[10px] font-mono text-light-text/40 uppercase tracking-widest">{new Date(f.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-lg text-light-text/90 leading-relaxed font-medium italic">"{f.content}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SYSTEM TAB */}
                    {activeTab === 'system' && (
                        <div className="max-w-2xl bg-dark-neutral p-12 rounded-[3rem] border border-light-neutral/50 text-center mx-auto shadow-2xl">
                            <IconBot className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                            <h2 className="text-2xl font-bold mb-4 font-mono uppercase tracking-widest">Core Interface</h2>
                            <p className="text-light-text/40 mb-10 text-sm italic">System kernel operational. Neural inference modules are grounded in Indian Higher Education context. Secure layer active.</p>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <button className="p-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs tracking-[0.3em] uppercase">Emergency Lock</button>
                                <button className="p-5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-2xl hover:bg-yellow-500 hover:text-white transition-all font-bold text-xs tracking-[0.3em] uppercase">Maintenance Toggle</button>
                                <button className="p-5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all font-bold text-xs tracking-[0.3em] uppercase">Purge Buffer</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
