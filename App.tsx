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
          
          <div className="bg-stone-900 py-20 lg:py-28 px-4 lg:px-8 text-center">
             <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8">
               <h2 className="text-3xl lg:text-4xl font-serif text-white">Join the Congregation</h2>
               <p className="text-stone-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                 Weekly reflections delivered to your inbox every Sunday morning. No noise, just substance.
               </p>
               <form className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                 <input
                   type="email"
                   placeholder="your@email.com"
                   className="px-4 lg:px-6 py-3 lg:py-4 text-base lg:text-lg rounded-md bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 w-full"
                 />
                 <button className="px-6 lg:px-8 py-3 lg:py-4 bg-white text-stone-900 font-medium text-base lg:text-lg rounded-md hover:bg-stone-200 transition-colors whitespace-nowrap">
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