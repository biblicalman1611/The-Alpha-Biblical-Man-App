
import React, { useState, useEffect } from 'react';
import { MemberProfile, DailyTask } from '../types';
import { authService } from '../services/authService';
import ShareModal from './ShareModal';
import VoiceTutorial from './VoiceTutorial';
import WarRoom from './WarRoom';
import Scriptorium from './Scriptorium';

interface PrayerRequest {
  id: string;
  author: string;
  initials: string;
  content: string;
  count: number;
  hasPrayed: boolean;
  time: string;
}

type Tab = 'dashboard' | 'warroom' | 'scriptorium' | 'prayer';

const MembersArea: React.FC = () => {
  // --- State: Navigation ---
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // --- State: Member Profile ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [profile, setProfile] = useState<MemberProfile>({
    name: "Loading...",
    location: "",
    joinDate: "",
    imageUrl: "",
    bio: "",
  });

  // Load user data on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setProfile(user.profile);
    }
  }, []);

  // --- State: Subscription Management ---
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subStatus, setSubStatus] = useState<'Active' | 'Cancelled'>('Active');

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
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequestContent, setNewRequestContent] = useState('');
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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestContent.trim()) return;

    const initials = profile.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newReq: PrayerRequest = {
      id: Date.now().toString(),
      author: profile.name,
      initials: initials || 'ME',
      content: newRequestContent,
      count: 0,
      hasPrayed: false,
      time: 'Just now'
    };

    setRequests([newReq, ...requests]);
    setNewRequestContent('');
    setShowRequestForm(false);
  };

  const toggleTask = (id: string) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(profile);
      setIsEditingProfile(false);
    } catch (err) {
      alert("Failed to save profile.");
    }
  };

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You will lose access to the Member Area at the end of the billing cycle.")) {
      setSubStatus('Cancelled');
    }
  };

  return (
    <div className="py-24 bg-stone-50 min-h-[80vh]">
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          postTitle={`Profile: ${profile.name} - The Biblical Man`}
          postUrl="https://thebiblicalmantruth.com/members/profile/brother-thomas" 
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 fade-in" onClick={() => setShowSubscriptionModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-xl font-serif text-stone-900">Subscription Management</h3>
              <button onClick={() => setShowSubscriptionModal(false)} className="text-stone-400 hover:text-stone-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Current Plan */}
              <div>
                <span className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2 block">Current Plan</span>
                <div className="flex justify-between items-start bg-stone-50 p-4 rounded-lg border border-stone-200">
                  <div>
                    <h4 className="font-bold text-stone-900 text-lg">The Inner Circle</h4>
                    <p className="text-stone-600 text-sm">$3.00 USD / month</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${subStatus === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm font-medium text-stone-700">{subStatus}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-500 uppercase">Next Billing</p>
                    <p className="font-serif text-stone-900">{subStatus === 'Active' ? 'Nov 01, 2023' : 'Expiring Soon'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                {subStatus === 'Active' ? (
                  <button 
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button 
                    onClick={() => setSubStatus('Active')}
                    className="px-4 py-2 text-green-600 hover:bg-green-50 rounded text-sm font-medium transition-colors"
                  >
                    Reactivate Subscription
                  </button>
                )}
                <button className="px-4 py-2 bg-stone-900 text-white rounded text-sm font-medium hover:bg-stone-700">
                  Update Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Voice Tutorial Agent */}
        <VoiceTutorial userName={profile.name} />

        {/* Header & Profile Summary */}
        <div className="mb-8 pb-8 border-b border-stone-200">
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

            {/* Profile Info */}
            <div className="flex-grow w-full">
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 space-y-4 animate-fadeIn">
                   {/* ... (Existing Profile Edit Form) ... */}
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
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Bio</label>
                    <textarea 
                      value={profile.bio} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900 outline-none h-24"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-sm text-stone-600">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded">Save Profile</button>
                  </div>
                </form>
              ) : (
                <div>
                   <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-serif text-stone-900">{profile.name}</h2>
                        <p className="text-stone-500 text-sm mb-4 flex items-center gap-2">
                          {profile.location} • Member since {profile.joinDate}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-900 text-stone-50 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mr-2 animate-pulse"></span>
                          Active Member
                        </span>
                        <div className="flex items-center gap-4">
                           <button onClick={() => setShowSubscriptionModal(true)} className="text-xs font-medium text-stone-500 hover:text-stone-900 underline">Manage Subscription</button>
                           <button onClick={() => setShowShareModal(true)} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-stone-900">Share Profile</button>
                        </div>
                      </div>
                   </div>
                   <p className="text-stone-700 leading-relaxed max-w-2xl font-serif text-lg">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Premium Tab Navigation --- */}
        <div className="flex gap-8 border-b border-stone-200 mb-8 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
               activeTab === 'dashboard' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
             }`}
           >
             Protocol Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('warroom')}
             className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
               activeTab === 'warroom' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
             }`}
           >
             <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
             The War Room
           </button>
           <button 
             onClick={() => setActiveTab('scriptorium')}
             className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
               activeTab === 'scriptorium' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
             }`}
           >
             <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
             The Scriptorium
           </button>
           <button 
             onClick={() => setActiveTab('prayer')}
             className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
               activeTab === 'prayer' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
             }`}
           >
             Prayer Wall
           </button>
        </div>

        {/* --- Tab Content --- */}
        <div className="min-h-[500px]">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              <div className="lg:col-span-2 space-y-8">
                {/* 40-Day Protocol Tracker */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                   <div className="p-6 bg-stone-900 text-white flex justify-between items-center">
                     <div>
                       <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase mb-1 block">Spiritual Growth</span>
                       <h3 className="text-xl font-serif">The 40-Day Protocol</h3>
                     </div>
                     <div className="text-right">
                        <div className="text-3xl font-serif font-bold text-white">{currentDay}<span className="text-stone-500 text-lg">/40</span></div>
                        <div className="text-xs text-stone-400 uppercase tracking-wider">Day Streak</div>
                     </div>
                   </div>
                   <div className="p-6">
                     <div className="mb-8">
                       <div className="w-full bg-stone-100 rounded-full h-2">
                          <div className="bg-brand-gold h-2 rounded-full transition-all duration-1000" style={{ width: `${(currentDay / 40) * 100}%` }}></div>
                       </div>
                     </div>
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
                              task.completed ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-white border-stone-300 hover:border-stone-900 shadow-sm'
                            }`}
                         >
                            <div className={`w-6 h-6 rounded border flex items-center justify-center mr-4 transition-colors ${
                              task.completed ? 'bg-stone-900 border-stone-900' : 'bg-white border-stone-300'
                            }`}>
                              {task.completed && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                            </div>
                            <span className={`text-sm font-medium ${task.completed ? 'text-stone-400 line-through' : 'text-stone-900'}`}>{task.label}</span>
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-stone-900 rounded-xl p-8 text-center shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
                   <p className="text-white font-serif italic text-lg leading-relaxed mb-4 relative z-10">
                     "The world asks, 'What does a man own?' Christ asks, 'How does he use it?'"
                   </p>
                   <span className="text-xs font-bold uppercase text-stone-500 tracking-widest">Andrew Murray</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WAR ROOM */}
          {activeTab === 'warroom' && (
             <WarRoom />
          )}

          {/* TAB 3: SCRIPTORIUM (PREMIUM FEATURE) */}
          {activeTab === 'scriptorium' && (
             <div className="animate-fadeIn">
               <div className="mb-6">
                  <h3 className="text-2xl font-serif text-stone-900 mb-2">The Scriptorium</h3>
                  <p className="text-stone-600 max-w-2xl">
                    The ancient discipline of copywork. Write the text to write it on your heart.
                    Select a theme, focus your mind, and transcribe the Word.
                  </p>
               </div>
               <Scriptorium />
             </div>
          )}

          {/* TAB 4: PRAYER WALL */}
          {activeTab === 'prayer' && (
             <div className="bg-white rounded-xl shadow-sm border border-stone-200 animate-fadeIn">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900">Prayer Wall</h3>
                <button 
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:underline"
                >
                  {showRequestForm ? 'Cancel' : '+ Submit Request'}
                </button>
              </div>

              {/* New Prayer Request Form */}
              {showRequestForm && (
                <div className="p-6 bg-stone-50 border-b border-stone-100 animate-fadeIn">
                  <h4 className="text-sm font-bold uppercase text-stone-500 mb-4">New Request</h4>
                  <form onSubmit={handleRequestSubmit}>
                    <textarea
                      value={newRequestContent}
                      onChange={(e) => setNewRequestContent(e.target.value)}
                      placeholder="Share your burden or request with the brotherhood..."
                      className="w-full p-4 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-900 outline-none mb-4 font-serif bg-white"
                      rows={3}
                      required
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-stone-700 transition-colors"
                      >
                        Post to Wall
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="divide-y divide-stone-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-stone-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-serif font-bold text-sm flex-shrink-0">{req.initials}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-sm font-bold text-stone-900">{req.author}</span>
                           <span className="text-xs text-stone-400">{req.time}</span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed mb-3">{req.content}</p>
                        <button 
                          onClick={() => handlePray(req.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            req.hasPrayed ? 'bg-stone-900 text-white shadow-sm' : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-900'
                          }`}
                        >
                          {req.hasPrayed ? 'Prayed' : 'Pray'} <span className="opacity-60">({req.count})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MembersArea;
