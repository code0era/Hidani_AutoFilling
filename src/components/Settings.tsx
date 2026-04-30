import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
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
        title: "Settings Updated",
        description: "Your API keys have been saved securely.",
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            API keys are required for <strong>Resume Parsing</strong> and <strong>AI Field Mapping</strong>. 
            They are stored locally in your browser and are never shared.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold border-b pb-2">
            <Key className="w-4 h-4 text-primary" />
            AI Service Configuration
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="groq">Groq API Key (Llama 3)</Label>
              <Input 
                id="groq" 
                type="password" 
                placeholder="Enter Groq API Key..." 
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">High-speed inference using Llama 3 models.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gemini">Google Gemini API Key</Label>
              <Input 
                id="gemini" 
                type="password" 
                placeholder="Enter Gemini API Key..." 
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Used for high-speed resume parsing and matching.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="openai">OpenAI API Key (Optional)</Label>
              <Input 
                id="openai" 
                type="password" 
                placeholder="Enter OpenAI API Key..." 
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Alternative engine for custom question generation.</p>
            </div>
          </div>
        </div>

        <Button onClick={saveKeys} className="w-full gap-2 font-bold shadow-sm">
          <Save className="w-4 h-4" /> Save Configuration
        </Button>

        <div className="flex flex-col items-center justify-center pt-8 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Core Extension Version 1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
