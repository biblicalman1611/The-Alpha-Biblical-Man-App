import React, { useState } from 'react';
import { BlogPost } from '../types';
import ShareModal from './ShareModal';

interface WritingsSectionProps {
  posts: BlogPost[];
  onReadPost: (post: BlogPost) => void;
}

const WritingsSection: React.FC<WritingsSectionProps> = ({ posts, onReadPost }) => {
  const SUBSTACK_URL = "https://biblicalman.substack.com";
  const [postToShare, setPostToShare] = useState<BlogPost | null>(null);

  const handleShareClick = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    setPostToShare(post);
  };

  return (
    <div className="py-20 lg:py-28 bg-white">
      {postToShare && (
        <ShareModal
          postTitle={postToShare.title}
          postUrl={postToShare.link}
          onClose={() => setPostToShare(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 lg:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 mb-2 lg:mb-3">From the Desk</h2>
            <p className="text-stone-500 text-base lg:text-lg">Latest essays from The Biblical Man.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
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
                <h3 className="text-2xl font-serif font-semibold text-stone-900 mb-3 group-hover:text-stone-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-600 text-base leading-7 mb-6 font-serif">
                  {post.excerpt}
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>{post.readTime}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => handleShareClick(e, post)}
                    className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
                    title="Share this post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.345 1.084m0-5.108a2.25 2.25 0 100 2.186m0-2.186c.345.167.625.419.832.732l3.652 3.325a2.25 2.25 0 000 3.864l-3.652 3.325a2.25 2.25 0 01-.832.732m5.708-8.212l-5.708 8.212" />
                    </svg>
                  </button>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Now <span className="text-brand-gold">In-App</span> &rarr;
                  </span>
                </div>
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