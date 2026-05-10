// FILE: features/teacherCourses/types.ts

// ==========================================
// 1. أنواع المحتوى المسموح إضافته (الخلاط)
// ==========================================
export type ContentType = 'lesson' | 'homework_lesson' | 'homework' | 'exam';

// ==========================================
// 2. نظام الشروط المرنة (Unlock Rules)
// ==========================================
export type RuleType = 'exam_score' | 'watch_percent' | 'homework_submitted';

export interface UnlockRule {
    id: string;          // ID فريد للشرط
    type: RuleType;      // نوع الشرط (درجة امتحان، نسبة مشاهدة، الخ)
    targetId: string;    // ID الحصة أو الامتحان المرتبط بالشرط
    value: number;       // القيمة المطلوبة (مثلاً 50 للنجاح في الامتحان، أو 75 لنسبة المشاهدة)
}

// ==========================================
// 3. عنصر المحتوى (Reference Item) - التعديل العبقري
// ==========================================
export interface ContentItem {
    id: string;          // ID فريد للعنصر جوه الكورس ده
    lectureId: string;   // تبع أي محاضرة
    type: ContentType;   // نوعه إيه (حصة، امتحان، إلخ)
    referenceId: string; // 💡 ده الـ ID بتاع الحصة الأصلية (عشان منكررش الداتا)
    order: number;       // الترتيب (لـ Drag & Drop)
    unlockRules: UnlockRule[]; // مصفوفة الشروط (عشان تفتح العنصر ده)
}

// ==========================================
// 4. المحاضرة (Lecture) - القابلة للبيع منفصلة
// ==========================================
export interface Lecture {
    id: string;
    courseId: string;
    title: string;       // اسم المحاضرة (مثال: الباب الأول - الكهربية)
    description: string;
    price: number;       // 💡 السعر المنفصل للمحاضرة
    order: number;       // ترتيب المحاضرة جوه الكورس
    items: ContentItem[];// المحتوى اللي جوه المحاضرة (حصص، امتحانات...)
}

// ==========================================
// 5. الكورس الأساسي (Course) - المظلة الكبيرة
// ==========================================
export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    stage: string;       // الصف الدراسي
    price: number;       // السعر الإجمالي للكورس كله
    isFree: boolean;     // هل الكورس مجاني؟
    lectures: Lecture[]; // المحاضرات اللي جواه
    
    // 💡 الـ Versioning & Soft Delete (عشان نحمي الطلاب اللي اشتروا)
    status: 'draft' | 'published' | 'archived'; 
    createdAt: string;
    updatedAt: string;
}