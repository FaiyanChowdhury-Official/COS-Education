import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  AlertCircle,
  Calendar,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  verifiedNotice?: string;
}

const QUICK_QUESTIONS = [
  'Which country may suit my profile?',
  'What programs could I consider?',
  'What documents are generally required?',
  'What is the approximate tuition?',
  'What is the application process?',
  'What scholarships may be relevant?',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I am your **COS Study Abroad Assistant**. 🎓\n\nI can help you explore university options, tuition ranges, visa steps, and scholarship benchmarks across the UK, Finland, USA, Malaysia, and Europe.\n\n*Please note: My suggestions provide general guidance. Official admissions & visas require verification with COS Education counsellors.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: text,
          messages: [...messages, userMsg],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedNotice: data.verifiedNotice,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `I am currently experiencing higher-than-normal enquiry volume. For immediate official guidance on this question, our senior admissions team is on standby at Chowhatta Point, Sylhet or available via online consultation!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] sm:h-[750px] max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">COS Study Abroad Assistant</h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Instant preliminary advice for UK, Finland, USA, Malaysia & Europe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Regulatory Safeguard Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-900 shrink-0">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Official Advisory:</strong> AI responses provide general educational guidance. We do not guarantee admission or visas. Final decisions depend on institutional and immigration authorities.
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 text-slate-800">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line prose-sm">
                  {msg.content.split('\n').map((line, i) => {
                    // Render bold formatting
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={i} className={line.startsWith('* ') || line.startsWith('• ') ? 'pl-2 my-0.5' : 'my-1'}>
                        {parts.map((p, j) => {
                          if (p.startsWith('**') && p.endsWith('**')) {
                            return <strong key={j} className="font-bold">{p.slice(2, -2)}</strong>;
                          }
                          if (p.startsWith('*') && p.endsWith('*')) {
                            return <em key={j} className="italic text-slate-500">{p.slice(1, -1)}</em>;
                          }
                          return p;
                        })}
                      </p>
                    );
                  })}
                </div>

                <div
                  className={`flex items-center justify-between text-[10px] mt-2 pt-1 border-t ${
                    msg.role === 'user' ? 'border-blue-500/40 text-blue-200' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.verifiedNotice && (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Benchmark Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150"></span>
                <span className="text-[11px] font-medium text-slate-400 ml-1">Consulting COS Knowledge Base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="bg-white border-t border-slate-100 px-4 py-2.5 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Ask AI:
            </span>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-slate-700 border border-slate-200 text-xs transition-all whitespace-nowrap disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & CTA */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about destination criteria, fees, visa rules, or English waivers..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
            <span>
              Need personalized case assessment? Visit our Sylhet office or speak to our team.
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Free Counsellor Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
