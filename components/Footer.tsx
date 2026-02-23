
import React from 'react';
import { Link } from 'react-router-dom';
import { BreathWaveLogo } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-neutral border-t border-light-neutral/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand and Info */}
          <div className="md:col-span-1">
             <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-light-text hover:text-primary transition-colors mb-2">
                <BreathWaveLogo className="w-8 h-8 text-primary" />
                <span className="tracking-tighter">Healer</span>
            </Link>
            <p className="text-light-text/60 text-sm italic">Intelligent Somatic Support for Indian Students.</p>
            <Link to="/architecture" className="text-[9px] font-mono text-primary/40 uppercase tracking-widest mt-4 block hover:text-primary transition-colors">View System Schematic</Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black text-light-text/40 tracking-[0.3em] uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
                <li><Link to="/quiz" className="text-sm text-light-text/60 hover:text-primary transition-colors">Wellness Test</Link></li>
                <li><Link to="/chatbot" className="text-sm text-light-text/60 hover:text-primary transition-colors">AI Companion</Link></li>
                <li><Link to="/activities" className="text-sm text-light-text/60 hover:text-primary transition-colors">Wellbeing Hub</Link></li>
                <li><Link to="/positivity-wall" className="text-sm text-light-text/60 hover:text-primary transition-colors">Positivity Wall</Link></li>
            </ul>
          </div>
          
          {/* Support Links */}
           <div>
            <h3 className="text-xs font-black text-light-text/40 tracking-[0.3em] uppercase">Safety Network</h3>
            <ul className="mt-4 space-y-2">
                <li><a href="https://www.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-light-text/60 hover:text-primary transition-colors">MoHFW Govt. of India</a></li>
                <li><a href="tel:18005990019" className="text-sm text-red-400/80 font-bold hover:text-red-400 transition-colors">KIRAN: 1800-599-0019</a></li>
                <li><Link to="/resources" className="text-sm text-light-text/60 hover:text-primary transition-colors">All India Resources</Link></li>
                <li><Link to="/feedback" className="text-sm text-light-text/60 hover:text-primary transition-colors">Submit Suggestion</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-light-neutral/50 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-[10px] text-light-text/20 gap-4 font-mono uppercase tracking-widest">
          <div>
            <p>&copy; {new Date().getFullYear()} Healer Protocol. Verified for India Region.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/admin/login" className="hover:text-primary transition-all">Admin_Portal</Link>
            <span>Auth_v2.6</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
