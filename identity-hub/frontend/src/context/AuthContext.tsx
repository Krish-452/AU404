import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.ts';
import type { User, AuthState } from '../types.ts';

interface LoginResponse {
    message?: string;
    mfaRequired?: boolean;
    tempToken?: string;
    user?: User;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ mfaRequired: boolean; tempToken?: string }>;
    verifyOtp: (tempToken: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const checkAuth = async () => {
        try {
            const { data } = await api.get<User>('/auth/me');
            setState({ user: data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            setState({ user: null, isAuthenticated: false, isLoading: false });
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        // Step 1: Validate credentials
        const { data } = await api.post<LoginResponse>('/auth/login', { email, password });

        // If MFA required, return the temp token to the component to handle the second step
        if (data.mfaRequired && data.tempToken) {
            return { mfaRequired: true, tempToken: data.tempToken };
        }

        // If NO MFA (unlikely given requirements, but good for robust code), we are done
        // However, backend design currently enforces MFA flow or sets cookie. 
        // If backend Set-Cookie here directly, we just update state.
        // Note: Our backend login ONLY returns mfaRequired: true currently.
        return { mfaRequired: true, tempToken: data.tempToken };
    };

    const verifyOtp = async (tempToken: string, otp: string) => {
        const { data } = await api.post<User>('/auth/verify-otp', { tempToken, token: otp });
        setState({ user: data, isAuthenticated: true, isLoading: false });
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setState({ user: null, isAuthenticated: false, isLoading: false });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, verifyOtp, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
