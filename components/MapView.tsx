
import React, { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { findNearbyPlaces } from '../services/geminiService';
import { PlaceResult, SavedPlace } from '../types';
import { StarIcon, StarSolidIcon, SettingsIcon, LogoIcon, MicIcon, SpeakerWaveIcon, StopCircleIcon } from './Icons';
import { LanguageContext } from '../App';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  onOpenSettings: () => void;
}

const MapView: React.FC<MapViewProps> = ({ onOpenSettings }) => {
  const { t, language } = useContext(LanguageContext);
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: -1.6635, lng: -78.6546 });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // State for selected place (Bottom Sheet)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  
  // Speech Hook (Recognition)
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  
  // TTS Hook (Speaker)
  const { speak, stop, isSpeaking } = useTextToSpeech();

  // Stop audio when selecting a new place or closing
  useEffect(() => {
     if (isSpeaking) stop();
  }, [selectedPlace]);

  // Update input on speech result
  useEffect(() => {
    if (transcript) {
        setQuery(transcript);
    }
  }, [transcript]);

  const [favorites, setFavorites] = useState<SavedPlace[]>(() => {
    try {
        const saved = localStorage.getItem('mapFavorites');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const placesLayerRef = useRef<any>(null); // Ref to hold the layer group for place markers

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mapFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (place: PlaceResult) => {
    if (!place) return;
    const exists = favorites.find(f => f.title === place.name);
    if (exists) {
        setFavorites(prev => prev.filter(f => f.title !== place.name));
    } else {
        const newFavorite: SavedPlace = {
            title: place.name,
            uri: place.uri || '',
            addedAt: Date.now(),
            rating: place.rating,
            address: place.address
        };
        setFavorites(prev => [...prev, newFavorite]);
    }
  };

  const removeFavorite = (title: string) => {
      setFavorites(prev => prev.filter(f => f.title !== title));
  };

  const isFavorite = (title: string) => {
      return favorites.some(f => f.title === title);
  };

  const handleLocateMe = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocalización no soportada en este dispositivo.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation(newLoc);
        setHasUserLocation(true);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 15);
          
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([newLoc.lat, newLoc.lng]);
            userMarkerRef.current.setOpacity(1);
          }
        }
      },
      (error) => {
        let msg = "Error de GPS desconocido.";
        switch(error.code) {
            case error.PERMISSION_DENIED:
                msg = "Permiso de ubicación denegado.";
                break;
            case error.POSITION_UNAVAILABLE:
                msg = "Ubicación no disponible.";
                break;
            case error.TIMEOUT:
                msg = "Se agotó el tiempo.";
                break;
            default:
                msg = error.message || "Error al obtener ubicación.";
        }
        setLocationError(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || !window.L || mapInstanceRef.current) return;

    try {
        const map = window.L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView([location.lat, location.lng], 15);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // Layer group for places
        const placesLayer = window.L.layerGroup().addTo(map);
        placesLayerRef.current = placesLayer;

        const userIcon = window.L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
              <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: #34d399; opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span style="position: relative; width: 16px; height: 16px; border-radius: 9999px; background-color: #10b981; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = window.L.marker([location.lat, location.lng], { 
            icon: userIcon,
            opacity: hasUserLocation ? 1 : 0 
        }).addTo(map);

        mapInstanceRef.current = map;
        userMarkerRef.current = marker;

        handleLocateMe();

        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapContainerRef.current);
        
        setTimeout(() => {
            map.invalidateSize();
        }, 500);

        return () => resizeObserver.disconnect();
    } catch (e) {
        console.error("Error initializing map", e);
    }
  }, []); 

  // Render Markers when 'places' state changes
  useEffect(() => {
     if (!mapInstanceRef.current || !placesLayerRef.current || !window.L) return;

     // Clear existing markers
     placesLayerRef.current.clearLayers();

     if (places.length > 0) {
        const bounds = window.L.latLngBounds();

        places.forEach(place => {
            if (place.lat && place.lng) {
                // Determine color based on type
                const isHospital = place.type === 'hospital';
                const bgColor = isHospital ? '#ef4444' : '#10b981'; // Tailwind red-500 : emerald-500
                
                // SVG Icons as strings
                const hospitalIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: white;"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`;
                const genericIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: white;"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" /></svg>`;

                const customIcon = window.L.divIcon({
                    className: 'custom-place-marker',
                    html: `
                      <div style="
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        width: 48px; 
                        height: 48px; 
                        background-color: ${bgColor}; 
                        border-radius: 50%; 
                        border: 3px solid white; 
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                      ">
                        ${isHospital ? hospitalIcon : genericIcon}
                      </div>
                    `,
                    iconSize: [48, 48],
                    iconAnchor: [24, 48],
                });

                const marker = window.L.marker([place.lat, place.lng], { 
                    icon: customIcon,
                    zIndexOffset: 1000 // Ensure markers are above other elements
                });

                // Attach click directly to marker instance
                marker.on('click', () => {
                    setSelectedPlace(place);
                    
                    // Slightly offset center to accommodate bottom sheet
                    const offsetLat = place.lat! - 0.002;
                    mapInstanceRef.current.flyTo([offsetLat, place.lng], 16, {
                        animate: true,
                        duration: 1
                    });
                });

                marker.addTo(placesLayerRef.current);
                bounds.extend([place.lat, place.lng]);
            }
        });

        if (location.lat && location.lng) {
             bounds.extend([location.lat, location.lng]);
        }

        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
     }
  }, [places]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setPlaces([]);
    setSelectedPlace(null);
    
    try {
      const results = await findNearbyPlaces(query, location?.lat, location?.lng);
      setPlaces(results);
      setActiveTab('search');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReadPlace = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!selectedPlace) return;

      if (isSpeaking) {
          stop();
      } else {
          const status = selectedPlace.isOpen ? 'Abierto' : 'Cerrado';
          const text = `${selectedPlace.name}. Lugar ${status}. Distancia ${selectedPlace.distance}. Dirección: ${selectedPlace.address}`;
          speak(text, language);
      }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
           <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
             <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
           </svg>
        ))}
        <span className="text-xs text-gray-500 ml-1 font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors">
      
      <div className="absolute top-0 left-0 right-0 z-[500] p-4 pt-[calc(env(safe-area-inset-top)+1rem)] bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="flex justify-between items-center pointer-events-auto">
             <div className="flex items-center space-x-2 text-white">
                 <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-md border border-white/10">
                    <LogoIcon className="w-6 h-6" />
                 </div>
                 <h1 className="font-bold text-lg shadow-black/50 drop-shadow-md">{t.map_title}</h1>
             </div>
             <div className="flex items-center gap-2">
                <a href="tel:911" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg border border-red-400">
                   <span className="font-bold text-sm">911</span>
                </a>
                <button onClick={onOpenSettings} className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md border border-white/10">
                    <SettingsIcon className="w-5 h-5" />
                </button>
             </div>
          </div>
      </div>

      <div className="h-[50%] w-full relative z-0 bg-gray-200 dark:bg-slate-800 group border-b border-gray-200 dark:border-slate-800">
        <div ref={mapContainerRef} className="w-full h-full z-0" id="map" />
        {isOffline && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-slate-900/80 z-[500]">
                <div className="text-center p-4">
                    <p className="text-sm font-bold text-gray-500">{t.map_offline}</p>
                </div>
            </div>
        )}
        <button
            onClick={handleLocateMe}
            className="absolute bottom-4 right-4 bg-white dark:bg-slate-700 p-3 rounded-full shadow-lg z-[400] text-emerald-700 dark:text-emerald-400 border border-gray-100 dark:border-slate-600"
        >
            {isLocating ? (
               <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg>
            )}
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 flex flex-col overflow-hidden transition-colors relative">
        <div className="flex border-b border-gray-100 dark:border-slate-800">
            <button 
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'search' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            >
                {t.map_btn_search}
            </button>
            <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'favorites' ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            >
                {t.map_btn_favorites} {favorites.length > 0 && `(${favorites.length})`}
            </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === 'search' && (
                <>
                    <div className="p-4 pb-0">
                        <div className="flex gap-2 mb-2 items-center">
                             <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder={isListening ? "Escuchando..." : t.map_search_placeholder}
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-white"
                                />
                                {hasSupport && (
                                    <button 
                                        onClick={isListening ? stopListening : startListening}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                                            isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-emerald-600'
                                        }`}
                                    >
                                        <MicIcon className="w-5 h-5" />
                                    </button>
                                )}
                             </div>

                            <button 
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-3 rounded-xl font-medium shadow-sm hover:bg-emerald-700 flex-shrink-0"
                            >
                                {isLoading ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {locationError && <p className="text-xs text-orange-500">{locationError}</p>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 pt-4 pb-24 no-scrollbar space-y-3">
                        {!places.length && !isLoading && (
                            <div className="text-center py-8 opacity-50">
                                <p className="text-sm text-gray-500">{t.map_no_results}</p>
                            </div>
                        )}

                        {places.map((place, idx) => {
                            const saved = isFavorite(place.name);
                            return (
                                <div key={idx} onClick={() => { setSelectedPlace(place); mapInstanceRef.current?.flyTo([place.lat, place.lng], 16); }} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${place.type === 'hospital' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {place.type === 'hospital' ? (
                                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                                                ) : (
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{place.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {renderStars(place.rating)}
                                                    <span className="text-[10px] text-gray-400">({place.reviews})</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{place.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {activeTab === 'favorites' && (
                <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar space-y-3">
                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                            <StarIcon className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-gray-500 font-medium">No tienes favoritos.</p>
                        </div>
                    ) : (
                        favorites.map((fav, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between items-center gap-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{fav.title}</h4>
                                    {fav.rating && renderStars(fav.rating)}
                                    <p className="text-xs text-gray-400 mt-1">{fav.address}</p>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={() => removeFavorite(fav.title)} className="p-2 rounded-full text-red-400 hover:bg-red-50">
                                        <StarSolidIcon className="w-5 h-5" />
                                    </button>
                                    <a href={fav.uri} target="_blank" className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V9.75a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Floating Place Details Card - Using Portal to avoid z-index/transform issues */}
      {selectedPlace && createPortal(
          <>
            {/* Backdrop to focus on card */}
            <div className="fixed inset-0 bg-black/20 z-[9999]" onClick={() => setSelectedPlace(null)}></div>
            
            {/* The Card */}
            <div className="fixed bottom-0 left-0 right-0 z-[10000] animate-slide-up p-4 pb-6 bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] border-t border-gray-100 dark:border-slate-800">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide mb-1 ${selectedPlace.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {selectedPlace.isOpen ? 'Abierto' : 'Cerrado'}
                              <span className="mx-1">•</span>
                              {selectedPlace.schedule?.split(' ')[0] || 'Hoy'}
                          </div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{selectedPlace.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                                {renderStars(selectedPlace.rating)}
                                <span className="text-xs text-gray-500">({selectedPlace.reviews} reseñas)</span>
                          </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Audio Button */}
                        <button 
                            onClick={handleReadPlace}
                            className={`p-2.5 rounded-full transition-colors ${isSpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 hover:bg-gray-200'}`}
                        >
                            {isSpeaking ? <StopCircleIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                        </button>

                        <button onClick={() => setSelectedPlace(null)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                      </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0">
                          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.829.799 1.654 1.38 2.274 1.766a11.25 11.25 0 001.04.573c.005.003.01.006.016.009.006.003.01.006.015.008zM9.75 9a.25.25 0 11.5 0 .25.25 0 01-.5 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="line-clamp-2 leading-snug">{selectedPlace.address}</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-0.5">A {selectedPlace.distance} de ti</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                       <button onClick={() => toggleFavorite(selectedPlace)} className={`col-span-1 flex items-center justify-center p-3 rounded-xl transition-colors ${isFavorite(selectedPlace.name) ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                           {isFavorite(selectedPlace.name) ? <StarSolidIcon className="w-6 h-6" /> : <StarIcon className="w-6 h-6" />}
                       </button>
                       <a 
                            href={selectedPlace.uri} 
                            target="_blank"
                            className="col-span-4 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-bold text-center flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            IR AHORA
                        </a>
                  </div>
              </div>
          </>,
          document.body
      )}
    </div>
  );
};

export default MapView;
