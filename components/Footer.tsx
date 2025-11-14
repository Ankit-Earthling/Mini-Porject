import React from 'react';
import { Link } from 'react-router-dom';
import { KintsugiLogo, IconTwitter, IconLinkedIn, IconGitHub } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand and Info */}
          <div className="md:col-span-1">
             <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-100 hover:text-calm-blue-300 transition-colors mb-2">
                <KintsugiLogo className="w-8 h-8 text-calm-green-400" />
                <span>Healer</span>
            </Link>
            <p className="text-slate-400 text-sm">Your space for mental clarity and support in higher education.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
                <li><Link to="/quiz" className="text-slate-400 hover:text-calm-blue-300 transition-colors">Wellness Test</Link></li>
                <li><Link to="/chatbot" className="text-slate-400 hover:text-calm-blue-300 transition-colors">AI Companion</Link></li>
                <li><Link to="/resources" className="text-slate-400 hover:text-calm-blue-300 transition-colors">Resources</Link></li>
                <li><Link to="/faq" className="text-slate-400 hover:text-calm-blue-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Support Links */}
           <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
                <li><a href="https://www.mentalhealth.gov" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-calm-blue-300 transition-colors">MentalHealth.gov</a></li>
                <li><a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-calm-blue-300 transition-colors">SAMHSA Helpline</a></li>
                <li><a href="https://www.nami.org" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-calm-blue-300 transition-colors">NAMI</a></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-calm-blue-300 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">Connect</h3>
            <div className="flex items-center space-x-4 mt-4">
                <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-calm-blue-300 transition-colors"><IconTwitter className="w-6 h-6" /></a>
                <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-calm-blue-300 transition-colors"><IconLinkedIn className="w-6 h-6" /></a>
                <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-calm-blue-300 transition-colors"><IconGitHub className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Healer. All rights reserved.</p>
          <p className="mt-1 max-w-2xl mx-auto">This is a conceptual platform for informational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. If you are in a crisis, please use the emergency resources provided.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;