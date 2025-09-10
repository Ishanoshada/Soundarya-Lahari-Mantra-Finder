import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAiChatResponse } from '../services/geminiService';
import ErrorMessage from './ErrorMessage';
import CopyButton from './CopyButton';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const FullscreenEnterIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" /></svg>
);

const FullscreenExitIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m7 7l5 5m0 0v-4m0 4h-4M8 20v-4m0 4H4m0 0l5-5" /></svg>
);

// A simple markdown-like renderer
const FormattedResponse: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="space-y-4">
            {text.split('\n').map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-bold text-amber-900 mt-4">{line.substring(4)}</h3>;
                }
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold text-amber-900 mt-5">{line.substring(3)}</h2>;
                }
                if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-3xl font-bold text-amber-900 mt-6">{line.substring(2)}</h1>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
                }
                if (line.trim() === '') {
                    return <div key={index} className="h-2"></div>; // represent a line break with some space
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};


interface AIChatProps {
    language: string;
    onApiUse: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ language, onApiUse }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Welcome. I am Lahari GPT, your spiritual guide. How may I assist you on your path today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const responseText = await getAiChatResponse(userMessage.text, [...messages, userMessage], language);
            onApiUse();
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const containerClasses = isFullScreen
        ? "fixed inset-0 z-[100] flex flex-col bg-amber-50"
        : "w-full max-w-3xl mx-auto my-6 flex flex-col h-[70vh] bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-amber-300/50 animate-landing animate-fade-in";


    return (
        <div className={containerClasses} style={{ animationDelay: '1.3s' }}>
             <header className="flex-shrink-0 p-4 border-b border-amber-200/50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <h3 className="text-xl font-bold text-amber-900">AI Chat Guide</h3>
                <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 text-amber-700 rounded-full hover:bg-amber-100/70 transition-colors"
                    aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
                >
                    {isFullScreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                </button>
            </header>

            <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-lg px-5 py-3 rounded-2xl shadow ${msg.role === 'user' ? 'bg-amber-200 text-amber-900 rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                                {msg.role === 'model' && (
                                    <CopyButton
                                        textToCopy={msg.text}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 bg-slate-100/50 hover:bg-slate-200 rounded-full transition-colors"
                                    />
                                )}
                                <div className={msg.role === 'model' ? 'pr-8' : ''}>
                                    {msg.role === 'model' ? <FormattedResponse text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start">
                           <div className="max-w-lg px-5 py-3 rounded-2xl shadow bg-white text-slate-800 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-150"></div>
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-300"></div>
                                </div>
                           </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>
             {error && <div className="p-4"><ErrorMessage message={error} /></div>}
            <div className="p-4 border-t border-amber-200 bg-white/50 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for guidance..."
                        className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 flex-grow"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-amber-800 text-white rounded-full hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;