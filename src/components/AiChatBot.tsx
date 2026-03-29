import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, ErrorState } from './types';
import { getApiErrorState } from './apiErrorHandler';

const AiChatBot: React.FC<{
  onAttemptAccess: () => boolean;
  isPro: boolean;
}> = ({ onAttemptAccess, isPro }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hello! I'm your AI Catering Consultant. Ask me for advice on event planning, menu pairings, or details about the proposal you just generated!",
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorState | null>(null);

    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isOpen && isPro) {
            inputRef.current?.focus();
            if (!chatRef.current) {
                initializeChat();
            }
        }
    }, [isOpen, isPro]);

    const handleToggleOpen = () => {
      if (isOpen) {
        setIsOpen(false);
      } else {
        if (onAttemptAccess()) {
          setIsOpen(true);
        }
      }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);
    
    /**
     * Initializes the Gemini Chat session.
     */
    const initializeChat = () => {
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            chatRef.current = ai.chats.create({
              model: 'gemini-3-flash-preview',
              config: {
                systemInstruction: 'You are a friendly and professional AI Catering Consultant and culinary expert. Your primary role is to help users refine their generated menu proposals by providing specific, actionable advice about individual dishes. Focus on suggesting ingredient substitutions (e.g., "To make the risotto dairy-free, you can use a high-quality olive oil instead of butter and nutritional yeast for a cheesy flavor.") and alternative cooking methods (e.g., "For a lighter version of the chicken piccata, you could bake the chicken instead of pan-frying it."). Also, continue to offer advice on wine pairings and service logistics. Keep your answers concise, helpful, and encouraging. Do not generate full menu proposals, only answer questions about them.',
              },
            });
        } catch (e) {
            console.error("Failed to initialize chat:", e);
            setError(getApiErrorState(e));
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;

        setError(null);
        setMessages(prev => [...prev, { role: 'user', content: trimmedInput }]);
        setUserInput('');
        setIsLoading(true);

        if (!chatRef.current) {
             setIsLoading(false);
             setError({
                 title: "Initialization Failed",
                 message: "Chat has not been initialized. Please close and reopen the chat window."
             });
             return;
        }

        try {
            const responseStream = await chatRef.current.sendMessageStream({ message: trimmedInput });
            
            let currentResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of responseStream) {
                currentResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model') {
                      newMessages[newMessages.length - 1].content = currentResponse;
                    }
                    return newMessages;
                });
            }

        } catch (err) {
            setError(getApiErrorState(err));
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'model' && lastMessage.content === '') {
                    return prev.slice(0, -1);
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };
    
    return (
        <>
            <div className="no-print fixed bottom-8 right-8 z-50 flex flex-col items-end gap-6">
                {isOpen && isPro && (
                    <div 
                        role="dialog" 
                        aria-labelledby="chat-heading" 
                        className="w-[380px] h-[600px] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.2)] border border-slate-200 bg-white rounded-[3rem] overflow-hidden relative animate-slide-in"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 -z-10" />
                        
                        <header className="flex-shrink-0 p-8 bg-slate-900 flex items-center justify-between relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                                    <span className="text-2xl">👨‍🍳</span>
                                </div>
                                <div>
                                    <h2 id="chat-heading" className="text-white font-black text-lg tracking-tight uppercase">Chef Mentor</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </header>

                        <div className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                                            <span className="text-xl">🤖</span>
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                            <span className="text-xl">👤</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <span className="text-xl">🤖</span>
                                    </div>
                                    <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-200 flex gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20">
                                    <div className="flex items-start">
                                        <span className="text-xl mr-3">⚠️</span>
                                        <div>
                                            <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error.title}</p>
                                            <p className="text-sm text-red-700 mt-1 font-medium italic">{error.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="flex-shrink-0 p-8 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Ask about costing, QCTO, or recipes..."
                                    disabled={isLoading}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all disabled:opacity-60"
                                    aria-label="Your message"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !userInput.trim()}
                                    className="absolute right-2 top-2 w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                                    aria-label="Send message"
                                >
                                    <span className="text-xl">➡️</span>
                                </button>
                            </form>
                        </footer>
                    </div>
                )}

                <button
                    onClick={handleToggleOpen}
                    className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-110 transition-all relative group overflow-hidden"
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isOpen ? <span className="text-3xl">✕</span> : <span className="text-3xl">💬</span>}
                    {!isPro && (
                        <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-amber-900 shadow-lg border-4 border-slate-50" aria-hidden="true">
                            <span className="text-xs">🔒</span>
                        </span>
                    )}
                    {!isOpen && isPro && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-50 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>
                    )}
                </button>
            </div>
        </>
    );
};

export default AiChatBot;
