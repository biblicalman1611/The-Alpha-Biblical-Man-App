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
    <div className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Micro Scripture Learning</h2>
        <p className="text-stone-600 max-w-lg mx-auto">
          Enter a feeling, a topic, or a question. Receive a micro-dose of ancient KJV wisdom tailored to your moment.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 md:p-12 relative overflow-hidden">
        {/* Input Section */}
        <form onSubmit={handleSearch} className="relative z-10 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Anxiety, Purpose, Grief, Joy..."
              className="flex-1 p-4 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none bg-stone-50 text-stone-900 placeholder-stone-400 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-8 py-4 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
          <div className="mt-12 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Card 1: The Verse */}
              <div className="bg-stone-50 p-8 rounded-xl border-l-4 border-stone-800 relative">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold tracking-widest text-stone-400 uppercase block">Scripture (KJV)</span>
                </div>
                
                <p className="text-xl md:text-2xl font-serif italic text-stone-800 mb-6 leading-relaxed">
                  "{result.verse}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-stone-200/50">
                  <p className="text-sm font-semibold text-stone-600 font-sans">
                    — {result.reference}
                  </p>
                  <button 
                    onClick={toggleAudio}
                    disabled={isAudioLoading}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isPlaying ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                    }`}
                    title="Listen to Verse"
                  >
                    {isAudioLoading ? (
                      <span className="animate-pulse">Loading Audio...</span>
                    ) : isPlaying ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM9 8.25a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75H9zm5.25 0a.75.75 0 00-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-.75z" clipRule="evenodd" />
                        </svg>
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                        </svg>
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Card 2: The Insight */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                  <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">Micro Lesson</span>
                  <p className="text-stone-700 leading-relaxed">
                    {result.microLesson}
                  </p>
                </div>
                <div className="bg-stone-900 p-6 rounded-xl shadow-lg text-stone-100">
                  <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">Reflection</span>
                  <p className="text-lg font-serif">
                    {result.reflectionQuestion}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptureTool;