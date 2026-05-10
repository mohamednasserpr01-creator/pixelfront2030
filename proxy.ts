// FILE: proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 💡 سر التشفير (يجب أن يكون مطابقاً للـ Secret الموجود في الـ Backend)
const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'pixel_academy_super_secret_key_2026'
);

// 💡 غيرنا اسم الدالة هنا لـ proxy حسب التحديث الجديد لـ Next.js 16
export async function proxy(request: NextRequest) {
    const token = request.cookies.get('pixel_auth')?.value;
    const { pathname } = request.nextUrl;

    // 💡 المسارات المحمية اللي ممنوع حد يدخلها من غير توكن سليم
    const isProtectedRoute = 
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/exam') || 
        pathname.startsWith('/homework') || 
        pathname.includes('/lecture');

    // 💡 صفحة تسجيل الدخول والإنشاء
    const isAuthRoute = pathname.startsWith('/auth');

    // 1. التعامل مع المسارات المحمية
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth', request.url));
        }

        try {
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.next(); 
        } catch (error) {
            console.error('🚨 [Proxy] Invalid Token Detected:', error);
            const response = NextResponse.redirect(new URL('/auth', request.url));
            response.cookies.delete('pixel_auth'); 
            return response;
        }
    }

    // 2. التعامل مع صفحة تسجيل الدخول
    if (isAuthRoute && token) {
        try {
            await jwtVerify(token, SECRET_KEY);
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (error) {
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

// 💡 تحديد المسارات اللي الـ Proxy هيراقبها
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/exam/:path*',
        '/homework/:path*',
        '/courses/:path*',
        '/auth/:path*'
    ],
};