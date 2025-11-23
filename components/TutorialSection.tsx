import React from 'react';

const TutorialSection: React.FC = () => {
  return (
    <section className="py-20 bg-stone-900 text-stone-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 space-y-6">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase mb-2 block">
              The Method
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
              Micro-Retention <br/> & Application
            </h2>
          </div>
          
          <p className="text-lg text-stone-400 font-light leading-relaxed max-w-2xl mx-auto">
            We live in an age of information overload but wisdom scarcity. 
            The Biblical Man method uses "Micro-Scripture" to combat this.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-stone-800 rounded-xl bg-stone-900/50 hover:bg-stone-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center mb-4 text-brand-gold font-serif text-xl italic">1</div>
            <h3 className="text-2xl font-serif text-white mb-3">Read (KJV)</h3>
            <p className="text-stone-500 leading-relaxed">
              Absorb the unadulterated weight of the King James text. Let the archaic language slow your mind down to the speed of wisdom.
            </p>
          </div>
          
          <div className="p-8 border border-stone-800 rounded-xl bg-stone-900/50 hover:bg-stone-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center mb-4 text-brand-gold font-serif text-xl italic">2</div>
            <h3 className="text-2xl font-serif text-white mb-3">Reflect (Stoic)</h3>
            <p className="text-stone-500 leading-relaxed">
              Internalize the principle through a lens of discipline. Ask not what the text means for others, but what it demands of you.
            </p>
          </div>

          <div className="p-8 border border-stone-800 rounded-xl bg-stone-900/50 hover:bg-stone-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center mb-4 text-brand-gold font-serif text-xl italic">3</div>
            <h3 className="text-2xl font-serif text-white mb-3">Apply (Action)</h3>
            <p className="text-stone-500 leading-relaxed">
              Transform the word into immediate, tangible action. Wisdom without works is dead. Do not just hear; do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;