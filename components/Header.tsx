import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { KintsugiLogo, IconMenu, IconX } from './IconComponents';

const Header: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryLinks = NAV_LINKS.filter(link => link.isPrimary);
  const secondaryLinks = NAV_LINKS.filter(link => !link.isPrimary);
  
  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Close menus on navigation
  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-calm-blue-900/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-100 hover:text-calm-blue-300 transition-colors">
            <KintsugiLogo className="w-8 h-8 text-calm-green-400" />
            <span>Healer</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {primaryLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-slate-300 hover:text-calm-blue-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-calm-blue-400 after:transition-all after:duration-300 ${location.pathname === link.path ? 'text-calm-blue-300 after:w-full' : 'hover:after:w-full'}`}
              >
                {link.name}
              </Link>
            ))}
            {/* More Dropdown */}
            {secondaryLinks.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-1 text-slate-300 hover:text-calm-blue-300 transition-colors`}
                >
                  More
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-slate-800 rounded-md shadow-2xl py-1 z-50 animate-fade-in-up origin-top-right">
                    {secondaryLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`block px-4 py-2 text-sm ${location.pathname === link.path ? 'bg-calm-blue-800 text-white' : 'text-slate-300 hover:bg-calm-blue-900'}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-slate-200 focus:outline-none">
              {isMobileOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden mt-4 animate-fade-in-up">
            <ul className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`block py-2 text-center rounded-md transition-colors ${location.pathname === link.path ? 'bg-calm-blue-800 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;