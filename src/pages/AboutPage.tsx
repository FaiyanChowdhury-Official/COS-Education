import React from 'react';
import { 
  Building2, 
  Target, 
  Eye, 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Users
} from 'lucide-react';
import { COMPANY_INFO, TEAM_MEMBERS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface AboutPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title="About Us | International Student Recruitment & Education Partner"
        description="COS Education helps students explore and access international higher education opportunities through our growing network of universities and educational institutions."
        canonicalPath="/about"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>International Student Recruitment & Education Partner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            About COS Education
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            COS Education helps students explore and access international higher education opportunities through our growing network of universities and educational institutions. We support students throughout their study-abroad journey, from university and course selection to application, admission, visa guidance, and pre-departure support.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'About Us' }]}
        onNavigate={onNavigate}
      />

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To empower every student in Bangladesh with transparent, accessible, and high-standard academic counselling, eliminating misinformation and navigating university admissions and visa clearances with 100% integrity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To become the most dependable and student-centric international student recruitment and education organization in South Asia, recognized across our global university network for excellence in candidate selection, documentation precision, and student welfare.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Core Pillars</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
              Ethical Standards & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Total Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear tuition schedules, genuine visa assessment, zero concealed expenses, and real admission criteria upfront.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <Award className="w-8 h-8 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Certified Counselors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our advisors are certified and regularly trained by foreign education boards, British Council, and university delegates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <HeartHandshake className="w-8 h-8 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Student First Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We advocate for what best serves the student’s long-term career outcome, maintaining a transparent and student-first approach across all applications.
              </p>
            </div>
          </div>
        </section>

        {/* Sylhet Presence Section */}
        <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Physical Office in Sylhet</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Conveniently Located at Chowhatta Point, Sylhet
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We understand that parents and students in the Sylhet division value face-to-face trust. Our modern counseling facility in Manru Shopping City welcomes walk-ins 6 days a week for in-depth profile analysis.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated document verification room & mock interview studio</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={() => onOpenConsultationModal()}
              className="py-3 px-6 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer text-center"
            >
              Book In-Person Sylhet Appointment
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="py-3 px-6 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs transition-all cursor-pointer text-center"
            >
              Get Directions & Contact Info
            </button>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Experienced Mentors</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
              Meet Our Senior Counselors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-600"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs font-semibold text-blue-600">{member.role}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{member.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
