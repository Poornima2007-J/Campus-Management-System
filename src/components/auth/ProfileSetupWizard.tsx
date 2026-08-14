import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Building2, GraduationCap, Calendar, CheckCircle2, ChevronRight, Hash, Phone, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, addNotification } = useAuth();

  const [step, setStep] = useState(1);
  const [collegeName, setCollegeName] = useState(user?.collegeName || 'Poornima Institute of Engineering & Technology');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(user?.semester || 'Semester 6 (3rd Year)');
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || 'CS2026-108');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [bio, setBio] = useState(user?.bio || 'Enthusiastic Student exploring Full-Stack AI Web Engineering');

  if (!isOpen) return null;

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      collegeName,
      department,
      semester,
      rollNumber,
      phone,
      bio
    });

    confetti({ particleCount: 90, spread: 70 });
    addNotification('Profile Auto-Filled', 'Q&A Profile Wizard completed! Your campus profile is updated.', 'system');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-100 text-sky-800 border border-sky-300 rounded-full text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Q&A Profile Auto-Fill Wizard</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Campus Profile
          </h2>
          <p className="text-sm text-slate-600">
            Answer 3 quick questions to populate your degree, college, department & roll roster
          </p>
        </div>

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all ${
                step === s ? 'w-10 bg-sky-600' : step > s ? 'w-6 bg-emerald-500' : 'w-6 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleFinishWizard} className="space-y-6">
          
          {/* STEP 1: College & Institution */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3">
                <Building2 className="w-8 h-8 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Question 1 of 3: College Name</h4>
                  <p className="text-xs text-slate-600">Select or enter your official university/college campus name</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">College / Institution Name</label>
                <input
                  type="text"
                  required
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Poornima Institute of Engineering & Technology"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  'Poornima Institute of Engineering & Technology',
                  'Poornima College of Engineering',
                  'Poornima University Main Campus',
                  'Smart Campus Tech Institute'
                ].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCollegeName(c)}
                    className="p-3 text-left text-xs font-bold rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-slate-700 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Next Question: Department & Branch</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Department & Academic Year */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Question 2 of 3: Department & Semester</h4>
                  <p className="text-xs text-slate-600">Select your specialization and current academic year</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Department Name</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Academic Semester / Year</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="Semester 1 (1st Year)">Semester 1 (1st Year)</option>
                  <option value="Semester 2 (1st Year)">Semester 2 (1st Year)</option>
                  <option value="Semester 3 (2nd Year)">Semester 3 (2nd Year)</option>
                  <option value="Semester 4 (2nd Year)">Semester 4 (2nd Year)</option>
                  <option value="Semester 5 (3rd Year)">Semester 5 (3rd Year)</option>
                  <option value="Semester 6 (3rd Year)">Semester 6 (3rd Year)</option>
                  <option value="Semester 7 (4th Year)">Semester 7 (4th Year)</option>
                  <option value="Semester 8 (4th Year)">Semester 8 (4th Year)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Next Question: Contact Details</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Roll Number & Bio */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3">
                <Hash className="w-8 h-8 text-sky-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Question 3 of 3: Roll Number & Bio</h4>
                  <p className="text-xs text-slate-600">Enter your Roll ID, Phone Number and personal bio</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Roll / Registration No</label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="CS2026-108"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Bio Headline</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-bold text-slate-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Auto-Fill & Save Profile</span>
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
