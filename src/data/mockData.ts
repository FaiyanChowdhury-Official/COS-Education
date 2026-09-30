import { Destination, University, Program, Service, Scholarship, SuccessStory, BlogPost, EventItem, FAQItem } from '../types';

export const COMPANY_INFO = {
  name: 'COS Education',
  tagline: 'Connecting Students with Global Education Opportunities',
  address: 'Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh',
  phone: '+880 1572 231717',
  whatsapp: '+880 1572 231717',
  whatsappFormatted: '8801572231717',
  email: 'info@cos-education.com',
  counselingEmail: 'info@cos-education.com',
  website: 'https://cos-education.com',
  domain: 'cos-education.com',
  hours: 'Saturday – Thursday: 10:00 AM – 7:00 PM (Friday Closed)',
  stats: [
    { label: 'Students Guided', value: '500+', sublabel: 'Across UK, Europe, USA & Asia' },
    { label: 'University Network', value: '50+', sublabel: 'Global accredited institutions' },
    { label: 'Study Destinations', value: '10+', sublabel: 'Top global student destinations' },
    { label: 'Application Success', value: '95%+', sublabel: 'High visa & admission approval' },
  ],
  social: {
    facebook: 'https://facebook.com/coseducation',
    instagram: 'https://instagram.com/coseducation',
    linkedin: 'https://linkedin.com/company/coseducation',
    youtube: 'https://youtube.com/@coseducation',
  }
};

export const DESTINATIONS: Destination[] = [
  {
    slug: 'uk',
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'Home to world-renowned universities, rich academic heritage, and a 2-year Graduate Route post-study work visa.',
    shortDescription: 'World-renowned institutions, 1-year master’s options, and a 2-year post-study Graduate Route visa.',
    overview: 'The United Kingdom offers world-class education recognized worldwide. With 1-year master’s programs and 3-year bachelor’s degrees, students save both time and living expenses while graduating from globally respected institutions.',
    whyStudyHere: [
      { title: 'Global Prestige', description: 'Degrees from UK universities are internationally accredited and celebrated by employers worldwide.' },
      { title: 'Shorter Durations', description: 'Complete a full Master’s in 1 year or a Bachelor’s in 3 years, significantly lowering tuition and living overhead.' },
      { title: 'Graduate Route (PSW)', description: 'Stay and work in the UK for up to 2 years post-study (3 years for PhD graduates) without needing immediate job sponsorship.' },
      { title: 'Part-Time Work Rights', description: 'International students on Tier 4 / Student Visa can work up to 20 hours per week during term time and full-time in holidays.' }
    ],
    popularPrograms: ['Computer Science & AI', 'Business Management & MBA', 'Data Analytics', 'Public Health', 'Law & LLM'],
    tuitionRange: '£13,000 – £24,000 / year',
    livingCost: '£9,207 (Outside London) / £12,006 (Inside London)',
    currency: 'GBP (£)',
    workRights: '20 hours/week during studies, full-time during vacations',
    postStudyWork: '2-year Graduate Route visa',
    entryRequirements: {
      undergraduate: 'HSC / A-Levels / Foundation with minimum 60% or equivalent',
      postgraduate: 'Bachelor’s degree with minimum CGPA 2.6 – 3.0 / 4.0'
    },
    englishRequirements: {
      ielts: '6.0 overall (min 5.5 in each band) for Bachelor; 6.5 overall for Master',
      pte: '59 overall (min 59 in each component)',
      waiverPossible: true,
      waiverNote: 'MOI (Medium of Instruction) or high HSC English marks accepted at select network universities'
    },
    popularUniversities: [
      { name: 'University of Hertfordshire', slug: 'university-of-hertfordshire', ranking: 'Top 600 Times Higher Education' },
      { name: 'Coventry University', slug: 'coventry-university', ranking: '5 Stars QS Stars' },
      { name: 'University of Greenwich', slug: 'university-of-greenwich', ranking: 'Top 500 Global' },
      { name: 'Queen Mary University of London', slug: 'queen-mary-university-of-london', ranking: 'Russell Group Member' }
    ],
    scholarshipInfo: 'University merit scholarships ranging from £1,500 to £5,000 automatic tuition discounts.',
    faqs: [
      { question: 'Can I study in the UK without IELTS?', answer: 'Yes, select universities accept English Medium of Instruction (MOI) certificates from recognized universities or higher scores in HSC English.' },
      { question: 'How much bank balance is required for a UK student visa?', answer: 'Tuition balance plus living expenses (£9,207 outside London or £12,006 inside London) held in an approved bank account for 28 consecutive days.' },
      { question: 'Can I bring my spouse/dependents?', answer: 'Under recent UK Home Office guidelines, dependents are permitted only on postgraduate research programs (PhD / Research Master’s) or government-sponsored courses.' }
    ]
  },
  {
    slug: 'finland',
    name: 'Finland',
    code: 'FI',
    flag: '🇫🇮',
    coverImage: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'Ranked the happiest country in the world with cutting-edge tech universities and generous tuition scholarships.',
    shortDescription: 'The world’s happiest country, unmatched quality of life, up to 100% scholarships, and a pathway to EU residency.',
    overview: 'Finland represents the pinnacle of educational innovation and societal well-being. Finnish universities offer world-class English-taught degrees with generous early-bird discounts and merit scholarships up to 100%.',
    whyStudyHere: [
      { title: 'Generous Scholarships', description: 'Most universities offer 20% to 100% tuition fee scholarships for international students based on entrance exams or academic merit.' },
      { title: '30 Hours/Week Work Right', description: 'Finland recently increased the allowed student work hours to 30 hours per week during term time.' },
      { title: '2-Year Post-Study Permit', description: 'Graduates receive a 2-year residence permit to seek employment or establish an enterprise in Finland.' },
      { title: 'Fast-Track Permanent Residence', description: 'Time spent studying in Finland counts toward the residence requirement for Finnish citizenship / PR.' }
    ],
    popularPrograms: ['Software Engineering & IoT', 'Clean Energy & Sustainability', 'International Business', 'Nursing & Healthcare', 'Game Development'],
    tuitionRange: '€8,000 – €14,000 / year (before scholarships)',
    livingCost: '€700 – €900 / month',
    currency: 'EUR (€)',
    workRights: '30 hours/week during academic semester',
    postStudyWork: '2-year job seeker residence permit',
    entryRequirements: {
      undergraduate: 'High School Diploma / HSC + Finnish UAS Entrance Exam or SAT',
      postgraduate: 'Relevant Bachelor’s degree + minimum 2 years work experience for UAS Master degrees'
    },
    englishRequirements: {
      ielts: '6.0 – 6.5 overall',
      pte: '58 overall',
      waiverPossible: true,
      waiverNote: 'Waiver eligible if previous degree was in English from recognized institution or via SAT/Entrance exam'
    },
    popularUniversities: [
      { name: 'LUT University', slug: 'lut-university', ranking: 'Top 300 Times Higher Education' },
      { name: 'Metropolia University of Applied Sciences', slug: 'metropolia-university', ranking: 'Largest UAS in Finland' },
      { name: 'Tampere University', slug: 'tampere-university', ranking: 'Top 350 QS World' }
    ],
    scholarshipInfo: 'Early-bird discounts (e.g., €1,500 - €2,000 off) plus 50% to 100% academic merit waivers available annually.',
    faqs: [
      { question: 'What is the Finnish Joint Application?', answer: 'The national application period occurs in January each year where students can apply for up to 6 degree programs with a single application.' },
      { question: 'Are spouses allowed to work full-time?', answer: 'Yes! Spouses of students in Finland receive a Type A residence permit with unrestricted right to work full-time.' }
    ]
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'Asia’s premier education hub offering UK and Australian dual degrees at a fraction of Western costs.',
    shortDescription: 'Affordable tuition, UK/Australian dual awards, fast-track visa processing, and a vibrant multicultural lifestyle.',
    overview: 'Malaysia is an affordable gateway to global qualifications. Students can earn genuine British or Australian degrees through 3+0 branch campuses and dual-award university programs in Kuala Lumpur.',
    whyStudyHere: [
      { title: 'Dual UK & Australian Degrees', description: 'Graduate with two certificates (e.g. from Lancaster University UK or Staffordshire alongside top Malaysian institutions).' },
      { title: 'Low Tuition & Living Costs', description: 'Average living cost is just $300-$500 per month, with high-standard condos and transport.' },
      { title: 'Smooth EMGS Visa Process', description: 'Direct government visa processing via EMGS with high visa grant rates for South Asian students.' },
      { title: 'No Study Gap Barriers', description: 'Flexible admission policies accommodating students with career transitions and study gaps.' }
    ],
    popularPrograms: ['Information Technology & Cyber Security', 'Business & Finance', 'Hospitality Management', 'Civil Engineering', 'Digital Marketing'],
    tuitionRange: '$4,000 – $9,000 / year',
    livingCost: '$350 – $550 / month',
    currency: 'MYR / USD ($)',
    workRights: 'Permitted during semester breaks in approved sectors (20 hours)',
    postStudyWork: 'Employment pass / Digital Nomad DE Rantau visa pathways',
    entryRequirements: {
      undergraduate: 'HSC / A-Level with minimum 50-60%',
      postgraduate: 'Bachelor’s degree with CGPA 2.50 or above'
    },
    englishRequirements: {
      ielts: '5.5 – 6.0 overall',
      waiverPossible: true,
      waiverNote: 'University English placement tests or intensive on-campus English modules available'
    },
    popularUniversities: [
      { name: 'Sunway University', slug: 'sunway-university', ranking: 'Top 600 QS World Ranking' },
      { name: 'Asia Pacific University (APU)', slug: 'asia-pacific-university', ranking: 'Premier Digital Tech Institution' },
      { name: 'Taylor’s University', slug: 'taylors-university', ranking: 'Top 300 QS World Ranking' }
    ],
    scholarshipInfo: 'High-achiever scholarships from 20% to 50% tuition reduction based on GPA/CGPA.',
    faqs: [
      { question: 'Is IELTS mandatory for Malaysia?', answer: 'While recommended, many universities offer their own English placement tests or allow university language center enrollment.' },
      { question: 'How long does the EMGS visa approval take?', answer: 'Usually 4 to 6 weeks for the electronic Visa Approval Letter (eVAL).' }
    ]
  },
  {
    slug: 'usa',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'The global benchmark for higher education, research innovation, and 3-year STEM OPT work authorization.',
    shortDescription: 'World-leading universities, unmatched research facilities, and up to 3 years of STEM OPT work authorization.',
    overview: 'The United States hosts the world’s most prestigious universities. With flexible academic curricula, cutting-edge laboratories, and Optional Practical Training (OPT) granting up to 36 months of employment for STEM graduates.',
    whyStudyHere: [
      { title: 'STEM OPT Extension', description: 'Work in the USA for up to 3 years after graduation on F-1 STEM-designated degree programs.' },
      { title: 'Generous Assistantships', description: 'Graduate Assistantships (GA, TA, RA) offering tuition waivers plus monthly stipends.' },
      { title: 'Curricular Flexibility', description: 'Double major, select interdisciplinary electives, or transfer credits seamlessly.' },
      { title: 'Campus Employment', description: 'Work up to 20 hours per week on-campus in university libraries, labs, and administrative offices.' }
    ],
    popularPrograms: ['Computer Science & Machine Learning', 'Data Science', 'Mechanical Engineering', 'Biomedical Sciences', 'Finance & MBA'],
    tuitionRange: '$16,000 – $38,000 / year',
    livingCost: '$10,000 – $16,000 / year',
    currency: 'USD ($)',
    workRights: '20 hours/week on-campus during semester',
    postStudyWork: '12 months OPT + 24 months STEM extension (3 years total)',
    entryRequirements: {
      undergraduate: 'High School / HSC with CGPA 3.0+; SAT optional at many universities',
      postgraduate: 'Bachelor’s degree with CGPA 2.8+; GRE/GMAT waived at many institutions'
    },
    englishRequirements: {
      ielts: '6.5 overall (min 6.0)',
      duolingo: '105 – 120+',
      pte: '58 – 65',
      waiverPossible: false
    },
    popularUniversities: [
      { name: 'University of South Florida', slug: 'university-of-south-florida', ranking: 'Top 100 US Public University' },
      { name: 'Illinois State University', slug: 'illinois-state-university', ranking: 'Top National Tier University' },
      { name: 'Arizona State University', slug: 'arizona-state-university', ranking: '#1 Most Innovative US University' }
    ],
    scholarshipInfo: 'International merit scholarships up to $10,000 per year automatically evaluated with admission.',
    faqs: [
      { question: 'Is the F-1 visa interview difficult?', answer: 'It requires genuine intent, clear academic focus, and demonstrable ties to home. COS Education provides 1-on-1 mock interview preparation.' },
      { question: 'Can I study in USA without GRE?', answer: 'Yes, numerous top-tier universities across our network currently offer GRE/GMAT waivers for master’s applicants.' }
    ]
  },
  {
    slug: 'greece',
    name: 'Greece',
    code: 'GR',
    flag: '🇬🇷',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'Affordable European education in the historic cradle of academia with Schengen travel access.',
    shortDescription: 'European Schengen gateway, affordable tuition, American-accredited programs, and Mediterranean lifestyle.',
    overview: 'Study in Athens or Thessaloniki and enjoy top American-accredited education combined with European residency. Enjoy affordable living costs, rich culture, and open travel throughout the Schengen Zone.',
    whyStudyHere: [
      { title: 'Schengen Visa Mobility', description: 'Travel visa-free across 29 European Schengen member states throughout your studies.' },
      { title: 'American Degrees in Europe', description: 'Earn NECHE-accredited US degrees from institutions like The American College of Greece.' },
      { title: 'Cost-Effective Living', description: 'Monthly living expenses range from €500 to €750, one of the lowest in Western Europe.' },
      { title: 'Hospitality & Tourism Hub', description: 'Paid internship opportunities in Europe’s booming tourism and shipping sectors.' }
    ],
    popularPrograms: ['International Tourism & Hospitality', 'Shipping & Maritime Management', 'Business Administration', 'Psychology', 'Graphic Design'],
    tuitionRange: '€6,000 – €11,000 / year',
    livingCost: '€500 – €750 / month',
    currency: 'EUR (€)',
    workRights: '20 hours/week during semester in line with Greek student permit regulations',
    postStudyWork: 'Job search residence permit options upon graduation',
    entryRequirements: {
      undergraduate: 'High School diploma / HSC with minimum 55%',
      postgraduate: 'Recognized Bachelor’s degree in related field'
    },
    englishRequirements: {
      ielts: '5.5 – 6.0 overall',
      waiverPossible: true,
      waiverNote: 'Institutional proficiency assessments or English medium verification accepted'
    },
    popularUniversities: [
      { name: 'The American College of Greece', slug: 'american-college-of-greece', ranking: 'Oldest US-accredited college in Europe' },
      { name: 'University of Indianapolis (Athens)', slug: 'university-of-indianapolis-athens', ranking: 'Direct US Degree Campus' }
    ],
    scholarshipInfo: 'Financial need and academic achievement awards covering 15% to 40% of tuition fees.',
    faqs: [
      { question: 'Does studying in Greece give me access to Europe?', answer: 'Yes, international students receive a Greek residence permit allowing free movement throughout the Schengen zone.' }
    ]
  },
  {
    slug: 'malta',
    name: 'Malta',
    code: 'MT',
    flag: '🇲🇹',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'An English-speaking European island economy with booming iGaming, finance, and IT industries.',
    shortDescription: 'Native English-speaking country in the EU, year-round sunshine, vibrant tech industry, and Schengen perks.',
    overview: 'Malta is one of only two official English-speaking countries in the European Union. Enjoy safe island living, top-notch education, and high-demand internships in iGaming, fintech, and digital media.',
    whyStudyHere: [
      { title: 'Native English Environment', description: 'English is an official national language; everyday life and courses are 100% in English.' },
      { title: 'Post-Study Work Permit', description: 'Graduates can apply for an employment license / 9-month post-study visa in Malta.' },
      { title: 'High Part-Time Job Demand', description: 'Active service, hospitality, and IT sectors with strong demand for international student workers.' },
      { title: 'Schengen Gateway', description: 'Direct flight connections and visa-free travel throughout continental Europe.' }
    ],
    popularPrograms: ['Digital Marketing & iGaming', 'Information Technology', 'Hospitality & Event Management', 'Business Analytics', 'Accounting & Finance'],
    tuitionRange: '€6,500 – €12,000 / year',
    livingCost: '€650 – €850 / month',
    currency: 'EUR (€)',
    workRights: '20 hours/week after completing the first 90 days of study',
    postStudyWork: '6 to 9 months post-graduate job search permit',
    entryRequirements: {
      undergraduate: 'High School / HSC equivalent (minimum 55%)',
      postgraduate: 'Bachelor’s degree with satisfactory CGPA'
    },
    englishRequirements: {
      ielts: '5.5 – 6.0 overall',
      waiverPossible: true,
      waiverNote: 'Accepted via interview or institutional English test'
    },
    popularUniversities: [
      { name: 'University of Malta', slug: 'university-of-malta', ranking: 'Historic Public University (Est. 1592)' },
      { name: 'American University of Malta', slug: 'american-university-of-malta', ranking: 'Accredited US-style University' }
    ],
    scholarshipInfo: 'Early-bird enrollment bursaries and academic excellence fee waivers.',
    faqs: [
      { question: 'Is Maltese required to live and work in Malta?', answer: 'No, English is universally spoken by locals, businesses, and government departments.' }
    ]
  },
  {
    slug: 'cyprus',
    name: 'Cyprus',
    code: 'CY',
    flag: '🇨🇾',
    coverImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
    heroSubtitle: 'A cost-effective European higher education hub with high visa success rates and modern campus facilities.',
    shortDescription: 'High visa approval rates, minimal paperwork stress, affordable tuition, and accredited European qualifications.',
    overview: 'Cyprus has grown into a bustling international student destination in the Eastern Mediterranean. It offers straightforward visa procedures, competitive tuition fees, and high-standard campus accommodations.',
    whyStudyHere: [
      { title: 'High Visa Success Rate', description: 'Streamlined visa processing through the Cyprus Migration Department with high approval ratios.' },
      { title: 'Affordable Living & Tuition', description: 'One of the most budget-friendly European options for students looking for quality degrees.' },
      { title: 'Globally Recognized Degrees', description: 'Qualifications accredited under the Bologna Process and recognized across Europe and the UK.' },
      { title: 'Friendly Student Community', description: 'Vibrant international student community with students from over 100 nationalities.' }
    ],
    popularPrograms: ['Computer Science', 'Business & Marketing', 'Medicine & Pharmacy', 'Hotel Management', 'Civil Engineering'],
    tuitionRange: '€3,500 – €7,500 / year',
    livingCost: '€400 – €600 / month',
    currency: 'EUR (€)',
    workRights: '20 hours/week in designated sectors after 6 months of study',
    postStudyWork: 'Opportunities to transition into European work permits or transfer programs',
    entryRequirements: {
      undergraduate: 'HSC / High School Diploma (minimum 50%)',
      postgraduate: 'Bachelor’s degree from a recognized university'
    },
    englishRequirements: {
      ielts: '5.0 – 5.5 overall (or internal university test)',
      waiverPossible: true,
      waiverNote: 'University internal English test available on arrival or online prior to travel'
    },
    popularUniversities: [
      { name: 'University of Nicosia', slug: 'university-of-nicosia', ranking: '#1 University in Cyprus (THE Rankings)' },
      { name: 'European University Cyprus', slug: 'european-university-cyprus', ranking: 'QS 5-Stars Top Rated' }
    ],
    scholarshipInfo: 'Academic scholarships covering up to 30-50% of tuition based on high school or bachelor CGPA.',
    faqs: [
      { question: 'Do I need IELTS for Cyprus?', answer: 'No, many universities conduct their own online diagnostic English placement test.' }
    ]
  }
];

export const UNIVERSITIES: University[] = [
  {
    id: 'u1',
    slug: 'university-of-hertfordshire',
    name: 'University of Hertfordshire',
    country: 'United Kingdom',
    countrySlug: 'uk',
    city: 'Hatfield (Greater London)',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Top 600 Times Higher Education World',
    type: 'Public',
    tuitionRange: '£14,750 – £16,950 / year',
    applicationFee: 'Free via COS Education',
    scholarshipsAvailable: '£1,000 – £4,000 Chancellor’s Scholarship',
    englishRequirements: 'IELTS 6.0 (5.5 min) or MOI accepted for select Bangladesh grads',
    intakes: ['September', 'January'],
    programsCount: 180,
    overview: 'Located just 25 minutes by train from Central London, Hertfordshire is renowned for industry-informed degrees, excellent graduate employability, and state-of-the-art £50m science and enterprise facilities.',
    entryRequirements: 'Undergraduate: HSC GPA 3.5+ or A-levels. Postgraduate: 4-year Bachelor’s with CGPA 2.6+.',
    applicationDeadline: 'September Intake: July 15 | January Intake: November 20',
    website: 'https://www.herts.ac.uk',
    featured: true,
    keyHighlights: ['25 mins from Central London', 'Guaranteed campus accommodation for international 1st years', 'TEF Gold / Silver rated teaching excellence', '1-year paid placement sandwich options']
  },
  {
    id: 'u2',
    slug: 'coventry-university',
    name: 'Coventry University',
    country: 'United Kingdom',
    countrySlug: 'uk',
    city: 'Coventry / London Campus',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Top 30 in UK (Guardian University Guide)',
    type: 'Public',
    tuitionRange: '£15,300 – £19,800 / year',
    applicationFee: 'Free via COS Education',
    scholarshipsAvailable: 'Up to £2,000 International Academic Award',
    englishRequirements: 'IELTS 6.5 (5.5) / Coventry English Test',
    intakes: ['September', 'January', 'May'],
    programsCount: 220,
    overview: 'Forward-looking university known for engineering, automotive, modern computing, and innovative business management. Offers campuses both in central Coventry and central London financial district.',
    entryRequirements: 'Bachelor: HSC minimum 65%. Master: 4-year Bachelor with CGPA 2.75+.',
    applicationDeadline: 'Rolling admissions with intakes in Sept, Jan, May',
    website: 'https://www.coventry.ac.uk',
    featured: true,
    keyHighlights: ['Award-winning employability ecosystem', 'Campuses in Coventry and London City', 'High visa sponsor credibility', 'Flexible 3 annual intake periods']
  },
  {
    id: 'u3',
    slug: 'lut-university',
    name: 'LUT University (Lappeenranta-Lahti)',
    country: 'Finland',
    countrySlug: 'finland',
    city: 'Lappeenranta & Lahti',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Top 300 Times Higher Education Global',
    type: 'Public',
    tuitionRange: '€9,500 – €13,500 / year',
    applicationFee: 'Free (Finnish Joint Application)',
    scholarshipsAvailable: 'Early Bird €1,500 + 50% to 100% Tuition Waiver',
    englishRequirements: 'IELTS 6.5 overall (min 6.0 writing) / PTE 62',
    intakes: ['September (Autumn Intake)'],
    programsCount: 45,
    overview: 'LUT University is a pioneer in clean energy, software engineering, climate business, and circular economy. It ranks among the top universities globally for climate action and sustainable development.',
    entryRequirements: 'Bachelor: HSC/A-Levels + SAT. Master: Relevant Bachelor degree with strong mathematics & technical background.',
    applicationDeadline: 'Joint Application: January 15 | Rolling Application: March 31',
    website: 'https://www.lut.fi',
    featured: true,
    keyHighlights: ['Generous 100% full tuition scholarships', 'Ranked top in Finland for industry collaboration', 'Greenest modern campus in Europe', 'Direct student residence next to campus']
  },
  {
    id: 'u4',
    slug: 'metropolia-university',
    name: 'Metropolia University of Applied Sciences',
    country: 'Finland',
    countrySlug: 'finland',
    city: 'Helsinki Capital Region',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Largest UAS in Finland',
    type: 'Public',
    tuitionRange: '€10,000 – €12,500 / year',
    applicationFee: 'Free',
    scholarshipsAvailable: 'Early Bird discount + Finnish Language proficiency grants',
    englishRequirements: 'IELTS 6.0 or Finnish UAS Entrance Exam',
    intakes: ['August (Autumn)'],
    programsCount: 60,
    overview: 'Metropolia is Finland’s largest university of applied sciences, situated in the capital city of Helsinki with four modern campuses specializing in Business, Technology, Health Care, and Culture.',
    entryRequirements: 'High School Diploma / HSC + UAS International Exam participation.',
    applicationDeadline: 'January 17 (National Joint Application)',
    website: 'https://www.metropolia.fi',
    featured: true,
    keyHighlights: ['Located in Helsinki capital area', 'Extensive industry partner network', '30 hours weekly student work authorization', 'High demand for health and IT graduates']
  },
  {
    id: 'u5',
    slug: 'asia-pacific-university',
    name: 'Asia Pacific University of Technology & Innovation (APU)',
    country: 'Malaysia',
    countrySlug: 'malaysia',
    city: 'Kuala Lumpur',
    logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Top 1 in Malaysia for International Students (QS Stars)',
    type: 'Private',
    tuitionRange: '$5,500 – $7,800 / year',
    applicationFee: 'Waived via COS Education',
    scholarshipsAvailable: '20% to 50% Merit Scholarships on High School / Bachelor GPA',
    englishRequirements: 'IELTS 5.5 - 6.0 or APU English Language Center',
    intakes: ['March', 'May', 'July', 'September', 'November'],
    programsCount: 110,
    overview: 'APU has won over 400 prestigious awards for tech innovation. Offers dual award degrees in partnership with De Montfort University (DMU), UK, giving students two degrees upon graduation.',
    entryRequirements: 'HSC / A-Levels with 55%+. Master: Bachelor with CGPA 2.50+.',
    applicationDeadline: '6-8 weeks prior to each of the 5 annual intakes',
    website: 'https://www.apu.edu.my',
    featured: true,
    keyHighlights: ['Dual Degree: APU Malaysia + De Montfort University UK', '100% Employability rate upon graduation', 'Ultramodern cyber security & game development labs', 'Low living cost in student-friendly Kuala Lumpur']
  },
  {
    id: 'u6',
    slug: 'university-of-south-florida',
    name: 'University of South Florida (USF)',
    country: 'United States',
    countrySlug: 'usa',
    city: 'Tampa, Florida',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568792923760-d70635a89fa1?auto=format&fit=crop&w=1000&q=80',
    ranking: '#42 Best Public University in USA (U.S. News)',
    type: 'Public',
    tuitionRange: '$17,324 / year (Out-of-state)',
    applicationFee: '$30',
    scholarshipsAvailable: 'Up to $12,000/year Green & Gold Presidential Award',
    englishRequirements: 'IELTS 6.5 (min 6.0) / TOEFL 79 / Duolingo 110',
    intakes: ['Fall (August)', 'Spring (January)'],
    programsCount: 200,
    overview: 'A Tier-1 Research institution in sunny Tampa Bay. USF is recognized as America’s fastest-rising university, famous for engineering, medical research, business analytics, and high-tech career placements.',
    entryRequirements: 'Undergrad: HSC GPA 3.5+ (evaluated). Master: 4-year Bachelor with CGPA 3.0+.',
    applicationDeadline: 'Fall: February 15 priority | Spring: October 1',
    website: 'https://www.usf.edu',
    featured: true,
    keyHighlights: ['Preeminent Tier 1 Research University', 'STEM OPT 3-year post-study work authorization', 'Substantial out-of-state tuition waivers for high achievers', 'Thriving Tampa Bay tech corridor']
  },
  {
    id: 'u7',
    slug: 'american-college-of-greece',
    name: 'The American College of Greece (Deree)',
    country: 'Greece',
    countrySlug: 'greece',
    city: 'Athens',
    logo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Oldest US-accredited college in Europe (NECHE)',
    type: 'Private',
    tuitionRange: '€8,500 – €11,000 / year',
    applicationFee: '€50',
    scholarshipsAvailable: 'Up to 35% Academic Excellence Grant',
    englishRequirements: 'IELTS 6.0 / Duolingo 100 / Internal exam',
    intakes: ['Fall (September)', 'Spring (January)'],
    programsCount: 50,
    overview: 'Located on a picturesque 64-acre campus in Athens, Deree offers dual accreditation: recognized both in the US via NECHE and validated in the UK by The Open University.',
    entryRequirements: 'HSC / High School GPA 3.0 or equivalent. Master: Bachelor CGPA 2.75+.',
    applicationDeadline: 'Rolling until July 15 for Fall intake',
    website: 'https://www.acg.edu',
    featured: false,
    keyHighlights: ['Dual US & UK degree validation', 'Schengen European residence permit included', 'Mediterranean lifestyle at low living expense', 'Study in the historic cradle of philosophy']
  },
  {
    id: 'u8',
    slug: 'university-of-nicosia',
    name: 'University of Nicosia (UNIC)',
    country: 'Cyprus',
    countrySlug: 'cyprus',
    city: 'Nicosia',
    logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    ranking: 'Top 500 Worldwide (Times Higher Education)',
    type: 'Private',
    tuitionRange: '€6,000 – €9,500 / year',
    applicationFee: '€55',
    scholarshipsAvailable: '20% to 40% Merit Scholarships based on High School GPA',
    englishRequirements: 'IELTS 5.5 - 6.0 or UNIC English Placement Test (NEP)',
    intakes: ['October (Fall)', 'February (Spring)'],
    programsCount: 100,
    overview: 'The largest university in Southern Europe teaching primarily in English. UNIC is a global pioneer in blockchain, digital currency, medical sciences, and international relations.',
    entryRequirements: 'High School / HSC minimum 55%. Master: Bachelor degree with CGPA 2.50+.',
    applicationDeadline: 'Fall: August 15 | Spring: December 15',
    website: 'https://www.unic.ac.cy',
    featured: false,
    keyHighlights: ['#1 ranked university in Cyprus and Greece', 'World leader in Blockchain & FinTech education', 'High student visa approval rate for South Asian students', 'Modern on-campus SIX student residential village']
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'p1',
    slug: 'msc-computer-science-hertfordshire',
    name: 'MSc Computer Science (with Advanced Research / Placement)',
    universityId: 'u1',
    universityName: 'University of Hertfordshire',
    universitySlug: 'university-of-hertfordshire',
    country: 'United Kingdom',
    countrySlug: 'uk',
    degree: 'Master',
    discipline: 'Computer Science & AI',
    duration: '1 Year (or 2 Years with Placement)',
    tuition: '£16,450 / total course',
    intakes: ['September', 'January'],
    englishRequirement: 'IELTS 6.0 overall (no subscore below 5.5)',
    entryRequirements: '4-year Bachelor’s in Computing, Engineering, or closely related quantitative field with CGPA 2.6+.',
    scholarshipAvailable: true,
    scholarshipDetails: '£2,000 – £4,000 International Academic Excellence discount available for early applicants.',
    overview: 'Provides deep foundational knowledge and advanced practical hands-on training in contemporary software architecture, distributed cloud computing, machine learning, and cyber systems.',
    careerOutcomes: ['Cloud Solutions Architect', 'Senior Software Engineer', 'DevOps Specialist', 'Machine Learning Engineer']
  },
  {
    id: 'p2',
    slug: 'msc-data-science-coventry',
    name: 'MSc Data Science and Artificial Intelligence',
    universityId: 'u2',
    universityName: 'Coventry University',
    universitySlug: 'coventry-university',
    country: 'United Kingdom',
    countrySlug: 'uk',
    degree: 'Master',
    discipline: 'Computer Science & AI',
    duration: '1 Year Full-Time',
    tuition: '£18,250 / year',
    intakes: ['September', 'January', 'May'],
    englishRequirement: 'IELTS 6.5 (min 5.5 in each component)',
    entryRequirements: 'Bachelor degree in Computing, Mathematics, Science or Engineering with CGPA 2.75+.',
    scholarshipAvailable: true,
    scholarshipDetails: '£1,500 – £2,500 International Merit Bursary.',
    overview: 'Prepares graduates to solve complex industrial problems using predictive analytics, deep neural networks, natural language processing, and big data pipeline engineering.',
    careerOutcomes: ['Lead Data Scientist', 'AI Product Manager', 'Quantitative Analyst', 'Big Data Engineer']
  },
  {
    id: 'p3',
    slug: 'msc-software-engineering-lut',
    name: 'MSc Software Engineering and Digital Transformation',
    universityId: 'u3',
    universityName: 'LUT University',
    universitySlug: 'lut-university',
    country: 'Finland',
    countrySlug: 'finland',
    degree: 'Master',
    discipline: 'Computer Science & AI',
    duration: '2 Years (120 ECTS)',
    tuition: '€13,500 / year (before scholarship)',
    intakes: ['September'],
    englishRequirement: 'IELTS 6.5 (min 6.0 in writing) or PTE 62',
    entryRequirements: 'Bachelor of Science in Software Engineering, Computer Science or equivalent with strong GPA.',
    scholarshipAvailable: true,
    scholarshipDetails: '100% and 50% tuition waiver scholarships granted based on academic ranking in application.',
    overview: 'Focuses on building large-scale software systems, cloud-native architectures, and user-centered digital transformation strategies in Europe’s premier tech nation.',
    careerOutcomes: ['Software Architect', 'Full-Stack Team Lead', 'Digital Innovation Director', 'Cloud Consultant']
  },
  {
    id: 'p4',
    slug: 'beng-information-technology-metropolia',
    name: 'Bachelor of Engineering in Information Technology',
    universityId: 'u4',
    universityName: 'Metropolia University of Applied Sciences',
    universitySlug: 'metropolia-university',
    country: 'Finland',
    countrySlug: 'finland',
    degree: 'Bachelor',
    discipline: 'Engineering & Technology',
    duration: '4 Years (240 ECTS)',
    tuition: '€11,000 / year',
    intakes: ['August'],
    englishRequirement: 'IELTS 6.0 or Finnish UAS Entrance Exam',
    entryRequirements: 'HSC / High School Diploma with strong grades in Mathematics and Physics.',
    scholarshipAvailable: true,
    scholarshipDetails: '€1,500 Early Bird discount + €3,000 annual language proficiency grant.',
    overview: 'Combines IoT, embedded systems, mobile application engineering, and smart connected solutions with real project assignments for Finnish enterprises.',
    careerOutcomes: ['Embedded Systems Developer', 'IoT Solutions Engineer', 'Firmware Specialist', 'Mobile App Engineer']
  },
  {
    id: 'p5',
    slug: 'bsc-cyber-security-apu',
    name: 'BSc (Hons) in Computer Science with Cyber Security (Dual Award)',
    universityId: 'u5',
    universityName: 'Asia Pacific University (APU)',
    universitySlug: 'asia-pacific-university',
    country: 'Malaysia',
    countrySlug: 'malaysia',
    degree: 'Bachelor',
    discipline: 'Computer Science & AI',
    duration: '3 Years Full-Time',
    tuition: '$6,200 / year',
    intakes: ['March', 'May', 'July', 'September', 'November'],
    englishRequirement: 'IELTS 5.5 or APU English Placement Test',
    entryRequirements: 'HSC / A-Level with minimum 55% average including Mathematics.',
    scholarshipAvailable: true,
    scholarshipDetails: 'Up to 30% tuition fee waiver based on high school results.',
    overview: 'Conducted in partnership with De Montfort University (UK), graduates receive dual certificates. Features training in military-grade Cyber Threat Intelligence Centers.',
    careerOutcomes: ['SOC Security Analyst', 'Penetration Tester', 'Information Security Officer', 'Forensics Investigator']
  },
  {
    id: 'p6',
    slug: 'ms-business-analytics-usf',
    name: 'MS in Business Analytics & Information Systems (STEM)',
    universityId: 'u6',
    universityName: 'University of South Florida (USF)',
    universitySlug: 'university-of-south-florida',
    country: 'United States',
    countrySlug: 'usa',
    degree: 'Master',
    discipline: 'Business & Management',
    duration: '1.5 – 2 Years',
    tuition: '$17,324 / year',
    intakes: ['Fall (August)', 'Spring (January)'],
    englishRequirement: 'IELTS 6.5 / TOEFL 79 / Duolingo 110',
    entryRequirements: '4-year Bachelor degree in any discipline with CGPA 3.0+; GRE waiver available.',
    scholarshipAvailable: true,
    scholarshipDetails: 'Graduate Out-of-State Tuition waivers and departmental research assistantships available.',
    overview: 'Designated as a STEM program allowing 3 years of post-graduation OPT work in the United States. Blends statistical modeling, business intelligence, database management, and enterprise strategy.',
    careerOutcomes: ['Business Intelligence Architect', 'Data Strategist', 'Analytics Consultant', 'Product Analytics Manager']
  },
  {
    id: 'p7',
    slug: 'mba-international-business-greenwich',
    name: 'MBA International Business',
    universityId: 'u1',
    universityName: 'University of Hertfordshire',
    universitySlug: 'university-of-hertfordshire',
    country: 'United Kingdom',
    countrySlug: 'uk',
    degree: 'Master',
    discipline: 'Business & Management',
    duration: '1 Year Full-Time',
    tuition: '£17,000 / total',
    intakes: ['September', 'January'],
    englishRequirement: 'IELTS 6.5 (min 6.0)',
    entryRequirements: 'Bachelor’s degree with CGPA 2.6+; 1-2 years managerial or commercial experience preferred.',
    scholarshipAvailable: true,
    scholarshipDetails: '£2,000 – £3,500 Global Executive MBA scholarship.',
    overview: 'Equips aspiring leaders with cross-cultural management insight, financial leadership, global supply chain strategy, and entrepreneurial execution in a London setting.',
    careerOutcomes: ['Management Consultant', 'Operations Director', 'Business Development Manager', 'Corporate Strategist']
  },
  {
    id: 'p8',
    slug: 'bsc-blockchain-fintech-unic',
    name: 'BSc in Data Science and Financial Technology',
    universityId: 'u8',
    universityName: 'University of Nicosia',
    universitySlug: 'university-of-nicosia',
    country: 'Cyprus',
    countrySlug: 'cyprus',
    degree: 'Bachelor',
    discipline: 'Finance & Accounting',
    duration: '4 Years (240 ECTS)',
    tuition: '€7,200 / year',
    intakes: ['October', 'February'],
    englishRequirement: 'IELTS 5.5 or internal diagnostic test',
    entryRequirements: 'High School Diploma / HSC with minimum 55%.',
    scholarshipAvailable: true,
    scholarshipDetails: 'Up to 40% High Achievers Scholarship.',
    overview: 'Study at the pioneer institution that launched the world’s first Master in Digital Currency. Gain hands-on competence in algorithmic trading, decentralized finance, and data modeling.',
    careerOutcomes: ['FinTech Product Analyst', 'Blockchain Developer', 'Risk Analyst', 'Financial Engineer']
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    slug: 'university-program-selection',
    title: 'University & Program Selection',
    shortDescription: 'Data-driven matching based on your CGPA, budget, career aspirations, and post-study migration plans.',
    fullDescription: 'Choosing where and what to study abroad is a life-defining investment. At COS Education, our counselors analyze your academic background, test scores, financial parameters, and long-term career aspirations to curate a tailored list of best-fit universities and programs.',
    icon: 'Compass',
    keyBenefits: [
      'Comparative evaluation across UK, Finland, USA, Malaysia, and Europe',
      'Realistic assessment of admission probability and scholarship odds',
      'Course content alignment with global job market demands',
      'Full tuition and living cost projections with zero hidden surprises'
    ],
    processSteps: [
      'Comprehensive 1-on-1 Profile Assessment with senior education counselor',
      'Shortlisting 5-8 aspirational, realistic, and safe university options',
      'Curriculum, campus location, and post-study work policy comparison',
      'Final selection of target universities and intake timeline lock-in'
    ],
    faqs: [
      { question: 'How many universities can I apply to with COS Education?', answer: 'We typically submit applications to 3 to 6 high-probability institutions to ensure multiple unconditional offers and scholarship possibilities.' }
    ]
  },
  {
    id: 's2',
    slug: 'application-processing',
    title: 'Application Processing & Tracking',
    shortDescription: 'Error-free document compilation, portal submission, and priority tracking across our global university network.',
    fullDescription: 'University portals can be daunting with complex document requirements, reference letter standards, and strict deadlines. Our dedicated admissions operations team manages your application pipeline from start to finish with meticulous accuracy.',
    icon: 'FileCheck',
    keyBenefits: [
      'Fast-track submission through institutional application portals',
      'Direct liaison with international admission officers for expediting offers',
      'Application fee waivers at select universities across our network',
      'Proactive monitoring and deadline tracking so you never miss an intake'
    ],
    processSteps: [
      'Document audit and verification against target university checklists',
      'Portal submission and formal candidate dossier verification',
      'Real-time status tracking and prompt response to admission queries',
      'Receipt and evaluation of Conditional & Unconditional Offer Letters'
    ],
    faqs: [
      { question: 'Do you charge an application processing fee?', answer: 'For universities across our network in the UK, Malaysia, Finland, and Europe, our core processing and consultation services are 100% free for students.' }
    ]
  },
  {
    id: 's3',
    slug: 'sop-cv-support',
    title: 'SOP & CV Drafting & Review',
    shortDescription: 'Professional storytelling that highlights your academic trajectory, motivations, and career vision authentically.',
    fullDescription: 'Your Statement of Purpose (SOP) or Personal Statement is often the decisive factor between admission and rejection. We help you articulate your unique journey, explaining study gaps constructively and presenting your goals compellingly without generic AI cliches.',
    icon: 'PenTool',
    keyBenefits: [
      'Human-driven brainstorming sessions to uncover your true academic passions',
      'Detailed review for structure, clarity, flow, grammar, and emotional resonance',
      'Study gap justification and career transition explanation strategies',
      'Europass & UK/US standard Academic CV restructuring'
    ],
    processSteps: [
      'Questionnaire on your background, achievements, and future ambitions',
      'Drafting guidance framework tailored to your chosen degree level',
      'Rigorous multi-round editing by specialized academic editors',
      'Final plagiarism-free and AI-slop-free polish ready for submission'
    ],
    faqs: [
      { question: 'Will you write my SOP from scratch for me?', answer: 'No. Admissions committees require your genuine personal voice. We brainstorm with you, guide structure, and refine your drafts to meet the highest university standards.' }
    ]
  },
  {
    id: 's4',
    slug: 'english-language-guidance',
    title: 'English Language Guidance (IELTS/PTE/Duolingo)',
    shortDescription: 'Strategic preparation guidance, diagnostic testing, and identifying MOI waiver pathways.',
    fullDescription: 'Achieving the required language score is essential for both university admission and visa compliance. COS Education guides you on the optimal exam (IELTS Academic, PTE Academic, or Duolingo) and pinpoints institutions that accept Medium of Instruction (MOI) waivers.',
    icon: 'Languages',
    keyBenefits: [
      'Expert advice on whether IELTS, PTE, or Duolingo best fits your strengths',
      'Verification of university-specific minimum overall and component band requirements',
      'Identification of network universities that accept MOI certificates from Bangladesh',
      'Discount vouchers and test booking facilitation'
    ],
    processSteps: [
      'Review of current English proficiency level and target score needs',
      'Evaluation of MOI eligibility based on prior degree-granting institution',
      'Study plan recommendations or partner test booking',
      'Submission of official score reports to university admissions'
    ],
    faqs: [
      { question: 'Can I get an offer letter before taking the IELTS test?', answer: 'Yes! Most universities will issue a Conditional Offer based on your academic transcripts, allowing you time to submit your English score before CAS or final enrollment.' }
    ]
  },
  {
    id: 's5',
    slug: 'scholarship-guidance',
    title: 'Scholarship Guidance & Application',
    shortDescription: 'Maximizing your financial awards through early bird discounts, merit waivers, and government schemes.',
    fullDescription: 'Studying abroad is significantly more affordable when you secure scholarships. We actively track merit-based bursaries, early-bird fee reductions, country-specific awards, and research assistantships to lighten your financial commitment.',
    icon: 'Award',
    keyBenefits: [
      'Automatic consideration matching for internal university fee discounts',
      'Dedicated guidance for competitive external grants (Commonwealth, Chevening, Fulbright)',
      'Assistance with scholarship essays and personal statements',
      'Over 90% of our guided students receive some form of tuition scholarship'
    ],
    processSteps: [
      'Evaluation of GPA, extracurriculars, and leadership experience against scholarship criteria',
      'Identification of target scholarship deadlines (often earlier than regular admission)',
      'Review of supplemental scholarship essays and recommendation letters',
      'Formal submission and follow-up with university awards panels'
    ],
    faqs: [
      { question: 'Are 100% full scholarships available?', answer: 'Yes, destinations like Finland offer up to 100% tuition waivers for top academic performers, and governments sponsor prestigious programs like Chevening and Commonwealth.' }
    ]
  },
  {
    id: 's6',
    slug: 'university-interview-prep',
    title: 'University Interview Preparation',
    shortDescription: 'Mock interviews replicating genuine university credibility and faculty interview scenarios.',
    fullDescription: 'Many universities, particularly in the UK and USA, conduct Credibility Interviews before issuing an unconditional offer or CAS. Our seasoned counselors run realistic mock interviews to train you in answering course, finance, and career questions naturally.',
    icon: 'Video',
    keyBenefits: [
      'Comprehensive database of actual questions asked by UK and US university interviewers',
      'Training on articulating course modules, university facilities, and career relevance',
      'Body language, video presence, and professional conversational etiquette coaching',
      'Constructive recorded feedback sessions to eliminate nervous habits'
    ],
    processSteps: [
      'Course curriculum and module breakdown review session',
      '1-on-1 simulated mock interview replicating live conditions',
      'Detailed feedback report highlighting areas for improvement',
      'Final confidence check prior to the actual university interview'
    ],
    faqs: [
      { question: 'What happens if I fail a university credibility interview?', answer: 'Failing a credibility interview can lead to CAS refusal. That is why our pre-interview coaching is mandatory and has maintained a 98% interview pass rate.' }
    ]
  },
  {
    id: 's7',
    slug: 'visa-interview-prep',
    title: 'Visa Interview Preparation',
    shortDescription: 'Rigorous coaching for US F-1 embassy interviews and European consular interrogations.',
    fullDescription: 'The visa interview at the US Embassy or Schengen Consulate is high-stakes. Consular officers assess your non-immigrant intent, academic readiness, and financial legitimacy in mere minutes. We prepare you to speak with clarity, truthfulness, and unwavering composure.',
    icon: 'Users',
    keyBenefits: [
      'Detailed breakdown of the consular mindset and common refusal triggers',
      'Framing genuine ties to Bangladesh to satisfy non-immigrant intent laws',
      'Accurate mastery of your financial sponsors, bank accounts, and tax returns',
      'Personalized mock drills conducted by experts who have guided hundreds of successful applicants'
    ],
    processSteps: [
      'DS-160 / visa questionnaire deep-dive and consistency verification',
      'Core questions drill: Why this university? Why USA? How will you finance your studies?',
      'Mock interview simulation with rapid-fire questions',
      'Final review of physical document folder organization for interview day'
    ],
    faqs: [
      { question: 'How many mock interviews will I have?', answer: 'We conduct as many rounds as needed until you feel completely natural, confident, and articulate.' }
    ]
  },
  {
    id: 's8',
    slug: 'visa-application-support',
    title: 'Visa Application & Filing Support',
    shortDescription: 'Flawless filing of UK Student Visa, Schengen Student Visa, EMGS Malaysia, and US F-1 forms.',
    fullDescription: 'Visa regulations change constantly. A single minor error or inconsistent date on your visa application form can lead to immediate refusal and a ruined academic year. Our visa compliance team conducts three-tier audits on every submission.',
    icon: 'ShieldCheck',
    keyBenefits: [
      'Up-to-date compliance with UKVI, US Department of State, and Schengen immigration rules',
      'Meticulous completion of official online visa portals (UKVI AccessUK, CEAC DS-160, EMGS)',
      'Careful document sequencing, translation verification, and notary guidance',
      '95%+ historical student visa grant rate'
    ],
    processSteps: [
      'Pre-visa checklist issuance upon receipt of CAS / I-20 / eVAL / Acceptance Letter',
      'Online visa form draft completion and client verification review',
      'Immigration Health Surcharge (IHS) and visa fee payment handling',
      'Confirmation page generation and appointment booking'
    ],
    faqs: [
      { question: 'What happens if my visa has a previous refusal?', answer: 'We specialize in complex refusal analysis, pinpointing the exact reason from previous refusal letters and compiling strong legal representation.' }
    ]
  },
  {
    id: 's9',
    slug: 'financial-documentation',
    title: 'Financial Documentation Guidance',
    shortDescription: 'Solvency certificate, 28-day holding rules, source of fund proofs, and affidavit compliance.',
    fullDescription: 'Financial refusal is the leading cause of visa rejection. Immigration authorities demand proof of genuine funds held for specific statutory durations. We guide your sponsors on legitimate bank statements, solvency certificates, and tax documentation.',
    icon: 'Landmark',
    keyBenefits: [
      'Strict adherence to UK 28-day rule, Schengen blocked accounts, and US financial affidavits',
      'Guidance on recognized commercial banks in Bangladesh approved by foreign embassies',
      'Proper documentation of sponsor income sources (business trade license, land deeds, salary slips)',
      'Affidavit of Financial Support drafting in accordance with legal standards'
    ],
    processSteps: [
      'Calculation of exact fund requirements (unpaid tuition + mandatory living allowance)',
      'Selecting the best sponsor profile (parents, self, or legal guardian)',
      'Tracking the 28-day or required bank holding duration',
      'Final bank statement audit before submission'
    ],
    faqs: [
      { question: 'Can my uncle or brother sponsor my studies in the UK?', answer: 'For the UK, only funds in the student’s name or their biological parents’/legal guardian’s names are permitted under UKVI immigration rules.' }
    ]
  },
  {
    id: 's10',
    slug: 'vfs-biometrics-guidance',
    title: 'VFS & Biometrics Guidance',
    shortDescription: 'Appointment booking, document folder indexing, and step-by-step guidance for Sylhet and Dhaka centers.',
    fullDescription: 'We book your biometric appointments at VFS Global Sylhet or Dhaka, organizing your physical documentation folder with indexed tabs so that your appointment runs smoothly and stress-free.',
    icon: 'Fingerprint',
    keyBenefits: [
      'VFS appointment scheduling at Sylhet or Dhaka centers',
      'Document indexing following the precise embassy upload order',
      'Clear briefing on security protocols and biometric procedures',
      'SMS and online tracking of your passport transit'
    ],
    processSteps: [
      'Securing optimal VFS appointment slot fitting your travel schedule',
      'Scanning and high-resolution uploading of required supporting files',
      'Physical file compilation with official barcoded appointment letters',
      'Post-appointment passport tracking until safe collection'
    ],
    faqs: [
      { question: 'Can I do my biometrics at VFS Sylhet?', answer: 'Yes! VFS Global operates a full Visa Application Centre right here in Sylhet for UK and select European visas.' }
    ]
  },
  {
    id: 's11',
    slug: 'ticketing-pre-departure',
    title: 'Ticketing & Pre-Departure Briefing',
    shortDescription: 'Student baggage allowance air ticketing, airport pickup coordination, accommodation, and SIM cards.',
    fullDescription: 'Getting your visa is only half the journey. Stepping off the airplane in a foreign country can be intimidating. COS Education prepares you for real student life abroad with comprehensive pre-departure briefings and community connections.',
    icon: 'Plane',
    keyBenefits: [
      'Exclusive student fare air tickets with extra 40kg+ luggage allowances',
      'Airport transfer arrangement and university accommodation booking assistance',
      'Complimentary international SIM card and student bank account setup guidance',
      'Connections with senior COS Education alumni already studying at your university'
    ],
    processSteps: [
      'Pre-departure orientation event with current international students and alumni',
      'Travel checklist audit (medications, clothing, essential documents, currency)',
      'Airport immigration protocol briefing for foreign border control',
      'Arrival confirmation and integration into our local student WhatsApp network'
    ],
    faqs: [
      { question: 'Will anyone pick me up at the airport?', answer: 'Most universities across our network offer free university shuttle pickups from major international airports during orientation week.' }
    ]
  }
];

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch1',
    title: 'Finnish Government & University 100% Tuition Waiver',
    country: 'Finland',
    university: 'LUT University, Tampere University & Metropolia',
    amount: '100% Full Tuition Waiver',
    coverageType: 'Full Tuition',
    degreeLevel: ['Master', 'Bachelor'],
    deadline: 'January 17, 2027',
    criteria: 'Awarded to top-ranked applicants based on entrance exam scores or previous Bachelor CGPA.',
    description: 'Finland offers generous scholarships directly through the national Joint Application system, waiving either 50% or 100% of the entire degree tuition for non-EU students.'
  },
  {
    id: 'sch2',
    title: 'UK Vice-Chancellor’s Excellence Scholarship',
    country: 'United Kingdom',
    university: 'University of Hertfordshire & Coventry University',
    amount: '£2,000 – £5,000 Tuition Discount',
    coverageType: 'Partial Tuition',
    degreeLevel: ['Bachelor', 'Master'],
    deadline: 'July 31, 2026 / November 15, 2026',
    criteria: 'Minimum Bachelor CGPA 3.0 or HSC GPA 4.0+. Automatically considered upon offer acceptance.',
    description: 'Designed to support outstanding international students beginning undergraduate or postgraduate taught programs.'
  },
  {
    id: 'sch3',
    title: 'US Green & Gold Presidential Award',
    country: 'United States',
    university: 'University of South Florida',
    amount: 'Up to $12,000 / Year ($48,000 Total)',
    coverageType: 'Partial Tuition',
    degreeLevel: ['Bachelor'],
    deadline: 'February 15, 2027',
    criteria: 'Calculated high school GPA of 3.8+ with strong SAT/ACT scores or evaluated transcripts.',
    description: 'Significantly lowers out-of-state tuition to near in-state levels for exceptional undergraduate students in Florida.'
  },
  {
    id: 'sch4',
    title: 'Malaysia High-Achiever Merit Scholarship',
    country: 'Malaysia',
    university: 'Asia Pacific University (APU) & Sunway University',
    amount: '20% to 50% Tuition Fee Waiver',
    coverageType: 'Partial Tuition',
    degreeLevel: ['Bachelor', 'Master'],
    deadline: 'Rolling (Valid for all 2026/2027 Intakes)',
    criteria: 'HSC GPA 4.5+ or Bachelor CGPA 3.25+. Evaluated immediately upon submission of academic transcripts.',
    description: 'Direct fee deductions applied across all 3 years of study for high-performing South Asian students in IT and Business.'
  },
  {
    id: 'sch5',
    title: 'Chevening Scholarship (UK Government)',
    country: 'United Kingdom',
    university: 'All UK Universities',
    amount: 'Full Tuition + Monthly Living Stipend + Flights',
    coverageType: 'Full Tuition',
    degreeLevel: ['Master'],
    deadline: 'November 2026',
    criteria: 'Minimum 2 years work experience, strong leadership potential, and commitment to return to home country.',
    description: 'The UK government’s flagship global scholarship program for future leaders, influencers, and decision-makers.'
  },
  {
    id: 'sch6',
    title: 'Cyprus Academic Excellence Scholarship',
    country: 'Cyprus',
    university: 'University of Nicosia',
    amount: '30% – 50% Tuition Reduction',
    coverageType: 'Partial Tuition',
    degreeLevel: ['Bachelor', 'Master'],
    deadline: 'August 10, 2026',
    criteria: 'Awarded to applicants with high school grade averages above 75% or university CGPA 3.2+.',
    description: 'Substantial fee concession making European degrees in computing, medicine, and business accessible.'
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'succ1',
    studentName: 'Tanvir Ahmed',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    destination: 'United Kingdom',
    countryCode: 'GB',
    university: 'University of Hertfordshire',
    program: 'MSc Computer Science',
    intake: 'September 2025 Intake',
    visaStatus: 'Visa Approved',
    scholarshipAwarded: '£3,000 Chancellor’s Scholarship',
    quote: 'From Sylhet to London felt like a dream. COS Education guided my SOP, handled my university interviews, and secured my visa in just 9 days without any stress.',
    fullStory: 'Tanvir graduated with a Bachelor of Science from a university in Sylhet. He was worried about his 2-year study gap after working as a freelance software developer. The COS Education team restructured his academic CV, explained his professional trajectory clearly, and secured an unconditional offer with a £3,000 scholarship.',
    hometown: 'Sylhet, Bangladesh'
  },
  {
    id: 'succ2',
    studentName: 'Nusrat Jahan Chowdhury',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    destination: 'Finland',
    countryCode: 'FI',
    university: 'LUT University',
    program: 'MSc Software Engineering & Digital Transformation',
    intake: 'Autumn 2025 Intake',
    visaStatus: 'Scholarship Recipient',
    scholarshipAwarded: '100% Full Tuition Waiver (€27,000)',
    quote: 'Winning a 100% full tuition scholarship in Finland was life-changing. COS Education’s strategic guidance during the Finnish Joint Application made all the difference.',
    fullStory: 'Nusrat approached COS Education seeking tuition-free or heavily subsidized European master programs. With our detailed coaching on the entrance scoring formula and portfolio preparation, she achieved one of the rare 100% full tuition scholarships at LUT University.',
    hometown: 'Moulvibazar, Sylhet Division'
  },
  {
    id: 'succ3',
    studentName: 'Siamur Rahman',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    destination: 'Malaysia',
    countryCode: 'MY',
    university: 'Asia Pacific University (APU)',
    program: 'BSc (Hons) in Cyber Security (UK Dual Award)',
    intake: 'March 2026 Intake',
    visaStatus: 'Visa Approved',
    scholarshipAwarded: '30% Merit Scholarship',
    quote: 'The dual degree with De Montfort University UK gave me international prestige at a fraction of the cost. The EMGS visa process with COS was seamless.',
    fullStory: 'Siamur wanted a UK degree but his family had a strict budget constraint. COS Education introduced the dual-award pathway at APU Kuala Lumpur, where he studies in state-of-the-art cyber security labs while saving over $40,000 compared to studying in London.',
    hometown: 'Habiganj, Sylhet'
  },
  {
    id: 'succ4',
    studentName: 'Farhana Yeasmin',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    destination: 'United States',
    countryCode: 'US',
    university: 'University of South Florida',
    program: 'MS in Business Analytics & Information Systems (STEM)',
    intake: 'Spring 2026 Intake',
    visaStatus: 'Visa Approved',
    scholarshipAwarded: '$10,000 Out-of-State Waiver',
    quote: 'The US visa interview was my biggest fear. The rigorous mock interview drills at the COS Education Sylhet office gave me total confidence before the consular officer.',
    fullStory: 'Farhana underwent five thorough mock interview rounds with our senior consultants. When asked about her career vision and reasons for choosing USF over other institutions, her natural, articulate responses secured her F-1 visa on the first attempt.',
    hometown: 'Sylhet Sadar'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    slug: 'uk-graduate-route-psw-guide-2026',
    title: 'UK Graduate Route (PSW) in 2026: Rules, Extensions & Job Market Insights',
    category: 'UK',
    author: {
      name: 'Mahbubur Rahman',
      role: 'Principal Education Consultant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
    },
    date: 'February 18, 2026',
    readTime: '6 min read',
    excerpt: 'Everything you need to know about the 2-year post-study work visa in the UK: application procedures, switching to Skilled Worker visas, and in-demand sectors.',
    content: [
      'The UK Graduate Route remains one of the most attractive post-study pathways for international students. Introduced to allow graduates to work or look for work in the UK for at least two years (three years for PhD graduates), it provides an invaluable opportunity to kick-start a global career.',
      'Unlike the Skilled Worker visa, the Graduate Route does not require a job offer or company sponsorship. You have the freedom to work in any sector, take internships, or engage in freelance entrepreneurship.',
      'To be eligible, you must have successfully completed an eligible degree at a UK higher education provider with a track record of compliance. Applications must be submitted inside the UK while your student visa is still valid.',
      'Key tips for securing corporate roles: start networking on LinkedIn during your second semester, participate in university career fairs, and take advantage of graduate assessment center workshops.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    tags: ['UK Education', 'Post Study Work', 'Visa Rules', 'Career Guidance']
  },
  {
    id: 'b2',
    slug: 'finland-study-abroad-scholarships-work-rights',
    title: 'Why Finland is the Smartest Choice for South Asian Tech Students in 2026',
    category: 'Finland',
    author: {
      name: 'Nuzhat Tabassum',
      role: 'European Admissions Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
    },
    date: 'January 28, 2026',
    readTime: '5 min read',
    excerpt: 'Discover why Finland’s 30-hour weekly work rights, 100% scholarships, and rapid permanent residence pathway make it Europe’s premier destination.',
    content: [
      'Finland is globally recognized for the world’s happiest population and the highest quality educational system. For international students, recent policy changes have made it even more appealing.',
      'International students in Finland can now work up to 30 hours per week during term time, up from the previous 25-hour cap. This makes self-funding living expenses during your studies realistic.',
      'Upon graduation, Finland grants a generous 2-year job seeker residence permit. Even better, years spent under a student residence permit count directly towards Finnish permanent residency (PR).',
      'The Finnish Joint Application takes place every January, where students can apply to 6 degree programs across the nation with a single online dossier.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&w=800&q=80',
    tags: ['Finland', 'Scholarships', 'Work Rights', 'PR Pathways']
  },
  {
    id: 'b3',
    slug: 'how-to-write-a-winning-sop-for-masters',
    title: 'How to Write a Winning Statement of Purpose (SOP) Without Clichés',
    category: 'Application Tips',
    author: {
      name: 'Faiyan Chowdhury',
      role: 'Head of Academic Writing & Admissions',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    date: 'January 12, 2026',
    readTime: '7 min read',
    excerpt: 'Step-by-step masterclass on crafting an SOP that grabs admission officers’ attention: structuring your academic journey, addressing gaps, and articulating career goals.',
    content: [
      'Every year, admission committees read thousands of essays that open with generic quotes like "Since childhood, I was fascinated by computers...". Avoid these tired clichés.',
      'A compelling SOP is structured logically into four core pillars: (1) The Origin of Your Intellectual Curiosity, (2) Academic & Practical Foundations, (3) Why This Specific Program and University, and (4) Concrete Post-Graduation Career Trajectory.',
      'When addressing a study gap or lower CGPA, be honest and constructive. Focus on what you learned during that period—professional employment, online certifications, or entrepreneurial initiatives.',
      'Always customize your SOP for each institution. Mention specific faculty members, research labs, or unique curriculum modules that make that university indispensable for your future.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    tags: ['SOP Tips', 'Admissions', 'Personal Statement', 'University Guide']
  },
  {
    id: 'b4',
    slug: 'us-f1-visa-interview-mistakes-to-avoid',
    title: 'Top 7 Mistakes to Avoid at Your US F-1 Visa Interview',
    category: 'Visa',
    author: {
      name: 'Mahbubur Rahman',
      role: 'Principal Education Consultant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
    },
    date: 'December 20, 2025',
    readTime: '8 min read',
    excerpt: 'Learn the primary triggers behind 214(b) visa refusals and how to demonstrate bona fide non-immigrant intent with composure and authenticity.',
    content: [
      'Under Section 214(b) of the United States Immigration and Nationality Act, every applicant is presumed to have immigrant intent until they convince the consular officer otherwise.',
      'Mistake #1: Memorizing scripted answers. Consular officers conduct dozens of interviews daily and immediately recognize rehearsed lines. Speak naturally and conversationally.',
      'Mistake #2: Vague answers about funding. You must know your sponsor’s exact annual income, business operations, and the origin of funds in your bank statements.',
      'Mistake #3: Not knowing your course curriculum. Be ready to name 2-3 specific subjects you will study and why those courses are unavailable or less developed in Bangladesh.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tags: ['USA Visa', 'F-1 Visa', 'Visa Interview', 'Consulate Prep']
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'UK & Europe Multi-University Education Fair 2026',
    type: 'Education Fair',
    date: 'Saturday, October 10, 2026',
    time: '11:00 AM – 5:00 PM',
    location: 'Grand Sylhet Hotel & Resort, Sylhet',
    isOnline: false,
    speaker: 'International Admissions Officers from 15+ UK & European Universities',
    description: 'Meet university delegates face-to-face. Bring your academic transcripts for direct assessments, application fee waivers, and exclusive scholarship evaluations.',
    seatsRemaining: 34
  },
  {
    id: 'e2',
    title: 'Finland Autumn 2027 Joint Application Strategy Webinar',
    type: 'University Webinar',
    date: 'Wednesday, October 21, 2026',
    time: '7:00 PM – 8:30 PM (BST)',
    location: 'Zoom Online Meeting',
    isOnline: true,
    speaker: 'Nuzhat Tabassum (European Admissions Specialist)',
    description: 'Comprehensive breakdown of the Finnish Joint Application system, entrance examination formats, UAS exam tips, and how to secure 100% tuition scholarships.',
    seatsRemaining: 88
  },
  {
    id: 'e3',
    title: 'IELTS Band 7.5+ Masterclass & Mock Speaking Clinic',
    type: 'IELTS Session',
    date: 'Friday, October 30, 2026',
    time: '3:00 PM – 6:00 PM',
    location: 'COS Education Auditorium, Manru Shopping City, Chowhatta Point, Sylhet',
    isOnline: false,
    speaker: 'Certified British Council IELTS Master Trainer',
    description: 'Intensive workshop focusing on IELTS Speaking Part 2/3 techniques, common lexical mistakes, and live 1-on-1 diagnostic speaking evaluations.',
    seatsRemaining: 18
  },
  {
    id: 'e4',
    title: 'US F-1 Visa Interview Simulation & 214(b) Defence Clinic',
    type: 'Visa Seminar',
    date: 'Sunday, November 8, 2026',
    time: '4:00 PM – 6:30 PM',
    location: 'COS Education Sylhet Office + Live Stream',
    isOnline: false,
    speaker: 'Mahbubur Rahman (Over 500+ successful US/UK visa cases)',
    description: 'Learn how to answer consular questions regarding university selection, sponsor finances, and home ties with unwavering confidence.',
    seatsRemaining: 22
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'How do I start my study abroad application with COS Education?',
    answer: 'Simply book a free consultation online or walk into our Sylhet office. Our senior counselor will evaluate your academic transcripts, English score, and financial parameters to curate a tailored list of matching universities and scholarship opportunities.',
    category: 'Admissions'
  },
  {
    id: 'f2',
    question: 'Does COS Education charge any service fee for applications?',
    answer: 'For universities across our network in the UK, Finland, Malaysia, Greece, Malta, and Cyprus, our core counseling, university selection, and application processing services are 100% free of charge for students.',
    category: 'Admissions'
  },
  {
    id: 'f3',
    question: 'Can I study abroad if I have a study gap after graduation or HSC?',
    answer: 'Yes! Many institutions in the UK, Malaysia, and Europe accept reasonable study gaps when supported by verifiable professional work experience, job certificates, or entrepreneurial records. We help you present your gap constructively.',
    category: 'Admissions'
  },
  {
    id: 'f4',
    question: 'Can I study abroad without taking the IELTS exam?',
    answer: 'Yes, several universities across our network in the UK, Malaysia, and Cyprus accept Medium of Instruction (MOI) letters from recognized English-medium universities in Bangladesh, or conduct their own internal diagnostic English placement tests.',
    category: 'IELTS & English'
  },
  {
    id: 'f5',
    question: 'What are the required financial funds for a UK student visa?',
    answer: 'UKVI requires you to show unpaid course tuition plus living expenses (£9,207 for universities outside London or £12,006 inside London) held in a recognized commercial bank account for a continuous period of 28 consecutive days.',
    category: 'Scholarships & Finance'
  },
  {
    id: 'f6',
    question: 'How many hours can international students work while studying?',
    answer: 'In the UK, USA, Greece, and Cyprus, students can typically work up to 20 hours per week during term time and full-time during holidays. In Finland, international students are permitted to work up to 30 hours per week.',
    category: 'Student Life'
  },
  {
    id: 'f7',
    question: 'Can I bring my spouse/family when studying abroad?',
    answer: 'Countries like Finland allow spouses to accompany international students with full-time work rights. In the UK, dependents are currently restricted to postgraduate research degrees (PhD / Research Master’s) or government-sponsored courses.',
    category: 'Visas'
  },
  {
    id: 'f8',
    question: 'What is the visa approval rate for COS Education students?',
    answer: 'We maintain an exceptional 95%+ visa approval rate due to our stringent three-tier document audit, financial verification protocol, and thorough 1-on-1 mock interview coaching.',
    category: 'Visas'
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Mahbubur Rahman',
    role: 'Managing Director & Principal Consultant',
    experience: '12+ Years in International Higher Education',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specialties: ['UK Tier 4 & Graduate Route', 'US F-1 Admissions', 'Strategic Visa Representation']
  },
  {
    name: 'Nuzhat Tabassum',
    role: 'Head of European Admissions & Scholarships',
    experience: '8+ Years in Nordic & European Education',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    specialties: ['Finland Joint Application', 'Erasmus & Full Waivers', 'Schengen Residence Permits']
  },
  {
    name: 'Faiyan Chowdhury',
    role: 'Lead Admissions Strategist & SOP Specialist',
    experience: '7+ Years Academic Editing & Student Placement',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specialties: ['SOP & Essay Architecture', 'Study Gap Optimization', 'Interview Coaching']
  },
  {
    name: 'Sultana Parveen',
    role: 'Senior Counselor (Malaysia & Asia Pacific)',
    experience: '6+ Years in Regional Asian Hubs',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    specialties: ['Dual UK/Aus Degrees in Malaysia', 'EMGS Visa Fast-Tracking', 'Undergraduate Guidance']
  }
];
