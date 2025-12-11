
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Use a ref to prevent garbage collection of the utterance while speaking (Chrome bug fix)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, language: string) => {
    // Cancel any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map languages to SpeechSynthesis BCP 47 tags
    // Kichwa usually falls back to Spanish phonetics as it's not standard in TTS engines
    let langTag = 'es-ES';
    if (language === 'en') langTag = 'en-US';
    if (language === 'qu') langTag = 'es-ES'; 

    utterance.lang = langTag;
    utterance.rate = 0.9; // Slightly slower for instructions

    utterance.onstart = () => setIsSpeaking(true);
    
    utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' are expected when user switches audio quickly.
        // We do not want to log them as errors.
        if (event.error === 'interrupted' || event.error === 'canceled') {
            setIsSpeaking(false);
            return;
        }
        
        console.error("TTS Error:", event.error);
        setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
    hasSupport: 'speechSynthesis' in window
  };
};
