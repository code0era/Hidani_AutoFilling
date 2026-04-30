import { useState, useEffect } from 'react';
import { ApplicationLog } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Building2, Briefcase, Calendar, ExternalLink, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Tracker = () => {
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    chrome.storage?.local.get(['applicationLogs'], (result) => {
      if (result.applicationLogs) {
        setLogs(result.applicationLogs as ApplicationLog[]);
      } else {
        // Mock data for initial view
        setLogs([
          { id: '1', company: 'Google', role: 'Frontend Engineer', date: '2026-04-30', status: 'submitted', url: 'https://google.com' },
          { id: '2', company: 'Meta', role: 'Software Engineer', date: '2026-04-29', status: 'submitted', url: 'https://meta.com' },
          { id: '3', company: 'NVIDIA', role: 'ASIC Design Engineer', date: '2026-04-28', status: 'submitted', url: 'https://nvidia.com' },
        ]);
      }
    });
  }, []);

  const filteredLogs = logs.filter(log => 
    log.company.toLowerCase().includes(search.toLowerCase()) || 
    log.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search applications..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {filteredLogs.length > 0 ? filteredLogs.map((log) => (
            <Card key={log.id} className="group hover:border-primary/50 transition-all cursor-default">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">{log.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="w-3 h-3" />
                    <span>{log.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Applied on {new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {log.status}
                  </span>
                  <a 
                    href={log.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <History className="w-12 h-12 opacity-20" />
              <p className="text-sm">No applications tracked yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Tracker;
