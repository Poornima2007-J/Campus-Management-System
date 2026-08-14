import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentPortal } from './components/portals/StudentPortal';
import { FacultyPortal } from './components/portals/FacultyPortal';
import { CoordinatorPortal } from './components/portals/CoordinatorPortal';
import { AdminPortal } from './components/portals/AdminPortal';
import { AICampusCopilot } from './components/ai/AICampusCopilot';
import { AuthModal } from './components/auth/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { Home, ShieldCheck } from 'lucide-react';
import type { UserRole } from './types';

const MainApp: React.FC = () => {
  const { user, currentRole, switchRole } = useAuth();
  
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check URL pathname for direct route access (e.g. /Admin, /Student, /Faculty, /Coordinator)
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('admin')) {
      switchRole('admin');
      setViewMode('portal');
    } else if (path.includes('faculty')) {
      switchRole('faculty');
      setViewMode('portal');
    } else if (path.includes('coordinator')) {
      switchRole('coordinator');
      setViewMode('portal');
    } else if (path.includes('student') || path.includes('portal')) {
      switchRole('student');
      setViewMode('portal');
    }
  }, []);

  // When user registers or logs in via OTP, switch to portal view automatically
  useEffect(() => {
    if (user && user.verified) {
      setViewMode('portal');
    }
  }, [user]);

  const openAuthWithMode = (mode: 'signin' | 'signup') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const renderActivePortal = () => {
    if (!user) {
      return (
        <div className="p-8 sm:p-12 text-center bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto my-12 shadow-sm space-y-5">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Authentication Required</h2>
          <p className="text-sm text-slate-600">
            Please Register or Sign In to access your role-specific Smart Campus portal.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => openAuthWithMode('signin')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-extrabold rounded-2xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthWithMode('signup')}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-extrabold rounded-2xl shadow-lg transition-all"
            >
              Register Account
            </button>
          </div>
        </div>
      );
    }

    switch (currentRole) {
      case 'student':
        return <StudentPortal activeTab={activeTab} onNavigateTab={setActiveTab} />;
      case 'faculty':
        return <FacultyPortal activeTab={activeTab} />;
      case 'coordinator':
        return <CoordinatorPortal activeTab={activeTab} />;
      case 'admin':
        return <AdminPortal activeTab={activeTab} />;
      default:
        return <StudentPortal activeTab={activeTab} onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans selection:bg-sky-500 selection:text-white">
      
      {/* 1. PUBLIC LANDING PAGE MODE */}
      {viewMode === 'landing' ? (
        <>
          <LandingPage
            onOpenAuth={openAuthWithMode}
            onExploreDemo={() => {
              if (user) {
                setViewMode('portal');
              } else {
                openAuthWithMode('signup');
              }
            }}
          />
          <AICampusCopilot
            onNavigateTab={(tab) => { setViewMode('portal'); setActiveTab(tab); }}
            onGoToLanding={() => setViewMode('landing')}
          />
        </>
      ) : (
        /* 2. AUTHENTICATED ROLE PORTAL MODE */
        <>
          {/* Top Bar with Landing Page Link */}
          <div className="bg-sky-700 text-white px-6 py-2 text-xs font-extrabold flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                Logged in as <strong>{user?.name || 'Registered User'}</strong> ({user?.email}) — <span className="uppercase">{currentRole} Dashboard</span>
              </span>
            </div>

            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-800 hover:bg-sky-900 rounded-xl text-white font-extrabold transition-colors shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Back to Website Landing Page</span>
            </button>
          </div>

          <Navbar
            onOpenAuth={openAuthWithMode}
            onOpenSearch={() => setSearchModalOpen(true)}
            activeRole={currentRole}
            onGoHome={() => setViewMode('landing')}
            onNavigateTab={setActiveTab}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col md:flex-row">
            <Sidebar
              activeRole={currentRole}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isMobileOpen={mobileMenuOpen}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />

            <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
              {renderActivePortal()}
            </main>
          </div>

          <AICampusCopilot
            onNavigateTab={setActiveTab}
            onGoToLanding={() => setViewMode('landing')}
          />
        </>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigateTab={(tab) => { setViewMode('portal'); setActiveTab(tab); }}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
