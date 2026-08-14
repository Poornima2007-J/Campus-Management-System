import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, FileText, Briefcase, User as UserIcon, MessageSquare, ExternalLink } from 'lucide-react';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PLACEMENTS
} from '../../services/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenChatWithMember?: (memberName: string, memberRole: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenChatWithMember
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = INITIAL_USERS.filter(
    u => u.name.toLowerCase().includes(query.toLowerCase()) || u.department.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = INITIAL_EVENTS.filter(
    e => e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAssignments = INITIAL_ASSIGNMENTS.filter(
    a => a.title.toLowerCase().includes(query.toLowerCase()) || a.course.toLowerCase().includes(query.toLowerCase()) || a.subjectCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlacements = INITIAL_PLACEMENTS.filter(
    p => p.companyName.toLowerCase().includes(query.toLowerCase()) || p.roleTitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Search Bar Input */}
        <div className="relative p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, courses, events, assignments..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base font-bold focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4 bg-slate-50">
          
          {/* People & Members Directory */}
          {filteredUsers.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-sky-600" /> Campus Members Directory ({filteredUsers.length})
              </div>
              <div className="space-y-2">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-sky-400 flex items-center justify-between gap-3 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-sky-300" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-extrabold text-slate-900">{u.name}</p>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-sky-100 text-sky-800 rounded">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{u.department} • <span className="font-mono text-slate-700">{u.rollNumber}</span></p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenChatWithMember) {
                          onOpenChatWithMember(u.name, u.role);
                        } else {
                          onNavigateTab('chat');
                        }
                      }}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>WhatsApp Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Campus Events
              </div>
              <div className="space-y-1.5">
                {filteredEvents.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onNavigateTab('events');
                      onClose();
                    }}
                    className="p-3 bg-white rounded-2xl hover:bg-sky-50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{e.title}</p>
                      <p className="text-xs text-slate-500">{e.venue} • {e.date}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-600" /> Course Assignments
              </div>
              <div className="space-y-1.5">
                {filteredAssignments.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onNavigateTab('assignments');
                      onClose();
                    }}
                    className="p-3 bg-white rounded-2xl hover:bg-sky-50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500 font-mono">Code: {a.subjectCode} • {a.course}</p>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-lg">{a.maxMarks} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placements */}
          {filteredPlacements.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Placement Drives
              </div>
              <div className="space-y-1.5">
                {filteredPlacements.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigateTab('placements');
                      onClose();
                    }}
                    className="p-3 bg-white rounded-2xl hover:bg-sky-50 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">{p.companyName} — {p.roleTitle}</p>
                      <p className="text-xs text-emerald-700 font-bold">{p.ctc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
