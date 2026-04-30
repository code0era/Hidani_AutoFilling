import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, History, Brain, Settings as SettingsIcon, LayoutDashboard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Tracker from './components/Tracker';
import MemoryVault from './components/MemoryVault';
import Settings from './components/Settings';
import Auth from './components/Auth';

import { Toaster } from "@/components/ui/toaster";
import { Lock as LockIcon } from 'lucide-react';


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleAuthSuccess = () => {
    setToken(localStorage.getItem('token'));
    setActiveTab('dashboard');
  };

  return (
    <div className="w-[450px] h-[600px] bg-background text-foreground flex flex-col overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[100px] rounded-full" />

      <header className="p-5 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="text-primary w-6 h-6 fill-primary/20" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none">
              AUTO<span className="text-gradient">FORM</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80">AI Engine 1.0</p>
          </div>
        </div>
        {token && (
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 flex items-center justify-center glass-card rounded-full hover:scale-110 active:scale-95 transition-all"
          >
            <SettingsIcon className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
          </button>
        )}
      </header>

      <main className="flex-1 overflow-hidden flex flex-col z-10 relative">
        {!token ? (
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <Auth onAuthSuccess={handleAuthSuccess} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <div className="px-5 py-2">
              <TabsList className="grid grid-cols-5 w-full h-12 glass rounded-2xl p-1 gap-1">
                <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:glass data-[state=active]:bg-white/10 transition-all duration-300">
                  <LayoutDashboard className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="profile" className="rounded-xl data-[state=active]:glass data-[state=active]:bg-white/10 transition-all duration-300">
                  <User className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="tracker" className="rounded-xl data-[state=active]:glass data-[state=active]:bg-white/10 transition-all duration-300">
                  <History className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="memory" className="rounded-xl data-[state=active]:glass data-[state=active]:bg-white/10 transition-all duration-300">
                  <Brain className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="auth" className="rounded-xl data-[state=active]:glass data-[state=active]:bg-white/10 transition-all duration-300">
                  <LockIcon className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
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
                  <TabsContent value="auth" className="m-0 h-full">
                    <Auth onAuthSuccess={handleAuthSuccess} />
                  </TabsContent>
                  <TabsContent value="settings" className="m-0 h-full">
                    <Settings />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        )}
      </main>
      
      <Toaster />
    </div>
  );
};


export default App;
