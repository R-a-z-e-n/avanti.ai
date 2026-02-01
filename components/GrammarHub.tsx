
import React, { useState, useEffect } from 'react';
import { generateGrammarExplanation, researchGrammarUsage, generateGrammarExercise, explainGrammarDeeply } from '../services/geminiService';
import { GrammarNote, User } from '../types';

interface GrammarHubProps {
  language: string;
  nativeLanguage: string;
  user: User;
  onUnlock: (id: string, cost: number) => boolean;
}

const GrammarHub: React.FC<GrammarHubProps> = ({ language, nativeLanguage, user, onUnlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'theory' | 'deep' | 'practice'>('theory');
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [researching, setResearching] = useState(false);
  const [explanation, setExplanation] = useState<GrammarNote | null>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [realUsage, setRealUsage] = useState<any>(null);
  const [exercise, setExercise] = useState<any>(null);
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showExerciseResult, setShowExerciseResult] = useState(false);
  const [mastery, setMastery] = useState<Record<string, number>>({});

  const grammarTopics = [
    { id: 'subjunctive', name: 'Subjunctive Mood', free: true, cost: 0, category: 'Advanced' },
    { id: 'participles', name: 'Past Participles', free: false, cost: 25, category: 'Intermediate' },
    { id: 'pronouns', name: 'Direct Object Pronouns', free: false, cost: 15, category: 'Beginner+' },
    { id: 'conditional', name: 'Conditional Tense', free: false, cost: 20, category: 'Intermediate' },
    { id: 'irregular', name: 'Irregular Verbs', free: true, cost: 0, category: 'Beginner+' },
    { id: 'connectors', name: 'Logical Connectors', free: false, cost: 30, category: 'Professional' },
    { id: 'passive', name: 'Passive Voice', free: false, cost: 20, category: 'Intermediate' },
    { id: 'relative', name: 'Relative Pronouns', free: true, cost: 0, category: 'Intermediate' }
  ];

  const filteredTopics = grammarTopics.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = async (t: string) => {
    const selectedTopic = grammarTopics.find(item => item.name === t);
    if (!selectedTopic) return;

    if (!selectedTopic.free && !user.unlockedContent.includes(`grammar_${selectedTopic.id}`)) {
       alert("Please unlock this topic first!");
       return;
    }

    setLoading(true);
    setTopic(t);
    setExplanation(null);
    setDeepAnalysis(null);
    setRealUsage(null);
    setExercise(null);
    setActiveTab('theory');
    setSelectedOption(null);
    setUserInput('');
    setShowExerciseResult(false);
    
    try {
      const result = await generateGrammarExplanation(t, language);
      setExplanation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!topic) return;
    setDeepLoading(true);
    setActiveTab('deep');
    try {
      const result = await explainGrammarDeeply(topic, language);
      setDeepAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setDeepLoading(false);
    }
  };

  const handleFetchExercise = async () => {
    if (!topic) return;
    setExerciseLoading(true);
    setSelectedOption(null);
    setUserInput('');
    setShowExerciseResult(false);
    try {
      const result = await generateGrammarExercise(topic, language);
      setExercise(result);
    } catch (error) {
      console.error(error);
    } finally {
      setExerciseLoading(false);
    }
  };

  const checkExercise = () => {
    if (!exercise) return;
    setShowExerciseResult(true);
    
    let isCorrect = false;
    if (exercise.type === 'MCQ') {
      isCorrect = selectedOption === exercise.correctIndex;
    } else {
      isCorrect = userInput.trim().toLowerCase() === exercise.correctAnswer.toLowerCase();
    }

    if (isCorrect) {
      setMastery(prev => ({
        ...prev,
        [topic]: Math.min((prev[topic] || 0) + 10, 100)
      }));
    }
  };

  const handleUnlock = (topicId: string, cost: number) => {
     if (onUnlock(`grammar_${topicId}`, cost)) {
        alert("Topic unlocked! You can now explore its secrets.");
     } else {
        alert("Not enough PolyTokens!");
     }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight flex items-center gap-2">
            <i className="fa-solid fa-map text-indigo-500"></i>
            Grammar Roadmap
          </h3>
          <div className="relative mb-6">
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
             <input 
              type="text" 
              placeholder="Filter topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
             />
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredTopics.map(t => {
              const isUnlocked = t.free || user.unlockedContent.includes(`grammar_${t.id}`);
              const isActive = topic === t.name;
              const topicMastery = mastery[t.name] || 0;
              
              return (
                <div key={t.id} className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 ${isUnlocked ? (isActive ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100 shadow-lg' : 'border-indigo-50 bg-indigo-50/50 hover:bg-indigo-100') + ' cursor-pointer' : 'border-gray-50 bg-gray-50 grayscale opacity-80'}`}
                  onClick={() => isUnlocked && handleGenerate(t.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                        <i className={`fa-solid ${isUnlocked ? (isActive ? 'fa-book-open' : 'fa-spell-check') : 'fa-lock'}`}></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.category} • {t.free ? 'Free' : `${t.cost} 🪙`}</p>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUnlock(t.id, t.cost); }}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                  {isUnlocked && (
                    <div className="w-full">
                       <div className="flex justify-between text-[8px] font-black text-indigo-400 uppercase mb-1">
                          <span>Mastery</span>
                          <span>{topicMastery}%</span>
                       </div>
                       <div className="w-full h-1 bg-white/50 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${topicMastery}%` }}></div>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredTopics.length === 0 && <p className="text-center text-gray-400 py-10 text-xs">No topics found.</p>}
          </div>
        </div>

        {explanation && (
          <div className="bg-gradient-to-br from-indigo-950 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl transform rotate-12">
               <i className="fa-solid fa-microscope"></i>
            </div>
            <h4 className="font-bold mb-4 relative z-10 flex items-center gap-2 text-sm uppercase tracking-widest">
              <i className="fa-solid fa-magnifying-glass-location text-indigo-400"></i>
              Real-World Evidence
            </h4>
            <p className="text-xs text-indigo-200 mb-6 leading-relaxed">Carlos will crawl the web to find authentic examples of this rule in current news, literature, and social contexts.</p>
            <button 
              onClick={() => { setResearching(true); researchGrammarUsage(topic, language).then(res => { setRealUsage(res); setResearching(false); }); }}
              disabled={researching}
              className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50"
            >
              {researching ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-search mr-2"></i>}
              Research Live Usage
            </button>
            {realUsage && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
                 <div className="bg-white/10 p-4 rounded-xl text-[11px] leading-relaxed italic border border-white/5 text-indigo-100 whitespace-pre-wrap">
                   {realUsage.text}
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Verified Sources:</p>
                    {realUsage.sources.map((s: any, i: number) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-indigo-700/50 hover:bg-indigo-600 border border-white/5 transition-colors group">
                        <i className="fa-solid fa-link text-[10px] text-indigo-400"></i>
                        <span className="text-[10px] font-medium truncate max-w-[180px]">{s.title}</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[8px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </a>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-6">
        {loading ? (
          <div className="bg-white h-full min-h-[500px] rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-10 text-center animate-pulse">
             <i className="fa-solid fa-wand-magic-sparkles text-5xl text-indigo-200 mb-6"></i>
             <p className="text-indigo-400 font-black uppercase tracking-widest">Carlos is synthesizing the linguistic rules...</p>
          </div>
        ) : explanation ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-right-4">
            <div className="p-4 bg-gray-50 flex border-b border-gray-100 flex-wrap gap-2">
              <button 
                onClick={() => setActiveTab('theory')}
                className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'theory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              >
                Theory
              </button>
              <button 
                onClick={handleDeepAnalysis}
                className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'deep' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              >
                Deep Analysis (PRO)
              </button>
              <button 
                onClick={() => { setActiveTab('practice'); if (!exercise) handleFetchExercise(); }}
                className={`flex-1 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-indigo-400'}`}
              >
                Practice
              </button>
            </div>

            <div className="p-8 lg:p-12">
              {activeTab === 'theory' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-4xl font-black text-indigo-950 tracking-tighter mb-8">{explanation.topic}</h2>
                  <div className="prose prose-indigo max-w-none mb-12">
                    <p className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">{explanation.explanation}</p>
                  </div>
                  <div className="space-y-4 pt-8 border-t border-gray-50">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <i className="fa-solid fa-vial-circle-check text-indigo-500"></i>
                      Standard Examples
                    </h4>
                    {explanation.examples.map((ex, i) => (
                      <div key={i} className="bg-indigo-50/30 p-6 rounded-2xl border-l-4 border-indigo-500 italic text-slate-800 font-semibold text-lg hover:bg-indigo-50 transition-colors">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'deep' && (
                <div className="animate-in fade-in duration-500">
                  {deepLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <i className="fa-solid fa-brain-circuit fa-beat text-5xl text-indigo-200 mb-6"></i>
                       <p className="text-indigo-400 font-black uppercase tracking-widest">Activating Reasoning Engine...</p>
                       <p className="text-xs text-gray-400 mt-2">Gemini 3 Pro is analyzing etymology and complex linguistic patterns.</p>
                    </div>
                  ) : deepAnalysis ? (
                    <div className="space-y-10">
                       <div>
                          <h3 className="text-2xl font-black text-indigo-900 mb-4 tracking-tight">Advanced Reasoning</h3>
                          <p className="text-gray-700 text-base leading-relaxed font-medium bg-indigo-50/20 p-6 rounded-[2rem] border border-indigo-100/30">
                            {deepAnalysis.deepAnalysis}
                          </p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100">
                             <h4 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-4">Linguistic Nuances</h4>
                             <ul className="space-y-4">
                               {deepAnalysis.nuances.map((n: string, i: number) => (
                                 <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                                    <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
                                    {n}
                                 </li>
                               ))}
                             </ul>
                          </div>
                          <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100">
                             <h4 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Professional Tips</h4>
                             <ul className="space-y-4">
                               {deepAnalysis.proTips.map((t: string, i: number) => (
                                 <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                                    <i className="fa-solid fa-star text-emerald-500 mt-1"></i>
                                    {t}
                                 </li>
                               ))}
                             </ul>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                       <i className="fa-solid fa-triangle-exclamation text-rose-300 text-5xl mb-4"></i>
                       <p className="text-gray-400 font-bold">Analysis failed to generate. Please try again.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'practice' && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800">Topic Challenge</h3>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mastery Gain</p>
                          <p className="text-xs font-bold text-slate-600">+10 XP</p>
                       </div>
                       <button onClick={handleFetchExercise} className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition-colors">
                        <i className="fa-solid fa-rotate"></i>
                      </button>
                    </div>
                  </div>
                  
                  {exerciseLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <i className="fa-solid fa-vial-circle-check fa-bounce text-4xl text-indigo-200 mb-4"></i>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Carlos is drafting a new drill...</p>
                    </div>
                  ) : exercise ? (
                    <div className="space-y-8">
                      <div className="bg-indigo-950 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl transform rotate-12 group-hover:scale-110 transition-transform">
                          <i className={`fa-solid ${exercise.type === 'MCQ' ? 'fa-list-check' : exercise.type === 'SCRAMBLE' ? 'fa-shuffle' : 'fa-triangle-exclamation'}`}></i>
                        </div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                          {exercise.type === 'MCQ' ? 'Complete the sentence:' : 
                           exercise.type === 'SCRAMBLE' ? 'Reorder to form a valid sentence:' : 
                           'Identify the error or provide the correction:'}
                        </p>
                        <p className="text-2xl font-medium leading-relaxed italic">"{exercise.sentence}"</p>
                      </div>

                      {exercise.type === 'MCQ' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {exercise.options.map((option: string, i: number) => {
                            const isCorrect = i === exercise.correctIndex;
                            const isSelected = selectedOption === i;
                            let btnClass = "bg-white border-2 border-gray-100 text-slate-700 hover:border-indigo-200";
                            
                            if (showExerciseResult) {
                              if (isCorrect) btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 ring-4 ring-emerald-100";
                              else if (isSelected) btnClass = "bg-rose-50 border-rose-500 text-rose-800 ring-4 ring-rose-100 opacity-60";
                              else btnClass = "bg-white border-gray-100 text-gray-400 opacity-40";
                            } else if (isSelected) {
                              btnClass = "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-lg";
                            }

                            return (
                              <button 
                                key={i}
                                disabled={showExerciseResult}
                                onClick={() => setSelectedOption(i)}
                                className={`p-6 rounded-[1.5rem] text-left transition-all duration-300 flex items-center gap-4 ${btnClass}`}
                              >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isSelected || (showExerciseResult && isCorrect) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="font-bold text-base">{option}</span>
                                {showExerciseResult && isCorrect && <i className="fa-solid fa-circle-check ml-auto text-emerald-500"></i>}
                                {showExerciseResult && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark ml-auto text-rose-500"></i>}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <input 
                              type="text" 
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              disabled={showExerciseResult}
                              placeholder="Type your answer here..."
                              className={`w-full bg-white border-2 rounded-[1.5rem] p-6 text-lg outline-none transition-all ${showExerciseResult ? (userInput.trim().toLowerCase() === exercise.correctAnswer.toLowerCase() ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50') : 'border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'}`}
                           />
                           {showExerciseResult && userInput.trim().toLowerCase() !== exercise.correctAnswer.toLowerCase() && (
                              <p className="text-emerald-600 font-bold text-sm px-2">Correct Answer: <span className="italic">{exercise.correctAnswer}</span></p>
                           )}
                        </div>
                      )}

                      {!showExerciseResult ? (
                        <button 
                          onClick={checkExercise}
                          disabled={(exercise.type === 'MCQ' && selectedOption === null) || (exercise.type !== 'MCQ' && !userInput.trim())}
                          className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-30"
                        >
                          Verify Mastery
                        </button>
                      ) : (
                        <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 animate-in slide-in-from-top-4">
                          <h4 className="font-black text-indigo-900 mb-2 uppercase tracking-tighter flex items-center gap-2">
                            <i className="fa-solid fa-lightbulb"></i> Carlos's Linguistic Note:
                          </h4>
                          <p className="text-indigo-800 text-sm leading-relaxed font-medium mb-6 italic whitespace-pre-wrap">"{exercise.explanation}"</p>
                          <button 
                            onClick={handleFetchExercise}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                          >
                            Next Challenge <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <i className="fa-solid fa-graduation-cap text-5xl text-gray-100 mb-4"></i>
                      <p className="text-sm font-bold text-gray-400">Carlos is generating your first drill...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 h-full min-h-[500px] rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-10 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 text-4xl mb-6 shadow-inner animate-in zoom-in-90">
               <i className="fa-solid fa-book-open-reader"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Theory → Practice → Mastery</h3>
            <p className="text-sm mt-2 max-w-xs mx-auto leading-relaxed font-medium text-slate-500">
              Select a grammar focus from the roadmap. Explore standard rules, unlock <strong>Deep Analysis</strong> for complex logic, and verify your skills in practice mode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarHub;
