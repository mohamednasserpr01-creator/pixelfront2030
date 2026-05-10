// FILE: services/authService.ts
import { authApi } from '../lib/api/endpoints/auth';
import type { AuthResponse } from '../lib/api/endpoints/auth';
import type { User, RegisterFormData } from '../types/auth';

const TOKEN_KEY = 'pixel_auth';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'pixel_user';

// ==========================================
// Cookie Helpers
// ==========================================
function setTokenCookie(token: string, maxAge: number = 86400): void {
    if (typeof window === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
}

function clearTokenCookie(): void {
    if (typeof window === 'undefined') return;
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
}

function setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_KEY, token);
}

function clearRefreshToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(REFRESH_KEY);
}

function storeUser(user: AuthResponse['user']): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getStoredUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
}

function clearStoredUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
}

// ==========================================
// Mapper: Backend DTO → Frontend User
// ==========================================
function mapToUser(authResponse: any): User {
    const { user, token } = authResponse;
    
    // 💡 التعديل السحري: تأمين الـ Role وتحويله لنص إجبارياً عشان ميضربش إيرور toLowerCase
    const safeRole = user && user.role ? String(user.role).toLowerCase() : 'student';

    return {
        id: user?.id || '',
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        role: safeRole as 'student' | 'teacher' | 'admin',
        token: token || '',
    };
}

// ==========================================
// Auth Service
// ==========================================
export const authService = {
    login: async (phoneNumber: string, pass: string): Promise<User> => {
        // Updated to send phoneNumber instead of email
        const response = await authApi.login({ phoneNumber, password: pass });
        setTokenCookie(response.token);
        setRefreshToken(response.refreshToken);
        storeUser(response.user);
        return mapToUser(response);
    },

    register: async (userData: RegisterFormData): Promise<User> => {
        const response = await authApi.register(userData);
        setTokenCookie(response.token);
        setRefreshToken(response.refreshToken);
        storeUser(response.user);
        return mapToUser(response);
    },

    logout: async (): Promise<void> => {
        try {
            await authApi.logout();
        } catch {
            // Backend logout failed, still clear local state
        } finally {
            clearTokenCookie();
            clearRefreshToken();
            clearStoredUser();
        }
    },

    refresh: async (): Promise<User | null> => {
        const refreshToken = getRefreshToken();
        const accessToken = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'))?.[2];

        if (!refreshToken || !accessToken) return null;

        try {
            const response = await authApi.refresh({
                token: accessToken,
                refreshToken: refreshToken,
            });
            setTokenCookie(response.token);
            setRefreshToken(response.refreshToken);
            storeUser(response.user);
            return mapToUser(response);
        } catch {
            clearTokenCookie();
            clearRefreshToken();
            clearStoredUser();
            return null;
        }
    },

    me: async (): Promise<User | null> => {
        try {
            const user = await authApi.me();
            storeUser(user);
            const token = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'))?.[2] || '';
            return mapToUser({ user, token });
        } catch {
            return null;
        }
    },

    getStoredUser: (): User | null => {
        const user = getStoredUser();
        if (!user) return null;
        const token = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'))?.[2] || '';
        return mapToUser({ user, token });
    },

    hasSession: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'));
    },
};