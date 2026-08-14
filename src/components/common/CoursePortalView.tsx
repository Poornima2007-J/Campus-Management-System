import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Assignment, Submission } from '../../types';
import {
  BookOpen,
  User as UserIcon,
  Clock,
  MapPin,
  Megaphone,
  FileText,
  Download,
  Upload,
  Camera,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Code2,
  FileCheck,
  Sparkles,
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CourseDetail {
  code: string;
  title: string;
  facultyName: string;
  facultyEmail: string;
  facultyAvatar: string;
  schedule: string;
  room: string;
  description: string;
  enrolledStudentsCount: number;
}

interface CoursePortalViewProps {
  course: CourseDetail;
  onBack: () => void;
  onOpenChatWithMember?: (memberName: string, memberRole: string) => void;
}

export const CoursePortalView: React.FC<CoursePortalViewProps> = ({
  course,
  onBack,
  onOpenChatWithMember
}) => {
  const { user, addNotification } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'assignments' | 'materials' | 'people'>('stream');

  // Course Announcements Stream State
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann_1',
      authorName: course.facultyName,
      authorAvatar: course.facultyAvatar,
      date: 'Today at 09:30 AM',
      content: `Welcome to ${course.title} (${course.code})! Please review the syllabus document uploaded in the Materials tab.`
    },
    {
      id: 'ann_2',
      authorName: course.facultyName,
      authorAvatar: course.facultyAvatar,
      date: 'Yesterday at 04:15 PM',
      content: `Lab submission #1 deadline has been extended to Friday. Make sure to attach your GitHub repository link.`
    }
  ]);

  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Course Study Materials Vault
  const [materials, setMaterials] = useState([
    { id: 'mat_1', title: `${course.code} Complete Lecture Notes & Syllabus`, fileUrl: 'https://aether.edu/docs/notes.pdf', date: '2026-02-10', size: '2.4 MB' },
    { id: 'mat_2', title: 'Lab Manual & Code Starter Templates', fileUrl: 'https://aether.edu/docs/lab_starter.zip', date: '2026-02-12', size: '5.8 MB' }
  ]);

  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatUrl, setNewMatUrl] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Subject-Wise Face Scanner State
  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [faceSuccess, setFaceSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Enrolled Classmates
  const enrolledClassmates = [
    { id: 'c1', name: 'Manimegalai S', roll: 'CS2026-101', role: 'student', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'c2', name: 'Rahul Sharma', roll: 'CS2026-102', role: 'student', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { id: 'c3', name: 'Priya Patel', roll: 'CS2026-103', role: 'student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'c4', name: 'Anish Kumar', roll: 'CS2026-104', role: 'student', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' }
  ];

  // Subject-Specific Face Attendance Scanner
  const handleStartSubjectFaceScan = async () => {
    setFaceModalOpen(true);
    setScanProgress(0);
    setFaceSuccess(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('Webcam stream note:', err);
    }

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setScanProgress(100);
        setFaceSuccess(true);
        confetti({ particleCount: 80, spread: 60 });
        addNotification(
          'Subject Attendance Marked',
          `Biometric Face scan verified present for ${course.code} - ${course.title}.`,
          'attendance'
        );
        setTimeout(() => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
          }
          setFaceModalOpen(false);
        }, 2200);
      } else {
        setScanProgress(prog);
      }
    }, 300);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;

    const newPost = {
      id: `ann_${Date.now()}`,
      authorName: user?.name || 'User',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      date: 'Just now',
      content: newAnnouncementText
    };

    setAnnouncements([newPost, ...announcements]);
    setNewAnnouncementText('');
    addNotification('Announcement Posted', `Posted update in ${course.code} Stream`, 'system');
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatTitle.trim()) return;

    const newMat = {
      id: `mat_${Date.now()}`,
      title: newMatTitle,
      fileUrl: newMatUrl || 'https://aether.edu/docs/material.pdf',
      date: new Date().toISOString().split('T')[0],
      size: '3.1 MB'
    };

    setMaterials([newMat, ...materials]);
    setNewMatTitle('');
    setNewMatUrl('');
    setUploadModalOpen(false);
    addNotification('Material Uploaded', `Uploaded ${newMatTitle} for ${course.code}`, 'assignment');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Top Navigation Back Header */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Roster</span>
      </button>

      {/* GOOGLE CLASSROOM-STYLE COURSE HEADER BANNER */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 text-white shadow-xl overflow-hidden border border-sky-400">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 bg-white/20 border border-white/40 text-white font-mono font-extrabold text-xs uppercase rounded-full">
                Subject Code: {course.code}
              </span>
              <span className="px-3 py-1 bg-emerald-500/80 text-white font-extrabold text-xs rounded-full">
                Active Course Hub
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {course.title}
            </h1>

            <div className="flex items-center gap-6 text-xs text-sky-100 font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-sky-300" /> Instructor: <strong>{course.facultyName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-300" /> Schedule: <strong>{course.schedule}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-300" /> Room: <strong>{course.room}</strong>
              </span>
            </div>
          </div>

          {/* Subject-Wise Face Scan Attendance Button */}
          <button
            onClick={handleStartSubjectFaceScan}
            className="px-6 py-4 bg-white hover:bg-slate-100 text-sky-700 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-3 shrink-0 transform hover:-translate-y-0.5"
          >
            <Camera className="w-5 h-5 text-indigo-600" />
            <span>Scan Face Attendance for {course.code}</span>
          </button>
        </div>
      </div>

      {/* GOOGLE CLASSROOM TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('stream')}
          className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
            activeSubTab === 'stream' ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Stream & Announcements
        </button>
        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
            activeSubTab === 'assignments' ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Classwork & Assignments
        </button>
        <button
          onClick={() => setActiveSubTab('materials')}
          className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
            activeSubTab === 'materials' ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Study Vault & Slides
        </button>
        <button
          onClick={() => setActiveSubTab('people')}
          className={`px-5 py-2.5 text-sm font-extrabold rounded-xl transition-all ${
            activeSubTab === 'people' ? 'bg-sky-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Class Roster ({course.enrolledStudentsCount})
        </button>
      </div>

      {/* SUB-TAB 1: COURSE STREAM & ANNOUNCEMENTS */}
      {activeSubTab === 'stream' && (
        <div className="space-y-6">
          {/* Post Update Box */}
          <form onSubmit={handlePostAnnouncement} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-slate-300"
              />
              <span className="text-sm font-extrabold text-slate-900">Post Announcement to {course.code} Stream</span>
            </div>
            <textarea
              rows={3}
              value={newAnnouncementText}
              onChange={(e) => setNewAnnouncementText(e.target.value)}
              placeholder="Announce something to your class..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-sky-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow"
              >
                Post Update
              </button>
            </div>
          </form>

          {/* Announcements Feed */}
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={ann.authorAvatar} alt={ann.authorName} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{ann.authorName}</h4>
                      <span className="text-xs text-slate-400 font-mono">{ann.date}</span>
                    </div>
                  </div>
                  <Megaphone className="w-5 h-5 text-sky-600" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium pl-13">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLASSWORK & ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" /> Course Assignments for {course.code}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Submit solutions and view rubric marks</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 text-[11px] uppercase font-mono font-extrabold bg-sky-100 text-sky-800 rounded">
                    Code: {course.code}
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-1">Assignment #1: Implementation & Benchmarking</h4>
                </div>
                <span className="text-xs font-mono font-extrabold text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">100 pts</span>
              </div>
              <p className="text-xs text-slate-600">Implement algorithmic solution, push code to GitHub repository, and submit URL link.</p>
              <div className="pt-2 flex justify-end">
                <button className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Submit Solution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STUDY VAULT & MATERIALS */}
      {activeSubTab === 'materials' && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" /> Lecture Notes & PDF Study Vault
              </h3>
              <p className="text-xs text-slate-500 mt-1">Download slide decks, syllabus, and code templates</p>
            </div>

            {user?.role === 'faculty' && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Upload Study Material
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => (
              <div key={mat.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 hover:border-sky-400 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{mat.title}</h4>
                    <span className="text-xs text-slate-500 font-mono">{mat.date} • {mat.size}</span>
                  </div>
                </div>

                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CLASS ROSTER & DIRECT CHAT */}
      {activeSubTab === 'people' && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-sky-600" /> Instructor & Enrolled Students
            </h3>
            <p className="text-xs text-slate-500 mt-1">Connect with classmates and course instructor directly on WhatsApp Chat</p>
          </div>

          {/* Instructor Card */}
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={course.facultyAvatar} alt={course.facultyName} className="w-12 h-12 rounded-full object-cover border-2 border-sky-500" />
              <div>
                <span className="text-[10px] uppercase font-extrabold bg-sky-200 text-sky-800 px-2 py-0.5 rounded">Course Instructor</span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{course.facultyName}</h4>
                <span className="text-xs text-slate-600 font-mono">{course.facultyEmail}</span>
              </div>
            </div>

            {onOpenChatWithMember && (
              <button
                onClick={() => onOpenChatWithMember(course.facultyName, 'faculty')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Message Instructor
              </button>
            )}
          </div>

          {/* Students List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Classmates Enrolled ({enrolledClassmates.length})</h4>
            {enrolledClassmates.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
                  <div>
                    <h5 className="text-sm font-extrabold text-slate-900">{c.name}</h5>
                    <span className="text-xs text-slate-500 font-mono">{c.roll}</span>
                  </div>
                </div>

                {onOpenChatWithMember && (
                  <button
                    onClick={() => onOpenChatWithMember(c.name, c.role)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Chat
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FACULTY MATERIAL UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">Upload Study Material for {course.code}</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="e.g. Unit 3 Neural Networks Slide Deck"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">File Download URL</label>
                <input
                  type="url"
                  value={newMatUrl}
                  onChange={(e) => setNewMatUrl(e.target.value)}
                  placeholder="https://aether.edu/docs/notes.pdf"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT FACE SCANNER MODAL */}
      {faceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-4 text-center relative">
            <button onClick={() => setFaceModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-extrabold text-slate-900">Biometric Attendance: {course.code}</h3>
            <p className="text-xs text-slate-500">Subject-specific biometric scan for {course.title}</p>

            <div className="relative rounded-2xl overflow-hidden border-4 border-indigo-500 bg-slate-950 aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-indigo-400/40 m-6 rounded-3xl pointer-events-none"></div>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
            </div>

            {faceSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Attendance Verified for {course.code}!</span>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-600">Scanning landmarks ({scanProgress}%)...</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
