

import React, { useState } from 'react';
import { generateWarPlan } from '../services/geminiService';
import { WarPlan, WarPhase } from '../types';

const WarRoom: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WarPlan | null>(null);

  // Inputs
  const [struggle, setStruggle] = useState('');
  const [goal, setGoal] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!struggle || !goal) return;

    setLoading(true);
    const result = await generateWarPlan(struggle, goal, time);
    if (result) {
      setPlan(result);
      setStep(2);
    }
    setLoading(false);
  };

  const reset = () => {
    setPlan(null);
    setStruggle('');
    setGoal('');
    setTime('');
    setStep(1);
  };

  const PhaseCard = ({ phase, num }: { phase: WarPhase; num: number }) => (
    <div className="relative group">
      <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-stone-800"></div>
      <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center text-xs font-bold text-brand-gold z-10">
        0{num}
      </div>
      <div className="ml-8 mb-12">
        <h4 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">{phase.name}</h4>
        <div className="bg-stone-900 p-6 rounded-lg border border-stone-800 shadow-xl hover:border-brand-gold/30 transition-colors">
          <p className="text-lg text-white font-serif leading-relaxed mb-4">
             {phase.tactic}
          </p>
          <div className="flex items-start gap-2 text-xs text-stone-400 bg-black/20 p-3 rounded">
             <span className="uppercase font-bold text-brand-gold">Ammo:</span>
             <span className="italic">{phase.scriptureAmmo}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-stone-100 min-h-[600px] rounded-xl overflow-hidden border border-stone-200 relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

      {step === 1 && (
        <div className="max-w-2xl mx-auto p-8 md:p-16 relative z-10 animate-fadeIn">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">The War Room</h2>
            <p className="text-stone-600">
              Strategic protocol generation. Input your enemy, define your objective, and receive a battle plan tailored to your life.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-stone-200">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2">The Enemy (Struggle)</label>
              <input 
                value={struggle}
                onChange={(e) => setStruggle(e.target.value)}
                placeholder="e.g. Pornography, Procrastination, Anger..."
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 outline-none transition-all font-serif text-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2">The Objective (Goal)</label>
              <input 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Reclaim my marriage, Launch my business..."
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 outline-none transition-all font-serif text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-2">Constraints (Time/Resources)</label>
              <input 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 1 hour per day, limited budget..."
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 outline-none transition-all font-serif text-lg"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-stone-800 transition-all shadow-lg mt-4 disabled:opacity-70 flex justify-center items-center gap-3"
            >
              {loading ? (
                 <>
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Strategizing...
                 </>
              ) : (
                 "Generate Protocol"
              )}
            </button>
          </form>
        </div>
      )}

      {step === 2 && plan && (
        <div className="flex flex-col h-full animate-fadeIn">
           {/* Header */}
           <div className="bg-stone-900 text-white p-6 md:p-8 flex justify-between items-center border-b-4 border-brand-gold">
              <div>
                 <div className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Classified Protocol</div>
                 <h2 className="text-2xl md:text-3xl font-serif font-bold">{plan.title}</h2>
              </div>
              <button onClick={reset} className="text-stone-400 hover:text-white text-xs uppercase font-bold tracking-widest border border-stone-600 px-4 py-2 rounded hover:bg-stone-800 transition-colors">
                New Mission
              </button>
           </div>

           <div className="p-8 md:p-12 max-w-4xl mx-auto w-full">
              <div className="pl-4 border-l border-stone-300">
                 <PhaseCard phase={plan.phase1} num={1} />
                 <PhaseCard phase={plan.phase2} num={2} />
                 <PhaseCard phase={plan.phase3} num={3} />
              </div>

              <div className="mt-8 bg-white p-6 rounded border border-stone-200 text-center">
                 <p className="text-stone-500 italic text-sm mb-4">"No man that warreth entangleth himself with the affairs of this life; that he may please him who hath chosen him to be a soldier." — 2 Timothy 2:4</p>
                 <button 
                   onClick={() => window.print()} 
                   className="text-stone-900 font-bold uppercase text-xs tracking-widest hover:underline"
                 >
                    Print Dossier
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default WarRoom;
