import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { COSLogo } from '../components/COSLogo';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  School,
  Building2,
  FileCheck2
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string, param?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'counsellor' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoAccounts, setDemoAccounts] = useState<{ students: any[]; counsellors: any[]; admins: any[] }>({
    students: [],
    counsellors: [],
    admins: [],
  });
  const [isLoadingDemos, setIsLoadingDemos] = useState(true);

  // Fetch demo profiles on mount
  useEffect(() => {
    fetch('/api/auth/demo-accounts')
      .then(res => res.json())
      .then(data => {
        setDemoAccounts(data);
        setIsLoadingDemos(false);
        // Pre-fill default email for active tab
        if (data.students?.length && activeTab === 'student') {
          setEmail(data.students[0].email);
          setPassword('password123');
        }
      })
      .catch(err => {
        console.error('Failed to load demo accounts', err);
        setIsLoadingDemos(false);
      });
  }, []);

  const handleTabChange = (role: 'student' | 'counsellor' | 'admin') => {
    setActiveTab(role);
    setErrorMsg('');
    if (role === 'student' && demoAccounts.students.length) {
      setEmail(demoAccounts.students[0].email);
      setPassword('password123');
    } else if (role === 'counsellor' && demoAccounts.counsellors.length) {
      setEmail(demoAccounts.counsellors[0].email);
      setPassword('password123');
    } else if (role === 'admin' && demoAccounts.admins.length) {
      setEmail(demoAccounts.admins[0].email);
      setPassword('password123');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.redirectTo === '/student-portal') onNavigate('student-portal');
      else if (res.redirectTo === '/counsellor') onNavigate('counsellor');
      else if (res.redirectTo === '/admin') onNavigate('admin');
      else onNavigate('home');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemoLogin = async (account: any) => {
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(undefined, undefined, true, account.id);
    setIsSubmitting(false);

    if (res.success) {
      if (res.redirectTo === '/student-portal') onNavigate('student-portal');
      else if (res.redirectTo === '/counsellor') onNavigate('counsellor');
      else if (res.redirectTo === '/admin') onNavigate('admin');
    } else {
      setErrorMsg(res.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <COSLogo className="h-10 w-auto" variant="dark" />
          <div className="pl-2 border-l border-slate-700 hidden sm:block">
            <span className="text-xs text-slate-400 block font-medium">Unified Portal System</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          Back to Main Website
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full my-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sign in to Your Portal
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Access your university applications, document tracking, counsellor communication, and admissions desk.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 flex gap-1 shadow-xl max-w-md w-full">
            <button
              onClick={() => handleTabChange('student')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              onClick={() => handleTabChange('counsellor')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'counsellor'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Counsellor
            </button>
            <button
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-3 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Credentials Form Box */}
          <div className="lg:col-span-7 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {activeTab === 'student' && <GraduationCap className="w-5 h-5 text-blue-400" />}
                  {activeTab === 'counsellor' && <UserCheck className="w-5 h-5 text-emerald-400" />}
                  {activeTab === 'admin' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                  {activeTab === 'student' && 'Student Portal Sign In'}
                  {activeTab === 'counsellor' && 'Counsellor Desk Sign In'}
                  {activeTab === 'admin' && 'Admin CRM Access'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeTab === 'student' && 'Check application timeline, verify documents, view offers'}
                  {activeTab === 'counsellor' && 'Manage assigned students, review docs, track follow-ups'}
                  {activeTab === 'admin' && 'Executive overview, agency analytics, lead routing'}
                </p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                activeTab === 'student' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                activeTab === 'counsellor' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {activeTab}
              </span>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-slate-400">
                    Default: <code className="text-blue-400 bg-slate-900/60 px-1.5 py-0.5 rounded">password123</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-2 ${
                  activeTab === 'student'
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
                    : activeTab === 'counsellor'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25'
                } ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to {activeTab === 'student' ? 'Student Portal' : activeTab === 'counsellor' ? 'Counsellor Portal' : 'Admin CRM'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                256-bit Encrypted Session
              </span>
              <span>Need help? info@cos-education.com</span>
            </div>
          </div>

          {/* 1-Click Fast Demo Logins Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Quick Demo Profiles</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full ml-auto">
                  Instant 1-Click
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Select any verified account below to immediately authenticate and experience the corresponding portal interface.
              </p>

              {isLoadingDemos ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading demo profiles...</div>
              ) : (
                <div className="space-y-2.5">
                  {activeTab === 'student' &&
                    demoAccounts.students.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleQuickDemoLogin(account)}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-blue-900/30 border border-slate-700/60 hover:border-blue-500/50 transition-all flex items-center gap-3 group cursor-pointer"
                      >
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-blue-400"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-blue-300">
                            {account.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{account.subtitle}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}

                  {activeTab === 'counsellor' &&
                    demoAccounts.counsellors.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleQuickDemoLogin(account)}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-emerald-900/30 border border-slate-700/60 hover:border-emerald-500/50 transition-all flex items-center gap-3 group cursor-pointer"
                      >
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-emerald-400"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-emerald-300">
                            {account.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{account.subtitle}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}

                  {activeTab === 'admin' &&
                    demoAccounts.admins.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleQuickDemoLogin(account)}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-purple-900/30 border border-slate-700/60 hover:border-purple-500/50 transition-all flex items-center gap-3 group cursor-pointer"
                      >
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-purple-400"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-purple-300">
                            {account.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{account.subtitle}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Portal Features Badge */}
            <div className="bg-slate-800/30 rounded-xl border border-slate-700/40 p-4 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300">Portals Included in Phase 3:</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span><strong>Student Portal:</strong> 9-stage visual timeline, secure document uploads, counsellor chat, appointments.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Counsellor Desk:</strong> Lead & student queues, document verification, application updates, tasks & follow-ups.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-800 pt-6">
        © {new Date().getFullYear()} COS Education. All rights reserved. Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh.
      </div>
    </div>
  );
};
