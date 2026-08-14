import type {
  User,
  AttendanceRecord,
  Assignment,
  Submission,
  CampusEvent,
  PlacementDrive,
  NotificationItem,
  AuditLog,
  Club,
  AttendanceSession
} from '../types';

export const INITIAL_USERS: User[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    studentId: 'usr_student_1',
    studentName: 'Registered Student',
    subject: 'Computer Science & Software Engineering',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    verifiedByQR: true
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'session_1',
    subject: 'Computer Science Core',
    subjectCode: 'CS101',
    department: 'Computer Science & Engineering',
    facultyName: 'Department Faculty',
    date: new Date().toISOString().split('T')[0],
    pin: '849201',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AETHER_ATT_SESSION_849201',
    active: true
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Web Application Architecture & Database Integration',
    course: 'Computer Science & Web Technologies',
    subjectCode: 'CS101',
    department: 'Computer Science & Engineering',
    facultyName: 'Course Instructor',
    deadline: '2026-08-30T23:59',
    maxMarks: 100,
    description: 'Implement a modern web application with RESTful API endpoints and real-time email authentication.',
    rubric: ['API Design & Functionality (40%)', 'Authentication Security (30%)', 'Clean UI & Design System (30%)']
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_1',
    assignmentTitle: 'Web Application Architecture & Database Integration',
    subjectCode: 'CS101',
    studentId: 'usr_student_1',
    studentName: 'Manimegalai S',
    rollNumber: 'CS2026-101',
    submissionDate: new Date().toISOString(),
    fileUrl: 'https://aether.edu/uploads/cs101_submission.pdf',
    gitHubUrl: 'https://github.com/manimegalai/smart-campus-platform',
    status: 'submitted'
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt_1',
    title: 'DevFusion 4.0 Hackathon',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    description: 'Annual campus hackathon showcasing modern AI web applications and campus intelligence.',
    venue: 'Main Campus Auditorium & Virtual Metaverse',
    date: '2026-09-05',
    time: '09:00 AM PST',
    registrationDeadline: '2026-09-01',
    totalSeats: 300,
    registeredSeats: 45,
    speakers: ['Keynote Speaker'],
    qrPassCode: 'AETHER_EVENT_PASS_DEV40',
    category: 'hackathon',
    externalRegistrationLink: 'https://devfusion4.tech/register'
  }
];

export const INITIAL_PLACEMENTS: PlacementDrive[] = [
  {
    id: 'plc_1',
    companyName: 'Technology Solutions Corp',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    roleTitle: 'Full Stack Software Engineer',
    ctc: '$125,000 / year',
    eligibilityMinCgpa: 7.5,
    eligibleDepartments: ['Computer Science & Engineering', 'AI & Robotics'],
    deadline: '2026-09-15',
    location: 'San Francisco, CA / Remote',
    description: 'Recruitment drive for full-stack software engineers proficient in Node.js, TypeScript, and modern web frameworks.',
    status: 'active'
  }
];

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'club_1',
    name: 'AI & Robotics Developers Society',
    category: 'Technical',
    leadName: 'Society Head',
    memberCount: 120,
    description: 'Student organization for building artificial intelligence, machine learning, and agentic web apps.',
    logo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&auto=format&fit=crop&q=80',
    joined: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'all',
    title: 'Welcome to AetherCampus',
    message: 'Register your account to access real-time attendance, assignments, and placement drives.',
    date: 'Today',
    type: 'system',
    read: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    action: 'SMTP_CONFIGURED',
    performedBy: 'System Engine',
    role: 'admin',
    timestamp: new Date().toLocaleTimeString(),
    details: 'Gmail Nodemailer SMTP transporter initialized with App Password for manimegalaisenguttuvan1009@gmail.com',
    ipAddress: '127.0.0.1'
  }
];
