import React, { useState } from 'react';

interface PrayerRequest {
  id: string;
  author: string;
  initials: string;
  content: string;
  count: number;
  hasPrayed: boolean;
  time: string;
}

const MembersArea: React.FC = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([
    {
      id: '1',
      author: 'Brother James',
      initials: 'BJ',
      content: 'Seeking guidance on a career transition that impacts my family time. Need wisdom to discern the right path.',
      count: 12,
      hasPrayed: false,
      time: '2h ago'
    },
    {
      id: '2',
      author: 'Michael T.',
      initials: 'MT',
      content: 'Prayers for the upcoming Men\'s Retreat in October. That hearts would be softened and brotherhood forged.',
      count: 24,
      hasPrayed: true,
      time: '5h ago'
    },
    {
      id: '3',
      author: 'David R.',
      initials: 'DR',
      content: 'My son is struggling with his faith. Pray for a prodigal return.',
      count: 8,
      hasPrayed: false,
      time: '1d ago'
    }
  ]);

  const handlePray = (id: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          count: req.hasPrayed ? req.count - 1 : req.count + 1,
          hasPrayed: !req.hasPrayed
        };
      }
      return req;
    }));
  };

  return (
    <div className="py-24 bg-stone-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 border-b border-stone-200 pb-6 flex flex-col md:flex-row justify-between items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-2 block">
              Inner Circle
            </span>
            <h2 className="text-4xl font-serif text-stone-900">Member Dashboard</h2>
          </div>
          <div className="mt-4 md:mt-0 text-right">
             <div className="text-sm font-serif italic text-stone-600">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </div>
             <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-stone-900 text-stone-50">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
               Active Membership
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Featured Study Module */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-gold">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  This Month's Study
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Oct 2023</span>
              </div>
              
              <div className="p-6 md:p-8">
                <h4 className="text-3xl font-serif text-stone-900 mb-2">Nehemiah: Rebuilding the Walls</h4>
                <p className="text-stone-500 mb-6 font-serif italic text-lg">
                  "The God of heaven, he will prosper us; therefore we his servants will arise and build."
                </p>

                {/* Video Placeholder */}
                <div className="relative aspect-video bg-stone-900 rounded-lg overflow-hidden group cursor-pointer mb-6 shadow-md">
                   <img 
                    src="https://picsum.photos/seed/nehemiah/800/450?grayscale" 
                    alt="Study Video Thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </div>
                   </div>
                   <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-xs rounded font-medium">
                     45:20
                   </div>
                </div>

                {/* Resources */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 flex items-center justify-center gap-3 p-4 border border-stone-200 rounded-lg hover:border-stone-900 hover:bg-stone-50 transition-all group">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-stone-900">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-stone-900">Download Guide</span>
                      <span className="block text-xs text-stone-500">PDF • 2.4 MB</span>
                    </div>
                  </button>
                   <button className="flex-1 flex items-center justify-center gap-3 p-4 border border-stone-200 rounded-lg hover:border-stone-900 hover:bg-stone-50 transition-all group">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-stone-900">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-stone-900">Audio Version</span>
                      <span className="block text-xs text-stone-500">MP3 • 15 MB</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Prayer Wall */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900">Prayer Wall</h3>
                <button className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:underline">
                  + Submit Request
                </button>
              </div>
              <div className="divide-y divide-stone-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-stone-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-serif font-bold text-sm flex-shrink-0">
                        {req.initials}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-sm font-bold text-stone-900">{req.author}</span>
                           <span className="text-xs text-stone-400">{req.time}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed mb-3">
                          {req.content}
                        </p>
                        <button 
                          onClick={() => handlePray(req.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            req.hasPrayed 
                              ? 'bg-stone-900 text-white shadow-sm' 
                              : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-900'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.621c1.092 0 2.106.273 2.995.756l1.313-2.163a.75.75 0 10-1.286-.78l-1.071 1.764a7.468 7.468 0 00-3.902 0L9.078 8.682a.75.75 0 00-1.286.78l1.313 2.163A5.996 5.996 0 0112 10.871z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M11.25 13.5a.75.75 0 011.5 0v2.25H15a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75V13.5z" clipRule="evenodd" />
                          </svg>
                          {req.hasPrayed ? 'Prayed' : 'Pray'} 
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${req.hasPrayed ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'}`}>
                            {req.count}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
             
             {/* Next Event */}
             <div className="bg-stone-900 text-white p-8 rounded-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32">
                   <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                 </svg>
               </div>
               
               <span className="relative z-10 inline-block px-2 py-1 rounded bg-brand-gold text-stone-900 text-xs font-bold uppercase tracking-wider mb-4">
                 Upcoming
               </span>
               <h4 className="relative z-10 font-serif text-2xl mb-1">Annual Retreat</h4>
               <p className="relative z-10 text-stone-400 text-sm mb-6">October 14-16, 2023</p>
               
               <div className="relative z-10 space-y-3">
                 <div className="flex items-center gap-3 text-sm text-stone-300">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                   </svg>
                   Black Mountain, NC
                 </div>
               </div>

               <button className="relative z-10 mt-8 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                 RSVP Now
               </button>
             </div>

             {/* Progress / Stats */}
             <div className="bg-white p-6 rounded-xl border border-stone-200">
               <h4 className="font-serif text-lg mb-6 text-stone-900">Your Journey</h4>
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-xs font-bold uppercase text-stone-500 mb-2">
                     <span>Studies Completed</span>
                     <span>3/12</span>
                   </div>
                   <div className="w-full bg-stone-100 rounded-full h-2">
                     <div className="bg-stone-900 h-2 rounded-full" style={{ width: '25%' }}></div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                   <div className="text-center">
                     <div className="text-2xl font-bold text-stone-900 font-serif">12</div>
                     <div className="text-[10px] text-stone-400 uppercase tracking-wider">Days Streak</div>
                   </div>
                   <div className="text-center">
                     <div className="text-2xl font-bold text-stone-900 font-serif">5</div>
                     <div className="text-[10px] text-stone-400 uppercase tracking-wider">Prayers</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Quick Links */}
             <div className="bg-white p-6 rounded-xl border border-stone-200">
               <h4 className="font-serif text-lg mb-4 text-stone-900">Quick Links</h4>
               <ul className="space-y-2">
                 <li>
                   <button className="w-full text-left px-3 py-2 rounded hover:bg-stone-50 text-sm text-stone-600 transition-colors flex items-center justify-between group">
                     <span>Update Profile</span>
                     <span className="text-stone-300 group-hover:text-stone-500">→</span>
                   </button>
                 </li>
                 <li>
                   <a 
                     href="https://billing.stripe.com/p/login/test"
                     target="_blank" 
                     rel="noreferrer"
                     className="w-full text-left px-3 py-2 rounded hover:bg-stone-50 text-sm text-stone-600 transition-colors flex items-center justify-between group"
                   >
                     <span>Manage Subscription</span>
                     <span className="text-stone-300 group-hover:text-stone-500">→</span>
                   </a>
                 </li>
                 <li>
                   <a 
                     href="mailto:contact@thebiblicalmantruth.com"
                     className="w-full text-left px-3 py-2 rounded hover:bg-stone-50 text-sm text-stone-600 transition-colors flex items-center justify-between group"
                   >
                     <span>Contact Support</span>
                     <span className="text-stone-300 group-hover:text-stone-500">→</span>
                   </a>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersArea;