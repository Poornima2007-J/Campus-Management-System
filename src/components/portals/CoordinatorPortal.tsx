import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_EVENTS, INITIAL_CLUBS } from '../../services/mockData';
import type { CampusEvent, Club } from '../../types';
import {
  Calendar,
  Plus,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Users,
  Megaphone,
  User as UserIcon,
  Check,
  X,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface CoordinatorPortalProps {
  activeTab: string;
}

interface ClubApprovalRequest {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  clubName: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Announcement {
  id: string;
  title: string;
  audience: string;
  department: string;
  date: string;
}

export const CoordinatorPortal: React.FC<CoordinatorPortalProps> = ({ activeTab }) => {
  const { user, addNotification } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);

  // Student Club Approvals State
  const [approvalTab, setApprovalTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [approvalRequests, setApprovalRequests] = useState<ClubApprovalRequest[]>([
    { id: 'req_1', studentName: 'Karthik M', rollNumber: 'CS2026-101', department: 'AI & DS', clubName: 'Coding Club', appliedDate: '18 Aug 2026', status: 'pending' },
    { id: 'req_2', studentName: 'Meena R', rollNumber: 'CS2026-104', department: 'CSE', clubName: 'Robotics Club', appliedDate: '18 Aug 2026', status: 'pending' },
    { id: 'req_3', studentName: 'Arun K', rollNumber: 'IT2026-201', department: 'IT', clubName: 'Literary Club', appliedDate: '17 Aug 2026', status: 'pending' },
    { id: 'req_4', studentName: 'Divya S', rollNumber: 'ECE2026-301', department: 'ECE', clubName: 'Music Club', appliedDate: '17 Aug 2026', status: 'pending' },
    { id: 'req_5', studentName: 'Ramesh G', rollNumber: 'MECH2026-401', department: 'MECH', clubName: 'Photography Club', appliedDate: '17 Aug 2026', status: 'approved' }
  ]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 'anc_1', title: 'Internal Assessment Schedule', audience: 'Students', department: 'All Departments', date: '18 Aug 2026' },
    { id: 'anc_2', title: 'Library Timings Change', audience: 'Students', department: 'All Departments', date: '15 Aug 2026' },
    { id: 'anc_3', title: 'Holiday Notice', audience: 'All', department: 'All Departments', date: '12 Aug 2026' },
    { id: 'anc_4', title: 'Cultural Fest Registrations Open', audience: 'Students', department: 'All Departments', date: '10 Aug 2026' },
    { id: 'anc_5', title: 'AI Workshop Registration', audience: 'Students', department: 'AI & DS', date: '08 Aug 2026' }
  ]);

  // New Event Form State
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Workshop');
  const [eventVenue, setEventVenue] = useState('Seminar Hall');
  const [eventSeats, setEventSeats] = useState(200);
  const [eventDesc, setEventDesc] = useState('');
  const [eventLink, setEventLink] = useState('https://devfusion4.tech/register');
  const [evtError, setEvtError] = useState<string | null>(null);

  // New Club Form State
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubFaculty, setClubFaculty] = useState('Prof. Kavitha');
  const [clubDesc, setClubDesc] = useState('');

  // New Announcement Form State
  const [showCreateAncModal, setShowCreateAncModal] = useState(false);
  const [ancTitle, setAncTitle] = useState('');
  const [ancAudience, setAncAudience] = useState('Students');
  const [ancDept, setAncDept] = useState('All Departments');

  // Gate Scanner Simulator State
  const [scannedPassCode, setScannedPassCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // Profile Settings Form
  const [editName, setEditName] = useState('Dr. Kavitha');
  const [editEmail, setEditEmail] = useState('kavitha@aether.com');
  const [editPhone, setEditPhone] = useState('9876543210');
  const [editDept, setEditDept] = useState('AI & Data Science');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync Backend Data
  useEffect(() => {
    const fetchCoordinatorBackend = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/coordinator/events');
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      } catch (err) {
        // Backend offline note
      }
    };
    fetchCoordinatorBackend();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvtError(null);
    if (!eventTitle) return;

    try {
      const res = await fetch('http://localhost:5000/api/coordinator/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventTitle,
          venue: eventVenue,
          totalSeats: Number(eventSeats),
          description: eventDesc,
          category: eventType.toLowerCase(),
          externalRegistrationLink: eventLink
        })
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents([data.event, ...events]);
      }
    } catch (err) {
      const newEvt: CampusEvent = {
        id: `evt_${Date.now()}`,
        title: eventTitle,
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        description: eventDesc || 'Official Campus Event.',
        venue: eventVenue,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        registrationDeadline: '2026-09-01',
        totalSeats: Number(eventSeats),
        registeredSeats: 0,
        speakers: ['Faculty Lead'],
        qrPassCode: `PASS_${eventTitle.substring(0, 4).toUpperCase()}`,
        category: eventType.toLowerCase() as any,
        externalRegistrationLink: eventLink
      };
      setEvents([newEvt, ...events]);
    }

    setEventTitle('');
    setEventDesc('');
    setShowCreateEventModal(false);
    confetti({ particleCount: 70, spread: 60 });
    addNotification('New Event Published', `Created campus event: ${eventTitle}`, 'event');
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName) return;
    const newClub: Club = {
      id: `club_${Date.now()}`,
      name: clubName,
      logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
      description: clubDesc || 'Campus Student Club.',
      memberCount: 1,
      joined: true,
      facultyAdvisor: clubFaculty,
      leadStudent: 'Student Lead',
      upcomingEventsCount: 1,
      category: 'Tech'
    };
    setClubs([newClub, ...clubs]);
    setClubName('');
    setClubDesc('');
    setShowCreateClubModal(false);
    confetti({ particleCount: 70, spread: 60 });
    addNotification('New Club Created', `Created campus club: ${clubName}`, 'system');
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle) return;
    const newAnc: Announcement = {
      id: `anc_${Date.now()}`,
      title: ancTitle,
      audience: ancAudience,
      department: ancDept,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setAnnouncements([newAnc, ...announcements]);
    setAncTitle('');
    setShowCreateAncModal(false);
    confetti({ particleCount: 70, spread: 60 });
    addNotification('Notice Published', `Published announcement: ${ancTitle}`, 'system');
  };

  const handleApproveRequest = (id: string, approve: boolean) => {
    setApprovalRequests(prev => prev.map(r => r.id === id ? { ...r, status: approve ? 'approved' : 'rejected' } : r));
    const req = approvalRequests.find(r => r.id === id);
    addNotification('Club Approval Action', `${approve ? 'Approved' : 'Rejected'} ${req?.studentName} for ${req?.clubName}`, 'system');
    if (approve) confetti({ particleCount: 50, spread: 50 });
  };

  const handleGateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedPassCode) return;
    const match = events.find(e => e.qrPassCode.toLowerCase() === scannedPassCode.trim().toLowerCase()) || events[0];
    if (match) {
      setScanResult({ success: true, message: `GATE PASS VALIDATED! Checked in for "${match.title}".` });
      confetti({ particleCount: 60, spread: 50 });
    } else {
      setScanResult({ success: false, message: `INVALID PASS CODE! Ticket pass code not recognized.` });
    }
  };

  const pendingCount = approvalRequests.filter(r => r.status === 'pending').length;
  const approvedCount = approvalRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = approvalRequests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* TOP COORDINATOR HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono font-extrabold rounded-lg uppercase">
              Coordinator Command Center
            </span>
            <span className="text-xs text-slate-400">Welcome back, {user?.name || 'Coordinator'} 👋</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">AETHERCAMPUS COORDINATOR PORTAL</h1>
          <p className="text-sm text-slate-300 mt-1 font-medium">Manage events, clubs, student approvals, announcements, and analytics</p>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* 1. DASHBOARD OVERVIEW (IMAGE 2 PANEL 1 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'dashboard') && (
        <div className="space-y-8">
          {/* 5 Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase">Total Events</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{events.length + 20}</div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+12% this month</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase">Total Clubs</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{clubs.length + 8}</div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+2 new clubs</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase">Total Students</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">2,348</div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+135 this month</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase">Pending Approvals</span>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">{pendingCount}</div>
              <span className="text-[10px] font-bold text-amber-600">Requires review</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase">Announcements</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{announcements.length + 10}</div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+5 this month</span>
            </div>
          </div>

          {/* Charts & Analytics Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Events This Month Graph */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Events This Month</h3>
              <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
                {[30, 45, 60, 80, 55, 90, 70, 95, 110, 85].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-sky-500/20 hover:bg-sky-500 rounded-t-lg transition-all relative group" style={{ height: `${val}%` }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded font-mono transition-opacity">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>01 Aug</span>
                <span>10 Aug</span>
                <span>20 Aug</span>
                <span>30 Aug</span>
              </div>
            </div>

            {/* Students by Department */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Students by Department</h3>
              <div className="space-y-3 pt-2">
                {[
                  { dept: 'AI & Data Science', count: 620, color: 'bg-sky-500' },
                  { dept: 'Computer Science & Eng', count: 580, color: 'bg-indigo-500' },
                  { dept: 'Information Technology', count: 420, color: 'bg-purple-500' },
                  { dept: 'Electronics & Communication', count: 380, color: 'bg-emerald-500' },
                  { dept: 'Mechanical Engineering', count: 348, color: 'bg-amber-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{item.dept}</span>
                      <span className="font-mono">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full`} style={{ width: `${(item.count / 620) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approvals Status Breakdown */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Approvals Status</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-amber-600 dark:text-amber-400">● Pending Review</span>
                  <span className="font-mono">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400">● Approved Registrations</span>
                  <span className="font-mono">{approvedCount}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-600 dark:text-red-400">● Rejected Requests</span>
                  <span className="font-mono">{rejectedCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase">Upcoming Events Feed</h4>
                {events.slice(0, 3).map(evt => (
                  <div key={evt.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{evt.title}</span>
                    <span className="text-slate-500 font-mono">{evt.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 2. EVENTS MANAGEMENT (IMAGE 2 PANEL 2 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'dashboard' || activeTab === 'events') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Events Management
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create, schedule, track, and manage all campus hackathons & workshops</p>
            </div>

            <button
              onClick={() => setShowCreateEventModal(true)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          {/* Events Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Registrations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{evt.title}</td>
                    <td className="p-4 uppercase font-mono font-bold text-sky-600 dark:text-sky-400">{evt.category || 'Workshop'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{evt.date} • {evt.time || '10:00 AM'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{evt.venue}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{evt.registeredSeats} / {evt.totalSeats}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 font-extrabold rounded-full uppercase text-[10px]">
                        Upcoming
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={evt.externalRegistrationLink} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Events Bottom Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Total Events</span>
              <strong className="text-base font-extrabold text-slate-900 dark:text-white font-mono">28</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Upcoming</span>
              <strong className="text-base font-extrabold text-sky-600 dark:text-sky-400 font-mono">18</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Ongoing</span>
              <strong className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">5</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Completed</span>
              <strong className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">5</strong>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Cancelled</span>
              <strong className="text-base font-extrabold text-slate-500 font-mono">0</strong>
            </div>
          </div>

        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 3. VENUE QR GATE SCANNER */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'scanner') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs max-w-xl mx-auto">
          <div className="text-center space-y-2">
            <QrCode className="w-10 h-10 text-sky-600 dark:text-sky-400 mx-auto" />
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Venue Gate Pass Scanner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scan or enter 8-character student pass code to validate entry</p>
          </div>

          <form onSubmit={handleGateScan} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase mb-1.5">Enter Pass Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CAMPUS_PASS_AI"
                value={scannedPassCode}
                onChange={(e) => setScannedPassCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-mono font-bold uppercase text-center tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow-lg"
            >
              Verify Pass Code
            </button>
          </form>

          {scanResult && (
            <div className={`p-4 rounded-2xl text-xs font-extrabold flex items-center gap-2 ${
              scanResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
            }`}>
              {scanResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span>{scanResult.message}</span>
            </div>
          )}
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 4. CLUB MANAGEMENT & STUDENT APPROVALS (IMAGE 2 PANEL 3 & 4 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'clubs') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Club Management & Approvals
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage official campus clubs and review student membership requests</p>
            </div>

            <button
              onClick={() => setShowCreateClubModal(true)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Club
            </button>
          </div>

          {/* Student Approvals Sub-Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Student Membership Requests</h4>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                {(['pending', 'approved', 'rejected'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setApprovalTab(tab)}
                    className={`px-4 py-1.5 text-xs font-extrabold capitalize rounded-xl transition-all ${
                      approvalTab === tab ? 'bg-sky-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tab} ({tab === 'pending' ? pendingCount : tab === 'approved' ? approvedCount : rejectedCount})
                  </button>
                ))}
              </div>
            </div>

            {/* Approvals Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase">
                  <tr>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Department & Roll</th>
                    <th className="p-4">Club Name</th>
                    <th className="p-4">Applied On</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {approvalRequests
                    .filter(r => r.status === approvalTab)
                    .map(req => (
                      <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900 dark:text-white">{req.studentName}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{req.department} ({req.rollNumber})</td>
                        <td className="p-4 font-bold text-sky-600 dark:text-sky-400">{req.clubName}</td>
                        <td className="p-4 text-slate-500 font-mono">{req.appliedDate}</td>
                        <td className="p-4 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApproveRequest(req.id, true)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleApproveRequest(req.id, false)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                            }`}>
                              {req.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Campus Clubs Grid */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Active Campus Clubs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map(club => (
                <div key={club.id} className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={club.logoUrl} alt={club.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h5 className="text-base font-extrabold text-slate-900 dark:text-white">{club.name}</h5>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-bold">Faculty: {club.facultyAdvisor || 'Prof. Kavitha'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{club.description}</p>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-1">
                    <span>Members: <strong>{club.memberCount}</strong></span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 5. ANNOUNCEMENTS CENTER (IMAGE 2 PANEL 5 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'notices') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Announcements Center
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Publish circulars and broadcasts to all students and faculty</p>
            </div>

            <button
              onClick={() => setShowCreateAncModal(true)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Announcement
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-extrabold uppercase">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {announcements.map(anc => (
                  <tr key={anc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{anc.title}</td>
                    <td className="p-4 text-sky-600 dark:text-sky-400 font-bold">{anc.audience}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{anc.department}</td>
                    <td className="p-4 text-slate-500 font-mono">{anc.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 6. REPORTS & ANALYTICS (IMAGE 2 PANEL 6 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'reports') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Reports & Analytics
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Campus event registrations, club statistics, and participation reports</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400">Total Events</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">28</div>
              <span className="text-[10px] text-emerald-600 font-bold">+12% growth</span>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400">Total Registrations</span>
              <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">1,250</div>
              <span className="text-[10px] text-emerald-600 font-bold">+18% growth</span>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400">Total Clubs</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">12</div>
              <span className="text-[10px] text-emerald-600 font-bold">+8% growth</span>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400">Total Students</span>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">2,348</div>
              <span className="text-[10px] text-emerald-600 font-bold">+10% growth</span>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Registrations by Event</h4>
            <div className="h-48 flex items-end justify-between gap-4 pt-8">
              {[
                { label: 'AI Workshop', val: 85 },
                { label: 'Tech Talk', val: 65 },
                { label: 'Cultural Fest', val: 95 },
                { label: 'Hackathon', val: 90 },
                { label: 'Placement', val: 75 }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-sky-600 rounded-t-lg transition-all" style={{ height: `${bar.val}%` }}></div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate w-full text-center">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 7. PROFILE & SETTINGS (IMAGE 2 PANEL 7 SPECIFICATION) */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'settings') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Coordinator Profile & Settings
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your personal profile details, theme preferences, and security settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Profile Form */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-4">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Profile Information</h4>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Appearance / Theme Selector */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-4">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Appearance Theme</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose visual theme across the campus platform.</p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-extrabold text-xs transition-all ${
                    themeMode === 'light'
                      ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-md ring-2 ring-sky-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>☀️ Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-extrabold text-xs transition-all ${
                    themeMode === 'dark'
                      ? 'bg-sky-950 border-sky-500 text-sky-400 shadow-md ring-2 ring-sky-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>🌙 Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setThemeMode('system')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-extrabold text-xs transition-all ${
                    themeMode === 'system'
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>💻 System</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Create New Event</h3>
              <button onClick={() => setShowCreateEventModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Summit 2026"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Seats Capacity</label>
                  <input
                    type="number"
                    required
                    value={eventSeats}
                    onChange={(e) => setEventSeats(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Event details..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateEventModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 font-extrabold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CLUB MODAL */}
      {showCreateClubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Create New Campus Club</h3>
              <button onClick={() => setShowCreateClubModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Robotics Club"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Faculty Advisor</label>
                <input
                  type="text"
                  required
                  value={clubFaculty}
                  onChange={(e) => setClubFaculty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={clubDesc}
                  onChange={(e) => setClubDesc(e.target.value)}
                  placeholder="Club objectives..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateClubModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 font-extrabold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow">
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {showCreateAncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Publish Announcement</h3>
              <button onClick={() => setShowCreateAncModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Internal Assessment Schedule"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={ancAudience}
                    onChange={(e) => setAncAudience(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Students">Students</option>
                    <option value="Faculty">Faculty</option>
                    <option value="All">All Audience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={ancDept}
                    onChange={(e) => setAncDept(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="AI & DS">AI & Data Science</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateAncModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 font-extrabold text-xs rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
