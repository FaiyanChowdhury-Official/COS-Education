import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Award,
  Clock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck,
  PhoneCall,
  Printer,
} from 'lucide-react';

interface AIProfileAnalysisPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (defaultDestination?: string) => void;
}

interface AnalysisResult {
  profileSummary: string;
  potentialDestinations: Array<{
    country: string;
    category: string;
    reason: string;
  }>;
  potentialProgramCategories: string[];
  potentialConcerns: string[];
  recommendedNextSteps: string[];
  counsellorAdvice: string;
}

export const AIProfileAnalysisPage: React.FC<AIProfileAnalysisPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  // Form State
  const [qualification, setQualification] = useState('Bachelor Degree');
  const [cgpa, setCgpa] = useState('3.10');
  const [graduationYear, setGraduationYear] = useState('2024');
  const [studyGap, setStudyGap] = useState('None');
  const [englishTest, setEnglishTest] = useState('IELTS Academic');
  const [englishScore, setEnglishScore] = useState('6.5');
  const [budget, setBudget] = useState('£14,000 – £18,000 / year');
  const [preferredDestination, setPreferredDestination] = useState('United Kingdom');
  const [preferredDegree, setPreferredDegree] = useState('Master');
  const [workExperience, setWorkExperience] = useState('1 Year (Junior Software Engineer)');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/profile-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualification,
          cgpa,
          graduationYear,
          studyGap,
          englishTest,
          englishScore,
          budget,
          preferredDestination,
          preferredDegree,
          workExperience,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        // Scroll down to results smoothly
        setTimeout(() => {
          document.getElementById('ai-analysis-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err) {
      console.error('Failed to run AI profile evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Admissions Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive AI Profile Evaluation
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Submit your educational background, test scores, and budget to receive an immediate preliminary matching evaluation for top global universities.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Step 1: Academic & Background Credentials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Accurate details ensure the most relevant preliminary matches and gap identification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Academic Qualification *
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="HSC / A Levels">HSC / A Levels / 12th Grade</option>
                  <option value="Bachelor Degree">Bachelor Degree (Honours)</option>
                  <option value="Master Degree">Master Degree</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic (4-Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  CGPA / Percentage / Grade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3.25 out of 4.00 or 65%"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Graduation Year *
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="2026 (Upcoming)">2026 (Upcoming / Final Semester)</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020 or Earlier">2020 or Earlier</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Study Gap
                </label>
                <select
                  value={studyGap}
                  onChange={(e) => setStudyGap(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="None">None (Direct Progression)</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 to 5 Years">3 to 5 Years (Covered by job)</option>
                  <option value="Over 5 Years">Over 5 Years</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  English Test Taken / Planned
                </label>
                <select
                  value={englishTest}
                  onChange={(e) => setEnglishTest(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="IELTS Academic">IELTS Academic</option>
                  <option value="PTE Academic">PTE Academic</option>
                  <option value="Duolingo (DET)">Duolingo (DET)</option>
                  <option value="MOI (Medium of Instruction)">MOI (Medium of Instruction Waiver)</option>
                  <option value="Not Taken Yet">Not Taken Yet / Need Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  English Score / Target
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6.5 (min 6.0) or Target 6.0"
                  value={englishScore}
                  onChange={(e) => setEnglishScore(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Preferred Destination
                </label>
                <select
                  value={preferredDestination}
                  onChange={(e) => setPreferredDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Finland">Finland</option>
                  <option value="United States">United States</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Malta">Malta</option>
                  <option value="Flexible / Best Matching">Flexible / Best Matching</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Desired Degree Level
                </label>
                <select
                  value={preferredDegree}
                  onChange={(e) => setPreferredDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="Bachelor Degree">Bachelor Degree (Undergraduate)</option>
                  <option value="Master">Master's Degree (Postgraduate)</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Estimated Annual Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
                >
                  <option value="Under £10,000 / $12,000">Under £10,000 / $12,000 (Malaysia / Low-cost)</option>
                  <option value="£12,000 – £16,000 / year">£12,000 – £16,000 / year (UK / Finland standard)</option>
                  <option value="£16,000 – £22,000 / year">£16,000 – £22,000 / year (Russell Group / USA)</option>
                  <option value="£22,000+ / year">£22,000+ / year (Top-Tier Global)</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-bold mb-1.5">
                Work Experience & Gaps Justification
              </label>
              <textarea
                rows={2}
                placeholder="Detail job roles, company name, years of service, internships or personal research..."
                value={workExperience}
                onChange={(e) => setWorkExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                ⚡ Instant analysis verified against active international university admission criteria.
              </span>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Profile with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Profile Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div id="ai-analysis-results" className="space-y-6 pt-4">
            {/* Regulatory Safeguard Notice (Explicit Prompt Requirement) */}
            <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-300/80 rounded-2xl flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <h3 className="font-extrabold text-amber-950 text-sm sm:text-base tracking-tight">
                    Preliminary AI-assisted guidance — not an admission or visa decision.
                  </h3>
                  <p className="text-xs text-amber-900/90 mt-0.5">
                    This report represents an automated assessment based on general admissions parameters. Admission offers, tuition fees, scholarship awards, and visa approvals are subject to official university faculty and consular verification.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
            </div>

            {/* Profile Summary Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <span>Executive Profile Summary</span>
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                {result.profileSummary}
              </p>
              {result.counsellorAdvice && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 font-medium">
                  <strong>Senior Counsellor Note: </strong>
                  {result.counsellorAdvice}
                </div>
              )}
            </div>

            {/* Potential Destinations & Categories */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>Potential Destination Categories</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.potentialDestinations.map((dest, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{dest.country}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        dest.category === 'Best Match'
                          ? 'bg-emerald-100 text-emerald-800'
                          : dest.category === 'Competitive'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {dest.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {dest.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Categories & Potential Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Categories */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <span>Potential Program Categories</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.potentialProgramCategories.map((cat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Concerns */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Potential Concerns & Mitigation</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.potentialConcerns.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Recommended Next Steps</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
                {result.recommendedNextSteps.map((step, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <span className="mt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion CTA Box */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-bold">Ready to take the next step?</h3>
                <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
                  Bring this preliminary evaluation to our Chowhatta Point, Sylhet office or schedule an online session for 100% free document verification and university application submission.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => onOpenConsultationModal(preferredDestination)}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
