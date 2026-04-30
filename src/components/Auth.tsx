import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, Lock, UserPlus, LogIn, LogOut } from 'lucide-react';

const Auth = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const API_URL = 'https://hidani-autofilling.onrender.com/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data || 'Auth failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      
      toast({
        title: isLogin ? "Welcome Back!" : "Account Created",
        description: "Successfully authenticated with central intelligence.",
        variant: "success"
      });

      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Auth Error",
        description: error.message,
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  const storedEmail = localStorage.getItem('userEmail');

  if (storedEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xl">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black">Session Active</h2>
          <p className="text-xs text-muted-foreground">{storedEmail}</p>
        </div>
        <Button variant="outline" onClick={logout} className="gap-2 rounded-xl border-white/10 glass w-full">
          <LogOut className="w-4 h-4" /> Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight">{isLogin ? 'Initialize Session' : 'Create Identity'}</h2>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Secure Cloud Synchronization</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Email Terminal</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              type="email" 
              placeholder="name@company.com" 
              className="pl-10 bg-white/5 border-white/10 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Security Key</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 bg-white/5 border-white/10 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="premium-button w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <span className="flex items-center gap-2">
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isLogin ? 'Authenticate' : 'Register Core'}
            </span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
        >
          {isLogin ? "Don't have an identity? Create one" : "Already registered? Authenticate"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
