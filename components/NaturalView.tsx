import React, { useState, useContext, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PLANTS_BY_LANG } from '../constants';
import { getTraditionalAdvice, getPlantDetails } from '../services/geminiService';
import { Plant } from '../types';
import { LeafIcon, MicIcon, SpeakerWaveIcon, StopCircleIcon } from './Icons';
import { LanguageContext } from '../App';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const NaturalView: React.FC = () => {
  const { t, language } = useContext(LanguageContext);
  const [selectedTab, setSelectedTab] = useState<'plants' | 'consult'>('plants');
  const [symptom, setSymptom] = useState('');
  
  // ESTADO CLAVE: Guarda el texto que ya estaba escrito antes de empezar a hablar
  const [baseSymptom, setBaseSymptom] = useState('');
  
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'plant' | 'remedy'>('all');
  const [plants, setPlants] = useState<Plant[]>(PLANTS_BY_LANG[language] || PLANTS_BY_LANG.es);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  
  const [dragY, setDragY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); 
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  const { speak, stop, isSpeaking } = useTextToSpeech();

  // LIMPIEZA: Al salir de la pestaña, apaga el micrófono por completo
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // CORRECCIÓN DE DUPLICIDAD: Solo suma el dictado actual a la base guardada
  useEffect(() => {
    if (isListening && transcript && selectedTab === 'consult') {
        const space = baseSymptom && !baseSymptom.endsWith(' ') ? ' ' : '';
        // Reemplaza el texto dinámicamente: base + lo nuevo que estás diciendo
        setSymptom(baseSymptom + space + transcript);
    }
  }, [transcript, isListening, baseSymptom, selectedTab]);

  // Manejo del botón del micrófono
  const handleToggleMic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      // Punto de guardado: lo que el usuario ya escribió manualmente o en dictados anteriores
      setBaseSymptom(symptom);
      startListening();
    }
  };

  const handleConsult = async () => {
    if (!symptom.trim()) return;
    setLoading(true);
    setAdvice(null);
    try {
      const result = await getTraditionalAdvice(symptom);
      setAdvice(result);
    } catch (e) {
      setAdvice("Lo siento, no pude consultar en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPlant = async () => {
      const currentPlantsDB = PLANTS_BY_LANG[language] || PLANTS_BY_LANG.es;
      let filtered = currentPlantsDB.filter(p => 
        p.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.nameKichwa.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPlants(filtered);
  };

  const handleOpenPlant = (plant: Plant) => {
      window.history.pushState({ modal: true }, '');
      setDragY(0);
      setSelectedPlant(plant);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      setIsAnimating(false);
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) setDragY(diff);
  };

  const handleTouchEnd = () => {
      isDragging.current = false;
      setIsAnimating(true); 
      if (dragY > 80) window.history.back();
      else setDragY(0); 
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-transparent relative transition-colors">
       {/* Header */}
       <div className="p-4 sticky top-0 z-10 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-b border-amber-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-500">{t.natural_header}</h2>
          <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => setSelectedTab('plants')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${selectedTab === 'plants' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-slate-700'}`}
              >
                {t.natural_tab_catalog}
              </button>
              <button 
                onClick={() => setSelectedTab('consult')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${selectedTab === 'consult' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-slate-700'}`}
              >
                {t.natural_tab_consult}
              </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 no-scrollbar">
          {selectedTab === 'plants' ? (
              <div className="space-y-4">
                  <div className="relative">
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchPlant()} placeholder={t.natural_search_placeholder} className="w-full pl-5 pr-10 py-3.5 rounded-2xl border bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"/>
                      <button onClick={handleSearchPlant} className="absolute right-3 top-3.5 text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                      </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {plants.map(plant => (
                        <button key={plant.id} onClick={() => handleOpenPlant(plant)} className="flex items-center bg-white dark:bg-slate-800 border border-white/40 dark:border-slate-700 rounded-2xl p-4 shadow-sm active:scale-[0.98]">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                                <LeafIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{plant.nameSpanish}</h3>
                                <p className="text-xs text-amber-600 italic">{plant.nameKichwa}</p>
                            </div>
                        </button>
                    ))}
                  </div>
              </div>
          ) : (
              <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-amber-100 dark:border-slate-700 relative shadow-sm">
                      <label className="block text-base font-bold text-amber-900 dark:text-amber-100 mb-3">{t.natural_consult_label}</label>
                      <textarea 
                        value={symptom} 
                        onChange={(e) => {
                            setSymptom(e.target.value);
                            setBaseSymptom(e.target.value); // Actualizar base si el usuario escribe manual
                        }} 
                        placeholder={isListening ? "Escuchando..." : t.natural_consult_placeholder} 
                        className="w-full p-4 rounded-2xl border bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                        rows={4}
                      />
                      
                      {/* Floating Mic Button - SÓLIDO Y FUNCIONAL */}
                      {hasSupport && (
                        <button
                            type="button"
                            onClick={handleToggleMic}
                            className={`absolute right-8 top-14 p-3 rounded-full shadow-lg z-50 transition-all ${
                                isListening ? 'bg-red-600 text-white' : 'bg-white text-amber-600'
                            }`}
                        >
                            <MicIcon className="w-5 h-5" />
                        </button>
                      )}

                      <button onClick={handleConsult} disabled={loading || !symptom} className="mt-4 w-full bg-amber-600 text-white font-bold py-4 rounded-2xl">
                        {loading ? "Consultando..." : t.natural_btn_consult}
                      </button>
                  </div>
                  {advice && (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-amber-100 dark:border-slate-700">
                         <div className="flex items-center mb-4"><div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl mr-3"><LeafIcon className="w-6 h-6 text-amber-600" /></div><h3 className="font-bold text-lg dark:text-white">Consejo de Kawsay</h3></div>
                         <div className="prose prose-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{advice}</div>
                      </div>
                  )}
              </div>
          )}
       </div>

       {/* Modal de Detalles Simplificado */}
       {selectedPlant && createPortal(
           <div className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={() => window.history.back()}>
               <div className={`bg-white dark:bg-slate-900 w-full h-[85vh] rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-2xl ${isAnimating ? 'transition-transform duration-200' : ''}`} onClick={e => e.stopPropagation()} style={{ transform: `translateY(${dragY}px)` }}>
                   <div className="bg-amber-500 p-8 relative shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                       <div className="w-16 h-1 bg-white/40 rounded-full mx-auto mb-6"></div>
                       <button onClick={() => window.history.back()} className="absolute top-6 right-6 bg-black/20 text-white p-2 rounded-full">✕</button>
                       <div className="flex items-center">
                           <div className="bg-white/20 p-4 rounded-2xl mr-4"><LeafIcon className="w-10 h-10 text-white" /></div>
                           <div><h2 className="text-2xl font-black text-white">{selectedPlant.nameSpanish}</h2><p className="text-amber-100 italic">{selectedPlant.nameKichwa}</p></div>
                       </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900 rounded-t-[2rem] -mt-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Usos Medicinales</h4>
                        <p className="text-lg text-slate-700 dark:text-white leading-relaxed mb-8">{selectedPlant.uses}</p>
                   </div>
               </div>
           </div>,
           document.body
       )}
    </div>
  );
};

export default NaturalView;