import React, { useState, useEffect } from 'react';
import { NavSection } from '../types';

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
    { label: 'Scripture Tool', value: NavSection.TOOL },
    { label: 'Writings', value: NavSection.WRITINGS },
    { label: 'Shop', value: NavSection.PRODUCTS },
  ];

  const SUBSTACK_URL = "https://thebiblicalman.substack.com";

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900">
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div 
            className="text-2xl font-serif font-bold tracking-tight cursor-pointer uppercase"
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
            
            <div className="h-4 w-px bg-stone-300"></div>

            {isLoggedIn ? (
               <div className="flex items-center gap-4">
                 <button 
                   onClick={() => onNavigate(NavSection.MEMBERS)}
                   className={`text-sm font-medium tracking-wide uppercase hover:text-stone-500 transition-colors ${
                     activeSection === NavSection.MEMBERS ? 'text-stone-900 border-b border-stone-900' : 'text-stone-600'
                   }`}
                 >
                   Members
                 </button>
                 <button onClick={onLogout} className="text-xs text-stone-400 hover:text-stone-900">
                   Log Out
                 </button>
               </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold tracking-wide uppercase text-stone-900 hover:text-stone-600 transition-colors"
              >
                Login
              </button>
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
           <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-stone-100 p-4 flex flex-col gap-4">
             {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-medium tracking-wide uppercase py-2 border-b border-stone-50"
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
                  className="text-left text-sm font-medium tracking-wide uppercase py-2 border-b border-stone-50"
                >
                  Members Area
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium tracking-wide uppercase py-2 text-stone-400"
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
                  className="text-left text-sm font-bold tracking-wide uppercase py-2 border-b border-stone-50"
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
              <li><button onClick={() => onNavigate(NavSection.WRITINGS)} className="hover:text-white">Writings</button></li>
              <li><button onClick={() => onNavigate(NavSection.TOOL)} className="hover:text-white">Micro-Learning</button></li>
              <li><button onClick={() => onNavigate(NavSection.PRODUCTS)} className="hover:text-white">Shop</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Connect</h5>
            <ul className="space-y-2 text-sm">
              <li><a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Substack</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-xs text-center md:text-left">
          &copy; {new Date().getFullYear()} The Biblical Man. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;