import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-stone-50 border-y border-stone-200">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 text-center">
        <span className="text-xs lg:text-sm font-bold tracking-[0.3em] text-brand-gold uppercase mb-6 lg:mb-8 block">
          Our Manifesto
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-12 lg:mb-16 leading-tight">
          Restoring the Ancient Boundaries
        </h2>

        <div className="space-y-8 lg:space-y-10 text-lg md:text-xl lg:text-2xl text-stone-700 leading-relaxed font-serif max-w-4xl mx-auto">
          <p>
            The modern world offers comfort, but it demands your soul in return. It preaches a manhood of passivity, eternal adolescence, and spiritual silence.
          </p>
          <p>
            <span className="font-semibold text-stone-900">We reject this.</span>
          </p>
          <p>
            The Biblical Man is not a club for self-improvement. It is a return to the wild, dangerous, and holy calling of bearing the image of God. We believe in the strength that serves, the authority that submits, and the legacy that outlasts the grave.
          </p>
          <p>
            Here, we seek the truth found in the old paths. We arm ourselves with Scripture, not as a cliché, but as a sword.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="h-16 w-px bg-stone-300"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;