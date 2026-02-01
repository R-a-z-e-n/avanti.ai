import React, { useState, useEffect } from 'react';
import { getGeminiClient } from '../services/geminiService';
import { User } from '../types';
// Fix: Import Type from @google/genai as it is not exported from types.ts
import { Type } from '@google/genai';

interface MediaHubProps {
  language: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const MediaHub: React.FC<MediaHubProps> = ({ language, user, onUnlock }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'textbooks' | 'news'>('video');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const fetchRecommendations = async (type: string) => {
    setLoading(true);
    setItems([]);
    const ai = getGeminiClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Recommend 4 authentic ${type} for an intermediate ${language} learner. 
        Focus on the user's purpose: ${user.learningPurpose}. 
        Include a title, description, and an 'intensity' level (1-5). Format as JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                intensity: { type: Type.INTEGER },
                tag: { type: Type.STRING }
              },
              required: ["title", "description", "intensity"]
            }
          }
        }
      });
      setItems(JSON.parse(response.text || "[]"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(activeTab);
  }, [activeTab, language]);

  const icons = {
    video: 'fa-play-circle',
    audio: 'fa-microphone-lines',
    textbooks: 'fa-book-bookmark',
    news: 'fa-newspaper'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {['video', 'audio', 'textbooks', 'news'].map((tab: any) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <i className={`fa-solid ${icons[tab as keyof typeof icons]}`}></i>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-dashed border-indigo-100">
           <i className="fa-solid fa-wand-magic-sparkles text-5xl text-indigo-200 animate-pulse mb-6"></i>
           <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">Curating authentic media...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {items.map((item, i) => (
             <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl transform rotate-12 transition-transform group-hover:scale-110">
                   <i className={`fa-solid ${icons[activeTab]}`}></i>
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                      <i className={`fa-solid ${icons[activeTab]} text-xl`}></i>
                   </div>
                   <div className="flex-1">
                      <h3 className="font-black text-slate-800 text-xl tracking-tight leading-none mb-2">{item.title}</h3>
                      <div className="flex gap-1">
                         {[...Array(5)].map((_, idx) => (
                           <div key={idx} className={`w-3 h-1 rounded-full ${idx < item.intensity ? 'bg-rose-500' : 'bg-gray-100'}`}></div>
                         ))}
                      </div>
                   </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 relative z-10">{item.description}</p>
                <div className="flex justify-between items-center relative z-10">
                   <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Launch Resource
                   </button>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.tag || activeTab} Content</span>
                </div>
             </div>
           ))}
        </div>
      )}

      <div className="bg-indigo-950 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl border border-white/10">
               <i className="fa-solid fa-tv"></i>
            </div>
            <div className="flex-1">
               <h3 className="text-3xl font-black tracking-tight mb-2">Immersive Mode</h3>
               <p className="text-indigo-200/60 font-medium leading-relaxed">Toggle Immersive Mode to automatically generate neural-subtitles and logic analysis for any content you launch.</p>
            </div>
            <button className="bg-white text-indigo-950 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl">
               Activate Engine
            </button>
         </div>
      </div>
    </div>
  );
};

export default MediaHub;