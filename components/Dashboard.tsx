
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { VocabularyWord, User, LearningPurpose, AppView } from '../types';

interface DashboardProps {
  vocabulary: VocabularyWord[];
  language: string;
  user: User;
  setPurpose: (p: LearningPurpose) => void;
  setActiveView: (view: AppView, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ vocabulary, language, user, setPurpose, setActiveView }) => {
  const [chartMode, setChartMode] = useState<'minutes' | 'xp'>('minutes');

  const chartData = [
    { day: 'Mon', minutes: 20, xp: 120 },
    { day: 'Tue', minutes: 45, xp: 280 },
    { day: 'Wed', minutes: 30, xp: 190 },
    { day: 'Thu', minutes: 60, xp: 450 },
    { day: 'Fri', minutes: 15, xp: 90 },
    { day: 'Sat', minutes: 50, xp: 380 },
    { day: 'Sun', minutes: 40, xp: 310 },
  ];

  const stats = [
    { label: 'Fluency Focus', value: user.learningPurpose, icon: 'fa-bullseye', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Vault Size', value: vocabulary.length, icon: 'fa-list-check', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'XP Points', value: user.xp, icon: 'fa-star', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'PolyTokens', value: user.tokens, icon: 'fa-coins', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const purposes: LearningPurpose[] = [
    'Travel', 
    'Career Advancement', 
    'Communication with Family and Friends', 
    'Daily Communication', 
    'Business', 
    'Academic', 
    'Personal Interest'
  ];

  const minutesLeft = Math.max(0, user.dailyMinutesLimit - user.aiMinutesUsed);
  const usagePercentage = (user.aiMinutesUsed / user.dailyMinutesLimit) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mr-4 border-r pr-6 border-gray-100">Learning Focus</span>
              {purposes.map(p => (
                <button 
                  key={p} 
                  onClick={() => setPurpose(p)}
                  className={`px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all ${user.learningPurpose === p ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} text-xl`}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-xs font-black text-slate-800 leading-none">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Progression Momentum</h3>
                  <p className="text-sm text-gray-400 font-medium">Tracking your path to B2 proficiency</p>
                </div>
                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                   <button 
                    onClick={() => setChartMode('minutes')}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${chartMode === 'minutes' ? 'bg-white text-indigo-600 shadow-lg' : 'text-gray-400 hover:text-gray-500'}`}
                   >
                     Minutes
                   </button>
                   <button 
                    onClick={() => setChartMode('xp')}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${chartMode === 'xp' ? 'bg-white text-emerald-600 shadow-lg' : 'text-gray-400 hover:text-gray-500'}`}
                   >
                     XP Gain
                   </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartMode === 'minutes' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', fontWeight: 700 }} />
                      <Line type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={5} dot={{ r: 7, fill: '#6366f1', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0 }} />
                    </LineChart>
                  ) : (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                      <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', fontWeight: 700 }} />
                      <Area type="monotone" dataKey="xp" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorXp)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        <div className="space-y-6">
           {/* Tier & Usage Card */}
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transform rotate-12 transition-transform group-hover:scale-110">
                 <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <h3 className="text-xl font-black tracking-tight">{user.membershipTier} Account</h3>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Membership Status</p>
                    </div>
                    <button onClick={() => setActiveView(AppView.STORE)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all">
                       <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                    </button>
                 </div>

                 <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 mb-8 backdrop-blur-sm">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                       <span className="text-slate-400">Daily AI Limit</span>
                       <span className={user.membershipTier === 'PRO' ? 'text-amber-400' : 'text-indigo-400'}>
                          {user.membershipTier === 'PRO' ? 'Unlimited' : `${minutesLeft} min left`}
                       </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-1000 ${user.membershipTier === 'PRO' ? 'bg-amber-400' : 'bg-indigo-400'}`} 
                        style={{ width: user.membershipTier === 'PRO' ? '100%' : `${100 - usagePercentage}%` }}
                       ></div>
                    </div>
                 </div>

                 {user.membershipTier !== 'PRO' && (
                   <button 
                    onClick={() => setActiveView(AppView.STORE)}
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     Go Pro - $12.99
                   </button>
                 )}
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
             <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Quick Access</h3>
             <div className="space-y-3">
                <div onClick={() => setActiveView(AppView.MEDIA)} className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-play-circle"></i>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800 leading-none mb-1">Media Hub</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Videos & Podcasts</p>
                   </div>
                </div>
                <div onClick={() => setActiveView(AppView.FLASHCARDS)} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-clone"></i>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-800 leading-none mb-1">Flashcards</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">SRS Review</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
