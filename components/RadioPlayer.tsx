import React, { useState, useRef, useEffect } from 'react';

// Final Fight Bible Radio (RadioBOSS Stream)
const STREAM_URL = "https://c13.radioboss.fm:8639/stream";
const EXTERNAL_STREAM_URL = "https://www.finalfightbibleradio.com";

const RadioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Use a key to force re-render of audio element on error retry
  const [audioKey, setAudioKey] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
       if (isPlaying) setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setHasError(false);
    };
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      console.warn(`Radio Playback Error:`, target.error);
      
      // Only show error state if we were trying to play
      if (isPlaying || isLoading) {
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
        setIsExpanded(true);
      }
    };

    // Events
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('waiting', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('waiting', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying, isLoading, audioKey]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // STOP
      audio.pause();
      audio.src = ""; // Detach stream to stop buffering data
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      // PLAY
      setIsLoading(true);
      setHasError(false);
      
      // If we had an error previously, force a fresh element next time (optional, but good for clearing bad state)
      if (hasError) {
         setAudioKey(prev => prev + 1);
         // Wait for render cycle to pick up new ref? 
         // Actually, with React state update, we need to wait. 
         // Better strategy: Just set src with cache buster.
      }

      try {
        // Add cache buster to ensure live stream, not cached buffer
        audio.src = `${STREAM_URL}?cb=${Date.now()}`;
        audio.load(); // Explicitly load
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
               setIsExpanded(true);
            })
            .catch((error) => {
              console.error("Playback start failed:", error);
              setIsLoading(false);
              setIsPlaying(false);
              setHasError(true);
              setIsExpanded(true);
            });
        }
      } catch (error) {
        console.error("Setup failed:", error);
        setIsLoading(false);
        setHasError(true);
        setIsExpanded(true);
      }
    }
  };

  const openExternalPlayer = () => {
    window.open(EXTERNAL_STREAM_URL, 'FinalFightRadio', 'width=400,height=300');
    setHasError(false);
    setIsExpanded(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center transition-all duration-300 ${isExpanded ? 'gap-3' : 'gap-0'}`}>
      
      <audio
        key={audioKey}
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous" // Attempt anonymously first
      />

      {/* Expanded Control Panel */}
      <div 
        className={`bg-stone-900 text-stone-100 rounded-l-full h-12 flex items-center overflow-hidden transition-all duration-300 shadow-xl border border-stone-800 ${
          isExpanded ? 'w-auto max-w-[280px] pl-5 pr-4 opacity-100' : 'w-0 pl-0 pr-0 opacity-0'
        }`}
      >
        <div className="flex flex-col min-w-[160px] whitespace-nowrap">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1.5">
            {hasError ? (
               <span className="text-red-400">Stream Blocked</span>
            ) : isPlaying ? (
               <>
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Air
               </>
            ) : (
              'Final Fight Radio'
            )}
          </span>
          
          <div className="text-xs font-serif text-stone-400 flex items-center gap-2">
            {hasError ? (
               <button 
                onClick={openExternalPlayer}
                className="underline hover:text-white text-stone-300 font-bold"
               >
                 Launch External Player &rarr;
               </button>
            ) : (
               <span>{isLoading ? 'Connecting...' : isPlaying ? 'Broadcasting Truth' : 'Click to Listen'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Play/Toggle Button */}
      <button 
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 relative z-10 ${
          hasError
            ? 'bg-stone-800 border-red-900 text-red-500'
            : isPlaying 
              ? 'bg-stone-900 border-brand-gold text-brand-gold hover:bg-stone-800' 
              : 'bg-stone-900 border-stone-700 text-stone-100 hover:bg-stone-800 hover:border-stone-500'
        }`}
        onMouseEnter={() => !hasError && setIsExpanded(true)}
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isPlaying ? (
          <div className="flex gap-1">
             <div className="w-1 h-4 bg-current animate-[bounce_1s_infinite]"></div>
             <div className="w-1 h-6 bg-current animate-[bounce_1.2s_infinite]"></div>
             <div className="w-1 h-4 bg-current animate-[bounce_0.8s_infinite]"></div>
          </div>
        ) : hasError ? (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
             <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
           </svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Close/Minimize Button */}
      {isExpanded && (
        <button 
           onClick={() => setIsExpanded(false)}
           className="absolute -top-2 -right-2 w-5 h-5 bg-stone-200 rounded-full text-stone-900 flex items-center justify-center text-xs hover:bg-white shadow-sm z-20"
           title="Minimize"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default RadioPlayer;