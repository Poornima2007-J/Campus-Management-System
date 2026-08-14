export type UserRole = 'student' | 'faculty' | 'coordinator' | 'admin';
export type GenderType = 'male' | 'female' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: GenderType;
  department: string;
  collegeName?: string;
  rollNumber?: string;
  phone?: string;
  year?: string;
  semester?: string;
  section?: string;
  avatar: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  verified: boolean;
  cgpa?: number;
  password?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  sessionPin?: string;
  verifiedByQR?: boolean;
}

export interface AttendanceSession {
  id: string;
  subject: string;
  subjectCode: string;
  department: string;
  facultyName: string;
  date: string;
  pin: string;
  qrCodeUrl: string;
  active: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  subjectCode: string;
  department: string;
  facultyName: string;
  facultyId?: string;
  year?: string;
  semester?: string;
  section?: string;
  subject?: string;
  deadline: string;
  maxMarks: number;
  description: string;
  instructions?: string;
  rubric?: string[];
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: string;
  mimeType?: string;
  createdAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  subjectCode?: string;
  subject?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  rollNumber: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  submissionDate: string;
  submittedAt?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  gitHubUrl?: string;
  comments?: string;
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late' | 'Late Submission';
}

export interface CampusEvent {
  id: string;
  title: string;
  bannerUrl: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  registrationDeadline: string;
  totalSeats: number;
  registeredSeats: number;
  speakers: string[];
  qrPassCode: string;
  category: 'hackathon' | 'workshop' | 'cultural' | 'sports' | 'seminar';
  externalRegistrationLink?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  studentId: string;
  studentName: string;
  ticketCode: string;
  checkedIn: boolean;
  registeredAt: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogo: string;
  roleTitle: string;
  ctc: string;
  eligibilityMinCgpa: number;
  eligibleDepartments: string[];
  deadline: string;
  location: string;
  description: string;
  status: 'active' | 'closed' | 'upcoming';
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  companyName: string;
  roleTitle: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  cgpa: number;
  resumeUrl: string;
  appliedDate: string;
  status: 'applied' | 'shortlisted' | 'interviewing' | 'offered' | 'rejected';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  type: 'assignment' | 'SUBMISSION' | 'ASSIGNMENT' | 'attendance' | 'event' | 'placement' | 'system';
  read: boolean;
  assignmentId?: string;
  submissionId?: string;
  studentId?: string;
  studentName?: string;
  facultyId?: string;
  facultyName?: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  subjectCode?: string;
  deadline?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  role: UserRole;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  leadName?: string;
  leadStudent?: string;
  memberCount: number;
  description: string;
  logo?: string;
  logoUrl?: string;
  facultyAdvisor?: string;
  joined?: boolean;
  upcomingEventsCount?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionType?: 'view_attendance' | 'view_assignments' | 'view_placements' | 'view_events' | 'view_settings' | 'go_landing' | 'contact_support';
}
