import { Router, Request, Response } from 'express';
import { db } from '../db/index.ts';
import * as schema from '../db/schema.ts';
import { eq, desc, and, or, sql } from 'drizzle-orm';

export const portalRouter = Router();

// ----------------------------------------------------
// AUTH CONTEXT HELPER & SECURITY GUARDS
// ----------------------------------------------------

export interface AuthContext {
  role: 'student' | 'counsellor' | 'admin';
  email: string;
  name: string;
  uid: string;
  studentId?: number;
  counsellorId?: number;
}

export function getAuthContext(req: Request): AuthContext {
  const role = (req.headers['x-auth-role'] || req.headers['x-admin-role'] || 'student') as 'student' | 'counsellor' | 'admin';
  const email = (req.headers['x-auth-email'] || req.headers['x-admin-email'] || '') as string;
  const name = (req.headers['x-auth-name'] || req.headers['x-admin-name'] || 'User') as string;
  const uid = (req.headers['x-auth-uid'] || req.headers['x-admin-uid'] || '') as string;
  
  const rawStudentId = req.headers['x-student-id'];
  const studentId = rawStudentId ? Number(rawStudentId) : undefined;

  const rawCounsellorId = req.headers['x-counsellor-id'];
  const counsellorId = rawCounsellorId ? Number(rawCounsellorId) : undefined;

  return { role, email, name, uid, studentId, counsellorId };
}

// ----------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS (/api/auth)
// ----------------------------------------------------

// POST /api/auth/login
portalRouter.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password, demoLogin, role: reqRole, userId } = req.body;

    // Fast 1-click Demo Login support
    if (demoLogin) {
      let matchedUser: any = null;
      if (userId) {
        const found = await db.select().from(schema.users).where(eq(schema.users.id, Number(userId))).limit(1);
        if (found.length) matchedUser = found[0];
      } else if (email) {
        const found = await db.select().from(schema.users).where(eq(schema.users.email, email.trim().toLowerCase())).limit(1);
        if (found.length) matchedUser = found[0];
      } else if (reqRole) {
        const found = await db.select().from(schema.users).where(eq(schema.users.role, reqRole)).limit(1);
        if (found.length) matchedUser = found[0];
      }

      if (!matchedUser) {
        return res.status(404).json({ error: 'Demo account not found' });
      }

      // Fetch linked student or counsellor details
      let studentDetails: any = null;
      if (matchedUser.studentId) {
        const s = await db.select().from(schema.students).where(eq(schema.students.id, matchedUser.studentId)).limit(1);
        if (s.length) studentDetails = s[0];
      }

      let counsellorDetails: any = null;
      if (matchedUser.counsellorId) {
        const c = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, matchedUser.counsellorId)).limit(1);
        if (c.length) counsellorDetails = c[0];
      }

      const redirectTo = matchedUser.role === 'admin' 
        ? '/admin' 
        : matchedUser.role === 'counsellor' 
          ? '/counsellor' 
          : '/student-portal';

      return res.json({
        success: true,
        user: {
          id: matchedUser.id,
          uid: matchedUser.uid,
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
          avatar: matchedUser.avatar,
          phone: matchedUser.phone,
          studentId: matchedUser.studentId,
          counsellorId: matchedUser.counsellorId,
        },
        studentDetails,
        counsellorDetails,
        redirectTo,
      });
    }

    // Standard email/password authentication
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const userFound = await db.select().from(schema.users).where(eq(schema.users.email, cleanEmail)).limit(1);

    if (userFound.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userFound[0];

    // Password validation (sample default is password123)
    if (user.password && user.password !== password && password !== 'password123') {
      return res.status(401).json({ error: 'Invalid credentials. Use password123 or select a demo profile.' });
    }

    // Fetch linked records
    let studentDetails: any = null;
    if (user.studentId) {
      const s = await db.select().from(schema.students).where(eq(schema.students.id, user.studentId)).limit(1);
      if (s.length) studentDetails = s[0];
    }

    let counsellorDetails: any = null;
    if (user.counsellorId) {
      const c = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, user.counsellorId)).limit(1);
      if (c.length) counsellorDetails = c[0];
    }

    const redirectTo = user.role === 'admin' 
      ? '/admin' 
      : user.role === 'counsellor' 
        ? '/counsellor' 
        : '/student-portal';

    res.json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studentId: user.studentId,
        counsellorId: user.counsellorId,
      },
      studentDetails,
      counsellorDetails,
      redirectTo,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// GET /api/auth/demo-accounts
portalRouter.get('/api/auth/demo-accounts', async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(schema.users);
    const allStudents = await db.select().from(schema.students);
    const allCounsellors = await db.select().from(schema.counsellors);

    const students = allUsers.filter(u => u.role === 'student').map(u => {
      const stu = allStudents.find(s => s.id === u.studentId);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: 'student',
        studentId: u.studentId,
        counsellorId: u.counsellorId,
        avatar: u.avatar,
        subtitle: stu ? `${stu.studentRef} • ${stu.targetDegree} (${stu.preferredDestinations?.[0] || 'UK'})` : 'Student',
      };
    });

    const counsellors = allUsers.filter(u => u.role === 'counsellor').map(u => {
      const c = allCounsellors.find(co => co.id === u.counsellorId);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: 'counsellor',
        counsellorId: u.counsellorId,
        avatar: u.avatar,
        subtitle: c ? c.role : 'Education Counsellor',
      };
    });

    const admins = allUsers.filter(u => u.role === 'admin').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: 'admin',
      avatar: u.avatar,
      subtitle: 'Executive Leadership / Admin Desk',
    }));

    res.json({ students, counsellors, admins });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load demo accounts' });
  }
});

// GET /api/auth/me
portalRouter.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    if (!auth.email && !auth.uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let userQuery = db.select().from(schema.users);
    let userFound = auth.email 
      ? await userQuery.where(eq(schema.users.email, auth.email)).limit(1)
      : await userQuery.where(eq(schema.users.uid, auth.uid)).limit(1);

    if (userFound.length === 0) {
      return res.status(404).json({ error: 'User session not found' });
    }

    const user = userFound[0];
    let studentDetails: any = null;
    if (user.studentId) {
      const s = await db.select().from(schema.students).where(eq(schema.students.id, user.studentId)).limit(1);
      if (s.length) studentDetails = s[0];
    }

    let counsellorDetails: any = null;
    if (user.counsellorId) {
      const c = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, user.counsellorId)).limit(1);
      if (c.length) counsellorDetails = c[0];
    }

    res.json({
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studentId: user.studentId,
        counsellorId: user.counsellorId,
      },
      studentDetails,
      counsellorDetails,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch current user profile' });
  }
});

// ----------------------------------------------------
// 2. DOCUMENT SECURITY & PROTECTED DOWNLOAD
// ----------------------------------------------------

portalRouter.get('/api/documents/:id/download', async (req: Request, res: Response) => {
  try {
    const docId = Number(req.params.id);
    const auth = getAuthContext(req);

    const docFound = await db.select().from(schema.documents).where(eq(schema.documents.id, docId)).limit(1);
    if (docFound.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = docFound[0];

    // Access Check:
    // 1. Student can ONLY download their own documents
    if (auth.role === 'student' && auth.studentId !== doc.studentId) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to view this document.' });
    }

    // 2. Counsellor can ONLY download documents for their assigned students
    if (auth.role === 'counsellor') {
      const student = await db.select().from(schema.students).where(eq(schema.students.id, doc.studentId)).limit(1);
      if (student.length === 0 || student[0].assignedCounsellorId !== auth.counsellorId) {
        return res.status(403).json({ error: 'Access denied: Student is not assigned to your counselling desk.' });
      }
    }

    // Serve protected file
    const fileName = doc.fileName || `${doc.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;

    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const matches = doc.fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        return res.send(buffer);
      }
    }

    // If fileUrl is an external link or placeholder
    res.json({
      success: true,
      title: doc.title,
      category: doc.category,
      status: doc.status,
      fileUrl: doc.fileUrl,
      fileName,
      mimeType: doc.mimeType || 'application/pdf',
      verificationNotes: doc.verificationNotes,
      verifiedBy: doc.verifiedBy,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Secure document retrieval failed: ' + err.message });
  }
});

// ----------------------------------------------------
// 3. STUDENT PORTAL ENDPOINTS (/api/student)
// ----------------------------------------------------

// Timeline stage generator helper
function generateTimeline(student: any, apps: any[]) {
  const primaryApp = apps[0] || null;

  const hasProfile = Boolean(student.fullName && student.email && student.qualification);
  const hasDocuments = Boolean(student.documentsCount && student.documentsCount > 0);
  const hasApplication = Boolean(primaryApp);
  const hasOffer = Boolean(primaryApp && (primaryApp.offerStatus?.toLowerCase().includes('offer') || primaryApp.status?.toLowerCase().includes('offer')));
  const hasDeposit = Boolean(primaryApp && (primaryApp.depositStatus === 'Paid' || primaryApp.depositStatus === 'Confirmed'));
  const hasCas = Boolean(primaryApp && (primaryApp.casStatus === 'Issued' || primaryApp.status === 'CAS Issued'));
  const hasVisa = Boolean(primaryApp && primaryApp.visaStatus && primaryApp.visaStatus !== 'Not Started');
  const hasDecision = Boolean(primaryApp && (primaryApp.visaStatus?.includes('Approved') || primaryApp.visaStatus?.includes('Granted')));
  const hasPreDeparture = Boolean(primaryApp && primaryApp.visaStatus?.includes('Approved') && primaryApp.status === 'Enrolled');

  return [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Academic background, degree target, and contact details verified.',
      status: hasProfile ? 'completed' : 'current',
      updatedAt: student.updatedAt || student.createdAt,
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Passport, marksheets, certificates, and English language test uploads.',
      status: hasDocuments ? 'completed' : hasProfile ? 'current' : 'upcoming',
      updatedAt: student.updatedAt,
    },
    {
      id: 'application',
      title: 'Application',
      description: primaryApp ? `Application submitted to ${primaryApp.universityName}` : 'Shortlisting and submission to accredited university partners.',
      status: hasApplication ? 'completed' : hasDocuments ? 'current' : 'upcoming',
      updatedAt: primaryApp?.createdAt,
    },
    {
      id: 'offer',
      title: 'Offer',
      description: primaryApp?.offerStatus ? `${primaryApp.offerStatus} issued by admissions.` : 'Admissions board assessment & offer issuance.',
      status: hasOffer ? 'completed' : hasApplication ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
    {
      id: 'deposit',
      title: 'Deposit',
      description: primaryApp?.depositAmount ? `Tuition deposit of ${primaryApp.depositAmount} (${primaryApp.depositStatus || 'Pending'}).` : 'Tuition advance deposit required for university CAS/I-20 clearance.',
      status: hasDeposit ? 'completed' : hasOffer ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
    {
      id: 'cas_enrollment',
      title: 'CAS/Enrollment',
      description: primaryApp?.casReference ? `CAS Reference: ${primaryApp.casReference}` : 'Pre-CAS compliance interview & electronic sponsorship reference generation.',
      status: hasCas ? 'completed' : hasDeposit ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
    {
      id: 'visa',
      title: 'Visa',
      description: primaryApp?.visaStatus ? `Status: ${primaryApp.visaStatus}` : 'Financial solvency audit, TB screening, and VFS biometrics filing.',
      status: hasVisa ? 'completed' : hasCas ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
    {
      id: 'decision',
      title: 'Decision',
      description: hasDecision ? 'Visa sticker issued and passport stamped successfully!' : 'Embassy immigration decision & vignette verification.',
      status: hasDecision ? 'completed' : hasVisa ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
    {
      id: 'pre_departure',
      title: 'Pre-Departure',
      description: 'Flight booking, student accommodation, forex card, and airport welcome guidance.',
      status: hasPreDeparture ? 'completed' : hasDecision ? 'current' : 'upcoming',
      updatedAt: primaryApp?.updatedAt,
    },
  ];
}

// GET /api/student/dashboard
portalRouter.get('/api/student/dashboard', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    if (auth.role !== 'student' && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied to student portal' });
    }

    const studentId = auth.studentId || 1; // Default to first student if admin inspecting
    const studentQuery = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);

    if (studentQuery.length === 0) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    const student = studentQuery[0];

    // Assigned counsellor details
    let counsellor: any = null;
    if (student.assignedCounsellorId) {
      const c = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, student.assignedCounsellorId)).limit(1);
      if (c.length) counsellor = c[0];
    }

    // Applications
    const applications = await db.select().from(schema.applications).where(eq(schema.applications.studentId, studentId)).orderBy(desc(schema.applications.id));

    // Documents
    const documents = await db.select().from(schema.documents).where(eq(schema.documents.studentId, studentId)).orderBy(desc(schema.documents.uploadedAt));

    // Appointments
    const appointments = await db.select().from(schema.appointments).where(eq(schema.appointments.studentId, studentId)).orderBy(desc(schema.appointments.id));

    // Notifications
    const notifications = await db.select().from(schema.notifications)
      .where(and(eq(schema.notifications.studentId, studentId), eq(schema.notifications.recipientRole, 'student')))
      .orderBy(desc(schema.notifications.createdAt));

    // Timeline calculation
    const timeline = generateTimeline(
      { ...student, documentsCount: documents.length },
      applications
    );

    // Pending documents checklist
    const requiredCategories = [
      'Passport',
      'Certificate',
      'Transcript',
      'English Test',
      'CV',
      'SOP',
      'Financial Documents',
    ];

    const uploadedCategories = new Set(documents.map(d => d.category));
    const pendingCategories = requiredCategories.filter(cat => !uploadedCategories.has(cat));

    res.json({
      student,
      counsellor,
      applications,
      documents,
      appointments,
      notifications,
      unreadNotificationsCount: notifications.filter(n => !n.read).length,
      timeline,
      pendingCategories,
      recentUpdates: [
        ...applications.map(a => ({ type: 'application', title: `${a.universityName} application status: ${a.status}`, date: a.updatedAt })),
        ...documents.map(d => ({ type: 'document', title: `Document "${d.title}" is ${d.status}`, date: d.updatedAt })),
        ...appointments.map(apt => ({ type: 'appointment', title: `Consultation on ${apt.preferredDate} is ${apt.status}`, date: apt.createdAt })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    });
  } catch (err: any) {
    console.error('Student dashboard error:', err);
    res.status(500).json({ error: 'Failed to load student dashboard: ' + err.message });
  }
});

// GET /api/student/profile
portalRouter.get('/api/student/profile', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const student = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (!student.length) return res.status(404).json({ error: 'Student not found' });

    let counsellor: any = null;
    if (student[0].assignedCounsellorId) {
      const c = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, student[0].assignedCounsellorId)).limit(1);
      if (c.length) counsellor = c[0];
    }

    res.json({ student: student[0], counsellor });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});

// PUT /api/student/profile
portalRouter.put('/api/student/profile', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    // Student can ONLY edit permitted fields:
    // Name, Phone, Email, Address, Academic information, English test, Preferred destination, Preferred program, Budget
    // Sensitive fields (status, studentRef, assignedCounsellorId, archived) are strictly filtered out!
    const permittedFields: any = {};
    const allowedKeys = [
      'fullName',
      'phone',
      'email',
      'address',
      'qualification',
      'cgpa',
      'passingYear',
      'studyGap',
      'englishTest',
      'englishScore',
      'preferredDestinations',
      'targetDegree',
      'budget',
    ];

    for (const key of allowedKeys) {
      if (req.body[key] !== undefined) {
        permittedFields[key] = req.body[key];
      }
    }

    permittedFields.updatedAt = new Date();

    const updated = await db.update(schema.students)
      .set(permittedFields)
      .where(eq(schema.students.id, studentId))
      .returning();

    // Also update users name/phone/email if matching
    if (permittedFields.fullName || permittedFields.phone) {
      await db.update(schema.users)
        .set({
          name: permittedFields.fullName || undefined,
          phone: permittedFields.phone || undefined,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.studentId, studentId));
    }

    res.json({ success: true, student: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update student profile: ' + err.message });
  }
});

// GET /api/student/applications
portalRouter.get('/api/student/applications', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const apps = await db.select().from(schema.applications)
      .where(eq(schema.applications.studentId, studentId))
      .orderBy(desc(schema.applications.id));

    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student applications' });
  }
});

// GET /api/student/documents
portalRouter.get('/api/student/documents', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const docs = await db.select().from(schema.documents)
      .where(eq(schema.documents.studentId, studentId))
      .orderBy(desc(schema.documents.uploadedAt));

    // Exclude heavy fileData in list to keep payload fast
    const sanitized = docs.map(d => ({
      id: d.id,
      studentId: d.studentId,
      applicationId: d.applicationId,
      title: d.title,
      category: d.category,
      fileName: d.fileName,
      fileSize: d.fileSize,
      mimeType: d.mimeType,
      status: d.status,
      verificationNotes: d.verificationNotes,
      verifiedBy: d.verifiedBy,
      uploadedAt: d.uploadedAt,
      updatedAt: d.updatedAt,
      downloadUrl: `/api/documents/${d.id}/download`,
    }));

    res.json(sanitized);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST /api/student/documents (Upload document)
portalRouter.post('/api/student/documents', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const { title, category, fileData, fileName, fileSize, mimeType, applicationId } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Document title and category are required' });
    }

    const newDoc = await db.insert(schema.documents).values({
      studentId,
      applicationId: applicationId ? Number(applicationId) : null,
      title,
      category,
      fileUrl: `/api/documents/protected/${Date.now()}`,
      fileData: fileData || null,
      fileName: fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: fileSize || '1.2 MB',
      mimeType: mimeType || 'application/pdf',
      status: 'Uploaded',
      verificationNotes: 'Uploaded and placed in verification queue.',
      uploadedAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Notify assigned counsellor
    const student = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (student.length && student[0].assignedCounsellorId) {
      await db.insert(schema.notifications).values({
        recipientRole: 'counsellor',
        studentId,
        counsellorId: student[0].assignedCounsellorId,
        title: 'New Document Uploaded',
        message: `${student[0].fullName} uploaded "${title}" (${category}) for verification.`,
        type: 'document',
        link: `/counsellor?tab=documents`,
        read: false,
        createdAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      document: {
        ...newDoc[0],
        downloadUrl: `/api/documents/${newDoc[0].id}/download`,
      },
    });
  } catch (err: any) {
    console.error('Document upload error:', err);
    res.status(500).json({ error: 'Failed to upload document: ' + err.message });
  }
});

// GET /api/student/appointments
portalRouter.get('/api/student/appointments', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const appts = await db.select().from(schema.appointments)
      .where(eq(schema.appointments.studentId, studentId))
      .orderBy(desc(schema.appointments.id));

    res.json(appts);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student appointments' });
  }
});

// POST /api/student/appointments (Book Consultation)
portalRouter.post('/api/student/appointments', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const student = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (!student.length) return res.status(404).json({ error: 'Student not found' });

    const { preferredDate, preferredTime, mode, message, destination, degree } = req.body;

    if (!preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'Date and time are required for booking' });
    }

    const appointmentRef = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = await db.insert(schema.appointments).values({
      appointmentRef,
      studentId,
      studentName: student[0].fullName,
      studentEmail: student[0].email,
      studentPhone: student[0].phone,
      destination: destination || student[0].preferredDestinations?.[0] || 'United Kingdom',
      degree: degree || student[0].targetDegree || 'Master',
      preferredDate,
      preferredTime,
      mode: mode || 'In-person (Sylhet Office)',
      message: message || 'Student requested consultation regarding admissions & visa guidance.',
      assignedCounsellorId: student[0].assignedCounsellorId,
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Create notification for counsellor
    if (student[0].assignedCounsellorId) {
      await db.insert(schema.notifications).values({
        recipientRole: 'counsellor',
        studentId,
        counsellorId: student[0].assignedCounsellorId,
        title: 'New Consultation Requested',
        message: `${student[0].fullName} requested an appointment on ${preferredDate} (${preferredTime}) - ${mode}.`,
        type: 'appointment',
        link: `/counsellor?tab=appointments`,
        read: false,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ success: true, appointment: newAppt[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to request appointment: ' + err.message });
  }
});

// DELETE /api/student/appointments/:id (Cancel permitted appointments)
portalRouter.delete('/api/student/appointments/:id', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;
    const apptId = Number(req.params.id);

    const appt = await db.select().from(schema.appointments)
      .where(and(eq(schema.appointments.id, apptId), eq(schema.appointments.studentId, studentId)))
      .limit(1);

    if (!appt.length) {
      return res.status(404).json({ error: 'Appointment not found or unauthorized' });
    }

    if (appt[0].status === 'Completed') {
      return res.status(400).json({ error: 'Completed appointments cannot be cancelled' });
    }

    const updated = await db.update(schema.appointments)
      .set({ status: 'Cancelled', updatedAt: new Date() })
      .where(eq(schema.appointments.id, apptId))
      .returning();

    res.json({ success: true, appointment: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// GET /api/student/notifications
portalRouter.get('/api/student/notifications', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const notifs = await db.select().from(schema.notifications)
      .where(and(eq(schema.notifications.studentId, studentId), eq(schema.notifications.recipientRole, 'student')))
      .orderBy(desc(schema.notifications.createdAt));

    res.json(notifs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/student/notifications/:id/read
portalRouter.put('/api/student/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const notifId = Number(req.params.id);
    await db.update(schema.notifications).set({ read: true }).where(eq(schema.notifications.id, notifId));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// PUT /api/student/notifications/read-all
portalRouter.put('/api/student/notifications/read-all', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    await db.update(schema.notifications)
      .set({ read: true })
      .where(and(eq(schema.notifications.studentId, studentId), eq(schema.notifications.recipientRole, 'student')));

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// GET /api/student/messages
portalRouter.get('/api/student/messages', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;

    const msgs = await db.select().from(schema.messages)
      .where(eq(schema.messages.studentId, studentId))
      .orderBy(schema.messages.createdAt);

    // Mark counsellor messages as read by student
    await db.update(schema.messages)
      .set({ read: true })
      .where(and(eq(schema.messages.studentId, studentId), eq(schema.messages.senderRole, 'counsellor')));

    res.json(msgs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/student/messages
portalRouter.post('/api/student/messages', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const studentId = auth.studentId || 1;
    const { content, attachments } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const student = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (!student.length) return res.status(404).json({ error: 'Student not found' });

    const counsellorId = student[0].assignedCounsellorId || 1;

    const newMsg = await db.insert(schema.messages).values({
      studentId,
      counsellorId,
      senderRole: 'student',
      senderName: student[0].fullName,
      senderAvatar: (student[0] as any).photo || null,
      content: content.trim(),
      attachments: attachments || [],
      read: false,
      createdAt: new Date(),
    }).returning();

    // Create notification for counsellor
    await db.insert(schema.notifications).values({
      recipientRole: 'counsellor',
      studentId,
      counsellorId,
      title: `Message from ${student[0].fullName}`,
      message: content.length > 80 ? content.slice(0, 80) + '...' : content,
      type: 'general',
      link: `/counsellor?tab=students&studentId=${studentId}`,
      read: false,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: newMsg[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message: ' + err.message });
  }
});

// ----------------------------------------------------
// 4. COUNSELLOR PORTAL ENDPOINTS (/api/counsellor)
// ----------------------------------------------------

// GET /api/counsellor/dashboard
portalRouter.get('/api/counsellor/dashboard', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const counsellorId = auth.counsellorId || 1;
    const isAdmin = auth.role === 'admin';

    // 1. Counsellor details
    const counsellorRecord = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, counsellorId)).limit(1);
    const counsellor = counsellorRecord[0] || null;

    // 2. Assigned Leads
    const allLeads = await db.select().from(schema.leads).orderBy(desc(schema.leads.id));
    const assignedLeads = isAdmin ? allLeads : allLeads.filter(l => l.assignedCounsellorId === counsellorId);

    // 3. Assigned Students
    const allStudents = await db.select().from(schema.students).orderBy(desc(schema.students.id));
    const assignedStudents = isAdmin ? allStudents : allStudents.filter(s => s.assignedCounsellorId === counsellorId);

    const studentIds = new Set(assignedStudents.map(s => s.id));

    // 4. Pending Documents awaiting review
    const allDocs = await db.select().from(schema.documents).orderBy(desc(schema.documents.uploadedAt));
    const pendingDocuments = allDocs.filter(d => 
      (isAdmin || studentIds.has(d.studentId)) && (d.status === 'Uploaded' || d.status === 'Under Review' || d.status === 'Pending')
    );

    // 5. Active Applications
    const allApps = await db.select().from(schema.applications).orderBy(desc(schema.applications.id));
    const activeApplications = allApps.filter(a => isAdmin || studentIds.has(a.studentId));

    // 6. Follow-ups
    const allFollowups = await db.select().from(schema.followups).orderBy(desc(schema.followups.id));
    const followups = isAdmin ? allFollowups : allFollowups.filter(f => f.counsellorId === counsellorId);

    // 7. Appointments
    const allAppts = await db.select().from(schema.appointments).orderBy(desc(schema.appointments.id));
    const appointments = isAdmin ? allAppts : allAppts.filter(a => a.assignedCounsellorId === counsellorId || (a.studentId && studentIds.has(a.studentId)));

    // 8. Tasks
    const allTasks = await db.select().from(schema.tasks).orderBy(desc(schema.tasks.id));
    const tasks = isAdmin ? allTasks : allTasks.filter(t => t.counsellorId === counsellorId);

    // 9. Unread Notifications
    const notifs = await db.select().from(schema.notifications)
      .where(and(
        isAdmin ? sql`1=1` : eq(schema.notifications.counsellorId, counsellorId),
        eq(schema.notifications.recipientRole, 'counsellor')
      ))
      .orderBy(desc(schema.notifications.createdAt));

    res.json({
      counsellor,
      stats: {
        totalLeads: assignedLeads.length,
        newLeads: assignedLeads.filter(l => l.status === 'New').length,
        totalStudents: assignedStudents.length,
        activeStudents: assignedStudents.filter(s => s.status === 'Active' || s.status === 'Enrolled').length,
        pendingDocumentsCount: pendingDocuments.length,
        activeApplicationsCount: activeApplications.length,
        pendingTasksCount: tasks.filter(t => t.status !== 'Completed').length,
        scheduledFollowupsCount: followups.filter(f => f.status === 'Scheduled').length,
        upcomingAppointmentsCount: appointments.filter(a => a.status === 'Confirmed' || a.status === 'New').length,
      },
      assignedLeads: assignedLeads.slice(0, 10),
      assignedStudents,
      pendingDocuments: pendingDocuments.slice(0, 10),
      activeApplications: activeApplications.slice(0, 10),
      followups,
      appointments: appointments.slice(0, 10),
      tasks,
      notifications: notifs.slice(0, 10),
    });
  } catch (err: any) {
    console.error('Counsellor dashboard error:', err);
    res.status(500).json({ error: 'Failed to load counsellor dashboard: ' + err.message });
  }
});

// GET /api/counsellor/students
portalRouter.get('/api/counsellor/students', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const counsellorId = auth.counsellorId || 1;
    const isAdmin = auth.role === 'admin';

    const allStudents = await db.select().from(schema.students).orderBy(desc(schema.students.id));
    const list = isAdmin ? allStudents : allStudents.filter(s => s.assignedCounsellorId === counsellorId);

    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch assigned students' });
  }
});

// GET /api/counsellor/students/:id
portalRouter.get('/api/counsellor/students/:id', async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.id);
    const auth = getAuthContext(req);
    const counsellorId = auth.counsellorId || 1;
    const isAdmin = auth.role === 'admin';

    const stu = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (!stu.length) return res.status(404).json({ error: 'Student not found' });

    // Authorization check
    if (!isAdmin && stu[0].assignedCounsellorId !== counsellorId) {
      return res.status(403).json({ error: 'Access denied: Student is not assigned to your desk.' });
    }

    const applications = await db.select().from(schema.applications).where(eq(schema.applications.studentId, studentId)).orderBy(desc(schema.applications.id));
    const documents = await db.select().from(schema.documents).where(eq(schema.documents.studentId, studentId)).orderBy(desc(schema.documents.uploadedAt));
    const appointments = await db.select().from(schema.appointments).where(eq(schema.appointments.studentId, studentId)).orderBy(desc(schema.appointments.id));
    const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.studentId, studentId)).orderBy(desc(schema.tasks.id));
    const followups = await db.select().from(schema.followups).where(eq(schema.followups.studentId, studentId)).orderBy(desc(schema.followups.id));
    const messages = await db.select().from(schema.messages).where(eq(schema.messages.studentId, studentId)).orderBy(schema.messages.createdAt);

    const timeline = generateTimeline({ ...stu[0], documentsCount: documents.length }, applications);

    res.json({
      student: stu[0],
      applications,
      documents,
      appointments,
      tasks,
      followups,
      messages,
      timeline,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student details: ' + err.message });
  }
});

// PUT /api/counsellor/applications/:id/status (Counsellor updates application stage & statuses)
portalRouter.put('/api/counsellor/applications/:id/status', async (req: Request, res: Response) => {
  try {
    const appId = Number(req.params.id);
    const auth = getAuthContext(req);
    const { status, offerStatus, depositStatus, depositAmount, casStatus, casReference, visaStatus, stageNotes } = req.body;

    const existing = await db.select().from(schema.applications).where(eq(schema.applications.id, appId)).limit(1);
    if (!existing.length) return res.status(404).json({ error: 'Application not found' });

    const app = existing[0];

    // Combine notes with deposit and CAS info if present
    let combinedNotes = app.notes || '';
    if (depositAmount) combinedNotes += ` [Deposit Amount: ${depositAmount}]`;
    if (casReference) combinedNotes += ` [CAS Ref: ${casReference}]`;
    if (stageNotes) combinedNotes += ` | ${stageNotes}`;

    const updated = await db.update(schema.applications)
      .set({
        status: status || app.status,
        offerStatus: offerStatus !== undefined ? offerStatus : app.offerStatus,
        depositStatus: depositStatus !== undefined ? depositStatus : app.depositStatus,
        casStatus: casStatus !== undefined ? casStatus : app.casStatus,
        visaStatus: visaStatus !== undefined ? visaStatus : app.visaStatus,
        notes: combinedNotes.trim(),
        updatedAt: new Date(),
      })
      .where(eq(schema.applications.id, appId))
      .returning();

    // Create notification for student
    await db.insert(schema.notifications).values({
      recipientRole: 'student',
      studentId: app.studentId,
      counsellorId: auth.counsellorId || 1,
      title: `Application Update: ${app.universityName}`,
      message: `Status updated to: ${status || app.status}${offerStatus ? ` (${offerStatus})` : ''}. Check your timeline for next steps.`,
      type: 'application',
      link: '/student-portal?tab=applications',
      read: false,
      createdAt: new Date(),
    });

    res.json({ success: true, application: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update application: ' + err.message });
  }
});

// PUT /api/counsellor/documents/:id/verify (Verify or Reject document)
portalRouter.put('/api/counsellor/documents/:id/verify', async (req: Request, res: Response) => {
  try {
    const docId = Number(req.params.id);
    const auth = getAuthContext(req);
    const { status, verificationNotes } = req.body;

    if (!['Verified', 'Rejected', 'Under Review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const docFound = await db.select().from(schema.documents).where(eq(schema.documents.id, docId)).limit(1);
    if (!docFound.length) return res.status(404).json({ error: 'Document not found' });

    const doc = docFound[0];

    const updated = await db.update(schema.documents)
      .set({
        status,
        verificationNotes: verificationNotes || (status === 'Verified' ? 'Verified and approved for university submission.' : 'Requires correction.'),
        verifiedBy: auth.name || 'Counsellor',
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, docId))
      .returning();

    // Notify student
    await db.insert(schema.notifications).values({
      recipientRole: 'student',
      studentId: doc.studentId,
      counsellorId: auth.counsellorId || 1,
      title: `Document ${status}: ${doc.title}`,
      message: status === 'Verified' 
        ? `Your document "${doc.title}" has been verified.` 
        : `Your document "${doc.title}" requires attention: ${verificationNotes || 'Please review.'}`,
      type: 'document',
      link: '/student-portal?tab=documents',
      read: false,
      createdAt: new Date(),
    });

    res.json({ success: true, document: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify document: ' + err.message });
  }
});

// ----------------------------------------------------
// 5. TASK MANAGEMENT (/api/counsellor/tasks)
// ----------------------------------------------------

// GET /api/counsellor/tasks
portalRouter.get('/api/counsellor/tasks', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const counsellorId = auth.counsellorId || 1;
    const isAdmin = auth.role === 'admin';

    const allTasks = await db.select().from(schema.tasks).orderBy(desc(schema.tasks.id));
    const tasks = isAdmin ? allTasks : allTasks.filter(t => t.counsellorId === counsellorId);

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/counsellor/tasks
portalRouter.post('/api/counsellor/tasks', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const { title, description, studentId, dueDate, priority, status } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Task title and due date are required' });
    }

    let studentName = null;
    if (studentId) {
      const s = await db.select().from(schema.students).where(eq(schema.students.id, Number(studentId))).limit(1);
      if (s.length) studentName = s[0].fullName;
    }

    const counsellorId = auth.counsellorId || 1;
    const counsellorName = auth.name || 'Counsellor';

    const created = await db.insert(schema.tasks).values({
      title,
      description: description || null,
      studentId: studentId ? Number(studentId) : null,
      studentName,
      counsellorId,
      counsellorName,
      dueDate,
      priority: priority || 'Medium',
      status: status || 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json({ success: true, task: created[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create task: ' + err.message });
  }
});

// PUT /api/counsellor/tasks/:id
portalRouter.put('/api/counsellor/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    const updated = await db.update(schema.tasks)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.tasks.id, taskId))
      .returning();

    res.json({ success: true, task: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/counsellor/tasks/:id
portalRouter.delete('/api/counsellor/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    await db.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ----------------------------------------------------
// 6. FOLLOW-UP SYSTEM (/api/counsellor/followups)
// ----------------------------------------------------

// GET /api/counsellor/followups
portalRouter.get('/api/counsellor/followups', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const counsellorId = auth.counsellorId || 1;
    const isAdmin = auth.role === 'admin';

    const allFollowups = await db.select().from(schema.followups).orderBy(desc(schema.followups.id));
    const followups = isAdmin ? allFollowups : allFollowups.filter(f => f.counsellorId === counsellorId);

    res.json(followups);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch follow-ups' });
  }
});

// POST /api/counsellor/followups
portalRouter.post('/api/counsellor/followups', async (req: Request, res: Response) => {
  try {
    const auth = getAuthContext(req);
    const { studentId, leadId, studentName, type, scheduledDate, scheduledTime, notes, status } = req.body;

    if (!type || !scheduledDate) {
      return res.status(400).json({ error: 'Follow-up type and scheduled date are required' });
    }

    let finalStudentName = studentName;
    if (!finalStudentName && studentId) {
      const s = await db.select().from(schema.students).where(eq(schema.students.id, Number(studentId))).limit(1);
      if (s.length) finalStudentName = s[0].fullName;
    }
    if (!finalStudentName && leadId) {
      const l = await db.select().from(schema.leads).where(eq(schema.leads.id, Number(leadId))).limit(1);
      if (l.length) finalStudentName = l[0].name;
    }

    const created = await db.insert(schema.followups).values({
      studentId: studentId ? Number(studentId) : null,
      leadId: leadId ? Number(leadId) : null,
      studentName: finalStudentName || 'Student',
      counsellorId: auth.counsellorId || 1,
      counsellorName: auth.name || 'Counsellor',
      type,
      scheduledDate,
      scheduledTime: scheduledTime || null,
      notes: notes || null,
      status: status || 'Scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json({ success: true, followUp: created[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create follow-up: ' + err.message });
  }
});

// PUT /api/counsellor/followups/:id
portalRouter.put('/api/counsellor/followups/:id', async (req: Request, res: Response) => {
  try {
    const followId = Number(req.params.id);
    const updated = await db.update(schema.followups)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.followups.id, followId))
      .returning();

    res.json({ success: true, followUp: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update follow-up' });
  }
});

// DELETE /api/counsellor/followups/:id
portalRouter.delete('/api/counsellor/followups/:id', async (req: Request, res: Response) => {
  try {
    const followId = Number(req.params.id);
    await db.delete(schema.followups).where(eq(schema.followups.id, followId));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete follow-up' });
  }
});

// ----------------------------------------------------
// 7. COUNSELLOR MESSAGING & APPOINTMENTS
// ----------------------------------------------------

// GET /api/counsellor/messages/:studentId
portalRouter.get('/api/counsellor/messages/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);
    const auth = getAuthContext(req);

    const msgs = await db.select().from(schema.messages)
      .where(eq(schema.messages.studentId, studentId))
      .orderBy(schema.messages.createdAt);

    // Mark student messages as read by counsellor
    await db.update(schema.messages)
      .set({ read: true })
      .where(and(eq(schema.messages.studentId, studentId), eq(schema.messages.senderRole, 'student')));

    res.json(msgs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/counsellor/messages/:studentId
portalRouter.post('/api/counsellor/messages/:studentId', async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.params.studentId);
    const auth = getAuthContext(req);
    const { content, attachments } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    const counsellorId = auth.counsellorId || 1;
    const counsellorName = auth.name || 'Counsellor';

    const newMsg = await db.insert(schema.messages).values({
      studentId,
      counsellorId,
      senderRole: 'counsellor',
      senderName: counsellorName,
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      content: content.trim(),
      attachments: attachments || [],
      read: false,
      createdAt: new Date(),
    }).returning();

    // Create notification for student
    await db.insert(schema.notifications).values({
      recipientRole: 'student',
      studentId,
      counsellorId,
      title: `Message from ${counsellorName}`,
      message: content.length > 80 ? content.slice(0, 80) + '...' : content,
      type: 'general',
      link: '/student-portal?tab=messages',
      read: false,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: newMsg[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message: ' + err.message });
  }
});

// PUT /api/counsellor/appointments/:id/status
portalRouter.put('/api/counsellor/appointments/:id/status', async (req: Request, res: Response) => {
  try {
    const apptId = Number(req.params.id);
    const { status, preferredDate, preferredTime } = req.body;

    const existing = await db.select().from(schema.appointments).where(eq(schema.appointments.id, apptId)).limit(1);
    if (!existing.length) return res.status(404).json({ error: 'Appointment not found' });

    const updated = await db.update(schema.appointments)
      .set({
        status: status || existing[0].status,
        preferredDate: preferredDate || existing[0].preferredDate,
        preferredTime: preferredTime || existing[0].preferredTime,
        updatedAt: new Date(),
      })
      .where(eq(schema.appointments.id, apptId))
      .returning();

    // If appointment has linked student, notify them
    if (existing[0].studentId) {
      await db.insert(schema.notifications).values({
        recipientRole: 'student',
        studentId: existing[0].studentId,
        counsellorId: existing[0].assignedCounsellorId,
        title: `Appointment ${status}: ${existing[0].appointmentRef}`,
        message: `Your consultation scheduled for ${updated[0].preferredDate} (${updated[0].preferredTime}) has been ${status.toLowerCase()}.`,
        type: 'appointment',
        link: '/student-portal?tab=appointments',
        read: false,
        createdAt: new Date(),
      });
    }

    res.json({ success: true, appointment: updated[0] });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update appointment: ' + err.message });
  }
});
