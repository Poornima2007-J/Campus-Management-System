import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, ShieldCheck, RefreshCw, X, AlertCircle } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { pendingOtp, verifyOtp, resendOtp, clearPendingOtp } = useAuth();
  
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, resendTimer]);

  if (!isOpen || !pendingOtp) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMsg(null);

    // Auto-advance focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');

    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code sent to your email.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const success = await verifyOtp(fullCode);
      if (success) {
        onClose();
      } else {
        setErrorMsg('Invalid 6-digit OTP code. Please check your email inbox.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    resendOtp();
    setResendTimer(60);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl space-y-6 text-center relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            clearPendingOtp();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Badge */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-100 text-sky-600 border border-sky-300 flex items-center justify-center shadow-md">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Check Your Email Inbox</h3>
          <p className="text-xs text-slate-600 mt-1">
            We sent a confidential 6-digit OTP verification code to:
            <br />
            <strong className="text-sky-700 font-mono text-xs">{pendingOtp.email}</strong>
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 6 Digit Input Grid */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 text-center text-xl font-mono font-extrabold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 shadow-sm"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying OTP Code...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Complete Registration</span>
              </>
            )}
          </button>
        </form>

        {/* Resend Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Didn't receive email?</span>
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`font-bold flex items-center gap-1 ${
              canResend ? 'text-sky-600 hover:underline cursor-pointer' : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? 'animate-spin' : ''}`} />
            <span>{canResend ? 'Resend OTP Email' : `Resend in ${resendTimer}s`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
