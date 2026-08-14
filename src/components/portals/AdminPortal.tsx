import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  Building2,
  FolderKanban,
  Calendar,
  QrCode,
  FileText,
  Briefcase,
  Megaphone,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  Eye,
  X,
  Save,
  HelpCircle,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface AdminPortalProps {
  activeTab: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ activeTab }) => {
  const { addNotification } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  // 1. User Management State & Handlers
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userList, setUserList] = useState([
    { id: 'usr_1', name: 'Poornima J', email: 'poornima@gmail.com', role: 'Student', dept: 'AI & DS', status: 'Active' },
    { id: 'usr_2', name: 'Arun K', email: 'arun@aether.com', role: 'Faculty', dept: 'CSE', status: 'Active' },
    { id: 'usr_3', name: 'Meena R', email: 'meena@aether.com', role: 'Coordinator', dept: 'Events', status: 'Active' },
    { id: 'usr_4', name: 'Ramesh S', email: 'ramesh@aether.com', role: 'Faculty', dept: 'IT', status: 'Inactive' }
  ]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [addingUserModal, setAddingUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Student', dept: 'AI & DS', status: 'Active' });

  // 2. Departments State & Handlers
  const [deptsList, setDeptsList] = useState([
    { id: 'd_1', name: 'AI & Data Science', hod: 'Dr. Kavitha', faculty: 48, students: '1,348' },
    { id: 'd_2', name: 'Computer Science', hod: 'Dr. Ramesh', faculty: 62, students: '1,158' },
    { id: 'd_3', name: 'Information Technology', hod: 'Dr. Meena', faculty: 56, students: '880' },
    { id: 'd_4', name: 'Electronics & Comm.', hod: 'Dr. Arvind', faculty: 38, students: '780' },
    { id: 'd_5', name: 'Electrical & Electronics', hod: 'Dr. Suresh', faculty: 28, students: '560' },
    { id: 'd_6', name: 'Mechanical Engineering', hod: 'Dr. Prakash', faculty: 22, students: '352' },
    { id: 'd_7', name: 'Civil Engineering', hod: 'Dr. Babu', faculty: 18, students: '282' }
  ]);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [addingDeptModal, setAddingDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', hod: '', faculty: 20, students: '500' });

  // 3. Courses State & Handlers
  const [courseTab, setCourseTab] = useState<'courses' | 'subjects'>('courses');
  const [coursesList, setCoursesList] = useState([
    { id: 'c_1', name: 'B.Tech AI & DS', dept: 'AI & DS', duration: '4 Years' },
    { id: 'c_2', name: 'B.Tech CSE', dept: 'CSE', duration: '4 Years' },
    { id: 'c_3', name: 'B.Tech IT', dept: 'IT', duration: '4 Years' },
    { id: 'c_4', name: 'B.Tech ECE', dept: 'ECE', duration: '4 Years' },
    { id: 'c_5', name: 'B.Tech EEE', dept: 'EEE', duration: '4 Years' }
  ]);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [addingCourseModal, setAddingCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', dept: 'CSE', duration: '4 Years' });

  // 4. Events State & Handlers
  const [eventsList, setEventsList] = useState([
    { id: 'e_1', name: 'AI Workshop', date: '18 Aug 2026', type: 'Workshop', regs: '240 / 300', status: 'Upcoming' },
    { id: 'e_2', name: 'Tech Talk 2024', date: '18 Aug 2026', type: 'Seminar', regs: '180 / 300', status: 'Upcoming' },
    { id: 'e_3', name: 'Cultural Fest', date: '25 Aug 2026', type: 'Festival', regs: '580 / 600', status: 'Upcoming' },
    { id: 'e_4', name: 'Hackathon 2026', date: '10 Sep 2026', type: 'Competition', regs: '120 / 150', status: 'Upcoming' },
    { id: 'e_5', name: 'Placement Training', date: '30 Sep 2026', type: 'Training', regs: '300 / 300', status: 'Completed' }
  ]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [addingEventModal, setAddingEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', date: '25 Aug 2026', type: 'Workshop', regs: '100 / 200', status: 'Upcoming' });

  // 5. Attendance State
  const [deptAttendance] = useState([
    { dept: 'AI & Data Science', overall: '89.4%', present: '18,634', absent: '2,184' },
    { dept: 'Computer Science', overall: '91.2%', present: '20,152', absent: '1,936' },
    { dept: 'Information Technology', overall: '86.7%', present: '15,486', absent: '2,372' },
    { dept: 'Electronics & Comm.', overall: '84.5%', present: '12,780', absent: '2,356' },
    { dept: 'Mechanical Engineering', overall: '80.1%', present: '9,852', absent: '2,184' }
  ]);

  // 6. Placement Drives State & Handlers
  const [drivesList, setDrivesList] = useState([
    { id: 'pd_1', company: 'TCS', role: 'Software Engineer', ctc: '7.0 LPA', date: '25 Aug 2026', applicants: 320, status: 'Active' },
    { id: 'pd_2', company: 'Infosys', role: 'System Engineer', ctc: '6.5 LPA', date: '28 Aug 2026', applicants: 280, status: 'Active' },
    { id: 'pd_3', company: 'Wipro', role: 'Project Engineer', ctc: '6.0 LPA', date: '30 Aug 2026', applicants: 260, status: 'Active' },
    { id: 'pd_4', company: 'Zoho', role: 'Developer', ctc: '6.0 LPA', date: '05 Sep 2026', applicants: 150, status: 'Upcoming' },
    { id: 'pd_5', company: 'Microsoft', role: 'SDE Intern', ctc: '15.0 LPA', date: '10 Sep 2026', applicants: 95, status: 'Upcoming' }
  ]);
  const [editingDrive, setEditingDrive] = useState<any | null>(null);
  const [addingDriveModal, setAddingDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({ company: '', role: '', ctc: '8.0 LPA', date: '01 Sep 2026', applicants: 100, status: 'Active' });

  // 7. Club State & Handlers
  const [clubsList, setClubsList] = useState([
    { id: 'cl_1', name: 'Coding Club', coord: 'Prof. Kavitha', members: 158, status: 'Active' },
    { id: 'cl_2', name: 'AI Club', coord: 'Prof. Arun', members: 132, status: 'Active' },
    { id: 'cl_3', name: 'Robotics Club', coord: 'Prof. Meena', members: 98, status: 'Active' },
    { id: 'cl_4', name: 'Literary Club', coord: 'Prof. Ramesh', members: 76, status: 'Active' },
    { id: 'cl_5', name: 'Photography Club', coord: 'Prof. Suresh', members: 84, status: 'Active' }
  ]);
  const [editingClub, setEditingClub] = useState<any | null>(null);
  const [addingClubModal, setAddingClubModal] = useState(false);
  const [clubForm, setClubForm] = useState({ name: '', coord: 'Prof. Kavitha', members: 50, status: 'Active' });

  // 8. Announcements State & Handlers
  const [noticesList, setNoticesList] = useState([
    { id: 'n_1', title: 'Internal Assessment Schedule', desc: 'The internal assessment for all departments will be held from 27 Aug 2026.', date: '13 Aug 2026' },
    { id: 'n_2', title: 'Holiday Notice', desc: 'The campus will remain closed on 23 Aug 2026 on account of Independence Day.', date: '12 Aug 2026' },
    { id: 'n_3', title: 'Library Timings Change', desc: 'Library timing will be changed from 8 AM to 8 PM from next week.', date: '11 Aug 2026' },
    { id: 'n_4', title: 'Workshop on ML', desc: 'Department of CSE is organizing a workshop on Machine Learning.', date: '10 Aug 2026' }
  ]);
  const [addingNoticeModal, setAddingNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', desc: '', date: '13 Aug 2026' });

  // 9. Roles & Permissions State
  const [rolesList, setRolesList] = useState([
    { id: 'r_1', role: 'Super Admin', desc: 'Full access to all modules', users: 2 },
    { id: 'r_2', role: 'Admin', desc: 'Manage college operations', users: 5 },
    { id: 'r_3', role: 'Faculty', desc: 'Manage classes and students', users: 312 },
    { id: 'r_4', role: 'Coordinator', desc: 'Manage events and clubs', users: 8 },
    { id: 'r_5', role: 'Student', desc: 'Access student portal', users: 5248 }
  ]);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [addingRoleModal, setAddingRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ role: '', desc: '', users: 10 });

  // 10. Support Tickets State & Handlers
  const [ticketsList, setTicketsList] = useState([
    { id: 't_1', title: 'Login Issue', status: 'Open', date: '13 Aug 2026' },
    { id: 't_2', title: 'Email Not Received', status: 'In Progress', date: '12 Aug 2026' },
    { id: 't_3', title: 'Assignment Upload Error', status: 'Resolved', date: '10 Aug 2026' },
    { id: 't_4', title: 'Event Registration Issue', status: 'Open', date: '09 Aug 2026' }
  ]);
  const [addingTicketModal, setAddingTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ title: '', status: 'Open', date: '13 Aug 2026' });

  // Dynamic Backend Data Sync Effect
  React.useEffect(() => {
    const fetchAdminBackendData = async () => {
      try {
        const evtRes = await fetch('http://localhost:5000/api/coordinator/events');
        const evtData = await evtRes.json();
        if (evtData.success && Array.isArray(evtData.events)) {
          setEventsList(prev => {
            const existingIds = new Set(prev.map(e => e.id));
            const newItems = evtData.events.filter((e: any) => !existingIds.has(e.id));
            return [...newItems, ...prev];
          });
        }
      } catch (err) {
        // Backend offline note
      }
    };
    fetchAdminBackendData();
    const interval = setInterval(fetchAdminBackendData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Chart Data
  const monthlyAttendanceData = [
    { month: 'Jan', rate: 82 },
    { month: 'Feb', rate: 84 },
    { month: 'Mar', rate: 86 },
    { month: 'Apr', rate: 85 },
    { month: 'May', rate: 88 },
    { month: 'Jun', rate: 86 },
    { month: 'Jul', rate: 89 },
    { month: 'Aug', rate: 87.6 }
  ];

  const deptDonutData = [
    { name: 'AI & DS', value: 1348, color: '#0284c7' },
    { name: 'CSE', value: 1158, color: '#0ea5e9' },
    { name: 'IT', value: 880, color: '#38bdf8' },
    { name: 'ECE', value: 780, color: '#10b981' },
    { name: 'EEE', value: 560, color: '#f59e0b' },
    { name: 'Mechanical', value: 352, color: '#6366f1' },
    { name: 'Civil', value: 282, color: '#8b5cf6' }
  ];

  const handleActionToast = (msg: string) => {
    confetti({ particleCount: 50, spread: 50 });
    addNotification('Admin Action', msg, 'system');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono font-extrabold rounded-lg uppercase">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">System Executive Administrator Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">AETHERCAMPUS – ADMIN DASHBOARD</h1>
          <p className="text-sm text-slate-300 mt-1 font-medium">Click any sidebar tab to view specific module details</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleActionToast('Generated full campus system report')}
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download System Report
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 1: DASHBOARD OVERVIEW */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'dashboard' || activeTab === 'overview') && (
        <div className="space-y-8">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back, Admin 👋</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's what's happening in your campus today.</p>
            </div>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm rounded-xl">
              13 August 2026
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Total Students</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">5,248</div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md inline-block">+120 this month</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Total Faculty</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">312</div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md inline-block">+8 this month</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Departments</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{deptsList.length}</div>
              <span className="text-xs font-extrabold text-slate-400 inline-block">—</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Events This Month</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{eventsList.length}</div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md inline-block">+4 new</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Placement Drives</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{drivesList.length}</div>
              <span className="text-xs font-extrabold text-sky-600 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md inline-block">+6 new</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-xs">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Attendance Today</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">87.6%</div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md inline-block">↑ 3.2%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Monthly Attendance Overview</h4>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" domain={[70, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#0284c7" fill="#38bdf8" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Students by Department</h4>
              <div className="flex items-center gap-4">
                <div className="w-36 h-36 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={deptDonutData} innerRadius={38} outerRadius={60} paddingAngle={2} dataKey="value">
                        {deptDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  {deptDonutData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                        {d.name}
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3.5 shadow-xs">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Placement Statistics</h4>
              <div className="space-y-3">
                {[
                  { label: 'Eligible Students', val: 2450, total: 2450, color: 'bg-blue-600' },
                  { label: 'Applied', val: 1980, total: 2450, color: 'bg-sky-500' },
                  { label: 'Shortlisted', val: 680, total: 2450, color: 'bg-indigo-500' },
                  { label: 'Interview', val: 210, total: 2450, color: 'bg-amber-500' },
                  { label: 'Selected', val: 95, total: 2450, color: 'bg-emerald-500' }
                ].map((st, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      <span>{st.label}</span>
                      <span className="font-mono text-slate-900 dark:text-white">{st.val.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${st.color}`} style={{ width: `${(st.val / st.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 2: USER MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">USER MANAGEMENT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add, view, edit, activate/deactivate or delete users. Assign roles and manage user status.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => {
                  setUserForm({ name: '', email: '', role: 'Student', dept: 'AI & DS', status: 'Active' });
                  setAddingUserModal(true);
                }}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {userList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{usr.name}</td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{usr.email}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{usr.role}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{usr.dept}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                        usr.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                      }`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(usr);
                            setUserForm({ name: usr.name, email: usr.email, role: usr.role, dept: usr.dept, status: usr.status });
                          }}
                          className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setUserList(prev => prev.map(u => u.id === usr.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
                            handleActionToast(`Toggled ${usr.name} status`);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl"
                          title="Toggle Status"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUserList(prev => prev.filter(u => u.id !== usr.id));
                            handleActionToast(`Deleted ${usr.name}`);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 3: DEPARTMENTS */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'departments' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">DEPARTMENTS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all departments in the college.</p>
            </div>
            <button
              onClick={() => {
                setDeptForm({ name: '', hod: '', faculty: 20, students: '500' });
                setAddingDeptModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">HOD</th>
                  <th className="p-4">Faculty Count</th>
                  <th className="p-4">Students Count</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {deptsList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{d.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{d.hod}</td>
                    <td className="p-4 font-mono font-bold">{d.faculty}</td>
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{d.students}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingDept(d);
                          setDeptForm({ name: d.name, hod: d.hod, faculty: d.faculty, students: d.students });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 4: COURSES & SUBJECTS */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'courses' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">COURSES & SUBJECTS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all courses, semesters and subjects.</p>
            </div>

            <button
              onClick={() => {
                setCourseForm({ name: '', dept: 'CSE', duration: '4 Years' });
                setAddingCourseModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {coursesList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{c.dept}</td>
                    <td className="p-4 font-mono font-bold">{c.duration}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setCourseForm({ name: c.name, dept: c.dept, duration: c.duration });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 5: EVENTS MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'events' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">EVENTS MANAGEMENT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create, manage and track events.</p>
            </div>
            <button
              onClick={() => {
                setEventForm({ name: '', date: '25 Aug 2026', type: 'Workshop', regs: '100 / 200', status: 'Upcoming' });
                setAddingEventModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Event Name</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Registrations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {eventsList.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{e.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs sm:text-sm">{e.date}</td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{e.type}</td>
                    <td className="p-4 font-mono font-bold text-sky-600 dark:text-sky-400">{e.regs}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-md ${
                        e.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingEvent(e);
                          setEventForm({ name: e.name, date: e.date, type: e.type, regs: e.regs, status: e.status });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 6: ATTENDANCE MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'attendance' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">ATTENDANCE MANAGEMENT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor attendance across departments and subjects.</p>
            </div>
            <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-mono font-extrabold rounded-xl">Aug 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Department</th>
                  <th className="p-4">Overall %</th>
                  <th className="p-4">Present</th>
                  <th className="p-4">Absent</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {deptAttendance.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{a.dept}</td>
                    <td className="p-4 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{a.overall}</td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{a.present}</td>
                    <td className="p-4 font-mono text-red-600 dark:text-red-400">{a.absent}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleActionToast(`Viewed attendance for ${a.dept}`)} className="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 7: ASSIGNMENT MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'assignments' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">ASSIGNMENT MANAGEMENT</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor assignment publishing, submission rates, and grading compliance across departments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-2">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Total Published</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">142</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-2">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Submissions Reviewed</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">3,480</div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-2">
              <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase">Average Score</span>
              <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">78%</div>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 8: PLACEMENT MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'placements' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">PLACEMENT MANAGEMENT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage placement drives, applications and company details.</p>
            </div>
            <button
              onClick={() => {
                setDriveForm({ company: '', role: '', ctc: '8.0 LPA', date: '01 Sep 2026', applicants: 100, status: 'Active' });
                setAddingDriveModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Drive
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">CTC</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Applicants</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {drivesList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{d.company}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{d.role}</td>
                    <td className="p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">{d.ctc}</td>
                    <td className="p-4 font-mono text-xs sm:text-sm">{d.date}</td>
                    <td className="p-4 font-mono font-bold text-sky-600 dark:text-sky-400">{d.applicants}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-md ${
                        d.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingDrive(d);
                          setDriveForm({ company: d.company, role: d.role, ctc: d.ctc, date: d.date, applicants: d.applicants, status: d.status });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 9: CLUB MANAGEMENT */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'clubs' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">CLUB MANAGEMENT</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage student clubs and memberships.</p>
            </div>
            <button
              onClick={() => {
                setClubForm({ name: '', coord: 'Prof. Kavitha', members: 50, status: 'Active' });
                setAddingClubModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Club
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Club Name</th>
                  <th className="p-4">Coordinator</th>
                  <th className="p-4">Members</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {clubsList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{c.coord}</td>
                    <td className="p-4 font-mono font-bold text-sky-600 dark:text-sky-400">{c.members}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingClub(c);
                          setClubForm({ name: c.name, coord: c.coord, members: c.members, status: c.status });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 10: ANNOUNCEMENTS */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'notices' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">ANNOUNCEMENTS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage campus announcements and notices.</p>
            </div>
            <button
              onClick={() => {
                setNoticeForm({ title: '', desc: '', date: '13 Aug 2026' });
                setAddingNoticeModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Announcement
            </button>
          </div>

          <div className="space-y-4">
            {noticesList.map((n) => (
              <div key={n.id} className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{n.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">{n.date}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{n.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 11: REPORTS & ANALYTICS */}
      {/* -------------------------------------------------------------------------- */}
      {(activeTab === 'reports' || activeTab === 'analytics') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">REPORTS & ANALYTICS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View detailed reports and visual performance metrics.</p>
            </div>
            <button onClick={() => handleActionToast('Downloading full campus analytics report')} className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-3">
              <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Assignment Completion Rate</span>
              <div className="w-28 h-28 mx-auto rounded-full border-4 border-sky-500 border-t-slate-200 flex items-center justify-center font-extrabold text-2xl text-slate-900 dark:text-white">
                78%
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center space-y-3">
              <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Event Participation Rate</span>
              <div className="w-28 h-28 mx-auto rounded-full border-4 border-emerald-500 border-t-slate-200 flex items-center justify-center font-extrabold text-2xl text-slate-900 dark:text-white">
                68%
              </div>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 12: SYSTEM LOGS */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'audit' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">SYSTEM LOGS</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track all system activities and security events.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Activity</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { act: 'Admin Login', usr: 'admin@aether.com', time: '13 Aug 2026, 10:30 AM', ip: '192.168.1.10' },
                  { act: 'New Event Created', usr: 'coordinator@aether.com', time: '13 Aug 2026, 10:15 AM', ip: '192.168.1.12' },
                  { act: 'New Faculty Added', usr: 'admin@aether.com', time: '13 Aug 2026, 09:45 AM', ip: '192.168.1.10' },
                  { act: 'Assignment Published', usr: 'faculty@aether.com', time: '13 Aug 2026, 09:20 AM', ip: '192.168.1.15' },
                  { act: 'Attendance Imported', usr: 'admin@aether.com', time: '13 Aug 2026, 08:50 AM', ip: '192.168.1.10' }
                ].map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 font-mono text-xs sm:text-sm">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{l.act}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{l.usr}</td>
                    <td className="p-4 text-slate-400 font-sans">{l.time}</td>
                    <td className="p-4 text-sky-600 dark:text-sky-400 font-bold">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 13: PERMISSIONS & ROLES */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'permissions' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">PERMISSIONS & ROLES</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage platform roles and permission matrices.</p>
            </div>
            <button
              onClick={() => {
                setRoleForm({ role: '', desc: '', users: 10 });
                setAddingRoleModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Role
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-extrabold">
                <tr>
                  <th className="p-4">Role Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Users Count</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {rolesList.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{r.role}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{r.desc}</td>
                    <td className="p-4 font-mono font-bold text-sky-600 dark:text-sky-400">{r.users.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setEditingRole(r);
                          setRoleForm({ role: r.role, desc: r.desc, users: typeof r.users === 'number' ? r.users : 5000 });
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-extrabold text-xs rounded-xl flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 14: SETTINGS */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">SETTINGS</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure global platform settings and system appearance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">College Name</label>
              <input type="text" readOnly value="Aether Institute of Technology" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">College Address</label>
              <input type="text" readOnly value="Coimbatore, Tamil Nadu, India" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
              <input type="text" readOnly value="2025 - 2027" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white font-mono" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
              <input type="text" readOnly value="(GMT+05:30) Asia/Kolkata" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white font-mono" />
            </div>
          </div>

          {/* Appearance / Theme Settings */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Appearance / Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select system-wide theme preference.</p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-extrabold text-xs transition-all ${
                  themeMode === 'light'
                    ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Light Mode</span>
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
                <span>Dark Mode</span>
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
                <span>System Auto</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODULE 15: SUPPORT & HELP */}
      {/* -------------------------------------------------------------------------- */}
      {activeTab === 'support' && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">SUPPORT & HELP</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Raise support requests and view FAQs.</p>
            </div>
            <button
              onClick={() => {
                setTicketForm({ title: '', status: 'Open', date: '13 Aug 2026' });
                setAddingTicketModal(true);
              }}
              className="px-4 py-2.5 bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>

          <div className="space-y-3">
            {ticketsList.map((t) => (
              <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{t.title}</p>
                  <span className="text-xs text-slate-400 font-mono">{t.date}</span>
                </div>
                <span className={`px-3 py-1 text-xs font-extrabold uppercase rounded-full ${
                  t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* INTERACTIVE MODALS FOR USER / DEPT / EVENT / DRIVE / CLUB / NOTICE / ROLE */}
      {/* -------------------------------------------------------------------------- */}
      {(editingUser || addingUserModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {editingUser ? 'Edit User Account' : 'Add New User Account'}
              </h3>
              <button onClick={() => { setEditingUser(null); setAddingUserModal(false); }} className="p-1 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingUser) {
                setUserList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
                handleActionToast(`Saved changes for ${userForm.name}`);
              } else {
                setUserList([{ id: `usr_${Date.now()}`, ...userForm }, ...userList]);
                handleActionToast(`Created account for ${userForm.name}`);
              }
              setEditingUser(null);
              setAddingUserModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save User Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & ADD DEPT MODAL */}
      {(editingDept || addingDeptModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button onClick={() => { setEditingDept(null); setAddingDeptModal(false); }} className="p-1 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingDept) {
                setDeptsList(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...deptForm } : d));
                handleActionToast(`Updated department ${deptForm.name}`);
              } else {
                setDeptsList([{ id: `d_${Date.now()}`, ...deptForm }, ...deptsList]);
                handleActionToast(`Added department ${deptForm.name}`);
              }
              setEditingDept(null);
              setAddingDeptModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">HOD Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.hod}
                  onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Department
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & ADD CLUB MODAL */}
      {(editingClub || addingClubModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {editingClub ? 'Edit Club Details' : 'Add New Student Club'}
              </h3>
              <button onClick={() => { setEditingClub(null); setAddingClubModal(false); }} className="p-1 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingClub) {
                setClubsList(prev => prev.map(c => c.id === editingClub.id ? { ...c, ...clubForm } : c));
                handleActionToast(`Updated club ${clubForm.name}`);
              } else {
                setClubsList([{ id: `cl_${Date.now()}`, ...clubForm }, ...clubsList]);
                handleActionToast(`Created club ${clubForm.name}`);
              }
              setEditingClub(null);
              setAddingClubModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  value={clubForm.name}
                  onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Faculty Coordinator</label>
                <input
                  type="text"
                  required
                  value={clubForm.coord}
                  onChange={(e) => setClubForm({ ...clubForm, coord: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Club
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM HIGHLIGHTS BANNER */}
      <div className="p-4 bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-sky-900 dark:text-sky-400">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Manage Users, Roles & Permissions</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Departments, Courses & Subjects</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Events, Attendance, Assignments</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Placements & Reports</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> System Logs & Security</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Persistent Light / Dark Mode</span>
      </div>

    </div>
  );
};
