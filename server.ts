import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/db/index.ts';
import * as schema from './src/db/schema.ts';
import { eq, desc, sql, and, like, or } from 'drizzle-orm';
import { seedDatabase } from './src/db/seed.ts';
import { portalRouter } from './src/server/portalRoutes.ts';
import { phase4Router, calculateLeadScore } from './src/server/phase4Routes.ts';
import { communicationsRouter } from './src/server/communicationsRoutes.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount Phase 3, 4 & Communications Endpoints
app.use(portalRouter);
app.use(phase4Router);
app.use(communicationsRouter);

// Helper to log audit actions
async function recordAuditLog(req: express.Request, action: string, entity: string, entityId?: string, details?: any) {
  try {
    const userRole = (req.headers['x-admin-role'] as string) || 'admin';
    const userEmail = (req.headers['x-admin-email'] as string) || 'admin@coseducation.com';
    const userName = (req.headers['x-admin-name'] as string) || 'COS Admin';
    const userId = (req.headers['x-admin-uid'] as string) || 'system-admin';

    await db.insert(schema.auditLogs).values({
      userId,
      userName,
      userEmail,
      action,
      entity,
      entityId: entityId || null,
      details: details || null,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

// ----------------------------------------------------
// PUBLIC API ENDPOINTS (Real Database-Driven)
// ----------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Seed endpoint if needed manually
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings & Config
app.get('/api/settings', async (req, res) => {
  try {
    const allSettings = await db.select().from(schema.settings);
    const mapped: Record<string, any> = {};
    for (const s of allSettings) {
      mapped[s.key] = s.value;
    }
    res.json(mapped);
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const dests = await db.select().from(schema.destinations);
    res.json(dests);
  } catch (err: any) {
    console.error('Error fetching destinations:', err);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

app.get('/api/destinations/:slug', async (req, res) => {
  try {
    const item = await db.select().from(schema.destinations).where(eq(schema.destinations.slug, req.params.slug)).limit(1);
    if (!item.length) return res.status(404).json({ error: 'Destination not found' });
    res.json(item[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// Universities
app.get('/api/universities', async (req, res) => {
  try {
    const { country, featured } = req.query;
    let query = db.select().from(schema.universities);
    const conditions = [];
    if (country && country !== 'all') {
      conditions.push(eq(schema.universities.countrySlug, String(country)));
    }
    if (featured === 'true') {
      conditions.push(eq(schema.universities.featured, true));
    }
    const results = conditions.length > 0 
      ? await query.where(and(...conditions))
      : await query;
    res.json(results);
  } catch (err: any) {
    console.error('Error fetching universities:', err);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

app.get('/api/universities/:slug', async (req, res) => {
  try {
    const uni = await db.select().from(schema.universities).where(eq(schema.universities.slug, req.params.slug)).limit(1);
    if (!uni.length) return res.status(404).json({ error: 'University not found' });
    
    // Also fetch associated programs
    const progList = await db.select().from(schema.programs).where(eq(schema.programs.universityId, uni[0].id));
    res.json({ ...uni[0], programs: progList });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch university' });
  }
});

// Programs
app.get('/api/programs', async (req, res) => {
  try {
    const { country, degree, discipline, search } = req.query;
    const conditions = [];
    if (country && country !== 'all') {
      conditions.push(eq(schema.programs.countrySlug, String(country)));
    }
    if (degree && degree !== 'all') {
      conditions.push(eq(schema.programs.degree, String(degree)));
    }
    if (discipline && discipline !== 'all') {
      conditions.push(eq(schema.programs.discipline, String(discipline)));
    }
    if (search) {
      conditions.push(
        or(
          like(schema.programs.name, `%${search}%`),
          like(schema.programs.universityName, `%${search}%`),
          like(schema.programs.discipline, `%${search}%`)
        )
      );
    }
    const results = conditions.length > 0
      ? await db.select().from(schema.programs).where(and(...conditions))
      : await db.select().from(schema.programs);
    res.json(results);
  } catch (err: any) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// Scholarships
app.get('/api/scholarships', async (req, res) => {
  try {
    const list = await db.select().from(schema.scholarships);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
});

// Success Stories
app.get('/api/success-stories', async (req, res) => {
  try {
    const list = await db.select().from(schema.successStories).orderBy(desc(schema.successStories.id));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch success stories' });
  }
});

// Blog Posts
app.get('/api/blog', async (req, res) => {
  try {
    const list = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.published, true)).orderBy(desc(schema.blogPosts.id));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, req.params.slug)).limit(1);
    if (!post.length) return res.status(404).json({ error: 'Post not found' });
    res.json(post[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const list = await db.select().from(schema.events).orderBy(desc(schema.events.id));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const list = await db.select().from(schema.faqs).orderBy(schema.faqs.order);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch faqs' });
  }
});

// Team / Counsellors
app.get('/api/team', async (req, res) => {
  try {
    const list = await db.select().from(schema.counsellors).where(eq(schema.counsellors.active, true));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Public Lead Capture (from Website Consultation, Eligibility Checker, Contact Forms)
app.post('/api/leads', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      country,
      program,
      academicQualification,
      cgpa,
      ielts,
      budget,
      intake,
      source = 'Website Consultation',
      leadSourceCategory = 'Website',
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      notes,
    } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    // Compute Lead Score & Signals
    const scoreResult = calculateLeadScore({
      country,
      academicQualification,
      cgpa,
      ielts,
      budget,
      status: 'New Lead',
      program,
    });

    // Assign to an available counsellor based on country or round-robin
    const activeCounsellors = await db.select().from(schema.counsellors).where(eq(schema.counsellors.active, true));
    let assigned = activeCounsellors[0] || null;
    if (country && activeCounsellors.length > 0) {
      const matched = activeCounsellors.find((c) => 
        c.specialties?.some((s: string) => s.toLowerCase().includes(String(country).toLowerCase()))
      );
      if (matched) assigned = matched;
    }

    const inserted = await db.insert(schema.leads).values({
      name,
      phone,
      email,
      country: country || null,
      program: program || null,
      academicQualification: academicQualification || null,
      cgpa: cgpa || null,
      ielts: ielts || null,
      budget: budget || null,
      intake: intake || null,
      source,
      leadSourceCategory: leadSourceCategory || 'Website',
      leadScore: scoreResult.score,
      leadScoreSignals: scoreResult.signals,
      utmSource: utmSource || 'website',
      utmMedium: utmMedium || 'direct',
      utmCampaign: utmCampaign || 'organic_portal',
      utmContent: utmContent || null,
      utmTerm: utmTerm || null,
      assignedCounsellorId: assigned?.id || null,
      assignedCounsellorName: assigned?.name || null,
      status: 'New Lead',
      notes: notes || `Registered through ${source}`,
      followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next day follow-up
    }).returning();

    const newLead = inserted[0];

    // Trigger Automation: New Lead -> Notify Counsellor
    if (assigned) {
      try {
        await db.insert(schema.automationLogs).values({
          ruleName: 'New Lead → Notify Assigned Counsellor',
          triggerEvent: 'new_lead',
          targetName: newLead.name,
          targetId: newLead.id,
          actionTaken: `Automated rule triggered: Assigned to ${assigned.name}. Lead Score: ${scoreResult.score} (${scoreResult.tier}).`,
          status: 'Success',
          details: `Source: ${newLead.leadSourceCategory}, UTM: ${newLead.utmCampaign}`,
          createdAt: new Date(),
        });
      } catch (autoErr) {
        console.warn('Automation log insertion error:', autoErr);
      }
    }

    // Record lead history
    await db.insert(schema.leadHistory).values({
      leadId: newLead.id,
      action: 'Lead Created',
      previousStatus: null,
      newStatus: 'New Lead',
      notes: `Inquiry submitted via ${source}.`,
      performedBy: 'Student (Website)',
    });

    await recordAuditLog(req, 'Lead created', 'Lead', String(newLead.id), { name, source, country });

    res.status(201).json({ success: true, lead: newLead });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
  }
});

// Public Appointment Booking (creates both appointment and lead record)
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      studentPhone,
      destination,
      degree,
      preferredDate,
      preferredTime,
      mode = 'In-person (Sylhet Office)',
      message,
    } = req.body;

    if (!studentName || !studentEmail || !studentPhone || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'All required appointment fields must be provided.' });
    }

    const ref = `APT-${Date.now().toString().slice(-6)}`;

    // Find assigned counsellor
    const counsellorsList = await db.select().from(schema.counsellors).where(eq(schema.counsellors.active, true));
    let assigned = counsellorsList[0] || null;
    if (destination) {
      const match = counsellorsList.find((c) =>
        c.specialties?.some((s: string) => s.toLowerCase().includes(String(destination).toLowerCase()))
      );
      if (match) assigned = match;
    }

    const inserted = await db.insert(schema.appointments).values({
      appointmentRef: ref,
      studentName,
      studentEmail,
      studentPhone,
      destination: destination || null,
      degree: degree || null,
      preferredDate,
      preferredTime,
      mode,
      message: message || null,
      assignedCounsellorId: assigned?.id || null,
      status: 'New',
    }).returning();

    // Also auto-create or update lead
    const existingLead = await db.select().from(schema.leads).where(eq(schema.leads.email, studentEmail)).limit(1);
    if (!existingLead.length) {
      const leadResult = await db.insert(schema.leads).values({
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        country: destination || null,
        source: 'Consultation Booking',
        status: 'New Lead',
        assignedCounsellorId: assigned?.id || null,
        assignedCounsellorName: assigned?.name || null,
        notes: `Booked appointment (${ref}) for ${preferredDate} at ${preferredTime} [${mode}]. Notes: ${message || 'None'}`,
        followUpDate: preferredDate,
      }).returning();

      await db.insert(schema.leadHistory).values({
        leadId: leadResult[0].id,
        action: 'Appointment Booked',
        newStatus: 'New Lead',
        notes: `Appointment ref ${ref} booked for ${preferredDate}.`,
        performedBy: 'Student (Website)',
      });
    }

    await recordAuditLog(req, 'Appointment booked', 'Appointment', ref, { studentName, preferredDate, mode });

    res.status(201).json({ success: true, appointment: inserted[0] });
  } catch (err: any) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// ----------------------------------------------------
// ADMIN CRM & CMS ENDPOINTS
// ----------------------------------------------------

// Admin Dashboard Metrics & Charts
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const userRole = (req.headers['x-admin-role'] as string) || 'admin';
    const counsellorIdHeader = req.headers['x-counsellor-id'] ? Number(req.headers['x-counsellor-id']) : null;

    // Counts
    const allLeads = await db.select().from(schema.leads);
    const allStudents = await db.select().from(schema.students);
    const allApplications = await db.select().from(schema.applications);
    const allAppointments = await db.select().from(schema.appointments);
    const allDocuments = await db.select().from(schema.documents);

    // Apply counsellor-scoped filter if role is counsellor
    const filteredLeads = userRole === 'counsellor' && counsellorIdHeader
      ? allLeads.filter((l) => l.assignedCounsellorId === counsellorIdHeader)
      : allLeads;

    const filteredStudents = userRole === 'counsellor' && counsellorIdHeader
      ? allStudents.filter((s) => s.assignedCounsellorId === counsellorIdHeader)
      : allStudents;

    const filteredApps = userRole === 'counsellor' && counsellorIdHeader
      ? allApplications.filter((a) => {
          const matchedStudent = allStudents.find((s) => s.id === a.studentId);
          return matchedStudent?.assignedCounsellorId === counsellorIdHeader;
        })
      : allApplications;

    const totalLeads = filteredLeads.length;
    const newLeads = filteredLeads.filter((l) => l.status === 'New Lead').length;
    const activeStudents = filteredStudents.filter((s) => !s.archived && s.status === 'Active').length;
    const applicationsCount = filteredApps.length;
    const offersCount = filteredApps.filter((a) => a.offerStatus?.includes('Offer') || a.status?.includes('Offer')).length;
    const visaAppsCount = filteredApps.filter((a) => a.visaStatus && a.visaStatus !== 'Not Started' && a.visaStatus !== 'Pending').length;
    const visaDecisionsCount = filteredApps.filter((a) => a.visaStatus?.includes('Approved') || a.status?.includes('Approved')).length;
    const appointmentsCount = allAppointments.filter((a) => a.status === 'New' || a.status === 'Confirmed').length;
    const pendingDocsCount = allDocuments.filter((d) => d.status === 'Pending' || d.status === 'Under Review').length;
    const upcomingIntakesCount = filteredApps.filter((a) => a.intake?.includes('2027') || a.intake?.includes('2026')).length;

    // Country Distribution Chart Data
    const countryMap: Record<string, number> = {};
    for (const lead of filteredLeads) {
      const c = lead.country || 'Other';
      countryMap[c] = (countryMap[c] || 0) + 1;
    }
    const countryChart = Object.keys(countryMap).map((name) => ({ name, count: countryMap[name] }));

    // Lead Pipeline Conversion Funnel
    const pipelineStages = [
      'New Lead', 'Contacted', 'Counselling', 'Documents Pending',
      'Application Started', 'Applied', 'Offer Received', 'Deposit',
      'CAS/Enrollment', 'Visa Applied', 'Visa Decision', 'Enrolled'
    ];
    const conversionChart = pipelineStages.map((stage) => ({
      stage,
      count: filteredLeads.filter((l) => l.status === stage).length,
    }));

    // Lead Growth / Monthly Trends
    const monthlyEnquiries = [
      { month: 'Apr', enquiries: 42, applications: 12, visas: 5 },
      { month: 'May', enquiries: 65, applications: 24, visas: 8 },
      { month: 'Jun', enquiries: 78, applications: 35, visas: 14 },
      { month: 'Jul', enquiries: 95, applications: 48, visas: 19 },
      { month: 'Aug', enquiries: 110, applications: 54, visas: 26 },
      { month: 'Sep', enquiries: 125, applications: 62, visas: 31 },
    ];

    res.json({
      cards: {
        totalLeads,
        newLeads,
        activeStudents,
        applications: applicationsCount,
        offers: offersCount,
        visaApplications: visaAppsCount,
        visaDecisions: visaDecisionsCount,
        appointments: appointmentsCount,
        pendingDocuments: pendingDocsCount,
        upcomingIntakes: upcomingIntakesCount,
      },
      charts: {
        countries: countryChart,
        conversion: conversionChart,
        monthlyEnquiries,
      },
    });
  } catch (err: any) {
    console.error('Error in admin dashboard metrics:', err);
    res.status(500).json({ error: 'Failed to compute dashboard metrics' });
  }
});

// Leads Management CRUD + Kanban + History
app.get('/api/admin/leads', async (req, res) => {
  try {
    const { search, status, country, counsellorId } = req.query;
    let list = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.program && l.program.toLowerCase().includes(q))
      );
    }
    if (status && status !== 'all') {
      list = list.filter((l) => l.status === status);
    }
    if (country && country !== 'all') {
      list = list.filter((l) => l.country === country);
    }
    if (counsellorId && counsellorId !== 'all') {
      list = list.filter((l) => l.assignedCounsellorId === Number(counsellorId));
    }

    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.get('/api/admin/leads/:id/history', async (req, res) => {
  try {
    const history = await db.select().from(schema.leadHistory)
      .where(eq(schema.leadHistory.leadId, Number(req.params.id)))
      .orderBy(desc(schema.leadHistory.createdAt));
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch lead history' });
  }
});

app.post('/api/admin/leads', async (req, res) => {
  try {
    const body = req.body;
    const inserted = await db.insert(schema.leads).values({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    const createdLead = inserted[0];
    await db.insert(schema.leadHistory).values({
      leadId: createdLead.id,
      action: 'Lead Created',
      newStatus: createdLead.status,
      notes: 'Created manually by counselor/admin.',
      performedBy: (req.headers['x-admin-name'] as string) || 'Admin',
    });

    await recordAuditLog(req, 'Lead created', 'Lead', String(createdLead.id), createdLead);

    res.status(201).json(createdLead);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create lead: ' + err.message });
  }
});

app.put('/api/admin/leads/:id', async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    const existing = await db.select().from(schema.leads).where(eq(schema.leads.id, leadId)).limit(1);
    if (!existing.length) return res.status(404).json({ error: 'Lead not found' });

    const oldLead = existing[0];
    const updateData = { ...req.body, updatedAt: new Date() };

    const updated = await db.update(schema.leads)
      .set(updateData)
      .where(eq(schema.leads.id, leadId))
      .returning();

    const newLead = updated[0];

    // If status changed or note added, record history
    if (oldLead.status !== newLead.status || req.body.historyNote) {
      await db.insert(schema.leadHistory).values({
        leadId,
        action: oldLead.status !== newLead.status ? 'Status Changed' : 'Note Added',
        previousStatus: oldLead.status,
        newStatus: newLead.status,
        notes: req.body.historyNote || `Status updated to ${newLead.status}`,
        performedBy: (req.headers['x-admin-name'] as string) || 'Admin',
      });
      await recordAuditLog(req, 'Lead status changed', 'Lead', String(leadId), {
        from: oldLead.status,
        to: newLead.status,
      });
    }

    res.json(newLead);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update lead: ' + err.message });
  }
});

app.delete('/api/admin/leads/:id', async (req, res) => {
  try {
    const leadId = Number(req.params.id);
    await db.delete(schema.leads).where(eq(schema.leads.id, leadId));
    await recordAuditLog(req, 'Lead deleted', 'Lead', String(leadId));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Students CRUD
app.get('/api/admin/students', async (req, res) => {
  try {
    const { search, status, archived } = req.query;
    let query = db.select().from(schema.students);
    let list = await query.orderBy(desc(schema.students.createdAt));

    if (archived === 'true') {
      list = list.filter((s) => s.archived);
    } else {
      list = list.filter((s) => !s.archived);
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter((s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentRef.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }

    if (status && status !== 'all') {
      list = list.filter((s) => s.status === status);
    }

    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/api/admin/students/:id', async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    const stu = await db.select().from(schema.students).where(eq(schema.students.id, studentId)).limit(1);
    if (!stu.length) return res.status(404).json({ error: 'Student not found' });

    const apps = await db.select().from(schema.applications).where(eq(schema.applications.studentId, studentId));
    const docs = await db.select().from(schema.documents).where(eq(schema.documents.studentId, studentId));
    const appts = await db.select().from(schema.appointments).where(eq(schema.appointments.studentId, studentId));

    res.json({
      student: stu[0],
      applications: apps,
      documents: docs,
      appointments: appts,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

app.post('/api/admin/students', async (req, res) => {
  try {
    const studentRef = `COS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const inserted = await db.insert(schema.students).values({
      ...req.body,
      studentRef,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Student created', 'Student', String(inserted[0].id), inserted[0]);
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create student: ' + err.message });
  }
});

app.put('/api/admin/students/:id', async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    const updated = await db.update(schema.students)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.students.id, studentId))
      .returning();

    await recordAuditLog(req, 'Student edited', 'Student', String(studentId), updated[0]);
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update student: ' + err.message });
  }
});

// Applications CRUD + Timeline
app.get('/api/admin/applications', async (req, res) => {
  try {
    const list = await db.select().from(schema.applications).orderBy(desc(schema.applications.id));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.post('/api/admin/applications', async (req, res) => {
  try {
    const inserted = await db.insert(schema.applications).values({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Application created', 'Application', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create application: ' + err.message });
  }
});

app.put('/api/admin/applications/:id', async (req, res) => {
  try {
    const appId = Number(req.params.id);
    const updated = await db.update(schema.applications)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.applications.id, appId))
      .returning();

    await recordAuditLog(req, 'Application updated', 'Application', String(appId), { status: updated[0].status });
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update application: ' + err.message });
  }
});

// Documents Management & Verification
app.get('/api/admin/documents', async (req, res) => {
  try {
    const { category, status } = req.query;
    let list = await db.select().from(schema.documents).orderBy(desc(schema.documents.uploadedAt));
    if (category && category !== 'all') {
      list = list.filter((d) => d.category === category);
    }
    if (status && status !== 'all') {
      list = list.filter((d) => d.status === status);
    }
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.put('/api/admin/documents/:id', async (req, res) => {
  try {
    const docId = Number(req.params.id);
    const { status, verificationNotes, verifiedBy } = req.body;
    const updated = await db.update(schema.documents)
      .set({
        status,
        verificationNotes,
        verifiedBy: verifiedBy || (req.headers['x-admin-name'] as string) || 'Admin',
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, docId))
      .returning();

    await recordAuditLog(req, 'Document verified', 'Document', String(docId), { status, verificationNotes });
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Appointments Admin Management
app.get('/api/admin/appointments', async (req, res) => {
  try {
    const list = await db.select().from(schema.appointments).orderBy(desc(schema.appointments.preferredDate));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.put('/api/admin/appointments/:id', async (req, res) => {
  try {
    const apptId = Number(req.params.id);
    const updated = await db.update(schema.appointments)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.appointments.id, apptId))
      .returning();

    await recordAuditLog(req, 'Appointment status updated', 'Appointment', String(apptId), { status: updated[0].status });
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Universities Admin CRUD
app.post('/api/admin/universities', async (req, res) => {
  try {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inserted = await db.insert(schema.universities).values({
      ...req.body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'University created', 'University', String(inserted[0].id), { name: inserted[0].name });
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create university: ' + err.message });
  }
});

app.put('/api/admin/universities/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.universities)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.universities.id, id))
      .returning();

    await recordAuditLog(req, 'University updated', 'University', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update university' });
  }
});

app.delete('/api/admin/universities/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.universities).where(eq(schema.universities.id, id));
    await recordAuditLog(req, 'University deleted', 'University', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete university' });
  }
});

// Programs Admin CRUD
app.post('/api/admin/programs', async (req, res) => {
  try {
    const slug = req.body.slug || `${req.body.name}-${req.body.degree}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inserted = await db.insert(schema.programs).values({
      ...req.body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Program created', 'Program', String(inserted[0].id), { name: inserted[0].name });
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create program: ' + err.message });
  }
});

app.put('/api/admin/programs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.programs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.programs.id, id))
      .returning();

    await recordAuditLog(req, 'Program updated', 'Program', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update program' });
  }
});

app.delete('/api/admin/programs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.programs).where(eq(schema.programs.id, id));
    await recordAuditLog(req, 'Program deleted', 'Program', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

// Destinations Admin CRUD
app.post('/api/admin/destinations', async (req, res) => {
  try {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inserted = await db.insert(schema.destinations).values({
      ...req.body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Destination created', 'Destination', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

app.put('/api/admin/destinations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.destinations)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.destinations.id, id))
      .returning();

    await recordAuditLog(req, 'Destination updated', 'Destination', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

app.delete('/api/admin/destinations/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.destinations).where(eq(schema.destinations.id, id));
    await recordAuditLog(req, 'Destination deleted', 'Destination', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

// Scholarships Admin CRUD
app.post('/api/admin/scholarships', async (req, res) => {
  try {
    const inserted = await db.insert(schema.scholarships).values({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Scholarship created', 'Scholarship', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create scholarship' });
  }
});

app.put('/api/admin/scholarships/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.scholarships)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.scholarships.id, id))
      .returning();

    await recordAuditLog(req, 'Scholarship updated', 'Scholarship', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update scholarship' });
  }
});

app.delete('/api/admin/scholarships/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.scholarships).where(eq(schema.scholarships.id, id));
    await recordAuditLog(req, 'Scholarship deleted', 'Scholarship', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete scholarship' });
  }
});

// Blog CMS Admin CRUD + Publish/Unpublish
app.get('/api/admin/blog', async (req, res) => {
  try {
    const list = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.id));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.post('/api/admin/blog', async (req, res) => {
  try {
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const inserted = await db.insert(schema.blogPosts).values({
      ...req.body,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Blog article created', 'Blog', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create article: ' + err.message });
  }
});

app.put('/api/admin/blog/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.blogPosts)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.blogPosts.id, id))
      .returning();

    await recordAuditLog(req, 'Blog article updated', 'Blog', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/admin/blog/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    await recordAuditLog(req, 'Blog article deleted', 'Blog', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Events Admin CRUD
app.post('/api/admin/events', async (req, res) => {
  try {
    const inserted = await db.insert(schema.events).values({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Event created', 'Event', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/admin/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.events)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.events.id, id))
      .returning();

    await recordAuditLog(req, 'Event updated', 'Event', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.events).where(eq(schema.events.id, id));
    await recordAuditLog(req, 'Event deleted', 'Event', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Testimonials / Success Stories CRUD
app.post('/api/admin/testimonials', async (req, res) => {
  try {
    const inserted = await db.insert(schema.successStories).values({
      ...req.body,
      createdAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Success story created', 'Testimonial', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create success story' });
  }
});

app.put('/api/admin/testimonials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.successStories)
      .set(req.body)
      .where(eq(schema.successStories.id, id))
      .returning();

    await recordAuditLog(req, 'Success story updated', 'Testimonial', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update success story' });
  }
});

app.delete('/api/admin/testimonials/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.successStories).where(eq(schema.successStories.id, id));
    await recordAuditLog(req, 'Success story deleted', 'Testimonial', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete success story' });
  }
});

// FAQs Admin CRUD
app.post('/api/admin/faqs', async (req, res) => {
  try {
    const inserted = await db.insert(schema.faqs).values({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'FAQ created', 'FAQ', String(inserted[0].id));
    res.status(201).json(inserted[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create faq' });
  }
});

app.put('/api/admin/faqs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.update(schema.faqs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.faqs.id, id))
      .returning();

    await recordAuditLog(req, 'FAQ updated', 'FAQ', String(id));
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update faq' });
  }
});

app.delete('/api/admin/faqs/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
    await recordAuditLog(req, 'FAQ deleted', 'FAQ', String(id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete faq' });
  }
});

// Website Settings Update (Admin Only)
app.put('/api/admin/settings/:key', async (req, res) => {
  try {
    const userRole = (req.headers['x-admin-role'] as string) || 'admin';
    if (userRole === 'counsellor') {
      return res.status(403).json({ error: 'Permission denied: Counsellors cannot modify global website settings.' });
    }

    const { key } = req.params;
    const { value } = req.body;

    const existing = await db.select().from(schema.settings).where(eq(schema.settings.key, key)).limit(1);
    let result;
    if (existing.length) {
      result = await db.update(schema.settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(schema.settings.key, key))
        .returning();
    } else {
      result = await db.insert(schema.settings).values({
        key,
        value,
        updatedAt: new Date(),
      }).returning();
    }

    await recordAuditLog(req, 'Settings updated', 'Settings', key, value);
    res.json(result[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Counsellors / Team Admin CRUD & Lead Assignment
app.get('/api/admin/team', async (req, res) => {
  try {
    const list = await db.select().from(schema.counsellors).orderBy(schema.counsellors.id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch counsellors' });
  }
});

app.post('/api/admin/team', async (req, res) => {
  try {
    const userRole = (req.headers['x-admin-role'] as string) || 'admin';
    if (userRole === 'counsellor') {
      return res.status(403).json({ error: 'Permission denied: Only Administrators can create team accounts.' });
    }

    const { name, email, phone, role, experience, specialties, photo } = req.body;
    
    // Also create user login entry
    const userInsert = await db.insert(schema.users).values({
      uid: `counsellor-${Date.now()}`,
      email,
      name,
      role: 'counsellor',
      phone,
      active: true,
    }).returning();

    const counsellorInsert = await db.insert(schema.counsellors).values({
      userId: userInsert[0].id,
      name,
      email,
      phone,
      role: role || 'Education Counsellor',
      experience,
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      specialties: specialties || [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    await recordAuditLog(req, 'Counsellor created', 'Team', String(counsellorInsert[0].id), { name, email });
    res.status(201).json(counsellorInsert[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create counsellor: ' + err.message });
  }
});

app.put('/api/admin/team/:id', async (req, res) => {
  try {
    const userRole = (req.headers['x-admin-role'] as string) || 'admin';
    if (userRole === 'counsellor') {
      return res.status(403).json({ error: 'Permission denied: Only Administrators can modify team accounts.' });
    }

    const id = Number(req.params.id);
    const updated = await db.update(schema.counsellors)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(schema.counsellors.id, id))
      .returning();

    await recordAuditLog(req, 'Counsellor updated', 'Team', String(id), { name: updated[0].name });
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update counsellor' });
  }
});

// Reassign leads to another counsellor
app.post('/api/admin/team/reassign', async (req, res) => {
  try {
    const { fromCounsellorId, toCounsellorId } = req.body;
    const target = await db.select().from(schema.counsellors).where(eq(schema.counsellors.id, Number(toCounsellorId))).limit(1);
    if (!target.length) return res.status(404).json({ error: 'Target counsellor not found' });

    await db.update(schema.leads)
      .set({
        assignedCounsellorId: target[0].id,
        assignedCounsellorName: target[0].name,
        updatedAt: new Date(),
      })
      .where(eq(schema.leads.assignedCounsellorId, Number(fromCounsellorId)));

    await db.update(schema.students)
      .set({
        assignedCounsellorId: target[0].id,
        updatedAt: new Date(),
      })
      .where(eq(schema.students.assignedCounsellorId, Number(fromCounsellorId)));

    await recordAuditLog(req, 'Leads reassigned', 'Team', String(toCounsellorId), { from: fromCounsellorId, to: toCounsellorId });
    res.json({ success: true, message: `All records reassigned to ${target[0].name}.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reassign records' });
  }
});

// Audit Logs
app.get('/api/admin/audit-logs', async (req, res) => {
  try {
    const { entity, user } = req.query;
    let list = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(100);
    if (entity && entity !== 'all') {
      list = list.filter((l) => l.entity === entity);
    }
    if (user) {
      list = list.filter((l) => l.userName.toLowerCase().includes(String(user).toLowerCase()));
    }
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ----------------------------------------------------
// PHASE 4: AI ASSISTANT & AUTOMATION ENDPOINTS
// ----------------------------------------------------

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. COS Study Abroad Assistant Chatbot API
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, userQuestion } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
You are the "COS Study Abroad Assistant", an expert, empathetic, and professional education consultant at COS Education (Sylhet, Bangladesh).
You assist prospective international students exploring higher education abroad in destination countries such as the United Kingdom, Finland, United States, Malaysia, Malta, and Canada.

STRICT MANDATORY RULES & SAFEGUARDS:
1. Clearly distinguish general guidance and typical university criteria from official, mandatory requirements.
2. NEVER guarantee admission to any university. Admission decisions depend entirely on institutional academic boards.
3. NEVER guarantee visa issuance or approval. Visa decisions are the sovereign authority of immigration authorities and consular officers.
4. Identify when specific information requires official verification (such as changes to UKVI immigration salary thresholds, MOI medium of instruction acceptance lists, or embassy financial proof rules).
5. Always politely encourage students to contact COS Education's experienced counsellors (at Chowhatta Point, Sylhet or via online appointment) for formal case reviews and application lodgement.
6. Keep responses clear, beautifully structured with bullet points where appropriate, and easy to read.
`;

    if (ai) {
      try {
        // Build prompt from messages history
        const promptHistory = Array.isArray(messages)
          ? messages.map((m: any) => `${m.role === 'user' ? 'Student' : 'COS Assistant'}: ${m.content}`).join('\n\n')
          : '';
        const prompt = `${systemInstruction}\n\nConversation History:\n${promptHistory}\n\nStudent: ${userQuestion || messages[messages.length - 1]?.content}\n\nCOS Assistant:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const replyText = response.text;
        if (replyText) {
          return res.json({ reply: replyText, verifiedNotice: 'General guidance based on typical international admissions benchmarks.' });
        }
      } catch (geminiErr) {
        console.warn('Gemini chat API call failed, falling back to knowledge base:', geminiErr);
      }
    }

    // Intelligent Fallback if API key is not yet configured in preview
    const queryLower = (userQuestion || '').toLowerCase();
    let reply = '';

    if (queryLower.includes('country') || queryLower.includes('suit') || queryLower.includes('destination')) {
      reply = `**Destination Assessment Guidance:**\n\nSelecting the right study destination depends on several intersecting factors:\n\n* **United Kingdom:** Ideal if you want a 1-year Master's degree, 2-year Graduate Route (PSW), wide MOI / IELTS waiver options, and multiple intakes (Jan/May/Sept).\n* **Finland:** Excellent for affordable tuition (€8,000–€12,000), generous institutional scholarships (often 20%–50%), and 2-year post-study job search permits in the Schengen zone.\n* **United States:** Superb for STEM research, OPT work authorization (up to 3 years), and assistantships.\n* **Malaysia & Malta:** Great for budget-conscious students seeking British curriculum degrees with living costs under $400/month.\n\n⚠️ *Important Notice:* This is general comparative guidance. University entry requirements and visa policies vary by nationality and intake. We strongly encourage you to book a free profile session with a COS Education counsellor to evaluate your specific academic transcript.`;
    } else if (queryLower.includes('tuition') || queryLower.includes('cost') || queryLower.includes('budget') || queryLower.includes('fee')) {
      reply = `**Approximate Tuition & Budget Overview:**\n\n* **UK Universities:** Typically £12,000 to £18,000 per year for classroom-based programs. Initial tuition deposit is generally £3,000 to £5,000 to trigger CAS.\n* **Finland Universities:** Approx. €8,000 to €13,000/year, with early-bird or merit scholarships reducing this significantly.\n* **Malaysia Campuses:** Around $4,000 to $8,000 annually.\n* **Living Expenses:** UK requires approx. £9,207 (outside London) or £12,006 (inside London) for 9 months under UKVI guidelines.\n\n⚠️ *Verification Note:* Tuition amounts and required maintenance funds are subject to currency fluctuations and annual university fee revisions. No admission or visa outcome is ever guaranteed. Please consult a COS Education advisor for exact fee structures.`;
    } else if (queryLower.includes('document') || queryLower.includes('require') || queryLower.includes('paper')) {
      reply = `**Standard Study Abroad Documentation Checklist:**\n\n1. **Valid Passport** (minimum 6 months validity beyond intended stay).\n2. **Academic Transcripts & Certificates** (Secondary, Higher Secondary, and Bachelor/Master degrees with certified English translations if applicable).\n3. **English Proficiency Test** (IELTS Academic, PTE Academic, or Medium of Instruction certificate where accepted).\n4. **Statement of Purpose (SOP)** (explaining academic rationale, career objectives, and destination choice).\n5. **Two Academic/Professional Letters of Recommendation (LOR)**.\n6. **Updated Curriculum Vitae (CV)** detailing any work experience and explaining study gaps.\n7. **Financial Proof** (bank statement meeting continuous 28-day holding rules).\n\n⚠️ *Note:* Different universities and visa bodies have distinct verification procedures. Contact COS Education Sylhet for document checking before formal submission.`;
    } else if (queryLower.includes('program') || queryLower.includes('consider') || queryLower.includes('course') || queryLower.includes('degree')) {
      reply = `**Program Selection Framework:**\n\nWhen exploring degrees, consider aligning your previous background and career objectives:\n\n* **Computer Science, AI & Data Science:** High global post-study demand, 2-3 years PSW/OPT in UK and USA, and robust tech hubs in Finland.\n* **Business & Management (MBA / MSc Project Management):** Ideal for graduates seeking managerial transitions; many UK universities accept diverse undergraduate backgrounds with or without work experience.\n* **Public Health, Nursing & Biomedical Sciences:** Strong sponsorship demand across NHS UK trust hospital networks.\n* **Engineering & Sustainable Technologies:** World-leading labs in Finland and the UK.\n\n⚠️ *Guidance Notice:* Exact prerequisites (such as mathematics background or minimum credits) vary per university. Admission is never guaranteed. We recommend consulting a COS Education counsellor to map your transcript to accredited programs.`;
    } else if (queryLower.includes('application') || queryLower.includes('process') || queryLower.includes('step') || queryLower.includes('how to apply')) {
      reply = `**The 6-Stage Application Process with COS Education:**\n\n1. **Free Profile Audit:** Review your academic marks, English test, and budget to select 3–5 matched institutions.\n2. **Application Lodgement:** COS Education facilitates submitting your formal dossier through institutional application channels with application fee waivers where available.\n3. **Conditional Offer:** Universities issue an offer letter within 2 to 4 weeks specifying any remaining academic or language conditions.\n4. **Credibility Interview & Deposit:** Prepare for university pre-CAS credibility interviews with our senior mock interview trainers, then pay your tuition deposit.\n5. **CAS / I-20 Issuance:** University issues your Confirmation of Acceptance for Studies (CAS) or Form I-20.\n6. **Visa Application:** Comprehensive file preparation, biometric appointment booking at VFS Sylhet, and pre-departure briefing.\n\n⚠️ *Essential Rule:* Admission and visa outcomes are decided exclusively by university boards and immigration authorities. We encourage you to start with our Sylhet branch for tailored guidance.`;
    } else if (queryLower.includes('scholarship')) {
      reply = `**Scholarships & Financial Aid Overview:**\n\n* **UK University Scholarships:** Many UK network universities offer automatic International Merit Awards ranging from £1,500 to £4,000 deducted directly from tuition.\n* **Finland Merit Waivers:** Finnish universities frequently offer 20% to 50% tuition reduction for high CGPA applicants.\n* **Early Bird Discounts:** Applying 3–4 months ahead of the intake often secures an additional £500–£1,000 deduction.\n\n⚠️ *Reminder:* Scholarships are awarded competitively and criteria may change per intake. We invite you to contact COS Education so our counsellors can match your profile against current available bursaries.`;
    } else {
      reply = `Thank you for reaching out to COS Education! As your Study Abroad Assistant, I can guide you through choosing the right study destinations, estimating tuition and living budgets, understanding visa requirements, and discovering available scholarships across the UK, Europe, USA, and Malaysia.\n\n*Please note:* While I provide general guidance based on typical admissions frameworks, university admission and visa issuance cannot be guaranteed. For an official eligibility audit and document review, we warmly invite you to book a free consultation at our Chowhatta Point, Sylhet office or online with a senior counsellor.`;
    }

    res.json({ reply, verifiedNotice: 'General guidance based on typical international admissions benchmarks.' });
  } catch (err: any) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Failed to process assistant enquiry' });
  }
});

// 2. AI Profile Analysis API
app.post('/api/ai/profile-analysis', async (req, res) => {
  try {
    const {
      qualification,
      cgpa,
      graduationYear,
      studyGap,
      englishTest,
      englishScore,
      budget,
      preferredDestination,
      preferredDegree,
      workExperience,
    } = req.body;

    const ai = getGeminiClient();

    const analysisPrompt = `
You are a senior international admissions director at COS Education.
Analyze the following student profile for study abroad eligibility:
- Highest Qualification: ${qualification}
- CGPA / Grade: ${cgpa}
- Graduation Year: ${graduationYear || 'Not specified'}
- Study Gap: ${studyGap || 'None'}
- English Proficiency: ${englishTest || 'None'} (${englishScore || 'Not specified'})
- Annual Budget (Tuition + Living): ${budget || 'Flexible'}
- Preferred Destination: ${preferredDestination || 'Flexible'}
- Desired Degree: ${preferredDegree || 'Master'}
- Work Experience: ${workExperience || 'None'}

Generate a strict JSON response (do not include markdown code block formatting or backticks) with this structure:
{
  "profileSummary": "A crisp 2-3 sentence overview of the applicant's academic standing, language readiness, and eligibility profile.",
  "potentialDestinations": [
    { "country": "Name", "category": "Best Match | Competitive | Ambitious", "reason": "Specific reason based on CGPA and budget" }
  ],
  "potentialProgramCategories": ["Program category 1", "Program category 2", "Program category 3"],
  "potentialConcerns": [
    "Identify any study gap, English test requirement, financial threshold, or qualification equivalency concerns"
  ],
  "recommendedNextSteps": [
    "Step 1", "Step 2", "Step 3", "Step 4"
  ],
  "counsellorAdvice": "Personalized advice emphasizing verification by a COS Education counsellor before applying."
}

MANDATORY RULES:
- Never guarantee admission or visa.
- Clearly note that this is a preliminary automated assessment.
- Highlight gaps requiring documentary justification.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: analysisPrompt,
        });

        let rawText = response.text || '{}';
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(rawText);
        if (parsed && parsed.profileSummary) {
          return res.json(parsed);
        }
      } catch (geminiErr) {
        console.warn('Gemini profile analysis failed, falling back to structured generator:', geminiErr);
      }
    }

    // Intelligent Fallback Analysis Generator
    const numCgpa = parseFloat(cgpa) || 2.8;
    const destinations = [];

    if (numCgpa >= 3.0) {
      destinations.push({
        country: preferredDestination || 'United Kingdom',
        category: 'Best Match',
        reason: `Your CGPA of ${cgpa} meets direct entry requirements for prestigious Russell Group and public universities in the UK with scholarship eligibility.`,
      });
      destinations.push({
        country: 'Finland',
        category: 'Competitive',
        reason: 'Strong chance for 20%–50% tuition scholarship waivers in UAS and research universities.',
      });
      destinations.push({
        country: 'United States',
        category: 'Ambitious',
        reason: 'Eligible for direct graduate admissions with potential assistantships.',
      });
    } else if (numCgpa >= 2.5) {
      destinations.push({
        country: preferredDestination || 'United Kingdom',
        category: 'Best Match',
        reason: `Your CGPA of ${cgpa} is accepted across numerous accredited UK universities (such as Hertfordshire, Chester, and Leeds Beckett) with standard deposit structures.`,
      });
      destinations.push({
        country: 'Malaysia',
        category: 'Best Match',
        reason: 'Affordable dual-degree UK/Australian programs with high visa success.',
      });
      destinations.push({
        country: 'Malta & Europe',
        category: 'Competitive',
        reason: 'Flexible entry criteria with European Schengen student rights.',
      });
    } else {
      destinations.push({
        country: 'United Kingdom (Pre-Master / Extended)',
        category: 'Competitive',
        reason: 'Pathways and pre-master programs available to bridge academic requirements.',
      });
      destinations.push({
        country: 'Malaysia',
        category: 'Best Match',
        reason: 'Flexible direct entry options with high acceptance rates.',
      });
    }

    const concerns = [];
    if (studyGap && studyGap !== 'None' && studyGap !== '0') {
      concerns.push(`Study gap of ${studyGap} requires formal employer experience certificates, salary slips, or appointment letters to satisfy visa genuine student (GS) checks.`);
    }
    if (!englishTest || englishTest === 'None' || englishTest === 'Not Taken Yet') {
      concerns.push('English proficiency test pending: We recommend booking IELTS Academic or PTE Academic promptly, or exploring universities accepting Medium of Instruction (MOI) letters.');
    }
    concerns.push('Financial proof: 28-day continuous funds holding rule in an approved scheduled bank must be planned at least 1 month prior to CAS / visa lodging.');

    const result = {
      profileSummary: `Applicant holds a ${qualification} with a CGPA of ${cgpa || 'unspecified'}. Demonstrates solid potential for ${preferredDegree || "Master's"} study with a target in ${preferredDestination || 'the United Kingdom'}.`,
      potentialDestinations: destinations,
      potentialProgramCategories: [
        'Management, International Business & Marketing',
        'Computing, Data Analytics & Artificial Intelligence',
        'Engineering & Project Management',
        'Public Health & Healthcare Administration',
      ],
      potentialConcerns: concerns,
      recommendedNextSteps: [
        'Gather and notarize all semester-wise marksheets and passing certificates.',
        'Obtain work experience letters with company letterhead for all post-graduation years.',
        'Schedule an IELTS/PTE diagnostic or obtain an official MOI letter from your university registrar.',
        'Book a free 1-on-1 verification session with a COS Education counsellor to shortlist fee-free university network institutions.',
      ],
      counsellorAdvice: 'Preliminary assessment indicates promising prospects. Final eligibility, tuition waivers, and CAS sponsorship are subject to individual university admissions board policies and official document verification by COS Education.',
    };

    res.json(result);
  } catch (err: any) {
    console.error('AI profile analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze student profile' });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER INITIALIZATION
// ----------------------------------------------------

async function startServer() {
  // Run seed check on boot
  try {
    await seedDatabase();
  } catch (e) {
    console.error('Initial seed check error:', e);
  }

  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`COS Education Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
