
import React, { useState } from 'react';
import { VocabularyWord } from '../types';

interface FlashcardHubProps {
  vocabulary: VocabularyWord[];
  setVocabulary: React.Dispatch<React.SetStateAction<VocabularyWord[]>>;
}

const FlashcardHub: React.FC<FlashcardHubProps> = ({ vocabulary, setVocabulary }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentWord = vocabulary[currentIndex];

  const handleNext = (rating: number) => {
    // Update mastery logic
    const updatedVocab = [...vocabulary];
    const newMastery = Math.min(100, Math.max(0, currentWord.mastery + (rating - 2) * 20));
    updatedVocab[currentIndex] = { ...currentWord, mastery: newMastery, lastReviewed: new Date().toISOString().split('T')[0] };
    setVocabulary(updatedVocab);

    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center animate-in zoom-in-95">
         <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 text-5xl mb-8 shadow-inner border border-emerald-100">
            <i className="fa-solid fa-circle-check"></i>
         </div>
         <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Daily Vault Cleared!</h2>
         <p className="text-slate-500 text-lg mb-10">You've reviewed all {vocabulary.length} pending items.</p>
         <button 
           onClick={() => { setCurrentIndex(0); setCompleted(false); setIsFlipped(false); }}
           className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all"
         >
            Review Again
         </button>
      </div>
    );
  }

  if (vocabulary.length === 0) {
    return (
       <div className="text-center py-40">
          <i className="fa-solid fa-inbox text-5xl text-gray-200 mb-6"></i>
          <p className="text-gray-400 font-bold uppercase tracking-widest">Your Vault is Empty</p>
          <p className="text-sm text-gray-300 mt-2">Add words from Reading or Conversation to start SRS training.</p>
       </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
         <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">Neural Spaced Repetition</span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Daily Review</h2>
         </div>
         <span className="text-sm font-black text-slate-400">{currentIndex + 1} / {vocabulary.length}</span>
      </div>

      <div className="perspective-1000">
         <div 
           onClick={() => setIsFlipped(!isFlipped)}
           className={`relative h-96 w-full cursor-pointer transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
         >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col items-center justify-center p-12 text-center">
               <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-8">Target Word</span>
               <h3 className="text-5xl font-black text-indigo-900 tracking-tighter mb-4">{currentWord.word}</h3>
               <p className="text-slate-400 text-sm font-medium italic">Click to reveal translation</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden bg-indigo-950 rounded-[3.5rem] shadow-2xl border border-white/10 flex flex-col items-center justify-center p-12 text-center rotate-y-180 text-white">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Translation</span>
               <h3 className="text-5xl font-black tracking-tighter mb-6">{currentWord.translation}</h3>
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-sm">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Usage Context</p>
                  <p className="text-sm italic leading-relaxed">"{currentWord.example}"</p>
               </div>
            </div>
         </div>
      </div>

      <div className={`grid grid-cols-4 gap-4 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
         {[
           { label: 'Forgot', rating: 0, color: 'bg-rose-500' },
           { label: 'Hard', rating: 1, color: 'bg-amber-500' },
           { label: 'Good', rating: 2, color: 'bg-emerald-500' },
           { label: 'Easy', rating: 3, color: 'bg-indigo-600' }
         ].map(btn => (
           <button 
             key={btn.label}
             onClick={() => handleNext(btn.rating)}
             className={`flex flex-col items-center gap-2 p-4 rounded-2xl hover:scale-105 transition-all group ${btn.color} text-white shadow-xl`}
           >
              <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};

export default FlashcardHub;
