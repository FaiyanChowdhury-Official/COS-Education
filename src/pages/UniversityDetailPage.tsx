import React from 'react';
import { 
  Building2, 
  MapPin, 
  Award, 
  DollarSign, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Globe, 
  Languages, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { UNIVERSITIES, PROGRAMS, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface UniversityDetailPageProps {
  slug: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const UniversityDetailPage: React.FC<UniversityDetailPageProps> = ({
  slug,
  onNavigate,
  onOpenConsultationModal,
}) => {
  const uni = UNIVERSITIES.find((u) => u.slug === slug) || UNIVERSITIES[0];

  // Programs offered at this university
  const uniPrograms = PROGRAMS.filter((p) => p.universitySlug === uni.slug);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title={`${uni.name} | Admissions, Courses, Fees & Scholarships`}
        description={`Apply to ${uni.name} in ${uni.city}, ${uni.country}. Check tuition fees, entry requirements, scholarships, and priority application deadlines.`}
        canonicalPath={`/universities/${uni.slug}`}
      />

      {/* University Banner */}
      <section className="relative bg-slate-900 text-white pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={uni.coverImage}
            alt={uni.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-xl border border-white/20 shrink-0 overflow-hidden">
              <img
                src={uni.logo}
                alt={`${uni.name} logo`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  {uni.country}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  {uni.ranking}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  {uni.type} Institution
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                {uni.name}
              </h1>

              <p className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{uni.city}, {uni.country}</span>
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOpenConsultationModal(uni.countrySlug)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Apply to {uni.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Universities', route: 'universities' },
          { label: uni.name }
        ]}
        onNavigate={onNavigate}
      />

      {/* Quick Metrics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Tuition Range:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{uni.tuitionRange.split('(')[0]}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Application Fee:</span>
            <span className="text-sm sm:text-base font-bold text-emerald-600">{uni.applicationFee}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Active Intakes:</span>
            <span className="text-sm sm:text-base font-bold text-slate-900">{uni.intakes.join(', ')}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Scholarships:</span>
            <span className="text-sm sm:text-base font-bold text-blue-600">{uni.scholarshipsAvailable.split(' ')[0]} Available</span>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-display">About {uni.name}</h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {uni.overview}
              </p>

              {/* Highlights */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Key Highlights:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {uni.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Admission & English Requirements */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">Requirements & Deadlines</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Entry Requirements
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {uni.entryRequirements}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-amber-600" />
                    English Language Requirements
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {uni.englishRequirements}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Upcoming Application Deadline:</span>
                </p>
                <p>{uni.applicationDeadline}</p>
              </div>
            </section>

            {/* Featured Programs */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Available Degrees & Programs
                </h2>
                <button
                  onClick={() => onNavigate('programs')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  All Programs →
                </button>
              </div>

              {uniPrograms.length > 0 ? (
                <div className="space-y-4">
                  {uniPrograms.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {prog.degree} Degree
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{prog.name}</h4>
                        <p className="text-xs text-slate-500">Duration: {prog.duration} • Tuition: {prog.tuition}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('programs', prog.slug)}
                          className="py-2 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 cursor-pointer"
                        >
                          Program Details
                        </button>
                        <button
                          onClick={() => onOpenConsultationModal(uni.countrySlug)}
                          className="py-2 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  {uni.name} offers over {uni.programsCount} programs across business, technology, engineering, and humanities. Contact COS Education for custom syllabus checklists.
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">University Application Guidance</span>
                <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                  Apply via COS Education
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Enjoy priority conditional offer processing, application fee waivers, and structured admission liaison.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Website:</span>
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Fee:</span>
                  <span className="font-bold text-emerald-600">{uni.applicationFee}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onOpenConsultationModal(uni.countrySlug)}
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
                  <span>Check Admission Eligibility</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                <span>📍 Sylhet Office: Lift-03, Floor-04, Manru Shopping City, Chowhatta Point</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
