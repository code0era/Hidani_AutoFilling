import { useState, useEffect } from 'react';
import { MemoryVaultEntry } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Search, MessageSquareQuote, Trash2, Zap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const MemoryVault = () => {
  const [entries, setEntries] = useState<MemoryVaultEntry[]>([]);
  const [search, setSearch] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    chrome.storage?.local.get(['memoryVault'], (result) => {
      if (result.memoryVault) {
        setEntries(result.memoryVault as MemoryVaultEntry[]);
      }
    });
  }, []);

  const saveEntry = () => {
    if (!newQuestion || !newAnswer) return;
    
    const newEntry: MemoryVaultEntry = {
      question: newQuestion,
      answer: newAnswer,
      category: 'General',
      lastUsed: new Date().toISOString()
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    chrome.storage?.local.set({ memoryVault: updatedEntries });
    
    setNewQuestion('');
    setNewAnswer('');
    setIsAdding(false);
    
    toast({
      title: "Memory Synthesized",
      description: "This answer has been added to your AI core.",
    });
  };

  const deleteEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
    chrome.storage?.local.set({ memoryVault: newEntries });
  };

  const filteredEntries = entries.filter(e => 
    e.question.toLowerCase().includes(search.toLowerCase()) || 
    e.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Add New Entry Form */}
      <Card className="glass-card border-dashed border-white/20">
        <CardContent className="p-4 space-y-3">
          {!isAdding ? (
            <Button 
              variant="ghost" 
              onClick={() => setIsAdding(true)}
              className="w-full h-10 text-xs font-bold gap-2 text-primary hover:bg-primary/5 rounded-xl"
            >
              <Zap className="w-4 h-4" /> Add New Response to Memory
            </Button>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input 
                placeholder="Question (e.g., Why do you want to work here?)" 
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="text-xs bg-white/5 border-white/10 h-10"
              />
              <textarea 
                placeholder="Your optimized answer..." 
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full h-24 p-3 text-xs rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={saveEntry} className="premium-button flex-1 h-10 text-xs font-bold rounded-xl">Commit to Memory</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-10 text-xs rounded-xl">Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search your answers..." 
          className="pl-9 h-10 text-xs glass bg-white/5 border-white/10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 pb-4">
          {filteredEntries.length > 0 ? filteredEntries.map((entry, idx) => (
            <Card key={idx} className="group glass-card overflow-hidden border-l-4 border-l-primary hover:border-white/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <p className="text-sm font-bold leading-tight">{entry.question}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteEntry(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-xs text-foreground/80 italic border border-white/5">
                  "{entry.answer}"
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Brain className="w-12 h-12 opacity-20" />
              <p className="text-xs">Your memory vault is waiting for data.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemoryVault;
