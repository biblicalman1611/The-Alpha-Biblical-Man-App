import React from 'react';
import { NavSection } from '../types';

interface HeroProps {
  onNavigate: (section: NavSection) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center items-center text-center px-6 bg-stone-100 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#292524" />
        </svg>
      </div>

      <div className="z-10 max-w-4xl space-y-8 fade-in">
        <span className="text-xs md:text-sm tracking-[0.3em] text-stone-500 uppercase font-semibold">
          Faith & Letters
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-stone-900 leading-[1.15]">
          Ancient Wisdom for <br className="hidden sm:block"/> <span className="italic text-stone-600">Modern Minds</span>
        </h1>
        <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed px-2">
          Exploring the intersection of theology, culture, and the inner life. 
          A hub for deep reading and micro-learning.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate(NavSection.TOOL)}
            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-stone-50 font-medium rounded-full hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Try the Scripture Tool
          </button>
          <button 
            onClick={() => onNavigate(NavSection.WRITINGS)}
            className="w-full sm:w-auto px-8 py-3 border border-stone-300 bg-white text-stone-800 font-medium rounded-full hover:bg-stone-50 transition-colors"
          >
            Read the Substack
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;