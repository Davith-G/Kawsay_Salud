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
  
  // Speech Hook
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  
  // TTS Hook
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Initialize Chat
  useEffect(() => {
     initializeChat(language);
     setMessages([{
      id: 'welcome',
      text: t.chat_welcome,
      sender: 'bot',
      timestamp: new Date()
     }]);
  }, [language, t]);

  // Update input when speech transcript changes
  useEffect(() => {
      if (transcript) {
          setInputValue(prev => {
              // If previously empty, set it. If not, append with space.
              return prev ? `${prev} ${transcript}` : transcript;
          });
      }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Stop speaking if sending new message
    if (isSpeaking) {
        stop();
        setSpeakingMessageId(null);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      text: '', 
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMsgPlaceholder]);

    try {
      const stream = await sendMessageStream(userMsg.text);
      let fullText = '';
      let hasReceivedText = false;

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          hasReceivedText = true;
          fullText += chunkText;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }

      if (!hasReceivedText) throw new Error("No response received");

    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: t.chat_error } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSpeech = (msgId: string, text: string) => {
      if (isSpeaking && speakingMessageId === msgId) {
          stop();
          setSpeakingMessageId(null);
      } else {
          setSpeakingMessageId(msgId);
          // Clean text for speech (remove asterisks)
          const cleanText = text.replace(/\*\*/g, '');
          speak(cleanText, language);
      }
  };

  // Helper to format text (Bold **text** and Links)
  const renderFormattedText = (text: string) => {
    // 1. Split by URLs first
    const parts = text.split(/(https?:\/\/[^\s]+)/g);
    
    return parts.map((part, i) => {
      // If it's a URL
      if (part.match(/https?:\/\/[^\s]+/)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-600 dark:text-emerald-400 break-all hover:text-emerald-800 transition-colors">
            {part}
          </a>
        );
      }
      
      // 2. Parse Markdown Bold (**text**)
      const boldParts = part.split(/\*\*(.*?)\*\*/g);
      return boldParts.map((subPart, j) => {
         // Odd indices are the captured bold text
         if (j % 2 === 1) {
             return <strong key={`${i}-${j}`} className="font-bold text-inherit">{subPart}</strong>;
         }
         return <span key={`${i}-${j}`}>{subPart}</span>;
      });
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-950 transition-colors">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] text-white shadow-md flex-shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold">Yachak AI</h2>
            <p className="text-xs text-emerald-100">Asistente Comunitario</p>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 no-scrollbar bg-gray-50 dark:bg-slate-950 relative transition-colors"
        aria-live="polite"
        role="log"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm relative ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-slate-700'}`}>
               <p className="whitespace-pre-wrap text-sm leading-relaxed pr-6">
                  {renderFormattedText(msg.text)}
               </p>
               
               {/* TTS Button */}
               <button 
                  onClick={() => handleToggleSpeech(msg.id, msg.text)}
                  className={`absolute top-2 right-2 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${isSpeaking && speakingMessageId === msg.id ? 'text-red-500 animate-pulse' : 'text-current'}`}
                  aria-label={isSpeaking && speakingMessageId === msg.id ? "Detener lectura" : "Leer mensaje en voz alta"}
               >
                   {isSpeaking && speakingMessageId === msg.id ? (
                       <StopCircleIcon className="w-4 h-4" />
                   ) : (
                       <SpeakerWaveIcon className="w-4 h-4" />
                   )}
               </button>

               <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400 dark:text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start" role="status" aria-label="Escribiendo respuesta...">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-slate-700 flex space-x-2 items-center shadow-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent z-10">
        <div className="bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 flex items-center p-1 pr-2">
          
          {hasSupport && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-full transition-colors flex-shrink-0 mr-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-emerald-600 dark:text-gray-500'
                }`}
                aria-label={isListening ? "Detener micrófono" : "Activar micrófono para dictado"}
              >
                  <MicIcon className="w-5 h-5" />
              </button>
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Escuchando..." : t.chat_placeholder}
            aria-label="Escribe tu mensaje aquí"
            className="flex-1 px-2 py-3 bg-transparent focus:outline-none text-sm text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Enviar mensaje"
            className={`p-3 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              !inputValue.trim() || isLoading 
                ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;