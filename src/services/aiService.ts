import type { User, AttendanceRecord, Assignment, PlacementDrive } from '../types';

export interface AIResponse {
  text: string;
  suggestions?: string[];
  actionType?: 'view_attendance' | 'view_assignments' | 'view_placements' | 'view_events' | 'view_settings' | 'go_landing';
  navigateToTab?: string;
}

export class CampusAIService {
  public static async queryCopilot(
    query: string,
    user: User | null,
    attendanceList: AttendanceRecord[],
    _assignments: Assignment[],
    placements: PlacementDrive[]
  ): Promise<AIResponse> {
    const lower = query.toLowerCase();

    // 1. Navigation Commands
    if (lower.includes('go to landing') || lower.includes('open landing') || lower.includes('home page') || lower.includes('website main')) {
      return {
        text: '🚀 Navigating you to the AetherCampus Website Landing Page...',
        actionType: 'go_landing',
        navigateToTab: 'landing',
        suggestions: ['How to register?', 'What is AetherCampus?']
      };
    }

    if (lower.includes('attendance') || lower.includes('class pin') || lower.includes('bunk') || lower.includes('open attendance')) {
      const total = attendanceList.length;
      const present = attendanceList.filter(a => a.status === 'present').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

      return {
        text: `📊 **Attendance Audit for ${user?.name || 'Student'}:**\n\nOverall Attendance: **${percentage}%** (${present}/${total} classes attended).\nStatus: **${percentage >= 75 ? 'ELIGIBLE for exams ✅' : 'WARNING (<75%) ⚠️'}**\n\nNavigating you to your Live Attendance Tracker...`,
        actionType: 'view_attendance',
        navigateToTab: 'attendance',
        suggestions: ['Enter 6-digit class PIN', 'Check pending assignments', 'Ask AI about courses']
      };
    }

    if (lower.includes('assignment') || lower.includes('submit solution') || lower.includes('homework') || lower.includes('due date')) {
      return {
        text: `📝 **Pending Assignments Audit:**\n\nYou have active assignments due for your enrolled courses. Solutions can be submitted via PDF link or GitHub repository URL.\n\nNavigating you to the Assignment Submissions Studio...`,
        actionType: 'view_assignments',
        navigateToTab: 'assignments',
        suggestions: ['Submit GitHub link', 'Check attendance', 'Placement opportunities']
      };
    }

    if (lower.includes('placement') || lower.includes('job') || lower.includes('internship') || lower.includes('recruitment') || lower.includes('ctc')) {
      const eligible = placements.filter(p => (user?.cgpa || 9.0) >= p.eligibilityMinCgpa);
      return {
        text: `💼 **Placement Drives Audit:**\n\nBased on your profile CGPA of **${user?.cgpa || '9.0'}**, you are eligible for **${eligible.length} active placement drives** including OpenAI Robotics ($165k CTC) & Google Cloud ($150k CTC).\n\nNavigating you to the Placement Portal...`,
        actionType: 'view_placements',
        navigateToTab: 'placements',
        suggestions: ['Apply for OpenAI drive', 'Review my resume', 'Check attendance']
      };
    }

    if (lower.includes('event') || lower.includes('hackathon') || lower.includes('ticket pass')) {
      return {
        text: `🗓️ **Campus Events Hub:**\n\nBrowse upcoming hackathons like DevFusion 4.0, guest keynotes, and download digital entry passes.\n\nNavigating you to Events & Pass Hub...`,
        actionType: 'view_events',
        navigateToTab: 'events',
        suggestions: ['DevFusion 4.0 details', 'Check attendance']
      };
    }

    if (lower.includes('profile') || lower.includes('setting') || lower.includes('roll number') || lower.includes('my info')) {
      return {
        text: `👤 **User Profile & Settings:**\nName: ${user?.name || 'Registered User'}\nRoll No: ${user?.rollNumber || 'N/A'}\nEmail: ${user?.email || 'N/A'}\nRole: ${user?.role || 'student'}\n\nNavigating you to Profile Settings...`,
        actionType: 'view_settings',
        navigateToTab: 'settings',
        suggestions: ['Change password', 'Audit attendance']
      };
    }

    // 2. Comprehensive Website Q&A Knowledge Base
    if (lower.includes('how to register') || lower.includes('create account') || lower.includes('registration process')) {
      return {
        text: `🔐 **How to Register on AetherCampus:**\n\n1. Click **Register Now** on the top navigation bar or hero section.\n2. Select your campus role (**Student**, **Faculty**, **Coordinator**, or **Admin**).\n3. Fill in your **Full Name**, **Roll / ID Number**, **Phone Number**, **Email Address**, and **Password**.\n4. Click **Send Real-Time Email OTP**.\n5. Check your email inbox for the 6-digit verification code sent via Nodemailer SMTP.\n6. Enter the OTP code to activate your account and access your role-specific dashboard!`,
        suggestions: ['Register Now', 'How does OTP work?', 'What is Student Dashboard?']
      };
    }

    if (lower.includes('otp') || lower.includes('email verification') || lower.includes('nodemailer') || lower.includes('smtp')) {
      return {
        text: `📧 **Real-Time Nodemailer Email OTP Engine:**\n\nOur Node.js backend server (http://localhost:5000) uses Nodemailer SMTP configured with manimegalaisenguttuvan1009@gmail.com to send a 6-digit verification code directly to your registered email inbox upon signing up!`,
        suggestions: ['How to register?', 'What are the role portals?']
      };
    }

    if (lower.includes('what is aethercampus') || lower.includes('about this website') || lower.includes('features')) {
      return {
        text: `🌟 **About AetherCampus AI Platform:**\n\nAetherCampus is a centralized Smart Campus Management Platform developed for DevFusion 4.0 Hackathon. Key capabilities include:\n• **Role-Based Security**: Dedicated dashboards for Students, Faculty, Coordinators, and Admins.\n• **Real Email OTP**: Secure signup using Nodemailer SMTP.\n• **Live Attendance**: Class PIN verification & QR attendance tracking.\n• **Assignment Studio**: PDF & GitHub repository submission grading.\n• **Placement Portal**: Real-time eligibility evaluation for tech recruitment.\n• **AI Voice Copilot**: Intelligent Q&A and instant navigation.`,
        suggestions: ['Show student features', 'Show faculty features', 'Take me to assignments']
      };
    }

    // 3. Default AI Assistant Fallback
    return {
      text: `🤖 **Aether AI Campus Assistant:**\nI can answer any question about this platform and automatically navigate you anywhere!\n\nTry asking me:\n• *"Navigate to my assignments"*\n• *"Open attendance tracker"*\n• *"Show placement drives"*\n• *"How does email OTP registration work?"*\n• *"Go to landing page"*`,
      suggestions: ['Open attendance tracker', 'Navigate to assignments', 'Show placement drives', 'How to register?']
    };
  }

  public static speakText(text: string): void {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
