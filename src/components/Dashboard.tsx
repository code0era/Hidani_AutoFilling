import React, { useState } from 'react';
import { Upload, FileText, Loader2, Sparkles, MousePointer2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { extractTextFromPdf, structureResumeData } from '@/services/pdf-parser';

const Dashboard = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF resume.",
          variant: "destructive",
        });
        return;
      }
      setFile(file);
      setFileName(file.name);
    }
  };

  const handleRunEngine = async () => {
    if (!file) {
      toast({
        title: "Missing Resume",
        description: "Please upload a candidate resume first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsParsing(true);
    
    try {
      // 1. Get API Keys
      const result = await chrome.storage.local.get(['geminiKey', 'groqKey']);
      const geminiKey = result.geminiKey as string | undefined;
      const groqKey = result.groqKey as string | undefined;

      if (!geminiKey && !groqKey) {
        throw new Error('Please add your Groq or Gemini API Key in the Settings tab.');
      }

      // 2. Extract Text
      const text = await extractTextFromPdf(file);
      
      // 3. AI Structuring
      const structuredData = await structureResumeData(text, { 
        geminiKey, 
        groqKey 
      });
      
      // 4. Save to Storage
      await chrome.storage.local.set({ userData: { ...structuredData, lastUpdated: new Date().toISOString() } });

      toast({
        title: "Success!",
        description: "Resume parsed and profile updated.",
      });
    } catch (error: any) {
      toast({
        title: "Parsing Failed",
        description: error.message || "An error occurred during extraction.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleAutofill = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'autofill' }, (response) => {
        if (response?.success) {
          toast({
            title: "Magic Autofill Success",
            description: "Data has been populated into the form.",
          });
        } else {
          toast({
            title: "Autofill Failed",
            description: response?.error || "Could not find a form to fill.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
          Resume NLP Matcher
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Rule-based Parsing completely independent of Generalized AI models.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 1. Target Job Description */}
        <Card className="border-2 border-muted/50 shadow-sm hover:border-primary/20 transition-all">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Target Job Description
            </h3>
            <textarea
              placeholder="Paste the target job description here..."
              className="w-full h-32 p-3 text-sm rounded-md border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* 2. Candidate Resume Profile */}
        <Card className="border-2 border-muted/50 shadow-sm hover:border-primary/20 transition-all">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Candidate Resume Profile
            </h3>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all ${fileName ? 'bg-primary/5 border-primary/50' : 'bg-muted/30 border-muted group-hover:border-primary/50 group-hover:bg-primary/5'}`}>
                {fileName ? (
                  <>
                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-primary">{fileName}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="text-xs text-muted-foreground hover:text-destructive underline">Change file</button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary/10 text-primary/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Drag & drop a PDF resume here, or <span className="text-primary font-semibold">click to browse</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={handleRunEngine}
          disabled={isParsing}
          className="h-12 text-sm font-bold bg-[#10b981] hover:bg-[#059669] text-white shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          {isParsing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Parse Resume
            </>
          )}
        </Button>

        <Button 
          onClick={handleAutofill}
          variant="outline"
          className="h-12 text-sm font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all"
        >
          <MousePointer2 className="mr-2 h-4 w-4" />
          Magic Fill
        </Button>
      </div>

      {isParsing && (
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground animate-pulse">Processing resume using rule-based NLP...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
