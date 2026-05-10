// FILE: data/courses.ts
import { Course } from '../types';

export const coursesData: Course[] = [
    { 
        id: 1, 
        img: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=400", 
        titleAr: "اللغة العربية", 
        titleEn: "Arabic", 
        descAr: "شرح تفصيلي ومراجعات", 
        descEn: "Detailed explanation",
        price: 500 // 💡 ضفنا السعر هنا
    },
    { 
        id: 2, 
        img: "https://images.unsplash.com/photo-1636466484202-cae263f0ce2e?w=400", 
        titleAr: "الفيزياء الحديثة", 
        titleEn: "Physics", 
        descAr: "تجارب عملية ونظريات", 
        descEn: "Practical experiments",
        price: 450 // 💡 ضفنا السعر هنا
    },
    { 
        id: 3, 
        img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400", 
        titleAr: "الرياضيات البحتة", 
        titleEn: "Mathematics", 
        descAr: "تمارين وبنك أسئلة", 
        descEn: "Exercises and questions",
        price: 400 // 💡 ضفنا السعر هنا
    },
    { 
        id: 4, 
        img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400", 
        titleAr: "الكيمياء العضوية", 
        titleEn: "Chemistry", 
        descAr: "معادلات وتطبيقات", 
        descEn: "Equations and applications",
        price: 350 // 💡 ضفنا السعر هنا
    }
];