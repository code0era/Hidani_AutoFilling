import { useState, useEffect } from 'react';
import { UserData } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, User, MapPin, Briefcase, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    city: '',
    state: '',
    zipCode: '',
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
    summary: '',
    skills: [],
    languages: [],
    certifications: [],
    education: [],
    workExperience: [],
    projects: [],
    gender: '',
    ethnicity: '',
    veteranStatus: '',
    disabilityStatus: '',
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    // Load from storage
    chrome.storage?.local.get(['userData'], (result) => {
      if (result.userData) {
        setData(result.userData as UserData);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage?.local.set({ userData: { ...data, lastUpdated: new Date().toISOString() } }, () => {
      toast({
        title: "Profile Saved",
        description: "Your data has been updated and will be used for future applications.",
      });
    });
  };

  const updateField = (field: keyof UserData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-4 border-b pb-2 mt-6 first:mt-0">
      <Icon className="w-5 h-5 text-primary" />
      <h3 className="font-bold text-base">{title}</h3>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-card p-3 rounded-lg border shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Last synced: {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>
        <Button size="sm" onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6 pb-6">
          {/* Personal Info */}
          <section>
            <SectionHeader title="Personal Information" icon={User} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={data.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={data.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={data.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <SectionHeader title="Location" icon={MapPin} />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={data.city} onChange={(e) => updateField('city', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" value={data.state} onChange={(e) => updateField('state', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zipCode">Zip / Postal Code</Label>
                <Input id="zipCode" value={data.zipCode} onChange={(e) => updateField('zipCode', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <SectionHeader title="Online Profiles" icon={LinkIcon} />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" value={data.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="github">GitHub URL</Label>
                <Input id="github" value={data.github} onChange={(e) => updateField('github', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input id="portfolio" value={data.portfolio} onChange={(e) => updateField('portfolio', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section>
            <SectionHeader title="Professional Summary" icon={Briefcase} />
            <div className="space-y-1.5">
              <Label htmlFor="summary">Brief Bio</Label>
              <textarea
                id="summary"
                className="w-full h-24 p-2 text-sm rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none resize-none"
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
              />
            </div>
          </section>

          {/* EEO Data */}
          <section>
            <SectionHeader title="Diversity & Inclusion (EEO)" icon={ShieldCheck} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={data.gender} onChange={(e) => updateField('gender', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ethnicity">Ethnicity</Label>
                <Input id="ethnicity" value={data.ethnicity} onChange={(e) => updateField('ethnicity', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="veteranStatus">Veteran Status</Label>
                <Input id="veteranStatus" value={data.veteranStatus} onChange={(e) => updateField('veteranStatus', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="disabilityStatus">Disability Status</Label>
                <Input id="disabilityStatus" value={data.disabilityStatus} onChange={(e) => updateField('disabilityStatus', e.target.value)} />
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Profile;
