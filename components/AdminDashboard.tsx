import React, { useState, useEffect } from 'react';
import { AnalyticsMetric, BusinessInsight } from '../types';
import { generateAnalyticsInsight } from '../services/geminiService';

const MOCK_METRICS: AnalyticsMetric[] = [
  { label: 'Total Members', value: '1,248', change: 12.5, trend: 'up' },
  { label: 'Active Subscriptions', value: '892', change: 8.2, trend: 'up' },
  { label: 'Scripture Tool Searches', value: '14.2k', change: 24.0, trend: 'up' },
  { label: 'Churn Rate', value: '4.1%', change: -0.5, trend: 'down' }, // down is good for churn
];

const MOCK_USER_ACTIVITY = {
  dailyActiveUsers: [120, 145, 132, 160, 185, 210, 195], // Last 7 days
  topSearchTerms: ['Anxiety', 'Purpose', 'Fatherhood', 'Anger', 'Marriage'],
  recentSignups: [
    { name: 'David C.', plan: 'Monthly', status: 'Active', date: '2h ago' },
    { name: 'Sarah L.', plan: 'Annual', status: 'Active', date: '5h ago' },
    { name: 'Mark R.', plan: 'Monthly', status: 'Pending', date: '1d ago' },
  ]
};

const AdminDashboard: React.FC = () => {
  const [insight, setInsight] = useState<BusinessInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const runAIAnalysis = async () => {
    setLoading(true);
    // Serialize mock data to send to Gemini
    const dataContext = JSON.stringify({
      metrics: MOCK_METRICS,
      activity: MOCK_USER_ACTIVITY,
      context: "Platform is growing but we need to ensure retention of new monthly users."
    });

    const result = await generateAnalyticsInsight(dataContext);
    setInsight(result);
    setLoading(false);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // Run initial analysis on mount
    runAIAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-12 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h6 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Internal Tool</h6>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Command Center</h1>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-stone-500">Last Analysis: {lastUpdated.toLocaleTimeString()}</span>
             <button 
               onClick={runAIAnalysis}
               disabled={loading}
               className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-70"
             >
               {loading ? (
                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               )}
               Refresh Gemini Intel
             </button>
          </div>
        </div>

        {/* AI Insight Section (Hero) */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold"></div>
           <div className="p-8">
             <div className="flex items-center gap-2 mb-6">
                <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Gemini 2.5 Analysis</span>
             </div>
             
             {loading ? (
                <div className="space-y-4 animate-pulse">
                   <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                   <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                   <div className="h-20 bg-stone-200 rounded w-full mt-4"></div>
                </div>
             ) : insight ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-2">
                      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Executive Summary</h3>
                      <p className="text-stone-600 leading-relaxed">{insight.summary}</p>
                   </div>
                   
                   <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">Key Observation</h4>
                      <p className="text-sm font-medium text-stone-900">{insight.keyObservation}</p>
                   </div>
                   
                   <div className="bg-stone-900 p-4 rounded-lg text-stone-100">
                      <h4 className="text-xs font-bold uppercase text-brand-gold tracking-wider mb-2">Strategic Action</h4>
                      <p className="text-sm font-medium leading-relaxed">{insight.strategicAction}</p>
                   </div>
                </div>
             ) : (
                <div className="text-stone-400 italic">No analysis generated yet. Click refresh.</div>
             )}
           </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_METRICS.map((metric, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between h-32">
              <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider">{metric.label}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-serif font-bold text-stone-900">{metric.value}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  (metric.trend === 'up' && metric.label !== 'Churn Rate') || (metric.trend === 'down' && metric.label === 'Churn Rate')
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Chart Section */}
           <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-serif font-bold text-stone-900">User Activity (7 Days)</h3>
                <select className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1">
                  <option>Active Users</option>
                  <option>Signups</option>
                </select>
              </div>
              
              {/* CSS Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
                 {MOCK_USER_ACTIVITY.dailyActiveUsers.map((val, idx) => {
                    const max = Math.max(...MOCK_USER_ACTIVITY.dailyActiveUsers);
                    const height = (val / max) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative">
                         {/* Tooltip */}
                         <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-stone-900 text-white text-xs py-1 px-2 rounded transition-opacity pointer-events-none mb-2">
                           {val} Users
                         </div>
                         <div 
                           className="w-full bg-stone-200 rounded-t-sm hover:bg-stone-800 transition-all duration-500"
                           style={{ height: `${height}%` }}
                         ></div>
                         <span className="text-[10px] text-stone-400 mt-2 font-mono">Day {idx + 1}</span>
                      </div>
                    )
                 })}
              </div>
           </div>

           {/* Recent Signups */}
           <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-stone-900 mb-6">Recent Members</h3>
              <div className="space-y-6">
                 {MOCK_USER_ACTIVITY.recentSignups.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs">
                             {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-stone-900">{user.name}</p>
                             <p className="text-xs text-stone-500">{user.plan}</p>
                          </div>
                       </div>
                       <span className={`text-xs px-2 py-1 rounded border ${
                         user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                       }`}>
                         {user.status}
                       </span>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest border border-dashed border-stone-300 rounded text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-colors">
                View All Users
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
