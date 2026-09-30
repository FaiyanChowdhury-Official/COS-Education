import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  DollarSign, 
  Globe, 
  Languages, 
  Calendar,
  Briefcase,
  Clock,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import { DESTINATIONS, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';
import { EligibilitySubmission } from '../types';
import { getMarketingAttribution } from '../utils/marketingAttribution';

interface EligibilityCheckerPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const EligibilityCheckerPage: React.FC<EligibilityCheckerPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    qualification: 'Bachelor Degree (4 Years)',
    cgpa: '3.25',
    graduationYear: '2023',
    studyGap: '1 Year',
    englishTest: 'IELTS',
    englishScore: '6.5',
    budget: '15 to 25 Lakh BDT (~£10,000 - £16,000)',
    preferredDestination: 'uk',
    preferredDegree: 'Master',
    workExperience: '1-2 Years Professional Experience',
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    // Save lead in localStorage for CRM ready Phase 2 integration
    const submission: EligibilitySubmission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      academicQualification: formData.qualification,
      cgpa: formData.cgpa,
      graduationYear: formData.graduationYear,
      studyGap: formData.studyGap,
      englishTest: formData.englishTest,
      englishScore: formData.englishScore,
      budget: formData.budget,
      preferredCountry: formData.preferredDestination,
      preferredDegree: formData.preferredDegree,
      intake: 'Upcoming Intake',
      workExperience: formData.workExperience,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('cos_eligibility_leads') || '[]');
      localStorage.setItem('cos_eligibility_leads', JSON.stringify([submission, ...existing]));
    } catch (err) {
      console.warn('Storage error', err);
    }

    // Comprehensive rule-based scoring engine
    setTimeout(() => {
      const cgpaNum = parseFloat(formData.cgpa) || 3.0;
      const englishNum = parseFloat(formData.englishScore) || 6.0;

      let score = 'Strong';
      let scoreColor = 'emerald';
      let successRate = '92%';

      if (cgpaNum >= 3.5 && englishNum >= 6.5) {
        score = 'Exceptional Profile';
        scoreColor = 'emerald';
        successRate = '96%';
      } else if (cgpaNum < 2.75 || englishNum < 5.5) {
        score = 'Conditional / Pathway Needed';
        scoreColor = 'amber';
        successRate = '78%';
      }

      // Potential destination recommendations
      const potentialDestinations = [
        {
          country: 'United Kingdom',
          flag: '🇬🇧',
          suitability: cgpaNum >= 2.6 ? 'High Match' : 'Pathway Match',
          notes: 'Direct 1-year master’s with 2-year Graduate Route visa.'
        },
        {
          country: 'Finland',
          flag: '🇫🇮',
          suitability: cgpaNum >= 3.0 ? 'High Match' : 'Possible with Entrance Exam',
          notes: 'Low living cost, Schengen EU residency, and scholarship waivers.'
        },
        {
          country: 'Malaysia',
          flag: '🇲🇾',
          suitability: 'Very High Match',
          notes: 'UK dual degrees at 60% lower tuition with swift visa approvals.'
        },
        {
          country: 'United States',
          flag: '🇺🇸',
          suitability: cgpaNum >= 3.0 ? 'Strong Match' : 'Community College / Pathway',
          notes: 'OPT STEM up to 3 years post-graduation.'
        }
      ];

      // Concerns analysis
      const concerns: string[] = [];
      if (formData.studyGap.includes('2') || formData.studyGap.includes('3') || formData.studyGap.includes('4')) {
        concerns.push('Study gap needs official job experience certificates and salary bank statements to satisfy embassy rules.');
      }
      if (englishNum < 6.0) {
        concerns.push('English score below standard direct intake threshold (6.0). Pre-sessional English or MOI waiver may be required.');
      }
      if (cgpaNum < 2.8) {
        concerns.push('CGPA is borderline for top-ranked public universities; targeted regional universities recommended.');
      }

      // Recommended next steps
      const steps = [
        'Organize official transcripts and provisional certificates from your college or university.',
        'Obtain bank solvency statement proving maintenance funds 28 days prior to visa filing.',
        'Schedule a 1-on-1 strategy session with our senior counselor at COS Education Sylhet.',
        'Finalize customized Statement of Purpose (SOP) addressing academic progression.'
      ];

      setResult({
        score,
        scoreColor,
        successRate,
        cgpaNum,
        englishNum,
        potentialDestinations,
        concerns,
        steps,
        studentName: formData.name
      });
      setIsCalculating(false);

      // Automatically register lead with marketing attribution & scoring signals
      try {
        const attribution = getMarketingAttribution();
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            country: formData.preferredDestination,
            program: formData.qualification,
            academicQualification: formData.qualification,
            cgpa: formData.cgpa,
            ielts: formData.englishTest,
            budget: formData.budget,
            source: 'Website Eligibility Checker',
            leadSourceCategory: attribution.leadSourceCategory,
            utmSource: attribution.utmSource,
            utmMedium: attribution.utmMedium,
            utmCampaign: attribution.utmCampaign,
            utmContent: attribution.utmContent,
            utmTerm: attribution.utmTerm,
            notes: `Eligibility Evaluated: Score ${score}/100. Study gap: ${formData.studyGap}, Work experience: ${formData.workExperience}, Budget: ${formData.budget}. Potential destinations: ${potentialDestinations.join(', ')}`,
          }),
        }).catch((e) => console.warn('Lead save notice:', e));
      } catch (err) {
        console.warn('Could not post lead from eligibility checker', err);
      }

      // Scroll to result view
      const resultElem = document.getElementById('eligibility-result');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title="AI Profile Eligibility Checker | Study Abroad Assessment"
        description="Check your eligibility for universities in the UK, Finland, USA, and Malaysia. Evaluate your CGPA, IELTS score, budget, and study gap with instant feedback."
        canonicalPath="/eligibility-checker"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Instant Profile Assessment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Check Your Eligibility
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Evaluate your chances of admission and visa approval. Receive tailored country recommendations, potential concerns, and next steps in minutes.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Check Eligibility' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Profile Evaluation Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please provide accurate academic and English test credentials for realistic evaluation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
              {/* Section 1: Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Contact & Identification</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mahfuzur Rahman"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Background */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>2. Academic Qualifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Highest Qualification</label>
                    <select
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="HSC / A-Levels / 12th Grade">HSC / A-Levels / 12th Grade</option>
                      <option value="Bachelor Degree (4 Years)">Bachelor Degree (4 Years)</option>
                      <option value="Bachelor Degree (3 Years Pass)">Bachelor Degree (3 Years Pass)</option>
                      <option value="Master Degree">Master Degree</option>
                      <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">GPA / CGPA</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3.40 out of 4.00"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Graduation Year</label>
                    <select
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="2026">2026 (Appearing)</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020 or earlier">2020 or earlier</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Study Gap (Years)</label>
                    <select
                      value={formData.studyGap}
                      onChange={(e) => setFormData({ ...formData, studyGap: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="No Gap (Fresh Graduate)">No Gap (Fresh Graduate)</option>
                      <option value="1 Year">1 Year</option>
                      <option value="2 Years">2 Years</option>
                      <option value="3 to 5 Years">3 to 5 Years</option>
                      <option value="Over 5 Years">Over 5 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Work Experience</label>
                    <select
                      value={formData.workExperience}
                      onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="None / Fresh Student">None / Fresh Student</option>
                      <option value="1-2 Years Professional Experience">1-2 Years Professional Experience</option>
                      <option value="3-5 Years Professional Experience">3-5 Years Professional Experience</option>
                      <option value="5+ Years Executive Experience">5+ Years Executive Experience</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: English Proficiency */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>3. English Proficiency</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">English Test Type</label>
                    <select
                      value={formData.englishTest}
                      onChange={(e) => setFormData({ ...formData, englishTest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="IELTS Academic">IELTS Academic</option>
                      <option value="PTE Academic">PTE Academic</option>
                      <option value="TOEFL iBT">TOEFL iBT</option>
                      <option value="Duolingo English Test (DET)">Duolingo English Test (DET)</option>
                      <option value="OIETC / ELLT">OIETC / ELLT Portal</option>
                      <option value="MOI (Medium of Instruction)">MOI (Medium of Instruction - No IELTS)</option>
                      <option value="Not taken yet">Not taken yet (Planning)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Score / Estimated Band</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.5 (or expected 6.0)"
                      value={formData.englishScore}
                      onChange={(e) => setFormData({ ...formData, englishScore: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Preferences & Budget */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>4. Study Preferences & Budget</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Preferred Destination</label>
                    <select
                      value={formData.preferredDestination}
                      onChange={(e) => setFormData({ ...formData, preferredDestination: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      {DESTINATIONS.map((d) => (
                        <option key={d.slug} value={d.slug}>
                          {d.flag} {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Target Degree</label>
                    <select
                      value={formData.preferredDegree}
                      onChange={(e) => setFormData({ ...formData, preferredDegree: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="Bachelor">Bachelor Degree</option>
                      <option value="Master">Master Degree</option>
                      <option value="Diploma">Diploma / Foundation</option>
                      <option value="PhD">Doctorate / PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Annual Budget (Tuition + Living)</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    >
                      <option value="Under 12 Lakh BDT (~£8,000)">Under 12 Lakh BDT (~£8,000)</option>
                      <option value="12 to 18 Lakh BDT (~£8,000 - £12,000)">12 to 18 Lakh BDT (~£8,000 - £12,000)</option>
                      <option value="18 to 28 Lakh BDT (~£12,000 - £18,000)">18 to 28 Lakh BDT (~£12,000 - £18,000)</option>
                      <option value="28 Lakh+ BDT (~£20,000+)">28 Lakh+ BDT (~£20,000+)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCalculating ? (
                    <span>Evaluating Academic Metrics...</span>
                  ) : (
                    <>
                      <span>Analyze Profile & Generate Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* RESULT VIEW */
          <div id="eligibility-result" className="space-y-8 animate-in fade-in duration-300">
            {/* Disclaimer Callout */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">
                  Preliminary assessment only — official assessment required by COS Education counsellor.
                </strong>
                <p className="mt-0.5 text-amber-800">
                  Admission standards and embassy immigration criteria are subject to periodic university policy changes and document authentication.
                </p>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Assessment Report For</span>
                  <h3 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                    {result.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluation based on CGPA {formData.cgpa}, {formData.englishTest} {formData.englishScore}, and {formData.qualification}.
                  </p>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">Profile Rating:</span>
                  <span className="text-xl font-black text-emerald-800 font-display">{result.score}</span>
                  <span className="text-[11px] text-emerald-600 block mt-0.5">Estimated Admission Probability: {result.successRate}</span>
                </div>
              </div>

              {/* 1. Potential Destination Categories */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Potential Destination Matches
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.potentialDestinations.map((dest: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">
                          {dest.flag} {dest.country}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-blue-700 text-[10px]">
                          {dest.suitability}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pt-1">{dest.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Potential Concerns */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Potential Concerns & Cautionary Factors
                </h4>
                {result.concerns.length > 0 ? (
                  <div className="space-y-2">
                    {result.concerns.map((c: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>No critical academic blockers identified. Excellent candidate for direct submission.</span>
                  </div>
                )}
              </div>

              {/* 3. Recommended Next Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Next Steps
                </h4>
                <div className="space-y-2">
                  {result.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-evaluate Another Profile</span>
                </button>

                <button
                  onClick={() => onOpenConsultationModal(formData.preferredDestination)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Free 1-on-1 Review with Counselor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
