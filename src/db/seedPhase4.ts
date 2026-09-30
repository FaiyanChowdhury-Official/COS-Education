import { db } from './index.ts';
import * as schema from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedPhase4Data() {
  console.log('Seeding Phase 4 Automation Rules, Email Templates, and Lead Scores...');

  // 1. Email Templates
  const defaultTemplates = [
    {
      code: 'welcome',
      name: 'Student Portal Welcome',
      subject: 'Welcome to COS Education Portal — Your Study Abroad Journey Starts Here',
      category: 'Onboarding',
      availableVariables: ['student_name', 'portal_url', 'counsellor_name', 'counsellor_phone'],
      bodyText: `Dear {{student_name}},

Welcome to the COS Education Student Portal!

We are thrilled to partner with you on your higher education journey. Your dedicated counsellor is {{counsellor_name}} (Direct Phone: {{counsellor_phone}}).

You can log in to your personal portal at {{portal_url}} to track your university applications in real time, upload academic documents, book counselling appointments, and receive scholarship alerts.

Warm regards,
Admissions Team
COS Education (Community for Overseas Study)
Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #2563eb; margin: 0;">COS EDUCATION</h2>
    <p style="font-size: 12px; color: #64748b; margin: 4px 0 0;">Community for Overseas Study</p>
  </div>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>Welcome to the <strong>COS Education Student Portal</strong>! We are dedicated to making your global university journey smooth, transparent, and successful.</p>
  <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0;">
    <p style="margin: 0; font-size: 14px;"><strong>Your Assigned Senior Counsellor:</strong> {{counsellor_name}}<br/><strong>Direct Phone:</strong> {{counsellor_phone}}</p>
  </div>
  <p>Log in to track applications, upload documents, and check offer letters:</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{portal_url}}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Access Student Portal</a>
  </div>
  <p style="font-size: 13px; color: #64748b;">COS Education • Chowhatta Point, Sylhet, Bangladesh</p>
</div>`,
    },
    {
      code: 'lead_confirmation',
      name: 'Lead Consultation Request Received',
      subject: 'Thank you for contacting COS Education — Your Free Counselling Confirmation',
      category: 'Consultation',
      availableVariables: ['lead_name', 'destination', 'preferred_intake', 'counsellor_name'],
      bodyText: `Dear {{lead_name}},

Thank you for requesting an educational consultation with COS Education regarding studies in {{destination}} for the {{preferred_intake}} intake.

Our senior admissions officer, {{counsellor_name}}, has received your academic details and will reach out to you via WhatsApp or phone within 24 business hours to evaluate your eligible universities and scholarships.

If you have urgent questions, visit our Sylhet office at Manru Shopping City (Lift-03, Floor-04), Chowhatta Point, or call +880 1572 231717.

Sincerely,
COS Education Team`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #2563eb;">Consultation Request Received</h3>
  <p>Dear <strong>{{lead_name}}</strong>,</p>
  <p>Thank you for submitting your study abroad interest for <strong>{{destination}}</strong> (Intake: {{preferred_intake}}).</p>
  <p>Your lead has been assigned to <strong>{{counsellor_name}}</strong>, who will contact you with matched university options and scholarship advice.</p>
</div>`,
    },
    {
      code: 'appointment_confirmation',
      name: 'Appointment Scheduled Confirmation',
      subject: 'Confirmed: 1-on-1 Counselling Appointment on {{appointment_date}} with {{counsellor_name}}',
      category: 'Appointments',
      availableVariables: ['student_name', 'appointment_date', 'appointment_time', 'meeting_type', 'counsellor_name', 'location_or_link'],
      bodyText: `Dear {{student_name}},

Your 1-on-1 study abroad counselling appointment has been confirmed!

- Date: {{appointment_date}}
- Time: {{appointment_time}}
- Session Type: {{meeting_type}}
- Counsellor: {{counsellor_name}}
- Venue / Link: {{location_or_link}}

Please bring your academic transcripts, certificates, passport copy, and IELTS/English test scores for a comprehensive assessment.

Best regards,
COS Education Admissions Desk`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #16a34a;">Appointment Confirmed!</h3>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>Your appointment is locked in with <strong>{{counsellor_name}}</strong>.</p>
  <ul>
    <li><strong>Date & Time:</strong> {{appointment_date}} at {{appointment_time}}</li>
    <li><strong>Type:</strong> {{meeting_type}}</li>
    <li><strong>Venue/Details:</strong> {{location_or_link}}</li>
  </ul>
</div>`,
    },
    {
      code: 'document_verification',
      name: 'Document Status Notification',
      subject: 'Document Update: {{document_title}} is now {{document_status}}',
      category: 'Documents',
      availableVariables: ['student_name', 'document_title', 'document_status', 'counsellor_remarks', 'portal_url'],
      bodyText: `Dear {{student_name}},

Your submitted document "{{document_title}}" has been reviewed by your counsellor.

Status: {{document_status}}
Counsellor Remarks: {{counsellor_remarks}}

Please log in to your student portal at {{portal_url}} to review your document checklist.

Regards,
COS Compliance & Admissions Desk`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #2563eb;">Document Status Notification</h3>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>Document: <strong>{{document_title}}</strong></p>
  <p>Updated Status: <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{{document_status}}</span></p>
  <p>Remarks: {{counsellor_remarks}}</p>
  <p><a href="{{portal_url}}" style="color: #2563eb; font-weight: bold;">View Document in Portal</a></p>
</div>`,
    },
    {
      code: 'application_update',
      name: 'Application Progress Update',
      subject: 'Application Milestone: {{university_name}} - {{program_name}} ({{stage_name}})',
      category: 'Applications',
      availableVariables: ['student_name', 'university_name', 'program_name', 'stage_name', 'notes', 'portal_url'],
      bodyText: `Dear {{student_name}},

Great news! There is an update on your application for {{program_name}} at {{university_name}}.

Current Stage: {{stage_name}}
Notes: {{notes}}

Check your timeline and download official letters at {{portal_url}}.

Warm regards,
COS Application Processing Unit`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #2563eb;">Application Progress Update</h3>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>Your application for <strong>{{program_name}}</strong> at <strong>{{university_name}}</strong> has progressed to:</p>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; font-weight: bold; color: #15803d; margin: 12px 0;">
    {{stage_name}}
  </div>
  <p>{{notes}}</p>
  <a href="{{portal_url}}" style="color: #2563eb; font-weight: bold;">View Application Timeline</a>
</div>`,
    },
    {
      code: 'offer_notification',
      name: 'Offer Letter Received Alert',
      subject: 'Congratulations! Official Offer Received from {{university_name}}',
      category: 'Applications',
      availableVariables: ['student_name', 'university_name', 'program_name', 'offer_type', 'scholarship_amount', 'portal_url'],
      bodyText: `Dear {{student_name}},

Congratulations! We are delighted to inform you that {{university_name}} has issued an official {{offer_type}} offer letter for {{program_name}}!

Scholarship / Tuition Award: {{scholarship_amount}}

Please review the conditions with your counsellor to proceed with acceptance and tuition deposit.

Access your official offer letter at {{portal_url}}.

Cheers,
COS Education Team`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="text-align: center; margin-bottom: 16px;">
    <h2 style="color: #16a34a; margin: 0;">🎉 CONGRATULATIONS!</h2>
    <p style="color: #475569; font-size: 14px;">Offer Letter Received</p>
  </div>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>We are delighted to share that <strong>{{university_name}}</strong> has officially issued an offer for <strong>{{program_name}}</strong>.</p>
  <div style="background: #fefce8; border: 1px solid #fef08a; padding: 12px; border-radius: 6px; margin: 12px 0;">
    <p style="margin: 0;"><strong>Offer Type:</strong> {{offer_type}}<br/><strong>Scholarship Award:</strong> {{scholarship_amount}}</p>
  </div>
  <p><a href="{{portal_url}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View & Download Offer Letter</a></p>
</div>`,
    },
    {
      code: 'reminder',
      name: 'Intake Deadline / Task Reminder',
      subject: 'Reminder: Action Required for {{reminder_subject}}',
      category: 'Reminders',
      availableVariables: ['student_name', 'reminder_subject', 'due_date', 'action_needed', 'portal_url'],
      bodyText: `Dear {{student_name}},

This is a friendly reminder regarding {{reminder_subject}}.

Due Date: {{due_date}}
Action Required: {{action_needed}}

Meeting your university and visa deadlines ensures smooth CAS/visa issuance.

Log in to take action: {{portal_url}}

Regards,
COS Education Sylhet`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #eab308;">Action Reminder</h3>
  <p>Dear <strong>{{student_name}}</strong>,</p>
  <p>Please note an upcoming deadline for <strong>{{reminder_subject}}</strong>:</p>
  <p><strong>Due Date:</strong> {{due_date}}<br/><strong>Required Action:</strong> {{action_needed}}</p>
  <a href="{{portal_url}}" style="color: #2563eb; font-weight: bold;">Open Portal</a>
</div>`,
    },
    {
      code: 'password_reset',
      name: 'Password Reset Instruction',
      subject: 'Reset Your COS Education Portal Password',
      category: 'Security',
      availableVariables: ['user_name', 'reset_link', 'expiry_minutes'],
      bodyText: `Dear {{user_name}},

We received a request to reset your password for your COS Education Portal account.

Click the link below to set a new password:
{{reset_link}}

This link is valid for {{expiry_minutes}} minutes. If you did not request this, please ignore this email.

COS Education Security Team`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <h3 style="color: #2563eb;">Password Reset Request</h3>
  <p>Dear <strong>{{user_name}}</strong>,</p>
  <p>Use the secure button below to set a new password for your COS Education account:</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{reset_link}}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
  </div>
  <p style="font-size: 12px; color: #64748b;">This link will expire in {{expiry_minutes}} minutes. If you did not make this request, you can safely ignore this email.</p>
</div>`,
    },
  ];

  for (const tpl of defaultTemplates) {
    const existing = await db.select().from(schema.emailTemplates).where(eq(schema.emailTemplates.code, tpl.code)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.emailTemplates).values(tpl as any);
      console.log(`Inserted email template: ${tpl.code}`);
    }
  }

  // 2. Automation Rules
  const defaultRules = [
    {
      name: 'New Lead → Notify Assigned Counsellor',
      triggerEvent: 'new_lead',
      actionType: 'notify_counsellor',
      config: { channel: 'system_and_email', instantAlert: true },
      enabled: true,
      executionCount: 14,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      name: 'No Response for 3 Days → Create Follow-Up Task',
      triggerEvent: 'no_response_days',
      actionType: 'create_task',
      config: { days: 3, priority: 'High', taskTitle: 'Follow up inactive lead via WhatsApp' },
      enabled: true,
      executionCount: 8,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      name: 'Document Rejected → Notify Student Instantly',
      triggerEvent: 'doc_rejected',
      actionType: 'notify_student',
      config: { channel: 'portal_and_email', requireReupload: true },
      enabled: true,
      executionCount: 3,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 48),
    },
    {
      name: 'Appointment Tomorrow → Send 24h Reminder',
      triggerEvent: 'appointment_reminder',
      actionType: 'send_email',
      config: { hoursBefore: 24, sendSMS: true },
      enabled: true,
      executionCount: 19,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 12),
    },
    {
      name: 'Application Deadline Approaching → Notify Counsellor',
      triggerEvent: 'application_deadline',
      actionType: 'notify_counsellor',
      config: { daysBefore: 7, urgency: 'Urgent' },
      enabled: true,
      executionCount: 5,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 72),
    },
    {
      name: 'New Application Submitted → Notify Assigned Counsellor',
      triggerEvent: 'new_application',
      actionType: 'notify_counsellor',
      config: { autoAssignCounsellor: true, createChecklist: true },
      enabled: true,
      executionCount: 11,
      lastTriggeredAt: new Date(Date.now() - 3600000 * 8),
    },
  ];

  for (const rule of defaultRules) {
    const existing = await db.select().from(schema.automationRules).where(eq(schema.automationRules.name, rule.name)).limit(1);
    if (existing.length === 0) {
      await db.insert(schema.automationRules).values(rule as any);
      console.log(`Inserted automation rule: ${rule.name}`);
    }
  }

  // 3. Automation Execution Logs
  const sampleLogs = [
    {
      ruleName: 'New Lead → Notify Assigned Counsellor',
      triggerEvent: 'new_lead',
      targetName: 'Tanvir Ahmed Chowdhury',
      targetId: 1,
      actionTaken: 'Sent instant notification to Counsellor Nazmul Hasan with lead profile & WhatsApp link',
      status: 'Success',
      details: 'Score: 85 (Hot Lead), Preferred: UK Master of Data Science',
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      ruleName: 'Appointment Tomorrow → Send 24h Reminder',
      triggerEvent: 'appointment_reminder',
      targetName: 'Fatima Tuz Zohra',
      targetId: 2,
      actionTaken: 'Delivered appointment confirmation reminder for tomorrow at 2:30 PM (Manru Shopping City office)',
      status: 'Success',
      details: 'Sent via Email & Portal Alert',
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      ruleName: 'Document Rejected → Notify Student Instantly',
      triggerEvent: 'doc_rejected',
      targetName: 'Rayhan Uddin',
      targetId: 3,
      actionTaken: 'Flagged Passport Copy with reason: Missing signature page. Alerted student portal.',
      status: 'Success',
      details: 'Task created for student to re-upload high-resolution 300dpi scan',
      createdAt: new Date(Date.now() - 3600000 * 26),
    },
    {
      ruleName: 'New Application Submitted → Notify Assigned Counsellor',
      triggerEvent: 'new_application',
      targetName: 'Nusrat Jahan',
      targetId: 4,
      actionTaken: 'Notified Counsellor Sharmin Akter of Coventry University application submission',
      status: 'Success',
      details: 'Intake: September 2026, Degree: MSc International Business Management',
      createdAt: new Date(Date.now() - 3600000 * 30),
    },
  ];

  const existingLogs = await db.select().from(schema.automationLogs).limit(1);
  if (existingLogs.length === 0) {
    for (const log of sampleLogs) {
      await db.insert(schema.automationLogs).values(log as any);
    }
    console.log('Inserted sample automation execution logs');
  }

  // 4. Update Existing Leads with Lead Score & Marketing Attribution
  const allLeads = await db.select().from(schema.leads);
  const marketingSources = [
    { cat: 'Facebook', utm_s: 'facebook', utm_m: 'paid_social', utm_c: 'uk_intake_2026_sylhet' },
    { cat: 'Google', utm_s: 'google', utm_m: 'cpc', utm_c: 'study_in_uk_scholarships' },
    { cat: 'Website', utm_s: 'website', utm_m: 'organic', utm_c: 'direct_portal' },
    { cat: 'Instagram', utm_s: 'instagram', utm_m: 'social_story', utm_c: 'finland_scholarship_drive' },
    { cat: 'WhatsApp', utm_s: 'whatsapp', utm_m: 'chat_widget', utm_c: 'website_floating_cta' },
    { cat: 'Referral', utm_s: 'referral', utm_m: 'alumni', utm_c: 'student_ambassador' },
    { cat: 'YouTube', utm_s: 'youtube', utm_m: 'video_ad', utm_c: 'visa_success_story_series' },
    { cat: 'TikTok', utm_s: 'tiktok', utm_m: 'short_video', utm_c: 'ielts_waiver_universities' },
  ];

  for (let i = 0; i < allLeads.length; i++) {
    const l = allLeads[i];
    const sourceObj = marketingSources[i % marketingSources.length];

    // Compute Lead Score based on signals
    const signals: string[] = [];
    let score = 20; // Base score for reaching out
    signals.push('Inquiry Created (+20)');

    if (l.country) {
      score += 10;
      signals.push(`Preferred Destination: ${l.country} (+10)`);
    }
    if (l.academicQualification && l.cgpa) {
      score += 15;
      signals.push(`Academic Profile Provided (${l.academicQualification}, CGPA: ${l.cgpa}) (+15)`);
    }
    if (l.ielts) {
      score += 15;
      signals.push(`English Test / IELTS Recorded (${l.ielts}) (+15)`);
    }
    if (l.budget) {
      score += 15;
      signals.push(`Budget Threshold Stated (${l.budget}) (+15)`);
    }
    if (l.status === 'Application Started' || l.status === 'Applied' || l.status === 'Offer Received') {
      score += 30;
      signals.push(`Application Underway / Active Stage (+30)`);
    } else if (l.status === 'Counselling' || l.status === 'Contacted') {
      score += 15;
      signals.push(`Consultation Engaged (+15)`);
    }

    const clampedScore = Math.min(score, 100);

    await db.update(schema.leads)
      .set({
        leadScore: clampedScore,
        leadScoreSignals: signals,
        leadSourceCategory: sourceObj.cat,
        utmSource: sourceObj.utm_s,
        utmMedium: sourceObj.utm_m,
        utmCampaign: sourceObj.utm_c,
        utmContent: 'ad_banner_variant_a',
        utmTerm: 'study abroad sylhet',
      })
      .where(eq(schema.leads.id, l.id));
  }

  console.log(`Updated ${allLeads.length} leads with scores and marketing attribution.`);
}
