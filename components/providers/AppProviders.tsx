"use client";
import React, { useState } from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { SettingsProvider } from '../../context/SettingsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 💡 1. استدعاء مزود الإشعارات اللي عملناه
import { NotificationProvider } from '../../features/notifications/hooks/useNotifications';

export function AppProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, 
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SettingsProvider>
                    {/* 💡 2. تغليف المنصة بنظام الإشعارات اللحظي */}
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </SettingsProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}