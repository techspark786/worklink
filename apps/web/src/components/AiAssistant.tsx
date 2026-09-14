"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Minimize2,
  ExternalLink,
  Wrench,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleConversationalQuery, DiagnosisResult, SuggestedAction } from '@/lib/aiChatEngine';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  diagnosis?: DiagnosisResult;
  suggestedActions?: SuggestedAction[];
  isEmergency?: boolean;
  isError?: boolean;
  source?: string;
}

const CATEGORIZED_PROMPTS = [
  { label: '⚡ MCB Tripping / Sparking', query: 'Main electricity MCB switch keeps tripping with sparks' },
  { label: '🚰 Water Pipe Leaking', query: 'Bathroom sink pipe is leaking water continuously' },
  { label: '❄️ AC Not Cooling', query: 'Split AC is blowing warm air and not cooling' },
  { label: '🚪 Jammed Door / Lock', query: 'Main wooden door lock is jammed and hard to turn' },
  { label: '💼 How to Join as Worker?', query: 'How do I register and onboard as a certified worker?' },
  { label: '💰 Fair Wage Guarantee', query: 'What is WorkLink 0% commission and fair wage policy?' },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AiAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaste! 🙏 I am your **WorkLink AI Sahayak** (Vernacular Diagnostic Assistant).\n\nDescribe any household repair or maintenance issue in **Hindi, Hinglish, or English** (e.g. *\"पंखा नहीं चल रहा है\"* or *\"pipe leaking heavily\"*), or ask about cooperative fair wages, bookings, and worker onboarding.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '⚡ Tripping MCB', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping and sparking' },
        { label: '🚰 Water Leakage', action: 'send_message', payload: 'Kitchen sink pipe is leaking water heavily' },
        { label: '❓ How WorkLink Works', action: 'send_message', payload: 'What is WorkLink and how does it work?' },
        { label: '💼 Join as Worker', action: 'navigate', payload: '/register?role=worker' },
      ],
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN'; // Supports Hindi + English Indian accent

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech
  const speakText = useCallback((textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = textToSpeak.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = /[\u0900-\u097F]/.test(cleanText) ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking]);

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Namaste! 🙏 Chat history cleared. How may I assist you with your household repairs or cooperative services today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '⚡ Tripping MCB', action: 'send_message', payload: 'Main electricity MCB switch keeps tripping' },
          { label: '🚰 Leaking Pipe', action: 'send_message', payload: 'Kitchen tap pipe is leaking heavily' },
        ],
      },
    ]);
  };

  // Multi-tier resilient message sender
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    let assistantMsg: ChatMessage | null = null;

    // Tier 1: Try Next.js internal App Router endpoint (/api/ai/chat)
    try {
      const res = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.response || data.diagnosis)) {
          assistantMsg = {
            id: `a-${Date.now()}`,
            sender: 'assistant',
            text: data.response || `We recommend a certified ${data.diagnosis?.detectedTrade || 'worker'}.`,
            diagnosis: data.diagnosis,
            suggestedActions: data.suggestedActions,
            isEmergency: data.isEmergency || data.diagnosis?.recommendedUrgency === 'EMERGENCY_45_MIN',
            source: data.source || 'nextjs_api',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
      }
    } catch (tier1Err) {
      // Tier 1 failed or offline, fall through to Tier 2
    }

    // Tier 2: Try Backend API endpoint (${API_BASE_URL}/ai/chat)
    if (!assistantMsg) {
      try {
        const res = await fetch(`${API_BASE_URL}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && (data.response || data.diagnosis)) {
            assistantMsg = {
              id: `a-${Date.now()}`,
              sender: 'assistant',
              text: data.response,
              diagnosis: data.diagnosis,
              suggestedActions: data.suggestedActions,
              isEmergency: data.isEmergency || data.diagnosis?.recommendedUrgency === 'EMERGENCY_45_MIN',
              source: 'backend_api',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
        }
      } catch (tier2Err) {
        // Tier 2 failed or offline, fall through to Tier 3
      }
    }

    // Tier 3: Zero-Failure Client-Side AI Engine (Guarantees it never crashes or fails)
    if (!assistantMsg) {
      const clientResult = handleConversationalQuery(text);
      assistantMsg = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: clientResult.response,
        diagnosis: clientResult.diagnosis,
        suggestedActions: clientResult.suggestedActions,
        isEmergency: clientResult.isEmergency,
        source: 'client_engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    setMessages((prev) => [...prev, assistantMsg!]);
    setLoading(false);
  };

  // Handle Action Button click
  const handleActionClick = (action: SuggestedAction) => {
    if (action.action === 'navigate') {
      setIsOpen(false);
      router.push(action.payload);
    } else {
      handleSendMessage(action.payload);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div 
          className={`h-[580px] max-h-[85vh] bg-[#070D1E]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200 transition-all ${
            isExpanded ? 'w-[90vw] sm:w-[560px]' : 'w-[360px] sm:w-[420px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A110D] via-[#0B152B] to-[#1A110D] text-white p-4 flex items-center justify-between border-b border-white/[0.08] shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-champagne-400 text-navy-950 flex items-center justify-center font-black shadow-md">
                  <Bot className="w-5 h-5 text-navy-950" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070D1E] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white">WorkLink AI Sahayak</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-champagne-300/80 font-medium">
                  Vernacular Symptom Diagnosis & FairMatch™
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand / Minimize Width */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse view" : "Expand view"}
                className="p-1.5 text-cream-200/60 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Clear Chat */}
              <button
                onClick={handleClearChat}
                title="Clear chat history"
                className="p-1.5 text-cream-200/60 hover:text-rose-300 hover:bg-white/[0.08] rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-cream-200/60 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050914]/85 scrollbar-thin scrollbar-thumb-white/10">
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
                  className={`max-w-[86%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-rose-600 to-espresso-700 text-white border border-rose-400/30 rounded-tr-none'
                      : msg.isError
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-500/30 rounded-tl-none'
                      : 'bg-[#0B152B]/95 text-[#F8F4EE] border border-white/[0.12] rounded-tl-none shadow-xl'
                  }`}
                  style={{ color: msg.sender === 'user' ? '#FFFFFF' : '#F8F4EE' }}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line space-y-1.5" style={{ color: '#F8F4EE' }}>
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-[#F8F4EE] text-xs leading-relaxed" style={{ color: '#F8F4EE' }}>
                        {paragraph.split('**').map((chunk, cIdx) => 
                          cIdx % 2 === 1 ? <strong key={cIdx} className="font-semibold text-champagne-300">{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Rich Trade Diagnosis Action Card (Only for genuine diagnosed trades) */}
                  {msg.diagnosis && msg.diagnosis.detectedTrade && msg.diagnosis.detectedTrade !== 'General Home Maintenance' && (
                    <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2.5 bg-[#1A110D]/80 p-3 rounded-xl border border-champagne-400/25">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-champagne-400" />
                          <span className="font-bold text-xs text-champagne-300">
                            {msg.diagnosis.detectedTrade}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN'
                              ? 'bg-rose-950/90 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {msg.diagnosis.recommendedUrgency === 'EMERGENCY_45_MIN' ? (
                            <>
                              <Zap className="w-2.5 h-2.5" /> 45 Min Express
                            </>
                          ) : (
                            '📅 Same Day'
                          )}
                        </span>
                      </div>

                      {/* Required skills badges */}
                      {msg.diagnosis.requiredSkills && msg.diagnosis.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {msg.diagnosis.requiredSkills.map((skill, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="text-[9px] bg-white/[0.06] text-cream-200/80 px-1.5 py-0.5 rounded border border-white/[0.08]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Safety Advisory Banner */}
                      {msg.diagnosis.safetyAdvisory && (
                        <div className="text-[11px] text-amber-200 bg-amber-950/60 p-2.5 rounded-lg border border-amber-500/40 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{msg.diagnosis.safetyAdvisory}</span>
                        </div>
                      )}

                      {/* Direct 1-Click Booking CTA */}
                      <Link
                        href={msg.diagnosis.bookingUrl || `/customer/dashboard?service=${encodeURIComponent(msg.diagnosis.detectedTrade)}`}
                        onClick={() => setIsOpen(false)}
                        className="mt-2 flex items-center justify-center gap-1.5 w-full py-2.5 bg-gradient-to-r from-rose-500 via-champagne-400 to-amber-400 hover:brightness-110 text-navy-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                      >
                        Find & Book Certified {msg.diagnosis.detectedTrade} <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(act)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                            act.isPrimary
                              ? 'bg-gradient-to-r from-rose-500 to-champagne-400 text-navy-950 font-bold hover:brightness-110 shadow-sm'
                              : 'bg-white/[0.06] hover:bg-white/[0.12] text-champagne-200 border border-white/[0.1]'
                          }`}
                        >
                          {act.label}
                          {act.action === 'navigate' && <ExternalLink className="w-2.5 h-2.5 opacity-70" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Footer: Timestamp, Speech, Copy */}
                  <div className="flex items-center justify-between mt-2 pt-1 text-[9px] text-cream-200/40">
                    <span className="flex items-center gap-1">
                      {msg.timestamp}
                      {msg.source && <span className="opacity-60">• {msg.source}</span>}
                    </span>

                    <div className="flex items-center gap-2">
                      {msg.sender === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.text)}
                          title="Listen to response"
                          className="hover:text-champagne-300 transition-colors"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        title="Copy message"
                        className="hover:text-champagne-300 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] text-cream-100 flex-shrink-0 flex items-center justify-center mt-1 text-xs border border-white/[0.08]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-cream-200/80 bg-[#0B152B]/85 p-3 rounded-2xl w-fit border border-white/[0.08] shadow-sm animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-champagne-400" />
                <span>AI Sahayak is analyzing symptoms & matching skills...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-[#070D1E] border-t border-white/[0.08] flex gap-2 overflow-x-auto text-[10px] scrollbar-none flex-shrink-0">
            {CATEGORIZED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.query)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-cream-200/80 hover:text-champagne-300 border border-white/[0.08] transition-colors flex-shrink-0 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#070D1E] border-t border-white/[0.08] flex items-center gap-2 flex-shrink-0"
          >
            {/* Voice Dictation (Speech-to-Text) */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Listening... click to stop" : "Voice input in Hindi/English"}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse ring-2 ring-rose-500/30'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-cream-200/70 hover:text-champagne-300 border-white/[0.1]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? "Listening... बोलिए..." : "Describe problem (e.g. पंखा नहीं चल रहा)..."}
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-xs text-white placeholder-cream-200/35 focus:outline-none focus:border-champagne-400/60 focus:ring-1 focus:ring-champagne-400/50"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 bg-gradient-to-r from-rose-500 via-champagne-400 to-amber-400 hover:brightness-110 disabled:opacity-35 text-navy-950 font-bold rounded-xl shadow-md transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
        className="group relative flex items-center gap-3 bg-gradient-to-r from-rose-500 via-espresso-700 to-[#0B152B] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_10px_35px_rgba(244,63,94,0.35)] hover:shadow-[0_15px_45px_rgba(244,63,94,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 border border-champagne-400/40"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-champagne-400 to-rose-400 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-navy-950 animate-pulse" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-[#070D1E] animate-ping" />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-xs tracking-tight text-white leading-none">
              AI Sahayak
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-champagne-200/80 font-medium leading-none mt-1">
            Symptom Doctor & Match
          </span>
        </div>
      </button>
    </div>
  );
}
