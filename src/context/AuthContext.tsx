import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole, GenderType, NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../services/mockData';

interface PendingOtp {
  email: string;
  type: 'signup';
  name?: string;
  role?: UserRole;
  gender?: GenderType;
  avatar?: string;
  rollNo?: string;
  phone?: string;
  debugOtp?: string;
}

interface AuthContextType {
  user: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  pendingOtp: PendingOtp | null;
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (email: string, name?: string, picture?: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, role: UserRole, gender: GenderType, avatar?: string, rollNo?: string, phone?: string, password?: string) => Promise<{ success: boolean; requiresOtp?: boolean; message?: string }>;
  verifyOtp: (inputCode: string) => Promise<boolean>;
  resendOtp: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  clearPendingOtp: () => void;
  updateUserProfile: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aether_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('aether_role');
    return (saved as UserRole) || 'student';
  });

  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // REAL-TIME BACKEND NOTIFICATIONS POLLING
  useEffect(() => {
    const syncNotificationsFromBackend = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications');
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotifs = data.notifications.filter((n: any) => !existingIds.has(n.id));
            return [...newNotifs, ...prev];
          });
        }
      } catch (err) {
        // Backend offline note
      }
    };

    syncNotificationsFromBackend();
    const interval = setInterval(syncNotificationsFromBackend, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aether_user', JSON.stringify(user));
      localStorage.setItem('aether_role', user.role);
      setCurrentRole(user.role);
    } else {
      localStorage.removeItem('aether_user');
      localStorage.removeItem('aether_role');
    }
  }, [user]);

  // REGISTRATION: Requires Email OTP verification (Strict Unique Email Enforcement)
  const signup = async (
    name: string,
    email: string,
    role: UserRole,
    gender: GenderType,
    avatar?: string,
    rollNo?: string,
    phone?: string,
    password?: string
  ) => {
    let fetchedOtp: string | undefined = undefined;
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, rollNo, phone, role, gender, avatar, password })
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message || 'Registration failed.' };
      }
      if (data.debugOtp) {
        fetchedOtp = data.debugOtp;
      }
    } catch (err: any) {
      console.warn('Backend send-otp connection warning:', err.message);
    }

    setPendingOtp({
      email,
      type: 'signup',
      name,
      role,
      gender,
      avatar,
      rollNo,
      phone,
      debugOtp: fetchedOtp
    });

    return { success: true, requiresOtp: true };
  };

  // DIRECT SIGN IN: Password authentication WITHOUT OTP!
  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setCurrentRole(data.user.role);
        setPendingOtp(null);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid login credentials' };
      }
    } catch (err: any) {
      // Local fallback for offline mode
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'student',
        gender: 'male',
        department: 'Computer Science & Engineering',
        rollNumber: 'CS2026-101',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        verified: true,
        cgpa: 9.0
      };
      setUser(fallbackUser);
      setCurrentRole('student');
      return { success: true };
    }
  };

  const googleLogin = async (email: string, name?: string, picture?: string, role?: UserRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, picture, role })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setCurrentRole(data.user.role);
        setPendingOtp(null);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Google Login Failed' };
      }
    } catch (err: any) {
      const fallbackUser: User = {
        id: `usr_g_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: role || 'student',
        gender: 'male',
        department: 'Computer Science & Engineering',
        rollNumber: 'CS2026-G101',
        avatar: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        verified: true,
        cgpa: 9.0
      };
      setUser(fallbackUser);
      setCurrentRole(role || 'student');
      return { success: true };
    }
  };

  const verifyOtp = async (inputCode: string): Promise<boolean> => {
    if (!pendingOtp) return false;

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingOtp.email, otp: inputCode })
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setCurrentRole(data.user.role);
        setPendingOtp(null);
        return true;
      }
    } catch (err) {
      console.error('Verify OTP API Error:', err);
    }

    return false;
  };

  const resendOtp = async () => {
    if (!pendingOtp) return;
    try {
      await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingOtp.email,
          name: pendingOtp.name,
          role: pendingOtp.role,
          gender: pendingOtp.gender,
          avatar: pendingOtp.avatar
        })
      });
    } catch (err) {
      // Handled
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, message: 'User not logged in.' };
    try {
      const res = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currentPassword, newPassword })
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err: any) {
      return { success: false, message: 'Server error while changing password.' };
    }
  };

  const updateUserProfile = (fields: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...fields };
      setUser(updated);
      localStorage.setItem('aether_user', JSON.stringify(updated));
    }
  };

  const logout = () => {
    setUser(null);
    setPendingOtp(null);
    localStorage.removeItem('aether_user');
    localStorage.removeItem('aether_role');
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: user?.id || 'all',
      title,
      message,
      date: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearPendingOtp = () => setPendingOtp(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        isAuthenticated: !!user,
        pendingOtp,
        notifications,
        unreadCount,
        login,
        googleLogin,
        signup,
        verifyOtp,
        resendOtp,
        forgotPassword,
        changePassword,
        logout,
        switchRole,
        markNotificationRead,
        addNotification,
        clearPendingOtp,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
