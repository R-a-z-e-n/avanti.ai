
import React from 'react';
import { AppView, User } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  nativeLanguage: string;
  setNativeLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  nativeLanguage, 
  setNativeLanguage, 
  targetLanguage, 
  setTargetLanguage,
  user
}) => {
  const menuItems = [
    { view: AppView.DASHBOARD, icon: 'fa-chart-line', label: 'Dashboard', group: 'Main' },
    
    { view: AppView.MEDIA, icon: 'fa-play-circle', label: 'Media Hub', group: 'Resources' },
    { view: AppView.TUTORS, icon: 'fa-chalkboard-user', label: 'Tutor Network', group: 'Resources' },
    { view: AppView.FLASHCARDS, icon: 'fa-clone', label: 'Neural Cards', group: 'Resources' },

    { view: AppView.READING, icon: 'fa-book-open', label: 'Reading', group: 'Skillsets' },
    { view: AppView.WRITING, icon: 'fa-pen-nib', label: 'Writing', group: 'Skillsets' },
    { view: AppView.SPEAKING, icon: 'fa-microphone', label: 'Speaking', group: 'Skillsets' },
    { view: AppView.LISTENING, icon: 'fa-headphones', label: 'Listening', group: 'Skillsets' },
    { view: AppView.VOCABULARY, icon: 'fa-language', label: 'Vocabulary', group: 'Skillsets' },

    { view: AppView.GRAMMAR, icon: 'fa-spell-check', label: 'Grammar Hub', group: 'Tools' },
    { view: AppView.CULTURE, icon: 'fa-globe', label: 'Cultural Layer', group: 'Tools' },
    
    { view: AppView.COMMUNITY, icon: 'fa-people-group', label: 'Community', group: 'Social' },
    { view: AppView.REFER, icon: 'fa-gift', label: 'Refer & Earn', group: 'Social' },
    { view: AppView.STORE, icon: 'fa-shop', label: 'PolyStore', group: 'Social' },
    { view: AppView.OFFLINE, icon: 'fa-cloud-arrow-down', label: 'Offline Mode', group: 'Social' },
  ];

  const languages = [
    'English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French', 
    'Modern Standard Arabic', 'Bengali', 'Portuguese', 'Russian', 'Urdu', 
    'Indonesian/Malay', 'Japanese', 'German', 'Nigerian Pidgin', 'Marathi', 
    'Telugu', 'Turkish', 'Tamil', 'Yue Chinese (Cantonese)', 'Vietnamese', 
    'Tagalog (Filipino)', 'Persian', 'Italian', 'Korean', 'Swahili'
  ];

  return (
    <aside className="w-20 md:w-80 bg-slate-950 text-white flex flex-col transition-all duration-300 shadow-2xl z-50 border-r border-white/5 min-h-screen">
      {/* Header section */}
      <div className="p-8 flex items-center gap-4 cursor-pointer group" onClick={() => setActiveView(AppView.DASHBOARD)}>
        <div className="bg-gradient-to-br from-orange-400 to-rose-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-rose-500/20 group-hover:scale-105 transition-transform">
          <i className="fa-solid fa-stairs"></i>
        </div>
        <span className="hidden md:block font-black text-3xl tracking-tighter text-white">Avanti.AI</span>
      </div>

      {/* Language Selector section */}
      <div className="px-6 mt-2 hidden md:block">
        <div className="bg-white/5 p-5 rounded-[2rem] border border-white/10 space-y-5">
          <div>
            <label className="text-[10px] uppercase font-black text-rose-400 tracking-[0.2em] flex items-center gap-2 mb-2">
              <i className="fa-solid fa-earth-americas"></i> Native Tongue
            </label>
            <div className="relative">
              <select 
                value={nativeLanguage} 
                onChange={(e) => setNativeLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-black text-rose-400 tracking-[0.2em] flex items-center gap-2 mb-2">
              <i className="fa-solid fa-graduation-cap"></i> Target Study
            </label>
            <div className="relative">
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-rose-500 outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-rose-400 text-[10px] pointer-events-none"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation section - NO internal scroll, NO h-screen container */}
      <nav className="flex-1 mt-8 px-3 pb-10">
        {['Main', 'Resources', 'Skillsets', 'Tools', 'Social'].map(group => (
          <div key={group} className="mb-8">
            <div className="px-5 mb-4 hidden md:block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{group}</span>
            </div>
            {menuItems.filter(item => item.group === group).map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-5 px-5 py-3 transition-all relative group rounded-2xl mb-1 ${
                  activeView === item.view 
                    ? 'bg-white/10 text-white shadow-xl' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeView === item.view ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-900 text-slate-500 group-hover:bg-slate-800'}`}>
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                </div>
                <span className="hidden md:block font-bold text-sm tracking-wide">{item.label}</span>
                {activeView === item.view && <div className="absolute left-0 w-1.5 h-6 bg-rose-500 rounded-r-full hidden md:block"></div>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer section of the sidebar */}
      <div className="p-6 border-t border-white/5 bg-slate-900/50 mt-auto">
        <button 
          onClick={() => setActiveView(AppView.STORE)}
          className="w-full bg-rose-500/10 p-4 rounded-2xl mb-5 hidden md:flex items-center justify-center gap-3 border border-rose-500/20 hover:bg-rose-500/20 transition-all group"
        >
          <span className="text-sm font-black text-rose-400">{user?.tokens || 0} 🪙</span>
          <i className="fa-solid fa-plus text-[10px] text-rose-400 group-hover:rotate-90 transition-transform"></i>
        </button>
        <button 
          onClick={() => setActiveView(AppView.PROFILE)}
          className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group"
        >
          <img src={user?.avatar} alt="Avatar" className="w-10 h-10 rounded-xl border border-white/10 group-hover:scale-105 transition-transform" />
          <div className="hidden md:block text-left overflow-hidden">
             <p className="text-sm font-black truncate">{user?.name}</p>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Level {user?.level}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
