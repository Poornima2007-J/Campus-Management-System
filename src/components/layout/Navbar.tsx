import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { UserRole } from '../../types';
import { Sparkles, Bell, Search, LogOut, ShieldCheck, User as UserIcon, Globe, FileCode, X, Menu, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenSearch: () => void;
  activeRole: UserRole;
  onGoHome: () => void;
  onNavigateTab?: (tab: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenSearch,
  activeRole,
  onGoHome,
  onNavigateTab,
  onToggleMobileMenu
}) => {
  const { user, logout, notifications, unreadCount, markNotificationRead } = useAuth();
  const { themeMode, resolvedTheme, setThemeMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'TA' | 'HI' | 'ES'>('EN');
  const [showApiDocs, setShowApiDocs] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Mobile Hamburger Menu Button + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle Mobile Menu"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
            <div className="p-2.5 rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                  Aether<span className="text-sky-600 dark:text-sky-400">Campus</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] sm:text-xs uppercase font-extrabold tracking-wider bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-800 rounded-full">
                  {activeRole}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Smart Campus Management Platform
              </p>
            </div>
          </div>
        </div>

        {/* Desktop & Mobile Search Bar Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-2xl text-slate-600 text-xs sm:text-sm transition-all w-36 sm:w-72 justify-between group font-medium"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
            <span className="truncate">Search member / course...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-white border border-slate-300 text-slate-600 rounded-lg shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Global Theme Segmented Toggle Pill [ ☀️ Light | 🌙 Dark ] */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner font-extrabold text-xs">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                resolvedTheme === 'light'
                  ? 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Light Theme Mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setThemeMode('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                resolvedTheme === 'dark'
                  ? 'bg-sky-600 text-white shadow-md font-extrabold scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dark Theme Mode"
            >
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>Dark</span>
            </button>
          </div>

          {/* Multi-Language Selector */}
          <div className="relative flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1 dark:bg-slate-800 dark:border-slate-700">
            <Globe className="w-4 h-4 text-sky-600 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as any)}
              className="bg-transparent text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="EN" className="dark:bg-slate-800">EN (English)</option>
              <option value="TA" className="dark:bg-slate-800">TA (தமிழ்)</option>
              <option value="HI" className="dark:bg-slate-800">HI (हिंदी)</option>
              <option value="ES" className="dark:bg-slate-800">ES (Español)</option>
            </select>
          </div>

          {/* Swagger / OpenAPI Docs Modal Trigger */}
          <button
            onClick={() => setShowApiDocs(true)}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-extrabold"
            title="View OpenAPI / Swagger Documentation"
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>API Docs</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View Notifications"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-sky-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-base">Notifications</h4>
                  <span className="px-2.5 py-0.5 text-xs bg-sky-100 text-sky-800 font-extrabold rounded-full">
                    {unreadCount} new
                  </span>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifications(false);
                        if ((n.type === 'ASSIGNMENT' || n.assignmentId) && onNavigateTab) {
                          onNavigateTab('assignments');
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                          : 'bg-sky-50/70 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-slate-900 dark:text-white font-medium shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between font-extrabold text-slate-900 dark:text-white mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{n.message}</p>
                      {(n.type === 'ASSIGNMENT' || n.assignmentId) && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-sky-600 text-white font-extrabold text-[10px] rounded-md">
                          Click to View Assignment →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login trigger */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-sky-400 object-cover shadow-sm" />
              ) : (
                <UserIcon className="w-9 h-9 text-sky-500" />
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-xs text-sky-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> OTP Verified
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                aria-label="Sign In Button"
                className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                aria-label="Register Button"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/30 transition-all"
              >
                Register
              </button>
            </div>
          )}

        </div>
      </div>

      {/* SWAGGER / OPENAPI DOCS MODAL */}
      {showApiDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-3xl p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowApiDocs(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>OpenAPI v3.0 Specification</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Swagger / OpenAPI API Documentation</h3>
              <p className="text-xs text-slate-500">Live API endpoints running on Node.js Express server (`http://localhost:5000`)</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-extrabold">POST</span>
                  <span className="text-slate-900">/api/auth/send-otp</span>
                </div>
                <p className="text-xs text-slate-600">Generates 6-digit email OTP and delivers via Gmail Nodemailer SMTP transporter. Enforces unique email registration.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-extrabold">POST</span>
                  <span className="text-slate-900">/api/auth/verify-otp</span>
                </div>
                <p className="text-xs text-slate-600">Verifies 6-digit input OTP code and creates activated user session.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-extrabold">POST</span>
                  <span className="text-slate-900">/api/auth/google</span>
                </div>
                <p className="text-xs text-slate-600">Decodes Google OAuth ID token credentials (Client ID: 125112602794-36dc4h5q2q1kjo1805vdase0b337lmfs.apps.googleusercontent.com) and creates Google user account.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  <span className="px-2.5 py-1 bg-blue-600 text-white rounded font-extrabold">GET</span>
                  <span className="text-slate-900">/api/assignments/submitted</span>
                </div>
                <p className="text-xs text-slate-600">Fetches submitted student solutions filtered by Subject Code.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
