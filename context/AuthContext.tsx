"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

// ==========================================
// Context Types (must stay compatible with existing UI)
// ==========================================
interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    checkRole: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ── Initialise auth state on mount ──────────────────────
    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!authService.hasSession()) {
                setIsLoading(false);
                return;
            }
            try {
                const svcUser = await authService.me();
                if (!cancelled && svcUser) {
                    setUser(svcUser);
                    setIsLoggedIn(true);
                }
            } catch {
                // Token invalid – try refresh
                try {
                    const refreshed = await authService.refresh();
                    if (!cancelled && refreshed) {
                        setUser(refreshed);
                        setIsLoggedIn(true);
                    }
                } catch {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    // ── Login ───────────────────────────────────────────────
    const login = useCallback(async (email: string, pass: string) => {
        const svcUser = await authService.login(email, pass);
        setUser(svcUser);
        setIsLoggedIn(true);
    }, []);

    // ── Logout (sync signature for UI compatibility) ────────
    const logout = useCallback(() => {
        // Fire-and-forget: clear UI state immediately
        authService.logout().catch(() => {});
        setUser(null);
        setIsLoggedIn(false);
    }, []);

    // ── Role check ──────────────────────────────────────────
    const checkRole = useCallback((allowedRoles: string[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, checkRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
