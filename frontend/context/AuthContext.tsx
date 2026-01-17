import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  verifyMfa: (code: string, email?: string) => Promise<boolean>;
  sessionToken: string | null;
  rotateToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('idtrust_user');
      const savedToken = localStorage.getItem('idtrust_token');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setSessionToken(savedToken);
      }
    } catch (error) {
      console.error("Failed to parse auth state from storage:", error);
      // corrupt data? clear it
      localStorage.removeItem('idtrust_user');
      localStorage.removeItem('idtrust_token');
      setUser(null);
      setSessionToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const rotateToken = () => {
    const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    setSessionToken(newToken);
    localStorage.setItem('idtrust_token', newToken);
    console.debug("[Security] Session Token Rotated");
  };

  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;

      // Verify role match if needed, or just warn
      if (user.role && user.role !== role) {
        console.warn(`Role mismatch: Expected ${role}, got ${user.role}`);
        // For production, you might want to throw an error here:
        // throw new Error("Role mismatch");
      }

      setUser(user);
      setSessionToken(token);
      localStorage.setItem('idtrust_user', JSON.stringify(user));
      localStorage.setItem('idtrust_token', token);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await api.post('/signup', { name, email, password, role });
      const { user, token } = response.data;

      setUser(user);
      setSessionToken(token);
      localStorage.setItem('idtrust_user', JSON.stringify(user));
      localStorage.setItem('idtrust_token', token);
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMfa = async (email: string): Promise<void> => {
    try {
      await api.post('/send-otp', { email });
    } catch (error) {
      console.error("MFA Send API failed", error);
      throw error;
    }
  };

  const verifyMfa = async (otp: string, email?: string): Promise<boolean> => {
    const targetEmail = email || user?.email;
    if (!targetEmail) {
      console.error("MFA Verification failed: No email provided");
      return false;
    }
    try {
      // Backend expects 'token', not 'otp'
      const response = await api.post('/verify-otp', { email: targetEmail, token: otp });
      return response.data.message === 'OTP verified successfully';
    } catch (error) {
      console.error("MFA Verification API failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSessionToken(null);
    localStorage.removeItem('idtrust_user');
    localStorage.removeItem('idtrust_token');
    // Optional: Redirect to login or home implemented by consumer or router
    window.location.href = '/#/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, sendMfa, verifyMfa, sessionToken, rotateToken }}>
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
