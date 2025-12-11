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
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State for Plants Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'plant' | 'remedy'>('all');
  const [plants, setPlants] = useState<Plant[]>(PLANTS_BY_LANG[language] || PLANTS_BY_LANG.es);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isSearchingPlant, setIsSearchingPlant] = useState(false);
  
  // State for Drag/Swipe
  const [dragY, setDragY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To control transition enabling
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  
  // Speech Hook
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  
  // TTS Hook
  const { speak, stop, isSpeaking } = useTextToSpeech();

  // Handle Browser Back Button for Modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
        // If we are navigating back (event fired) and modal is open, close it
        if (selectedPlant) {
            setSelectedPlant(null);
            stop(); // Ensure audio stops
        }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedPlant, stop]);

  // Update plants and selected modal when language or filter changes
  useEffect(() => {
    const currentPlantsDB = PLANTS_BY_LANG[language] || PLANTS_BY_LANG.es;
    
    // Apply filters
    let filtered = currentPlantsDB;
    if (filterType !== 'all') {
        filtered = filtered.filter(p => p.category === filterType);
    }
    setPlants(filtered);
    setSearchQuery('');

    // Update Modal Translation if open and not AI generated
    if (selectedPlant && !selectedPlant.isAiGenerated) {
        const translatedPlant = currentPlantsDB.find(p => p.id === selectedPlant.id);
        if (translatedPlant) {
            setSelectedPlant(translatedPlant);
        }
    }
  }, [language, filterType]); // Depend on language and filterType

  // Update symptom textarea with speech
  useEffect(() => {
    if (transcript && selectedTab === 'consult') {
        setSymptom(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript, selectedTab]);

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
      
      let filtered = currentPlantsDB;

      // 1. Filter by Category
      if (filterType !== 'all') {
          filtered = filtered.filter(p => p.category === filterType);
      }

      // 2. Filter by Search Query
      if (searchQuery.trim()) {
          filtered = filtered.filter(p => 
            p.nameSpanish.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.nameKichwa.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }

      setPlants(filtered);
      
      // Only do AI search if explicit search and no local results (and category is generic or plant)
      if (filtered.length === 0 && searchQuery.trim() && (filterType === 'all' || filterType === 'plant')) {
          setIsSearchingPlant(true);
          try {
              const newPlant = await getPlantDetails(searchQuery);
              // AI results are typically plants
              newPlant.category = 'plant';
              setPlants([newPlant]); 
          } catch (error) {
              console.error("Error finding plant", error);
              setPlants([]); 
          } finally {
              setIsSearchingPlant(false);
          }
      }
  };

  const clearSearch = () => {
      setSearchQuery('');
      // Reset logic
      const currentPlantsDB = PLANTS_BY_LANG[language] || PLANTS_BY_LANG.es;
       if (filterType === 'all') {
          setPlants(currentPlantsDB);
      } else {
          setPlants(currentPlantsDB.filter(p => p.category === filterType));
      }
  };

  const getPreparationSteps = (text: string | undefined): string[] => {
    if (!text) return [];
    if (text.match(/\d+\./)) {
        return text.split(/\d+\.\s+/).filter(step => step.trim().length > 0);
    }
    return [text];
  };

  const handleOpenPlant = (plant: Plant) => {
      // Push history state to allow "Back" button to close modal without leaving view
      window.history.pushState({ view: 'NATURAL', modal: true }, '');
      setDragY(0);
      setSelectedPlant(plant);
  };

  // Touch Handlers for Swipe to Close (Optimized)
  const handleTouchStart = (e: React.TouchEvent) => {
      setIsAnimating(false); // Disable transition for 1:1 finger tracking
      startY.current = e.touches[0].clientY;
      isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging.current) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      
      // Only allow dragging down
      if (diff > 0) {
          setDragY(diff);
      }
  };

  const handleTouchEnd = () => {
      isDragging.current = false;
      setIsAnimating(true); // Re-enable transition for smooth snap/close
      
      // Threshold reduced to 80px for faster closing feeling
      if (dragY > 80) { 
          handleCloseModal();
      } else {
          setDragY(0); // Snap back
      }
  };
  
  const handleCloseModal = () => {
      // Trigger back navigation to close modal via popstate listener
      // This handles both the history stack cleanup and the state update
      window.history.back();
  };
  
  const handlePlayPlantAudio = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!selectedPlant) return;
      
      if (isSpeaking) {
          stop();
      } else {
          // Construct a comprehensive text to read
          const textToRead = `${selectedPlant.nameSpanish}. ${selectedPlant.nameKichwa}. ${selectedPlant.uses}. ${selectedPlant.preparation ? 'Preparación: ' + selectedPlant.preparation : ''}`;
          speak(textToRead, language);
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-transparent relative transition-colors">
       <div className="p-4 sticky top-0 z-10 backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-b border-amber-100 dark:border-slate-800 shadow-sm transition-colors">
          <h2 className="text-xl font-bold text-amber-900 dark:text-amber-500">{t.natural_header}</h2>
          <div className="flex space-x-2 mt-4" role="tablist">
              <button 
                onClick={() => setSelectedTab('plants')}
                role="tab"
                aria-selected={selectedTab === 'plants'}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${selectedTab === 'plants' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-slate-700'}`}
              >
                {t.natural_tab_catalog}
              </button>
              <button 
                onClick={() => setSelectedTab('consult')}
                role="tab"
                aria-selected={selectedTab === 'consult'}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${selectedTab === 'consult' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-slate-700'}`}
              >
                {t.natural_tab_consult}
              </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6 no-scrollbar">
          {selectedTab === 'plants' ? (
              <div className="space-y-4">
                  
                  {/* Category Filters */}
                  <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Filtrar plantas">
                      <button 
                         onClick={() => setFilterType('all')}
                         aria-pressed={filterType === 'all'}
                         className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500 ${filterType === 'all' ? 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700 scale-105 shadow-sm' : 'bg-white border-gray-200 text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'}`}
                      >
                          {t.natural_filter_all}
                      </button>
                      <button 
                         onClick={() => setFilterType('plant')}
                         aria-pressed={filterType === 'plant'}
                         className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500 ${filterType === 'plant' ? 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700 scale-105 shadow-sm' : 'bg-white border-gray-200 text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'}`}
                      >
                          {t.natural_filter_plants}
                      </button>
                      <button 
                         onClick={() => setFilterType('remedy')}
                         aria-pressed={filterType === 'remedy'}
                         className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500 ${filterType === 'remedy' ? 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700 scale-105 shadow-sm' : 'bg-white border-gray-200 text-gray-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'}`}
                      >
                          {t.natural_filter_remedies}
                      </button>
                  </div>

                  <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchPlant()}
                        placeholder={t.natural_search_placeholder}
                        aria-label="Buscar planta medicinal"
                        className="w-full pl-5 pr-10 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-amber-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-shadow shadow-sm"
                      />
                      {searchQuery ? (
                           <button onClick={clearSearch} aria-label="Limpiar búsqueda" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                               </svg>
                           </button>
                      ) : (
                        <button onClick={handleSearchPlant} aria-label="Buscar" className="absolute right-3 top-3.5 text-amber-600 dark:text-amber-500 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                      )}
                  </div>

                  {isSearchingPlant && (
                      <div className="flex justify-center py-8" role="status">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 dark:border-amber-400"></div>
                          <span className="ml-2 text-amber-700 dark:text-amber-400 text-sm font-medium">{t.natural_loading}</span>
                      </div>
                  )}

                  {!isSearchingPlant && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plants.map(plant => (
                            <button 
                                key={plant.id} 
                                onClick={() => handleOpenPlant(plant)}
                                className="flex items-center bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mr-4 transition-colors shadow-inner ${plant.category === 'remedy' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600'}`}>
                                    {plant.category === 'remedy' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                            <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134 0z" />
                                        </svg>
                                    ) : (
                                        <LeafIcon className="w-7 h-7" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">{plant.nameSpanish}</h3>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 italic font-medium mb-1">{plant.nameKichwa}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{plant.uses}</p>
                                </div>
                                <div className="text-amber-400 dark:text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                        {plants.length === 0 && (
                            <div className="col-span-1 sm:col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm py-12 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                                <p>No encontré resultados. <br/>Intenta buscar otra cosa.</p>
                            </div>
                        )}
                    </div>
                  )}
              </div>
          ) : (
              <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl border border-amber-100 dark:border-slate-700 relative shadow-sm">
                      <label htmlFor="symptom-input" className="block text-base font-bold text-amber-900 dark:text-amber-100 mb-3">{t.natural_consult_label}</label>
                      <textarea 
                        id="symptom-input"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        placeholder={isListening ? "Escuchando..." : t.natural_consult_placeholder}
                        className="w-full p-4 rounded-2xl border border-amber-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-700/50 placeholder-gray-400 dark:placeholder-gray-500 shadow-inner"
                        rows={4}
                      />
                      
                      {/* Floating Mic Button */}
                      {hasSupport && (
                        <button
                            onClick={isListening ? stopListening : startListening}
                            aria-label={isListening ? "Detener micrófono" : "Dictar síntomas"}
                            className={`absolute right-8 top-14 p-3 rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isListening 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'bg-white dark:bg-slate-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50'
                            }`}
                        >
                            <MicIcon className="w-5 h-5" />
                        </button>
                      )}

                      <button 
                        onClick={handleConsult}
                        disabled={loading || !symptom}
                        className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                            </div>
                        ) : t.natural_btn_consult}
                      </button>
                  </div>

                  {advice && (
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-amber-100 dark:border-slate-700 animate-slide-up" role="region" aria-label="Consejo recibido">
                         <div className="flex items-center mb-4">
                             <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl mr-3">
                                <LeafIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                             </div>
                             <h3 className="font-bold text-lg text-slate-800 dark:text-white">Consejo de Kawsay</h3>
                         </div>
                         <div className="prose prose-sm prose-amber text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {advice}
                         </div>
                         
                         <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                            <p className="text-xs text-red-600 dark:text-red-300 text-center font-medium">
                                ⚠️ Advertencia: Esta información es educativa. Consulta siempre a un médico profesional.
                            </p>
                         </div>
                      </div>
                  )}
              </div>
          )}
       </div>

       {/* Detailed View Modal */}
       {selectedPlant && createPortal(
           <div 
             className="fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
             onClick={handleCloseModal}
             role="dialog"
             aria-modal="true"
             aria-labelledby="modal-title"
           >
               <div 
                className={`bg-white dark:bg-slate-900 w-full sm:max-w-md h-[100dvh] sm:h-[85vh] sm:rounded-[2.5rem] rounded-none overflow-hidden flex flex-col shadow-2xl ${isAnimating ? 'transition-transform duration-200 ease-out' : ''}`}
                onClick={e => e.stopPropagation()}
                style={{ transform: `translateY(${dragY}px)` }}
               >
                   {/* Swipe Handle & Header */}
                   <div 
                     className="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-700 dark:to-orange-800 p-8 pb-12 pt-[calc(env(safe-area-inset-top)+1.5rem)] relative shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
                     onTouchStart={handleTouchStart}
                     onTouchMove={handleTouchMove}
                     onTouchEnd={handleTouchEnd}
                   >
                       {/* Drag Handle Indicator */}
                       <div className="w-16 h-1.5 bg-white/40 rounded-full mx-auto mb-8 sm:hidden pointer-events-none"></div>

                        <button 
                            onClick={handleCloseModal}
                            aria-label="Cerrar detalles"
                            className="absolute top-[calc(env(safe-area-inset-top)+1.5rem)] right-6 bg-black/20 text-white p-2.5 rounded-full hover:bg-black/30 transition-colors z-50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                               <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                           </svg>
                       </button>

                       {/* Audio Button */}
                       <button
                           onClick={handlePlayPlantAudio}
                           aria-label={isSpeaking ? "Detener lectura" : "Leer información"}
                           className={`absolute top-[calc(env(safe-area-inset-top)+1.5rem)] right-20 p-2.5 rounded-full transition-colors z-50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white ${isSpeaking ? 'bg-white text-red-500 animate-pulse shadow-lg' : 'bg-black/20 text-white hover:bg-black/30'}`}
                       >
                           {isSpeaking ? <StopCircleIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
                       </button>

                       <div className="flex items-start mt-2 pointer-events-none">
                           <div className="bg-white/20 p-4 rounded-[1.5rem] mr-5 backdrop-blur-md border border-white/20 shadow-lg">
                                {selectedPlant.category === 'remedy' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white">
                                        <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                        <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                        <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134 0z" />
                                    </svg>
                                ) : (
                                    <LeafIcon className="w-12 h-12 text-white" />
                                )}
                           </div>
                           <div>
                                <h2 id="modal-title" className="text-3xl font-black text-white leading-none mb-2 drop-shadow-md">{selectedPlant.nameSpanish}</h2>
                                <p className="text-amber-100 font-bold italic text-xl opacity-90">{selectedPlant.nameKichwa}</p>
                           </div>
                       </div>
                   </div>
                   
                   <div className="flex-1 min-h-0 relative -mt-8 bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col transition-colors">
                        <div className="flex-1 overflow-y-auto p-8 pb-20 no-scrollbar">
                            
                            <div className="mb-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="w-10 h-1.5 bg-amber-500 rounded-full"></span>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usos Medicinales</h4>
                                </div>
                                <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                    {selectedPlant.uses}
                                </p>
                            </div>

                            <div className="mb-10 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-800">
                                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-5 uppercase tracking-wide flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                                        <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                                    </svg>
                                    Ingredientes
                                </h4>
                                <div className="space-y-3">
                                    {selectedPlant.ingredients?.map((ing, idx) => (
                                        <div key={idx} className="flex items-center bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 text-emerald-600 dark:text-emerald-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{ing}</span>
                                        </div>
                                    )) || <p className="text-gray-400 italic text-sm">Información no disponible</p>}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-6 uppercase tracking-wide flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                    </svg>
                                    Preparación
                                </h4>
                                <div className="space-y-0 relative pl-2">
                                    <div className="absolute left-[22px] top-4 bottom-8 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-slate-700 dark:via-slate-700"></div>
                                    
                                    {getPreparationSteps(selectedPlant.preparation).map((step, idx) => (
                                        <div key={idx} className="relative pl-12 pb-8 last:pb-0 group">
                                            <div className="absolute left-0 top-0 w-11 h-11 rounded-full bg-amber-50 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                                                <span className="text-sm font-black text-amber-600 dark:text-amber-400">{idx + 1}</span>
                                            </div>
                                            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-1.5 font-medium">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                    {(!selectedPlant.preparation) && <p className="text-gray-400 italic text-sm">Información no disponible</p>}
                                </div>
                            </div>

                            {selectedPlant.contraindications && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-5 rounded-3xl mt-6">
                                    <div className="flex items-start">
                                        <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full mr-3 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400">
                                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-red-800 dark:text-red-300 uppercase mb-1 tracking-wider">Contraindicaciones</h4>
                                            <p className="text-sm text-red-700 dark:text-red-200 font-medium leading-relaxed">{selectedPlant.contraindications}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                   </div>
               </div>
           </div>,
           document.body
       )}
    </div>
  );
};

export default NaturalView;