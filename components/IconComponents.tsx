import React, { useState } from 'react';

export const KintsugiLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g className="text-calm-blue-800">
      {/* Gold Seams */}
      <path d="M50,10 L50,90" stroke="currentColor" className="text-kintsugi-gold" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15,35 L85,65" stroke="currentColor" className="text-kintsugi-gold" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15,65 L85,35" stroke="currentColor" className="text-kintsugi-gold" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Pieces */}
      <g className="animate-kintsugi-pulse-1 origin-center">
        <path d="M50,10 A40,40 0 0,1 85,35 L50,50 Z" fill="currentColor" />
      </g>
      <g className="animate-kintsugi-pulse-2 origin-center">
        <path d="M85,35 A40,40 0 0,1 85,65 L50,50 Z" fill="currentColor" />
        <path d="M85,65 A40,40 0 0,1 50,90 L50,50 Z" fill="currentColor" />
      </g>
      <g className="animate-kintsugi-pulse-3 origin-center">
        <path d="M50,90 A40,40 0 0,1 15,65 L50,50 Z" fill="currentColor" />
        <path d="M15,65 A40,40 0 0,1 15,35 L50,50 Z" fill="currentColor" />
        <path d="M15,35 A40,40 0 0,1 50,10 L50,50 Z" fill="currentColor" />
      </g>
    </g>
  </svg>
);

export const HealedPot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);


export const IconMenu: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const IconX: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const IconTwitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

export const IconLinkedIn: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

export const IconGitHub: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

export const IconSend: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 23.85 23.85 0 0 0 21.42-11.832a.75.75 0 0 0 0-.84A23.85 23.85 0 0 0 3.478 2.404Z" />
    </svg>
);

export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

export const IconBot: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 3.75A.75.75 0 0 1 5.25 3h13.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-5.463l-2.53 2.53a.75.75 0 0 1-1.06 0l-2.53-2.53H5.25a.75.75 0 0 1-.75-.75V3.75Zm2.016 5.03a.75.75 0 0 0-1.06 1.06L6.939 11.3l-1.483 1.484a.75.75 0 0 0 1.06 1.06L8 12.36l1.484 1.483a.75.75 0 0 0 1.06-1.06L9.061 11.3l1.483-1.484a.75.75 0 0 0-1.06-1.06L8 10.24l-1.484-1.483Zm9-1.483a.75.75 0 0 0-1.06 1.06L16.939 10l-1.483 1.484a.75.75 0 1 0 1.06 1.06L18 11.06l1.484 1.483a.75.75 0 1 0 1.06-1.06L19.061 10l1.483-1.484a.75.75 0 0 0-1.06-1.06L18 8.94l-1.484-1.483Z" clipRule="evenodd" />
    </svg>
);

export const EmergencyButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse-slow hover:animate-none hover:bg-red-500 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-400/50"
                aria-label="Emergency Contacts"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0V9Zm-.75 9.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-8 border border-red-500/50" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-red-400">Immediate Crisis Support</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-slate-300 mb-6">If you are in crisis or any other person may be in danger, please use these resources to get help immediately. Your safety is the priority.</p>
                        <div className="space-y-4">
                            <a href="tel:988" className="block text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                <h3 className="font-bold text-lg text-slate-100">National Suicide Prevention Lifeline</h3>
                                <p className="text-calm-blue-300 text-2xl font-bold">Call 988</p>
                                <p className="text-slate-400 text-sm">24/7, free and confidential support.</p>
                            </a>
                             <a href="sms:741741" className="block text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                <h3 className="font-bold text-lg text-slate-100">Crisis Text Line</h3>
                                <p className="text-calm-blue-300 text-2xl font-bold">Text HOME to 741741</p>
                                <p className="text-slate-400 text-sm">Free, 24/7 crisis support via text message.</p>
                            </a>
                        </div>
                        <p className="text-xs text-slate-500 mt-6 text-center">In an emergency, please call 911.</p>
                    </div>
                </div>
            )}
        </>
    );
};