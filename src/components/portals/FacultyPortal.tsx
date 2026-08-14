import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_NOTIFICATIONS
} from '../../services/mockData';
import type { AttendanceSession, Assignment, Submission, NotificationItem } from '../../types';
import {
  QrCode,
  FileText,
  Plus,
  CheckCircle2,
  ExternalLink,
  User as UserIcon,
  MessageSquare,
  AlertCircle,
  BookOpen,
  FolderKanban,
  Megaphone,
  Download,
  Upload,
  FileCheck,
  Users,
  X,
  Eye
} from 'lucide-react';
import { RealtimeChat } from '../common/RealtimeChat';
import { useTheme } from '../../context/ThemeContext';

interface FacultyPortalProps {
  activeTab: string;
}

interface StudyMaterial {
  id: string;
  title: string;
  course: string;
  subjectCode: string;
  fileUrl: string;
  uploadedDate: string;
}

export const FacultyPortal: React.FC<FacultyPortalProps> = ({ activeTab }) => {
  const { user, addNotification } = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const [sessions, setSessions] = useState<AttendanceSession[]>(INITIAL_ATTENDANCE_SESSIONS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [notices, setNotices] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Selected Submission Detail View Modal State
  const [selectedSubDetail, setSelectedSubDetail] = useState<Submission | null>(null);

  // Publish Success Modal State
  const [publishSuccessModal, setPublishSuccessModal] = useState<{
    id: string;
    title: string;
    department: string;
    year: string;
    semester: string;
    section: string;
    targetStudents: number;
    notificationsSent: number;
  } | null>(null);

  // Sync Submissions with Backend API
  React.useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/faculty/submissions');
        const data = await res.json();
        if (data.success && Array.isArray(data.submissions) && data.submissions.length > 0) {
          setSubmissions(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const newItems = data.submissions.filter((s: any) => !existingIds.has(s.id));
            return [...newItems, ...prev];
          });
        }
      } catch (err) {
        console.log('Faculty sync note:', err);
      }
    };

    fetchFacultyData();
    const interval = setInterval(fetchFacultyData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Study Materials State
  const [materials, setMaterials] = useState<StudyMaterial[]>([
    {
      id: 'mat_1',
      title: 'Lecture 1: Neural Networks Architecture & Optimization',
      course: 'AI & Machine Learning',
      subjectCode: 'CS402',
      fileUrl: 'https://aether.edu/materials/lecture1_nn.pdf',
      uploadedDate: '2026-08-10'
    }
  ]);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCode, setNewMatCode] = useState('CS402');
  const [newMatUrl, setNewMatUrl] = useState('');

  // Class Courses Roster State
  const coursesList = [
    { code: 'CS101', name: 'Web Application Architecture', students: 60, schedule: 'Mon/Wed 10:00 AM' },
    { code: 'CS402', name: 'Advanced Neural Networks', students: 45, schedule: 'Tue/Thu 02:00 PM' },
    { code: 'CS305', name: 'Distributed Systems & Microservices', students: 50, schedule: 'Fri 09:00 AM' }
  ];

  // New Attendance Session form
  const [subject, setSubject] = useState('Advanced Neural Networks');
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(sessions[0] || null);

  const [subjectCodeFilter, setSubjectCodeFilter] = useState('');
  // Assignment Creation Form State
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDeadline, setNewAsgDeadline] = useState('2026-08-28T23:59');
  const [newAsgMarks, setNewAsgMarks] = useState(100);
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [asgDepartment, setAsgDepartment] = useState('AI & Data Science');
  const [asgCourse, setAsgCourse] = useState('B.Tech');
  const [asgYear, setAsgYear] = useState('3rd Year');
  const [asgSemester, setAsgSemester] = useState('6');
  const [asgSection, setAsgSection] = useState('A');
  const [asgSubject, setAsgSubject] = useState('Data Structures');

  // Real PDF File Upload State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Notice & Grading Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [gradingSub, setGradingSub] = useState<Submission | null>(null);
  const [gradeMarks, setGradeMarks] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [asgError, setAsgError] = useState<string | null>(null);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const newSession: AttendanceSession = {
      id: `session_${Date.now()}`,
      subject,
      subjectCode: 'CS402',
      department: user?.department || 'Computer Science & Engineering',
      facultyName: user?.name || 'Dr. Elena Rostova',
      date: new Date().toISOString().split('T')[0],
      pin,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AETHER_ATT_SESSION_${pin}`,
      active: true
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);
    addNotification('Attendance Session Active', `Generated PIN ${pin} for ${subject}`, 'attendance');
    confetti({ particleCount: 60, spread: 50 });
  };

  // PDF File Selector & Real Validation
  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAsgError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict PDF File & MIME Type Validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setAsgError('❌ Invalid file format! Only genuine .pdf files are allowed.');
      setPdfFile(null);
      setPdfBase64(null);
      return;
    }

    // Maximum 10 MB Size Limit Check
    if (file.size > 10 * 1024 * 1024) {
      setAsgError('❌ File size exceeds 10 MB limit. Please select a smaller PDF.');
      setPdfFile(null);
      setPdfBase64(null);
      return;
    }

    setPdfFile(file);

    // Read File as Base64 for Server Storage
    const reader = new FileReader();
    reader.onload = () => {
      setPdfBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAsgError(null);
    if (!newAsgTitle) return;

    const isDuplicate = assignments.some(
      a => a.title.toLowerCase().trim() === newAsgTitle.toLowerCase().trim()
    );
    if (isDuplicate) {
      setAsgError('An assignment with this title already exists.');
      return;
    }

    setPublishing(true);

    try {
      // Call Backend API to Save Assignment & Generate Targeted Notifications
      const res = await fetch('http://localhost:5000/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAsgTitle,
          description: newAsgDesc,
          department: asgDepartment,
          course: asgCourse,
          year: asgYear,
          semester: asgSemester,
          section: asgSection,
          subject: asgSubject,
          subjectCode: 'CS301',
          facultyName: user?.name || 'Prof. Arun',
          deadline: newAsgDeadline,
          maxMarks: Number(newAsgMarks),
          instructions: 'Download assignment spec PDF, complete problem solutions, and submit before deadline.',
          pdfBase64,
          pdfFileName: pdfFile ? pdfFile.name : 'assignment_spec.pdf',
          pdfFileSize: pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB'
        })
      });

      const data = await res.json();

      const created: Assignment = data.assignment || {
        id: `asg_${Date.now()}`,
        title: newAsgTitle,
        course: asgCourse,
        subjectCode: 'CS301',
        department: asgDepartment,
        facultyName: user?.name || 'Prof. Arun',
        deadline: newAsgDeadline,
        maxMarks: Number(newAsgMarks),
        description: newAsgDesc,
        attachmentUrl: data.assignment?.attachmentUrl || 'https://aether.edu/uploads/spec.pdf',
        attachmentName: pdfFile ? pdfFile.name : 'assignment.pdf',
        attachmentSize: pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
        rubric: ['Code Correctness (50%)', 'Documentation (30%)', 'Optimization (20%)']
      };

      const now = new Date();
      const formattedTime = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setAssignments([created, ...assignments]);
      setNewAsgTitle('');
      setNewAsgDesc('');
      setPdfFile(null);
      setPdfBase64(null);
      confetti({ particleCount: 80, spread: 60 });

      // Open Step 2: Publish Success Modal / Screen
      setPublishSuccessModal({
        id: created.id,
        title: created.title,
        department: asgDepartment,
        year: asgYear,
        semester: asgSemester,
        section: asgSection,
        targetStudents: 46,
        notificationsSent: 46
      });

      addNotification(
        '🔔 New Assignment Published',
        `Published "${created.title}" for ${asgDepartment} (Sem ${asgSemester}) on ${formattedTime}`,
        'assignment'
      );
    } catch (err) {
      // Fallback local creation if offline
      const created: Assignment = {
        id: `asg_${Date.now()}`,
        title: newAsgTitle,
        course: asgCourse,
        subjectCode: 'CS301',
        department: asgDepartment,
        facultyName: user?.name || 'Prof. Arun',
        deadline: newAsgDeadline,
        maxMarks: Number(newAsgMarks),
        description: newAsgDesc,
        attachmentUrl: 'https://aether.edu/uploads/spec.pdf',
        attachmentName: pdfFile ? pdfFile.name : 'assignment.pdf',
        attachmentSize: pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
        rubric: ['Code Correctness (50%)', 'Documentation (30%)', 'Optimization (20%)']
      };
      setAssignments([created, ...assignments]);
      setNewAsgTitle('');
      setNewAsgDesc('');
      setPdfFile(null);
      setPdfBase64(null);
      confetti({ particleCount: 70, spread: 60 });
    } finally {
      setPublishing(false);
    }
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    setSubmissions(prev =>
      prev.map(s => s.id === gradingSub.id ? { ...s, marks: Number(gradeMarks), feedback: gradeFeedback, status: 'graded' } : s)
    );

    setGradingSub(null);
    confetti({ particleCount: 50, spread: 50 });
    addNotification('Submission Graded', `Graded submission for ${gradingSub.studentName} (${gradeMarks} pts)`, 'assignment');
  };

  const handleUploadStudyMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle) return;
    const newMat: StudyMaterial = {
      id: `mat_${Date.now()}`,
      title: newMatTitle,
      course: 'Computer Science',
      subjectCode: newMatCode,
      fileUrl: newMatUrl || 'https://aether.edu/materials/lecture.pdf',
      uploadedDate: new Date().toISOString().split('T')[0]
    };
    setMaterials([newMat, ...materials]);
    setNewMatTitle('');
    setNewMatUrl('');
    confetti({ particleCount: 50, spread: 50 });
    addNotification('Study Material Uploaded', `Uploaded: ${newMat.title}`, 'system');
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeMessage) return;
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'all',
      title: noticeTitle,
      message: noticeMessage,
      date: new Date().toLocaleDateString(),
      type: 'system',
      read: false
    };
    setNotices([newNotif, ...notices]);
    setNoticeTitle('');
    setNoticeMessage('');
    confetti({ particleCount: 60, spread: 50 });
    addNotification('Campus Notice Published', noticeTitle, 'system');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Faculty Portal Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'Faculty Professor'}
            className="w-20 h-20 rounded-2xl border-2 border-white object-cover shadow-lg"
          />
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{user?.name || 'Dr. Elena Rostova'}</h1>
            <p className="text-sm sm:text-base text-sky-100 mt-1 font-medium">
              Professor • {user?.department || 'Computer Science & Engineering'} • 3 Active Courses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-white/20 border border-white/40 text-white text-xs font-extrabold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Active Faculty Session
          </span>
        </div>
      </div>

      {/* TAB 1: CLASSES & COURSES */}
      {(activeTab === 'dashboard' || activeTab === 'classes') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-sky-600" />
              Classes & Course Management
            </h3>
            <p className="text-sm text-slate-500 mt-1">Overview of assigned courses, student strength, and schedules</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coursesList.map((c) => (
              <div key={c.code} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 hover:border-sky-400 transition-all">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-mono font-extrabold rounded-lg">
                  {c.code}
                </span>
                <h4 className="text-lg font-extrabold text-slate-900">{c.name}</h4>
                <p className="text-xs text-slate-500 font-medium">Schedule: <strong>{c.schedule}</strong></p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Users className="w-4 h-4 text-sky-600" /> {c.students} Enrolled
                  </span>
                  <span className="text-emerald-700 font-bold">Active Course</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: ATTENDANCE PIN & QR CREATOR */}
      {(activeTab === 'dashboard' || activeTab === 'attendance') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
                <QrCode className="w-6 h-6 text-sky-600" />
                Live Attendance PIN & QR Code Generator
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Generate real-time 6-digit session PINs & QR codes for instant student check-in
              </p>
            </div>

            <form onSubmit={handleCreateSession} className="flex items-center gap-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900"
                placeholder="Subject Name"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Generate PIN & QR
              </button>
            </form>
          </div>

          {activeSession && (
            <div className="p-6 bg-slate-50 border border-sky-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase rounded-full">
                  Live Attendance Session Active
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900">{activeSession.subject}</h4>
                <div className="p-5 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm">
                  <p className="text-xs text-slate-500 font-bold uppercase">Share 6-Digit Class PIN:</p>
                  <p className="text-5xl font-extrabold text-sky-600 font-mono tracking-widest mt-1">
                    {activeSession.pin}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-3xl border-4 border-sky-500 shadow-md text-center">
                <img src={activeSession.qrCodeUrl} alt="Attendance QR Code" className="w-44 h-44 mx-auto" />
                <p className="text-xs text-slate-500 mt-2 font-bold">Scan with Mobile Camera</p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: ASSIGNMENT CREATION & GRADING STUDIO */}
      {(activeTab === 'dashboard' || activeTab === 'assignments') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-sky-600" />
              Assignment Studio & Grading Center
            </h3>
            <p className="text-sm text-slate-500 mt-1">Create assignments, inspect GitHub solutions, and grade student submissions</p>
          </div>

          {/* Create Assignment Form */}
          <form onSubmit={handleCreateAssignment} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" /> Create New Assignment
            </h4>

            {asgError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{asgError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  placeholder="e.g. Data Structures - Linked List Assignment"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Deadline Date</label>
                <input
                  type="datetime-local"
                  required
                  value={newAsgDeadline}
                  onChange={(e) => setNewAsgDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Max Marks</label>
                <input
                  type="number"
                  required
                  value={newAsgMarks}
                  onChange={(e) => setNewAsgMarks(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-mono font-medium"
                />
              </div>
            </div>

            {/* Target Student Criteria Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Target Department</label>
                <select
                  value={asgDepartment}
                  onChange={(e) => setAsgDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900"
                >
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Target Year</label>
                <select
                  value={asgYear}
                  onChange={(e) => setAsgYear(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Semester</label>
                <select
                  value={asgSemester}
                  onChange={(e) => setAsgSemester(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900"
                >
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Section</label>
                <select
                  value={asgSection}
                  onChange={(e) => setAsgSection(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Problem Specs & Guidelines</label>
              <textarea
                rows={2}
                value={newAsgDesc}
                onChange={(e) => setNewAsgDesc(e.target.value)}
                placeholder="Enter assignment problem details..."
                className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium"
              />
            </div>

            {/* REAL PDF ATTACHMENT UPLOAD BOX */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload Original Assignment PDF Document (.pdf)
              </label>

              {pdfFile ? (
                <div className="p-4 bg-sky-50 border border-sky-300 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-xl font-extrabold text-xs flex items-center justify-center shadow">
                      PDF
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{pdfFile.name}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • Genuine PDF File Verified ✓
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfFile(null);
                      setPdfBase64(null);
                    }}
                    className="px-3 py-1.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 text-xs font-extrabold rounded-xl"
                  >
                    Remove PDF
                  </button>
                </div>
              ) : (
                <label className="p-5 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-sky-600 mb-1" />
                  <span className="text-xs font-extrabold text-slate-900">Click to Choose PDF File</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">Strictly accepts .pdf format (Max 10 MB)</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow transition-all disabled:opacity-50"
            >
              {publishing ? 'Publishing & Generating Targeted Student Notifications...' : 'Publish Assignment to Targeted Students'}
            </button>
          </form>

          {/* Submissions Review List */}
          <div className="space-y-4">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Student Submissions Pending Review</h4>
            {submissions.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold">
                No student submissions recorded yet.
              </div>
            ) : (
              submissions.map((sub) => {
                const solutionFileUrl = sub.fileUrl ? (sub.fileUrl.startsWith('http') ? sub.fileUrl : `http://localhost:5000${sub.fileUrl}`) : 'http://localhost:5000/api/submissions/file/sample_submission.pdf';

                return (
                  <div key={sub.id} className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {sub.studentName}
                        </h5>
                        <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold">({sub.rollNumber || 'CS2026-101'})</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          sub.status === 'graded' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' : sub.status === 'Late Submission' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400' : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{sub.assignmentTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Submitted: <strong>{sub.submittedAt || sub.submissionDate || 'Just now'}</strong> • File: <strong>{sub.fileName || 'Solution.pdf'}</strong> ({sub.fileSize || '1.8 MB'})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedSubDetail(sub)}
                        className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-extrabold rounded-xl"
                      >
                        View Submission
                      </button>

                      <a
                        href={solutionFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-sky-100 dark:bg-sky-950/60 hover:bg-sky-200 text-sky-800 dark:text-sky-400 text-xs font-extrabold rounded-xl border border-sky-300 dark:border-sky-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> File
                      </a>

                      <button
                        onClick={() => setGradingSub(sub)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold rounded-xl shadow"
                      >
                        {sub.status === 'graded' ? `Graded (${sub.marks} pts)` : 'Give Marks'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* TAB 4: STUDY MATERIAL VAULT */}
      {(activeTab === 'dashboard' || activeTab === 'materials') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-sky-600" />
              Study Material & Lecture Vault
            </h3>
            <p className="text-sm text-slate-500 mt-1">Upload lecture notes, PDFs, and code repositories for students</p>
          </div>

          <form onSubmit={handleUploadStudyMaterial} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-sky-600" /> Upload Study Material
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                value={newMatTitle}
                onChange={(e) => setNewMatTitle(e.target.value)}
                placeholder="Material Title (e.g. Lecture 2 Notes)"
                className="px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm font-medium"
              />
              <input
                type="text"
                value={newMatCode}
                onChange={(e) => setNewMatCode(e.target.value)}
                placeholder="Subject Code (CS402)"
                className="px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm font-mono font-medium"
              />
              <input
                type="url"
                value={newMatUrl}
                onChange={(e) => setNewMatUrl(e.target.value)}
                placeholder="Document / PDF URL"
                className="px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm font-medium"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow">
              Upload Material
            </button>
          </form>

          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold bg-sky-100 text-sky-800 rounded">
                    {m.subjectCode}
                  </span>
                  <h5 className="text-base font-extrabold text-slate-900 mt-1">{m.title}</h5>
                  <p className="text-xs text-slate-400 font-mono">Uploaded: {m.uploadedDate}</p>
                </div>
                <a href={m.fileUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-sky-600 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow">
                  <Download className="w-4 h-4" /> Download PDF
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: PUBLISH CAMPUS NOTICE */}
      {(activeTab === 'dashboard' || activeTab === 'notices') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Megaphone className="w-6 h-6 text-sky-600" />
              Publish Campus Notice
            </h3>
            <p className="text-sm text-slate-500 mt-1">Broadcast official announcements to students</p>
          </div>

          <form onSubmit={handlePublishNotice} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Notice Headline</label>
              <input
                type="text"
                required
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. Mid-Semester Lab Examination Schedule"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Notice Body</label>
              <textarea
                rows={3}
                required
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                placeholder="Enter detailed notice message..."
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow">
              Broadcast Notice
            </button>
          </form>
        </section>
      )}

      {/* TAB 6: REAL-TIME WHATSAPP CHAT */}
      {(activeTab === 'dashboard' || activeTab === 'chat') && (
        <section className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-sky-600" />
              Live Student & Faculty Messaging Studio
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              WhatsApp-style chat with text, photo/video attachments, voice notes, and instant multi-language translation
            </p>
          </div>

          <RealtimeChat
            currentUserRole="faculty"
            currentUserName={user?.name || 'Dr. Elena Rostova'}
            currentUserAvatar={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
          />
        </section>
      )}

      {/* TAB 7: FACULTY SETTINGS */}
      {(activeTab === 'settings') && (
        <section className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <UserIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" /> Faculty Profile & Settings
            </h3>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Name: {user?.name}</p>
            <p className="text-sm font-mono text-slate-600 dark:text-slate-400">Email: {user?.email}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Department: {user?.department}</p>
          </div>

          {/* Appearance / Theme */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Appearance / Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual theme for the campus management platform.</p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-extrabold text-xs transition-all ${
                  themeMode === 'light'
                    ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
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
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
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
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>System Auto</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 2: PUBLISH SUCCESS MODAL (IMAGE 1 SPEC) */}
      {publishSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-6 text-center">
            
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Assignment Published Successfully!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Assignment has been published for <strong className="text-slate-900 dark:text-white">{publishSuccessModal.department} • {publishSuccessModal.year} • {publishSuccessModal.semester}th Semester • {publishSuccessModal.section}</strong>
              </p>
            </div>

            {/* Target Metrics */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block">Target Students</span>
                <strong className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{publishSuccessModal.targetStudents}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-extrabold text-slate-400 block">Notifications Sent</span>
                <strong className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{publishSuccessModal.notificationsSent}</strong>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Assignment ID: <strong className="text-sky-600 dark:text-sky-400 font-extrabold">{publishSuccessModal.id}</strong>
            </div>

            <button
              onClick={() => setPublishSuccessModal(null)}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
            >
              Go to Assignments
            </button>

          </div>
        </div>
      )}

      {/* SUBMISSION DETAILS MODAL */}
      {selectedSubDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-400 text-xs font-mono font-extrabold rounded-lg uppercase">
                  Submission Details
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedSubDetail.assignmentTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Student & Course Details */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Student Name</span>
                  <strong className="text-slate-900 dark:text-white font-extrabold text-sm">{selectedSubDetail.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Roll Number / Email</span>
                  <strong className="text-sky-600 dark:text-sky-400 font-mono font-extrabold">{selectedSubDetail.rollNumber || 'CS2026-101'}</strong>
                  <span className="block text-slate-500 font-mono">{selectedSubDetail.studentEmail || 'poornima@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Department</span>
                  <strong className="text-slate-900 dark:text-white font-extrabold">{selectedSubDetail.department || 'Computer Science & Engineering'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Year / Semester / Section</span>
                  <strong className="text-slate-900 dark:text-white font-extrabold">{selectedSubDetail.year || '3rd Year'} • Sem {selectedSubDetail.semester || '6'} ({selectedSubDetail.section || 'A'})</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px]">Submitted At</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{selectedSubDetail.submittedAt || selectedSubDetail.submissionDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono uppercase text-[10px] text-right">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    selectedSubDetail.status === 'graded' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400' : selectedSubDetail.status === 'Late Submission' ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400' : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                  }`}>
                    {selectedSubDetail.status}
                  </span>
                </div>
              </div>

              {selectedSubDetail.comments && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block font-mono uppercase text-[10px] mb-1">Student Comments</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    "{selectedSubDetail.comments}"
                  </p>
                </div>
              )}

              {/* Submitted File Info */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 dark:text-white">{selectedSubDetail.fileName || 'Student_Solution.pdf'}</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {selectedSubDetail.fileSize || '1.8 MB'} • Original Student Upload File
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: View Submission, Download, Give Marks */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={selectedSubDetail.fileUrl ? (selectedSubDetail.fileUrl.startsWith('http') ? selectedSubDetail.fileUrl : `http://localhost:5000${selectedSubDetail.fileUrl}`) : 'http://localhost:5000/api/submissions/file/sample_submission.pdf'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> View Submission
              </a>

              <a
                href={selectedSubDetail.fileUrl ? (selectedSubDetail.fileUrl.startsWith('http') ? selectedSubDetail.fileUrl : `http://localhost:5000${selectedSubDetail.fileUrl}`) : 'http://localhost:5000/api/submissions/file/sample_submission.pdf'}
                download={selectedSubDetail.fileName || 'Student_Submission.pdf'}
                className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download
              </a>

              <button
                onClick={() => {
                  const subToGrade = selectedSubDetail;
                  setSelectedSubDetail(null);
                  setGradingSub(subToGrade);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow"
              >
                Give Marks
              </button>
            </div>

          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Grade Submission: {gradingSub.studentName}</h3>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Score / Points (Max 100)</label>
                <input
                  type="number"
                  required
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Feedback & Recommendations</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Great solution implementation..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSub(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow"
                >
                  Save Marks & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
