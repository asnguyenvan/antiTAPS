import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { ChatMessage, ParkingLot } from '../types';
import { sendMessage, GeminiLiveClient } from '../services/geminiService';

interface AIAssistantProps {
  lots: ParkingLot[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ lots }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm GatorBot. Ask me about parking availability or where to park with your decal.",
      timestamp: Date.now()
    }
  ]);
  
  const liveClientRef = useRef<GeminiLiveClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Clean up live client on unmount
  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessage(userMsg.text, lots);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "I'm having trouble connecting to the network.",
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      // Turn off
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
        liveClientRef.current = null;
      }
      setIsLiveConnected(false);
      setIsVoiceMode(false);
    } else {
      // Turn on
      if (!process.env.API_KEY) {
        alert("API Key missing");
        return;
      }
      setIsVoiceMode(true);
      liveClientRef.current = new GeminiLiveClient(process.env.API_KEY);
      
      try {
        await liveClientRef.current.connect(lots, () => {
             setIsLiveConnected(false);
             setIsVoiceMode(false);
        });
        setIsLiveConnected(true);
      } catch (e) {
        console.error("Failed to connect live", e);
        setIsVoiceMode(false);
      }
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center
          ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-uf-blue text-white'}`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-uf-blue p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                <h3 className="font-bold text-white">GatorBot {isVoiceMode ? '(Live)' : ''}</h3>
                <p className="text-uf-blue-100 text-xs">AI Parking Assistant</p>
                </div>
            </div>
            
            {/* Live Voice Toggle */}
            <button 
                onClick={toggleVoiceMode}
                className={`p-2 rounded-full transition-colors ${isVoiceMode ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white hover:bg-white/30'}`}
                title="Toggle Live Voice"
            >
                {isVoiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
          </div>

          {isVoiceMode ? (
              <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center p-6 text-center space-y-6">
                 {isLiveConnected ? (
                     <>
                        <div className="relative">
                            <div className="absolute inset-0 bg-uf-blue blur-xl opacity-50 animate-pulse rounded-full"></div>
                            <div className="w-32 h-32 bg-gradient-to-tr from-uf-blue to-uf-orange rounded-full flex items-center justify-center relative z-10 shadow-lg">
                                <Mic className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Listening...</h3>
                            <p className="text-gray-400 text-sm">Ask about parking availability or where to park without a decal.</p>
                        </div>
                     </>
                 ) : (
                     <div className="flex flex-col items-center">
                         <Loader2 className="w-8 h-8 text-uf-orange animate-spin mb-4" />
                         <p className="text-white">Connecting to Gemini Live...</p>
                     </div>
                 )}
              </div>
          ) : (
            <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm
                            ${msg.role === 'user'
                            ? 'bg-uf-orange text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}
                        >
                        {msg.text}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-500 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Thinking...</span>
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-uf-orange/50 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Where can I park?"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-uf-blue text-white rounded-full hover:bg-uf-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                    </div>
                </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistant;