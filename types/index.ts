// FILE: types/index.ts

// ==========================================
// 1. أنواع المستخدمين (User Types)
// ==========================================
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string; 
    role: UserRole;
    avatar?: string;
    token?: string;
}

// ==========================================
// 2. أنواع الكورسات (Course Types)
// ==========================================
export interface Course {
    id: string | number; // يفضل توحيدها لاحقاً لـ string
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    price: number;
    instructorId?: string;
    level?: string;
}

// ==========================================
// 3. أنواع المحاضرات ومحتوياتها (Lecture Types)
// ==========================================
export type PlaylistItemType = 'video' | 'pdf' | 'exam' | 'homework';
export type ItemStatus = 'locked' | 'available' | 'active' | 'completed';

export interface PlaylistItem {
    id: string;
    type: PlaylistItemType;
    titleAr: string;
    titleEn: string;
    status: ItemStatus;
    isReq?: boolean;       // هل هو إجباري؟
    time?: string;         // مدة الفيديو
    videoSrc?: string;     // رابط الفيديو
    poster?: string;       // صورة غلاف الفيديو
    link?: string;         // رابط الـ PDF
    questions?: number;    // عدد الأسئلة في الامتحان/الواجب
    timeLimit?: number;    // الوقت المسموح للامتحان بالدقائق
}

export interface LectureData {
    id: string;
    courseId: string | number;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    studentName: string;
    playlist: PlaylistItem[];
}

// ==========================================
// 4. أنواع العروض (Offer Types)
// ==========================================
export interface Offer {
    id: string | number;
    img: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    discountPercentage?: number;
}

// ==========================================
// 5. أنواع الامتحانات (Exam Types)
// ==========================================
export type QuestionType = 'mcq' | 'essay';

export interface Question {
    id: number;
    type: QuestionType;
    textAr: string;
    textEn: string;
    optionsAr?: string[];
    optionsEn?: string[];
    correctAns: number | string;
    explanationAr: string;
    explanationEn: string;
}

export interface Exam {
    id: string;
    titleAr: string;
    titleEn: string;
    lectureAr: string;
    lectureEn: string;
    timeLimit: number; // بالدقائق
    questions: Question[];
}

// ==========================================
// 6. أنواع الواجبات (Homework Types)
// ==========================================
export type HwQuestionType = 'mcq' | 'tf' | 'essay';

export interface HwQuestion {
    id: string;
    type: HwQuestionType;
    score: number;
    textAr: string;
    textEn: string;
    optionsAr?: string[];
    optionsEn?: string[];
    correctAns: string | number;
    reviewAr: string;
    reviewEn: string;
}

export interface Homework {
    id: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    isMandatory: boolean;
    totalScore: number;
    questions: HwQuestion[];
}
// ==========================================
// 7. أنواع الشات الذكي (Chat Types)
// ==========================================
export interface ChatMessage {
    id: string | number;
    sender: 'user' | 'bot' | 'system';
    text: string;
    time?: string;
}
// ==========================================
// 8. أنواع الخدمات (Services Types)
// ==========================================
export interface Service {
    icon: string;
    titleAr: string;
    titleEn: string;
    descAr?: string;
    descEn?: string;
    link?: string;
}
// FILE: types/store.ts

export type ProductCategory = 'books' | 'tools';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ShippingStatus = 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'returned';

export interface Product {
    id: string | number;
    title: string;
    price: number;
    stock: number;
    category: ProductCategory;
    image: string;
    status: 'متوفر' | 'غير متوفر';
    // إضافات متقدمة للمستقبل (SKU, Barcode)
    sku?: string;
    barcode?: string;
    weight?: number;
}

export interface OrderItem {
    productId: string | number;
    title: string;
    qty: number;
    price: number;
}

export interface OrderTimeline {
    status: ShippingStatus | PaymentStatus;
    date: string;
    note?: string;
}

export interface Order {
    id: string;
    studentId?: string;
    studentName: string;
    phone: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
    
    // نظام الحالات المفصول (كما طلبت)
    paymentStatus: PaymentStatus;
    shippingStatus: ShippingStatus;
    
    // 💡 حل مشكلة الخصم المزدوج من المخزن
    inventoryUpdated: boolean; 
    
    date: string;
    
    // 💡 تتبع حالة الطلب مثل أمازون
    timeline: OrderTimeline[]; 
}

// 💡 نظام حركات المخزن (Inventory Movements)
export type MovementType = 'order' | 'restock' | 'refund' | 'adjustment';

export interface InventoryMovement {
    id: string;
    productId: string | number;
    type: MovementType;
    qty: number; // (+) for restock/refund, (-) for orders
    date: string;
    note?: string;
}
// ==========================================
// 💡 Support & Appointments Types
// ==========================================
export type SpecialistType = 'male' | 'female';
export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export interface SupportSlot {
    id: string; // 💡 ربط حقيقي مع الحجز
    time: string;
    isBooked: boolean;
    appointmentId?: string; // 💡 عشان لو الحجز اتلغى، الـ Slot يفتح تاني
}

export interface SupportDay {
    id: string;
    day: string;
    date: string; // ISO format: YYYY-MM-DD
    slots: SupportSlot[];
}

export interface Appointment {
    id: string;
    studentName: string;
    phone: string;
    type: SpecialistType;
    day: string;
    date: string;
    time: string;
    slotId: string; // 💡 ربط عكسي مع الـ Slot
    status: AppointmentStatus;
}
// ==========================================
// 💡 Teacher Dashboard Types (Decoupled Architecture)
// ==========================================

export interface TeacherLesson {
    id: string;
    title: string;
    description: string;
    videos: { id: string; title: string; url: string; order: number }[];
    files: { id: string; title: string; url: string }[];
    references: { id: string; title: string; url: string }[];
    createdAt: string;
}

export interface TeacherExam {
    id: string;
    title: string;
    durationMinutes: number;
    passPercentage: number;
    showScoreToStudent: boolean;
    generateCertificate: boolean;
    questionsCount: number;
    createdAt: string;
}

export interface TeacherCourse {
    id: string;
    title: string;
    description: string;
    image: string;
    isFree: boolean;
    price: number;
    requiresShippingCodes: boolean;
    publishDate: string;
    lessonsCount: number;
    examsCount: number;
    studentsCount: number;
    createdAt: string;
}