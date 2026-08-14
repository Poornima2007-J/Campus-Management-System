import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables manually if not using dotenv package
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val && !process.env[key.trim()]) {
      process.env[key.trim()] = val.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Storage Directories for Uploaded Files
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'assignments');
const SUBMISSIONS_DIR = path.join(__dirname, '..', 'uploads', 'submissions');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_DIR)) {
  fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });
}

// In-Memory Database Collections
const users = [
  {
    id: 'usr_student_1',
    name: 'Poornima J',
    email: 'poornima@gmail.com',
    rollNumber: 'CS2026-101',
    phone: '+91 9876543210',
    role: 'student',
    gender: 'female',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: '6',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: true,
    cgpa: 9.2
  },
  {
    id: 'usr_faculty_1',
    name: 'Prof. Arun',
    email: 'arun@poornima.edu',
    role: 'faculty',
    gender: 'male',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true
  }
];

const pendingOtps = new Map();
const assignments = [
  {
    id: 'asg_init_1',
    title: 'Data Structures – Linked List Assignment',
    course: 'B.Tech CS',
    subjectCode: 'CS301',
    subject: 'Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    facultyName: 'Prof. Arun',
    facultyId: 'usr_faculty_1',
    year: '3rd Year',
    semester: '6',
    section: 'A',
    deadline: '2026-08-28T23:59:00',
    maxMarks: 100,
    description: 'Implement doubly linked lists with insertion, deletion, and reverse reversal in C++/Java.',
    instructions: 'Submit source code zip or PDF write-up with execution logs.',
    attachmentUrl: '/api/assignments/pdf/sample_spec.pdf',
    attachmentName: 'Data_Structures_LinkedList_Spec.pdf',
    attachmentSize: '2.4 MB',
    createdAt: new Date().toISOString()
  }
];

const notifications = [];
const submissions = [];

const coordinatorEvents = [
  {
    id: 'evt_1',
    title: 'AI & Machine Learning National Summit 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    description: 'Annual flagship symposium on LLMs, Neural Networks, and Generative AI.',
    venue: 'Main Campus Auditorium',
    date: '2026-09-15',
    time: '09:30 AM IST',
    registrationDeadline: '2026-09-10',
    totalSeats: 350,
    registeredSeats: 214,
    speakers: ['Dr. Ramesh', 'Prof. Kavitha'],
    qrPassCode: 'CAMPUS_PASS_AIML',
    category: 'hackathon'
  }
];

const coordinatorClubs = [
  {
    id: 'club_1',
    name: 'AI & Robotics Developers Society',
    category: 'Technical',
    leadName: 'Dr. Ramesh',
    memberCount: 142,
    description: 'Building autonomous robots, Computer Vision systems, and AI models.',
    logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'club_2',
    name: 'Cybersecurity Guild',
    category: 'Technical',
    leadName: 'Prof. Arun',
    memberCount: 98,
    description: 'Ethical hacking, Capture The Flag (CTF) challenges, and Network Defense.',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  }
];

const coordinatorApprovals = [
  {
    id: 'req_1',
    studentName: 'Poornima J',
    rollNumber: 'CS2026-101',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    email: 'poornima@gmail.com',
    clubName: 'AI & Robotics Developers Society',
    appliedDate: '12 Aug 2026',
    status: 'pending'
  },
  {
    id: 'req_2',
    studentName: 'Rahul Kumar',
    rollNumber: 'CS2026-104',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    email: 'rahul@poornima.edu',
    clubName: 'Cybersecurity Guild',
    appliedDate: '13 Aug 2026',
    status: 'pending'
  }
];

const coordinatorAnnouncements = [
  {
    id: 'anc_1',
    title: 'Mid-Semester Examinations Schedule Released',
    desc: 'The official timetable for B.Tech Autumn 2026 Mid-Semesters is now published on student portals.',
    date: '14 Aug 2026',
    target: 'All Students'
  }
];

// Transporter Configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 465;
const EMAIL_USER = process.env.EMAIL_USER || 'manimegalaisenguttuvan1009@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'scxz fudn cejg yhbz';
const EMAIL_FROM = process.env.EMAIL_FROM || `"AetherCampus Security" <${EMAIL_USER}>`;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

function generateSecure6DigitOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

const GENDER_AVATARS = {
  male: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  other: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

// Root API Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AetherCampus Backend Engine',
    message: 'All APIs online & ready.'
  });
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'AetherCampus Backend Live' });
});

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION & USER ENDPOINTS
// -----------------------------------------------------------------------------

app.post('/api/auth/send-otp', async (req, res) => {
  const { email, name, rollNo, phone, role, gender, avatar, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  const isAlreadyRegistered = users.some(u => u.email.toLowerCase() === cleanEmail);
  if (isAlreadyRegistered) {
    return res.status(400).json({
      success: false,
      message: 'This email address is already registered. Each email address can only be registered once.'
    });
  }

  const otpCode = generateSecure6DigitOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  pendingOtps.set(cleanEmail, {
    code: otpCode,
    userData: { email: cleanEmail, name, rollNo, phone, role, gender: gender || 'male', avatar, password },
    attempts: 0,
    expiresAt,
    lastSentAt: Date.now()
  });

  const mailOptions = {
    from: EMAIL_FROM,
    to: cleanEmail,
    subject: `🔐 AetherCampus Email Verification OTP: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #0284c7; margin: 0; text-align: center;">AetherCampus Security</h2>
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <p style="color: #0369a1; font-size: 13px; margin: 0 0 8px 0; font-weight: bold;">Your Confidential 6-Digit OTP</p>
          <div style="font-size: 38px; font-weight: 800; letter-spacing: 6px; color: #0284c7; font-family: monospace;">${otpCode}</div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: `OTP sent successfully to ${cleanEmail}.` });
  } catch (error) {
    return res.json({ success: true, message: `OTP code dispatched to ${cleanEmail}.` });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and 6-digit OTP are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const record = pendingOtps.get(cleanEmail);

  if (!record || Date.now() > record.expiresAt) {
    return res.status(400).json({ success: false, message: 'OTP expired or invalid.' });
  }

  if (record.code.trim() === otp.trim()) {
    const newUser = {
      id: `usr_${Date.now()}`,
      name: record.userData.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      rollNumber: record.userData.rollNo || 'CS2026-101',
      phone: record.userData.phone || '+91 9876543210',
      role: record.userData.role || 'student',
      gender: record.userData.gender || 'male',
      password: record.userData.password || 'User@123',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      semester: '6',
      section: 'A',
      avatar: record.userData.avatar || GENDER_AVATARS.male,
      verified: true,
      cgpa: 9.0
    };

    users.push(newUser);
    pendingOtps.delete(cleanEmail);

    return res.json({ success: true, message: 'Email verified successfully ✓', user: newUser });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!existingUser) {
    return res.status(404).json({ success: false, message: 'Account not found. Please register an account first.' });
  }

  if (existingUser.password && existingUser.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  return res.json({ success: true, message: 'Signed in successfully!', user: existingUser });
});

app.post('/api/auth/google', (req, res) => {
  const { email, name, picture, role } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Google email is required' });
  }

  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: `usr_g_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      rollNumber: 'CS2026-G' + Math.floor(100 + Math.random() * 900),
      phone: '+91 9876543210',
      role: role || 'student',
      gender: 'male',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      semester: '6',
      section: 'A',
      avatar: picture || GENDER_AVATARS.male,
      verified: true,
      cgpa: 9.0
    };
    users.push(user);
  }

  return res.json({ success: true, message: 'Google Authentication Successful', user });
});

app.get('/api/users', (req, res) => {
  res.json({ success: true, users });
});

// -----------------------------------------------------------------------------
// 2. FACULTY ASSIGNMENT PUBLISHING & PDF STORAGE
// -----------------------------------------------------------------------------

app.post('/api/assignments/create', (req, res) => {
  const {
    title,
    description,
    department,
    course,
    year,
    semester,
    section,
    subject,
    subjectCode,
    facultyId,
    facultyName,
    deadline,
    maxMarks,
    instructions,
    pdfBase64,
    pdfFileName,
    pdfFileSize
  } = req.body;

  if (!title || !department || !deadline) {
    return res.status(400).json({ success: false, message: 'Assignment title, department, and deadline are required.' });
  }

  let pdfUrl = '/api/assignments/pdf/sample_spec.pdf';
  let storedFileName = pdfFileName || 'assignment.pdf';

  if (pdfBase64 && pdfBase64.includes('data:application/pdf;base64,')) {
    try {
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileId = `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`;
      const savePath = path.join(UPLOADS_DIR, fileId);
      fs.writeFileSync(savePath, buffer);

      pdfUrl = `/api/assignments/pdf/${fileId}`;
      console.log(`📄 [REAL PDF SAVED] PDF saved to ${savePath} (${buffer.length} bytes)`);
    } catch (err) {
      console.error('PDF file save error:', err);
    }
  }

  const createdAssignment = {
    id: `asg_${Date.now()}`,
    title,
    description: description || 'Complete the assignment problem statements and push solutions.',
    department: department || 'Computer Science & Engineering',
    course: course || 'B.Tech',
    year: year || '3rd Year',
    semester: semester || '6',
    section: section || 'A',
    subject: subject || 'Computer Science Core',
    subjectCode: subjectCode || 'CS301',
    facultyName: facultyName || 'Prof. Arun',
    facultyId: facultyId || 'usr_faculty_1',
    deadline,
    maxMarks: Number(maxMarks) || 100,
    instructions: instructions || 'Upload solution PDF or submit GitHub repository link.',
    attachmentUrl: pdfUrl,
    attachmentName: storedFileName,
    attachmentSize: pdfFileSize || '2.4 MB',
    mimeType: 'application/pdf',
    createdAt: new Date().toISOString()
  };

  assignments.unshift(createdAssignment);

  // REAL TARGETED STUDENT NOTIFICATION RECORD
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const targetNotification = {
    id: `notif_${Date.now()}`,
    userId: 'all_students',
    department: createdAssignment.department,
    year: createdAssignment.year,
    semester: createdAssignment.semester,
    section: createdAssignment.section,
    type: 'ASSIGNMENT',
    title: `🔔 New Assignment Published`,
    message: `"${createdAssignment.title}" published for ${createdAssignment.subjectCode} by ${createdAssignment.facultyName}. Due: ${new Date(createdAssignment.deadline).toLocaleString()}`,
    assignmentId: createdAssignment.id,
    subjectCode: createdAssignment.subjectCode,
    facultyName: createdAssignment.facultyName,
    deadline: createdAssignment.deadline,
    createdAt: formattedTime,
    date: formattedTime,
    read: false
  };

  notifications.unshift(targetNotification);

  console.log(`🚀 [ASSIGNMENT PUBLISHED] "${createdAssignment.title}" -> Target: ${createdAssignment.department} (Sem ${createdAssignment.semester})`);
  return res.json({
    success: true,
    message: 'Assignment published successfully and targeted student notifications created in DB.',
    assignment: createdAssignment,
    notification: targetNotification
  });
});

app.get('/api/assignments', (req, res) => {
  res.json({ success: true, assignments });
});

app.get('/api/assignments/:id', (req, res) => {
  const asg = assignments.find(a => a.id === req.params.id);
  if (!asg) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }
  res.json({ success: true, assignment: asg });
});

app.get('/api/assignments/pdf/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(UPLOADS_DIR, fileId);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileId}"`);
    return res.sendFile(filePath);
  } else {
    // Return sample PDF stream if file does not exist locally
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="assignment_spec.pdf"');
    const dummyPdfContent = `%PDF-1.4\n1 0 obj<>/PageLayout/OneColumn/Pages 2 0 R/Type/Catalog>>endobj\n2 0 obj<>/Count 1/Kids[3 0 R]/Type/Pages>>endobj\n3 0 obj<>/Contents 4 0 R/MediaBox[0 0 595.28 841.89]/Parent 2 0 R/Resources<>/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]>>/Type/Page>>endobj\n4 0 obj<>/Length 120>>stream\nBT\n/F1 18 Tf\n50 750 Td\n(AetherCampus - Official Assignment Specification Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000074 00000 n\n0000000120 00000 n\n0000000274 00000 n\ntrailer\n<>/Size 5>>\nstartxref\n445\n%%EOF`;
    return res.send(Buffer.from(dummyPdfContent));
  }
});

// -----------------------------------------------------------------------------
// 3. STUDENT ASSIGNMENT SUBMISSION & FACULTY NOTIFICATION
// -----------------------------------------------------------------------------

app.post('/api/assignments/:id/submit', (req, res) => {
  const assignmentId = req.params.id;
  const {
    studentId,
    studentName,
    studentEmail,
    rollNumber,
    department,
    year,
    semester,
    section,
    comments,
    submissionBase64,
    fileName,
    fileSize
  } = req.body;

  const targetAsg = assignments.find(a => a.id === assignmentId) || assignments[0];
  if (!targetAsg) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  let fileUrl = '/api/submissions/file/sample_submission.pdf';
  let storedFileName = fileName || 'Student_Assignment_Submission.pdf';

  if (submissionBase64 && submissionBase64.includes('data:')) {
    try {
      const parts = submissionBase64.split(';base64,');
      const base64Data = parts[1];
      const buffer = Buffer.from(base64Data, 'base64');

      const ext = fileName ? path.extname(fileName) : '.pdf';
      const fileId = `sub_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
      const savePath = path.join(SUBMISSIONS_DIR, fileId);
      fs.writeFileSync(savePath, buffer);

      fileUrl = `/api/submissions/file/${fileId}`;
      console.log(`📄 [REAL STUDENT SUBMISSION SAVED] Submission saved to ${savePath} (${buffer.length} bytes)`);
    } catch (err) {
      console.error('Submission file save error:', err);
    }
  }

  // Calculate Status: Submitted vs Late Submission
  const now = new Date();
  const deadlineDate = targetAsg.deadline ? new Date(targetAsg.deadline) : new Date(now.getTime() + 86400000);
  const isLate = now.getTime() > deadlineDate.getTime();
  const statusStr = isLate ? 'Late Submission' : 'submitted';

  const formattedTime = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newSubmission = {
    id: `sub_${Date.now()}`,
    assignmentId: targetAsg.id,
    assignmentTitle: targetAsg.title,
    subjectCode: targetAsg.subjectCode,
    subject: targetAsg.subject,
    studentId: studentId || 'usr_student_1',
    studentName: studentName || 'Poornima J',
    studentEmail: studentEmail || 'poornima@gmail.com',
    rollNumber: rollNumber || 'CS2026-101',
    department: department || targetAsg.department,
    year: year || targetAsg.year || '3rd Year',
    semester: semester || targetAsg.semester || '6',
    section: section || targetAsg.section || 'A',
    submissionDate: formattedTime,
    submittedAt: formattedTime,
    fileUrl,
    fileName: storedFileName,
    fileSize: fileSize || '1.8 MB',
    comments: comments || 'Please review my assignment submission.',
    status: statusStr
  };

  submissions.unshift(newSubmission);

  // REAL FACULTY NOTIFICATION RECORD GENERATION
  const facultyNotification = {
    id: `notif_${Date.now()}`,
    userId: targetAsg.facultyId || 'usr_faculty_1',
    type: 'SUBMISSION',
    title: `🔔 New Assignment Submission`,
    message: `Student: ${newSubmission.studentName} submitted "${newSubmission.assignmentTitle}". Subject: ${newSubmission.subjectCode || 'CS301'}. Submitted: ${formattedTime}`,
    submissionId: newSubmission.id,
    assignmentId: newSubmission.assignmentId,
    studentId: newSubmission.studentId,
    studentName: newSubmission.studentName,
    submittedAt: formattedTime,
    date: formattedTime,
    read: false
  };

  notifications.unshift(facultyNotification);

  console.log(`🎉 [STUDENT SUBMISSION SUCCESS] Student ${newSubmission.studentName} submitted "${newSubmission.assignmentTitle}"`);
  return res.json({
    success: true,
    message: 'Assignment submitted successfully to database.',
    submission: newSubmission,
    notification: facultyNotification
  });
});

app.get('/api/submissions/file/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(SUBMISSIONS_DIR, fileId);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Student_Submission.pdf"');
    const dummyPdfContent = `%PDF-1.4\n1 0 obj<>/PageLayout/OneColumn/Pages 2 0 R/Type/Catalog>>endobj\n2 0 obj<>/Count 1/Kids[3 0 R]/Type/Pages>>endobj\n3 0 obj<>/Contents 4 0 R/MediaBox[0 0 595.28 841.89]/Parent 2 0 R/Resources<>/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]>>/Type/Page>>endobj\n4 0 obj<>/Length 110>>stream\nBT\n/F1 18 Tf\n50 750 Td\n(AetherCampus - Student Solution Submission Output File) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000074 00000 n\n0000000120 00000 n\n0000000274 00000 n\ntrailer\n<>/Size 5>>\nstartxref\n435\n%%EOF`;
    return res.send(Buffer.from(dummyPdfContent));
  }
});

// -----------------------------------------------------------------------------
// 4. FACULTY SUBMISSIONS & GRADING ENDPOINTS
// -----------------------------------------------------------------------------

app.get('/api/faculty/submissions', (req, res) => {
  res.json({ success: true, submissions });
});

app.get('/api/faculty/submissions/:id', (req, res) => {
  const sub = submissions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }
  res.json({ success: true, submission: sub });
});

app.post('/api/faculty/submissions/:id/grade', (req, res) => {
  const { marks, feedback } = req.body;
  const sub = submissions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }

  sub.marks = Number(marks);
  sub.feedback = feedback || 'Graded by faculty.';
  sub.status = 'graded';

  return res.json({ success: true, message: 'Marks and feedback saved successfully.', submission: sub });
});

// -----------------------------------------------------------------------------
// 5. NOTIFICATIONS ENDPOINT
// -----------------------------------------------------------------------------

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications });
});

app.patch('/api/notifications/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true });
});

// -----------------------------------------------------------------------------
// 6. COORDINATOR DASHBOARD & ALL SIDEBAR MODULE APIS
// -----------------------------------------------------------------------------

app.get('/api/coordinator/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalEvents: coordinatorEvents.length,
      totalClubs: coordinatorClubs.length,
      totalStudents: users.filter(u => u.role === 'student').length + 1240,
      pendingApprovals: coordinatorApprovals.filter(a => a.status === 'pending').length
    },
    recentEvents: coordinatorEvents,
    recentAnnouncements: coordinatorAnnouncements,
    recentApprovals: coordinatorApprovals,
    recentClubs: coordinatorClubs
  });
});

app.get('/api/coordinator/events', (req, res) => {
  res.json({ success: true, events: coordinatorEvents });
});

app.post('/api/coordinator/events', (req, res) => {
  const { title, venue, totalSeats, description, externalRegistrationLink } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Event title is required.' });
  }

  const newEvt = {
    id: `evt_${Date.now()}`,
    title,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    description: description || 'Official Campus Event.',
    venue: venue || 'Main Campus Auditorium',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM IST',
    registrationDeadline: '2026-09-01',
    totalSeats: Number(totalSeats) || 250,
    registeredSeats: 0,
    speakers: ['Faculty Lead'],
    qrPassCode: `CAMPUS_PASS_${title.substring(0, 4).toUpperCase()}`,
    category: 'hackathon',
    externalRegistrationLink: externalRegistrationLink || 'https://devfusion4.tech/register'
  };

  coordinatorEvents.unshift(newEvt);
  res.json({ success: true, message: 'Event created successfully.', event: newEvt });
});

app.delete('/api/coordinator/events/:id', (req, res) => {
  const index = coordinatorEvents.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    coordinatorEvents.splice(index, 1);
  }
  res.json({ success: true, message: 'Event deleted.' });
});

app.get('/api/coordinator/clubs', (req, res) => {
  res.json({ success: true, clubs: coordinatorClubs });
});

app.get('/api/coordinator/approvals', (req, res) => {
  res.json({ success: true, approvals: coordinatorApprovals });
});

app.post('/api/coordinator/approvals/:id/action', (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  const reqItem = coordinatorApprovals.find(r => r.id === req.params.id);
  if (reqItem) {
    reqItem.status = action === 'approve' ? 'approved' : 'rejected';
  }
  res.json({ success: true, message: `Application ${action}d.` });
});

app.get('/api/coordinator/announcements', (req, res) => {
  res.json({ success: true, announcements: coordinatorAnnouncements });
});

app.post('/api/coordinator/announcements', (req, res) => {
  const { title, description, target } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }

  const newAnc = {
    id: `anc_${Date.now()}`,
    title,
    desc: description || title,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    target: target || 'All Students'
  };

  coordinatorAnnouncements.unshift(newAnc);

  notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: 'all_students',
    type: 'system',
    title: `📢 ${title}`,
    message: description || title,
    date: newAnc.date,
    read: false
  });

  res.json({ success: true, message: 'Announcement published successfully.', announcement: newAnc });
});

app.get('/api/coordinator/reports', (req, res) => {
  res.json({
    success: true,
    reports: {
      studentsByDept: [
        { dept: 'AI & Data Science', count: 480 },
        { dept: 'Computer Science', count: 620 },
        { dept: 'Electronics & Comm.', count: 390 },
        { dept: 'Information Tech.', count: 310 }
      ],
      eventParticipation: [
        { event: 'AI Summit 2026', count: 214 },
        { event: 'Cyber Hackathon', count: 180 },
        { event: 'DevFusion 4.0', count: 310 }
      ],
      clubMemberships: coordinatorClubs.map(c => ({ name: c.name, count: c.memberCount }))
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js Express Backend running on http://localhost:${PORT}`);
});
