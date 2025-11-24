
import React, { useState, useRef, useEffect } from 'react';
import { generateTutorialAudio } from '../services/geminiService';

interface VoiceTutorialProps {
  userName: string;
}

// Audio Utils
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceTutorial: React.FC<VoiceTutorialProps> = ({ userName }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Visualizer bars
  const [bars, setBars] = useState<number[]>(new Array(5).fill(20));

  useEffect(() => {
    let animationFrame: number;
    
    if (status === 'playing') {
      const animate = () => {
        // Create pseudo-random movement for visualizer
        setBars(prev => prev.map(() => 10 + Math.random() * 40));
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    } else {
      setBars(new Array(5).fill(10));
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [status]);

  useEffect(() => {
    return () => {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioContext) audioContext.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startTutorial = async () => {
    setStatus('loading');
    
    try {
      // Generate
      const audioData = await generateTutorialAudio(userName);
      
      if (!audioData) {
        throw new Error("No audio generated");
      }

      // Initialize Context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);

      // Resume if needed
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Decode & Play
      const bytes = base64ToUint8Array(audioData);
      const buffer = await pcmToAudioBuffer(bytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      source.onended = () => setStatus('idle');
      sourceRef.current = source;
      
      source.start();
      setStatus('playing');

    } catch (e) {
      console.error("Tutorial failed", e);
      setStatus('idle');
    }
  };

  const stopTutorial = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      setStatus('idle');
    }
  };

  return (
    <div className="bg-stone-900 rounded-xl p-6 mb-8 border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-gold/5 blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'playing' ? 'bg-brand-gold text-stone-900 shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-stone-800 text-stone-500'}`}>
          {status === 'loading' ? (
             <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : status === 'playing' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <div>
           <h4 className="text-white font-serif text-lg leading-none mb-1">Guide Agent</h4>
           <p className="text-stone-400 text-xs">
             {status === 'playing' ? 'Speaking...' : status === 'loading' ? 'Generating response...' : 'Tap for Orientation'}
           </p>
        </div>
      </div>

      {/* Visualizer */}
      {status === 'playing' && (
         <div className="flex items-end justify-center gap-1 h-8">
            {bars.map((height, i) => (
              <div 
                key={i} 
                className="w-1 bg-brand-gold rounded-full transition-all duration-75"
                style={{ height: `${height}px` }}
              ></div>
            ))}
         </div>
      )}

      {/* Action */}
      <div className="relative z-10">
        {status === 'playing' ? (
           <button 
             onClick={stopTutorial}
             className="px-5 py-2 rounded-full border border-stone-700 text-stone-300 text-xs font-bold uppercase hover:bg-stone-800 transition-colors"
           >
             Stop
           </button>
        ) : (
           <button 
             onClick={startTutorial}
             disabled={status === 'loading'}
             className="px-5 py-2 rounded-full bg-white text-stone-900 text-xs font-bold uppercase hover:bg-stone-200 transition-colors shadow-lg disabled:opacity-50"
           >
             Initialize Briefing
           </button>
        )}
      </div>
    </div>
  );
};

export default VoiceTutorial;
