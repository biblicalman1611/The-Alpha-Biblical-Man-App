import React from 'react';

const MembersArea: React.FC = () => {
  return (
    <div className="py-24 bg-stone-50 min-h-[60vh]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-12 border-b border-stone-200 pb-6 flex flex-col md:flex-row justify-between items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase mb-2 block">
              Inner Circle
            </span>
            <h2 className="text-4xl font-serif text-stone-900">Member Dashboard</h2>
          </div>
          <div className="mt-4 md:mt-0">
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
               Active Membership
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Exclusive Content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-2xl font-serif mb-4">The Monthly Study</h3>
              <div className="aspect-video bg-stone-200 rounded-lg mb-4 flex items-center justify-center text-stone-400">
                [Exclusive Video Content Placeholder]
              </div>
              <p className="text-stone-600 mb-4">
                This month we are diving deep into the book of Nehemiah and the concept of "Rebuilding the Walls" of our families.
              </p>
              <button className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600">
                Download Study Guide (PDF)
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
              <h3 className="text-xl font-serif mb-4">Community Prayer Requests</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-stone-600 pb-3 border-b border-stone-50">
                   <span className="w-2 h-2 mt-1.5 rounded-full bg-stone-400 flex-shrink-0"></span>
                   <p>Pray for Brother James, seeking guidance on a career transition that impacts his family time.</p>
                </li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 pb-3 border-b border-stone-50">
                   <span className="w-2 h-2 mt-1.5 rounded-full bg-stone-400 flex-shrink-0"></span>
                   <p>Pray for the upcoming Men's Retreat in October.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
             <div className="bg-stone-900 text-white p-6 rounded-xl">
               <h4 className="font-serif text-lg mb-2">Member Perks</h4>
               <ul className="text-sm space-y-2 text-stone-300">
                 <li>• Ad-free Reading Experience</li>
                 <li>• Early Access to Essays</li>
                 <li>• 20% Store Discount</li>
                 <li>• Direct Messaging</li>
               </ul>
             </div>

             <div className="bg-white p-6 rounded-xl border border-stone-200">
               <h4 className="font-serif text-lg mb-2 text-stone-900">Your Stats</h4>
               <div className="grid grid-cols-2 gap-4 mt-4">
                 <div>
                   <div className="text-2xl font-bold text-stone-900">12</div>
                   <div className="text-xs text-stone-500 uppercase">Articles Read</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-stone-900">5</div>
                   <div className="text-xs text-stone-500 uppercase">Reflections</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersArea;