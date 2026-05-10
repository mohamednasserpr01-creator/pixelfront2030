// FILE: lib/api/endpoints/auth.ts
// 💡 Auth API Endpoints - Connects to PixelAcademy .NET Backend
// Backend Base: http://localhost:5000/api

import { fetchAPI } from '../client';

// ==========================================
// DTO Types (matching backend API contracts)
// ==========================================
export interface LoginRequest {
    phoneNumber: string; // 💡 تم التغيير من email لـ phoneNumber
    password: string;
}

export interface RegisterRequest {
    fullName: string;          // 💡 بدلاً من firstName و lastName
    phoneNumber: string;       // 💡 بدلاً من email
    parentPhoneNumber: string; // 💡 البيانات الجديدة اللي ضفناها
    governorate: string;
    address: string;
    schoolName: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        fullName: string;
        phoneNumber: string;
        role: string;
        isActive: boolean;
    };
}

export interface RefreshTokenRequest {
    token: string;
    refreshToken: string;
}

export interface UserDto {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

// ==========================================
// Auth API Methods
// ==========================================
export const authApi = {
    /**
     * POST /api/Auth/login
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        return fetchAPI<AuthResponse>('/Auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * POST /api/Auth/register
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        return fetchAPI<AuthResponse>('/Auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * POST /api/Auth/refresh
     */
    refresh: async (tokens: RefreshTokenRequest): Promise<AuthResponse> => {
        return fetchAPI<AuthResponse>('/Auth/refresh', {
            method: 'POST',
            body: JSON.stringify(tokens),
        });
    },

    /**
     * POST /api/Auth/logout
     */
    logout: async (): Promise<void> => {
        const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('refresh_token')
            : null;
        try {
            await fetchAPI<void>('/Auth/logout', {
                method: 'POST',
                body: JSON.stringify({ refreshToken: refreshToken || '' }),
            });
        } catch {
            // Silently fail
        }
    },

    /**
     * GET /api/Auth/me
     */
    me: async (): Promise<UserDto> => {
        return fetchAPI<UserDto>('/Auth/me', { method: 'GET' });
    },
};