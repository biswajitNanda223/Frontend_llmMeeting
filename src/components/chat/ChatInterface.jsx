import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { clsx } from 'clsx';
import { api } from '../../api/apiService';

const ChatInterface = ({ conversationId, messages, setMessages, onViewCouncil }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedFile) || isLoading) return;

        const userMsg = {
            id: `temp_${Date.now()}`,
            role: 'user',
            content: input,
            file: selectedFile // visual only for now
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setSelectedFile(null);
        setIsLoading(true);

        try {
            const response = await api.sendMessage(conversationId, userMsg.content, userMsg.file);

            const botMsg = {
                id: `bot_${Date.now()}`,
                role: 'assistant',
                content: response.response,
                council_data: response // The whole response object serves as metadata in our mock structure
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <span className="text-2xl">👋</span>
                        </div>
                        <p className="text-lg font-medium text-slate-600">Start a new conversation</p>
                        <p className="text-sm">Ask a question to convene the council.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            onViewCouncil={onViewCouncil}
                        />
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm ml-4 animate-pulse">
                        <Loader2 size={16} className="animate-spin" />
                        <span>Council is deliberating...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-transparent relative z-10 w-full max-w-3xl mx-auto">
                <form
                    onSubmit={handleSend}
                    className="relative flex items-end gap-2 p-1.5 bg-white shadow-xl shadow-slate-200/60 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 active:scale-95"
                    >
                        <Paperclip size={18} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <div className="flex-1 py-2">
                        {selectedFile && (
                            <div className="flex items-center gap-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md w-fit mb-1 border border-blue-100 animate-fade-in">
                                <span>📎 {selectedFile.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Message"
                            className="w-full bg-transparent border-0 outline-none focus:ring-0 focus:outline-none resize-none max-h-24 min-h-[20px] overflow-y-auto text-slate-700 placeholder:text-slate-300 text-sm"
                            rows={1}
                            style={{ boxShadow: 'none', appearance: 'none' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={(!input.trim() && !selectedFile) || isLoading}
                        className={clsx(
                            "p-2 rounded-lg transition-all duration-300",
                            (!input.trim() && !selectedFile) || isLoading
                                ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                                : "bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 hover:scale-105 active:scale-95"
                        )}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">The LLM Council</p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
