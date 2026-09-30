import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ConsultationModal } from './components/ConsultationModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Bot } from 'lucide-react';

// Authentication & Portals
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { StudentPortal } from './student/StudentPortal';
import { CounsellorPortal } from './counsellor/CounsellorPortal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { UniversityDetailPage } from './pages/UniversityDetailPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { AIProfileAnalysisPage } from './pages/AIProfileAnalysisPage';

// Admin CRM & CMS
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLeads } from './admin/AdminLeads';
import { AdminStudents } from './admin/AdminStudents';
import { AdminApplications } from './admin/AdminApplications';
import { AdminDocuments } from './admin/AdminDocuments';
import { AdminAppointments } from './admin/AdminAppointments';
import { AdminDestinations } from './admin/AdminDestinations';
import { AdminUniversities } from './admin/AdminUniversities';
import { AdminPrograms } from './admin/AdminPrograms';
import { AdminCMS } from './admin/AdminCMS';
import { AdminTeam } from './admin/AdminTeam';
import { AdminScholarships } from './admin/AdminScholarships';
import { AdminSettings } from './admin/AdminSettings';
import { AdminAuditLogs } from './admin/AdminAuditLogs';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminAutomation } from './admin/AdminAutomation';
import { AdminEmailTemplates } from './admin/AdminEmailTemplates';
import { AdminBackupSafety } from './admin/AdminBackupSafety';
import { AdminCommunications } from './admin/AdminCommunications';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedDestinationForModal, setSelectedDestinationForModal] = useState<string>('');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isQuickLeadModalOpen, setIsQuickLeadModalOpen] = useState(false);

  // Handle URL hash changes for deep-linking & browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        setCurrentRoute('home');
        setRouteParam(undefined);
        return;
      }

      const parts = hash.split('/');
      const primaryRoute = parts[0] || 'home';
      const subParam = parts[1] || undefined;

      setCurrentRoute(primaryRoute);
      setRouteParam(subParam);
    };

    // Initialize on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);

    // Update browser URL hash
    if (param) {
      window.location.hash = `/${route}/${param}`;
    } else if (route === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `/${route}`;
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenConsultationModal = (destinationSlug?: string) => {
    setSelectedDestinationForModal(destinationSlug || '');
    setIsConsultationModalOpen(true);
  };

  const handleCloseConsultationModal = () => {
    setIsConsultationModalOpen(false);
  };

  // Render Admin Section when on /admin
  const renderAdminSection = (section: string) => {
    switch (section) {
      case 'leads':
        return (
          <AdminLeads
            isQuickAddOpen={isQuickLeadModalOpen}
            onCloseQuickAdd={() => setIsQuickLeadModalOpen(false)}
          />
        );
      case 'students':
        return <AdminStudents />;
      case 'applications':
        return <AdminApplications />;
      case 'documents':
        return <AdminDocuments />;
      case 'appointments':
        return <AdminAppointments />;
      case 'destinations':
        return <AdminDestinations />;
      case 'universities':
        return <AdminUniversities />;
      case 'programs':
        return <AdminPrograms />;
      case 'scholarships':
        return <AdminScholarships />;
      case 'cms':
        return <AdminCMS />;
      case 'team':
        return <AdminTeam />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'automation':
        return <AdminAutomation />;
      case 'email-templates':
        return <AdminEmailTemplates />;
      case 'backup-safety':
        return <AdminBackupSafety />;
      case 'communications':
        return <AdminCommunications initialSubmenu="social" />;
      case 'communications-social':
        return <AdminCommunications initialSubmenu="social" />;
      case 'communications-video':
        return <AdminCommunications initialSubmenu="video" />;
      case 'communications-links':
        return <AdminCommunications initialSubmenu="links" />;
      case 'communications-integrations':
        return <AdminCommunications initialSubmenu="integrations" />;
      case 'communications-logs':
        return <AdminCommunications initialSubmenu="logs" />;
      case 'settings':
        return <AdminSettings />;
      case 'audit-logs':
        return <AdminAuditLogs />;
      case 'dashboard':
      default:
        return (
          <AdminDashboard
            onNavigateSection={(sec) => navigateTo('admin', sec)}
            onOpenQuickLeadModal={() => {
              navigateTo('admin', 'leads');
              setIsQuickLeadModalOpen(true);
            }}
          />
        );
    }
  };

  // If in Login Page
  if (currentRoute === 'login') {
    return (
      <AuthProvider>
        <LoginPage onNavigate={navigateTo} />
      </AuthProvider>
    );
  }

  // If in Student Portal mode, render full student workspace
  if (currentRoute === 'student-portal' || currentRoute === 'student') {
    return (
      <AuthProvider>
        <StudentPortal onNavigate={navigateTo} initialTab={routeParam || 'overview'} />
      </AuthProvider>
    );
  }

  // If in Counsellor Portal mode, render counsellor desk
  if (currentRoute === 'counsellor') {
    return (
      <AuthProvider>
        <CounsellorPortal onNavigate={navigateTo} initialTab={routeParam || 'overview'} />
      </AuthProvider>
    );
  }

  // If in Admin CRM mode, render the Admin Shell
  if (currentRoute === 'admin') {
    const adminSection = routeParam || 'dashboard';
    return (
      <AuthProvider>
        <AdminAuthProvider>
          <AdminLayout
            currentSection={adminSection}
            onNavigateSection={(sec) => navigateTo('admin', sec)}
            onReturnToWebsite={() => navigateTo('home')}
            onOpenQuickLeadModal={() => {
              navigateTo('admin', 'leads');
              setIsQuickLeadModalOpen(true);
            }}
          >
            {renderAdminSection(adminSection)}
          </AdminLayout>
        </AdminAuthProvider>
      </AuthProvider>
    );
  }

  // Render public website views
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'destinations':
        if (routeParam) {
          return (
            <DestinationDetailPage
              slug={routeParam}
              onNavigate={navigateTo}
              onOpenConsultationModal={handleOpenConsultationModal}
            />
          );
        }
        return (
          <DestinationsPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'universities':
        if (routeParam) {
          return (
            <UniversityDetailPage
              slug={routeParam}
              onNavigate={navigateTo}
              onOpenConsultationModal={handleOpenConsultationModal}
            />
          );
        }
        return (
          <UniversitiesPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'programs':
        if (routeParam) {
          return (
            <ProgramDetailPage
              slug={routeParam}
              onNavigate={navigateTo}
              onOpenConsultationModal={handleOpenConsultationModal}
            />
          );
        }
        return (
          <ProgramsPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'services':
        return (
          <ServicesPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'scholarships':
        return (
          <ScholarshipsPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'success-stories':
        return (
          <SuccessStoriesPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'ai-evaluation':
        return (
          <AIProfileAnalysisPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'eligibility-checker':
        return (
          <EligibilityCheckerPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'about':
      case 'faq':
        return (
          <AboutPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'contact':
        return (
          <ContactPage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'events':
      case 'resources':
      case 'blog':
        return (
          <BlogPage
            slug={routeParam}
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );

      case 'home':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onOpenConsultationModal={handleOpenConsultationModal}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen text-slate-900 bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
        {/* Global Navigation Bar */}
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onOpenConsultationModal={handleOpenConsultationModal}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        {/* Main View Area */}
        <main className="flex-1" id="main-content">
          {renderCurrentPage()}
        </main>

        {/* Global Site Footer */}
        <Footer
          onNavigate={navigateTo}
          onOpenConsultationModal={handleOpenConsultationModal}
        />

        {/* Floating 24/7 WhatsApp Widget */}
        <WhatsAppButton />

        {/* Floating AI Study Abroad Assistant Widget Trigger */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          id="floating-ai-assistant-btn"
          className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white p-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer border border-white/20 group"
          title="Ask COS Study Abroad Assistant"
        >
          <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline pr-1">Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* COS Study Abroad Assistant Chatbot Modal */}
        <AIAssistantModal
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          onOpenConsultation={() => handleOpenConsultationModal()}
        />

        {/* Global Consultation Booking Modal */}
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={handleCloseConsultationModal}
          defaultDestination={selectedDestinationForModal}
        />
      </div>
    </AuthProvider>
  );
}
