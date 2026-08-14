import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, CheckCircle2, ChevronRight, ArrowLeft, GraduationCap, Calendar, Star, Briefcase, Compass, Rocket, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentOnboardingWizard: React.FC<StudentOnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile, addNotification } = useAuth();

  const [slide, setSlide] = useState<number>(0); // 0 = Welcome, 1..5 = Q1..Q5, 6 = Final

  // Form State
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [yearSemester, setYearSemester] = useState(user?.semester || '3rd Year – Sem 5 / 6');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Web Development', 'AI / Machine Learning']);
  const [careerGoal, setCareerGoal] = useState<string>('💼 Get a Software Job');
  const [campusExploration, setCampusExploration] = useState<string[]>([
    '📢 Announcements & Notices',
    '📚 Assignments & Study Materials',
    '🎯 Placement Drives',
    '🎉 Events'
  ]);

  if (!isOpen) return null;

  const departmentOptions = [
    'AI & Data Science',
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Other'
  ];

  const yearSemesterOptions = [
    '1st Year – Sem 1 / 2',
    '2nd Year – Sem 3 / 4',
    '3rd Year – Sem 5 / 6',
    '4th Year – Sem 7 / 8'
  ];

  const interestOptions = [
    'Web Development',
    'AI / Machine Learning',
    'Data Science',
    'Cybersecurity',
    'Cloud / DevOps',
    'App Development',
    'UI/UX',
    'IoT',
    'Others'
  ];

  const careerGoalOptions = [
    '💼 Get a Software Job',
    '🏢 Prepare for Placements',
    '🚀 Build a Startup',
    '🎓 Higher Studies',
    '🧑💻 Become a Freelancer',
    '🤔 Still Exploring'
  ];

  const explorationOptions = [
    '📢 Announcements & Notices',
    '📚 Assignments & Study Materials',
    '🎯 Placement Drives',
    '🎉 Events',
    '🏆 Clubs & Activities',
    '👨🏫 Faculty Interaction',
    '📅 Campus Calendar'
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      if (selectedInterests.length < 3) {
        setSelectedInterests([...selectedInterests, item]);
      }
    }
  };

  const toggleExploration = (item: string) => {
    if (campusExploration.includes(item)) {
      setCampusExploration(campusExploration.filter(i => i !== item));
    } else {
      setCampusExploration([...campusExploration, item]);
    }
  };

  const handleFinishOnboarding = () => {
    updateUserProfile({
      department,
      semester: yearSemester,
      skills: selectedInterests,
      bio: `Career Goal: ${careerGoal} | Interests: ${selectedInterests.join(', ')}`
    });

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    addNotification('Dashboard Personalised', 'Welcome to AetherCampus! Your dashboard is customized to your preferences.', 'system');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bar */}
        {slide > 0 && slide <= 5 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold text-slate-500">
              <span>Step {slide} of 5</span>
              <span>{Math.round((slide / 5) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(slide / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* SLIDE 0 — WELCOME */}
        {slide === 0 && (
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-20 h-20 bg-sky-100 border-2 border-sky-300 text-sky-600 rounded-3xl flex items-center justify-center mx-auto shadow-md shadow-sky-600/20">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-800 border border-sky-300 rounded-full text-xs font-extrabold">
                <span>👋 Welcome to AetherCampus!</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Let's Personalize Your Student Dashboard
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Answer 5 quick preferences so we can tailor your timetable, assignment studio, placement drives, and club events in real-time.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium max-w-md mx-auto space-y-1 text-left">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Department & Semester tailored analytics
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Personalized job & placement recommendations
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Customizable quick action buttons
              </p>
            </div>

            <button
              onClick={() => setSlide(1)}
              className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* QUESTION 1 — DEPARTMENT (Mandatory) */}
        {slide === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold">Question 1 of 5</span>
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">* Mandatory</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Which department are you studying in?</h3>
              <p className="text-xs text-slate-500">We'll use this to display department-specific announcements, events, and course analytics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {departmentOptions.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`p-4 rounded-2xl border text-left text-sm font-extrabold transition-all flex items-center justify-between ${
                    department === dept
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 shrink-0" />
                    <span>{dept}</span>
                  </span>
                  {department === dept && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSlide(0)}
                className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setSlide(2)}
                className="w-2/3 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <span>Next: Year & Semester</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 2 — YEAR & SEMESTER (Mandatory) */}
        {slide === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold">Question 2 of 5</span>
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">* Mandatory</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Which year & semester are you currently in?</h3>
              <p className="text-xs text-slate-500">Personalizes your timetable, assignment studio deadlines, and attendance stats.</p>
            </div>

            <div className="space-y-3">
              {yearSemesterOptions.map((ys) => (
                <button
                  key={ys}
                  type="button"
                  onClick={() => setYearSemester(ys)}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-extrabold transition-all flex items-center justify-between ${
                    yearSemester === ys
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-[1.01]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span>{ys}</span>
                  </span>
                  {yearSemester === ys && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSlide(1)}
                className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setSlide(3)}
                className="w-2/3 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <span>Next: Areas of Interest</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 3 — AREAS OF INTEREST (Optional - Select up to 3) */}
        {slide === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold">Question 3 of 5</span>
                <button
                  onClick={() => setSlide(4)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600 underline"
                >
                  Skip for now
                </button>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">What are your areas of interest? ⭐</h3>
              <p className="text-xs text-slate-500">Select up to 3 topics to receive tailored workshops, clubs, and projects.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {interestOptions.map((opt) => {
                const selected = selectedInterests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`p-3.5 rounded-2xl border text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
                      selected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${selected ? 'text-white fill-white' : 'text-slate-400'}`} />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSlide(2)}
                className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setSlide(4)}
                className="w-2/3 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <span>Next: Career Goal</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 4 — CAREER GOAL (Optional) */}
        {slide === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold">Question 4 of 5</span>
                <button
                  onClick={() => setSlide(5)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600 underline"
                >
                  Skip for now
                </button>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">What is your current career goal?</h3>
              <p className="text-xs text-slate-500">Prioritizes placement drives, internship notifications, and recruitment prep.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {careerGoalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setCareerGoal(goal)}
                  className={`p-4 rounded-2xl border text-left text-sm font-extrabold transition-all flex items-center justify-between ${
                    careerGoal === goal
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-[1.01]'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50'
                  }`}
                >
                  <span>{goal}</span>
                  {careerGoal === goal && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSlide(3)}
                className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setSlide(5)}
                className="w-2/3 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <span>Next: Campus Exploration</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 5 — CAMPUS EXPLORATION (Optional - Select all) */}
        {slide === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-extrabold">Question 5 of 5</span>
                <button
                  onClick={() => setSlide(6)}
                  className="text-xs font-extrabold text-slate-400 hover:text-slate-600 underline"
                >
                  Skip for now
                </button>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">What would you like to explore on campus?</h3>
              <p className="text-xs text-slate-500">Select all that interest you to customize your Quick Actions panel.</p>
            </div>

            <div className="space-y-2.5">
              {explorationOptions.map((exp) => {
                const selected = campusExploration.includes(exp);
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => toggleExploration(exp)}
                    className={`w-full p-3.5 rounded-2xl border text-xs font-extrabold text-left transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{exp}</span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSlide(4)}
                className="w-1/3 py-3.5 bg-slate-100 text-slate-700 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setSlide(6)}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <span>Final Step: Finish Setup</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* FINAL SLIDE — YOU'RE ALL SET! */}
        {slide === 6 && (
          <div className="text-center space-y-6 py-6 animate-fade-in">
            <div className="w-24 h-24 bg-emerald-100 border-2 border-emerald-300 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/20">
              <Rocket className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                You're all set! 🎉
              </h2>
              <p className="text-base font-extrabold text-slate-800">
                Your AetherCampus dashboard is ready.
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We've personalized your experience based on your department (<strong className="text-slate-800">{department}</strong>) and preferences.
              </p>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              <span>🚀 Go to My Dashboard</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
