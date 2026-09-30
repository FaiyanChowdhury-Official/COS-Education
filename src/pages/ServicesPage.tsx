import React from 'react';
import { 
  Compass, 
  Building2, 
  FileCheck, 
  PenTool, 
  Award, 
  ShieldCheck, 
  Wallet, 
  Plane, 
  Home, 
  CheckCircle2, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { SERVICES, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface ServicesPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title="Our Services | Complete Study Abroad Guidance in Sylhet"
        description="From academic counseling and SOP review to visa application audits and pre-departure briefings, explore COS Education's full-spectrum services."
        canonicalPath="/services"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>End-to-End Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Our Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every step of your international education journey handled with rigorous standards, professional ethics, and transparent guidance.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Services' }]}
        onNavigate={onNavigate}
      />

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <span className="text-lg font-display">0{idx + 1}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Full Support
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Key Benefits:</span>
                  {service.keyBenefits.map((d: string, dIdx: number) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenConsultationModal()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Request This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Commitment Banner */}
        <div className="mt-16 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Our Ethical Promise</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              Zero Hidden Charges. Certified Consultants.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We never collect unauthorized charges or fabricate academic papers. Every submission is handled with professional integrity across our global education network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onOpenConsultationModal()}
              className="px-6 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Book Free Profile Audit
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl border border-white/30 hover:border-white text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Visit Our Sylhet Office
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
