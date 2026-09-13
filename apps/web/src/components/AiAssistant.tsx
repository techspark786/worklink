"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  diagnosis?: {
    queryText?: string;
    detectedTrade: string;
    requiredSkills: string[];
    recommendedUrgency: string;
    safetyAdvisory: string;
    confidenceScore: number;
    parsedLanguage?: string;
  };
  isError?: boolean;
}

const QUICK_PROMPTS = [
  "किचन का सीलिंग पंखा बहुत गर्म हो रहा है और धुआं आ रहा है",
  "Bathroom washbasin pipe is leaking heavily",
  "Main electricity MCB switch keeps tripping",
  "Split AC is not cooling properly and blowing warm air",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaste! I am your WorkLink AI Diagnostic Assistant. Describe your household repair or maintenance issue in Hindi, Hinglish, or English, and I'll identify the required trade, evaluate safety precautions, and help you find a certified cooperative worker.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error('AI Assistant is temporarily unavailable. Please check the AI configuration.');
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.response || `We recommend a certified ${data.diagnosis?.detectedTrade || 'technician'}.`,
        diagnosis: data.diagnosis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "AI Assistant is temporarily unavailable. Please check the AI configuration.",
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] max-h-[85vh] bg-[#070D1E]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.1] shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A110D] via-[#0B152B] to-[#1A110D] text-white p-4 flex items-center justify-between border-b border-white/[0.08] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-champagne-500 text-navy-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5 text-navy-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white">WorkLink AI Sahayak</h3>
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                </div>
                <p className="text-[11px] text-champagne-300/80 font-medium">Vernacular Diagnosis & FairMatch™</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-cream-200/60 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050914]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-champagne-400 to-rose-400 text-navy-950 flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold shadow-sm">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-rose-600 to-espresso-700 text-white border border-rose-400/30 rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-950/60 text-rose-200 border border-rose-500/30 rounded-tl-none'
                      : 'bg-[#0B152B]/90 text-cream-100 border border-white/[0.08] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Rich Diagnosis Metadata Card */}
                  {msg.diagnosis && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2 bg-[#1A110D]/70 p-2.5 rounded-xl border border-champagne-400/20">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-champagne-300">
                          🛠️ {msg.diagnosis.detectedTrade}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN' ? '⚡ 45 Min Express' : '📅 Same Day'}
                        </span>
                      </div>

                      {msg.diagnosis.safetyAdvisory && (
                        <div className="text-[11px] text-amber-200 bg-amber-950/50 p-2 rounded-lg border border-amber-500/30 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{msg.diagnosis.safetyAdvisory}</span>
                        </div>
                      )}

                      <Link
                        href={`/customer/dashboard?service=${encodeURIComponent(msg.diagnosis.detectedTrade)}&query=${encodeURIComponent(msg.diagnosis.queryText || '')}`}
                        onClick={() => setIsOpen(false)}
                        className="mt-1.5 flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-champagne-400 to-rose-400 hover:from-champagne-300 hover:to-rose-300 text-navy-950 font-bold text-[11px] rounded-xl shadow-md transition-all"
                      >
                        Find Verified {msg.diagnosis.detectedTrade} <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-cream-200/50' : 'text-cream-200/40'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] text-cream-100 flex-shrink-0 flex items-center justify-center mt-1 text-xs border border-white/[0.08]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-cream-200/70 bg-[#0B152B]/80 p-2.5 rounded-xl w-fit border border-white/[0.08] shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-champagne-400" />
                <span>AI is diagnosing symptoms & matching skills...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-[#070D1E] border-t border-white/[0.08] flex gap-2 overflow-x-auto text-[10px]">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-cream-200/80 hover:text-champagne-300 border border-white/[0.08] transition-colors flex-shrink-0 font-medium"
              >
                {prompt.length > 28 ? prompt.substring(0, 28) + '...' : prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#070D1E] border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe problem (e.g. पंखा नहीं चल रहा)..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white placeholder-cream-200/30 focus:outline-none focus:border-champagne-400/60 focus:ring-1 focus:ring-champagne-400/50"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-rose-500 to-champagne-400 hover:from-rose-400 hover:to-champagne-300 disabled:opacity-40 text-navy-950 font-bold rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-rose-500 via-espresso-700 to-[#0B152B] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_10px_30px_rgba(224,141,164,0.35)] hover:shadow-[0_15px_40px_rgba(224,141,164,0.5)] hover:scale-105 transition-all duration-300 border border-champagne-400/40"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-champagne-400 to-rose-400 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-navy-950 animate-pulse" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-[#070D1E] animate-ping" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-xs tracking-tight text-white leading-none">AI Sahayak</span>
          <span className="text-[10px] text-champagne-200/70 font-medium leading-none mt-1">Symptom Doctor</span>
        </div>
      </button>
    </div>
  );
}
