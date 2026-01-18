export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'citizen' | 'company' | 'admin';
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
