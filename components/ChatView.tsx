import React, { useState, useRef, useEffect, useContext } from 'react';
import { Message } from '../types';
import { sendMessageStream, initializeChat } from '../services/geminiService';
import { LanguageContext } from '../App';
import { MicIcon, SpeakerWaveIcon, StopCircleIcon } from './Icons';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const ChatView: React.FC = () => {
  const { language, t } = useContext(LanguageContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Estado para evitar que las palabras se dupliquen al dictar
  const [baseInput, setBaseInput] = useState('');
  
  // Speech & TTS Hooks
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Inicialización del Chat
  useEffect(() => {
     initializeChat(language);
     setMessages([{ id: 'welcome', text: t.chat_welcome, sender: 'bot', timestamp: new Date() }]);
  }, [language, t]);

  // CORRECCIÓN: Sincronizar dictado sin duplicar palabras (Usa baseInput)
  useEffect(() => {
      if (isListening && transcript) {
          const space = baseInput && !baseInput.endsWith(' ') ? ' ' : '';
          setInputValue(baseInput + space + transcript);
      }
  }, [transcript, isListening, baseInput]);

  // Limpieza: Apagar micro forzosamente al salir de la pantalla o cambiar de pestaña
  useEffect(() => {
    return () => { 
      stopListening(); 
    };
  }, [stopListening]);

  const scrollToBottom = () => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  };
  
  useEffect(() => { 
    scrollToBottom(); 
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (isSpeaking) { 
        stop(); 
        setSpeakingMessageId(null); 
    }
    
    // Detener escucha al enviar
    if (isListening) stopListening();

    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setBaseInput(''); // Limpiar base al enviar
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, text: '', sender: 'bot', timestamp: new Date() }]);

    try {
      const stream = await sendMessageStream(userMsg.text);
      let fullText = '';
      
      for await (const chunk of stream) {
        if (chunk && chunk.text) {
          fullText += chunk.text;
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: t.chat_error } : m));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleMic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      // Guardamos el texto que ya existe como "base" antes de empezar a escuchar lo nuevo
      setBaseInput(inputValue); 
      startListening();
    }
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
      if (isSpeaking && speakingMessageId === msgId) {
          stop();
          setSpeakingMessageId(null);
      } else {
          setSpeakingMessageId(msgId);
          speak(text.replace(/\*\*/g, ''), language);
      }
  };

  const renderFormattedText = (text: string) => {
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
      if (part.match(/https?:\/\/[^\s]+/)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-600 break-all">{part}</a>;
      return part.split(/\*\*(.*?)\*\*/g).map((sub, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{sub}</strong> : <span key={j}>{sub}</span>);
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-950 transition-colors">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] text-white shadow-md z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <div><h2 className="font-bold">Yachak AI</h2><p className="text-xs text-emerald-100">Asistente Comunitario</p></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar relative">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm relative ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-slate-700'}`}>
               <p className="whitespace-pre-wrap text-sm pr-6">{renderFormattedText(msg.text)}</p>
               <button onClick={() => handleToggleSpeech(msg.id, msg.text)} className={`absolute top-2 right-2 p-1 rounded-full ${isSpeaking && speakingMessageId === msg.id ? 'text-red-500' : 'text-current'}`}>
                   {isSpeaking && speakingMessageId === msg.id ? <StopCircleIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
               </button>
               <span className="text-[10px] block mt-1 opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex space-x-2 items-center shadow-sm"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 flex items-center p-1 pr-2">
          {hasSupport && (
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-3 rounded-full transition-all flex-shrink-0 mr-1 z-50 shadow-md ${isListening ? 'bg-red-600 text-white' : 'text-gray-400'}`}
              >
                  {/* Icono con animación sutil solo si escucha, botón siempre sólido */}
                  <MicIcon className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
              </button>
          )}
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => { 
                setInputValue(e.target.value); 
                setBaseInput(e.target.value); 
            }} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            placeholder={isListening ? "Escuchando Chat..." : t.chat_placeholder} 
            className="flex-1 px-2 py-3 bg-transparent focus:outline-none text-sm text-slate-800 dark:text-white" 
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={!inputValue.trim() || isLoading} 
            className={`p-3 rounded-full transition-colors ${!inputValue.trim() || isLoading ? 'text-gray-300' : 'bg-emerald-600 text-white shadow-md'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;