export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface UserData {
  // Basic Info
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;

  // Social Links
  linkedin: string;
  github: string;
  portfolio: string;
  twitter: string;

  // Professional Info
  summary: string;
  skills: string[];
  languages: string[];
  certifications: string[];

  // Detailed Info
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];

  // EEO / Diversity
  gender: string;
  ethnicity: string;
  veteranStatus: string;
  disabilityStatus: string;

  // Metadata
  lastUpdated: string;
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
