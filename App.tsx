
import React, { useState, useEffect } from 'react';
import { AppView, User, VocabularyWord, LearningPurpose, MembershipTier } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GrammarHub from './components/GrammarHub';
import VocabularyVault from './components/VocabularyVault';
import AIConversation from './components/AIConversation';
import CulturalLayer from './components/CulturalLayer';
import Community from './components/Community';
import OfflineMode from './components/OfflineMode';
import ReadingHub from './components/ReadingHub';
import WritingHub from './components/WritingHub';
import ListeningHub from './components/ListeningHub';
import Auth from './components/Auth';
import ProfilePage from './components/ProfilePage';
import SubscriptionStore from './components/SubscriptionStore';
import MediaHub from './components/MediaHub';
import TutorNetwork from './components/TutorNetwork';
import FlashcardHub from './components/FlashcardHub';

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
    <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight">Privacy Policy</h2>
    <div className="prose prose-slate max-w-none space-y-6 text-slate-600 font-medium">
      <p>Last Updated: October 2023</p>
      <p>At Avanti.AI, we are committed to protecting your privacy. This policy outlines how we handle your data.</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">1. Data Collection</h3>
      <p>We collect information you provide directly to us, such as your name, email, and learning preferences. We also collect usage data to improve your learning experience.</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">2. AI Interactions</h3>
      <p>Voice and text interactions with "Carlos" and our AI tutors are processed via the Google Gemini API. This data is used to provide real-time feedback and is subject to Google's privacy standards.</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">3. Local Storage</h3>
      <p>Your vocabulary vault, progress, and settings are stored locally on your device to enable offline access and fast performance.</p>
    </div>
  </div>
);

const TermsOfService = () => (
  <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
    <h2 className="text-4xl font-black text-slate-800 mb-8 tracking-tight">Terms of Service</h2>
    <div className="prose prose-slate max-w-none space-y-6 text-slate-600 font-medium">
      <p>Welcome to Avanti.AI. By using our platform, you agree to the following terms:</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">1. User Conduct</h3>
      <p>You agree to use the service for personal learning purposes and not for any illegal or harmful activities. Harassment of other users in the community is strictly prohibited.</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">2. Memberships & Tokens</h3>
      <p>Membership tiers (Lite, Standard, Pro) provide different levels of access. PolyTokens are non-refundable and hold no monetary value outside of the platform.</p>
      <h3 className="text-xl font-bold text-slate-800 mt-8">3. Content Ownership</h3>
      <p>All AI-generated content is provided for your educational use. You retain ownership of your original writing and compositions submitted for analysis.</p>
    </div>
  </div>
);

const ContactSupport = () => (
  <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
    <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner border border-indigo-100">
      <i className="fa-solid fa-headset text-4xl"></i>
    </div>
    <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Contact Support</h2>
    <p className="text-slate-500 font-medium mb-10 leading-relaxed">Our team is here to help you move ahead. Reach out for technical support or billing inquiries via our dedicated hotline.</p>
    
    <div className="space-y-4">
      <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100">
            <i className="fa-solid fa-phone text-xl"></i>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">24/7 Priority Hotline</p>
            <p className="text-xl font-black text-slate-800">+81 70-4452-6356</p>
          </div>
        </div>
        <a href="tel:+817044526356" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">CALL NOW</a>
      </div>
      
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-8">Response time typically under 5 minutes</p>
    </div>
  </div>
);

const ReferFriend = () => (
  <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-600 mx-auto mb-8 shadow-inner border border-rose-100">
      <i className="fa-solid fa-gift text-4xl"></i>
    </div>
    <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Refer & Earn Tokens</h2>
    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
      Share the gift of language mastery. Refer Avanti.AI to a friend and get <span className="text-rose-600 font-black">3 PolyTokens</span> for free when they create an account!
    </p>
    
    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 mb-8">
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Your Unique Referral Link</p>
       <div className="flex flex-col sm:flex-row gap-3">
          <input 
            readOnly 
            value="https://avanti.ai/join?ref=user_momentum_2024" 
            className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-mono text-slate-600 outline-none shadow-inner"
          />
          <button onClick={() => alert('Referral link copied to clipboard!')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">COPY LINK</button>
       </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
       <button className="flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-[#25D366] text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg">
          <i className="fa-brands fa-whatsapp text-xl"></i> WhatsApp
       </button>
       <button className="flex items-center justify-center gap-3 p-5 rounded-[2rem] bg-[#1DA1F2] text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg">
          <i className="fa-brands fa-twitter text-xl"></i> Twitter
       </button>
    </div>
    
    <div className="mt-12 p-6 bg-rose-50 rounded-2xl border border-rose-100">
       <p className="text-xs text-rose-800 font-bold">Rewards are processed instantly upon friend verification. No limit on referrals!</p>
    </div>
  </div>
);

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999] overflow-hidden">
    <div className="relative">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-rose-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-rose-500/40 animate-[spin_2s_ease-in-out_infinite] perspective-1000">
        <i className="fa-solid fa-stairs text-white text-5xl"></i>
      </div>
      <div className="absolute inset-0 border-4 border-rose-400/20 rounded-full scale-150 animate-ping duration-1000"></div>
    </div>
    <div className="mt-12 text-center animate-pulse">
      <h1 className="text-white text-4xl font-black tracking-tighter">Avanti.AI</h1>
      <p className="text-rose-300/60 text-xs font-bold uppercase tracking-[0.4em] mt-2">Moving You Forward</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>(AppView.AUTH);
  const [viewParams, setViewParams] = useState<any>(null);
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([
    { id: '1', word: 'Aprovechar', translation: 'To take advantage of', mastery: 65, lastReviewed: '2023-10-25', example: 'Debes aprovechar esta oportunidad.', source: 'Reading' },
    { id: '2', word: 'Ojalá', translation: 'Hopefully / I wish', mastery: 80, lastReviewed: '2023-10-26', example: 'Ojalá llueva pronto.', source: 'Speaking' },
    { id: '3', word: 'Desarrollar', translation: 'To develop', mastery: 40, lastReviewed: '2023-10-24', example: 'Queremos desarrollar una nueva app.', source: 'Writing' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => { setShowSplash(false); }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('poly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setActiveView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser: User = {
      id: 'user_123',
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      tokens: 15,
      streak: 1,
      level: 1,
      xp: 0,
      unlockedLanguages: ['Spanish'],
      unlockedContent: [],
      membershipTier: 'STANDARD',
      aiMinutesUsed: 0,
      dailyMinutesLimit: 10
    };
    setUser(newUser);
    localStorage.setItem('poly_user', JSON.stringify(newUser));
    setActiveView(AppView.DASHBOARD);
  };

  const updateTier = (tier: MembershipTier) => {
    if (!user) return;
    const updatedUser: User = { 
      ...user, 
      membershipTier: tier,
      dailyMinutesLimit: tier === 'PRO' ? 9999 : 10,
      tokens: tier === 'PRO' ? user.tokens + 1000 : user.tokens
    };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('poly_user');
    setActiveView(AppView.AUTH);
  };

  const changeView = (view: AppView, params?: any) => {
    if (user?.membershipTier === 'LITE' && [AppView.SPEAKING, AppView.TUTORS, AppView.WRITING].includes(view)) {
      setActiveView(AppView.STORE);
      return;
    }
    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePurpose = (purpose: LearningPurpose) => {
    if (!user) return;
    const updatedUser = { ...user, learningPurpose: purpose };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
  };

  const addVocab = (word: Omit<VocabularyWord, 'id' | 'mastery' | 'lastReviewed'>) => {
    const newWord: VocabularyWord = {
      ...word,
      id: Math.random().toString(36).substr(2, 9),
      mastery: 0,
      lastReviewed: new Date().toISOString().split('T')[0]
    };
    setVocabulary(prev => [...prev, newWord]);
  };

  const unlockLanguage = (lang: string) => {
    if (!user) return;
    const cost = 100;
    if (user.membershipTier !== 'PRO' && user.tokens < cost) {
       setActiveView(AppView.STORE);
       return;
    }
    const updatedUser = { 
      ...user, 
      tokens: user.membershipTier === 'PRO' ? user.tokens : user.tokens - cost,
      unlockedLanguages: [...user.unlockedLanguages, lang]
    };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
  };

  const unlockContent = (contentId: string, cost: number) => {
    if (!user) return false;
    if (user.membershipTier === 'PRO') {
       if (!user.unlockedContent.includes(contentId)) {
          const updatedUser = { ...user, unlockedContent: [...user.unlockedContent, contentId] };
          setUser(updatedUser);
          localStorage.setItem('poly_user', JSON.stringify(updatedUser));
       }
       return true;
    }
    if (user.tokens < cost || user.unlockedContent.includes(contentId)) return false;
    const updatedUser = {
      ...user,
      tokens: user.tokens - cost,
      unlockedContent: [...user.unlockedContent, contentId]
    };
    setUser(updatedUser);
    localStorage.setItem('poly_user', JSON.stringify(updatedUser));
    return true;
  };

  if (showSplash) return <SplashScreen />;
  if (activeView === AppView.AUTH) return <Auth onLogin={handleLogin} />;

  const renderView = () => {
    if (!user) return <Auth onLogin={handleLogin} />;
    
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} vocabulary={vocabulary} language={targetLanguage} setPurpose={updatePurpose} setActiveView={changeView} />;
      case AppView.MEDIA:
        return <MediaHub language={targetLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.TUTORS:
        return <TutorNetwork language={targetLanguage} nativeLanguage={nativeLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.FLASHCARDS:
        return <FlashcardHub vocabulary={vocabulary} setVocabulary={setVocabulary} />;
      case AppView.GRAMMAR:
        return <GrammarHub language={targetLanguage} nativeLanguage={nativeLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.VOCABULARY:
        return <VocabularyVault vocabulary={vocabulary} setVocabulary={setVocabulary} user={user} onUnlock={unlockContent} />;
      case AppView.READING:
        return <ReadingHub language={targetLanguage} nativeLanguage={nativeLanguage} onSaveVocab={addVocab} user={user} onUnlock={unlockContent} />;
      case AppView.WRITING:
        return <WritingHub language={targetLanguage} nativeLanguage={nativeLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.SPEAKING:
        return (
          <AIConversation 
            targetLanguage={targetLanguage} 
            setTargetLanguage={setTargetLanguage}
            nativeLanguage={nativeLanguage} 
            setNativeLanguage={setNativeLanguage}
            user={user} 
            onUnlock={unlockContent}
            onSaveVocab={addVocab}
            initialMode={viewParams?.mode}
          />
        );
      case AppView.LISTENING:
        return <ListeningHub language={targetLanguage} user={user} onUnlock={unlockContent} />;
      case AppView.CULTURE:
        return <CulturalLayer language={targetLanguage} isPro={user.membershipTier === 'PRO'} />;
      case AppView.COMMUNITY:
        return <Community language={targetLanguage} />;
      case AppView.OFFLINE:
        return <OfflineMode enabled={offlineEnabled} setEnabled={setOfflineEnabled} language={targetLanguage} />;
      case AppView.PROFILE:
        return <ProfilePage user={user} onLogout={handleLogout} onUnlock={unlockLanguage} onTierChange={updateTier} />;
      case AppView.STORE:
        return <SubscriptionStore user={user} onTierPurchase={updateTier} onPurchase={(amount) => {
          const updatedUser = { ...user, tokens: user.tokens + amount };
          setUser(updatedUser);
          localStorage.setItem('poly_user', JSON.stringify(updatedUser));
        }} />;
      case AppView.PRIVACY:
        return <PrivacyPolicy />;
      case AppView.TERMS:
        return <TermsOfService />;
      case AppView.CONTACT:
        return <ContactSupport />;
      case AppView.REFER:
        return <ReferFriend />;
      default:
        return <Dashboard user={user} vocabulary={vocabulary} language={targetLanguage} setPurpose={updatePurpose} setActiveView={changeView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden items-stretch">
      <Sidebar 
        activeView={activeView} 
        setActiveView={changeView} 
        nativeLanguage={nativeLanguage}
        setNativeLanguage={setNativeLanguage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        user={user}
      />
      <main className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 md:p-8 flex-grow">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {activeView.charAt(0) + activeView.slice(1).toLowerCase().replace('_', ' ')}
                </h1>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${user?.membershipTier === 'PRO' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                  {user?.membershipTier} MEMBER
                </span>
              </div>
              <p className="text-slate-500 font-medium">Mastering {targetLanguage} with Avanti.AI</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="font-bold text-rose-600 flex items-center gap-2">
                    <i className="fa-solid fa-fire animate-pulse"></i> {user?.streak} Day Streak
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-gray-400 font-bold uppercase">{user?.tokens} PolyTokens</span>
                     <button onClick={() => setActiveView(AppView.STORE)} className="bg-amber-100 text-amber-600 w-5 h-5 rounded-md flex items-center justify-center hover:bg-amber-200 transition-colors">
                        <i className="fa-solid fa-plus text-[8px]"></i>
                     </button>
                  </div>
               </div>
               <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group" onClick={() => setActiveView(AppView.PROFILE)}>
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-rose-600 transition-colors">{user?.name}</p>
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Level {user?.level}</p>
                 </div>
                 <img src={user?.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl bg-rose-50 border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
               </div>
            </div>
          </header>
          <div className="max-w-6xl mx-auto pb-12">
            {renderView()}
          </div>
        </div>
        
        <footer className="bg-white border-t border-gray-100 py-12 px-8">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center text-xl shadow-lg cursor-pointer" onClick={() => changeView(AppView.DASHBOARD)}>
                       <i className="fa-solid fa-stairs"></i>
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900 cursor-pointer" onClick={() => changeView(AppView.DASHBOARD)}>Avanti.AI</span>
                 </div>
                 <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLScsqbCPtmmbpEwgDZ19dqto3QzNJlthemf4e2m7DiCOXEYhDg/viewform?usp=sharing&ouid=111656557488244709132" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-indigo-600 hover:text-indigo-500 transition-all flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100"
                 >
                    <i className="fa-solid fa-comment-dots"></i>
                    Help us to improve this website by filling up this form
                 </a>
              </div>
              <div className="flex flex-col items-center md:items-end gap-6">
                 <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <button onClick={() => changeView(AppView.REFER)} className="text-rose-500 hover:text-rose-600 font-black animate-pulse">Refer a Friend & Earn 🎁</button>
                    <button onClick={() => changeView(AppView.PRIVACY)} className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
                    <button onClick={() => changeView(AppView.TERMS)} className="hover:text-indigo-600 transition-colors">Terms of Service</button>
                    <button onClick={() => changeView(AppView.CONTACT)} className="hover:text-indigo-600 transition-colors">Contact Support</button>
                 </div>
                 <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    © 2024 PolyStepAI Inc. All Rights Reserved.
                 </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
