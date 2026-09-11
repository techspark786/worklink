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
  Clock, 
  ChevronRight,
  RefreshCw,
  MessageSquare
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
      text: "Namaste! I am your ShramSetu AI Diagnostic Assistant. Describe your household repair or maintenance issue in Hindi, Hinglish, or English, and I'll identify the required trade, evaluate safety precautions, and help you find a certified cooperative worker.",
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[540px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">ShramSetu AI Sahayak</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-[11px] text-slate-300">Vernacular Diagnosis & FairMatch™</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Rich Diagnosis Metadata Card */}
                  {msg.diagnosis && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-emerald-900">
                          🛠️ {msg.diagnosis.detectedTrade}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN' ? '⚡ 45 Min Express' : '📅 Same Day'}
                        </span>
                      </div>

                      {msg.diagnosis.safetyAdvisory && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{msg.diagnosis.safetyAdvisory}</span>
                        </div>
                      )}

                      <Link
                        href={`/customer/dashboard?service=${encodeURIComponent(msg.diagnosis.detectedTrade)}&query=${encodeURIComponent(msg.diagnosis.queryText || '')}`}
                        onClick={() => setIsOpen(false)}
                        className="mt-1.5 flex items-center justify-center gap-1.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all"
                      >
                        Find Verified {msg.diagnosis.detectedTrade} <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex-shrink-0 flex items-center justify-center mt-1 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl w-fit border border-slate-200 shadow-sm">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>AI is diagnosing symptoms & matching skills...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors flex-shrink-0 font-medium"
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
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe problem (e.g. पंखा नहीं चल रहा)..."
              disabled={loading}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-white/20"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-black text-xs tracking-tight leading-none">AI Sahayak</span>
          <span className="text-[9px] text-emerald-100 font-medium leading-none mt-0.5">Symptom Doctor</span>
        </div>
      </button>
    </div>
  );
}
