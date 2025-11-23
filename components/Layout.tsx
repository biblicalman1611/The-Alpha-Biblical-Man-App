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
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 border-stone-200/50'
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center relative">
          <div
            className="text-xl md:text-2xl font-serif font-bold tracking-tight cursor-pointer uppercase select-none z-50 relative"
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
            className="md:hidden p-2 z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`w-6 h-0.5 bg-stone-900 mb-1 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-stone-900 mb-1 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-stone-900 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl shadow-xl border-t border-stone-100 p-6 flex flex-col gap-6 transition-all duration-300 origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
             {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-base font-medium tracking-wide uppercase py-2 border-b border-stone-50 text-stone-600 hover:text-stone-900 hover:pl-2 transition-all"
              >
                {item.label}
              </button>
            ))}
            {isLoggedIn ? (
              <div className="pt-4 border-t border-stone-100">
                 <button
                  onClick={() => {
                    onNavigate(NavSection.MEMBERS);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-base font-bold tracking-wide uppercase py-3 text-stone-900 flex items-center gap-3 bg-stone-50 px-4 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Access Members Area
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-sm font-medium tracking-wide uppercase py-3 px-4 text-stone-400 hover:text-stone-900"
                >
                  Log Out
                </button>
              </div>
            ) : (
               <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-sm font-bold tracking-wide uppercase py-3 bg-stone-900 text-white rounded-lg mt-2"
                >
                  Member Login
                </button>
            )}
        </div>
      </header>

      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Global Radio Player */}
      <RadioPlayer />

      <footer className="bg-stone-900 text-stone-400 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-serif text-3xl mb-6 uppercase tracking-tight">The Biblical Man</h4>
            <p className="max-w-xs text-base leading-relaxed text-stone-500">
              Cultivating depth in a distracted world through scripture, essays, and curated resources.
            </p>
          </div>
          <div>
            <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Explore</h5>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => onNavigate(NavSection.MISSION)} className="hover:text-white transition-colors">Mission</button></li>
              <li><button onClick={() => onNavigate(NavSection.WRITINGS)} className="hover:text-white transition-colors">Writings</button></li>
              <li><button onClick={() => onNavigate(NavSection.TOOL)} className="hover:text-white transition-colors">Micro-Learning</button></li>
              <li><button onClick={() => onNavigate(NavSection.PRODUCTS)} className="hover:text-white transition-colors">Shop</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-6">Connect</h5>
            <ul className="space-y-4 text-sm">
              <li><a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Substack</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="mailto:contact@thebiblicalmantruth.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-xs lg:text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-stone-600">
          <span>&copy; {new Date().getFullYear()} The Biblical Man. All rights reserved.</span>
          <span>www.thebiblicalmantruth.com</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
