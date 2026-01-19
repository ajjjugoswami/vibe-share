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
    // For now, just simulate login
    console.log(isLogin ? "LOGIN" : "SIGNUP", { email, password, username });
    onLogin();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold neon-text-pink">vibecheck</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-bold mb-2">
          {isLogin ? "Welcome back" : "Join the vibe"} ✨
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isLogin 
            ? "Sign in to share your playlists with the world" 
            : "Create an account to start sharing your music taste"
          }
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-muted border-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple"
          />
          
          <Button type="submit" variant="neon" size="lg" className="w-full">
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-cyan font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>

        {/* Anonymous note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          You can browse playlists without an account 🎵
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
