
import React from 'react';
import { User, MembershipTier } from '../types';

interface StoreProps {
  user: User;
  onPurchase: (tokens: number) => void;
  onTierPurchase: (tier: MembershipTier) => void;
}

const SubscriptionStore: React.FC<StoreProps> = ({ user, onPurchase, onTierPurchase }) => {
  const tokenPacks = [
    { name: 'Starter Sack', amount: 100, price: '$4.99', icon: 'fa-bag-shopping', color: 'bg-indigo-500' },
    { name: 'Language Chest', amount: 500, price: '$19.99', icon: 'fa-box-open', color: 'bg-amber-500', popular: true },
    { name: 'Fluent Fortune', amount: 2000, price: '$59.99', icon: 'fa-vault', color: 'bg-purple-600' }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-4">The Path to Fluency</h2>
        <p className="text-gray-500 text-lg">Choose the investment level that matches your ambition.</p>
      </div>

      {/* Main Tier Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tier 1: LITE / FREE */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mb-8">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Lite / Free</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Basic drills and community access for casual learners.</p>
            <ul className="space-y-4 mb-10 text-sm font-medium text-slate-600">
              <li className="flex items-center gap-3 opacity-50"><i className="fa-solid fa-circle-xmark text-rose-400"></i> No AI Conversation</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Vocabulary Vault</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Community Feed</li>
              <li className="flex items-center gap-3 opacity-50"><i className="fa-solid fa-circle-xmark text-rose-400"></i> Standard Tutors</li>
            </ul>
          </div>
          <button 
            onClick={() => onTierPurchase('LITE')}
            disabled={user.membershipTier === 'LITE'}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.membershipTier === 'LITE' ? 'bg-gray-100 text-gray-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            {user.membershipTier === 'LITE' ? 'Current Tier' : 'Switch to Lite'}
          </button>
        </div>

        {/* Tier 2: STANDARD / TOKEN-BASED */}
        <div className="bg-white rounded-[3.5rem] p-10 shadow-xl border-2 border-indigo-100 ring-8 ring-indigo-50 flex flex-col justify-between relative transform scale-105 z-10">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-bl-3xl shadow-xl">
             Value Pick
          </div>
          <div>
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center text-3xl mb-8 shadow-xl shadow-indigo-100">
              <i className="fa-solid fa-coins"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Standard</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Pay-per-use credits for full control over your study focus.</p>
            <ul className="space-y-4 mb-10 text-sm font-medium text-slate-600">
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> 10 min/day AI Chat</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Unlock any Pack w/ Tokens</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Specialized AI Tutors</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-emerald-400"></i> Offline Access Pack</li>
            </ul>
          </div>
          <button 
            onClick={() => onTierPurchase('STANDARD')}
            disabled={user.membershipTier === 'STANDARD'}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.membershipTier === 'STANDARD' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}
          >
            {user.membershipTier === 'STANDARD' ? 'Current Tier' : 'Upgrade to Standard'}
          </button>
        </div>

        {/* Tier 3: PRO / SUBSCRIPTION */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl text-white flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center text-3xl mb-8 shadow-xl shadow-amber-900/40">
              <i className="fa-solid fa-crown"></i>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">PolyStep PRO</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Unlimited everything. The ultimate path to mastery.</p>
            <ul className="space-y-4 mb-10 text-sm font-medium text-slate-300">
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-amber-400"></i> Unlimited AI Conversation</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-amber-400"></i> All Specialized Tutors Free</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-amber-400"></i> Gemini 3 Pro reasoning</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-amber-400"></i> Google Web Grounding</li>
            </ul>
          </div>
          <div className="text-center mb-6">
             <span className="text-3xl font-black tracking-tight">$12.99</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2">/ month</span>
          </div>
          <button 
            onClick={() => onTierPurchase('PRO')}
            disabled={user.membershipTier === 'PRO'}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${user.membershipTier === 'PRO' ? 'bg-slate-800 text-slate-600' : 'bg-amber-500 text-white hover:bg-amber-400 shadow-xl shadow-amber-900/40'}`}
          >
            {user.membershipTier === 'PRO' ? 'Current Tier' : 'Unlock Pro Access'}
          </button>
        </div>
      </div>

      {/* Credit Packs Section */}
      <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100">
         <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black text-slate-800 mb-2">PolyToken Packs</h3>
               <p className="text-slate-500 font-medium">Buy credits as you need them. Never expires.</p>
            </div>
            <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 flex items-center gap-4">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Your Balance</span>
               <span className="text-xl font-black text-indigo-600">{user.tokens} 🪙</span>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tokenPacks.map(pack => (
               <div key={pack.name} className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 text-center hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl ${pack.color} text-white flex items-center justify-center text-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                     <i className={`fa-solid ${pack.icon}`}></i>
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-1">{pack.name}</h4>
                  <p className="text-3xl font-black text-indigo-600 mb-6">{pack.amount} 🪙</p>
                  <button 
                    onClick={() => onPurchase(pack.amount)}
                    className="w-full bg-white border border-gray-200 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                  >
                    Buy for {pack.price}
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SubscriptionStore;
