
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { startChatSession } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Greetings, brother. I am The Steward. How may I assist you in your pursuit of truth today?"
    }
  ]);

  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = startChatSession();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text;
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText || "I am currently unable to respond. Please forgive me."
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "The connection has been interrupted. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-stone-800 rotate-90' : 'bg-stone-900 border-2 border-brand-gold'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-gold">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 left-6 z-[60] w-[340px] md:w-[380px] bg-stone-900 rounded-2xl shadow-2xl border border-stone-700 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-left ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'
        }`}
        style={{ maxHeight: 'min(500px, 80vh)' }}
      >
        {/* Header */}
        <div className="p-4 bg-stone-800/80 backdrop-blur border-b border-stone-700 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-stone-900">
               <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
             </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif tracking-wide">The Steward</h3>
            <span className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] text-stone-400 uppercase tracking-wider">Online</span>
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#151413]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-700 text-white rounded-br-none' 
                    : 'bg-stone-800 text-stone-300 border border-stone-700 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-stone-800 border border-stone-700 p-3 rounded-lg rounded-bl-none flex gap-1">
                 <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-stone-500 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-stone-800 border-t border-stone-700">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-stone-900 border border-stone-600 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-1 top-1 p-2 bg-brand-gold rounded-full text-stone-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-stone-500 text-center mt-2">
            AI-powered response. Verify important spiritual counsel.
          </p>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
