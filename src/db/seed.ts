import { db } from './index.ts';
import * as schema from './schema.ts';
import { eq } from 'drizzle-orm';
import { DESTINATIONS, UNIVERSITIES, PROGRAMS, SCHOLARSHIPS, SUCCESS_STORIES, BLOG_POSTS, FAQS } from '../data/mockData.ts';

export async function seedDatabase() {
  try {
    console.log('🌱 Checking and seeding PostgreSQL database...');

    // 1. Users
    const existingUsers = await db.select().from(schema.users);
    let userList = existingUsers;
    if (existingUsers.length === 0) {
      const defaultUsers = [
        {
          uid: 'admin-faiyan-001',
          email: 'faiyanchowdhury.official@gmail.com',
          name: 'Faiyan Chowdhury',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1712 345678',
          active: true,
        },
        {
          uid: 'admin-cos-002',
          email: 'admin@coseducation.com',
          name: 'COS Admin Desk',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1711 000000',
          active: true,
        },
        {
          uid: 'counsellor-uk-003',
          email: 'counsellor.uk@coseducation.com',
          name: 'Tanvir Ahmed',
          role: 'counsellor',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1712 111222',
          active: true,
        },
        {
          uid: 'counsellor-nordic-004',
          email: 'counsellor.finland@coseducation.com',
          name: 'Nusrat Jahan',
          role: 'counsellor',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1712 333444',
          active: true,
        },
        {
          uid: 'counsellor-usa-005',
          email: 'counsellor.usa@coseducation.com',
          name: 'Kazi Momin',
          role: 'counsellor',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
          phone: '+880 1712 555666',
          active: true,
        },
      ];
      userList = await db.insert(schema.users).values(defaultUsers).returning();
    }

    // 2. Counsellors
    let counsellorList = await db.select().from(schema.counsellors);
    if (counsellorList.length === 0) {
      const counsellorData = [
        {
          userId: userList[2]?.id || null,
          name: 'Tanvir Ahmed',
          email: 'counsellor.uk@coseducation.com',
          phone: '+880 1712 111222',
          role: 'Senior UK Admissions Counsellor',
          experience: '8+ years advising for Russell Group & modern UK institutions',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          specialties: ['UK Higher Education', 'MOI Waivers', 'CAS Clearance', 'Graduate Route'],
          active: true,
        },
        {
          userId: userList[3]?.id || null,
          name: 'Nusrat Jahan',
          email: 'counsellor.finland@coseducation.com',
          phone: '+880 1712 333444',
          role: 'Nordic & European Union Advisor',
          experience: '6+ years in Joint Application Finland & European residence permits',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          specialties: ['Finland UAS & Research Universities', 'Post-Study Permanent Residence', 'Malta & Greece'],
          active: true,
        },
        {
          userId: userList[4]?.id || null,
          name: 'Kazi Momin',
          email: 'counsellor.usa@coseducation.com',
          phone: '+880 1712 555666',
          role: 'USA & STEM Degree Strategist',
          experience: '7+ years guiding F-1 visa interviews and scholarship portfolios',
          photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
          specialties: ['USA F-1 Visa', 'STEM OPT Extension', 'Merit Fellowships'],
          active: true,
        },
      ];
      counsellorList = await db.insert(schema.counsellors).values(counsellorData).returning();
    }

    // 3. Destinations
    const existingDests = await db.select().from(schema.destinations).limit(1);
    if (existingDests.length === 0) {
      const destValues = DESTINATIONS.map((d) => ({
        slug: d.slug,
        name: d.name,
        code: d.code,
        flag: d.flag,
        coverImage: d.coverImage,
        heroSubtitle: d.heroSubtitle,
        shortDescription: d.shortDescription,
        overview: d.overview,
        tuitionRange: d.tuitionRange,
        livingCost: d.livingCost,
        currency: d.currency,
        workRights: d.workRights,
        postStudyWork: d.postStudyWork,
        scholarshipInfo: d.scholarshipInfo,
        popularPrograms: d.popularPrograms,
        whyStudyHere: d.whyStudyHere,
        entryRequirements: d.entryRequirements,
        englishRequirements: d.englishRequirements,
        faqs: d.faqs,
      }));
      await db.insert(schema.destinations).values(destValues);
    }

    // 4. Universities
    let uniList = await db.select().from(schema.universities);
    if (uniList.length === 0) {
      const uniValues = UNIVERSITIES.map((u) => ({
        slug: u.slug,
        name: u.name,
        country: u.country,
        countrySlug: u.countrySlug,
        city: u.city,
        logo: u.logo,
        coverImage: u.coverImage,
        ranking: u.ranking,
        type: u.type,
        tuitionRange: u.tuitionRange,
        applicationFee: u.applicationFee,
        scholarshipsAvailable: u.scholarshipsAvailable,
        englishRequirements: u.englishRequirements,
        intakes: u.intakes,
        programsCount: u.programsCount,
        overview: u.overview,
        entryRequirements: u.entryRequirements,
        applicationDeadline: u.applicationDeadline,
        website: u.website,
        featured: u.featured,
        keyHighlights: u.keyHighlights,
      }));
      uniList = await db.insert(schema.universities).values(uniValues).returning();
    }

    // 5. Programs
    const existingProgs = await db.select().from(schema.programs).limit(1);
    if (existingProgs.length === 0) {
      const progValues = PROGRAMS.map((p) => {
        const matchUni = uniList.find((u) => u.name === p.universityName || u.slug === p.universitySlug);
        return {
          slug: p.slug,
          name: p.name,
          universityId: matchUni?.id || null,
          universityName: p.universityName || matchUni?.name || 'Network University',
          universitySlug: p.universitySlug,
          country: p.country,
          countrySlug: p.countrySlug,
          degree: p.degree,
          discipline: p.discipline,
          duration: p.duration,
          tuition: p.tuition,
          intakes: p.intakes,
          englishRequirement: p.englishRequirement,
          entryRequirements: p.entryRequirements,
          scholarshipAvailable: p.scholarshipAvailable,
          scholarshipDetails: p.scholarshipDetails,
          overview: p.overview,
          careerOutcomes: p.careerOutcomes,
          applicationDeadline: (p as any).applicationDeadline || 'Rolling Admissions',
        };
      });
      await db.insert(schema.programs).values(progValues);
    }

    // 6. Scholarships
    const existingSch = await db.select().from(schema.scholarships).limit(1);
    if (existingSch.length === 0) {
      const schValues = SCHOLARSHIPS.map((s) => ({
        title: s.title,
        country: s.country,
        university: s.university,
        amount: s.amount,
        coverageType: s.coverageType,
        degreeLevel: s.degreeLevel,
        deadline: s.deadline,
        criteria: s.criteria,
        description: s.description,
        linkText: s.linkText,
      }));
      await db.insert(schema.scholarships).values(schValues);
    }

    // 7. Success Stories
    const existingStories = await db.select().from(schema.successStories).limit(1);
    if (existingStories.length === 0) {
      const storyValues = SUCCESS_STORIES.map((s) => ({
        studentName: s.studentName,
        photo: s.photo,
        destination: s.destination,
        countryCode: s.countryCode,
        university: s.university,
        program: s.program,
        intake: s.intake,
        visaStatus: s.visaStatus,
        scholarshipAwarded: s.scholarshipAwarded,
        quote: s.quote,
        fullStory: s.fullStory,
        hometown: s.hometown,
        featured: (s as any).featured ?? true,
      }));
      await db.insert(schema.successStories).values(storyValues);
    }

    // 8. Blog Posts
    const existingBlog = await db.select().from(schema.blogPosts).limit(1);
    if (existingBlog.length === 0) {
      const postValues = BLOG_POSTS.map((b) => ({
        slug: b.slug,
        title: b.title,
        category: b.category,
        authorName: b.author.name,
        authorRole: b.author.role,
        authorAvatar: b.author.avatar,
        date: b.date,
        readTime: b.readTime,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        tags: b.tags,
        seoTitle: b.title + ' | COS Education Guide',
        seoDescription: b.excerpt,
        published: true,
      }));
      await db.insert(schema.blogPosts).values(postValues);
    }

    // 9. Events
    const existingEvents = await db.select().from(schema.events).limit(1);
    if (existingEvents.length === 0) {
      const defaultEvents = [
        {
          title: 'UK University Spot Assessment & On-the-Spot Offer Session',
          type: 'Spot Assessment',
          date: '2026-10-15',
          time: '11:00 AM - 04:00 PM BST',
          location: 'COS Education Head Office, Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh',
          isOnline: false,
          speaker: 'International Delegates from University of Sunderland & Ulster University',
          description: 'Meet official university admissions representatives in person. Bring your academic mark sheets and certificates for direct evaluation, fee waivers, and CAS guideline briefings.',
          seatsRemaining: 18,
        },
        {
          title: 'Finland Joint Application 2027: Free Strategy & UAS Exam Webinar',
          type: 'Webinar',
          date: '2026-10-22',
          time: '07:30 PM - 09:00 PM BST',
          location: 'Google Meet / Zoom Live Session',
          isOnline: true,
          speaker: 'Nusrat Jahan (Senior Nordic Advisor, COS Education)',
          description: 'Comprehensive walkthrough of Studyinfo.fi portal, selecting the 6 study choices, preparing for the International UAS Examination, and understanding post-study 2-year job search permits.',
          seatsRemaining: 45,
        },
        {
          title: 'USA F-1 Visa Credibility & DS-160 Preparation Workshop',
          type: 'Workshop',
          date: '2026-11-05',
          time: '03:00 PM - 05:30 PM BST',
          location: 'COS Education Seminar Hall, Sylhet & Virtual Stream',
          isOnline: false,
          speaker: 'Kazi Momin & Former US Embassy Visa Prep Counsel',
          description: 'Learn how to construct genuine academic ties, present parental sponsorship funds lawfully, avoid common visa refusal triggers, and excel in the consular interview.',
          seatsRemaining: 22,
        },
      ];
      await db.insert(schema.events).values(defaultEvents);
    }

    // 10. FAQs
    const existingFaqs = await db.select().from(schema.faqs).limit(1);
    if (existingFaqs.length === 0) {
      const faqValues = FAQS.map((f, idx) => ({
        question: f.question,
        answer: f.answer,
        category: f.category,
        order: idx + 1,
      }));
      await db.insert(schema.faqs).values(faqValues);
    }

    // 11. Settings
    const existingSettings = await db.select().from(schema.settings).limit(1);
    if (existingSettings.length === 0) {
      const defaultSettings = [
        {
          key: 'general',
          value: {
            companyName: 'COS Education',
            slogan: 'Your Journey to Global Education Starts Here',
            phone: '+880 1572 231717',
            email: 'info@cos-education.com',
            whatsapp: '+880 1572 231717',
            website: 'https://cos-education.com',
            domain: 'cos-education.com',
            address: 'Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh',
            businessHours: 'Saturday - Thursday: 10:00 AM – 6:30 PM (Friday Closed)',
            facebook: 'https://facebook.com/coseducation',
            instagram: 'https://instagram.com/coseducation',
            linkedin: 'https://linkedin.com/company/coseducation',
            youtube: 'https://youtube.com/@coseducation',
          },
        },
        {
          key: 'homepageStats',
          value: [
            { label: 'Students Guided', value: '500+', subtext: 'From Sylhet & nationwide' },
            { label: 'University Partners', value: '50+', subtext: 'Direct accredited institutions' },
            { label: 'Study Destinations', value: '10+', subtext: 'UK, EU, USA, Asia' },
            { label: 'Application Success', value: '95%+', subtext: 'End-to-end admissions & visas' },
          ],
        },
        {
          key: 'ctaContent',
          value: {
            primaryCtaText: 'Book a Free Consultation',
            secondaryCtaText: 'Check Your Eligibility',
            heroHeadline: 'Your Journey to Global Education Starts Here.',
            heroDescription: 'Explore world-class universities, discover the right program, and get expert support throughout your journey from application to visa.',
          },
        },
      ];
      for (const s of defaultSettings) {
        await db.insert(schema.settings).values(s);
      }
    }

    // 12. Leads
    let leadList = await db.select().from(schema.leads);
    if (leadList.length === 0) {
      const c1 = counsellorList[0]?.id || null;
      const c2 = counsellorList[1]?.id || null;
      const c3 = counsellorList[2]?.id || null;

      const sampleLeads = [
        {
          name: 'Rayhan Ahmed Chowdhury',
          phone: '+880 1712 998877',
          email: 'rayhan.ahmed.syl@gmail.com',
          country: 'United Kingdom',
          program: 'MSc International Business Management',
          academicQualification: 'BBA (Leading University, Sylhet)',
          cgpa: '3.35',
          ielts: '6.5',
          budget: '£14,000 - £16,000 / year',
          intake: 'January 2027',
          source: 'Website Consultation',
          assignedCounsellorId: c1,
          assignedCounsellorName: counsellorList[0]?.name || 'Tanvir Ahmed',
          status: 'Offer Received',
          notes: 'Conditional offer received from Ulster University. Pending bank statement 28-day holding verification.',
          followUpDate: '2026-09-25',
        },
        {
          name: 'Tahmina Akther',
          phone: '+880 1823 445566',
          email: 'tahmina.akther.ee@gmail.com',
          country: 'Finland',
          program: 'Bachelor of Engineering in Information Technology',
          academicQualification: 'HSC Science (Sylhet Govt. Women\'s College)',
          cgpa: '4.80 / 5.00',
          ielts: '6.0',
          budget: '€8,000 - €10,000 / year',
          intake: 'August 2027',
          source: 'Eligibility Checker',
          assignedCounsellorId: c2,
          assignedCounsellorName: counsellorList[1]?.name || 'Nusrat Jahan',
          status: 'Counselling',
          notes: 'Targeting Vaasa UAS and Metropolia Joint Application. Scheduled UAS mock test session.',
          followUpDate: '2026-09-28',
        },
        {
          name: 'Mahbubul Hasan',
          phone: '+880 1911 334455',
          email: 'm.hasan.ds@gmail.com',
          country: 'United States',
          program: 'MS in Computer Science & AI',
          academicQualification: 'BSc in CSE (SUST)',
          cgpa: '3.62',
          ielts: '7.5 (TOEFL 102)',
          budget: '$22,000 / year',
          intake: 'Fall 2027',
          source: 'Website Inquiry',
          assignedCounsellorId: c3,
          assignedCounsellorName: counsellorList[2]?.name || 'Kazi Momin',
          status: 'Application Started',
          notes: 'Drafting SOP. Applying for Graduate Assistantship waiver at university network institutions.',
          followUpDate: '2026-10-02',
        },
        {
          name: 'Farhana Yeasmin',
          phone: '+880 1678 123456',
          email: 'farhana.y@gmail.com',
          country: 'United Kingdom',
          program: 'MSc Public Health',
          academicQualification: 'MBBS (Sylhet MAG Osmani Medical College)',
          cgpa: 'Passed with Honors',
          ielts: '7.0',
          budget: '£15,000 / year',
          intake: 'May 2027',
          source: 'Walk-in',
          assignedCounsellorId: c1,
          assignedCounsellorName: counsellorList[0]?.name || 'Tanvir Ahmed',
          status: 'New Lead',
          notes: 'Inquired about UK healthcare master programs and dependent visa rules.',
          followUpDate: '2026-09-24',
        },
        {
          name: 'Shakil Anwar',
          phone: '+880 1755 889900',
          email: 'shakil.anwar.uk@gmail.com',
          country: 'United Kingdom',
          program: 'MBA Global Business',
          academicQualification: 'BBA (North East University)',
          cgpa: '3.15',
          ielts: 'MOI Waiver Eligible',
          budget: '£13,500 / year',
          intake: 'January 2027',
          source: 'WhatsApp',
          assignedCounsellorId: c1,
          assignedCounsellorName: counsellorList[0]?.name || 'Tanvir Ahmed',
          status: 'CAS/Enrollment',
          notes: 'Pre-CAS interview passed with flying colors! CAS statement issued today.',
          followUpDate: '2026-09-23',
        },
        {
          name: 'Nazmul Haque',
          phone: '+880 1788 443322',
          email: 'nazmul.h.fin@gmail.com',
          country: 'Finland',
          program: 'Master in International Business Management',
          academicQualification: 'BBA (Sylhet International University)',
          cgpa: '3.42',
          ielts: '6.5',
          budget: '€11,000 / year',
          intake: 'August 2027',
          source: 'Website Consultation',
          assignedCounsellorId: c2,
          assignedCounsellorName: counsellorList[1]?.name || 'Nusrat Jahan',
          status: 'Visa Applied',
          notes: 'Migri residence permit appointment booked at New Delhi VFS.',
          followUpDate: '2026-10-10',
        },
      ];

      leadList = await db.insert(schema.leads).values(sampleLeads).returning();

      for (const lead of leadList) {
        await db.insert(schema.leadHistory).values({
          leadId: lead.id,
          action: 'Lead Registered',
          previousStatus: null,
          newStatus: lead.status,
          notes: `Initial registration via ${lead.source}.`,
          performedBy: 'System',
        });
      }
    }

    // 13. Students
    let studentList = await db.select().from(schema.students);
    if (studentList.length === 0) {
      const sampleStudents = [
        {
          studentRef: 'COS-2026-001',
          fullName: 'Rayhan Ahmed Chowdhury',
          email: 'rayhan.ahmed.syl@gmail.com',
          phone: '+880 1712 998877',
          dateOfBirth: '1999-04-12',
          gender: 'Male',
          nationality: 'Bangladeshi',
          passportNumber: 'A04589211',
          address: 'House 42, Block D, Shahjalal Uposhahar, Sylhet',
          emergencyContact: 'Father: Mr. Nazir Ahmed (+880 1711 887766)',
          qualification: 'BBA in Marketing',
          cgpa: '3.35',
          passingYear: '2023',
          studyGap: '1.5 years (Family business management)',
          englishTest: 'IELTS Academic',
          englishScore: 'Overall 6.5 (L:7.0, R:6.5, W:6.0, S:6.5)',
          preferredDestinations: ['United Kingdom', 'Finland'],
          targetDegree: 'Master',
          budget: '£15,000 / year',
          assignedCounsellorId: counsellorList[0]?.id || null,
          status: 'Active',
          notes: 'Very communicative and highly organized with financial documentation.',
          archived: false,
        },
        {
          studentRef: 'COS-2026-002',
          fullName: 'Shakil Anwar',
          email: 'shakil.anwar.uk@gmail.com',
          phone: '+880 1755 889900',
          dateOfBirth: '1998-11-20',
          gender: 'Male',
          nationality: 'Bangladeshi',
          passportNumber: 'B08923412',
          address: 'Amberkhana Point, Sylhet Sadar',
          emergencyContact: 'Brother: Jamil Anwar (+880 1715 001122)',
          qualification: 'BBA in Accounting',
          cgpa: '3.15',
          passingYear: '2022',
          studyGap: '2 years (Senior Accounts Officer at Jamuna Bank)',
          englishTest: 'Medium of Instruction (MOI)',
          englishScore: 'MOI Certificate validated',
          preferredDestinations: ['United Kingdom'],
          targetDegree: 'Master (MBA)',
          budget: '£14,000 / year',
          assignedCounsellorId: counsellorList[0]?.id || null,
          status: 'Active',
          notes: 'CAS received. Visa application submission scheduled for next week.',
          archived: false,
        },
      ];
      studentList = await db.insert(schema.students).values(sampleStudents).returning();
    }

    // 14. Applications
    let appList = await db.select().from(schema.applications);
    if (appList.length === 0 && studentList.length > 0 && uniList.length > 0) {
      const allPrograms = await db.select().from(schema.programs);
      const prog1 = allPrograms[0];
      const prog2 = allPrograms[1] || allPrograms[0];

      const sampleApps = [
        {
          studentId: studentList[0].id,
          studentName: studentList[0].fullName,
          universityId: uniList[0]?.id || null,
          universityName: uniList[0]?.name || 'Ulster University',
          programId: prog1?.id || null,
          programName: prog1?.name || 'MSc International Business Management',
          country: 'United Kingdom',
          intake: 'January 2027',
          applicationDate: '2026-08-10',
          status: 'Conditional Offer',
          offerStatus: 'Conditional Offer Received',
          depositStatus: 'Pending',
          casStatus: 'Pending',
          visaStatus: 'Not Started',
          notes: 'Offer condition: Submit 28-day financial maturity certificate of BDT 28,00,000.',
          timeline: [
            { date: '2026-08-10', stage: 'Application Submitted', note: 'Portal submission with certified transcripts and SOP.', status: 'completed' as const },
            { date: '2026-08-28', stage: 'Conditional Offer Issued', note: 'Conditional offer letter received from university admissions.', status: 'completed' as const },
            { date: '2026-09-21', stage: 'Financial Audit & 28-day Rule', note: 'Parental bank holding under verification by COS admissions desk.', status: 'current' as const },
            { date: '2026-10-15', stage: 'Pre-CAS Interview & CAS Request', note: 'University video credibility check.', status: 'upcoming' as const },
            { date: '2026-11-01', stage: 'Visa Lodgement (VFS Sylhet)', note: 'Biometrics and document submission.', status: 'upcoming' as const },
          ],
        },
        {
          studentId: studentList[1]?.id || studentList[0].id,
          studentName: studentList[1]?.fullName || studentList[0].fullName,
          universityId: uniList[1]?.id || uniList[0].id,
          universityName: uniList[1]?.name || 'University of Sunderland',
          programId: prog2?.id || null,
          programName: prog2?.name || 'MBA Global Business Leadership',
          country: 'United Kingdom',
          intake: 'January 2027',
          applicationDate: '2026-07-15',
          status: 'CAS Issued',
          offerStatus: 'Unconditional Offer Received',
          depositStatus: '£4,000 Deposit Confirmed',
          casStatus: 'CAS Statement Issued',
          visaStatus: 'Preparing VFS Application',
          notes: 'CAS statement received: CAS-UU-982341. Health surcharge payment prepared.',
          timeline: [
            { date: '2026-07-15', stage: 'Application Submitted', note: 'Direct submission with MOI waiver.', status: 'completed' as const },
            { date: '2026-08-01', stage: 'Unconditional Offer Issued', note: 'Direct unconditional offer.', status: 'completed' as const },
            { date: '2026-08-20', stage: 'Tuition Deposit Paid', note: 'Bank transfer verified by university finance team.', status: 'completed' as const },
            { date: '2026-09-18', stage: 'CAS Issued', note: 'Official Home Office CAS confirmed.', status: 'completed' as const },
            { date: '2026-09-25', stage: 'Visa Lodgement', note: 'Appointment at VFS Global Sylhet.', status: 'upcoming' as const },
          ],
        },
      ];
      appList = await db.insert(schema.applications).values(sampleApps).returning();
    }

    // 15. Documents
    const existingDocs = await db.select().from(schema.documents).limit(1);
    if (existingDocs.length === 0 && studentList.length > 0) {
      const sampleDocs = [
        {
          studentId: studentList[0].id,
          applicationId: appList[0]?.id || null,
          title: 'Original Passport (Scan)',
          category: 'Passport',
          fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          status: 'Verified',
          verificationNotes: 'Validity verified until October 2031.',
          verifiedBy: 'Tanvir Ahmed',
        },
        {
          studentId: studentList[0].id,
          applicationId: appList[0]?.id || null,
          title: 'Bachelor Degree Certificate & Official Transcript',
          category: 'Transcript',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
          status: 'Verified',
          verificationNotes: 'CGPA 3.35 verified against university registrar seal.',
          verifiedBy: 'Tanvir Ahmed',
        },
        {
          studentId: studentList[0].id,
          applicationId: appList[0]?.id || null,
          title: 'IELTS Academic TRF (6.5)',
          category: 'English Test',
          fileUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
          status: 'Verified',
          verificationNotes: 'TRF verified on British Council portal.',
          verifiedBy: 'Tanvir Ahmed',
        },
        {
          studentId: studentList[0].id,
          applicationId: appList[0]?.id || null,
          title: 'Bank Statement & Solvency Letter (28-day rule)',
          category: 'Bank Documents',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
          status: 'Under Review',
          verificationNotes: 'Holding period at Day 22. Need final balance certificate on Day 29.',
          verifiedBy: null,
        },
      ];
      await db.insert(schema.documents).values(sampleDocs);
    }

    // 16. Appointments
    const existingAppts = await db.select().from(schema.appointments).limit(1);
    if (existingAppts.length === 0) {
      const sampleAppts = [
        {
          appointmentRef: 'APT-2026-0924',
          studentId: studentList[0]?.id || null,
          studentName: 'Rayhan Ahmed Chowdhury',
          studentEmail: 'rayhan.ahmed.syl@gmail.com',
          studentPhone: '+880 1712 998877',
          destination: 'United Kingdom',
          degree: 'Master',
          preferredDate: '2026-09-24',
          preferredTime: '11:00 AM - 12:00 PM',
          mode: 'In-person (Sylhet Office)',
          message: 'Review 28-day bank statement and practice for pre-CAS mock interview.',
          assignedCounsellorId: counsellorList[0]?.id || null,
          status: 'Confirmed',
        },
        {
          appointmentRef: 'APT-2026-0926',
          studentId: null,
          studentName: 'Tasnim Sultana',
          studentEmail: 'tasnim.sultana@gmail.com',
          studentPhone: '+880 1819 001122',
          destination: 'Finland',
          degree: 'Bachelor',
          preferredDate: '2026-09-26',
          preferredTime: '03:30 PM - 04:30 PM',
          mode: 'Online (Google Meet / Zoom)',
          message: 'Guidance on English requirements and joint application choice selection for UAS.',
          assignedCounsellorId: counsellorList[1]?.id || null,
          status: 'New',
        },
      ];
      await db.insert(schema.appointments).values(sampleAppts);
    }

    // 17. Audit Logs
    const existingLogs = await db.select().from(schema.auditLogs).limit(1);
    if (existingLogs.length === 0) {
      const sampleLogs = [
        {
          userId: 'admin-faiyan-001',
          userName: 'Faiyan Chowdhury',
          userEmail: 'faiyanchowdhury.official@gmail.com',
          action: 'System Initialized',
          entity: 'Settings',
          entityId: 'SYSTEM',
          details: { message: 'Cloud SQL database connected and initial tables provisioned successfully.' },
        },
        {
          userId: 'admin-faiyan-001',
          userName: 'Faiyan Chowdhury',
          userEmail: 'faiyanchowdhury.official@gmail.com',
          action: 'Lead created',
          entity: 'Lead',
          entityId: '1',
          details: { name: 'Rayhan Ahmed Chowdhury', country: 'United Kingdom' },
        },
        {
          userId: 'counsellor-uk-003',
          userName: 'Tanvir Ahmed',
          userEmail: 'counsellor.uk@coseducation.com',
          action: 'Document verified',
          entity: 'Document',
          entityId: '1',
          details: { title: 'Original Passport (Scan)', status: 'Verified' },
        },
        {
          userId: 'counsellor-uk-003',
          userName: 'Tanvir Ahmed',
          userEmail: 'counsellor.uk@coseducation.com',
          action: 'Application updated',
          entity: 'Application',
          entityId: '2',
          details: { student: 'Shakil Anwar', status: 'CAS Issued' },
        },
      ];
      await db.insert(schema.auditLogs).values(sampleLogs);
    }

    // 18. Phase 3: Ensure User Accounts for Students & Link Counsellors
    const allStudents = await db.select().from(schema.students);
    const allCounsellors = await db.select().from(schema.counsellors);
    
    // Ensure passwords and role mappings for counsellors
    for (const c of allCounsellors) {
      await db.update(schema.users)
        .set({
          counsellorId: c.id,
          password: 'password123',
          role: 'counsellor',
        })
        .where(eq(schema.users.email, c.email));
    }

    // Ensure password for admins
    await db.update(schema.users)
      .set({ password: 'password123' })
      .where(eq(schema.users.role, 'admin'));

    // Check student user accounts
    for (const s of allStudents) {
      const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, s.email)).limit(1);
      if (existingUser.length === 0) {
        await db.insert(schema.users).values({
          uid: `student-${s.studentRef.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          email: s.email,
          name: s.fullName,
          role: 'student',
          studentId: s.id,
          counsellorId: s.assignedCounsellorId,
          password: 'password123',
          phone: s.phone,
          avatar: (s as any).photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          active: true,
        });
      } else {
        await db.update(schema.users)
          .set({
            studentId: s.id,
            counsellorId: s.assignedCounsellorId,
            password: 'password123',
            role: 'student',
          })
          .where(eq(schema.users.id, existingUser[0].id));
      }
    }

    // 19. Phase 3: Tasks
    const existingTasks = await db.select().from(schema.tasks).limit(1);
    if (existingTasks.length === 0 && allStudents.length > 0 && allCounsellors.length > 0) {
      const sampleTasks = [
        {
          title: 'Verify 28-day financial balance certificate for Day 29 maturity',
          description: 'Review bank statement Day 29 holding letter and calculate GBP equivalent for tuition + maintenance (£9,207).',
          studentId: allStudents[0].id,
          studentName: allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          dueDate: '2026-09-28',
          priority: 'High',
          status: 'Pending',
        },
        {
          title: 'Schedule pre-CAS mock video interview',
          description: 'Conduct university compliance mock interview via Zoom covering Hertfordshire module selection and career pathway.',
          studentId: allStudents[0].id,
          studentName: allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          dueDate: '2026-09-25',
          priority: 'Urgent',
          status: 'In Progress',
        },
        {
          title: 'Review updated SOP draft with career transition rationale',
          description: 'Student submitted revised Statement of Purpose explaining transition from BSc CSE to MSc Artificial Intelligence.',
          studentId: allStudents[1] ? allStudents[1].id : allStudents[0].id,
          studentName: allStudents[1] ? allStudents[1].fullName : allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          dueDate: '2026-09-24',
          priority: 'Medium',
          status: 'Completed',
        },
        {
          title: 'Collect VFS appointment confirmation receipt & TB medical scan',
          description: 'Coordinate with student for IOM TB screening clearance report in Sylhet.',
          studentId: allStudents[1] ? allStudents[1].id : allStudents[0].id,
          studentName: allStudents[1] ? allStudents[1].fullName : allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          dueDate: '2026-09-30',
          priority: 'High',
          status: 'Pending',
        },
      ];
      await db.insert(schema.tasks).values(sampleTasks);
    }

    // 20. Phase 3: Follow-ups
    const existingFollowups = await db.select().from(schema.followups).limit(1);
    if (existingFollowups.length === 0 && allStudents.length > 0 && allCounsellors.length > 0) {
      const sampleFollowups = [
        {
          studentId: allStudents[0].id,
          studentName: allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          type: 'Call',
          scheduledDate: '2026-09-24',
          scheduledTime: '11:30 AM',
          notes: 'Check bank statement Day 25 balance and confirm mother sponsorship affidavit notarization.',
          status: 'Scheduled',
        },
        {
          studentId: allStudents[1] ? allStudents[1].id : allStudents[0].id,
          studentName: allStudents[1] ? allStudents[1].fullName : allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          type: 'WhatsApp',
          scheduledDate: '2026-09-23',
          scheduledTime: '02:00 PM',
          notes: 'Send checklist for VFS biometrics day in Sylhet and TB medical test lab address.',
          status: 'Scheduled',
        },
        {
          studentId: allStudents[0].id,
          studentName: allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          type: 'Application follow-up',
          scheduledDate: '2026-09-26',
          scheduledTime: '04:00 PM',
          notes: 'Follow up with Hertfordshire admissions office regarding unconditional offer release.',
          status: 'Scheduled',
        },
        {
          studentId: allStudents[0].id,
          studentName: allStudents[0].fullName,
          counsellorId: allCounsellors[0].id,
          counsellorName: allCounsellors[0].name,
          type: 'Document follow-up',
          scheduledDate: '2026-09-22',
          scheduledTime: '05:00 PM',
          notes: 'Reminder to obtain official passing certificate from college registrar.',
          status: 'Completed',
        },
      ];
      await db.insert(schema.followups).values(sampleFollowups);
    }

    // 21. Phase 3: Messages
    const existingMessages = await db.select().from(schema.messages).limit(1);
    if (existingMessages.length === 0 && allStudents.length > 0 && allCounsellors.length > 0) {
      const sampleMessages = [
        {
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          senderRole: 'counsellor',
          senderName: allCounsellors[0].name,
          senderAvatar: allCounsellors[0].photo,
          content: 'Assalamu Alaikum Rayhan. Congratulations on receiving your conditional offer from the University of Hertfordshire! We need to verify your 28-day bank balance before submitting your CAS request.',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 48),
        },
        {
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          senderRole: 'student',
          senderName: allStudents[0].fullName,
          senderAvatar: (allStudents[0] as any).photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          content: 'Walaikum Assalam Sir! Thank you so much for guiding me through the application. I have uploaded the Day 22 bank statement on the portal. My father holds the funds in Dutch-Bangla Bank Zindabazar branch.',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 36),
        },
        {
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          senderRole: 'counsellor',
          senderName: allCounsellors[0].name,
          senderAvatar: allCounsellors[0].photo,
          content: 'Excellent! I inspected the statement. The balance of BDT 28,50,000 looks solid. Please keep the funds untouched until Day 29, then download the final balance certificate. Let\'s meet on Thursday at our Sylhet office.',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 20),
        },
        {
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          senderRole: 'student',
          senderName: allStudents[0].fullName,
          senderAvatar: (allStudents[0] as any).photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          content: 'Understood Sir. I will collect the final certificate on Thursday morning and bring the original documents to the office. Thank you!',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
      ];
      await db.insert(schema.messages).values(sampleMessages);
    }

    // 22. Phase 3: Notifications
    const existingNotifs = await db.select().from(schema.notifications).limit(1);
    if (existingNotifs.length === 0 && allStudents.length > 0 && allCounsellors.length > 0) {
      const sampleNotifs = [
        {
          recipientRole: 'student',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'Conditional Offer Received!',
          message: 'University of Hertfordshire issued your conditional offer for MSc Computer Science. Check your portal for condition checklist.',
          type: 'offer',
          link: '/student-portal?tab=applications',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 24),
        },
        {
          recipientRole: 'student',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'Document Verified: IELTS Academic TRF',
          message: 'Your English language TRF (6.5 Overall) has been verified by your counsellor Tanvir Ahmed.',
          type: 'document',
          link: '/student-portal?tab=documents',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 48),
        },
        {
          recipientRole: 'student',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'Upcoming Appointment Confirmed',
          message: 'In-person consultation at COS Sylhet Head Office confirmed for Thursday, Sep 24 at 11:00 AM.',
          type: 'appointment',
          link: '/student-portal?tab=appointments',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 12),
        },
        {
          recipientRole: 'student',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'Action Required: Day 29 Bank Solvency Certificate',
          message: 'Please upload the final 28-day holding certificate by Sep 28 for prompt CAS processing.',
          type: 'deadline',
          link: '/student-portal?tab=documents',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
        // Counsellor notifications
        {
          recipientRole: 'counsellor',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'New Document Uploaded',
          message: 'Rayhan Ahmed Chowdhury uploaded "Bank Statement Day 22" for your review.',
          type: 'document',
          link: '/counsellor?tab=documents',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 18),
        },
        {
          recipientRole: 'counsellor',
          studentId: allStudents[1] ? allStudents[1].id : allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'CAS Issued for Student',
          message: 'Coventry University CAS reference generated for Shakil Anwar. Ready for visa lodgement.',
          type: 'application',
          link: '/counsellor?tab=applications',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 30),
        },
        {
          recipientRole: 'counsellor',
          studentId: allStudents[0].id,
          counsellorId: allCounsellors[0].id,
          title: 'Upcoming Consultation Session',
          message: 'In-person meeting with Rayhan Ahmed Chowdhury scheduled for Sep 24 at 11:00 AM.',
          type: 'appointment',
          link: '/counsellor?tab=appointments',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 6),
        },
      ];
      await db.insert(schema.notifications).values(sampleNotifs);
    }

    console.log('✅ PostgreSQL database seeding completed successfully!');
  } catch (err) {
    console.error('Database seed failed:', err);
  }
}
