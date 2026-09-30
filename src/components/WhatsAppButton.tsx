import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  // Fetch admin configured WhatsApp number and default greeting if set
  const getWhatsAppConfig = () => {
    try {
      const saved = localStorage.getItem('cos_admin_system_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber) {
          const cleanNumber = parsed.whatsappNumber.replace(/[^0-9]/g, '');
          return {
            number: cleanNumber || COMPANY_INFO.whatsappFormatted,
            greeting: parsed.whatsappDefaultGreeting || 'Hello COS Education! I would like to get a free study abroad consultation.',
          };
        }
      }
    } catch (e) {
      // Fallback
    }
    return {
      number: COMPANY_INFO.whatsappFormatted,
      greeting: 'Hello COS Education! I am interested in studying abroad and would like to get free consultation.',
    };
  };

  const config = getWhatsAppConfig();

  const handleSendWhatsApp = (msgToSend?: string) => {
    const text = encodeURIComponent(msgToSend || customMsg || config.greeting);
    window.open(`https://wa.me/${config.number}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  COS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">COS Education Sylhet</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Admissions Team Online Now
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs text-xs text-slate-700 leading-relaxed border border-slate-100">
              <p className="font-medium text-slate-900 mb-1">Assalamu Alaikum / Welcome!</p>
              <p>Looking for 2026/2027 university admissions, scholarships, or visa advice? Chat directly with our senior study abroad counselors on WhatsApp.</p>
            </div>

            {/* Quick Prompt Pills */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Inquiries:</p>
              <button 
                onClick={() => handleSendWhatsApp('Hi COS Education, I want to apply for UK September 2026 intake.')}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
              >
                🇬🇧 UK 2026 / 2027 Application & Visa
              </button>
              <button 
                onClick={() => handleSendWhatsApp('Hi COS Education, I want to know about Finland 100% scholarships.')}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
              >
                🇫🇮 Finland 100% Scholarships & Work Rights
              </button>
              <button 
                onClick={() => handleSendWhatsApp('Hi COS Education, can I book an in-person consultation at your Sylhet office?')}
                className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
              >
                📍 Visit Sylhet Office (Chowhatta Point)
              </button>
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendWhatsApp();
                }}
                placeholder="Type your question..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendWhatsApp()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="floating-whatsapp-btn"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Chat with COS Education on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
        <MessageCircle className="w-7 h-7" />
        
        {/* Tooltip on hover */}
        {!isOpen && (
          <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-900 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            Chat with Counselor on WhatsApp
          </span>
        )}
      </button>
    </div>
  );
};
