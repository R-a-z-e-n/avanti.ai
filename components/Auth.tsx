
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (name: string, email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(name || 'Language Learner', email);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Simulate the Google OAuth popup/handshake delay
    setTimeout(() => {
      onLogin('Google User', 'learner.google@gmail.com');
      setIsGoogleLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 relative p-20 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[200px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-600 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl shadow-rose-500/40">
              <i className="fa-solid fa-stairs"></i>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">Avanti.AI</h1>
          </div>
          <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
            MOVE <br />
            <span className="text-rose-500">AHEAD.</span>
          </h2>
          <p className="text-xl text-slate-100/60 mt-8 max-w-md font-medium leading-relaxed">
            Avanti.AI isn't just an app; it's your linguistic momentum. 
            Experience real-time immersion and professional fluency tailored for your progress.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
           <div>
              <p className="text-5xl font-black text-white">50K+</p>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-2">Active Learners</p>
           </div>
           <div>
              <p className="text-5xl font-black text-white">30+</p>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-2">Target Languages</p>
           </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center text-sm">
            <i className="fa-solid fa-stairs"></i>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">Avanti.AI</h1>
        </div>

        <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl p-10 sm:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Start Journey'}
            </h3>
            <p className="text-slate-100/50 mt-2 text-sm">
              {isLogin ? 'Access your Avanti.AI path to mastery.' : 'Join the elite intermediate community.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
              <button 
                type="button" 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-100/40 hover:text-white'}`}
              >
                LOGIN
              </button>
              <button 
                type="button" 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-rose-600 text-white shadow-xl' : 'text-slate-100/40 hover:text-white'}`}
              >
                SIGN UP
              </button>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fa-solid fa-user text-rose-400 group-focus-within:text-white transition-colors"></i>
                  </div>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-white/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-envelope text-rose-400 group-focus-within:text-white transition-colors"></i>
                </div>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest ml-1">Password</label>
                {isLogin && <button type="button" className="text-[10px] text-rose-400 font-bold hover:text-white uppercase tracking-widest">Forgot?</button>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-lock text-rose-400 group-focus-within:text-white transition-colors"></i>
                </div>
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-white/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <label className="flex items-center cursor-pointer group select-none">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only" 
                  />
                  <div className={`w-5 h-5 rounded-md border border-white/20 transition-all flex items-center justify-center ${rememberMe ? 'bg-rose-600 border-rose-600' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    {rememberMe && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                  </div>
                </div>
                <span className="text-xs text-slate-100/60 ml-3 font-medium group-hover:text-slate-100 transition-colors">Remember me for 30 days</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-rose-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-rose-600/40 hover:bg-rose-500 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 mt-4"
            >
              {isLogin ? 'Enter Avanti.AI' : 'Step Ahead'}
              <i className="fa-solid fa-arrow-right-long"></i>
            </button>

            <div className="relative flex items-center gap-4 py-4">
               <div className="flex-1 h-px bg-white/5"></div>
               <span className="text-[10px] text-slate-100/20 font-bold uppercase tracking-widest">Fast Access</span>
               <div className="flex-1 h-px bg-white/5"></div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button 
                type="button" 
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 text-white text-xs font-black transition-all active:scale-95 disabled:opacity-50"
               >
                  {isGoogleLoading ? (
                    <i className="fa-solid fa-spinner fa-spin text-rose-400"></i>
                  ) : (
                    <i className="fa-brands fa-google text-rose-400"></i>
                  )}
                  {isGoogleLoading ? 'AUTHENTICATING...' : 'CONTINUE WITH GOOGLE'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
