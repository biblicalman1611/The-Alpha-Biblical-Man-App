import React, { useEffect, useState } from 'react';
import { BlogPost, ArticleInsight } from '../types';
import { generateArticleInsight } from '../services/geminiService';
import SEO from './SEO';

interface ArticleReaderProps {
  post: BlogPost;
  onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ post, onClose }) => {
  const [insight, setInsight] = useState<ArticleInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Generate insight on load
    const loadInsight = async () => {
      setLoading(true);
      const result = await generateArticleInsight(post.content);
      setInsight(result);
      setLoading(false);
    };
    loadInsight();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [post]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row animate-fadeIn">
      {/* Dynamic SEO for this specific article */}
      <SEO 
        title={`${post.title} | The Biblical Man`} 
        description={post.excerpt}
        type="article"
      />

      {/* Sidebar / Insight Panel */}
      <div className="w-full md:w-80 bg-stone-900 text-stone-100 p-8 flex flex-col border-r border-stone-800 overflow-y-auto">
        <button 
          onClick={onClose}
          className="self-start mb-8 text-stone-400 hover:text-white flex items-center gap-2 uppercase text-xs tracking-widest font-bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return
        </button>

        <h3 className="text-xl font-serif text-brand-gold mb-6">Micro-Learning</h3>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-stone-800 rounded w-3/4"></div>
            <div className="h-4 bg-stone-800 rounded w-1/2"></div>
            <div className="h-32 bg-stone-800 rounded w-full mt-4"></div>
          </div>
        ) : insight ? (
          <div className="space-y-8 fade-in">
            <div>
              <span className="text-xs font-bold tracking-widest text-stone-500 uppercase block mb-2">Core Principle</span>
              <p className="text-white font-serif leading-relaxed italic">"{insight.corePrinciple}"</p>
            </div>
            
            <div className="bg-stone-800/50 p-4 rounded border border-stone-700">
              <span className="text-xs font-bold tracking-widest text-brand-gold uppercase block mb-2">Action Item</span>
              <p className="text-sm text-stone-300">{insight.actionItem}</p>
            </div>

            <div>
              <span className="text-xs font-bold tracking-widest text-stone-500 uppercase block mb-2">Reflection</span>
              <p className="text-sm text-stone-300 italic">{insight.reflection}</p>
            </div>
          </div>
        ) : (
          <div className="text-stone-500 text-sm">Insights currently unavailable.</div>
        )}

        <div className="mt-auto pt-8 border-t border-stone-800">
           <p className="text-xs text-stone-500 text-center">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-stone-50 relative">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-6 uppercase tracking-wider font-medium">
            <span>{post.date}</span>
            <span className="w-1 h-1 bg-stone-400 rounded-full"></span>
            <span>{post.category}</span>
            <span className="w-1 h-1 bg-stone-400 rounded-full"></span>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-10 leading-tight">
            {post.title}
          </h1>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-stone-200 text-center">
            <h4 className="font-serif text-xl mb-4">Enjoyed this reading?</h4>
            <a 
              href={post.link} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block px-6 py-2 border border-stone-900 text-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;