
import React, { useState } from 'react';
import { User } from '../types';

interface TutorNetworkProps {
  language: string;
  nativeLanguage: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const TutorNetwork: React.FC<TutorNetworkProps> = ({ language, nativeLanguage, user, onUnlock }) => {
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  const tutors = [
    {
      id: 'grammar_guru',
      name: 'Dr. Elena Vance',
      specialty: 'Grammar & Syntax',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      desc: 'Deep dives into subjunctive logic and complex clause structures.',
      intensity: 'High',
      cost: 50
    },
    {
      id: 'biz_lead',
      name: 'Marcus Sterling',
      specialty: 'Business Negotiation',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      desc: 'Master the art of corporate speak and high-stakes meetings.',
      intensity: 'Medium',
      cost: 40
    },
    {
      id: 'culture_crit',
      name: 'Sofia Moretti',
      specialty: 'Literature & Arts',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
      desc: 'Analyze contemporary poetry and classical texts for deep fluency.',
      intensity: 'Low',
      cost: 30
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
         <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-500 text-4xl shadow-inner border border-indigo-100">
            <i className="fa-solid fa-chalkboard-user"></i>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Specialized AI Tutors</h2>
            <p className="text-slate-400 font-medium">Carlos is great for casual chat, but these experts focus on specific intermediate hurdles.</p>
         </div>
         <div className="bg-amber-50 px-8 py-4 rounded-[2rem] border border-amber-100 text-center">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Your Tokens</span>
            <span className="text-2xl font-black text-amber-600">{user.tokens} 🪙</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {tutors.map(tutor => {
           const unlocked = user.unlockedContent.includes(`tutor_${tutor.id}`);
           return (
             <div key={tutor.id} className={`bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all ${unlocked ? 'border-emerald-200 bg-emerald-50/20' : 'grayscale opacity-90'}`}>
                <div className="relative mb-6">
                   <img src={tutor.avatar} alt={tutor.name} className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl" />
                   {unlocked && <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg"><i className="fa-solid fa-check"></i></div>}
                </div>
                <h3 className="font-black text-xl text-slate-800 mb-1">{tutor.name}</h3>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">{tutor.specialty}</span>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{tutor.desc}</p>
                
                {unlocked ? (
                  <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-100">
                    Enter Classroom
                  </button>
                ) : (
                  <button 
                    onClick={() => onUnlock(`tutor_${tutor.id}`, tutor.cost)}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                  >
                    Hire for {tutor.cost} 🪙
                  </button>
                )}
             </div>
           );
         })}
      </div>

      <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl transform rotate-12 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-graduation-cap"></i>
         </div>
         <div className="max-w-2xl">
            <h3 className="text-3xl font-black mb-4">Neural Feedback Loop</h3>
            <p className="text-slate-400 font-medium leading-relaxed mb-10">Tutors provide a detailed "Mastery Log" after every session, which is directly synced with your Dashboard and Grammar Hub for adaptive planning.</p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <i className="fa-solid fa-brain text-rose-500"></i>
                  <span className="text-xs font-bold uppercase tracking-widest">Cognitive Mapping</span>
               </div>
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                  <i className="fa-solid fa-chart-simple text-emerald-500"></i>
                  <span className="text-xs font-bold uppercase tracking-widest">Growth Analytics</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TutorNetwork;
