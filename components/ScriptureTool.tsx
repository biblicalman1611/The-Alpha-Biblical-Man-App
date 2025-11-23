import React, { useState, useRef, useEffect } from 'react';
import { getScriptureInsight, generateScriptureAudio } from '../services/geminiService';
import { ScriptureResponse } from '../types';

// --- Audio Utilities ---
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

const ScriptureTool: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Audio State
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Copy State
  const [copiedLesson, setCopiedLesson] = useState(false);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) sourceRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Reset audio when result changes
  useEffect(() => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setIsPlaying(false);
    setCopiedLesson(false);
  }, [result]);

  const performSearch = async (searchTopic: string) => {
    if (!searchTopic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getScriptureInsight(searchTopic);
      if (data) {
        setResult(data);
        // Update history: Remove duplicates, add to front, keep max 5
        setHistory(prev => {
          const filtered = prev.filter(t => t.toLowerCase() !== searchTopic.toLowerCase());
          return [searchTopic, ...filtered].slice(0, 5);
        });
      } else {
        setError("Unable to retrieve wisdom at this moment. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(topic);
  };

  const handleHistoryClick = (historyItem: string) => {
    setTopic(historyItem);
    performSearch(historyItem);
  };

  const handleCopyLesson = async () => {
    if (!result?.microLesson) return;
    try {
      await navigator.clipboard.writeText(result.microLesson);
      setCopiedLesson(true);
      setTimeout(() => setCopiedLesson(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleAudio = async () => {
    if (!result?.verse) return;

    // Stop if currently playing
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsAudioLoading(true);

    try {
      // Generate Audio
      const base64Audio = await generateScriptureAudio(result.verse);
      if (!base64Audio) throw new Error("Failed to generate audio");

      // Initialize Audio Context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      // Resume context if suspended (browser policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Decode
      const bytes = base64ToUint8Array(base64Audio);
      const buffer = await pcmToAudioBuffer(bytes, audioContextRef.current);

      // Play
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);

      sourceRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (err) {
      console.error(err);
      // Optional: show audio error toast or log
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
      <div className="text-center mb-16 lg:mb-24">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-stone-900/5 backdrop-blur-sm rounded-full border border-stone-900/10 shadow-sm mb-6">
          <span className="text-xs lg:text-sm font-bold tracking-[0.25em] text-stone-700 uppercase">
            AI-Powered Wisdom
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 mb-6 lg:mb-8 tracking-tight">Micro Scripture Learning</h2>
        <p className="text-stone-600 text-lg lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
          Enter a feeling, a topic, or a question. Receive a micro-dose of ancient KJV wisdom tailored to your moment.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-stone-50/50 rounded-3xl shadow-2xl border border-stone-200/50 p-10 md:p-14 lg:p-20 relative overflow-hidden backdrop-blur-sm">
        {/* Input Section */}
        <form onSubmit={handleSearch} className="relative z-10 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Anxiety, Purpose, Grief, Joy..."
              className="flex-1 p-5 rounded-xl border-2 border-stone-300 focus:ring-4 focus:ring-stone-900/10 focus:border-stone-900 outline-none bg-white text-stone-900 placeholder-stone-400 transition-all text-lg shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-10 py-5 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>Seek Wisdom</span>
              )}
            </button>
          </div>
        </form>

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 fade-in">
            <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mr-2">Recent:</span>
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                disabled={loading}
                className="px-3 py-1 text-xs font-medium text-stone-600 bg-stone-50 rounded-full hover:bg-stone-100 hover:text-stone-900 border border-stone-200 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Results Section */}
        {error && (
          <div className="mt-8 text-center text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-16 lg:mt-24 fade-in grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {/* Card 1: The Verse - Wide Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-stone-50 to-stone-100/50 p-10 md:p-12 lg:p-16 rounded-3xl border border-stone-200/80 shadow-xl relative backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Scripture (KJV)</span>
              </div>
              
              <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-800 mb-8 lg:mb-10 leading-relaxed tracking-wide text-center px-4 md:px-12 lg:px-20 italic">
                "{result.verse}"
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-stone-200/60 gap-4">
                <p className="text-sm font-bold text-stone-900 tracking-wide font-sans">
                  — {result.reference}
                </p>
                <button 
                  onClick={toggleAudio}
                  disabled={isAudioLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all shadow-sm hover:shadow-md ${
                    isPlaying 
                      ? 'bg-stone-900 text-white border border-stone-900' 
                      : 'bg-white text-stone-900 border border-stone-200 hover:border-stone-900'
                  }`}
                >
                  {isAudioLoading ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Generating...
                    </span>
                  ) : isPlaying ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                         <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                      </svg>
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                      </svg>
                      <span>Play Audio</span> 
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card 2: Micro Lesson - Light Card */}
            <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-xl flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold tracking-widest text-stone-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                  Micro Lesson
                </span>
                <button 
                   onClick={handleCopyLesson}
                   className="text-stone-400 hover:text-stone-900 transition-colors"
                   title="Copy to clipboard"
                 >
                   {copiedLesson ? (
                     <span className="text-xs font-bold text-green-600 animate-fadeIn">Copied</span>
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                     </svg>
                   )}
                 </button>
              </div>
              <p className="text-xl text-stone-700 leading-relaxed font-serif flex-grow font-light">
                {result.microLesson}
              </p>
            </div>

            {/* Card 3: Reflection - Dark Card */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-10 rounded-3xl border border-stone-700/50 shadow-2xl flex flex-col hover:shadow-3xl transition-shadow duration-300">
              <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-6 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-white"></span>
                 Reflection
              </span>
              <p className="text-2xl font-serif text-stone-100 leading-relaxed flex-grow italic font-light">
                {result.reflectionQuestion}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptureTool;