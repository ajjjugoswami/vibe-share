import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    console.log("[USER_LOGIN]", {
      email,
      timestamp: new Date().toISOString()
    });
    
    // Mock login - will be replaced with real auth later
    setUser({
      id: "1",
      email,
      username: email.split("@")[0]
    });
  };

  const signup = async (email: string, password: string, username: string) => {
    console.log("[USER_SIGNUP]", {
      username,
      email,
      timestamp: new Date().toISOString()
    });
    
    // Mock signup - will be replaced with real auth later
    setUser({
      id: "1",
      email,
      username
    });
  };

  const logout = () => {
    console.log("[USER_LOGOUT]", {
      userId: user?.id,
      timestamp: new Date().toISOString()
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
