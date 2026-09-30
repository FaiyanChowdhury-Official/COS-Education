import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Send,
  MessageCircle
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS, SERVICES } from '../data/mockData';
import { COSLogo } from './COSLogo';

interface FooterProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultationModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Pre-footer Highlight Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trusted Study Abroad Mentorship
            </span>
            <h3 className="text-2xl font-bold text-white font-display">Plan Your 2026 / 2027 Intakes With Total Confidence</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Free 1-on-1 counseling at our Sylhet office or online with experienced international education advisors.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('eligibility-checker')}
              className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-white text-sm font-medium transition-all hover:bg-slate-800 cursor-pointer"
            >
              Check Eligibility
            </button>
            <button
              onClick={() => onOpenConsultationModal()}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Sylhet Headquarters */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')} title="COS Education - Community for Overseas Study">
              <COSLogo className="h-11 sm:h-12 w-auto transition-transform group-hover:scale-105" variant="dark" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              COS Education is an international student recruitment and education partner, connecting students with universities and higher education institutions across the world.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors">{COMPANY_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.email}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Get Intake & Scholarship Alerts</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you! You will receive our latest scholarship updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Study Destinations */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              {DESTINATIONS.map((d) => (
                <li key={d.slug}>
                  <button
                    onClick={() => onNavigate('destinations', d.slug)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer py-0.5"
                  >
                    <span>{d.flag}</span>
                    <span>Study in {d.name}</span>
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('destinations')}
                  className="text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  View All Destinations →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              {SERVICES.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onNavigate('services', s.slug)}
                    className="hover:text-indigo-300 transition-colors text-left cursor-pointer py-0.5"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('services')}
                  className="text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  View All 11 Services →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Student Help */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('universities')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  University Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('programs')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Find Programs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scholarships')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Scholarships 2026/27
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('success-stories')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Student Success Stories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Fairs & Webinars
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Articles & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  About COS Education
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-evaluation')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer py-0.5 flex items-center gap-1">
                  <span>⚡ AI Profile Evaluation</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer py-0.5 flex items-center gap-1">
                  <span>🔒 Staff CRM & Admin Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer py-0.5">
                  Sylhet Office Location & Map
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links Row */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400">
          <p className="text-slate-400">
            COS Education — Connecting Students with Global Education Opportunities
          </p>

          <div className="flex items-center space-x-4">
            <a 
              href={COMPANY_INFO.social.facebook} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <span>•</span>
            <a 
              href={COMPANY_INFO.social.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <span>•</span>
            <a 
              href={COMPANY_INFO.social.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <span>•</span>
            <a 
              href={COMPANY_INFO.social.youtube} 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              YouTube
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} COS Education. All rights reserved. International Student Recruitment & Education Partner • Sylhet, Bangladesh.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer" onClick={() => onNavigate('about')}>Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer" onClick={() => onNavigate('about')}>Terms of Service</span>
            <span className="text-slate-400">Disclaimer: Admissions and visa grants are strictly subject to individual institutional and foreign immigration authority regulations.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
