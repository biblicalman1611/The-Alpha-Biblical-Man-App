import React from 'react';
import { NavSection } from '../types';

interface HeroProps {
  onNavigate: (section: NavSection) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full min-h-screen lg:min-h-[95vh] flex flex-col justify-center items-center text-center px-4 lg:px-8 bg-gradient-to-b from-stone-50 via-stone-100 to-stone-50 overflow-hidden">
      {/* Decorative background elements - More sophisticated */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stone-900/5 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 max-w-6xl w-full space-y-10 lg:space-y-16 fade-in px-4">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-stone-200/50 shadow-sm">
          <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
          <span className="text-xs lg:text-sm tracking-[0.25em] text-stone-700 uppercase font-bold">
            Faith & Letters
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-stone-900 leading-[1.1] tracking-tight">
          Ancient Wisdom for<br className="hidden sm:block"/>
          <span className="italic text-stone-600 font-light">Modern Minds</span>
        </h1>

        <p className="text-lg md:text-2xl lg:text-3xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
          Exploring the intersection of theology, culture, and the inner life.<br className="hidden md:block"/>
          A hub for deep reading and micro-learning.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 lg:gap-6 justify-center mt-12 lg:mt-16 w-full sm:w-auto">
          <button
            onClick={() => onNavigate(NavSection.TOOL)}
            className="group w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-stone-900 text-white font-semibold text-base lg:text-lg rounded-xl hover:bg-stone-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              Try the Scripture Tool
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => onNavigate(NavSection.WRITINGS)}
            className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 border-2 border-stone-300 bg-white/80 backdrop-blur-sm text-stone-900 font-semibold text-base lg:text-lg rounded-xl hover:bg-white hover:border-stone-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Read the Substack
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
