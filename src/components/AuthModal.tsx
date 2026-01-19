import { X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal = ({ onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      console.log("[USER_LOGIN]", {
        email,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log("[USER_SIGNUP]", {
        username,
        email,
        timestamp: new Date().toISOString()
      });
    }
    
    onLogin();
  };

  const handleToggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    console.log("[AUTH_MODE_TOGGLE]", {
      mode: newMode ? "login" : "signup",
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-card rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">vibecheck</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-1">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isLogin 
            ? "Sign in to share your playlists" 
            : "Join to start sharing your music taste"
          }
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 rounded-lg bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-lg bg-secondary border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          
          <Button type="submit" variant="accent" className="w-full">
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={handleToggleMode}
            className="text-accent font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
