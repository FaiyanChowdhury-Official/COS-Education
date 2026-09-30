import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// USERS & AUTH (Sync with Firebase UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('counsellor'), // 'admin' | 'counsellor' | 'student'
  studentId: integer('student_id'),
  counsellorId: integer('counsellor_id'),
  password: text('password'),
  avatar: text('avatar'),
  phone: text('phone'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// COUNSELLORS / TEAM
export const counsellors = pgTable('counsellors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: text('role').notNull().default('Senior Education Counsellor'),
  experience: text('experience'),
  photo: text('photo'),
  specialties: jsonb('specialties').$type<string[]>().default([]),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// DESTINATIONS
export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  flag: text('flag').notNull(),
  coverImage: text('cover_image').notNull(),
  heroSubtitle: text('hero_subtitle').notNull(),
  shortDescription: text('short_description').notNull(),
  overview: text('overview').notNull(),
  tuitionRange: text('tuition_range').notNull(),
  livingCost: text('living_cost').notNull(),
  currency: text('currency').notNull(),
  workRights: text('work_rights').notNull(),
  postStudyWork: text('post_study_work').notNull(),
  scholarshipInfo: text('scholarship_info').notNull(),
  popularPrograms: jsonb('popular_programs').$type<string[]>().default([]),
  whyStudyHere: jsonb('why_study_here').$type<{ title: string; description: string }[]>().default([]),
  entryRequirements: jsonb('entry_requirements').$type<{ undergraduate: string; postgraduate: string }>().default({ undergraduate: '', postgraduate: '' }),
  englishRequirements: jsonb('english_requirements').$type<{ ielts: string; pte?: string; waiverPossible: boolean; waiverNote?: string }>().default({ ielts: '', waiverPossible: true }),
  faqs: jsonb('faqs').$type<{ question: string; answer: string }[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// UNIVERSITIES
export const universities = pgTable('universities', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  countrySlug: text('country_slug').notNull(),
  city: text('city').notNull(),
  logo: text('logo').notNull(),
  coverImage: text('cover_image').notNull(),
  ranking: text('ranking').notNull().default('Accredited Institution'),
  type: text('type').notNull().default('Public'), // 'Public' | 'Private'
  tuitionRange: text('tuition_range').notNull(),
  applicationFee: text('application_fee').notNull().default('Free with COS Education'),
  scholarshipsAvailable: text('scholarships_available').notNull(),
  englishRequirements: text('english_requirements').notNull(),
  intakes: jsonb('intakes').$type<string[]>().default([]),
  programsCount: integer('programs_count').notNull().default(0),
  overview: text('overview').notNull(),
  entryRequirements: text('entry_requirements').notNull(),
  applicationDeadline: text('application_deadline').notNull(),
  website: text('website').notNull(),
  featured: boolean('featured').notNull().default(false),
  keyHighlights: jsonb('key_highlights').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PROGRAMS
export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  universityId: integer('university_id').references(() => universities.id),
  universityName: text('university_name').notNull(),
  universitySlug: text('university_slug').notNull(),
  country: text('country').notNull(),
  countrySlug: text('country_slug').notNull(),
  degree: text('degree').notNull(), // 'Bachelor' | 'Master' | 'Diploma' | 'PhD'
  discipline: text('discipline').notNull(),
  duration: text('duration').notNull(),
  tuition: text('tuition').notNull(),
  intakes: jsonb('intakes').$type<string[]>().default([]),
  englishRequirement: text('english_requirement').notNull(),
  entryRequirements: text('entry_requirements').notNull(),
  scholarshipAvailable: boolean('scholarship_available').notNull().default(true),
  scholarshipDetails: text('scholarship_details'),
  overview: text('overview').notNull(),
  careerOutcomes: jsonb('career_outcomes').$type<string[]>().default([]),
  applicationDeadline: text('application_deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// LEADS
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  country: text('country'),
  program: text('program'),
  academicQualification: text('academic_qualification'),
  cgpa: text('cgpa'),
  ielts: text('ielts'),
  budget: text('budget'),
  intake: text('intake'),
  source: text('source').notNull().default('Website Inquiry'), // 'Website Consultation' | 'Eligibility Checker' | 'WhatsApp' | 'Walk-in'
  leadSourceCategory: text('lead_source_category').notNull().default('Website'), // 'Website' | 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok' | 'Google' | 'Referral' | 'WhatsApp' | 'Manual' | 'Other'
  leadScore: integer('lead_score').notNull().default(0),
  leadScoreSignals: jsonb('lead_score_signals').$type<string[]>().default([]),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  assignedCounsellorId: integer('assigned_counsellor_id').references(() => counsellors.id),
  assignedCounsellorName: text('assigned_counsellor_name'),
  status: text('status').notNull().default('New Lead'),
  // Pipeline: 'New Lead' | 'Contacted' | 'Counselling' | 'Documents Pending' | 'Application Started' | 'Applied' | 'Offer Received' | 'Deposit' | 'CAS/Enrollment' | 'Visa Applied' | 'Visa Decision' | 'Enrolled'
  notes: text('notes'),
  followUpDate: text('follow_up_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// LEAD AUDIT HISTORY
export const leadHistory = pgTable('lead_history', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(),
  previousStatus: text('previous_status'),
  newStatus: text('new_status'),
  notes: text('notes'),
  performedBy: text('performed_by').notNull().default('System'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// STUDENTS
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  studentRef: text('student_ref').notNull().unique(), // e.g. COS-2026-001
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  dateOfBirth: text('date_of_birth'),
  gender: text('gender'),
  nationality: text('nationality').default('Bangladeshi'),
  passportNumber: text('passport_number'),
  address: text('address'),
  emergencyContact: text('emergency_contact'),
  qualification: text('qualification'),
  cgpa: text('cgpa'),
  passingYear: text('passing_year'),
  studyGap: text('study_gap'),
  englishTest: text('english_test'),
  englishScore: text('english_score'),
  preferredDestinations: jsonb('preferred_destinations').$type<string[]>().default([]),
  targetDegree: text('target_degree'),
  budget: text('budget'),
  assignedCounsellorId: integer('assigned_counsellor_id').references(() => counsellors.id),
  status: text('status').notNull().default('Active'), // 'Active' | 'Enrolled' | 'Deferred' | 'Archived'
  notes: text('notes'),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// APPLICATIONS
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  studentName: text('student_name').notNull(),
  universityId: integer('university_id').references(() => universities.id),
  universityName: text('university_name').notNull(),
  programId: integer('program_id').references(() => programs.id),
  programName: text('program_name').notNull(),
  country: text('country').notNull(),
  intake: text('intake').notNull(),
  applicationDate: text('application_date').notNull(),
  status: text('status').notNull().default('Draft'), // 'Draft' | 'Submitted' | 'Under Assessment' | 'Conditional Offer' | 'Unconditional Offer' | 'Deposit Paid' | 'CAS Issued' | 'Visa Lodged' | 'Visa Approved' | 'Rejected'
  offerStatus: text('offer_status').default('Pending'),
  depositStatus: text('deposit_status').default('Pending'),
  casStatus: text('cas_status').default('Pending'),
  visaStatus: text('visa_status').default('Pending'),
  notes: text('notes'),
  timeline: jsonb('timeline').$type<{ date: string; stage: string; note: string; status: 'completed' | 'current' | 'upcoming' }[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// DOCUMENTS
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  applicationId: integer('application_id').references(() => applications.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Passport' | 'Certificate' | 'Transcript' | 'English Test' | 'CV' | 'SOP' | 'Recommendation Letter' | 'Financial Documents' | 'Other'
  fileUrl: text('file_url').notNull(),
  fileData: text('file_data'), // Protected base64 / encrypted storage
  fileName: text('file_name'),
  fileSize: text('file_size'),
  mimeType: text('mime_type'),
  status: text('status').notNull().default('Uploaded'), // 'Uploaded' | 'Under Review' | 'Verified' | 'Rejected'
  verificationNotes: text('verification_notes'),
  verifiedBy: text('verified_by'),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// APPOINTMENTS
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  appointmentRef: text('appointment_ref').notNull().unique(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'set null' }),
  studentName: text('student_name').notNull(),
  studentEmail: text('student_email').notNull(),
  studentPhone: text('student_phone').notNull(),
  destination: text('destination'),
  degree: text('degree'),
  preferredDate: text('preferred_date').notNull(),
  preferredTime: text('preferred_time').notNull(),
  mode: text('mode').notNull().default('In-person (Sylhet Office)'), // 'In-person (Sylhet Office)' | 'Online (Google Meet / Zoom)'
  message: text('message'),
  assignedCounsellorId: integer('assigned_counsellor_id').references(() => counsellors.id),
  status: text('status').notNull().default('New'), // 'New' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SCHOLARSHIPS
export const scholarships = pgTable('scholarships', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  country: text('country').notNull(),
  university: text('university'),
  amount: text('amount').notNull(),
  coverageType: text('coverage_type').notNull(), // 'Full Tuition' | 'Partial Tuition' | 'Living Allowance' | 'Travel Grant'
  degreeLevel: jsonb('degree_level').$type<string[]>().default([]),
  deadline: text('deadline').notNull(),
  criteria: text('criteria').notNull(),
  description: text('description').notNull(),
  linkText: text('link_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SUCCESS STORIES / TESTIMONIALS
export const successStories = pgTable('success_stories', {
  id: serial('id').primaryKey(),
  studentName: text('student_name').notNull(),
  photo: text('photo').notNull(),
  destination: text('destination').notNull(),
  countryCode: text('country_code').notNull(),
  university: text('university').notNull(),
  program: text('program').notNull(),
  intake: text('intake').notNull(),
  visaStatus: text('visa_status').notNull().default('Visa Approved'),
  scholarshipAwarded: text('scholarship_awarded'),
  quote: text('quote').notNull(),
  fullStory: text('full_story').notNull(),
  hometown: text('hometown').notNull().default('Sylhet, Bangladesh'),
  featured: boolean('featured').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// BLOG POSTS / CMS
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  authorName: text('author_name').notNull().default('COS Education Team'),
  authorRole: text('author_role').notNull().default('Admissions Advisory Desk'),
  authorAvatar: text('author_avatar').default('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
  date: text('date').notNull(),
  readTime: text('read_time').notNull().default('5 min read'),
  excerpt: text('excerpt').notNull(),
  content: jsonb('content').$type<string[]>().default([]),
  coverImage: text('cover_image').notNull(),
  tags: jsonb('tags').$type<string[]>().default([]),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// EVENTS
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  isOnline: boolean('is_online').notNull().default(false),
  speaker: text('speaker').notNull(),
  description: text('description').notNull(),
  seatsRemaining: integer('seats_remaining').notNull().default(30),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FAQS
export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category').notNull().default('Admissions'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SETTINGS (Key-Value)
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// AUDIT LOGS
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  action: text('action').notNull(), // 'Lead created' | 'Lead status changed' | 'Document verified' | 'Application updated' | 'Student edited'
  entity: text('entity').notNull(), // 'Lead' | 'Student' | 'Application' | 'Document' | 'University' | 'Settings'
  entityId: text('entity_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// TASKS
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  studentName: text('student_name'),
  counsellorId: integer('counsellor_id').references(() => counsellors.id, { onDelete: 'cascade' }),
  counsellorName: text('counsellor_name'),
  dueDate: text('due_date').notNull(),
  priority: text('priority').notNull().default('Medium'), // 'Low' | 'Medium' | 'High' | 'Urgent'
  status: text('status').notNull().default('Pending'), // 'Pending' | 'In Progress' | 'Completed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// FOLLOW-UPS
export const followups = pgTable('followups', {
  id: serial('id').primaryKey(),
  leadId: integer('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'set null' }),
  studentName: text('student_name').notNull(),
  counsellorId: integer('counsellor_id').references(() => counsellors.id, { onDelete: 'cascade' }),
  counsellorName: text('counsellor_name').notNull(),
  type: text('type').notNull(), // 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Application follow-up' | 'Document follow-up'
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time'),
  notes: text('notes'),
  status: text('status').notNull().default('Scheduled'), // 'Scheduled' | 'Completed' | 'Missed' | 'Cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// MESSAGES (Student-Counsellor)
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  counsellorId: integer('counsellor_id').references(() => counsellors.id, { onDelete: 'cascade' }).notNull(),
  senderRole: text('sender_role').notNull(), // 'student' | 'counsellor' | 'admin'
  senderName: text('sender_name').notNull(),
  senderAvatar: text('sender_avatar'),
  content: text('content').notNull(),
  attachments: jsonb('attachments').$type<{ name: string; url: string; size?: string }[]>().default([]),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NOTIFICATIONS
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  recipientRole: text('recipient_role').notNull(), // 'student' | 'counsellor' | 'admin'
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }),
  counsellorId: integer('counsellor_id').references(() => counsellors.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('general'), // 'application' | 'document' | 'appointment' | 'offer' | 'deadline' | 'visa' | 'general'
  link: text('link'),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// RELATIONS
export const usersRelations = relations(users, ({ one }) => ({
  counsellorProfile: one(counsellors, {
    fields: [users.id],
    references: [counsellors.userId],
  }),
}));

export const counsellorsRelations = relations(counsellors, ({ one, many }) => ({
  user: one(users, {
    fields: [counsellors.userId],
    references: [users.id],
  }),
  assignedLeads: many(leads),
  assignedStudents: many(students),
  assignedAppointments: many(appointments),
  tasks: many(tasks),
  followups: many(followups),
  messages: many(messages),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignedCounsellor: one(counsellors, {
    fields: [leads.assignedCounsellorId],
    references: [counsellors.id],
  }),
  history: many(leadHistory),
  followups: many(followups),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  assignedCounsellor: one(counsellors, {
    fields: [students.assignedCounsellorId],
    references: [counsellors.id],
  }),
  applications: many(applications),
  documents: many(documents),
  appointments: many(appointments),
  tasks: many(tasks),
  followups: many(followups),
  messages: many(messages),
  notifications: many(notifications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  student: one(students, {
    fields: [applications.studentId],
    references: [students.id],
  }),
  university: one(universities, {
    fields: [applications.universityId],
    references: [universities.id],
  }),
  program: one(programs, {
    fields: [applications.programId],
    references: [programs.id],
  }),
  documents: many(documents),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  student: one(students, {
    fields: [tasks.studentId],
    references: [students.id],
  }),
  counsellor: one(counsellors, {
    fields: [tasks.counsellorId],
    references: [counsellors.id],
  }),
}));

export const followupsRelations = relations(followups, ({ one }) => ({
  student: one(students, {
    fields: [followups.studentId],
    references: [students.id],
  }),
  lead: one(leads, {
    fields: [followups.leadId],
    references: [leads.id],
  }),
  counsellor: one(counsellors, {
    fields: [followups.counsellorId],
    references: [counsellors.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  student: one(students, {
    fields: [messages.studentId],
    references: [students.id],
  }),
  counsellor: one(counsellors, {
    fields: [messages.counsellorId],
    references: [counsellors.id],
  }),
}));

// AUTOMATION RULES
export const automationRules = pgTable('automation_rules', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  triggerEvent: text('trigger_event').notNull(),
  actionType: text('action_type').notNull(),
  config: jsonb('config').default({}),
  enabled: boolean('enabled').notNull().default(true),
  executionCount: integer('execution_count').notNull().default(0),
  lastTriggeredAt: timestamp('last_triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AUTOMATION EXECUTION LOGS
export const automationLogs = pgTable('automation_logs', {
  id: serial('id').primaryKey(),
  ruleName: text('rule_name').notNull(),
  triggerEvent: text('trigger_event').notNull(),
  targetName: text('target_name'),
  targetId: integer('target_id'),
  actionTaken: text('action_taken').notNull(),
  status: text('status').notNull().default('Success'),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// EMAIL TEMPLATES
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  bodyText: text('body_text').notNull(),
  bodyHtml: text('body_html'),
  availableVariables: jsonb('available_variables').$type<string[]>().default([]),
  category: text('category').notNull().default('Transactional'),
  active: boolean('active').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ====================================================
// COMMUNICATIONS & SOCIAL MEDIA MANAGEMENT TABLES
// ====================================================

// 1. SOCIAL MEDIA ACCOUNTS
export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'tiktok' | 'x' | 'whatsapp' | 'telegram' | 'pinterest' | 'threads'
  accountName: text('account_name').notNull(),
  profileUrl: text('profile_url').notNull(),
  username: text('username').notNull(),
  accountType: text('account_type').notNull().default('Company'), // 'Company' | 'Branch' | 'Counsellor' | 'Campaign' | 'Other'
  status: text('status').notNull().default('Active'), // 'Active' | 'Inactive'
  displayOrder: integer('display_order').notNull().default(0),
  icon: text('icon'),
  description: text('description'),
  apiConnected: boolean('api_connected').notNull().default(false),
  followersCount: integer('followers_count').default(0),
  reachCount: integer('reach_count').default(0),
  engagementRate: text('engagement_rate'),
  viewsCount: integer('views_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. SOCIAL MEDIA CONTENT & POSTS
export const socialPosts = pgTable('social_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  caption: text('caption').notNull(),
  platforms: jsonb('platforms').$type<string[]>().notNull().default([]), // ['facebook', 'instagram', 'linkedin', 'x', 'tiktok']
  mediaType: text('media_type').notNull().default('text'), // 'text' | 'image' | 'video' | 'link'
  mediaUrl: text('media_url'),
  publishDate: text('publish_date').notNull(), // YYYY-MM-DD
  publishTime: text('publish_time').notNull(), // HH:MM
  cta: text('cta'),
  hashtags: text('hashtags'),
  status: text('status').notNull().default('Draft'), // 'Draft' | 'Scheduled' | 'Published' | 'Failed' | 'Cancelled'
  authorName: text('author_name').notNull().default('COS Marketing Team'),
  authorRole: text('author_role').notNull().default('Admin'),
  aiGenerated: boolean('ai_generated').notNull().default(false),
  sourceType: text('source_type').default('manual'), // 'manual' | 'ai_assistant' | 'blog_automation'
  sourceReference: text('source_reference'), // blog slug or title
  platformSpecificContent: jsonb('platform_specific_content').$type<Record<string, { caption?: string; hashtags?: string; cta?: string }>>().default({}),
  failureReason: text('failure_reason'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. VIDEO CONFERENCES
export const videoConferences = pgTable('video_conferences', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  platform: text('platform').notNull(), // 'zoom' | 'google-meet' | 'teams' | 'webex'
  meetingUrl: text('meeting_url').notNull(),
  meetingId: text('meeting_id'),
  passcode: text('passcode'),
  hostName: text('host_name').notNull(),
  hostEmail: text('host_email').notNull(),
  counsellorId: integer('counsellor_id'),
  studentName: text('student_name'),
  studentEmail: text('student_email'),
  studentId: integer('student_id'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(45),
  status: text('status').notNull().default('Scheduled'), // 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled'
  purpose: text('purpose').notNull().default('Student Consultation'), // 'Student Consultation' | 'University Webinar' | 'Visa Interview Prep' | 'Team Briefing' | 'Other'
  notes: text('notes'),
  reminderSent: boolean('reminder_sent').notNull().default(false),
  recordingUrl: text('recording_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. SOCIAL LINKS DIRECTORY
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  branchLocation: text('branch_location').notNull().default('Global'), // 'Global' | 'Sylhet' | 'Dhaka' | 'Chittagong' | 'London'
  placements: jsonb('placements').$type<string[]>().default(['footer']), // 'header', 'footer', 'widget', 'contact', 'counsellor_card'
  displayOrder: integer('display_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. COMMUNICATION & VIDEO INTEGRATION SETTINGS
export const communicationIntegrations = pgTable('communication_integrations', {
  id: serial('id').primaryKey(),
  providerKey: text('provider_key').notNull().unique(), // 'zoom' | 'google-meet' | 'teams' | 'webex' | 'meta' | 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok' | 'whatsapp'
  providerType: text('provider_type').notNull(), // 'video' | 'social'
  name: text('name').notNull(),
  status: text('status').notNull().default('disconnected'), // 'connected' | 'disconnected' | 'testing' | 'error'
  config: jsonb('config').default({}), // api keys, client id, tokens, webhook urls (redacted / securely stored)
  webhookActive: boolean('webhook_active').notNull().default(false),
  lastTestedAt: timestamp('last_tested_at'),
  testStatusMessage: text('test_status_message'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. COMMUNICATIONS ACTIVITY LOGS
export const communicationLogs = pgTable('communication_logs', {
  id: serial('id').primaryKey(),
  actionType: text('action_type').notNull(), // 'POST_SCHEDULED', 'POST_PUBLISHED', 'MEETING_SCHEDULED', 'INTEGRATION_UPDATED', 'AI_CONTENT_GENERATED', etc.
  category: text('category').notNull(), // 'social_post' | 'video_conference' | 'account_management' | 'integration' | 'ai_assistant'
  entityId: text('entity_id'),
  entityTitle: text('entity_title'),
  userEmail: text('user_email').notNull().default('admin@coseducation.com'),
  userName: text('user_name').notNull().default('COS Administrator'),
  status: text('status').notNull().default('Success'), // 'Success' | 'Warning' | 'Failed' | 'Info'
  details: jsonb('details').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

