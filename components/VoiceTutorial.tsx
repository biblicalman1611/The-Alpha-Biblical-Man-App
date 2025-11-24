import React, { useState, useEffect, useRef } from 'react';
import { getWelcomeTutorialScript } from '../services/geminiService';

interface VoiceTutorialProps {
  userName: string;
  onComplete: () => void;
  onSkip: () => void;
}

const VoiceTutorial: React.FC<VoiceTutorialProps> = ({ userName, onComplete, onSkip }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [script, setScript] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Tutorial steps - these will be spoken by the voice agent
  const tutorialSteps = [
    {
      icon: '👋',
      title: 'Welcome',
      highlight: 'nav-header',
    },
    {
      icon: '📖',
      title: '40-Day Protocol',
      highlight: 'protocol-section',
    },
    {
      icon: '🙏',
      title: 'Prayer Wall',
      highlight: 'prayer-section',
    },
    {
      icon: '📚',
      title: 'Bible Study',
      highlight: 'study-section',
    },
    {
      icon: '✨',
      title: 'Ready to Begin',
      highlight: 'none',
    },
  ];

  useEffect(() => {
    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Generate personalized tutorial script
    generateTutorialScript();

    return () => {
      // Cleanup: stop any ongoing speech
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const generateTutorialScript = async () => {
    setLoading(true);
    try {
      const generatedScript = await getWelcomeTutorialScript(userName);
      if (generatedScript && generatedScript.length > 0) {
        setScript(generatedScript);
      } else {
        // Fallback script if Gemini fails
        setScript(getDefaultScript());
      }
    } catch (error) {
      console.error('Failed to generate tutorial script:', error);
      setScript(getDefaultScript());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultScript = (): string[] => {
    return [
      `Welcome, ${userName}. I'm your guide to The Biblical Man member area. Let me show you around.`,
      `The 40-Day Protocol is your foundation. Here you'll track daily disciplines: scripture reading, prayer, physical training, and more. Consistency builds character.`,
      `The Prayer Wall connects you with brothers in the faith. Share your burdens, lift others up. No man fights alone.`,
      `In the Bible Study section, you'll find audio lessons and written teachings. This month, we're studying Nehemiah - rebuilding walls, both literal and spiritual.`,
      `You're ready to begin. Remember: "As iron sharpens iron, so one man sharpens another." Welcome to the brotherhood.`,
    ];
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for gravitas
    utterance.pitch = 0.9; // Deeper voice
    utterance.volume = 1.0;

    // Try to use a male voice if available
    const voices = synthRef.current.getVoices();
    const maleVoice = voices.find(
      (voice) =>
        voice.name.includes('Male') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Alex') ||
        voice.lang.includes('en-')
    );
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      // Auto-advance to next step
      if (currentStep < tutorialSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 1000);
      } else {
        // Tutorial complete
        setTimeout(onComplete, 1500);
      }
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    // Auto-play when script is loaded and step changes
    if (!loading && script.length > 0 && currentStep < script.length) {
      const timer = setTimeout(() => {
        speak(script[currentStep]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, script, loading]);

  const handlePause = () => {
    if (synthRef.current) {
      if (isPlaying) {
        synthRef.current.pause();
        setIsPlaying(false);
      } else {
        synthRef.current.resume();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipAll = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    onSkip();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-md">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white text-lg">Preparing your personalized tutorial...</p>
        </div>
      </div>
    );
  }

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/95 backdrop-blur-md p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-8 text-center relative">
          <div className="text-6xl mb-4 animate-bounce">{currentTutorialStep.icon}</div>
          <h2 className="text-2xl font-serif text-white mb-2">{currentTutorialStep.title}</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-brand-gold'
                    : index < currentStep
                    ? 'w-2 bg-brand-gold/50'
                    : 'w-2 bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Voice Visualizer */}
          <div className="mb-8 flex items-center justify-center">
            <div
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isPlaying ? 'bg-brand-gold/20' : 'bg-stone-100'
              }`}
            >
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-8 bg-brand-gold rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"></div>
                  <div className="w-1.5 h-12 bg-brand-gold rounded-full animate-[bounce_0.7s_ease-in-out_infinite]"></div>
                  <div className="w-1.5 h-16 bg-brand-gold rounded-full animate-[bounce_0.8s_ease-in-out_infinite]"></div>
                  <div className="w-1.5 h-12 bg-brand-gold rounded-full animate-[bounce_0.7s_ease-in-out_infinite]"></div>
                  <div className="w-1.5 h-8 bg-brand-gold rounded-full animate-[bounce_0.6s_ease-in-out_infinite]"></div>
                </div>
              ) : (
                <svg
                  className="w-16 h-16 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Script Text */}
          <div className="bg-stone-50 p-6 rounded-lg mb-6 min-h-[120px] flex items-center justify-center">
            <p className="text-stone-800 text-lg leading-relaxed text-center font-serif italic">
              "{script[currentStep] || 'Loading...'}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSkipAll}
              className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              Skip Tutorial
            </button>

            <button
              onClick={handlePause}
              className="w-12 h-12 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
              title={isPlaying ? 'Pause' : 'Resume'}
            >
              {isPlaying ? (
                <svg
                  className="w-6 h-6 text-stone-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-stone-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
              {currentStep < tutorialSteps.length - 1 && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTutorial;
