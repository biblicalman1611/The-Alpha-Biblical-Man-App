
import React, { useState } from 'react';
import { MemberProfile, DailyTask } from '../types';

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
  // --- State: Member Profile ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<MemberProfile>({
    name: "Brother Thomas",
    location: "Nashville, TN",
    joinDate: "September 2023",
    imageUrl: "https://picsum.photos/seed/thomas/200/200?grayscale",
    bio: "Husband, father of three. Seeking to build a legacy of faith and discipline. Currently working through Nehemiah and focusing on early morning prayer. 'As for me and my house, we will serve the Lord.'",
  });

  // --- State: 40-Day Protocol ---
  const [currentDay, setCurrentDay] = useState(12);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: '1', label: 'Read 1 Chapter (KJV)', completed: true },
    { id: '2', label: 'Prayer (15 min)', completed: true },
    { id: '3', label: 'Physical Training', completed: false },
    { id: '4', label: 'No Vice / Sugar', completed: false },
    { id: '5', label: 'Journal Reflection', completed: false },
  ]);

  // Mock "Micro-Learning" content for the current day
  const dailyFocus = {
    theme: "The Discipline of Silence",
    scripture: "Proverbs 13:3",
    text: "He that keepeth his mouth keepeth his life: but he that openeth wide his lips shall have destruction.",
    action: "Practice silence today. Speak only when necessary."
  };

  // --- State: Prayer Wall ---
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

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
  };

  return (
    <div className="py-24 bg-stone-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header & Profile Summary */}
        <div className="mb-12 border-b border-stone-200 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar */}
            <div className="flex-shrink-0 relative group">
              <img 
                src={profile.imageUrl} 
                alt="Profile" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="absolute bottom-0 right-0 bg-stone-900 text-white p-2 rounded-full shadow-md hover:bg-stone-700 transition-colors"
                title="Edit Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
              </button>
            </div>

            {/* Profile Info or Edit Form */}
            <div className="flex-grow w-full">
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={profile.location} 
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Profile Image URL</label>
                    <input 
                      type="text" 
                      value={profile.imageUrl} 
                      onChange={(e) => setProfile({...profile, imageUrl: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Bio (Share your story)</label>
                    <textarea 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none h-24"
                      placeholder="Tell the brotherhood about yourself..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-700"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                   <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-serif text-stone-900">{profile.name}</h2>
                        <p className="text-stone-500 text-sm mb-4 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-stone-400">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          {profile.location} • Member since {profile.joinDate}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-900 text-stone-50 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2 animate-pulse"></span>
                        Active Member
                      </span>
                   </div>
                   <p className="text-stone-700 leading-relaxed max-w-2xl font-serif text-lg">
                     {profile.bio}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* The 40-Day Protocol Tracker */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
               <div className="p-6 bg-stone-900 text-white flex justify-between items-center">
                 <div>
                   <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase mb-1 block">
                      Spiritual Growth
                   </span>
                   <h3 className="text-xl font-serif">The 40-Day Protocol</h3>
                 </div>
                 <div className="text-right">
                    <div className="text-3xl font-serif font-bold text-white">{currentDay}<span className="text-stone-500 text-lg">/40</span></div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">Day Streak</div>
                 </div>
               </div>
               
               <div className="p-6">
                 {/* Progress Bar */}
                 <div className="mb-8">
                   <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-brand-gold h-2 rounded-full transition-all duration-1000" style={{ width: `${(currentDay / 40) * 100}%` }}></div>
                   </div>
                 </div>

                 {/* Daily Micro-Learning Content */}
                 <div className="mb-8 p-5 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 block">Day {currentDay} Micro-Learning</span>
                    <h5 className="font-serif text-lg text-stone-900 font-bold mb-1">{dailyFocus.theme}</h5>
                    <p className="text-stone-600 italic text-sm mb-3">"{dailyFocus.text}" — {dailyFocus.scripture}</p>
                    <div className="flex items-start gap-2 text-xs text-stone-500 font-medium bg-white p-2 rounded border border-stone-100">
                       <span className="uppercase text-stone-900 font-bold">Action:</span> {dailyFocus.action}
                    </div>
                 </div>

                 <h4 className="text-sm font-bold uppercase text-stone-500 mb-4">Daily Non-Negotiables</h4>
                 <div className="space-y-3">
                   {dailyTasks.map(task => (
                     <button 
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full flex items-center p-3 rounded-lg border transition-all ${
                          task.completed 
                            ? 'bg-stone-50 border-stone-200 opacity-60' 
                            : 'bg-white border-stone-300 hover:border-stone-900 shadow-sm'
                        }`}
                     >
                        <div className={`w-6 h-6 rounded border flex items-center justify-center mr-4 transition-colors ${
                          task.completed ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'
                        }`}>
                          {task.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${task.completed ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                          {task.label}
                        </span>
                     </button>
                   ))}
                 </div>
               </div>
            </div>

            {/* Bible Study Module (Audio + Text) */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-gold">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  This Month's Study
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Nehemiah</span>
              </div>
              
              {/* Audio Player Header */}
              <div className="bg-stone-50 p-6 border-b border-stone-100">
                <h4 className="text-2xl font-serif text-stone-900 mb-2">Rebuilding the Walls</h4>
                <div className="flex items-center gap-4 mt-4">
                  <audio controls className="w-full h-10 accent-stone-900">
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-stone-500 uppercase tracking-wider font-bold">
                   <span>Audio Lesson</span>
                   <span>24 Min Listen</span>
                </div>
              </div>

              {/* Text Content - Read Along */}
              <div className="p-8 md:p-10 max-h-[500px] overflow-y-auto custom-scrollbar">
                <article className="prose prose-stone max-w-none font-serif">
                   <p className="lead text-xl italic text-stone-600 mb-6">
                     "And I said unto them, You see the distress that we are in, how Jerusalem lieth waste, and the gates thereof are burned with fire: come, and let us build up the wall of Jerusalem, that we be no more a reproach." — Nehemiah 2:17
                   </p>
                   <h3 className="text-lg font-bold uppercase text-stone-900 mb-4">The Burden of Ruin</h3>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     Nehemiah was comfortable. He served in the citadel of Susa, cupbearer to the King. Yet, when he heard the report of his people—that the walls were broken down and the gates burned—he sat down and wept. 
                   </p>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     The mark of a Biblical man is not that he can endure hardship, but that he cannot endure the ruin of what God loves. While others walked past the rubble, accepting it as the "new normal," Nehemiah felt the weight of it in his soul.
                   </p>
                   <h3 className="text-lg font-bold uppercase text-stone-900 mb-4 mt-8">Prayer Before Action</h3>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     Before he laid a single stone, Nehemiah spent days in fasting and prayer. He did not rush to fix the problem with human strength. He went first to the Architect.
                   </p>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     In our lives, we often reverse this. We try to fix our families, our finances, or our habits with sheer grit, only to burn out. Rebuilding requires a blueprint from heaven.
                   </p>
                   <h3 className="text-lg font-bold uppercase text-stone-900 mb-4 mt-8">The Sword and The Trowel</h3>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     Later, as the work began, opposition rose. Sanballat and Tobiah mocked them. They threatened violence. Did Nehemiah stop? No. He armed the men.
                   </p>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     "Every one with one of his hands wrought in the work, and with the other hand held a weapon." (Nehemiah 4:17).
                   </p>
                   <p className="mb-4 text-stone-800 leading-relaxed">
                     This is our posture today. We build (our legacy, our work, our discipline) while simultaneously holding the sword (spiritual warfare, guarding against vice). You cannot build if you cannot fight.
                   </p>
                </article>
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

          {/* SIDEBAR COLUMN */}
          <div className="space-y-8">
             
             {/* News & Updates */}
             <div className="bg-stone-900 text-white p-6 rounded-xl relative overflow-hidden">
               <span className="relative z-10 inline-block px-2 py-1 rounded bg-stone-700 text-stone-200 text-[10px] font-bold uppercase tracking-wider mb-4">
                 News Blasts
               </span>
               <h4 className="relative z-10 font-serif text-2xl mb-4">Congregation Updates</h4>
               
               <div className="relative z-10 space-y-4">
                 <div className="border-l-2 border-brand-gold pl-4 py-1">
                   <p className="text-xs text-stone-400 mb-1">Oct 12, 2023</p>
                   <p className="text-sm text-stone-200 leading-snug">
                     New audio series on "The Theology of Work" drops next Monday. Prepare your hearts.
                   </p>
                 </div>
                 <div className="border-l-2 border-stone-700 pl-4 py-1">
                   <p className="text-xs text-stone-400 mb-1">Oct 08, 2023</p>
                   <p className="text-sm text-stone-300 leading-snug">
                     Welcome to the 50 new brothers who joined from the Substack this week. Iron sharpens iron.
                   </p>
                 </div>
                  <div className="border-l-2 border-stone-700 pl-4 py-1">
                   <p className="text-xs text-stone-400 mb-1">Oct 01, 2023</p>
                   <p className="text-sm text-stone-300 leading-snug">
                     Reminder: The 40-Day Protocol resets on the 1st of next month. Finish strong.
                   </p>
                 </div>
               </div>
             </div>

             {/* Quick Links */}
             <div className="bg-white p-6 rounded-xl border border-stone-200">
               <h4 className="font-serif text-lg mb-4 text-stone-900">Account & Support</h4>
               <ul className="space-y-2">
                 <li>
                   <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-stone-50 text-sm text-stone-600 transition-colors flex items-center justify-between group"
                   >
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
                     <span>Manage Subscription ($3/mo)</span>
                     <span className="text-stone-300 group-hover:text-stone-500">→</span>
                   </a>
                 </li>
                 <li>
                   <a 
                     href="mailto:sam@thebiblicalmantruth.com"
                     className="w-full text-left px-3 py-2 rounded hover:bg-stone-50 text-sm text-stone-600 transition-colors flex items-center justify-between group"
                   >
                     <span>Contact Support (Sam AI)</span>
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
