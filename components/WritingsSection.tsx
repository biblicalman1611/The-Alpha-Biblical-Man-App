import React from 'react';
import { BlogPost } from '../types';

interface WritingsSectionProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
}

const WritingsSection: React.FC<WritingsSectionProps> = ({ posts, onReadPost }) => {
  const SUBSTACK_URL = "https://thebiblicalman.substack.com";

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">From the Desk</h2>
            <p className="text-stone-500">Latest essays from The Biblical Man.</p>
          </div>
          <a 
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
          >
            View Archive
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => onReadPost(post)}
              className="group cursor-pointer flex flex-col h-full justify-between"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mb-3 uppercase tracking-wider font-medium">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  <span>{post.category}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>{post.readTime}</span>
                <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Now <span className="text-brand-gold">In-App</span> &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <a 
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-stone-900 border-b border-stone-900 pb-1"
           >
            View Archive
          </a>
        </div>
      </div>
    </div>
  );
};

export default WritingsSection;