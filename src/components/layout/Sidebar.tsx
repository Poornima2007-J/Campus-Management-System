import React from 'react';
import type { UserRole } from '../../types';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Briefcase,
  Calendar,
  Users,
  QrCode,
  Megaphone,
  BookOpen,
  BarChart3,
  ShieldAlert,
  Settings,
  Sparkles,
  MessageSquare,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
  FolderKanban
} from 'lucide-react';

interface SidebarProps {
  activeRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile
}) => {
  const getNavItems = () => {
    switch (activeRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance Tracker', icon: CalendarCheck },
          { id: 'assignments', label: 'Assignments Studio', icon: FileText },
          { id: 'placements', label: 'Placement Drives', icon: Briefcase },
          { id: 'events', label: 'Events & QR Tickets', icon: Calendar },
          { id: 'clubs', label: 'Club Memberships', icon: Users },
          { id: 'chat', label: 'Live Faculty Chat', icon: MessageSquare },
          { id: 'notices', label: 'Announcements & Notices', icon: Megaphone },
          { id: 'settings', label: 'Profile & Security', icon: Settings }
        ];
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
          { id: 'classes', label: 'Classes & Courses', icon: FolderKanban },
          { id: 'attendance', label: 'Attendance PIN & QR', icon: QrCode },
          { id: 'assignments', label: 'Assignment Grading Studio', icon: FileText },
          { id: 'materials', label: 'Study Material Vault', icon: BookOpen },
          { id: 'notices', label: 'Publish Campus Notice', icon: Megaphone },
          { id: 'chat', label: 'Live Student Chat', icon: MessageSquare },
          { id: 'settings', label: 'Faculty Profile', icon: Settings }
        ];
      case 'coordinator':
        return [
          { id: 'dashboard', label: 'Coordinator Command Center', icon: LayoutDashboard },
          { id: 'events', label: 'Event Management Studio', icon: Calendar },
          { id: 'scanner', label: 'Venue QR Gate Scanner', icon: QrCode },
          { id: 'clubs', label: 'Club Registrations & Approvals', icon: Users },
          { id: 'notices', label: 'Announcements Center', icon: Megaphone },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Coordinator Settings', icon: Settings }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'courses', label: 'Courses & Subjects', icon: FolderKanban },
          { id: 'events', label: 'Events Management', icon: Calendar },
          { id: 'attendance', label: 'Attendance Management', icon: QrCode },
          { id: 'assignments', label: 'Assignment Management', icon: FileText },
          { id: 'placements', label: 'Placement Management', icon: Briefcase },
          { id: 'clubs', label: 'Club Management', icon: Users },
          { id: 'notices', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'audit', label: 'System Logs', icon: ShieldAlert },
          { id: 'permissions', label: 'Permissions & Roles', icon: ShieldCheck },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'support', label: 'Support & Help', icon: Sparkles }
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-2">
        <div className="px-3 py-2 text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
          <span className="capitalize">{activeRole} Navigation</span>
          <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 font-extrabold translate-x-1'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Real-time System Status Card */}
      <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-800 dark:to-slate-900 border border-sky-100 dark:border-slate-700 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Live System Status</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Backend API: <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">Connected (:5000)</strong>
          <br />
          Google OAuth: <strong className="text-sky-700 dark:text-sky-400 font-extrabold">Active</strong>
          <br />
          SMTP Email: <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">Gmail Nodemailer</strong>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP FULL-HEIGHT STICKY SIDEBAR (NO HUGE EMPTY MARGINS) */}
      <aside className="w-64 md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto hidden md:block shrink-0 shadow-sm">
        {sidebarContent}
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER (RESPONSIVE FOR TABLETS & MOBILE) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          ></div>

          {/* Drawer Body */}
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 overflow-y-auto animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
