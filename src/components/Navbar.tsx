import React, { useState } from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Globe, 
  BookOpen,
  Award,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Bot,
  User,
  UserCheck,
  LogIn
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS } from '../data/mockData';
import { Logo } from './COSLogo';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (defaultDestination?: string) => void;
  onOpenAIAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenConsultationModal,
  onOpenAIAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const handleNav = (route: string, param?: string) => {
    onNavigate(route, param);
    setMobileMenuOpen(false);
    setDestDropdownOpen(false);
    setResourcesDropdownOpen(false);
  };

  const isRouteActive = (route: string) => {
    if (route === 'home' && currentRoute === 'home') return true;
    if (route !== 'home' && currentRoute.startsWith(route)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top Utility Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Chowhatta Point, Sylhet, Bangladesh</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Sat – Thu: 10:00 AM – 7:00 PM</span>
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href={`tel:${COMPANY_INFO.phone}`} 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{COMPANY_INFO.phone}</span>
            </a>
            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>{COMPANY_INFO.email}</span>
            </a>
            <button
              onClick={() => handleNav('events')}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fairs & Webinars</span>
            </button>
            <button
              onClick={() => handleNav('ai-evaluation')}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Evaluation</span>
            </button>
            <button
              onClick={() => handleNav('student-portal')}
              className="inline-flex items-center gap-1 text-blue-300 hover:text-white font-medium cursor-pointer px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/60"
              title="Access Student Application & Timeline Portal"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Student Portal</span>
            </button>
            <button
              onClick={() => handleNav('counsellor')}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-medium cursor-pointer px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60"
              title="Access Counsellor Admissions Desk"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Counsellor Desk</span>
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium cursor-pointer px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Staff CRM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Official COS Education Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('home');
            }}
            className="flex items-center cursor-pointer group py-1 text-left focus:outline-hidden"
            id="nav-brand-logo"
            aria-label="COS Education"
            title="COS Education - Community for Overseas Study"
          >
            <Logo className="h-10 sm:h-12 lg:h-13 w-auto transition-transform duration-200 group-hover:scale-[1.02]" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 font-medium text-sm text-slate-700">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('home') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Destinations Dropdown */}
            <div className="relative" onMouseLeave={() => setDestDropdownOpen(false)}>
              <button
                onMouseEnter={() => setDestDropdownOpen(true)}
                onClick={() => handleNav('destinations')}
                className={`px-3 py-2 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  isRouteActive('destinations') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>Study Destinations</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {destDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => setDestDropdownOpen(true)}
                >
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Target Countries
                  </div>
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest.slug}
                      onClick={() => handleNav('destinations', dest.slug)}
                      className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600 text-sm cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{dest.flag}</span>
                        <span className="font-medium">{dest.name}</span>
                      </span>
                      <span className="text-xs text-slate-600">{dest.tuitionRange.split('–')[0]}</span>
                    </button>
                  ))}
                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleNav('destinations')}
                      className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700 py-1.5 hover:bg-blue-50/50 rounded-lg cursor-pointer"
                    >
                      View All 7 Destinations →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('universities')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('universities') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Universities
            </button>

            <button
              onClick={() => handleNav('programs')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('programs') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Programs
            </button>

            <button
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('services') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Services
            </button>

            <button
              onClick={() => handleNav('scholarships')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('scholarships') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Scholarships
            </button>

            <button
              onClick={() => handleNav('success-stories')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('success-stories') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Success Stories
            </button>

            {/* Resources Dropdown */}
            <div className="relative" onMouseLeave={() => setResourcesDropdownOpen(false)}>
              <button
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                className={`px-3 py-2 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  isRouteActive('blog') || isRouteActive('events') || isRouteActive('faq')
                    ? 'text-blue-600 bg-blue-50/80 font-semibold'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              {resourcesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => setResourcesDropdownOpen(true)}
                >
                  <button
                    onClick={() => handleNav('blog')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>Guides & Articles</span>
                  </button>
                  <button
                    onClick={() => handleNav('events')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-amber-500" />
                    <span>Fairs & Webinars</span>
                  </button>
                  <button
                    onClick={() => handleNav('faq')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-sm cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>Frequently Asked Questions</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('about')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('about') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isRouteActive('contact') ? 'text-blue-600 bg-blue-50/80 font-semibold' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* AI Assistant Button */}
            {onOpenAIAssistant && (
              <button
                onClick={onOpenAIAssistant}
                id="nav-cta-ai-assistant"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            )}

            {/* Portal Login */}
            <button
              onClick={() => handleNav('login')}
              id="nav-cta-login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>Portal Login</span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => handleNav('eligibility-checker')}
              id="nav-cta-eligibility"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Check Your Eligibility</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => onOpenConsultationModal()}
              id="nav-cta-consultation"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => onOpenConsultationModal()}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Book Free
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <Logo className="h-9 w-auto" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('destinations')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600 flex justify-between items-center"
            >
              <span>Study Destinations</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">7 Countries</span>
            </button>
            <button
              onClick={() => handleNav('universities')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Universities Directory
            </button>
            <button
              onClick={() => handleNav('programs')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Program Finder
            </button>
            <button
              onClick={() => handleNav('services')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Our Services
            </button>
            <button
              onClick={() => handleNav('scholarships')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Scholarships
            </button>
            <button
              onClick={() => handleNav('success-stories')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Student Success Stories
            </button>
            <button
              onClick={() => handleNav('blog')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Resources & Blog
            </button>
            <button
              onClick={() => handleNav('events')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Fairs & Events
            </button>
            <button
              onClick={() => handleNav('about')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              About Us
            </button>
            <button
              onClick={() => handleNav('faq')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              FAQs
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Contact Sylhet Office
            </button>
            <button
              onClick={() => handleNav('ai-evaluation')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Profile Evaluation</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                New
              </span>
            </button>
            <button
              onClick={() => handleNav('student-portal')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-100 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Student Portal (Timeline & Status)</span>
            </button>
            <button
              onClick={() => handleNav('counsellor')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Counsellor Desk (Leads & Review)</span>
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Staff CRM & Admin Portal</span>
            </button>
          </div>

          <div className="pt-4 space-y-2">
            {onOpenAIAssistant && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAIAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>Open AI Study Abroad Assistant</span>
              </button>
            )}
            <button
              onClick={() => handleNav('eligibility-checker')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-blue-600 text-blue-600 font-semibold text-sm hover:bg-blue-50"
            >
              <Award className="w-4 h-4" />
              <span>Check Your Eligibility</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultationModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md shadow-blue-600/20"
            >
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-col gap-1 text-center">
            <p className="font-medium text-slate-700">Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh</p>
            <p>Direct Hotline: {COMPANY_INFO.phone}</p>
          </div>
        </div>
      )}
    </header>
  );
};
