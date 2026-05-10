// FILE: services/teacher.service.ts

export interface TeacherCourse {
    id: number;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string; // 💡 الحقل اللي كان ناقص وعامل المشكلة
    img: string;
}

export interface TeacherProfileData {
    id: string;
    nameAr: string;
    nameEn: string;
    subjectAr: string;
    subjectEn: string;
    bioAr: string;
    bioEn: string;
    img: string;
    phone: string;
    socials: {
        whatsapp?: string;
        facebook?: string;
        instagram?: string;
        tiktok?: string;
    };
    courses: TeacherCourse[];
}

export const teacherService = {
    getTeacherProfile: async (id: string): Promise<TeacherProfileData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id,
                    nameAr: "أ. محمد ناصر", nameEn: "Mr. Mohamed Nasser",
                    subjectAr: "التسويق الرقمي", subjectEn: "Digital Marketing",
                    bioAr: "مؤسس شركة Nasour Media. خبير في التسويق الرقمي، إدارة منصات التواصل الاجتماعي، وبناء الخطط التسويقية الاحترافية للشركات والأفراد.",
                    bioEn: "Founder of Nasour Media. Expert in digital marketing, social media management, and building professional marketing plans.",
                    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400", phone: "01033259951",
                    socials: { whatsapp: "https://wa.me/201221466441", facebook: "https://facebook.com/NasourMedia/", instagram: "https://instagram.com/nasourr__media/", tiktok: "https://tiktok.com/@nasourmedia" },
                    courses: [
                        // 💡 تم إضافة descEn لجميع الكورسات لحل الإيرور
                        { id: 109, titleAr: "خطة تسويقية متكاملة", titleEn: "Marketing Plan", descAr: "دراسة حالة عملية للشركات.", descEn: "Practical case study for companies.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
                        { id: 108, titleAr: "إعلانات الممول المتقدمة", titleEn: "Advanced Ads", descAr: "احتراف الاستهداف والحملات.", descEn: "Mastering targeting and campaigns.", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
                        { id: 107, titleAr: "أساسيات التسويق 7", titleEn: "Marketing Basics 7", descAr: "مقدمة شاملة 7", descEn: "Comprehensive intro 7", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
                        { id: 106, titleAr: "أساسيات التسويق 6", titleEn: "Marketing Basics 6", descAr: "مقدمة شاملة 6", descEn: "Comprehensive intro 6", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
                        { id: 105, titleAr: "أساسيات التسويق 5", titleEn: "Marketing Basics 5", descAr: "مقدمة شاملة 5", descEn: "Comprehensive intro 5", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400" },
                        { id: 104, titleAr: "أساسيات التسويق 4", titleEn: "Marketing Basics 4", descAr: "مقدمة شاملة 4", descEn: "Comprehensive intro 4", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
                        { id: 103, titleAr: "أساسيات التسويق 3", titleEn: "Marketing Basics 3", descAr: "مقدمة شاملة 3", descEn: "Comprehensive intro 3", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" },
                        { id: 102, titleAr: "أساسيات التسويق 2", titleEn: "Marketing Basics 2", descAr: "مقدمة شاملة 2", descEn: "Comprehensive intro 2", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" },
                        { id: 101, titleAr: "أساسيات التسويق 1", titleEn: "Marketing Basics 1", descAr: "مقدمة شاملة 1", descEn: "Comprehensive intro 1", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400" }
                    ]
                });
            }, 500);
        });
    }
};