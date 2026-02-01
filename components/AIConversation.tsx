
import React, { useState, useRef, useEffect } from 'react';
import { Modality, LiveServerMessage } from '@google/genai';
import { getGeminiClient, decode, encode, decodeAudioData, translateText, visualizeCulture } from '../services/geminiService';
import { User } from '../types';

interface AIConversationProps {
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  nativeLanguage: string;
  setNativeLanguage: (lang: string) => void;
  user: User;
  onSaveVocab: (word: {word: string, translation: string, example: string, source: string}) => void;
  onUnlock: (id: string, cost: number) => boolean;
  initialMode?: 'Chat' | 'Verbalization';
}

const AIConversation: React.FC<AIConversationProps> = ({ 
  targetLanguage, 
  setTargetLanguage, 
  nativeLanguage, 
  setNativeLanguage, 
  user,
  onSaveVocab,
  onUnlock,
  initialMode
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Chat' | 'Verbalization'>(initialMode || 'Chat');
  const [bridgeText, setBridgeText] = useState("");
  const [isBridging, setIsBridging] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [liveUserText, setLiveUserText] = useState("");
  const [liveAiText, setLiveAiText] = useState("");
  const [speechRate, setSpeechRate] = useState(1.0);
  const [history, setHistory] = useState<{original: string, translation: string, speaker: 'user' | 'ai'}[]>([]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const languages = [
    'English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French', 
    'Modern Standard Arabic', 'Bengali', 'Portuguese', 'Russian', 'Urdu', 
    'Indonesian/Malay', 'Japanese', 'German', 'Nigerian Pidgin', 'Marathi', 
    'Telugu', 'Turkish', 'Tamil', 'Yue Chinese (Cantonese)', 'Vietnamese', 
    'Tagalog (Filipino)', 'Persian', 'Italian', 'Korean', 'Swahili'
  ];

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (mode === 'Verbalization' && !sceneImage && !isGeneratingScene) {
      handleGenerateScene();
    }
  }, [mode, targetLanguage]);

  const handleLogicBridge = async () => {
    if (!bridgeText.trim()) return;
    setIsBridging(true);
    try {
      const result = await translateText(bridgeText, nativeLanguage, targetLanguage);
      setLiveUserText(`Carlos suggests: ${result}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBridging(false);
    }
  };

  const handleGenerateScene = async () => {
    setIsGeneratingScene(true);
    try {
      const prompt = `A detailed cultural scene from a country where ${targetLanguage} is spoken, representing the context of ${user.learningPurpose}. High quality.`;
      const img = await visualizeCulture(prompt);
      setSceneImage(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  const startSession = async () => {
    if (isActive) return;
    setIsConnecting(true);
    
    try {
      const ai = getGeminiClient();
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setAudioLevel(Math.sqrt(sum / inputData.length));

              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              const pcmData = encode(new Uint8Array(int16.buffer));
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: { data: pcmData, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setLiveUserText(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setLiveAiText(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              const finalUser = liveUserText;
              const finalAi = liveAiText;
              if (finalUser) {
                translateText(finalUser, targetLanguage, nativeLanguage).then(trans => {
                   setHistory(h => [{original: finalUser, translation: trans, speaker: 'user'}, ...h]);
                });
              }
              if (finalAi) {
                translateText(finalAi, targetLanguage, nativeLanguage).then(trans => {
                   setHistory(h => [{original: finalAi, translation: trans, speaker: 'ai'}, ...h]);
                });
              }
              setLiveUserText("");
              setLiveAiText("");
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              
              // Apply Speech Rate via playbackRate
              source.playbackRate.value = speechRate;
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += (audioBuffer.duration / speechRate);
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini Live error:', e);
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are Carlos, a friendly language partner. You are talking to an intermediate learner. Target language: ${targetLanguage}. Native language: ${nativeLanguage}. Current Learning Focus/Purpose: ${user.learningPurpose}. Mode: ${mode === 'Verbalization' ? 'Discuss the cultural image visible on the screen. Help the user describe what they see.' : 'Casual conversation.'} Always encourage the user and provide helpful corrections in ${nativeLanguage} if they get stuck.`
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close());
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
    setAudioLevel(0);
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-700">
      <div className="w-full bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
                <button onClick={() => setMode('Chat')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'Chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-500'}`}>Conversation</button>
                <button onClick={() => setMode('Verbalization')} className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'Verbalization' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-500'}`}>Verbalization</button>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-2xl border border-gray-100">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest min-w-[60px]">Speed: {speechRate.toFixed(1)}x</span>
               <input 
                 type="range" 
                 min="0.5" 
                 max="2.0" 
                 step="0.1" 
                 value={speechRate}
                 onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                 className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${showTranslation ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            >
              <i className={`fa-solid ${showTranslation ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              {showTranslation ? 'Translation On' : 'Translation Off'}
            </button>
            <div className="flex gap-2">
                <select value={nativeLanguage} disabled={isActive} onChange={(e) => setNativeLanguage(e.target.value)} className="bg-gray-50 text-[11px] font-black uppercase tracking-widest p-2.5 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">{languages.map(l => <option key={l} value={l}>{l}</option>)}</select>
                <select value={targetLanguage} disabled={isActive} onChange={(e) => setTargetLanguage(e.target.value)} className="bg-indigo-50 text-[11px] font-black uppercase tracking-widest p-2.5 rounded-xl border border-indigo-100 text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">{user.unlockedLanguages.map(l => <option key={l} value={l}>{l}</option>)}</select>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
        <div className="flex-1 space-y-6">
           {mode === 'Verbalization' && (
             <div className="bg-white p-6 rounded-[3.5rem] shadow-sm border border-gray-100 min-h-[450px] flex items-center justify-center relative overflow-hidden group transition-all duration-500 hover:shadow-2xl">
                {isGeneratingScene ? (
                  <div className="flex flex-col items-center gap-5 animate-pulse">
                    <i className="fa-solid fa-wand-magic-sparkles text-5xl text-emerald-400"></i>
                    <p className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.3em]">Synthesizing Scene...</p>
                  </div>
                ) : sceneImage ? (
                  <img src={sceneImage} alt="Verbalization Task" className="w-full h-full object-cover rounded-[3rem] animate-in zoom-in-95 duration-700" />
                ) : (
                  <p className="text-gray-300 font-black uppercase text-[11px] tracking-[0.4em]">Context Scene Not Loaded</p>
                )}
                <button onClick={handleGenerateScene} className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md text-indigo-600 px-6 py-3 rounded-2xl text-xs font-black shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                   <i className="fa-solid fa-rotate mr-2"></i> REGENERATE
                </button>
             </div>
           )}

           <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-gray-100 flex flex-col min-h-[550px] relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-end space-y-6">
                {history.slice(0, 4).reverse().map((turn, i) => (
                  <div key={i} className={`flex flex-col ${turn.speaker === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[85%] p-5 rounded-[2rem] border-2 ${turn.speaker === 'user' ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-100' : 'bg-white border-gray-100 text-slate-800 shadow-sm'}`}>
                      <p className="text-base font-bold leading-relaxed">{turn.original}</p>
                      {showTranslation && turn.translation && (
                        <p className={`mt-3 pt-3 border-t text-[11px] font-bold italic opacity-70 ${turn.speaker === 'user' ? 'border-white/20' : 'border-gray-50 text-indigo-600'}`}>{turn.translation}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {(liveUserText || liveAiText) && (
                  <div className={`flex flex-col ${liveUserText ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-[2rem] border-2 border-dashed ${liveUserText ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'}`}>
                       <p className="text-base font-black italic tracking-tight">"{liveUserText || liveAiText}"</p>
                    </div>
                  </div>
                )}
             </div>

             {!isActive && history.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                   <div className="w-28 h-28 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-400 text-5xl mb-8 shadow-inner border border-indigo-100">
                      <i className="fa-solid fa-waveform"></i>
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">AI Partner Ready</h3>
                   <p className="text-sm text-gray-400 mt-3 max-w-xs mx-auto leading-relaxed font-semibold">
                     Select <strong>Verbalization</strong> to describe scenes, or stay in <strong>Conversation</strong> for free speech.
                   </p>
                </div>
             )}
           </div>

           <button 
             onClick={isActive ? stopSession : startSession}
             disabled={isConnecting}
             className={`w-full py-7 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-5 transition-all active:scale-95 ${isActive ? 'bg-rose-600 text-white shadow-rose-900/40 hover:bg-rose-500' : 'bg-indigo-600 text-white shadow-indigo-900/40 hover:bg-indigo-500'}`}
           >
             {isConnecting ? <i className="fa-solid fa-spinner fa-spin"></i> : (isActive ? <i className="fa-solid fa-phone-slash"></i> : <i className="fa-solid fa-microphone"></i>)}
             {isConnecting ? 'INITIATING CARLOS...' : (isActive ? 'END SESSION' : 'ESTABLISH LINK WITH CARLOS')}
           </button>
        </div>

        <div className="w-full lg:w-80 space-y-6">
           <div className="bg-indigo-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl transform rotate-12 transition-transform group-hover:scale-110">
                 <i className="fa-solid fa-bridge"></i>
              </div>
              <h4 className="font-black text-xl mb-3 relative z-10 flex items-center gap-3">
                 <i className="fa-solid fa-link text-indigo-400"></i> Logic Bridge
              </h4>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-8 relative z-10">Neural assistance for gaps</p>
              <textarea 
                value={bridgeText}
                onChange={(e) => setBridgeText(e.target.value)}
                placeholder={`Type in ${nativeLanguage}...`}
                className="w-full bg-black/30 border border-white/10 rounded-[1.5rem] p-5 text-sm font-semibold placeholder-indigo-400 outline-none focus:ring-4 focus:ring-indigo-500/30 h-32 mb-5 resize-none relative z-10 transition-all"
              />
              <button 
                onClick={handleLogicBridge}
                disabled={isBridging || !bridgeText}
                className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-50 transition-all disabled:opacity-50 relative z-10 shadow-xl"
              >
                {isBridging ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt mr-2 text-indigo-600"></i>}
                ANALYZE BRIDGE
              </button>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Signal Amplitude</h4>
              <div className="space-y-8">
                 <div className="flex gap-5 items-center">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-inner">
                       <i className="fa-solid fa-volume-high text-sm"></i>
                    </div>
                    <div className="flex-1">
                       <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-75 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${Math.min(audioLevel * 600, 100)}%` }}></div>
                       </div>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TRANSCRIBING</span>
                    <div className={`w-3.5 h-3.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-200'}`}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversation;
