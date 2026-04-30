import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Save, AlertCircle, CheckCircle2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [geminiKey, setGeminiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');

  useEffect(() => {
    chrome.storage?.local.get(['geminiKey', 'groqKey', 'openAIKey'], (result) => {
      if (result.geminiKey) setGeminiKey(result.geminiKey as string);
      if (result.groqKey) setGroqKey(result.groqKey as string);
      if (result.openAIKey) setOpenAIKey(result.openAIKey as string);
    });
  }, []);

  const saveKeys = () => {
    chrome.storage?.local.set({ geminiKey, groqKey, openAIKey }, () => {
      toast({
        title: "Security Core Updated",
        description: "Your API keys have been committed to local storage.",
      });
    });
  };

  const ApiKeyField = ({ id, label, icon: Icon, value, onChange, description }: any) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
          <Icon className="w-3 h-3 text-primary" />
        </div>
        <Label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">{label}</Label>
      </div>
      <Input 
        id={id} 
        type="password" 
        placeholder="••••••••••••••••" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all h-10 text-xs"
      />
      <p className="text-[9px] text-muted-foreground/60 px-1">{description}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight">
          System <span className="text-gradient">Config</span>
        </h2>
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-primary" /> End-to-end local encryption
        </p>
      </div>

      <Card className="glass border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Globe className="w-12 h-12 text-primary" />
        </div>
        <CardContent className="p-4 flex gap-3 relative z-10">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            API keys are stored **exclusively in your browser storage**. They are used only for resume parsing and AI mapping tasks.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-5">
          <ApiKeyField 
            id="groq" 
            label="Groq Intelligence" 
            icon={Zap}
            value={groqKey}
            onChange={setGroqKey}
            description="Ultra-fast Llama 3 inference for field mapping."
          />

          <ApiKeyField 
            id="gemini" 
            label="Google Gemini Engine" 
            icon={Globe}
            value={geminiKey}
            onChange={setGeminiKey}
            description="High-fidelity parsing for complex resumes."
          />

          <ApiKeyField 
            id="openai" 
            label="OpenAI Alternate" 
            icon={Key}
            value={openAIKey}
            onChange={setOpenAIKey}
            description="Optional backup engine for AI generation."
          />
        </div>

        <Button onClick={saveKeys} className="premium-button h-12 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 w-full">
          <Save className="w-4 h-4 mr-2" /> Commit Settings
        </Button>

        <div className="flex flex-col items-center justify-center pt-4 opacity-50">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>AutoForm OS v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
