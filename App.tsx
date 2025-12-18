import React, { useState, useEffect, createContext, useContext } from 'react';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import MapView from './components/MapView';
import NaturalView from './components/NaturalView';
import AuxilioView from './components/AuxilioView';
import { ViewName, Language } from './types';
import { TRANSLATIONS } from './constants';
import { SettingsIcon, SunIcon, MoonIcon, SystemIcon, LogoIcon } from './components/Icons';
import { Geolocation } from "@capacitor/geolocation";
import { VoiceRecorder } from 'capacitor-voice-recorder';


// --- Theme Context & Logic ---
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
});

// --- Language Context & Logic ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['es'];
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  t: TRANSLATIONS['es'],
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as ThemeMode) || 'system';
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
        setResolvedTheme('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
        setResolvedTheme('light');
      } else {
        // System
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          root.classList.add('dark');
          setResolvedTheme('dark');
        } else {
          root.classList.remove('dark');
          setResolvedTheme('light');
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'es';
    }
    return 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

// --- Settings Modal Component ---
const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { language, setLanguage, t } = useContext(LanguageContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white/95 dark:bg-slate-800/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-pop-in border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings_title}</h2>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500 dark:text-gray-400">
               <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
             </svg>
           </button>
        </div>

        <div className="space-y-6">
           {/* Language Selector */}
           <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t.settings_language}</label>
              <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setLanguage('es')}
                    className={`p-3 rounded-2xl border-2 transition-all font-bold text-sm ${language === 'es' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    {t.lang_es}
                 </button>
                 <button 
                    onClick={() => setLanguage('qu')}
                    className={`p-3 rounded-2xl border-2 transition-all font-bold text-sm ${language === 'qu' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    {t.lang_qu}
                 </button>
                 <button 
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-2xl border-2 transition-all font-bold text-sm ${language === 'en' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    {t.lang_en}
                 </button>
              </div>
           </div>

           {/* Appearance Selector */}
           <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t.settings_appearance}</label>
              <div className="grid grid-cols-3 gap-3">
                 <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    <SunIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Claro</span>
                 </button>
                 <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    <MoonIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Oscuro</span>
                 </button>
                 <button 
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400'}`}
                 >
                    <SystemIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Auto</span>
                 </button>
              </div>
           </div>

           <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
               <p className="text-center text-xs text-gray-400">Versión 1.3.1 - Kawsay Salud</p>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Mini Tutorial (Floating Tooltip) ---
const MiniTutorial: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    const { language } = useContext(LanguageContext);
    const [step, setStep] = useState(0);

    const steps = [
        {
            text: language === 'qu' ? "Kaypi Hampi Yurakuna." : "Aquí encuentras plantas y remedios.",
            positionClass: "left-[30%]", 
            arrowClass: "left-1/2 -translate-x-1/2"
        },
        {
            text: language === 'qu' ? "Kaypi Yachakwan rimana." : "Aquí chatea con la IA Yachak.",
            positionClass: "left-1/2 -translate-x-1/2", 
            arrowClass: "left-1/2 -translate-x-1/2"
        },
        {
            text: language === 'qu' ? "Kaypi Hampi Wasikuna." : "Aquí busca hospitales y farmacias.",
            positionClass: "left-[70%]", 
            arrowClass: "left-1/2 -translate-x-1/2"
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    };

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            <div className="absolute inset-0 bg-black/30 pointer-events-auto" onClick={onFinish}></div>
            <div 
                key={step}
                className={`absolute bottom-24 ${currentStep.positionClass} -translate-x-1/2 transition-all duration-300 w-48 pointer-events-auto`}
            >
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-2 border-emerald-500 relative animate-pop-in">
                    <div className={`absolute -bottom-3 ${currentStep.arrowClass} w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-emerald-500`}></div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white text-center mb-3 leading-snug">
                        {currentStep.text}
                    </p>
                    <div className="flex justify-between items-center">
                        <button onClick={onFinish} className="text-xs text-gray-400 font-medium px-2 py-1">
                            {language === 'en' ? 'Skip' : 'Saltar'}
                        </button>
                        <button 
                            onClick={handleNext} 
                            className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-700"
                        >
                             {step === steps.length - 1 ? 'OK' : '➜'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Language Selection Modal (Initial Load) ---
const LanguageSelectionModal: React.FC<{ onSelect: (lang: Language) => void }> = ({ onSelect }) => {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-emerald-900/95 backdrop-blur-md animate-fade-in text-white">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center animate-pop-in border border-white/10">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-4 rounded-3xl mb-6 shadow-lg shadow-emerald-500/30">
                    <LogoIcon className="w-16 h-16 text-white" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">Kawsay Salud</h1>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">
                    Selecciona tu idioma para comenzar<br/>
                    <span className="italic text-emerald-600 dark:text-emerald-400">Akllay shimi kallarinkapak</span>
                </p>

                <div className="space-y-4 w-full">
                    <button 
                        onClick={() => onSelect('es')}
                        className="w-full flex items-center p-4 rounded-3xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group active:scale-[0.98]"
                    >
                        <span className="text-3xl mr-4 shadow-sm rounded-full bg-white dark:bg-slate-800 p-1">🇪🇨</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Español</h3>
                            <p className="text-xs text-gray-400">Idioma principal</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => onSelect('qu')}
                        className="w-full flex items-center p-4 rounded-3xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group active:scale-[0.98]"
                    >
                        <span className="text-3xl mr-4 shadow-sm rounded-full bg-white dark:bg-slate-800 p-1">🏔️</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Kichwa</h3>
                            <p className="text-xs text-gray-400">Runa Shimi</p>
                        </div>
                    </button>

                     <button 
                        onClick={() => onSelect('en')}
                        className="w-full flex items-center p-4 rounded-3xl border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group active:scale-[0.98]"
                    >
                        <span className="text-3xl mr-4 shadow-sm rounded-full bg-white dark:bg-slate-800 p-1">🇺🇸</span>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">English</h3>
                            <p className="text-xs text-gray-400">Language</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Main App Component ---
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewName>(ViewName.HOME);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { setLanguage } = useContext(LanguageContext);
  
  // Track loaded views for Keep-Alive performance (Lazy load first time, then keep)
  const [loadedViews, setLoadedViews] = useState<Set<ViewName>>(new Set([ViewName.HOME]));

  useEffect(() => {
    // Add current view to loaded views set
    setLoadedViews(prev => {
        const newSet = new Set(prev);
        newSet.add(currentView);
        return newSet;
    });
  }, [currentView]);

  useEffect(() => {
    const solicitarPermisos = async () => {
      try {
        const status = await Geolocation.requestPermissions();
        console.log("Estado del permiso:", status);
        await solicitarPermisoMicrofono();
      } catch (error) {
        console.error("Error solicitando permisos:", error);
      }
    };
    solicitarPermisos();
  }, []);

  async function solicitarPermisoMicrofono() {
    try {
      const permisoEstado = await VoiceRecorder.hasAudioRecordingPermission();
      if (!permisoEstado.value) {
        const permiso = await VoiceRecorder.requestAudioRecordingPermission();
        return permiso.value;
      }
      return true;
    } catch (error) {
      console.error("Error solicitando permiso de micrófono:", error);
      return false;
    }
  }

  // Logic to show Language Modal on first visit
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(() => {
      const stored = localStorage.getItem('language');
      return !stored; 
  });

  // Logic to show Tutorial Modal
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  useEffect(() => {
    if (!showLanguageModal) {
        const tutorialDone = localStorage.getItem('tutorialCompleted');
        if (!tutorialDone) {
            setShowTutorial(true);
        }
    }
  }, [showLanguageModal]);

  const handleInitialLanguageSelect = (lang: Language) => {
      setLanguage(lang);
      setShowLanguageModal(false);
  };

  const handleTutorialFinish = () => {
      localStorage.setItem('tutorialCompleted', 'true');
      setShowTutorial(false);
  };

  // --- HISTORY API (BACK BUTTON) ---
  useEffect(() => {
    window.history.replaceState({ view: ViewName.HOME }, '');
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        if (event.state && event.state.view) {
            setCurrentView(event.state.view);
        } else {
            setCurrentView(ViewName.HOME);
        }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); 

  const handleChangeView = (newView: ViewName) => {
      if (newView === currentView) return;
      window.history.pushState({ view: newView }, '');
      setCurrentView(newView);
  };

  return (
    <div 
        className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100 font-sans"
    >
      {/* Initial Language Modal */}
      {showLanguageModal && <LanguageSelectionModal onSelect={handleInitialLanguageSelect} />}

      {/* Mini Tutorial */}
      {!showLanguageModal && showTutorial && <MiniTutorial onFinish={handleTutorialFinish} />}

      {/* Global Top Bar - Hidden on Chat AND Map views */}
      <div className={`flex-shrink-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 p-4 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] shadow-lg shadow-emerald-500/10 rounded-b-[2rem] relative z-20 transition-all duration-300 ${currentView === ViewName.CHAT || currentView === ViewName.MAP ? 'hidden' : 'block'}`}>
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-3">
               <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm">
                  <LogoIcon className="w-8 h-8" />
               </div>
               <div>
                 <h1 className="font-bold text-lg leading-none tracking-tight drop-shadow-sm">Kawsay Salud</h1>
                 <p className="text-xs text-emerald-50 font-medium leading-tight opacity-90">Comunidad y Bienestar</p>
               </div>
            </div>

            <div className="flex items-center gap-2">
                <a 
                    href="tel:911" 
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 transition-all border border-red-400 shadow-lg shadow-red-500/20 active:scale-95"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                   </svg>
                   <span className="font-bold text-sm">911</span>
                </a>
                
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors shadow-sm active:scale-95"
                >
                    <SettingsIcon className="w-5 h-5 text-white" />
                </button>
            </div>
          </div>
        </div>

      {/* Main Content Area - Keep Alive Logic */}
      <main className={`flex-1 relative overflow-hidden bg-transparent ${currentView !== ViewName.CHAT && currentView !== ViewName.MAP ? '-mt-6 pt-6 z-10' : ''}`}>
         {/* Home */}
         <div className={currentView === ViewName.HOME ? 'h-full w-full block' : 'hidden'}>
            <HomeView onChangeView={handleChangeView} />
         </div>

         {/* Natural */}
         {loadedViews.has(ViewName.NATURAL) && (
            <div className={currentView === ViewName.NATURAL ? 'h-full w-full block' : 'hidden'}>
               <NaturalView />
            </div>
         )}

         {/* Chat */}
         {loadedViews.has(ViewName.CHAT) && (
            <div className={currentView === ViewName.CHAT ? 'h-full w-full block' : 'hidden'}>
               <ChatView />
            </div>
         )}

         {/* Map - Always keep alive once loaded */}
         {loadedViews.has(ViewName.MAP) && (
             <div className={currentView === ViewName.MAP ? 'h-full w-full block' : 'hidden'}>
                <MapView onOpenSettings={() => setIsSettingsOpen(true)} />
             </div>
         )}

         {/* Auxilio */}
         {loadedViews.has(ViewName.AUXILIO) && (
            <div className={currentView === ViewName.AUXILIO ? 'h-full w-full block' : 'hidden'}>
               <AuxilioView />
            </div>
         )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onChangeView={handleChangeView} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
  );
};

export default App;