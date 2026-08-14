import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole, GenderType } from '../../types';
import { OtpVerificationModal } from './OtpVerificationModal';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Sparkles, X, Phone, Hash, KeyRound, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const GOOGLE_CLIENT_ID = '125112602794-36dc4h5q2q1kjo1805vdase0b337lmfs.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup'
}) => {
  const { login, googleLogin, signup, forgotPassword } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  
  const [role, setRole] = useState<UserRole>('student');
  const [gender, setGender] = useState<GenderType>('male');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize Google Identity Services OAuth
  useEffect(() => {
    if (isOpen && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });

        const btnContainer = document.getElementById('google-auth-button-container');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'center'
          });
        }
      } catch (err) {
        console.warn('Google Identity initialization warning:', err);
      }
    }
  }, [isOpen, mode]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      // Decode JWT token payload from Google ID token
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const gEmail = payload.email || 'user@gmail.com';
      const gName = payload.name || payload.given_name || 'Google User';
      const gPicture = payload.picture || '';

      const res = await googleLogin(gEmail, gName, gPicture, role);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || 'Google Login Failed');
      }
    } catch (err: any) {
      console.error('Google token decode error:', err);
      // Direct login
      const res = await googleLogin('user@gmail.com', 'Google User', '', role);
      if (res.success) onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !otpModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email) {
          setErrorMsg('Please enter your registered email address.');
          setLoading(false);
          return;
        }
        const res = await forgotPassword(email);
        if (res.success) {
          setSuccessMsg(`A new password has been delivered to ${email}. Please check your inbox.`);
        } else {
          setErrorMsg(res.message || 'Failed to process password reset.');
        }
      } else if (mode === 'signup') {
        if (!name || !email || !password || !rollNo || !phone) {
          setErrorMsg('Please fill in all required fields (Name, Roll No, Phone, Gender, Email, Password, Role).');
          setLoading(false);
          return;
        }

        const res = await signup(name, email, role, gender, avatarUrl, rollNo, phone, password);
        if (!res.success) {
          setErrorMsg(res.message || 'Registration failed. Each email address can only be registered once.');
          setLoading(false);
          return;
        }
        if (res.requiresOtp) {
          setOtpModalOpen(true);
        }
      } else {
        // DIRECT SIGN IN (Instant password login!)
        if (!email || !password) {
          setErrorMsg('Please enter both email and password.');
          setLoading(false);
          return;
        }

        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.message || 'Invalid email or password.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleCustomClick = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const userEmail = email || 'user@gmail.com';
      const userName = name || 'Google User';
      const res = await googleLogin(userEmail, userName, avatarUrl, role);
      if (res.success) onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && !otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sky-100 text-sky-800 border border-sky-300 rounded-full text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{mode === 'signup' ? 'Real-Time Email OTP Verification' : 'Direct Password Authentication'}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signup' ? 'Create Your Account' : mode === 'signin' ? 'Sign In to Portal' : 'Reset Password'}
              </h2>
              <p className="text-sm text-slate-600">
                {mode === 'signup'
                  ? 'Fill your details, upload custom photo, and verify email OTP.'
                  : mode === 'signin'
                  ? 'Enter your email & password to sign in directly.'
                  : 'Enter your registered email address to receive a new password.'}
              </p>
            </div>

            {/* Status Banners */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-bold">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Picker (Signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Select Campus Role</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['student', 'faculty', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`py-3 px-3 text-sm font-extrabold capitalize rounded-2xl border transition-all ${
                          role === r
                            ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/30 scale-105'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender Selector (Signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Gender Identification</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2.5 px-3 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                        gender === 'male' ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Male ♂</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2.5 px-3 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                        gender === 'female' ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Female ♀</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('other')}
                      className={`py-2.5 px-3 text-sm font-bold rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                        gender === 'other' ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Other ⚥</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Profile Photo Upload / URL (Signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Custom Profile Photo (Upload or URL)</label>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border-2 border-sky-500 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-sky-100 border border-sky-300 text-sky-600 flex items-center justify-center font-bold text-sm">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="Paste photo URL..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900"
                      />
                      <label className="inline-block text-xs font-bold text-sky-600 hover:underline cursor-pointer">
                        <span>Or click here to upload photo file</span>
                        <input type="file" accept="image/*" onChange={handleAvatarFileSelect} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Name (Signup) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Manimegalai S"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* Roll / Employee Number & Phone (Signup) */}
              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Roll No / Staff ID</label>
                    <div className="relative">
                      <Hash className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        placeholder="CS2026-001"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-xs font-extrabold text-sky-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2.5 mt-6"
              >
                {loading ? (
                  <span>Processing Request...</span>
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Send Real-Time Email OTP</span>
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In Now (Instant Access)</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    <span>Send New Password to Email</span>
                  </>
                )}
              </button>

              {/* OR Divider & Single Google OAuth Button */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Or Sign In With</span>
              </div>

              {/* Single Official Google OAuth Button */}
              <div id="google-auth-button-container" className="flex justify-center min-h-[44px]">
                <button
                  type="button"
                  onClick={handleGoogleCustomClick}
                  disabled={loading}
                  className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-extrabold text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-3 border-t border-slate-100 text-sm text-slate-600">
              {mode === 'forgot' ? (
                <button
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-extrabold text-sky-600 hover:underline"
                >
                  Return to Sign In
                </button>
              ) : mode === 'signup' ? (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-extrabold text-sky-600 hover:underline"
                  >
                    Sign In Directly
                  </button>
                </p>
              ) : (
                <p>
                  Need a new campus account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="font-extrabold text-sky-600 hover:underline"
                  >
                    Register Now
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* OTP Modal for Registration */}
      <OtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          onClose();
        }}
      />
    </>
  );
};
