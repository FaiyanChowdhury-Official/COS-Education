import React, { useState } from 'react';
import { 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Award, 
  Globe, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Calendar, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  FileCheck, 
  Plane, 
  PhoneCall, 
  Users, 
  ChevronRight,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { 
  COMPANY_INFO, 
  DESTINATIONS, 
  UNIVERSITIES, 
  PROGRAMS, 
  SCHOLARSHIPS, 
  SUCCESS_STORIES, 
  BLOG_POSTS 
} from '../data/mockData';
import { SEOHelper } from '../components/SEOHelper';

interface HomePageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenConsultationModal }) => {
  // Quick Program Finder state in Hero/Preview
  const [quickSearch, setQuickSearch] = useState('');
  const [quickCountry, setQuickCountry] = useState('all');
  const [quickDegree, setQuickDegree] = useState('all');

  const handleProgramSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('programs');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHelper
        title="Connecting Students with Global Education Opportunities"
        description="COS Education is an international student recruitment and education partner, connecting students with universities and higher education institutions across the world."
        canonicalPath="/"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Autumn 2026 & Spring 2027 Admissions Open</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.12]">
                Your Journey to <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Global Education
                </span> Starts Here.
              </h1>

              {/* Exact Required Description */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore world-class universities, discover the right program, and get expert support throughout your journey from application to visa.
              </p>

              {/* Exact Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('destinations')}
                  id="hero-btn-explore-destinations"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Destinations</span>
                </button>

                <button
                  onClick={() => onOpenConsultationModal()}
                  id="hero-btn-book-consultation"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Micro-proof pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  International Student Recruitment & Education Partner
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Sylhet Chowhatta Point Office
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Up to 100% Scholarship Support
                </span>
              </div>
            </div>

            {/* Right Visual Column (International Student Showcase) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Photo Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-2xl shadow-blue-950/50 aspect-4/3 sm:aspect-5/4">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                    alt="International university students studying abroad"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {/* Photo Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇬🇧 🇫🇮 🇺🇸 🇲🇾</span>
                        <div>
                          <p className="font-semibold text-white">Global University Network</p>
                          <p className="text-[11px] text-slate-300">Connecting Students with Global Universities</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        95% Visa Rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Success Card Overlay */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white text-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">500+ Students</p>
                    <p className="text-[11px] text-slate-500">Successfully Placed Globally</p>
                  </div>
                </div>

                {/* Floating Visa Approval Badge Overlay */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Fast-Track Visa</p>
                    <p className="text-[11px] text-slate-400">UK, Finland, US F-1 & EU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Expert Guidance</h4>
                <p className="text-[11px] text-slate-500 hidden sm:block">Personalized profile matching</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">University Application</h4>
                <p className="text-[11px] text-slate-500 hidden sm:block">Priority admission processing</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Visa Assistance</h4>
                <p className="text-[11px] text-slate-500 hidden sm:block">Mock drills & document audit</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Pre-Departure Support</h4>
                <p className="text-[11px] text-slate-500 hidden sm:block">Ticketing, housing & briefings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC-READY STATISTICS */}
      <section className="py-14 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Proven Track Record</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
              Empowering Students Across Sylhet & Bangladesh
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPANY_INFO.stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-display tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800">{stat.label}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DESTINATIONS CARDS (UK, Finland, Malaysia, USA, Greece, Malta, Cyprus) */}
      <section className="py-20 bg-white" id="featured-destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Top Study Destinations</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">Explore Global Opportunities</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Compare tuition fees, post-study work visas, popular courses, and scholarship policies across our 7 featured countries.
              </p>
            </div>
            <button
              onClick={() => onNavigate('destinations')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>Explore All 7 Countries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image + Flag */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.coverImage}
                    alt={`Study in ${dest.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5">
                    <span className="text-base">{dest.flag}</span>
                    <span className="text-slate-800">{dest.name}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-semibold bg-blue-600/90 px-2 py-0.5 rounded-md">
                      {dest.postStudyWork.split(' ')[0]} {dest.postStudyWork.split(' ')[1] || 'Stay Back'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Study in {dest.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {dest.shortDescription}
                    </p>
                  </div>

                  {/* Program and Tuition snapshot */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Popular Programs:</span>
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {dest.popularPrograms.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 text-[11px]">Tuition Range:</span>
                      <span className="font-semibold text-slate-900 text-[11px]">{dest.tuitionRange.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => onNavigate('destinations', dest.slug)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 text-xs font-semibold transition-colors text-center cursor-pointer"
                    >
                      Guide & Details
                    </button>
                    <button
                      onClick={() => onOpenConsultationModal(dest.slug)}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      title={`Book consultation for ${dest.name}`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY COS EDUCATION (6 PROFESSIONAL BENEFIT CARDS) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Your Advantage</span>
            <h2 className="text-3xl font-bold font-display mt-1 text-white">
              Why Students Choose COS Education
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Combining transparent counseling, certified institutional contracts, and end-to-end guidance from Sylhet to your university campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Personalized Guidance */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Personalized Guidance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                No cookie-cutter recommendations. We assess your unique academic history, financial capability, study gaps, and career vision to craft a bespoke pathway.
              </p>
            </div>

            {/* 2. University Matching */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">University Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connecting students with a growing network of global universities, ensuring your profile matches program prerequisites with maximum admission certainty.
              </p>
            </div>

            {/* 3. Application Support */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Application Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Meticulous document checks, application fee waivers, SOP & CV polish, and prioritized liaison with international admission officers.
              </p>
            </div>

            {/* 4. Scholarship Guidance */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Scholarship Guidance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strategic identification of early-bird discounts, merit bursaries, and up to 100% tuition waivers in destinations like Finland and the UK.
              </p>
            </div>

            {/* 5. Visa Assistance */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Visa Assistance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bank solvency audits, strict compliance with the UK 28-day rule, and realistic 1-on-1 mock embassy interview simulations maintaining a 95%+ pass rate.
              </p>
            </div>

            {/* 6. Pre-Departure Support */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-4">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Pre-Departure Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Airport transit support, student baggage concession ticketing, university dorm booking, and connection with COS Education alumni networks abroad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (01 TO 06 VISUAL PROCESS) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step-by-Step Pathway</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">How It Works</h2>
            <p className="text-slate-600 text-sm mt-2">
              From your initial profile assessment at our Sylhet office to your arrival abroad, our structured roadmap ensures zero mistakes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-blue-600/20 font-display block mb-2">01</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Profile Assessment</h4>
              <p className="text-xs text-slate-600">Reviewing CGPA, English level, budget, and career ambitions.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-indigo-600/20 font-display block mb-2">02</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">University Selection</h4>
              <p className="text-xs text-slate-600">Shortlisting high-acceptance universities and degree courses.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-sky-600/20 font-display block mb-2">03</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Application</h4>
              <p className="text-xs text-slate-600">SOP editing, portal filing, and priority agent verification.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-emerald-600/20 font-display block mb-2">04</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Offer & CAS</h4>
              <p className="text-xs text-slate-600">Receiving unconditional offers and CAS / I-20 documentation.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-amber-600/20 font-display block mb-2">05</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Visa Filing</h4>
              <p className="text-xs text-slate-600">Solvency checks, mock embassy drills, and VFS biometrics.</p>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-purple-600/20 font-display block mb-2">06</span>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Pre-Departure</h4>
              <p className="text-xs text-slate-600">Student air ticketing, housing, and arrival onboarding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED UNIVERSITIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Global University Network</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">Connecting Students with a Growing Network of Global Universities</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                Our growing global university network enables us to provide students with diverse opportunities across multiple study destinations, academic disciplines, and levels of study.
              </p>
            </div>
            <button
              onClick={() => onNavigate('universities')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>View All Universities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UNIVERSITIES.slice(0, 6).map((uni) => (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={uni.coverImage}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs">
                    {uni.country}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-xs font-medium text-slate-300">{uni.city}</p>
                    <p className="text-sm font-bold text-white line-clamp-1">{uni.ranking}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {uni.overview}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tuition Range:</span>
                      <span className="font-semibold text-slate-800">{uni.tuitionRange.split('(')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scholarships:</span>
                      <span className="font-semibold text-emerald-600">{uni.scholarshipsAvailable.split(' ')[0]} {uni.scholarshipsAvailable.split(' ')[1] || 'Available'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('universities', uni.slug)}
                      className="flex-1 py-2 px-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 text-xs font-semibold text-center transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenConsultationModal(uni.countrySlug)}
                      className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PROGRAM FINDER PREVIEW */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Search className="w-3.5 h-3.5" />
              Curated Program Database
            </span>
            <h2 className="text-3xl font-bold font-display text-white">
              Discover Degree Programs Matching Your Ambition
            </h2>
            <p className="text-slate-300 text-sm">
              Search across bachelor’s, master’s, and diploma courses with intake timelines, tuition fees, and entry criteria.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 shadow-2xl">
            <form onSubmit={handleProgramSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Computer Science, MBA, Data Analytics..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  className="w-full bg-white pl-10 pr-3 py-2.5 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={quickCountry}
                  onChange={(e) => setQuickCountry(e.target.value)}
                  className="w-full bg-white px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-hidden"
                >
                  <option value="all">All Destinations</option>
                  {DESTINATIONS.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.flag} {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={quickDegree}
                  onChange={(e) => setQuickDegree(e.target.value)}
                  className="w-full bg-white px-3 py-2.5 rounded-xl text-slate-900 text-xs focus:outline-hidden"
                >
                  <option value="all">All Degrees</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  id="home-find-program-btn"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Find Your Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Popular Searches:</span>
              <button onClick={() => onNavigate('programs')} className="hover:underline hover:text-white cursor-pointer">
                MSc Data Science (UK)
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('programs')} className="hover:underline hover:text-white cursor-pointer">
                Finland Software Engineering
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('programs')} className="hover:underline hover:text-white cursor-pointer">
                Malaysia Dual Award Cyber Security
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SUCCESS STORIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Real Student Journeys</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">Student Success Stories</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Read how students from Sylhet and across Bangladesh achieved university offers, scholarships, and visa approvals.
              </p>
            </div>
            <button
              onClick={() => onNavigate('success-stories')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUCCESS_STORIES.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={story.photo}
                      alt={story.studentName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{story.studentName}</h4>
                      <p className="text-[11px] text-slate-500">{story.hometown}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 mb-3">
                    <CheckCircle2 className="w-3 h-3" />
                    {story.visaStatus}
                  </span>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs">
                  <p className="font-semibold text-slate-900">{story.university}</p>
                  <p className="text-slate-500 text-[11px]">{story.program}</p>
                  {story.scholarshipAwarded && (
                    <p className="text-blue-600 font-medium text-[11px] mt-1">
                      ★ {story.scholarshipAwarded}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FEATURED SCHOLARSHIPS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Financial Aid</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">Featured Scholarships 2026/27</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Explore fully funded waivers, government awards, and university merit discounts for international applicants.
              </p>
            </div>
            <button
              onClick={() => onNavigate('scholarships')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>Explore All Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCHOLARSHIPS.slice(0, 3).map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {sch.country}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600">
                      Deadline: {sch.deadline.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {sch.title}
                  </h3>

                  <div className="text-lg font-black text-emerald-600 font-display mb-2">
                    {sch.amount}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {sch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {sch.degreeLevel.join(', ')}
                  </span>
                  <button
                    onClick={() => onOpenConsultationModal()}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Check Eligibility →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BLOG & RESOURCE PREVIEW */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Knowledge Base</span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">Latest Guides & Insights</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                Expert commentary on visa updates, IELTS strategies, statement of purpose drafting, and living costs abroad.
              </p>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate('blog', post.slug)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 rounded-lg text-[11px] font-bold text-blue-600 shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. LARGE FINAL CTA (EXACT REQUIRED HEADLINE & BUTTONS) */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Empowering Your Future Today
          </span>

          {/* Exact Required Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display tracking-tight leading-tight">
            Ready to Start Your International Education Journey?
          </h2>

          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Take the first decisive step today. Book a free one-on-one session with our senior counseling team or run an instant eligibility check.
          </p>

          {/* Exact Required Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenConsultationModal()}
              id="final-cta-book-consultation"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-slate-100 font-bold text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('eligibility-checker')}
              id="final-cta-check-eligibility"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Check Eligibility</span>
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100">
            <span>📍 Visit us at Chowhatta Point, Sylhet</span>
            <span>•</span>
            <span>📞 Direct Hotline: {COMPANY_INFO.phone}</span>
            <span>•</span>
            <span>💬 Free WhatsApp Support 24/7</span>
          </div>
        </div>
      </section>
    </div>
  );
};
