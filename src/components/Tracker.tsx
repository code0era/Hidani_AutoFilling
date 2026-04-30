import { useState, useEffect } from 'react';
import { ApplicationLog } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Building2, Briefcase, Calendar, ExternalLink, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Tracker = () => {
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    chrome.storage?.local.get(['applicationLogs'], (result) => {
      if (result.applicationLogs) {
        setLogs(result.applicationLogs as ApplicationLog[]);
      }
    });
  }, []);

  const saveLog = () => {
    if (!newCompany || !newRole) return;
    
    const newEntry: ApplicationLog = {
      id: Math.random().toString(36).substr(2, 9),
      company: newCompany,
      role: newRole,
      date: new Date().toISOString(),
      status: 'submitted',
      url: window.location.href
    };
    
    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    chrome.storage?.local.set({ applicationLogs: updatedLogs });
    
    setNewCompany('');
    setNewRole('');
    setIsAdding(false);
    
    toast({
      title: "Log Entry Created",
      description: `Tracked application for ${newCompany}`,
    });
  };

  const filteredLogs = logs.filter(log => 
    log.company.toLowerCase().includes(search.toLowerCase()) || 
    log.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Manual Entry Form */}
      <Card className="glass-card border-dashed border-white/20">
        <CardContent className="p-4 space-y-3">
          {!isAdding ? (
            <Button 
              variant="ghost" 
              onClick={() => setIsAdding(true)}
              className="w-full h-10 text-xs font-bold gap-2 text-primary hover:bg-primary/5 rounded-xl"
            >
              <History className="w-4 h-4" /> Add Manual Application Log
            </Button>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input 
                placeholder="Company Name" 
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="text-xs bg-white/5 border-white/10 h-10"
              />
              <Input 
                placeholder="Job Role / Position" 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="text-xs bg-white/5 border-white/10 h-10"
              />
              <div className="flex gap-2">
                <Button onClick={saveLog} className="premium-button flex-1 h-10 text-xs font-bold rounded-xl">Save Application</Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="h-10 text-xs rounded-xl">Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search applications..." 
          className="pl-9 h-10 text-xs glass bg-white/5 border-white/10 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pb-4">
          {filteredLogs.length > 0 ? filteredLogs.map((log) => (
            <Card key={log.id} className="group glass-card border-none hover:bg-white/10 transition-all cursor-default">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-bold text-sm truncate">{log.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="w-3 h-3 shrink-0" />
                    <span className="truncate">{log.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                    {log.status}
                  </span>
                  <a 
                    href={log.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 glass hover:bg-primary/20 rounded-lg text-muted-foreground hover:text-primary transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <History className="w-12 h-12 opacity-20" />
              <p className="text-xs">No activity tracked yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tracker;
