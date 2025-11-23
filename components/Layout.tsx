import React, { useState, useEffect } from 'react';
import { NavSection } from '../types';
import RadioPlayer from './RadioPlayer';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeSection, 
  onNavigate, 
  isLoggedIn,
  onLoginClick,
  onLogout
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', value: NavSection.HOME },
    { label: 'Mission', value: NavSection.MISSION },
    { label: 'Scripture Tool', value: NavSection.TOOL },
    { label: 'Writings', value: NavSection.WRITINGS },
    { label: 'Shop', value: NavSection.PRODUCTS },
  ];

  const SUBSTACK_URL = "https://biblicalman.substack.com";

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900">
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div 
            className="text-2xl font-serif font-bold tracking-tight cursor-pointer uppercase select-none"
            onClick={() => onNavigate(NavSection.HOME)}
          >
            The Biblical Man
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium tracking-wide uppercase hover:text-stone-500 transition-colors ${
                  activeSection === item.value ? 'text-stone-900 border-b border-stone-900' : 'text-stone-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Auth Section */}
            {isLoggedIn ? (
               <div className="flex items-center gap-6 border-l border-stone-300 pl-6">
                 <button 
                   onClick={() => onNavigate(NavSection.MEMBERS)}
                   className={`group flex items-center gap-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                     activeSection === NavSection.MEMBERS ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                   }`}
                 >
                   <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-stone-700">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                   </span>
                   Members
                 </button>
                 <button onClick={onLogout} className="text-xs font-medium text-stone-400 hover:text-red-700 transition-colors">
                   Log Out
                 </button>
               </div>
            ) : (
              <div className="border-l border-stone-300 pl-6">
                <button 
                  onClick={onLoginClick}
                  className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase text-stone-900 hover:text-stone-600 transition-colors"
                >
                  <span>Login</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-0.5 bg-stone-900 mb-1"></div>
            <div className="w-6 h-0.5 bg-stone-900 mb-1"></div>
            <div className="w-6 h-0.5 bg-stone-900"></div>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
           <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-stone-100 p-4 flex flex-col gap-4 fade-in">
             {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium tracking-wide uppercase py-2 border-b border-stone-100 text-stone-600"
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn ? (
              <>
                 <button
                  onClick={() => {
                    onNavigate(NavSection.MEMBERS);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-bold tracking-wide uppercase py-2 border-b border-stone-100 text-stone-900 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Members Area
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium tracking-wide uppercase py-2 text-stone-400 hover:text-stone-900"
                >
                  Log Out
                </button>
              </>
            ) : (
               <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-bold tracking-wide uppercase py-2 border-b border-stone-100 text-stone-900"
                >
                  Login
                </button>
            )}
           </div>
        )}
      </header>

      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Global Radio Player */}
      <RadioPlayer />

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-serif text-2xl mb-4 uppercase">The Biblical Man</h4>
            <p className="max-w-xs text-sm leading-relaxed">
              Cultivating depth in a distracted world through scripture, essays, and curated resources.
            </p>
          </div>
          <div>
            <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Explore</h5>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate(NavSection.MISSION)} className="hover:text-white transition-colors">Mission</button></li>
              <li><button onClick={() => onNavigate(NavSection.WRITINGS)} className="hover:text-white transition-colors">Writings</button></li>
              <li><button onClick={() => onNavigate(NavSection.TOOL)} className="hover:text-white transition-colors">Micro-Learning</button></li>
              <li><button onClick={() => onNavigate(NavSection.PRODUCTS)} className="hover:text-white transition-colors">Shop</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Connect</h5>
            <ul className="space-y-2 text-sm">
              <li><a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Substack</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="mailto:contact@thebiblicalmantruth.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} The Biblical Man. All rights reserved.</span>
          <span className="text-stone-600">www.thebiblicalmantruth.com</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;