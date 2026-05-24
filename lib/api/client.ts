// FILE: lib/api/client.ts
// Global Fetch Client for API requests

const BASE_URL = 'http://localhost:5290/api';

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...customOptions } = options;

    // 1. Build Query Parameters
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const url = `${BASE_URL}${endpoint}${queryString}`;

    // 2. Extract Token from Cookies
    let token = '';
    if (typeof window !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )pixel_auth=([^;]+)'));
        if (match) token = match[2];
    }

    // 3. Prepare Headers
    const config: RequestInit = {
        ...customOptions,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    try {
        // 🚀 السطر ده هيفضح الرابط اللي الفرونت إند بيحاول يكلمه في الـ Console
        console.log("🚀 FETCHING URL:", url); 
        
        const response = await fetch(url, config);
        
        // Handle 204 No Content (e.g., Logout)
        if (response.status === 204) return {} as T;

        const data = await response.json().catch(() => ({}));

        // Global Error Handling
        if (!response.ok) {
            // Handle Unauthorized access
            if (response.status === 401) {
                console.error('🚨 Unauthorized - Redirecting to login...');
                if (typeof window !== 'undefined') window.location.href = '/auth';
            }

            // Extract error details from backend response
            let errorDetails = '';
            if (data.errors) {
                if (Array.isArray(data.errors)) {
                    errorDetails = data.errors.join(' | ');
                } else if (typeof data.errors === 'object') {
                    errorDetails = Object.values(data.errors).flat().join(' | ');
                }
            }

            const msg = errorDetails || data.message || data.title || 'An error occurred while connecting to the server.';
            throw new Error(msg);
        }

        // Return nested data if present, otherwise return the whole response
        return (data.data !== undefined ? data.data : data) as T;
        
    } catch (error) {
        console.error('🌐 Network/API Error:', error);
        throw error;
    }
}