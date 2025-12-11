import React, { useState, useContext } from 'react';
import { EMERGENCY_CONTACTS, GUIDES_BY_LANG } from '../constants';
import { PhoneIcon, SpeakerWaveIcon, StopCircleIcon } from './Icons';
import { LanguageContext } from '../App';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const AuxilioView: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  
  // Audio hook
  const { speak, stop, isSpeaking, hasSupport } = useTextToSpeech();
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const toggleGuide = (id: string) => {
    // Stop audio if closing or switching
    if (activeAudioId && isSpeaking) {
        stop();
        setActiveAudioId(null);
    }
    setOpenGuide(openGuide === id ? null : id);
  };

  const handlePlayAudio = (e: React.MouseEvent, id: string, text: string) => {
      e.stopPropagation(); // Prevent closing accordion
      if (isSpeaking && activeAudioId === id) {
          stop();
          setActiveAudioId(null);
      } else {
          setActiveAudioId(id);
          speak(text, language);
      }
  };

  const currentGuides = GUIDES_BY_LANG[language] || GUIDES_BY_LANG.es;

  return (
    <div className="p-4 pb-24 h-[calc(100vh-60px)] overflow-y-auto no-scrollbar bg-gray-50 dark:bg-slate-950 transition-colors">
      
      {/* Header */}
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.auxilio_title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t.auxilio_subtitle}</p>
      </div>

      {/* Emergency Contacts - Prominent Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
            {EMERGENCY_CONTACTS.slice(0, 2).map((contact, idx) => (
                <a 
                    key={idx} 
                    href={`tel:${contact.number}`}
                    aria-label={`Llamar a ${contact.name} al ${contact.number}`}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-transform active:scale-95 border focus:outline-none focus:ring-4 focus:ring-red-300 ${
                        contact.type === 'general' 
                        ? 'bg-red-600 dark:bg-red-700 text-white border-red-700 dark:border-red-800' 
                        : 'bg-blue-600 dark:bg-blue-700 text-white border-blue-700 dark:border-blue-800'
                    }`}
                >
                    <div className="mb-2" aria-hidden="true">
                        <PhoneIcon className="w-8 h-8" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter mb-1">{contact.number}</span>
                    <span className="text-xs font-medium opacity-90 uppercase tracking-wide">{contact.name}</span>
                </a>
            ))}
            <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-center transition-colors">
                <div>
                    <span className="block text-lg font-bold text-slate-800 dark:text-white">{EMERGENCY_CONTACTS[2].name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Promotor Comunitario</span>
                </div>
                <a 
                    href={`tel:${EMERGENCY_CONTACTS[2].number}`} 
                    aria-label="Llamar al Centro de Salud"
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold flex items-center hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <PhoneIcon className="w-4 h-4 mr-2" aria-hidden="true" />
                    {EMERGENCY_CONTACTS[2].number}
                </a>
            </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-1 rounded mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
        </span>
        {t.auxilio_guides}
      </h3>

      {/* Visual Guides List */}
      <div className="space-y-3">
        {currentGuides.map((guide) => (
          <div key={guide.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden group transition-colors">
            <button 
              onClick={() => toggleGuide(guide.id)}
              aria-expanded={openGuide === guide.id}
              aria-controls={`guide-content-${guide.id}`}
              className="w-full flex items-center text-left p-4 relative focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset rounded-2xl"
            >
              {/* Circular Icon - No Image */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-2xl transition-colors ${openGuide === guide.id ? 'bg-red-100 dark:bg-red-900/50' : 'bg-red-50 dark:bg-red-900/20'}`} aria-hidden="true">
                  {guide.icon}
              </div>
              
              <div className="flex-1 pl-4 pr-2 flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-white text-base">{guide.title}</span>
                  
                  <div className={`text-gray-400 transition-transform duration-300 ${openGuide === guide.id ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
              </div>
            </button>
            
            {/* Expandable Content */}
            <div 
                id={`guide-content-${guide.id}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openGuide === guide.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                role="region"
            >
                <div className="p-4 pt-0 bg-white dark:bg-slate-800">
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-100 dark:border-slate-600 relative">
                        {hasSupport && (
                             <button
                                onClick={(e) => handlePlayAudio(e, guide.id, guide.title + ". " + guide.content)}
                                aria-label={isSpeaking && activeAudioId === guide.id ? "Detener audio" : "Escuchar guía"}
                                className={`absolute right-3 top-3 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isSpeaking && activeAudioId === guide.id ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-white dark:bg-slate-600 text-slate-500 hover:text-emerald-600 shadow-sm'}`}
                             >
                                 {isSpeaking && activeAudioId === guide.id ? (
                                     <StopCircleIcon className="w-6 h-6" />
                                 ) : (
                                     <SpeakerWaveIcon className="w-6 h-6" />
                                 )}
                             </button>
                        )}

                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Pasos a seguir:</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium pr-10">
                            {guide.content}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8 mb-4">
        Esta información es una guía básica. Llame al 911 ante cualquier duda grave.
      </p>
    </div>
  );
};

export default AuxilioView;