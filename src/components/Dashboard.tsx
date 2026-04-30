import React, { useState } from 'react';
import { Upload, FileText, Loader2, Sparkles, MousePointer2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { extractTextFromPdf, structureResumeData } from '@/services/pdf-parser';
import { motion } from 'framer-motion';

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
          variant: "error",
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
        variant: "info",
      });
      return;
    }
    
    setIsParsing(true);
    
    try {
      const result = await chrome.storage.local.get(['geminiKey', 'groqKey']);
      const geminiKey = result.geminiKey as string | undefined;
      const groqKey = result.groqKey as string | undefined;

      const text = await extractTextFromPdf(file);
      const structuredData = await structureResumeData(text, { geminiKey, groqKey });
      const updatedData = { ...structuredData, lastUpdated: new Date().toISOString() };
      
      // Save Local
      await chrome.storage.local.set({ userData: updatedData });

      // Sync to Cloud if logged in
      const token = localStorage.getItem('token');
      let cloudSyncStatus = '';
      
      if (token) {
        try {
          const response = await fetch('https://hidani-autofilling.onrender.com/api/profile', {
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
          console.error('Cloud auto-sync failed:', error);
        }
      }

      toast({
        title: "Success!",
        description: `Resume parsed${cloudSyncStatus}. Profile updated.`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Parsing Failed",
        description: error.message || "An error occurred during extraction.",
        variant: "error",
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
            variant: "success",
          });
        } else {
          toast({
            title: "Autofill Failed",
            description: response?.error || "Could not find a form to fill.",
            variant: "error",
          });
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight">
          Automation <span className="text-gradient">Hub</span>
        </h2>
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" /> AI-powered form intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* 1. Target Job Description */}
        <Card className="glass-card border-none overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px]">01</span>
                Job Context
              </h3>
              <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Optional</span>
            </div>
            <textarea
              placeholder="Paste job requirements to optimize filling..."
              className="w-full h-24 p-3 text-xs rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none placeholder:text-muted-foreground/50"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* 2. Candidate Resume Profile */}
        <Card className="glass-card border-none overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-[10px]">02</span>
              Resume Source
            </h3>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${fileName ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-primary/30'}`}>
                {fileName ? (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-primary truncate max-w-[200px]">{fileName}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="text-[10px] text-muted-foreground hover:text-destructive transition-colors">Change Document</button>
                  </motion.div>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-white/5 text-muted-foreground rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Drop PDF or <span className="text-primary font-bold">Browse</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Button 
          onClick={handleRunEngine}
          disabled={isParsing}
          className="premium-button h-12 text-sm font-bold rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.3)] w-full"
        >
          {isParsing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Sync Profile <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        <Button 
          onClick={handleAutofill}
          variant="outline"
          className="h-12 text-sm font-bold border-white/10 glass bg-white/5 text-white hover:bg-white/10 hover:border-white/20 rounded-2xl active:scale-95 transition-all w-full"
        >
          <MousePointer2 className="mr-2 h-4 w-4 text-primary" />
          Magic Autofill
        </Button>
      </div>

      {isParsing && (
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground animate-pulse tracking-widest uppercase">Engine analyzing resume structure...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
