// FILE: types/auth.ts

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
    token: string;
}

export interface RegisterFormData {
    fullName: string;
    phoneNumber: string;
    parentPhoneNumber: string;
    governorate: string;
    address: string;
    schoolName: string;
    password: string;
}