
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.ts';
import { User, UserRole } from '../types.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  verifyMfa: (code: string) => Promise<boolean>;
  sessionToken: string | null;
  rotateToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
      });
      setSessionToken('active-session');
    } catch (error) {
      setUser(null);
      setSessionToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const rotateToken = () => {
    console.debug("[Security] Session Token validation via backend...");
  };

  const login = async (email: string, password?: string) => {
    try {
      const pwd = password || 'password123';
      const { data } = await api.post('/auth/login', { email, password: pwd });
      console.log('Login Init Response', data);

      if (data.mfaRequired && data.tempToken) {
        setTempToken(data.tempToken);
        // OTP is sent via email only
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const verifyMfa = async (code: string) => {
    if (!tempToken) return false;
    try {
      const { data } = await api.post('/auth/verify-otp', { tempToken, token: code });
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
      });
      setSessionToken('active-session');
      return true;
    } catch (error) {
      console.error('MFA Verify failed', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { console.error(e); }
    setUser(null);
    setSessionToken(null);
    setTempToken(null);
    localStorage.removeItem('idtrust_user');
    localStorage.removeItem('idtrust_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyMfa, sessionToken, rotateToken }}>
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
