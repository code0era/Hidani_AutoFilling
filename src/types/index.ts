export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  minor?: string;
  startDate: string;
  endDate: string;
  status: string; // Graduated, Pursuing, etc.
  gradingSystem: string; // CGPA, GPA, etc.
  gpa: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  employmentType: string; // Full-time, etc.
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  reasonForLeaving?: string;
}

export interface Reference {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface UserData {
  // 1. Personal & Demographic
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  dob: string;
  age: string;
  gender: string;
  pronouns: string;
  maritalStatus: string;
  nationality: string;
  dualCitizenship: string;
  placeOfBirth: string;
  fullName: string;
  
  // 2. Contact Information
  email: string;
  altEmail: string;
  phone: string;
  altPhone: string;
  whatsapp: string;

  address: string; // Current
  area: string;
  district: string;
  suite: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  permanentAddress: string;
  isPermanentSame: boolean;

  // 3. Links & Professional Profiles
  linkedin: string;
  portfolio: string;
  github: string;
  leetcode: string;
  hackerrank: string;
  twitter: string;
  behance: string;
  dribbble: string;
  googleScholar: string;
  stackOverflow: string;

  // 4. Education Details
  highestEducation: string;
  education: Education[];
  highSchoolBoard: string;
  highSchoolScore: string;
  tenthBoard: string;
  tenthScore: string;

  // 5. Work Experience
  totalExperience: string;
  workExperience: WorkExperience[];
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  lastWorkingDay: string;

  // 6. Skills & Certifications
  skills: string[];
  softSkills: string[];
  tools: string[];
  languages: string[];
  languageProficiency: string;
  certifications: string[];

  // 7. Job Preferences & Logistics
  relocation: string;
  preferredLocations: string[];
  willingToTravel: string;
  workModel: string;
  earliestStartDate: string;
  nonCompete: string;

  // 8. Work Authorization & Legal
  workAuth: string;
  sponsorship: string;
  visaStatus: string;
  passportNumber: string;
  convictionStatus: string;
  convictionExplanation: string;
  formerEmployee: string;
  formerEmployeeDetails: string;

  // 9. Diversity, Equity & Inclusion
  race: string;
  ethnicity: string;
  veteranStatus: string;
  disabilityStatus: string;
  accommodationNeeded: string;

  // 10. References
  references: Reference[];

  // 12. Miscellaneous
  referralSource: string;
  referralName: string;
  referralEmployeeId: string;
  electronicSignature: string;

  // 11. Attachments & Documents
  resumeUrl: string;
  coverLetterText: string;
  coverLetterUrl: string;
  transcriptsUrl: string;
  idProofUrl: string;
  workSamplesUrl: string;

  // Metadata
  summary: string;
  lastUpdated: string;
  customFields?: { id: string; label: string; value: string }[];
  projects: Project[];
  volunteering: string[];
  hobbies: string[];
}


export interface ApplicationLog {
  id: string;
  company: string;
  role: string;
  date: string;
  status: 'submitted' | 'failed' | 'pending';
  url: string;
}

export interface MemoryVaultEntry {
  question: string;
  answer: string;
  category?: string;
  lastUsed?: string;
}
