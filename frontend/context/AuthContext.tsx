
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  verifyMfa: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial session check
    const savedUser = localStorage.getItem('idtrust_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      role,
      avatar: `https://picsum.photos/seed/${email}/200`
    };
    setUser(newUser);
    localStorage.setItem('idtrust_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const verifyMfa = async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return code === '123456'; // Default mock OTP
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('idtrust_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyMfa }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
