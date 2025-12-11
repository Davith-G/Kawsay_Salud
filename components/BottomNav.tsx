import React, { useContext } from 'react';
import { ViewName } from '../types';
import { HomeIcon, LeafIcon, ChatIcon, MapIcon, HeartIcon } from './Icons';
import { LanguageContext } from '../App';

interface BottomNavProps {
  currentView: ViewName;
  onChangeView: (view: ViewName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const { t } = useContext(LanguageContext);
  
  const navItems = [
    { id: ViewName.HOME, label: t.nav_home, icon: HomeIcon },
    { id: ViewName.NATURAL, label: t.nav_natural, icon: LeafIcon },
    { id: ViewName.CHAT, label: t.nav_chat, icon: ChatIcon },
    { id: ViewName.MAP, label: t.nav_map, icon: MapIcon },
    { id: ViewName.AUXILIO, label: t.nav_auxilio, icon: HeartIcon },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-2 flex justify-between items-center transition-all duration-300">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center w-full h-full p-2 rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 scale-105 shadow-sm' 
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-0.5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} aria-hidden="true" />
                <span className={`text-[9px] font-bold tracking-tight transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;