import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, History, Brain, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Tracker from './components/Tracker';
import MemoryVault from './components/MemoryVault';
import Settings from './components/Settings';
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="w-[450px] h-[600px] bg-background text-foreground flex flex-col overflow-hidden">
      <header className="p-4 border-b flex justify-between items-center bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="text-primary-foreground w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">AutoForm <span className="text-primary">AI</span></h1>
        </div>
        <button 
          onClick={() => setActiveTab('settings')}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <div className="px-4 py-2 bg-card border-b sticky top-0 z-10">
            <TabsList className="grid grid-cols-4 w-full h-10">
              <TabsTrigger value="dashboard" title="Dashboard">
                <LayoutDashboard className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="profile" title="Profile">
                <User className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="tracker" title="Tracker">
                <History className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="memory" title="Memory Vault">
                <Brain className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 p-4">
            <TabsContent value="dashboard" className="m-0 h-full">
              <Dashboard />
            </TabsContent>
            <TabsContent value="profile" className="m-0 h-full">
              <Profile />
            </TabsContent>
            <TabsContent value="tracker" className="m-0 h-full">
              <Tracker />
            </TabsContent>
            <TabsContent value="memory" className="m-0 h-full">
              <MemoryVault />
            </TabsContent>
            <TabsContent value="settings" className="m-0 h-full">
              <Settings />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <Toaster />
    </div>
  );
};

export default App;
