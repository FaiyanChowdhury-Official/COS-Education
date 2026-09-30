import React from 'react';
import { 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Calendar, 
  Languages, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Briefcase, 
  Building2,
  Share2
} from 'lucide-react';
import { PROGRAMS, UNIVERSITIES, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface ProgramDetailPageProps {
  slug: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenConsultationModal,
}) => {
  const prog = PROGRAMS.find((p) => p.slug === slug) || PROGRAMS[0];
  const uni = UNIVERSITIES.find((u) => u.slug === prog.universitySlug);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title={`${prog.name} | ${prog.universityName}`}
        description={`${prog.name} at ${prog.universityName}, ${prog.country}. Tuition: ${prog.tuition}. Intakes: ${prog.intakes.join(', ')}. Check entry criteria and apply.`}
        canonicalPath={`/programs/${prog.slug}`}
      />

      {/* Program Banner */}
      <section className="bg-slate-900 text-white pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              {prog.degree} Degree
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              {prog.country}
            </span>
            {prog.scholarshipAvailable && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                ★ Scholarship Eligible
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            {prog.name}
          </h1>

          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <button
              onClick={() => onNavigate('universities', prog.universitySlug)}
              className="hover:text-blue-400 font-semibold underline underline-offset-4 cursor-pointer"
            >
              🏛️ {prog.universityName}
            </button>
            <span>•</span>
            <span>📍 {prog.country}</span>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Programs', route: 'programs' },
          { label: prog.name }
        ]}
        onNavigate={onNavigate}
      />

      {/* Highlights Metric Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Duration:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{prog.duration}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Annual Tuition:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{prog.tuition}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Next Intakes:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{prog.intakes.join(', ')}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">English Score:</span>
            <span className="text-sm sm:text-base font-bold text-blue-600">{prog.englishRequirement}</span>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Program Overview</h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {prog.overview}
              </p>
            </section>

            {/* Entry & English Requirements */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Academic & English Criteria</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Academic Requirements:</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {prog.entryRequirements}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">English Proficiency:</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {prog.englishRequirement}
                  </p>
                </div>
              </div>
            </section>

            {/* Scholarships & Financial Support */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Scholarships & Waivers</h2>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <Award className="w-4 h-4" />
                  <span>Available Financial Relief:</span>
                </div>
                <p>{prog.scholarshipDetails}</p>
              </div>
            </section>

            {/* Career Outcomes */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Career Opportunities</h2>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Graduates from this program qualify for high-demand professional roles and post-study work authorization in {prog.country}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {prog.careerOutcomes.map((career, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{career}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Fast-Track Application</span>
                <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                  Apply for this Program
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  We prepare your Statement of Purpose (SOP), verify transcripts, and submit directly to {prog.universityName}.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onOpenConsultationModal(prog.countrySlug)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply with Free Counseling</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('eligibility-checker')}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-blue-400 text-slate-800 text-xs font-semibold transition-all hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Check Program Eligibility</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                <p>COS Education is an authorized agent. No charge for eligible student placement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
