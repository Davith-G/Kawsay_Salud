import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { LanguageContext } from '../App';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { language } = useContext(LanguageContext);
  const [error, setError] = useState<string | null>(null);
  const webRecognitionRef = useRef<any>(null);
  const isNative = Capacitor.isNativePlatform();

  const stopNativeListening = async () => {
    setIsListening(false);
    setTranscript(''); // LIMPIEZA: Borra el texto para que no pase a otra vista
    try {
      await SpeechRecognition.stop();
      await SpeechRecognition.removeAllListeners(); // LIMPIEZA: Mata procesos viejos
    } catch (e) {
      console.warn("Stop error:", e);
    }
  };

  const startNativeListening = async () => {
    try {
      // 1. Limpiar cualquier basura de otras páginas antes de empezar
      await SpeechRecognition.removeAllListeners(); 
      
      const { speechRecognition } = await SpeechRecognition.checkPermissions();
      if (speechRecognition !== 'granted') {
        const status = await SpeechRecognition.requestPermissions();
        if (status.speechRecognition !== 'granted') return;
      }

      setTranscript('');
      setError(null);
      setIsListening(true);

      await SpeechRecognition.start({
        language: language === 'en' ? 'en-US' : 'es-EC',
        maxResults: 2,
        partialResults: true,
        popup: false,
      });

      // 2. Escuchar solo en esta instancia
      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
          setTranscript(data.matches[0]);
        }
      });

    } catch (e: any) {
      setIsListening(false);
    }
  };

  const stopWebListening = () => {
    setIsListening(false);
    setTranscript('');
    if (webRecognitionRef.current) webRecognitionRef.current.stop();
  };

  const startWebListening = () => {
    const SpeechChoice = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechChoice) return;
    const recognition = new SpeechChoice();
    webRecognitionRef.current = recognition;
    recognition.interimResults = true;
    recognition.lang = language === 'en' ? 'en-US' : 'es-EC';
    recognition.onstart = () => { setIsListening(true); setError(null); };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setTranscript(e.results[0][0].transcript);
    recognition.start();
  };

  const startListening = useCallback(() => {
    if (isNative) startNativeListening();
    else startWebListening();
  }, [isNative, language]);

  const stopListening = useCallback(() => {
    if (isNative) stopNativeListening();
    else stopWebListening();
  }, [isNative]);

  useEffect(() => {
    const appListener = App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) stopListening();
    });
    return () => {
      stopListening();
      appListener.then(h => h.remove());
    };
  }, [stopListening]);

  return { isListening, transcript, startListening, stopListening, error, hasSupport: isNative || !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) };
};