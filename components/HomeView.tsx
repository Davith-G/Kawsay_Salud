
import React, { useContext } from 'react';
import { ViewName } from '../types';
import { LeafIcon } from './Icons';
import { LanguageContext } from '../App';

interface HomeViewProps {
  onChangeView: (view: ViewName) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onChangeView }) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar p-4 pb-24 space-y-5">
      
      {/* Greeting Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden flex-shrink-0 mt-2 transition-colors">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-transparent dark:from-amber-900/30 rounded-full -mr-10 -mt-10 opacity-60 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100 to-transparent dark:from-emerald-900/30 rounded-full -ml-10 -mb-10 opacity-60 blur-2xl"></div>
        
        <div className="relative z-10">
            <div className="flex items-center mb-2">
                <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">Kawsay Salud</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">
              {t.greeting} <br/>
              <span className="text-xl font-normal text-slate-600 dark:text-slate-400">{t.greeting_sub}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
              {t.welcome_message}
            </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4 flex-shrink-0">
        <button 
          onClick={() => onChangeView(ViewName.MAP)}
          className="group relative overflow-hidden rounded-3xl shadow-sm h-40 transition-all active:scale-[0.98] border border-transparent dark:border-slate-700"
        >
           {/* Background Image with Overlay */}
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-600/40 dark:from-slate-900/95 dark:to-blue-900/60"></div>
           
           <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-2 group-hover:bg-white/30 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">{t.quick_map_title}</h3>
              <p className="text-blue-100 text-xs mt-1">{t.quick_map_desc}</p>
           </div>
        </button>

        <button 
          onClick={() => onChangeView(ViewName.CHAT)}
          className="group relative overflow-hidden rounded-3xl shadow-sm h-40 transition-all active:scale-[0.98] border border-transparent dark:border-slate-700"
        >
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-purple-600/40 dark:from-slate-900/95 dark:to-purple-900/60"></div>
           
           <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-2 group-hover:bg-white/30 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">{t.quick_chat_title}</h3>
              <p className="text-purple-100 text-xs mt-1">{t.quick_chat_desc}</p>
           </div>
        </button>
      </div>

      {/* Featured Section: Ancestral Wisdom */}
      <button
        onClick={() => onChangeView(ViewName.NATURAL)} 
        className="w-full text-left relative rounded-3xl p-6 overflow-hidden shadow-sm group transition-all active:scale-[0.99] flex-shrink-0 border border-transparent dark:border-slate-700"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1470165511868-4d6684d9948e?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 via-amber-900/70 to-transparent dark:from-black/90 dark:via-black/70"></div>

        <div className="relative z-10 flex flex-row items-center justify-between">
            <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                    <LeafIcon className="w-5 h-5 text-amber-300" />
                    <span className="text-amber-200 font-bold text-xs uppercase tracking-wider">{t.natural_title}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t.natural_subtitle}</h2>
                <p className="text-amber-50/90 text-sm mb-4 leading-relaxed max-w-[90%]">
                   {t.natural_desc}
                </p>
                <span className="inline-flex items-center text-white font-bold text-sm border-b-2 border-amber-400 pb-0.5">
                  {t.natural_btn}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </span>
            </div>
        </div>
      </button>

      {/* Emergency Banner */}
       <button 
        onClick={() => onChangeView(ViewName.AUXILIO)}
        className="w-full relative rounded-3xl p-5 overflow-hidden shadow-sm flex items-center justify-between group transition-all active:scale-[0.99] flex-shrink-0 bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30"
       >
         <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-red-50 dark:bg-red-900/10 rounded-l-full opacity-50"></div>
        
         <div className="relative z-10 flex items-center space-x-4">
             <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-2xl text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
             </div>
             <div className="text-left">
                 <h2 className="text-lg font-bold text-slate-800 dark:text-white">{t.emergency_title}</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-xs">{t.emergency_desc}</p>
             </div>
         </div>
         
         <div className="relative z-10 bg-red-600 dark:bg-red-700 text-white p-2 rounded-full shadow-lg group-hover:bg-red-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
         </div>
       </button>
       
       <div className="h-4"></div>
    </div>
  );
};

export default HomeView;
