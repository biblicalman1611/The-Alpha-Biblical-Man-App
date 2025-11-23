import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import ScriptureTool from './components/ScriptureTool';
import TutorialSection from './components/TutorialSection';
import WritingsSection from './components/WritingsSection';
import ProductSection from './components/ProductSection';
import MembersArea from './components/MembersArea';
import AboutSection from './components/AboutSection';
import LoginModal from './components/LoginModal';
import ArticleReader from './components/ArticleReader';
import { NavSection, BlogPost } from './types';
import { BLOG_POSTS, PRODUCTS } from './constants';
import { fetchLatestPosts } from './services/rssService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.HOME);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Reader State
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);

  // Refs for scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const writingsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  // Fetch RSS posts
  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts = await fetchLatestPosts();
      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
      }
    };
    loadPosts();
  }, []);

  const scrollToSection = (section: NavSection) => {
    setActiveSection(section);
    
    // If going to Members and not logged in, prompt login
    if (section === NavSection.MEMBERS && !isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    let ref = heroRef;
    if (section === NavSection.MISSION) ref = missionRef;
    else if (section === NavSection.TOOL) ref = toolRef;
    else if (section === NavSection.WRITINGS) ref = writingsRef;
    else if (section === NavSection.PRODUCTS) ref = productsRef;
    else if (section === NavSection.MEMBERS) ref = membersRef;

    // Small delay to ensure render if we are switching views
    setTimeout(() => {
       ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    scrollToSection(NavSection.MEMBERS);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection(NavSection.HOME);
    scrollToSection(NavSection.HOME);
  };

  return (
    <Layout 
      activeSection={activeSection} 
      onNavigate={scrollToSection}
      isLoggedIn={isLoggedIn}
      onLoginClick={() => setShowLoginModal(true)}
      onLogout={handleLogout}
    >
      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          onLogin={handleLogin} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      {selectedPost && (
        <ArticleReader 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

      {/* Main Content conditionally rendered based on Members view */}
      {activeSection === NavSection.MEMBERS && isLoggedIn ? (
         <div ref={membersRef}>
            <MembersArea />
         </div>
      ) : (
        <>
          <div ref={heroRef}>
            <Hero onNavigate={scrollToSection} />
          </div>

          <div ref={missionRef}>
            <AboutSection />
          </div>

          <div ref={toolRef} className="bg-white">
            <ScriptureTool />
          </div>

          <TutorialSection />

          <div ref={writingsRef}>
            <WritingsSection 
              posts={posts} 
              onReadPost={setSelectedPost}
            />
          </div>

          <div ref={productsRef}>
            <ProductSection products={PRODUCTS} />
          </div>
          
          <div className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 py-28 lg:py-36 px-4 lg:px-8 text-center relative overflow-hidden">
             {/* Decorative elements */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"></div>
               <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
             </div>

             <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 relative z-10">
               <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-4">
                 <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></span>
                 <span className="text-xs lg:text-sm font-bold tracking-[0.25em] text-stone-300 uppercase">
                   Weekly Wisdom
                 </span>
               </div>
               <h2 className="text-4xl lg:text-6xl font-serif text-white tracking-tight">Join the Congregation</h2>
               <p className="text-stone-300 text-lg lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                 Weekly reflections delivered to your inbox every Sunday morning. No noise, just substance.
               </p>
               <form className="flex flex-col sm:flex-row gap-5 lg:gap-6 justify-center max-w-2xl mx-auto mt-10" onSubmit={(e) => e.preventDefault()}>
                 <input
                   type="email"
                   placeholder="your@email.com"
                   className="px-6 lg:px-8 py-4 lg:py-5 text-base lg:text-xl rounded-xl bg-stone-800/50 backdrop-blur-sm border-2 border-stone-700 text-white placeholder-stone-400 focus:outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20 w-full transition-all shadow-xl"
                 />
                 <button className="px-8 lg:px-10 py-4 lg:py-5 bg-white text-stone-900 font-bold text-base lg:text-xl rounded-xl hover:bg-stone-100 transition-all duration-300 whitespace-nowrap shadow-2xl hover:shadow-3xl hover:-translate-y-0.5">
                   Subscribe
                 </button>
               </form>
             </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default App;