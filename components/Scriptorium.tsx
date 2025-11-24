
import React, { useState, useEffect, useRef } from 'react';
import { getScribePassage, getScribeAnalysis } from '../services/geminiService';

interface ScriptoriumProps {}

const THEMES = [
  "The Stoic Prophets",
  "Psalms of War",
  "Pauline Discipline",
  "Proverbs of Kings",
  "The Words of Christ"
];

const Scriptorium: React.FC<ScriptoriumProps> = () => {
  const [mode, setMode] = useState<'selection' | 'writing' | 'completion'>('selection');
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Passage Data
  const [passage, setPassage] = useState<{ reference: string, text: string } | null>(null);
  
  // User Input
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Results
  const [accuracy, setAccuracy] = useState(0);
  const [insight, setInsight] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'writing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    let interval: number;
    if (mode === 'writing' && startTime > 0) {
      interval = window.setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, startTime]);

  const startSession = async (selectedTheme: string) => {
    setTheme(selectedTheme);
    setLoading(true);
    const data = await getScribePassage(selectedTheme);
    if (data) {
      setPassage(data);
      setMode('writing');
      setStartTime(Date.now());
      setInput('');
    }
    setLoading(false);
  };

  const finishSession = async () => {
    if (!passage) return;
    
    setLoading(true);
    
    // Calculate Accuracy (Simple Levenshtein-ish via pure match ratio for now)
    const target = passage.text.trim();
    const userText = input.trim();
    let correctChars = 0;
    const len = Math.max(target.length, userText.length);
    
    for (let i = 0; i < Math.min(target.length, userText.length); i++) {
      if (target[i] === userText[i]) correctChars++;
    }
    
    const acc = Math.round((correctChars / len) * 100);
    setAccuracy(acc);

    // Get Insight
    const analysis = await getScribeAnalysis(passage.text);
    setInsight(analysis);
    
    setMode('completion');
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Prevent Paste to force deep work
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    alert("The Scriptorium requires manual transcription. Copying is forbidden.");
  };

  return (
    <div className="min-h-[600px] bg-[#1c1917] text-stone-300 font-serif relative rounded-xl overflow-hidden shadow-2xl border border-stone-800">
      {/* Grain/Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
           style={{backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`}}></div>

      {/* Header */}
      <div className="relative z-10 border-b border-stone-800 p-6 flex justify-between items-center bg-stone-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
           <span className="text-2xl">📜</span>
           <h2 className="text-xl font-bold tracking-widest text-brand-gold uppercase">The Scriptorium</h2>
        </div>
        {mode !== 'selection' && (
          <button 
            onClick={() => setMode('selection')}
            className="text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest"
          >
            Exit Session
          </button>
        )}
      </div>

      {/* MODE: SELECTION */}
      {mode === 'selection' && (
        <div className="p-12 relative z-10 max-w-3xl mx-auto animate-fadeIn">
          <h3 className="text-3xl text-white mb-4 text-center">Choose Your Discipline</h3>
          <p className="text-center text-stone-500 mb-12 max-w-md mx-auto">
            Select a thematic focus. You will receive a passage to transcribe word-for-word. 
            This is an exercise in attention, reverence, and retention.
          </p>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-brand-gold tracking-widest text-xs uppercase">Retrieving Ancient Text...</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => startSession(t)}
                  className="group p-6 bg-stone-900 border border-stone-800 hover:border-brand-gold/50 hover:bg-stone-800 transition-all rounded-lg text-left"
                >
                  <span className="block text-lg text-stone-200 group-hover:text-brand-gold mb-1">{t}</span>
                  <span className="text-xs text-stone-600 uppercase tracking-wider group-hover:text-stone-500">Begin Transcription &rarr;</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE: WRITING */}
      {mode === 'writing' && passage && (
        <div className="flex flex-col h-[calc(100%-80px)] relative z-10">
           {/* The Text Display */}
           <div className="flex-1 p-8 overflow-y-auto bg-[#151413] flex flex-col items-center justify-center text-center relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-stone-600">
                {formatTime(timeElapsed)}
              </div>
              <h4 className="text-stone-500 uppercase tracking-[0.3em] text-xs mb-6">{passage.reference}</h4>
              <p className="text-2xl md:text-3xl leading-relaxed text-stone-100 max-w-3xl select-none">
                {passage.text}
              </p>
           </div>

           {/* The Input Area */}
           <div className="h-1/3 min-h-[200px] bg-stone-900 border-t border-stone-800 p-6 flex flex-col gap-4">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                placeholder="Transcribe the text above exactly as written..."
                className="w-full h-full bg-transparent border-none outline-none text-xl text-brand-gold/80 resize-none placeholder-stone-700 font-serif leading-relaxed"
                spellCheck={false}
              />
              <div className="flex justify-between items-center">
                 <span className="text-xs text-stone-600">
                    {input.length} / {passage.text.length} characters
                 </span>
                 <button
                   onClick={finishSession}
                   disabled={input.length < 10 || loading}
                   className="px-6 py-2 bg-brand-gold text-stone-900 font-bold uppercase text-xs tracking-widest rounded hover:bg-[#c5a028] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? "Sealing..." : "Seal Work"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODE: COMPLETION */}
      {mode === 'completion' && (
         <div className="p-12 relative z-10 flex flex-col items-center justify-center h-full text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full border-2 border-brand-gold flex items-center justify-center mb-6">
               <span className="text-2xl font-bold text-brand-gold">{accuracy}%</span>
            </div>
            
            <h3 className="text-3xl text-white mb-2">Session Complete</h3>
            <p className="text-stone-500 mb-8 uppercase tracking-widest text-xs">Accuracy Rating</p>
            
            <div className="bg-stone-900 p-8 rounded-lg border border-stone-800 max-w-2xl mb-8 relative">
               <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1c1917] px-2 text-brand-gold text-xs uppercase font-bold tracking-widest">Insight</span>
               <p className="text-lg text-stone-300 italic leading-relaxed">
                 "{insight}"
               </p>
            </div>

            <button 
               onClick={() => setMode('selection')}
               className="px-8 py-3 border border-stone-700 text-stone-400 hover:text-white hover:border-white transition-colors uppercase text-xs font-bold tracking-widest"
            >
               Return to Archives
            </button>
         </div>
      )}
    </div>
  );
};

export default Scriptorium;
