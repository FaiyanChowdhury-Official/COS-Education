import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Building2, 
  HelpCircle, 
  Award, 
  BookOpen, 
  Calendar, 
  Languages, 
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Send
} from 'lucide-react';
import { DESTINATIONS, UNIVERSITIES, PROGRAMS, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface DestinationDetailPageProps {
  slug: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenConsultationModal,
}) => {
  const dest = DESTINATIONS.find((d) => d.slug === slug) || DESTINATIONS[0];

  // Active accordion state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Universities in this country
  const countryUniversities = UNIVERSITIES.filter(
    (u) => u.countrySlug === dest.slug
  );

  // Programs in this country
  const countryPrograms = PROGRAMS.filter(
    (p) => p.countrySlug === dest.slug
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title={`Study in ${dest.name} | Admissions, Scholarships & Visa Guide`}
        description={dest.shortDescription}
        canonicalPath={`/destinations/${dest.slug}`}
      />

      {/* Hero Cover Header */}
      <section className="relative bg-slate-900 text-white pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={dest.coverImage}
            alt={`Study in ${dest.name}`}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <span className="text-lg">{dest.flag}</span>
              <span>Official Study Guide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
              Study in {dest.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {dest.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenConsultationModal(dest.slug)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Book Free {dest.name} Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('eligibility-checker')}
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Check Eligibility
              </button>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Study Destinations', route: 'destinations' },
          { label: dest.name }
        ]}
        onNavigate={onNavigate}
      />

      {/* Quick Fact Metric Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Tuition Fees:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{dest.tuitionRange.split('(')[0]}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Living Cost:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{dest.livingCost}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Post-Study Work:</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600">{dest.postStudyWork}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Work While Studying:</span>
            <span className="text-sm sm:text-base font-bold text-blue-600">{dest.workRights.split('during')[0]}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. OVERVIEW */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Overview of Studying in {dest.name}
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {dest.overview}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {dest.popularPrograms.map((prog, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                    ✓ {prog}
                  </span>
                ))}
              </div>
            </section>

            {/* 2. WHY STUDY HERE */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Why Study in {dest.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dest.whyStudyHere.map((reason, idx) => (
                  <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{reason.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. TUITION & SCHOLARSHIPS */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Tuition Fees & Scholarships
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Tuition fees vary based on degree level and institution. {dest.scholarshipInfo}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">Estimated Annual Tuition</span>
                  <span className="text-lg font-bold text-slate-900">{dest.tuitionRange}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Scholarship Opportunities</span>
                  <span className="text-sm font-semibold text-slate-900">Merit & Early-Bird Awards</span>
                </div>
              </div>
            </section>

            {/* 4. WORK & POST-STUDY OPPORTUNITIES */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Work Rights & Post-Study Career Pathways
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Part-Time Work During Studies
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dest.workRights}. This allows international students to earn part of their living expenses while gaining local work experience.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Post-Study Work Authorization
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dest.postStudyWork}. Graduates can switch directly into full-time employment visas or permanent residency pathways depending on local policies.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. ENTRY & ENGLISH REQUIREMENTS */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Entry & English Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Academic Entry Criteria
                  </h4>
                  <div className="text-xs space-y-2 text-slate-600">
                    <p><strong className="text-slate-800">Undergraduate:</strong> {dest.entryRequirements.undergraduate}</p>
                    <p><strong className="text-slate-800">Postgraduate:</strong> {dest.entryRequirements.postgraduate}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-amber-600" />
                    English Language Tests
                  </h4>
                  <div className="text-xs space-y-2 text-slate-600">
                    <p><strong className="text-slate-800">IELTS Score:</strong> {dest.englishRequirements.ielts}</p>
                    {dest.englishRequirements.waiverPossible && (
                      <p className="text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100 font-medium">
                        ✓ English waiver possible: {dest.englishRequirements.waiverNote || 'Accepted via MOI or internal tests.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 6. POPULAR UNIVERSITIES IN THIS DESTINATION */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Featured Universities in {dest.name}
                </h2>
                <button
                  onClick={() => onNavigate('universities')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All Directory →
                </button>
              </div>

              {countryUniversities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {countryUniversities.map((uni) => (
                    <div
                      key={uni.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 bg-slate-50/50"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{uni.ranking}</span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{uni.name}</h4>
                        <p className="text-xs text-slate-500">{uni.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onNavigate('universities', uni.slug)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600"
                        >
                          View Uni
                        </button>
                        <button
                          onClick={() => onOpenConsultationModal(dest.slug)}
                          className="py-1.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  We connect students with top-tier institutions across {dest.name}. Contact our Sylhet admissions office to explore university opportunities.
                </div>
              )}
            </section>

            {/* 7. FAQS */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Frequently Asked Questions about {dest.name}
              </h2>
              <div className="space-y-3">
                {dest.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between font-semibold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                          openFaqIndex === idx ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Consultation Booking Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Free Study Abroad Guidance</span>
                <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                  Apply for {dest.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Get certified admission assistance, document audits, and visa coaching with our Sylhet counselors.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free assessment of your academic CGPA</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full application and admission support</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1-on-1 embassy visa mock interviews</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onOpenConsultationModal(dest.slug)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('eligibility-checker')}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-blue-400 text-slate-800 text-xs font-semibold transition-all hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Check Your Eligibility</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
                <p>Visit our Sylhet Office at Chowhatta Point or join via Google Meet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
