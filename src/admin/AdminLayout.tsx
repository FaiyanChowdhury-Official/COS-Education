import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileCheck2,
  CalendarCheck,
  Building2,
  BookOpen,
  Globe2,
  Award,
  FileText,
  Settings,
  ShieldCheck,
  History,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  PlusCircle,
  Search,
  BarChart3,
  Zap,
  Mail,
  Database,
  Share2,
  Video,
  Link2,
  MessageSquareShare,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { COSLogo } from '../components/COSLogo';

interface AdminLayoutProps {
  currentSection: string;
  onNavigateSection: (section: string) => void;
  onReturnToWebsite: () => void;
  children: React.ReactNode;
  onOpenQuickLeadModal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onNavigateSection,
  onReturnToWebsite,
  children,
  onOpenQuickLeadModal,
}) => {
  const { user, availableProfiles, switchProfile } = useAdminAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'all' },
    { id: 'leads', label: 'Leads Management', icon: Users, role: 'all', badge: 'Pipeline' },
    { id: 'students', label: 'Students Directory', icon: GraduationCap, role: 'all' },
    { id: 'applications', label: 'Applications', icon: FileCheck2, role: 'all' },
    { id: 'documents', label: 'Documents & Verification', icon: FileText, role: 'all' },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck, role: 'all' },
    { id: 'analytics', label: 'Marketing & Analytics', icon: BarChart3, role: 'all', badge: 'UTM' },
    { id: 'automation', label: 'Automation & Rules', icon: Zap, role: 'admin', badge: 'Active' },
    { id: 'email-templates', label: 'Email Templates', icon: Mail, role: 'admin' },
  ];

  const communicationNavItems = [
    { id: 'communications-social', label: 'Social Media', icon: Share2, role: 'all' },
    { id: 'communications-video', label: 'Video Conferences', icon: Video, role: 'all', badge: 'Meet/Zoom' },
    { id: 'communications-links', label: 'Social Links', icon: Link2, role: 'all' },
    { id: 'communications-integrations', label: 'Integration Settings', icon: Settings, role: 'admin' },
    { id: 'communications-logs', label: 'Activity Logs', icon: History, role: 'all' },
  ];

  const catalogItems = [
    { id: 'destinations', label: 'Destinations', icon: Globe2, role: 'admin' },
    { id: 'universities', label: 'Universities', icon: Building2, role: 'admin' },
    { id: 'programs', label: 'Programs', icon: BookOpen, role: 'admin' },
    { id: 'scholarships', label: 'Scholarships', icon: Award, role: 'admin' },
  ];

  const adminOnlyItems = [
    { id: 'cms', label: 'Website CMS', icon: FileText, role: 'admin', badge: 'Content' },
    { id: 'team', label: 'Team & Counsellors', icon: UserCheck, role: 'admin' },
    { id: 'settings', label: 'System Settings', icon: Settings, role: 'admin' },
    { id: 'backup-safety', label: 'Backup & Data Safety', icon: Database, role: 'admin' },
    { id: 'audit-logs', label: 'Audit & Activity Logs', icon: History, role: 'all' },
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased portal-white-theme">
      {/* Top Notification Bar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            id="admin-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <COSLogo className="h-9 w-auto" />
            <div className="hidden md:block pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  CRM & CMS
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Enterprise Engine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions & User Switcher */}
        <div className="flex items-center gap-3">
          {onOpenQuickLeadModal && (
            <button
              id="admin-quick-add-lead-btn"
              onClick={onOpenQuickLeadModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Lead</span>
            </button>
          )}

          <button
            id="admin-view-live-website-btn"
            onClick={onReturnToWebsite}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Public Site</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              id="admin-profile-menu-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-all text-left shadow-xs"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-xs">
                <div className="font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                  <span>{user.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    user.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{user.email}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Role & User Switcher (RBAC)</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Switch instantly between roles to test permissions.</p>
                </div>
                <div className="py-1">
                  {availableProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        switchProfile(profile);
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors ${
                        user.email === profile.email ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1 truncate">
                        <div className="font-medium text-slate-900">{profile.name}</div>
                        <div className="text-[11px] text-slate-500">{profile.email}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        profile.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {profile.role}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-slate-100">
                  <button
                    onClick={onReturnToWebsite}
                    className="w-full text-left text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Exit Admin to Public Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 pt-16 lg:pt-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform duration-200 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-0 hidden lg:block'
          } flex flex-col justify-between`}
        >
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Core CRM Nav */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Core CRM Pipeline
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Communications & Social Media */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
                <span>Communications & Social</span>
                <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold border border-blue-200">
                  New
                </span>
              </div>
              <nav className="space-y-1">
                {communicationNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentSection === item.id ||
                    (currentSection === 'communications' && item.id === 'communications-social');
                  const isRestricted = item.role === 'admin' && user.role !== 'admin';
                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => {
                        if (!isRestricted) handleNavClick(item.id);
                      }}
                      disabled={isRestricted}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isRestricted
                          ? 'text-slate-400 opacity-50 cursor-not-allowed'
                          : isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Academic Catalog (Admin Only) */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
                <span>Institutions & Courses</span>
                {user.role !== 'admin' && (
                  <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">View Only</span>
                )}
              </div>
              <nav className="space-y-1">
                {catalogItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Admin CMS & Settings */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                Administration & CMS
              </div>
              <nav className="space-y-1">
                {adminOnlyItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  const isRestricted = item.role === 'admin' && user.role !== 'admin';

                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => {
                        if (!isRestricted) {
                          handleNavClick(item.id);
                        }
                      }}
                      disabled={isRestricted}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isRestricted
                          ? 'text-slate-400 opacity-50 cursor-not-allowed'
                          : isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isRestricted ? (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">Lock</span>
                      ) : item.badge ? (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Database Status */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-semibold text-slate-700">Cloud SQL Connected</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">PostgreSQL • asia-southeast1</p>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
