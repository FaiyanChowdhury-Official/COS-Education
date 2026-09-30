export interface Destination {
  slug: string;
  name: string;
  code: string;
  flag: string;
  coverImage: string;
  heroSubtitle: string;
  overview: string;
  shortDescription: string;
  whyStudyHere: {
    title: string;
    description: string;
  }[];
  popularPrograms: string[];
  tuitionRange: string;
  livingCost: string;
  currency: string;
  workRights: string;
  postStudyWork: string;
  entryRequirements: {
    undergraduate: string;
    postgraduate: string;
  };
  englishRequirements: {
    ielts: string;
    pte?: string;
    duolingo?: string;
    waiverPossible: boolean;
    waiverNote?: string;
  };
  popularUniversities: {
    name: string;
    slug: string;
    ranking?: string;
  }[];
  scholarshipInfo: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface University {
  id: string;
  slug: string;
  name: string;
  country: string;
  countrySlug: string;
  city: string;
  logo: string;
  coverImage: string;
  ranking: string;
  type: 'Public' | 'Private';
  tuitionRange: string;
  applicationFee: string;
  scholarshipsAvailable: string;
  englishRequirements: string;
  intakes: string[];
  programsCount: number;
  overview: string;
  entryRequirements: string;
  applicationDeadline: string;
  website: string;
  featured?: boolean;
  keyHighlights: string[];
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  universityId: string;
  universityName: string;
  universitySlug: string;
  country: string;
  countrySlug: string;
  degree: 'Bachelor' | 'Master' | 'Diploma' | 'PhD';
  discipline: string;
  duration: string;
  tuition: string;
  intakes: string[];
  englishRequirement: string;
  entryRequirements: string;
  scholarshipAvailable: boolean;
  scholarshipDetails?: string;
  overview: string;
  careerOutcomes: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  keyBenefits: string[];
  processSteps: string[];
  faqs: { question: string; answer: string }[];
}

export interface Scholarship {
  id: string;
  title: string;
  country: string;
  university?: string;
  amount: string;
  coverageType: 'Full Tuition' | 'Partial Tuition' | 'Living Allowance' | 'Travel Grant';
  degreeLevel: ('Bachelor' | 'Master' | 'PhD')[];
  deadline: string;
  criteria: string;
  description: string;
  linkText?: string;
}

export interface SuccessStory {
  id: string;
  studentName: string;
  photo: string;
  destination: string;
  countryCode: string;
  university: string;
  program: string;
  intake: string;
  visaStatus: 'Visa Approved' | 'Enrolled' | 'Scholarship Recipient';
  scholarshipAwarded?: string;
  quote: string;
  fullStory: string;
  hometown: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Study Abroad' | 'UK' | 'Finland' | 'USA' | 'Scholarships' | 'Visa' | 'IELTS' | 'University Updates' | 'Application Tips' | 'Student Life';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  tags: string[];
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Education Fair' | 'University Webinar' | 'Counselling Session' | 'IELTS Session' | 'Visa Seminar' | 'Scholarship Seminar';
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  speaker: string;
  description: string;
  seatsRemaining: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Admissions' | 'Visas' | 'Scholarships & Finance' | 'IELTS & English' | 'Student Life';
}

export interface EligibilitySubmission {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  academicQualification: string;
  cgpa: string;
  graduationYear: string;
  studyGap: string;
  englishTest: string;
  englishScore: string;
  preferredCountry: string;
  preferredDegree: string;
  budget: string;
  intake: string;
  workExperience: string;
}

export interface ConsultationBooking {
  id: string;
  timestamp: string;
  appointmentRef: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  degree: string;
  intake: string;
  preferredDate: string;
  preferredTime: string;
  mode: 'In-person (Sylhet Office)' | 'Online (Google Meet / Zoom)';
  message: string;
  status: 'Pending Confirmation' | 'Confirmed';
}
