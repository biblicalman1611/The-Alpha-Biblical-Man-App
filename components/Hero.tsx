import React from 'react';
import { NavSection } from '../types';

interface HeroProps {
  onNavigate: (section: NavSection) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full min-h-screen lg:min-h-[90vh] flex flex-col justify-center items-center text-center px-4 lg:px-8 bg-stone-100 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#292524" />
        </svg>
      </div>

      <div className="z-10 max-w-5xl w-full space-y-8 lg:space-y-12 fade-in px-4">
        <span className="text-sm lg:text-base tracking-[0.3em] text-stone-500 uppercase font-semibold">
          Faith & Letters
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-stone-900 leading-[1.15]">
          Ancient Wisdom for <br className="hidden sm:block"/> <span className="italic text-stone-600">Modern Minds</span>
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed">
          Exploring the intersection of theology, culture, and the inner life.
          A hub for deep reading and micro-learning.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center mt-8 lg:mt-12 w-full sm:w-auto">
          <button
            onClick={() => onNavigate(NavSection.TOOL)}
            className="w-full sm:w-auto px-8 lg:px-10 py-3 lg:py-4 bg-stone-900 text-stone-50 font-medium text-base lg:text-lg rounded-full hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Try the Scripture Tool
          </button>
          <button
            onClick={() => onNavigate(NavSection.WRITINGS)}
            className="w-full sm:w-auto px-8 lg:px-10 py-3 lg:py-4 border border-stone-300 bg-white text-stone-800 font-medium text-base lg:text-lg rounded-full hover:bg-stone-50 transition-colors"
          >
            Read the Substack
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
