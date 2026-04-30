import { useState, useEffect } from 'react';
import { UserData, Education, WorkExperience, Reference } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, User, Briefcase, Link as LinkIcon, 
  ShieldCheck, Sparkles, Phone, GraduationCap, 
  Award, Compass, Users, BookOpen, Trash2, Plus, FileText, Brain
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-3 mb-5 mt-10 first:mt-0">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <h3 className="font-black text-xs tracking-[0.15em] uppercase text-foreground/90">{title}</h3>
      <div className="w-12 h-1 bg-primary/30 rounded-full mt-1" />
    </div>
  </div>
);

const CustomInput = ({ id, label, value, type = "text", onChange }: { id: string, label: string, value: any, type?: string, onChange: (val: string) => void }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">{label}</Label>
    <Input 
      id={id} 
      type={type}
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-white/[0.03] border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all h-10 text-xs placeholder:text-muted-foreground/30"
    />
  </div>
);

const Profile = () => {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>({
    firstName: '', middleName: '', lastName: '', preferredName: '', dob: '', age: '', gender: '', pronouns: '', maritalStatus: '', nationality: '', dualCitizenship: '', placeOfBirth: '', fullName: '',
    email: '', altEmail: '', phone: '', altPhone: '', whatsapp: '', address: '', area: '', district: '', suite: '', city: '', state: '', zipCode: '', country: '', permanentAddress: '', isPermanentSame: true,
    linkedin: '', portfolio: '', github: '', leetcode: '', hackerrank: '', twitter: '', behance: '', dribbble: '', googleScholar: '', stackOverflow: '',
    highestEducation: '', education: [], highSchoolBoard: '', highSchoolScore: '', tenthBoard: '', tenthScore: '',
    totalExperience: '', workExperience: [], currentSalary: '', expectedSalary: '', noticePeriod: '', lastWorkingDay: '',
    skills: [], softSkills: [], tools: [], languages: [], languageProficiency: '', certifications: [],
    relocation: '', preferredLocations: [], willingToTravel: '', workModel: '', earliestStartDate: '', nonCompete: '',
    workAuth: '', sponsorship: '', visaStatus: '', passportNumber: '', convictionStatus: '', convictionExplanation: '', formerEmployee: '', formerEmployeeDetails: '',
    race: '', ethnicity: '', veteranStatus: '', disabilityStatus: '', accommodationNeeded: '',
    references: [], referralSource: '', referralName: '', referralEmployeeId: '', electronicSignature: '',
    resumeUrl: '', coverLetterText: '', coverLetterUrl: '', transcriptsUrl: '', idProofUrl: '', workSamplesUrl: '',
    summary: '', lastUpdated: new Date().toISOString(), projects: [], volunteering: [], hobbies: [],
    customFields: []
  });


  const API_URL = 'https://hidani-autofilling.onrender.com/api';

  useEffect(() => {
    // Load local first
    chrome.storage?.local.get(['userData'], async (result) => {
      if (result.userData) {
        setData(prev => ({ ...prev, ...(result.userData as UserData) }));
      }

      // Then try cloud sync if token exists
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/profile`, {
            headers: { 'x-auth-token': token }
          });
          if (response.ok) {
            const cloudData = await response.json();
            if (Object.keys(cloudData).length > 0) {
              setData(prev => ({ ...prev, ...cloudData }));
              chrome.storage?.local.set({ userData: cloudData });
            }
          }
        } catch (error) {
          console.error('Cloud sync failed:', error);
        }
      }
    });
  }, []);

  const handleSave = async () => {
    const updatedData = { ...data, lastUpdated: new Date().toISOString() };
    
    // Save Local
    chrome.storage?.local.set({ userData: updatedData }, async () => {
      // Save Cloud if token exists
      const token = localStorage.getItem('token');
      let cloudSyncStatus = '';
      
      if (token) {
        try {
          const response = await fetch(`${API_URL}/profile`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-auth-token': token 
            },
            body: JSON.stringify(updatedData)
          });
          if (response.ok) {
            cloudSyncStatus = ' & Cloud Core Synced';
          }
        } catch (error) {
          console.error('Cloud save failed:', error);
        }
      }

      toast({ 
        title: "Intelligence Core Updated", 
        description: `Local storage committed${cloudSyncStatus}.`,
        variant: "success" 
      });
    });
  };


  const updateField = (field: keyof UserData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    const newEdu: Education = { school: '', degree: '', fieldOfStudy: '', minor: '', startDate: '', endDate: '', status: '', gradingSystem: '', gpa: '' };
    updateField('education', [newEdu, ...data.education]);
  };

  const addWork = () => {
    const newWork: WorkExperience = { company: '', title: '', employmentType: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '', reasonForLeaving: '' };
    updateField('workExperience', [newWork, ...data.workExperience]);
  };

  const addReference = () => {
    const newRef: Reference = { name: '', title: '', company: '', email: '', phone: '', relationship: '' };
    updateField('references', [newRef, ...data.references]);
  };

  const addCustomField = () => {
    const newField = { id: Math.random().toString(36).substr(2, 9), label: '', value: '' };
    updateField('customFields', [...(data.customFields || []), newField]);
  };


  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center glass p-3 rounded-2xl border-white/10 sticky top-0 z-20 backdrop-blur-xl bg-background/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground ml-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="uppercase tracking-widest">Universal Profile Engine: <span className="text-white">Active</span></span>
        </div>
        <Button size="sm" onClick={handleSave} className="premium-button gap-2 rounded-xl h-9 px-4 text-xs font-bold shadow-lg shadow-primary/20">
          <Save className="w-3.5 h-3.5" /> Commit
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-10">
          {/* 1. Personal & Demographic */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Personal Core" icon={User} />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <CustomInput id="fullName" label="NAME" value={data.fullName} onChange={(val) => updateField('fullName', val)} />
              </div>
              <CustomInput id="firstName" label="First Name" value={data.firstName} onChange={(val) => updateField('firstName', val)} />
              <CustomInput id="lastName" label="Last Name" value={data.lastName} onChange={(val) => updateField('lastName', val)} />

              <CustomInput id="middleName" label="Middle Name" value={data.middleName} onChange={(val) => updateField('middleName', val)} />
              <CustomInput id="preferredName" label="Preferred Name" value={data.preferredName} onChange={(val) => updateField('preferredName', val)} />
              <CustomInput id="dob" label="Date of Birth" value={data.dob} type="date" onChange={(val) => updateField('dob', val)} />
              <CustomInput id="age" label="Age" value={data.age} onChange={(val) => updateField('age', val)} />
              <CustomInput id="gender" label="Gender" value={data.gender} onChange={(val) => updateField('gender', val)} />
              <CustomInput id="pronouns" label="Pronouns" value={data.pronouns} onChange={(val) => updateField('pronouns', val)} />
              <CustomInput id="maritalStatus" label="Marital Status" value={data.maritalStatus} onChange={(val) => updateField('maritalStatus', val)} />
              <CustomInput id="nationality" label="Nationality" value={data.nationality} onChange={(val) => updateField('nationality', val)} />
              <CustomInput id="dualCitizenship" label="Dual Citizenship?" value={data.dualCitizenship} onChange={(val) => updateField('dualCitizenship', val)} />
              <CustomInput id="placeOfBirth" label="Place of Birth" value={data.placeOfBirth} onChange={(val) => updateField('placeOfBirth', val)} />
            </div>
          </section>

          {/* 2. Contact Information */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Contact Signal" icon={Phone} />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <CustomInput id="email" label="Email ID" value={data.email} onChange={(val) => updateField('email', val)} />
              </div>
              <CustomInput id="phone" label="NUMBER" value={data.phone} onChange={(val) => updateField('phone', val)} />
              <CustomInput id="altPhone" label="Alt Phone" value={data.altPhone} onChange={(val) => updateField('altPhone', val)} />
              <div className="col-span-2">
                <CustomInput id="whatsapp" label="WhatsApp Number" value={data.whatsapp} onChange={(val) => updateField('whatsapp', val)} />
              </div>
              <div className="col-span-2 space-y-4 pt-2">
                <CustomInput id="address" label="Current Address" value={data.address} onChange={(val) => updateField('address', val)} />
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput id="area" label="Area" value={data.area} onChange={(val) => updateField('area', val)} />
                  <CustomInput id="district" label="District" value={data.district} onChange={(val) => updateField('district', val)} />
                  <CustomInput id="city" label="City" value={data.city} onChange={(val) => updateField('city', val)} />
                  <CustomInput id="state" label="State" value={data.state} onChange={(val) => updateField('state', val)} />
                  <CustomInput id="zipCode" label="Zip / Pin Code" value={data.zipCode} onChange={(val) => updateField('zipCode', val)} />
                  <CustomInput id="country" label="Country" value={data.country} onChange={(val) => updateField('country', val)} />
                </div>
                <CustomInput id="permanentAddress" label="Permanent Address" value={data.permanentAddress} onChange={(val) => updateField('permanentAddress', val)} />
              </div>
            </div>
          </section>

          {/* 3. Links & Professional Profiles */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Neural Network" icon={LinkIcon} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput id="linkedin" label="LinkedIn URL" value={data.linkedin} onChange={(val) => updateField('linkedin', val)} />
              <CustomInput id="portfolio" label="Portfolio URL" value={data.portfolio} onChange={(val) => updateField('portfolio', val)} />
              <CustomInput id="github" label="GitHub/GitLab" value={data.github} onChange={(val) => updateField('github', val)} />
              <CustomInput id="leetcode" label="LeetCode" value={data.leetcode} onChange={(val) => updateField('leetcode', val)} />
              <CustomInput id="hackerrank" label="HackerRank" value={data.hackerrank} onChange={(val) => updateField('hackerrank', val)} />
              <CustomInput id="twitter" label="Twitter / X" value={data.twitter} onChange={(val) => updateField('twitter', val)} />
              <CustomInput id="behance" label="Behance" value={data.behance} onChange={(val) => updateField('behance', val)} />
              <CustomInput id="dribbble" label="Dribbble" value={data.dribbble} onChange={(val) => updateField('dribbble', val)} />
              <CustomInput id="googleScholar" label="Google Scholar" value={data.googleScholar} onChange={(val) => updateField('googleScholar', val)} />
              <CustomInput id="stackOverflow" label="StackOverflow" value={data.stackOverflow} onChange={(val) => updateField('stackOverflow', val)} />
            </div>
          </section>

          {/* 4. Education Details */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <div className="flex justify-between items-center pr-2">
              <SectionHeader title="Academic History" icon={GraduationCap} />
              <Button size="icon" variant="ghost" onClick={addEducation} className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <CustomInput id="highestEducation" label="Highest Degree" value={data.highestEducation} onChange={(val) => updateField('highestEducation', val)} />
              {data.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4 relative group">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => updateField('education', data.education.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomInput id={`edu-school-${idx}`} label="Institution" value={edu.school} onChange={(v) => { const n = [...data.education]; n[idx].school = v; updateField('education', n); }} />
                    <CustomInput id={`edu-degree-${idx}`} label="Degree" value={edu.degree} onChange={(v) => { const n = [...data.education]; n[idx].degree = v; updateField('education', n); }} />
                    <CustomInput id={`edu-start-${idx}`} label="Start Date" value={edu.startDate} onChange={(v) => { const n = [...data.education]; n[idx].startDate = v; updateField('education', n); }} />
                    <CustomInput id={`edu-end-${idx}`} label="End Date" value={edu.endDate} onChange={(v) => { const n = [...data.education]; n[idx].endDate = v; updateField('education', n); }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Work Experience */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <div className="flex justify-between items-center pr-2">
              <SectionHeader title="Professional Stream" icon={Briefcase} />
              <Button size="icon" variant="ghost" onClick={addWork} className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <CustomInput id="totalExperience" label="Total Years Exp" value={data.totalExperience} onChange={(val) => updateField('totalExperience', val)} />
              {data.workExperience.map((work, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4 relative group">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => updateField('workExperience', data.workExperience.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomInput id={`work-comp-${idx}`} label="Company" value={work.company} onChange={(v) => { const n = [...data.workExperience]; n[idx].company = v; updateField('workExperience', n); }} />
                    <CustomInput id={`work-title-${idx}`} label="Title" value={work.title} onChange={(v) => { const n = [...data.workExperience]; n[idx].title = v; updateField('workExperience', n); }} />
                    <CustomInput id={`work-start-${idx}`} label="Start" value={work.startDate} onChange={(v) => { const n = [...data.workExperience]; n[idx].startDate = v; updateField('workExperience', n); }} />
                    <CustomInput id={`work-end-${idx}`} label="End" value={work.endDate} onChange={(v) => { const n = [...data.workExperience]; n[idx].endDate = v; updateField('workExperience', n); }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Skills & Certifications */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Skill Matrix" icon={Award} />
            <div className="space-y-4">
              <CustomInput id="languageProficiency" label="Language Proficiency" value={data.languageProficiency} onChange={(val) => updateField('languageProficiency', val)} />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Core Expertise</Label>
                <textarea 
                  className="w-full h-24 p-3 text-xs rounded-xl bg-white/[0.03] border border-white/10 focus:border-primary/50 outline-none resize-none"
                  value={data.skills.join(', ')}
                  onChange={(e) => updateField('skills', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Primary skills (comma separated)..."
                />
              </div>
            </div>
          </section>

          {/* 7. Job Preferences & Logistics */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Logistics Config" icon={Compass} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput id="relocation" label="Relocation OK?" value={data.relocation} onChange={(val) => updateField('relocation', val)} />
              <CustomInput id="willingToTravel" label="Willing to Travel (%)" value={data.willingToTravel} onChange={(val) => updateField('willingToTravel', val)} />
              <CustomInput id="workModel" label="Work Mode" value={data.workModel} onChange={(val) => updateField('workModel', val)} />
              <CustomInput id="earliestStartDate" label="Availability Date" value={data.earliestStartDate} type="date" onChange={(val) => updateField('earliestStartDate', val)} />
              <CustomInput id="currentSalary" label="Current CTC" value={data.currentSalary} onChange={(val) => updateField('currentSalary', val)} />
              <CustomInput id="expectedSalary" label="Expected CTC" value={data.expectedSalary} onChange={(val) => updateField('expectedSalary', val)} />
            </div>
          </section>

          {/* 8. Work Authorization & Legal */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Legal & Auth" icon={ShieldCheck} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput id="workAuth" label="Auth to Work?" value={data.workAuth} onChange={(val) => updateField('workAuth', val)} />
              <CustomInput id="sponsorship" label="Need Sponsorship?" value={data.sponsorship} onChange={(val) => updateField('sponsorship', val)} />
              <CustomInput id="visaStatus" label="Visa Status" value={data.visaStatus} onChange={(val) => updateField('visaStatus', val)} />
              <CustomInput id="passportNumber" label="Passport Number" value={data.passportNumber} onChange={(val) => updateField('passportNumber', val)} />
              <CustomInput id="convictionStatus" label="Legal Conviction?" value={data.convictionStatus} onChange={(val) => updateField('convictionStatus', val)} />
              <CustomInput id="formerEmployee" label="Worked here before?" value={data.formerEmployee} onChange={(val) => updateField('formerEmployee', val)} />
            </div>
          </section>

          {/* 9. Diversity, Equity & Inclusion */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Diversity & EEO" icon={Users} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput id="race" label="Race / Ethnicity" value={data.race} onChange={(val) => updateField('race', val)} />
              <CustomInput id="veteranStatus" label="Veteran Status" value={data.veteranStatus} onChange={(val) => updateField('veteranStatus', val)} />
              <CustomInput id="disabilityStatus" label="Disability Status" value={data.disabilityStatus} onChange={(val) => updateField('disabilityStatus', val)} />
              <CustomInput id="accommodationNeeded" label="Accommodations?" value={data.accommodationNeeded} onChange={(val) => updateField('accommodationNeeded', val)} />
            </div>
          </section>

          {/* 10. References */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <div className="flex justify-between items-center pr-2">
              <SectionHeader title="Network References" icon={BookOpen} />
              <Button size="icon" variant="ghost" onClick={addReference} className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-6">
              {data.references.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-4 relative group">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => updateField('references', data.references.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <CustomInput id={`ref-name-${idx}`} label="Name" value={ref.name} onChange={(v) => { const n = [...data.references]; n[idx].name = v; updateField('references', n); }} />
                    <CustomInput id={`ref-title-${idx}`} label="Relationship" value={ref.relationship} onChange={(v) => { const n = [...data.references]; n[idx].relationship = v; updateField('references', n); }} />
                    <CustomInput id={`ref-phone-${idx}`} label="Phone" value={ref.phone} onChange={(v) => { const n = [...data.references]; n[idx].phone = v; updateField('references', n); }} />
                    <CustomInput id={`ref-email-${idx}`} label="Email" value={ref.email} onChange={(v) => { const n = [...data.references]; n[idx].email = v; updateField('references', n); }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 11. Attachments & Documents */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Attachments & Docs" icon={FileText} />
            <div className="space-y-4">
              <CustomInput id="resumeUrl" label="Resume / CV Link" value={data.resumeUrl} onChange={(val) => updateField('resumeUrl', val)} />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Cover Letter Text</Label>
                <textarea 
                  className="w-full h-32 p-3 text-xs rounded-xl bg-white/[0.03] border border-white/10 focus:border-primary/50 outline-none resize-none transition-all"
                  value={data.coverLetterText}
                  onChange={(e) => updateField('coverLetterText', e.target.value)}
                  placeholder="Paste your universal cover letter here..."
                />
              </div>
              <CustomInput id="coverLetterUrl" label="Cover Letter (File Link)" value={data.coverLetterUrl} onChange={(val) => updateField('coverLetterUrl', val)} />
              <CustomInput id="transcriptsUrl" label="Transcripts / Marksheets Link" value={data.transcriptsUrl} onChange={(val) => updateField('transcriptsUrl', val)} />
              <CustomInput id="idProofUrl" label="ID Proof / Passport Copy Link" value={data.idProofUrl} onChange={(val) => updateField('idProofUrl', val)} />
              <CustomInput id="workSamplesUrl" label="Work Samples / Portfolio Link" value={data.workSamplesUrl} onChange={(val) => updateField('workSamplesUrl', val)} />
            </div>
          </section>

          {/* 12. Miscellaneous */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <SectionHeader title="Miscellaneous" icon={Sparkles} />
            <div className="grid grid-cols-2 gap-4">
              <CustomInput id="referralSource" label="Source" value={data.referralSource} onChange={(val) => updateField('referralSource', val)} />
              <CustomInput id="referralName" label="Referrer Name" value={data.referralName} onChange={(val) => updateField('referralName', val)} />
              <CustomInput id="referralEmployeeId" label="Referrer ID" value={data.referralEmployeeId} onChange={(val) => updateField('referralEmployeeId', val)} />
              <CustomInput id="electronicSignature" label="E-Signature" value={data.electronicSignature} onChange={(val) => updateField('electronicSignature', val)} />
            </div>
          </section>

          {/* 13. Custom Intelligence Vault */}
          <section className="glass-card p-5 rounded-2xl border-none">
            <div className="flex justify-between items-center pr-2">
              <SectionHeader title="Custom Memory Vault" icon={Brain} />
              <Button size="icon" variant="ghost" onClick={addCustomField} className="h-8 w-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {data.customFields?.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-[1fr_1fr_40px] gap-3 items-end">
                  <CustomInput 
                    id={`custom-label-${idx}`} 
                    label="Field Label" 
                    value={field.label} 
                    onChange={(v) => {
                      const n = [...(data.customFields || [])];
                      n[idx].label = v;
                      updateField('customFields', n);
                    }} 
                  />
                  <CustomInput 
                    id={`custom-value-${idx}`} 
                    label="Stored Value" 
                    value={field.value} 
                    onChange={(v) => {
                      const n = [...(data.customFields || [])];
                      n[idx].value = v;
                      updateField('customFields', n);
                    }} 
                  />
                  <Button 
                    variant="ghost" size="icon" 
                    className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    onClick={() => updateField('customFields', data.customFields?.filter(f => f.id !== field.id))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!data.customFields || data.customFields.length === 0) && (
                <p className="text-[10px] text-center text-muted-foreground py-4 italic">No custom fields defined. Click + to add specialized data points.</p>
              )}
            </div>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
};

export default Profile;
