import { useState, useEffect } from 'react';
import { MemoryVaultEntry } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Search, MessageSquareQuote, Trash2, Zap } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MemoryVault = () => {
  const [entries, setEntries] = useState<MemoryVaultEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    chrome.storage?.local.get(['memoryVault'], (result) => {
      if (result.memoryVault) {
        setEntries(result.memoryVault as MemoryVaultEntry[]);
      } else {
        // Mock data
        setEntries([
          { question: "Why do you want to work at our company?", answer: "I admire your commitment to innovation and the impact of your products on global sustainability." },
          { question: "What is your greatest technical achievement?", answer: "Building a distributed system that processed 1M+ transactions per day with 99.9% uptime." },
          { question: "Describe a time you solved a complex bug.", answer: "Identified a race condition in a multi-threaded app by using advanced memory profiling tools." },
        ]);
      }
    });
  }, []);

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
      <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
        <Zap className="w-5 h-5 text-primary" />
        <p className="text-xs text-muted-foreground font-medium">
          The Memory Vault stores your custom answers. The AI uses these to automatically draft responses for new applications.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search your answers..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {filteredEntries.length > 0 ? filteredEntries.map((entry, idx) => (
            <Card key={idx} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <p className="text-sm font-bold leading-tight">{entry.question}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => deleteEntry(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-muted/30 p-3 rounded-md text-xs text-foreground italic border-l-2 border-muted border-dashed">
                  "{entry.answer}"
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Brain className="w-12 h-12 opacity-20" />
              <p className="text-sm">Your memory vault is empty.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MemoryVault;
